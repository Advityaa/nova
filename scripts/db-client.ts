// Shared Neon client for CLI scripts (migrate / seed / create-user).
// Loads .env.local then .env, and connects via Neon's serverless HTTP driver.
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });
config();

const cs = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!cs) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in (Neon)."
  );
  process.exit(1);
}

export const sql = neon(cs, { fullResults: true });
