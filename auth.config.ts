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
    // Runs in middleware for every matched request. Protect /admin/*.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      if (isOnAdmin) return isLoggedIn; // → redirected to /login when false
      return true;
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
