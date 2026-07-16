import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Edge-safe: uses only authConfig (no bcrypt/DB). The `authorized` callback
// gates /admin/* and redirects to /login when unauthenticated.
export default NextAuth(authConfig).auth;

export const config = {
  // Protect the admin area (the layout also re-checks server-side).
  matcher: ["/admin/:path*"],
};
