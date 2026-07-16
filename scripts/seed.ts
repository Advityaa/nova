/**
 * Seeds events, ticket tiers and gallery images so the site looks exactly like
 * the nova.html prototype after switching to the database.
 * Usage: npm run db:seed   (run db:migrate first)
 */
import { sql } from "./db-client";
import { EVENTS, GALLERY_IMAGES } from "../lib/data";

// Per-event fields that aren't part of the display view-model in lib/data.ts:
// real start datetime, lifecycle status, featured flag, street address.
// starts_at is stored as UTC wall-clock so the derived DD.MM matches nova.html.
const SEED_META: Record<
  string,
  { starts_at: string; status: string; featured: boolean; address: string | null }
> = {
  blacklist: {
    starts_at: "2026-07-17T20:00:00Z",
    status: "onsale",
    featured: false,
    address: null,
  },
  mass: {
    starts_at: "2026-07-18T23:00:00Z",
    status: "onsale",
    featured: true,
    address: "138 Middle Huaihai Rd",
  },
  pool: {
    starts_at: "2026-07-20T14:00:00Z",
    status: "onsale",
    featured: false,
    address: null,
  },
  warehouse: {
    starts_at: "2026-07-24T22:00:00Z",
    status: "onsale",
    featured: false,
    address: null,
  },
};

async function main() {
  console.log("Clearing existing seed data…");
  await sql`truncate table events restart identity cascade`; // cascades to ticket_tiers
  await sql`truncate table gallery_images restart identity cascade`;

  console.log(`Seeding ${EVENTS.length} events…`);
  for (const e of EVENTS) {
    const meta = SEED_META[e.id];
    if (!meta) throw new Error(`Missing SEED_META for event "${e.id}"`);

    const res = await sql`
      insert into events (
        slug, name, type, color, accent_ink, lineup, venue, area, address,
        weekday, starts_at, doors, status, status_label, hero_image,
        description, featured
      ) values (
        ${e.id}, ${e.name}, ${e.type}, ${e.color}, ${e.ink}, ${e.lineup},
        ${e.venue}, ${e.area}, ${meta.address}, ${e.weekday}, ${meta.starts_at},
        ${e.time}, ${meta.status}, ${e.status}, ${e.img}, ${e.desc},
        ${meta.featured}
      )
      returning id
    `;
    const eventId = (res.rows[0] as { id: string }).id;

    for (let i = 0; i < e.tiers.length; i++) {
      const t = e.tiers[i];
      await sql`
        insert into ticket_tiers (event_id, name, description, price_fen, sort)
        values (${eventId}, ${t.n}, ${t.d}, ${Math.round(t.p * 100)}, ${i})
      `;
    }
    console.log(`  ✓ ${e.name} (${e.tiers.length} tiers)`);
  }

  console.log(`Seeding ${GALLERY_IMAGES.length} gallery images…`);
  for (let i = 0; i < GALLERY_IMAGES.length; i++) {
    await sql`
      insert into gallery_images (url, caption, sort)
      values (${GALLERY_IMAGES[i]}, ${"Nova gallery"}, ${i})
    `;
  }

  console.log("✓ Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
