import "server-only";
import { db, sql } from "@vercel/postgres";
import type { EventItem, Tier } from "./data";

export { sql };

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

// Fetch tiers for a set of event ids and group them by event.
async function tiersByEvent(
  eventIds: string[]
): Promise<Record<string, TierRow[]>> {
  if (eventIds.length === 0) return {};
  const { rows } = await sql.query<TierRow>(
    "select * from ticket_tiers where event_id = ANY($1::uuid[]) order by sort asc",
    [eventIds]
  );
  const grouped: Record<string, TierRow[]> = {};
  for (const t of rows) (grouped[t.event_id] ??= []).push(t);
  return grouped;
}

// ----- Public queries -----

/** On-sale events (for the "This week" cards), earliest first. */
export async function getOnsaleEvents(): Promise<EventItem[]> {
  const { rows } = await sql<EventRow>`
    select * from events
    where status = 'onsale'
    order by starts_at asc nulls last, created_at asc
  `;
  const tiers = await tiersByEvent(rows.map((r) => r.id));
  return rows.map((r) => mapEvent(r, tiers[r.id] ?? []));
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
  const tiers = await tiersByEvent([row.id]);
  return mapEvent(row, tiers[row.id] ?? []);
}

/** A single event by slug, with its tiers (for the detail page & drawer). */
export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const { rows } = await sql<EventRow>`
    select * from events where slug = ${slug} limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  const tiers = await tiersByEvent([row.id]);
  return mapEvent(row, tiers[row.id] ?? []);
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

// ----- Mutations -----
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

/** Create a `pending` order + its items in a single transaction. Returns the order id. */
export async function createOrder(order: NewOrder): Promise<string> {
  const client = await db.connect();
  try {
    await client.query("begin");
    const { rows } = await client.query<{ id: string }>(
      `insert into orders (event_id, customer_name, email, phone, amount_fen, status, provider)
       values ($1, $2, $3, $4, $5, 'pending', $6)
       returning id`,
      [
        order.eventId,
        order.customer.name,
        order.customer.email ?? null,
        order.customer.phone ?? null,
        order.amountFen,
        order.provider,
      ]
    );
    const orderId = rows[0].id;
    for (const item of order.items) {
      await client.query(
        `insert into order_items (order_id, tier_id, qty, unit_price_fen)
         values ($1, $2, $3, $4)`,
        [orderId, item.tierId, item.qty, item.unitPriceFen]
      );
    }
    await client.query("commit");
    return orderId;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
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
 * idempotently (the `status = 'pending'` guard means a replayed callback won't
 * double-count sales). Returns true if this call is the one that flipped it.
 */
export async function markOrderPaid(
  orderId: string,
  providerRef: string
): Promise<boolean> {
  const client = await db.connect();
  try {
    await client.query("begin");
    const { rows } = await client.query<{ id: string }>(
      `update orders
         set status = 'paid', provider_ref = coalesce($2, provider_ref), paid_at = now()
       where id = $1 and status = 'pending'
       returning id`,
      [orderId, providerRef]
    );
    const flipped = rows.length > 0;
    if (flipped) {
      await client.query(
        `update ticket_tiers t
           set sold = t.sold + oi.qty
         from order_items oi
         where oi.order_id = $1 and oi.tier_id = t.id`,
        [orderId]
      );
    }
    await client.query("commit");
    return flipped;
  } catch (err) {
    await client.query("rollback");
    throw err;
  } finally {
    client.release();
  }
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
  const { rows } = await sql`
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

  return { ...(row as Omit<OrderView, "items">), items };
}
