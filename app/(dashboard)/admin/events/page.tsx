import Link from "next/link";
import { listEventsAdmin } from "@/lib/db";
import { deleteEvent } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await listEventsAdmin();

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Manage</span>
          <h1>Events</h1>
        </div>
        <Link href="/admin/events/new" className="admin-btn admin-btn-inline">
          + New event
        </Link>
      </header>

      {events.length === 0 ? (
        <div className="admin-card admin-placeholder">
          <p>No events yet. Create your first one.</p>
        </div>
      ) : (
        <div className="admin-table">
          <div className="at-head at-events">
            <span>Event</span>
            <span>When</span>
            <span>Status</span>
            <span>Tiers</span>
            <span>Sold</span>
            <span></span>
          </div>
          {events.map((e) => (
            <div className="at-row at-events" key={e.id}>
              <span className="at-name">
                {e.name}
                {e.featured && <em className="at-badge">Featured</em>}
                <small>/{e.slug}</small>
              </span>
              <span>
                {e.weekday}{" "}
                {e.starts_at ? new Date(e.starts_at).toUTCString().slice(5, 16) : "—"}
              </span>
              <span>
                <em className={`at-status s-${e.status}`}>{e.status}</em>
              </span>
              <span>{e.tier_count}</span>
              <span>{e.sold_total}</span>
              <span className="at-actions">
                <Link href={`/admin/events/${e.id}/edit`} className="admin-mini">
                  Edit
                </Link>
                <form action={deleteEvent} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="admin-mini danger" type="submit">
                    Delete
                  </button>
                </form>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
