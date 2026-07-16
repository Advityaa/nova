import Link from "next/link";
import { auth } from "@/auth";
import { listOrdersAdmin, listEventsAdmin, listEnquiriesAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

const yuan = (fen: number) => `¥${(fen / 100).toLocaleString()}`;

export default async function AdminOverview() {
  const session = await auth();
  const user = session!.user; // layout guarantees a session

  // Fetch all dashboard data concurrently
  const [orders, events, enquiries] = await Promise.all([
    listOrdersAdmin(),
    listEventsAdmin(),
    listEnquiriesAdmin(),
  ]);

  // Aggregate KPIs
  const paidOrders = orders.filter((o) => o.status === "paid");
  const revenueFen = paidOrders.reduce((s, o) => s + o.amount_fen, 0);
  const ticketsSold = paidOrders.reduce((s, o) => s + o.item_count, 0);
  const activeEvents = events.filter((e) => e.status === "onsale").length;
  const pendingEnquiries = enquiries.filter((e) => !e.handled).length;

  const recentOrders = orders.slice(0, 5); // top 5 recent orders

  return (
    <div>
      <header className="admin-head" style={{ marginBottom: "32px" }}>
        <div>
          <span className="admin-eyebrow">Dashboard</span>
          <h1>Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/admin/events/new" className="admin-btn admin-btn-inline">
            + New Event
          </Link>
        </div>
      </header>

      <div className="admin-card admin-welcome" style={{ marginBottom: "32px" }}>
        <div className="admin-dot" />
        <div>
          <div className="admin-welcome-title">Welcome back, {user.name || user.email}.</div>
          <div className="admin-welcome-sub">
            Here&apos;s a quick glance at your platform&apos;s performance today.
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="admin-grid" style={{ marginBottom: "48px" }}>
        <div className="admin-card">
          <div className="admin-card-k">Total Revenue</div>
          <div className="admin-card-v" style={{ fontSize: '28px', color: 'var(--accent)' }}>
            {yuan(revenueFen)}
          </div>
          <Link href="/admin/orders" className="admin-mini" style={{ marginTop: '12px', display: 'inline-block' }}>View Orders &rarr;</Link>
        </div>
        <div className="admin-card">
          <div className="admin-card-k">Tickets Sold</div>
          <div className="admin-card-v" style={{ fontSize: '28px' }}>
            {ticketsSold}
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-k">Active Events</div>
          <div className="admin-card-v" style={{ fontSize: '28px' }}>
            {activeEvents}
          </div>
          <Link href="/admin/events" className="admin-mini" style={{ marginTop: '12px', display: 'inline-block' }}>Manage Events &rarr;</Link>
        </div>
        <div className="admin-card">
          <div className="admin-card-k">Pending Leads</div>
          <div className="admin-card-v" style={{ fontSize: '28px' }}>
            {pendingEnquiries}
          </div>
          <Link href="/admin/enquiries" className="admin-mini" style={{ marginTop: '12px', display: 'inline-block' }}>Review Enquiries &rarr;</Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: 'var(--disp)', fontSize: '20px', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Recent Sales</h2>
        <Link href="/admin/orders" className="admin-mini">View all</Link>
      </div>

      {recentOrders.length === 0 ? (
        <div className="admin-card admin-placeholder"><p>No sales yet.</p></div>
      ) : (
        <div className="admin-table">
          <div className="at-head at-orders">
            <span>Customer</span>
            <span>Event</span>
            <span>Qty</span>
            <span>Amount</span>
            <span>Status</span>
            <span>When</span>
          </div>
          {recentOrders.map((o) => (
            <div className="at-row at-orders" key={o.id}>
              <span className="at-name">
                {o.customer_name}
                {o.email && <small>{o.email}</small>}
              </span>
              <span>{o.event_name ?? "—"}</span>
              <span>{o.item_count}</span>
              <span>{yuan(o.amount_fen)}</span>
              <span><em className={`at-status s-${o.status}`}>{o.status}</em></span>
              <span>{new Date(o.created_at).toUTCString().slice(5, 17)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
