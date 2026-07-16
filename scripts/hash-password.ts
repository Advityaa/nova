/**
 * Prints a bcrypt hash for a password — handy for seeding a user by hand.
 * Usage: npm run hash -- 'your-password'
 */
import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];
  if (!password) {
    console.error("Usage: npm run hash -- 'your-password'");
    process.exit(1);
  }
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
  process.exit(0);
}

main();
