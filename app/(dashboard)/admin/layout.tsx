import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard (in addition to middleware). No session → /login.
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-brand">
          <Link href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
            NOVA<span>/ ADMIN</span>
          </Link>
        </div>

        <AdminNav />

        <div className="admin-user">
          <div className="admin-user-email">{session.user.email}</div>
          <div className="admin-user-role">{session.user.role} account</div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="admin-signout">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
