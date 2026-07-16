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
