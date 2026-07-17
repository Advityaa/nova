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
          <div className="at-head at-events" style={{ gridTemplateColumns: '60px 2fr 1.5fr 1fr 1fr 1fr 100px' }}>
            <span></span>
            <span>Event</span>
            <span>When</span>
            <span>Status</span>
            <span>Tiers</span>
            <span>Sold</span>
            <span></span>
          </div>
          {events.map((e) => (
            <div className="at-row at-events" key={e.id} style={{ gridTemplateColumns: '60px 2fr 1.5fr 1fr 1fr 1fr 100px', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-soft)' }}>
                {e.hero_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.hero_image} alt={e.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--ink-dim)', opacity: 0.1 }} />
                )}
              </div>
              <span className="at-name" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <strong>{e.name}</strong>
                  {e.featured && <em className="at-badge" style={{ fontSize: '0.7rem' }}>Featured</em>}
                </div>
                <small style={{ color: 'var(--ink-dim)' }}>/{e.slug}</small>
              </span>
              <span style={{ fontSize: '0.9rem' }}>
                {e.weekday}{" "}
                {e.starts_at ? new Date(e.starts_at).toUTCString().slice(5, 16) : "—"}
              </span>
              <span>
                <em className={`at-status s-${e.status}`} style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>{e.status}</em>
              </span>
              <span>{e.tier_count}</span>
              <span style={{ fontWeight: 600 }}>{e.sold_total}</span>
              <span className="at-actions" style={{ justifyContent: 'flex-end' }}>
                <Link href={`/admin/events/${e.id}/edit`} className="admin-mini">
                  Edit
                </Link>
                <form action={deleteEvent} style={{ display: "inline" }}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="admin-mini danger" type="submit">
                    Del
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
