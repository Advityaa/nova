/**
 * Creates (or updates) an admin user. Password is bcrypt-hashed; plaintext is
 * never stored. Run db:migrate first so the `users` table exists.
 *
 * Seed the owner from env (recommended):
 *   OWNER_EMAIL=... OWNER_PASSWORD=... npm run user:seed-owner
 *
 * Or create any user via flags:
 *   npm run user:create -- --email a@b.com --password secret --role admin --name "Jo"
 */
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import { sql } from "@vercel/postgres";

config({ path: ".env.local" });
config();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set (copy .env.example to .env.local).");
  }

  const seedOwner = process.argv.includes("--seed-owner");
  const email = (arg("email") ?? (seedOwner ? process.env.OWNER_EMAIL : "")) ?? "";
  const password =
    (arg("password") ?? (seedOwner ? process.env.OWNER_PASSWORD : "")) ?? "";
  const role = (arg("role") ?? (seedOwner ? "owner" : "admin")).toLowerCase();
  const name = arg("name") ?? (seedOwner ? "Owner" : null);

  if (!email || !password) {
    throw new Error(
      seedOwner
        ? "Set OWNER_EMAIL and OWNER_PASSWORD in .env.local first."
        : "Provide --email and --password."
    );
  }
  if (role !== "owner" && role !== "admin") {
    throw new Error(`Invalid role "${role}" (use owner|admin).`);
  }

  const hash = await bcrypt.hash(password, 10);

  // Upsert by email so re-running rotates the password rather than erroring.
  await sql`
    insert into users (email, password_hash, role, name)
    values (${email.toLowerCase().trim()}, ${hash}, ${role}, ${name})
    on conflict (email)
    do update set password_hash = excluded.password_hash,
                  role = excluded.role,
                  name = excluded.name
  `;

  console.log(`✓ user ready: ${email} (${role})`);
  process.exit(0);
}

main().catch((err) => {
  console.error("create-user failed:", err.message ?? err);
  process.exit(1);
});
