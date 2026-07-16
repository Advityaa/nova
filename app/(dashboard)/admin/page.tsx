import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const session = await auth();
  const user = session!.user; // layout guarantees a session

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Dashboard</span>
          <h1>Overview</h1>
        </div>
      </header>

      <div className="admin-card admin-welcome">
        <div className="admin-dot" />
        <div>
          <div className="admin-welcome-title">You&apos;re signed in.</div>
          <div className="admin-welcome-sub">
            {user.email} · <strong>{user.role}</strong>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        {[
          { k: "Events", v: "Manage the programme" },
          { k: "Gallery", v: "Curate the floor" },
          { k: "Enquiries", v: "Follow up leads" },
          { k: "Settings", v: "Team & account" },
        ].map((c) => (
          <div className="admin-card" key={c.k}>
            <div className="admin-card-k">{c.k}</div>
            <div className="admin-card-v">{c.v}</div>
            <div className="admin-soon">Coming soon</div>
          </div>
        ))}
      </div>
    </div>
  );
}
