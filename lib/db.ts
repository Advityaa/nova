import "server-only";
import { randomUUID } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { EventItem, Tier } from "./data";

// ---- Neon connection (lazy) ----
// Neon's Vercel Marketplace integration sets DATABASE_URL. We also accept the
// legacy POSTGRES_URL for back-compat. The client is created lazily so that
// importing this module during `next build` never throws when env is unset.
function connectionString(): string {
  const cs =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!cs) {
    throw new Error(
      "No database connection string. Set DATABASE_URL (Neon) in your environment."
    );
  }
  return cs;
}

let _neon: NeonQueryFunction<false, true> | null = null;
function neonClient(): NeonQueryFunction<false, true> {
  if (!_neon) _neon = neon(connectionString(), { fullResults: true });
  return _neon;
}

/**
 * Tagged-template query returning `{ rows }` (like the old @vercel/postgres
 * `sql`), so call sites are unchanged: `const { rows } = await sql<T>`…``.
 */
export function sql<T = Record<string, unknown>>(
  strings: TemplateStringsArray,
  ...params: unknown[]
): Promise<{ rows: T[] }> {
  return neonClient()(strings, ...params) as unknown as Promise<{ rows: T[] }>;
}

// ----- Raw row shapes -----
type EventRow = {
  id: string;
  slug: string;
  name: string;
  type: string;
  color: string;
  accent_ink: string;
  lineup: string | null;
  venue: string | null;
  area: string | null;
  address: string | null;
  weekday: string | null;
  starts_at: string | null;
  doors: string | null;
  status: string;
  status_label: string | null;
  hero_image: string | null;
  description: string | null;
  featured: boolean;
};

type TierRow = {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price_fen: number;
  capacity: number | null;
  sold: number;
  sort: number;
};

// ----- Formatting helpers -----
// The UI shows dates as DD.MM. We derive this from starts_at, formatting in UTC
// so the wall-clock we seed is exactly what renders (no timezone drift).
export function formatDDMM(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const mon = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}.${mon}`;
}

// fen (integer RMB cents) -> whole-yuan number used by the ¥{p} UI.
export function fenToYuan(fen: number): number {
  return Math.round(fen) / 100;
}

function mapTier(row: TierRow): Tier {
  return {
    id: row.id,
    n: row.name,
    d: row.description ?? "",
    p: fenToYuan(row.price_fen),
  };
}

function mapEvent(row: EventRow, tiers: TierRow[]): EventItem {
  return {
    id: row.slug, // components key/lookup events by slug
    name: row.name,
    type: row.type,
    color: row.color,
    ink: row.accent_ink,
    lineup: row.lineup ?? "",
    weekday: row.weekday ?? "",
    date: formatDDMM(row.starts_at),
    time: row.doors ?? "",
    venue: row.venue ?? "",
    area: row.area ?? "",
    address: row.address ?? undefined,
    img: row.hero_image ?? "",
    status: row.status_label ?? "",
    desc: row.description ?? "",
    tiers: tiers
      .slice()
      .sort((a, b) => a.sort - b.sort)
      .map(mapTier),
  };
}

/** Tiers for a single event (by id), in display order. */
async function tiersFor(eventId: string): Promise<TierRow[]> {
  const { rows } = await sql<TierRow>`
    select * from ticket_tiers where event_id = ${eventId} order by sort asc
  `;
  return rows;
}

// ----- Public queries -----

/** On-sale events (for the "This week" cards), earliest first. */
export async function getOnsaleEvents(): Promise<EventItem[]> {
  const { rows } = await sql<EventRow>`
    select * from events
    where status = 'onsale'
    order by starts_at asc nulls last, created_at asc
  `;
  return Promise.all(rows.map(async (r) => mapEvent(r, await tiersFor(r.id))));
}

/** The featured event for the hero (falls back to the first on-sale event). */
export async function getFeaturedEvent(): Promise<EventItem | null> {
  const { rows } = await sql<EventRow>`
    select * from events
    order by featured desc, starts_at asc nulls last
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return mapEvent(row, await tiersFor(row.id));
}

