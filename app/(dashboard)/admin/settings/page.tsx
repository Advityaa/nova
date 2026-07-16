import { auth } from "@/auth";
import { listUsersAdmin } from "@/lib/db";
import PasswordForm from "@/components/admin/PasswordForm";
import InviteForm from "@/components/admin/InviteForm";
import { deleteTeamMember } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await auth();
  const me = session!.user;
  const isOwner = me.role === "owner";
  const users = isOwner ? await listUsersAdmin() : [];

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Account</span>
          <h1>Settings</h1>
        </div>
      </header>

      <div className="admin-card">
        <div className="admin-subhead">
          <h2>Your password</h2>
          <span>Signed in as {me.email} ({me.role})</span>
        </div>
        <PasswordForm />
      </div>

      {isOwner && (
        <div className="admin-card" style={{ marginTop: 18 }}>
          <div className="admin-subhead">
            <h2>Team</h2>
            <span>Owners can create and remove admins.</span>
          </div>

          <InviteForm />

          <div className="admin-table" style={{ marginTop: 18 }}>
            <div className="at-head at-team">
              <span>Name</span>
              <span>Email</span>
              <span>Role</span>
              <span></span>
            </div>
            {users.map((u) => (
              <div className="at-row at-team" key={u.id}>
                <span className="at-name">{u.name ?? "—"}</span>
                <span>{u.email}</span>
                <span><em className={`at-status s-${u.role === "owner" ? "onsale" : "draft"}`}>{u.role}</em></span>
                <span className="at-actions">
                  {u.id === me.id ? (
                    <em className="at-you">you</em>
                  ) : (
                    <form action={deleteTeamMember} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="role" value={u.role} />
                      <button className="admin-mini danger" type="submit">Remove</button>
                    </form>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
