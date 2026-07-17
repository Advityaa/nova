import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config({ path: ".env.production" });

async function main() {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_UNPOOLED;
  const sql = neon(connectionString!);
  
  const { rows: events } = await sql`select id from events where slug = 'summer-splash-2026'`;
  if (events.length > 0) {
    const id = events[0].id;
    await sql`update events set color = '#ff0000' where id = ${id}`;
    const { rows: updated } = await sql`select color from events where id = ${id}`;
    console.log("Updated color:", updated[0].color);
  } else {
    console.log("Event not found");
  }
}
main();
