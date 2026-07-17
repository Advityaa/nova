import { listOrdersAdmin } from "@/lib/db";
import OrdersTableClient from "@/components/admin/OrdersTableClient";

export const dynamic = "force-dynamic";

const usd = (fen: number) => `$${(fen / 800).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span className="admin-count">
            {paid.length} paid · {usd(revenueFen)} revenue
          </span>
          <a href="/api/admin/export-orders" className="admin-btn admin-btn-inline" download>
            Download CSV
          </a>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="admin-card admin-placeholder"><p>No orders yet.</p></div>
      ) : (
        <OrdersTableClient orders={orders} />
      )}
    </div>
  );
}
