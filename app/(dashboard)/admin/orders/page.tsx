import { listOrdersAdmin } from "@/lib/db";

export const dynamic = "force-dynamic";

const yuan = (fen: number) => `¥${(fen / 100).toLocaleString()}`;

export default async function AdminOrdersPage() {
  const orders = await listOrdersAdmin();
  const paid = orders.filter((o) => o.status === "paid");
  const revenueFen = paid.reduce((s, o) => s + o.amount_fen, 0);

  return (
    <div>
      <header className="admin-head">
        <div>
          <span className="admin-eyebrow">Sales</span>
          <h1>Orders</h1>
        </div>
        <span className="admin-count">
          {paid.length} paid · {yuan(revenueFen)} revenue
        </span>
      </header>

      {orders.length === 0 ? (
        <div className="admin-card admin-placeholder"><p>No orders yet.</p></div>
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
          {orders.map((o) => (
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
