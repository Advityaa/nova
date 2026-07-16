/**
 * Applies db/schema.sql to the database in DATABASE_URL (Neon).
 * Usage: npm run db:migrate
 *
 * Uses Neon's WebSocket Client so the whole schema (multiple statements +
 * comments) runs in a single simple-query call — no fragile splitting.
 */
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Client, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

config({ path: ".env.local" });
config();

neonConfig.webSocketConstructor = ws;

async function main() {
  const cs = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!cs) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in (Neon)."
    );
  }

  const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");

  const client = new Client(cs);
  await client.connect();
  try {
    await client.query(schema); // multi-statement simple query
    console.log("✓ Migration complete.");
  } finally {
    await client.end();
  }
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
