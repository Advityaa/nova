import type { NextAuthConfig } from "next-auth";

type Role = "owner" | "admin";

// Edge-safe config: NO database or bcrypt imports here — this is loaded by
// middleware (Edge runtime). The Credentials provider (which needs bcrypt + DB)
// is added in auth.ts, which runs in the Node runtime.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [], // real providers are attached in auth.ts
  callbacks: {
    // Runs in middleware for matched requests. We gate page *navigations*
    // (GET) to /admin/* here; Server Action POSTs are let through so the action
    // round-trip isn't broken by a redirect — those are guarded server-side by
    // requireSession() in the action AND the admin layout's auth() check.
    authorized({ auth, request }) {
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      if (!isOnAdmin) return true;
      if (request.method !== "GET") return true; // actions guard themselves
      return !!auth?.user; // → redirected to /login when false
    },
    // Carry id + role from the authorized user into the JWT…
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      return token;
    },
    // …and expose them on the session.
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? (token.sub as string) ?? "";
        const role = token.role as Role | undefined;
        if (role) session.user.role = role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
