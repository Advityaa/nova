"use client";

import { useState } from "react";
import type { AdminOrder } from "@/lib/db";

const cny = (fen: number) => `CNY ¥${(fen / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OrdersTableClient({ orders }: { orders: AdminOrder[] }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      (o.email && o.email.toLowerCase().includes(search.toLowerCase())) ||
      (o.event_name && o.event_name.toLowerCase().includes(search.toLowerCase()));

    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-card">
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", padding: "1rem", borderBottom: "1px solid var(--line)" }}>
        <input
          type="text"
          placeholder="Search customers or events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--ink)" }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "8px 12px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--bg-soft)", color: "var(--ink)" }}
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="admin-table" style={{ margin: 0, border: "none" }}>
        <div className="at-head at-orders" style={{ padding: "0 1rem" }}>
          <span>Customer</span>
          <span>Event</span>
          <span>Qty</span>
          <span>Amount</span>
          <span>Status</span>
          <span>When</span>
        </div>
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--ink-dim)" }}>
            No orders match your search.
          </div>
        ) : (
          filteredOrders.map((o) => (
            <div className="at-row at-orders" key={o.id} style={{ padding: "0.5rem 1rem", borderBottom: "1px solid var(--line)", alignItems: "center" }}>
              <span className="at-name" style={{ display: "flex", flexDirection: "column" }}>
                <strong>{o.customer_name}</strong>
                {o.email && <small style={{ color: "var(--ink-dim)" }}>{o.email}</small>}
              </span>
              <span>{o.event_name ?? "—"}</span>
              <span>{o.item_count}</span>
              <span style={{ fontWeight: 500 }}>{cny(o.amount_fen)}</span>
              <span>
                <em className={`at-status s-${o.status}`} style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.8rem", textTransform: "capitalize" }}>
                  {o.status}
                </em>
              </span>
              <span style={{ color: "var(--ink-dim)", fontSize: "0.9rem" }}>
                {new Date(o.created_at).toUTCString().slice(5, 17)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