/** A single event by slug, with its tiers (for the detail page & drawer). */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const { rows } = await sql<EventRow>`
    select * from events where slug = ${slug} limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return mapEvent(row, await tiersFor(row.id));
}

/** All event slugs (useful for sitemaps / static params later). */
export async function getAllEventSlugs(): Promise<string[]> {
  const { rows } = await sql<{ slug: string }>`select slug from events`;
  return rows.map((r) => r.slug);
}

/** Gallery image URLs, in display order. */
export async function getGalleryImages(): Promise<string[]> {
  const { rows } = await sql<{ url: string }>`
    select url from gallery_images order by sort asc, created_at asc
  `;
  return rows.map((r) => r.url);
}

// ----- Enquiries -----
export type EnquiryInput = {
  name: string;
  company?: string;
  contact: string;
  eventType?: string;
  message?: string;
};

/** Insert a contact-form enquiry. */
export async function insertEnquiry(input: EnquiryInput): Promise<void> {
  await sql`
    insert into enquiries (name, company, contact, event_type, message)
    values (
      ${input.name},
      ${input.company ?? null},
      ${input.contact},
      ${input.eventType ?? null},
      ${input.message ?? null}
    )
  `;
}

// ============================================================
// Users / auth
// ============================================================

export type UserRole = "owner" | "admin";

export type UserRecord = {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  name: string | null;
};

/** Look up an admin user by email (case-insensitive). */
export async function getUserByEmail(
  email: string
): Promise<UserRecord | null> {
  const { rows } = await sql<UserRecord>`
    select id, email, password_hash, role, name
    from users
    where lower(email) = lower(${email})
    limit 1
  `;
  return rows[0] ?? null;
}

// ============================================================
// Orders / checkout
// ============================================================

export type CheckoutTier = {
  id: string;
  name: string;
  price_fen: number;
};

/** Event id + authoritative tier prices for a slug (used to price checkouts server-side). */
export async function getEventForCheckout(
  slug: string
): Promise<{ eventId: string; tiers: Record<string, CheckoutTier> } | null> {
  const { rows } = await sql<{ id: string }>`
    select id from events where slug = ${slug} limit 1
  `;
  const eventId = rows[0]?.id;
  if (!eventId) return null;

  const { rows: tierRows } = await sql<CheckoutTier>`
    select id, name, price_fen from ticket_tiers where event_id = ${eventId}
  `;
  const tiers: Record<string, CheckoutTier> = {};
  for (const t of tierRows) tiers[t.id] = t;
  return { eventId, tiers };
}

export type NewOrder = {
  eventId: string;
  provider: string;
  customer: { name: string; email?: string; phone?: string };
  amountFen: number;
  items: { tierId: string; qty: number; unitPriceFen: number }[];
};

/**
 * Create a `pending` order + its items atomically. We pre-generate the order id
 * so all inserts can run in a single Neon HTTP transaction (no interleaved
 * round-trips, no WebSocket).
 */
export async function createOrder(order: NewOrder): Promise<string> {
  const orderId = randomUUID();
  const client = neonClient();
  const queries = [
    client`
      insert into orders (id, event_id, customer_name, email, phone, amount_fen, status, provider)
      values (${orderId}, ${order.eventId}, ${order.customer.name},
              ${order.customer.email ?? null}, ${order.customer.phone ?? null},
              ${order.amountFen}, 'pending', ${order.provider})
    `,
    ...order.items.map(
      (item) => client`
        insert into order_items (order_id, tier_id, qty, unit_price_fen)
        values (${orderId}, ${item.tierId}, ${item.qty}, ${item.unitPriceFen})
      `
    ),
  ];
  await client.transaction(queries);
  return orderId;
}

/** Store the provider reference returned by createCheckout. */
export async function setOrderProviderRef(
  orderId: string,
  providerRef: string
): Promise<void> {
  await sql`update orders set provider_ref = ${providerRef} where id = ${orderId}`;
}

/**
 * Mark an order paid and increment `sold` on its tiers — atomically and
 * idempotently in ONE statement. The `paid` CTE flips the order only when it's
 * still `pending`; the `bump` CTE increments `sold` only for that freshly-paid
 * order. A replayed callback flips 0 rows → no double-counting. Returns true if
 * this call is the one that marked it paid.
 */
export async function markOrderPaid(
  orderId: string,
  providerRef: string
): Promise<boolean> {
  const { rows } = await sql<{ flipped: number }>`
    with paid as (
      update orders
         set status = 'paid',
             provider_ref = coalesce(${providerRef}, provider_ref),
             paid_at = now()
       where id = ${orderId} and status = 'pending'
       returning id
    ),
    bump as (
      update ticket_tiers t
         set sold = t.sold + oi.qty
        from order_items oi
       where oi.order_id in (select id from paid) and oi.tier_id = t.id
       returning 1
    )
    select (select count(*) from paid)::int as flipped
  `;
  return (rows[0]?.flipped ?? 0) > 0;
}

export type OrderView = {
  id: string;
  status: "pending" | "paid" | "failed";
  amount_fen: number;
  customer_name: string;
  email: string | null;
  phone: string | null;
  provider: string;
  provider_ref: string | null;
  created_at: string;
  paid_at: string | null;
  event_name: string | null;
  event_slug: string | null;
  event_type: string | null;
  event_color: string | null;
  event_ink: string | null;
  event_venue: string | null;
  event_area: string | null;
  event_weekday: string | null;
  event_starts_at: string | null;
  event_doors: string | null;
  items: { tier_name: string; qty: number; unit_price_fen: number }[];
};

/** Full order (with items + event fields) for the confirmation page. */
export async function getOrder(orderId: string): Promise<OrderView | null> {
  const { rows } = await sql<Omit<OrderView, "items">>`
    select o.id, o.status, o.amount_fen, o.customer_name, o.email, o.phone,
           o.provider, o.provider_ref, o.created_at, o.paid_at,
           e.name as event_name, e.slug as event_slug, e.type as event_type,
           e.color as event_color, e.accent_ink as event_ink,
           e.venue as event_venue, e.area as event_area, e.weekday as event_weekday,
           e.starts_at as event_starts_at, e.doors as event_doors
    from orders o
    left join events e on e.id = o.event_id
    where o.id = ${orderId}
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;

  const { rows: items } = await sql<{
    tier_name: string;
    qty: number;
    unit_price_fen: number;
  }>`
    select coalesce(t.name, 'Ticket') as tier_name, oi.qty, oi.unit_price_fen
    from order_items oi
    left join ticket_tiers t on t.id = oi.tier_id
    where oi.order_id = ${orderId}
    order by t.sort asc nulls last
  `;

  return { ...row, items };
}

