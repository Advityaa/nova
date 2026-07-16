/**
 * Applies db/schema.sql to the database in POSTGRES_URL.
 * Usage: npm run db:migrate
 */
import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sql } from "@vercel/postgres";

// Load .env.local (Next.js convention) then .env as a fallback.
config({ path: ".env.local" });
config();

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error(
      "POSTGRES_URL is not set. Copy .env.example to .env.local and fill it in."
    );
  }

  const schema = readFileSync(join(process.cwd(), "db", "schema.sql"), "utf8");

  // Strip `--` line comments first (they may contain semicolons), then split
  // into individual statements. Our DDL has no string literals containing `--`.
  const withoutComments = schema
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx >= 0 ? line.slice(0, idx) : line;
    })
    .join("\n");
  const statements = withoutComments
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  console.log(`Applying ${statements.length} statements…`);
  for (const stmt of statements) {
    await sql.query(stmt);
  }
  console.log("✓ Migration complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
