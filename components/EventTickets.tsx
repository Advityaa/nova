"use client";

import { useState } from "react";
import { type EventItem } from "@/lib/data";
import { startCheckout } from "@/lib/checkout";

export default function EventTickets({ event }: { event: EventItem }) {
  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const step = (i: number, d: number) =>
    setCart((c) => ({ ...c, [i]: Math.max(0, (c[i] || 0) + d) }));

  const total = event.tiers.reduce(
    (sum, t, i) => sum + (cart[i] || 0) * t.p,
    0
  );
  const count = event.tiers.reduce((sum, _t, i) => sum + (cart[i] || 0), 0);

  async function checkout() {
    if (count === 0) return;
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    const items = event.tiers
      .map((t, i) => ({ tierId: t.id ?? "", qty: cart[i] || 0 }))
      .filter((x) => x.qty > 0 && x.tierId);
    if (items.length === 0) {
      setError("Tickets are not available right now.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await startCheckout({
        eventSlug: event.id,
        items,
        customer: { name: name.trim(), email: email.trim() || undefined },
      });
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Checkout failed.");
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        {event.tiers.map((t, i) => (
          <div key={i} className={`tier${(cart[i] || 0) > 0 ? " on" : ""}`}>
            <div>
              <div className="tn">{t.n}</div>
              <div className="td">{t.d}</div>
            </div>
            <div className="tr">
              <span className="tp">CNY ¥{t.p}</span>
              <div className="step">
                <button onClick={() => step(i, -1)}>−</button>
                <span className="q">{cart[i] || 0}</span>
                <button onClick={() => step(i, 1)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {count > 0 && (
        <div className="dcust" style={{ marginBottom: 14 }}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email (for your ticket)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
      )}
      <div className="tot" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16, fontFamily: "var(--mono)" }}>
        <span className="tl" style={{ display: "flex", flexDirection: "column" }}>
          Total
          <span style={{ fontSize: "10px", color: "var(--ink-dim)", fontFamily: "sans-serif" }}>(inclusive of all taxes)</span>
        </span>
        <span className="tv">CNY ¥{total}</span>
      </div>
      {error && (
        <div className="derror" style={{ marginBottom: 12 }}>
          {error}
        </div>
      )}
      <button
        className="co"
        onClick={checkout}
        disabled={count === 0 || busy}
        style={{ width: "100%" }}
      >
        {busy
          ? "Redirecting…"
          : count === 0
            ? "Select tickets"
            : `Checkout · ${count} ${count === 1 ? "ticket" : "tickets"}`}
      </button>
      <div className="note" style={{ marginTop: 12, fontSize: '12px', color: 'var(--ink-dim)' }}>
        Secure payment via Airwallex<br/>
        Prices in CNY. International cards are automatically converted to your local currency.
      </div>
    </div>
  );
}