// ============================================================
// ADMIN — writes & management queries
// ============================================================

export type AdminEvent = {
  id: string;
  slug: string;
  name: string;
  type: string;
  color: string;
  accent_ink: string;
  lineup: string | null;
  venue: string | null;
  area: string | null;
  address: string | null;
  weekday: string | null;
  starts_at: string | null;
  doors: string | null;
  status: string;
  status_label: string | null;
  hero_image: string | null;
  description: string | null;
  featured: boolean;
};

export type AdminEventListItem = AdminEvent & {
  tier_count: number;
  sold_total: number;
};

export type AdminTier = {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price_fen: number;
  capacity: number | null;
  sold: number;
  sort: number;
};

export type EventInput = {
  slug: string;
  name: string;
  type: string;
  color: string;
  accent_ink: string;
  lineup: string | null;
  venue: string | null;
  area: string | null;
  address: string | null;
  weekday: string | null;
  starts_at: string | null;
  doors: string | null;
  status: string;
  status_label: string | null;
  hero_image: string | null;
  description: string | null;
  featured: boolean;
};

export type TierInput = {
  name: string;
  description: string | null;
  price_fen: number;
  capacity: number | null;
  sort: number;
};

// ---- Events ----
export async function listEventsAdmin(): Promise<AdminEventListItem[]> {
  const { rows } = await sql<AdminEventListItem>`
    select e.*,
      (select count(*) from ticket_tiers t where t.event_id = e.id)::int as tier_count,
      (select coalesce(sum(t.sold),0) from ticket_tiers t where t.event_id = e.id)::int as sold_total
    from events e
    order by e.starts_at asc nulls last, e.created_at asc
  `;
  return rows;
}

export async function getEventByIdAdmin(
  id: string
): Promise<{ event: AdminEvent; tiers: AdminTier[] } | null> {
  const { rows } = await sql<AdminEvent>`select * from events where id = ${id} limit 1`;
  const event = rows[0];
  if (!event) return null;
  const { rows: tiers } = await sql<AdminTier>`
    select * from ticket_tiers where event_id = ${id} order by sort asc, name asc
  `;
  return { event, tiers };
}

async function clearFeaturedIfNeeded(featured: boolean) {
  if (featured) await sql`update events set featured = false where featured = true`;
}

export async function createEventAdmin(input: EventInput): Promise<string> {
  await clearFeaturedIfNeeded(input.featured);
  const { rows } = await sql<{ id: string }>`
    insert into events (
      slug, name, type, color, accent_ink, lineup, venue, area, address,
      weekday, starts_at, doors, status, status_label, hero_image,
      description, featured
    ) values (
      ${input.slug}, ${input.name}, ${input.type}, ${input.color}, ${input.accent_ink},
      ${input.lineup}, ${input.venue}, ${input.area}, ${input.address}, ${input.weekday},
      ${input.starts_at}, ${input.doors}, ${input.status}, ${input.status_label},
      ${input.hero_image}, ${input.description}, ${input.featured}
    )
    returning id
  `;
  return rows[0].id;
}

export async function updateEventAdmin(
  id: string,
  input: EventInput
): Promise<void> {
  if (input.featured) {
    await sql`update events set featured = false where featured = true and id <> ${id}`;
  }
  await sql`
    update events set
      slug = ${input.slug}, name = ${input.name}, type = ${input.type},
      color = ${input.color}, accent_ink = ${input.accent_ink}, lineup = ${input.lineup},
      venue = ${input.venue}, area = ${input.area}, address = ${input.address},
      weekday = ${input.weekday}, starts_at = ${input.starts_at}, doors = ${input.doors},
      status = ${input.status}, status_label = ${input.status_label},
      hero_image = ${input.hero_image}, description = ${input.description},
      featured = ${input.featured}
    where id = ${id}
  `;
}

