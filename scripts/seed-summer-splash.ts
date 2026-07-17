import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function main() {
  console.log("Inserting Summer Splash event...");
  
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED;
  if (!connectionString) throw new Error("No DATABASE_URL set");
  
  const sql = neon(connectionString);
  
  const { id: eventId } = (await sql`
    insert into events (
      slug, name, type, color, accent_ink, lineup, venue, area, address,
      weekday, starts_at, doors, status, status_label, hero_image,
      description, featured
    ) values (
      'summer-splash-2026', 'SUMMER SPLASH POOL PARTY VOL. 2', 'Pool Party', '#ff4d8d', '#ffffff',
      'MAXINDABOOTH | AIRTEM | ANNA JOVA | KOUGAR | CEDAR | NAZ', 'Radisson Blu Forest Manor Hongqiao', 'Hongqiao', '839 Jinfeng Road, Minhang, Shanghai',
      'SAT', '2026-07-25T12:00:00+08:00', '12:00–20:00', 'onsale', 'Selling fast',
      '/images/summer-splash.jpg', 
      'Shanghai’s biggest summer celebration! Grab your bikinis, swimsuits, and your best summer vibes as Nova and Viva proudly present SUMMER SPLASH 2026—Shanghai''s biggest and most iconic outdoor pool party at the luxurious Radisson Blu Forest Manor Hotel. Spend the day soaking up the sun, cooling off in the pool, enjoying exciting games and activities, and dancing to the hottest beats from Shanghai''s top DJs alongside the city''s most energetic crowd. Set within a stunning 5-star resort just minutes from downtown, the venue features over 2,000 sqm of swimming pools and 8,000 sqm of beautiful outdoor space, complete with lush gardens, waterfalls, fountains, palm trees, and a sandy dance floor. Don''t miss the biggest splash of the summer! For VIP table bookings, contact 13524177794.',
      true
    ) returning id
  `)[0];

  await sql`
    insert into ticket_tiers (event_id, name, description, price_fen, capacity, sort)
    values 
      (${eventId}, 'Early Bird', 'Includes 1 Drink', 19800, 200, 1),
      (${eventId}, 'Regular', 'Includes 1 Drink', 22800, 500, 2),
      (${eventId}, 'At Door', 'Includes 1 Drink', 25800, 200, 3)
  `;

  console.log("Successfully inserted event with ID:", eventId);
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to insert event:", err);
  process.exit(1);
});