export async function deleteEventAdmin(id: string): Promise<void> {
  await sql`delete from events where id = ${id}`; // tiers cascade; orders keep (event_id -> null)
}

// ---- Tiers ----
export async function addTierAdmin(
  eventId: string,
  input: TierInput
): Promise<void> {
  await sql`
    insert into ticket_tiers (event_id, name, description, price_fen, capacity, sort)
    values (${eventId}, ${input.name}, ${input.description}, ${input.price_fen}, ${input.capacity}, ${input.sort})
  `;
}

export async function updateTierAdmin(
  tierId: string,
  input: TierInput
): Promise<void> {
  await sql`
    update ticket_tiers set
      name = ${input.name}, description = ${input.description},
      price_fen = ${input.price_fen}, capacity = ${input.capacity}, sort = ${input.sort}
    where id = ${tierId}
  `;
}

export async function deleteTierAdmin(tierId: string): Promise<void> {
  await sql`delete from ticket_tiers where id = ${tierId}`;
}

// ---- Gallery ----
export type AdminGalleryImage = {
  id: string;
  url: string;
  caption: string | null;
  sort: number;
};

export async function listGalleryAdmin(): Promise<AdminGalleryImage[]> {
  const { rows } = await sql<AdminGalleryImage>`
    select id, url, caption, sort from gallery_images order by sort asc, created_at asc
  `;
  return rows;
}

export async function addGalleryImageAdmin(
  url: string,
  caption: string | null,
  sort: number
): Promise<void> {
  await sql`insert into gallery_images (url, caption, sort) values (${url}, ${caption}, ${sort})`;
}

export async function updateGalleryImageAdmin(
  id: string,
  caption: string | null,
  sort: number
): Promise<void> {
  await sql`update gallery_images set caption = ${caption}, sort = ${sort} where id = ${id}`;
}

export async function deleteGalleryImageAdmin(id: string): Promise<void> {
  await sql`delete from gallery_images where id = ${id}`;
}

// ---- Enquiries ----
export type AdminEnquiry = {
  id: string;
  name: string;
  company: string | null;
  contact: string;
  event_type: string | null;
  message: string | null;
  handled: boolean;
  created_at: string;
};

export async function listEnquiriesAdmin(): Promise<AdminEnquiry[]> {
  const { rows } = await sql<AdminEnquiry>`
    select id, name, company, contact, event_type, message, handled, created_at
    from enquiries order by created_at desc
  `;
  return rows;
}

export async function setEnquiryHandledAdmin(
  id: string,
  handled: boolean
): Promise<void> {
  await sql`update enquiries set handled = ${handled} where id = ${id}`;
}

// ---- Orders ----
export type AdminOrder = {
  id: string;
  status: string;
  amount_fen: number;
  customer_name: string;
  email: string | null;
  provider: string;
  created_at: string;
  paid_at: string | null;
  event_name: string | null;
  item_count: number;
};

export async function listOrdersAdmin(): Promise<AdminOrder[]> {
  const { rows } = await sql<AdminOrder>`
    select o.id, o.status, o.amount_fen, o.customer_name, o.email, o.provider,
           o.created_at, o.paid_at, e.name as event_name,
           (select coalesce(sum(oi.qty),0) from order_items oi where oi.order_id = o.id)::int as item_count
    from orders o
    left join events e on e.id = o.event_id
    order by o.created_at desc
  `;
  return rows;
}

// ---- Users (team) ----
export type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  created_at: string;
};

export async function listUsersAdmin(): Promise<AdminUser[]> {
  const { rows } = await sql<AdminUser>`
    select id, email, role, name, created_at from users order by created_at asc
  `;
  return rows;
}

export async function createUserAdmin(
  email: string,
  passwordHash: string,
  role: UserRole,
  name: string | null
): Promise<void> {
  await sql`
    insert into users (email, password_hash, role, name)
    values (${email.toLowerCase().trim()}, ${passwordHash}, ${role}, ${name})
  `;
}

export async function updateUserPasswordAdmin(
  id: string,
  passwordHash: string
): Promise<void> {
  await sql`update users set password_hash = ${passwordHash} where id = ${id}`;
}

export async function deleteUserAdmin(id: string): Promise<void> {
  await sql`delete from users where id = ${id}`;
}

export async function countOwners(): Promise<number> {
  const { rows } = await sql<{ n: number }>`select count(*)::int as n from users where role = 'owner'`;
  return rows[0]?.n ?? 0;
}
