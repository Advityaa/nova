"use client";

import { useState } from "react";
import { type EventItem } from "@/lib/data";
import { startCheckout } from "@/lib/checkout";
import { useSearchParams } from "next/navigation";

export default function CheckoutClient({ ev }: { ev: EventItem }) {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cart: Record<number, number> = {};
  ev.tiers.forEach((_t, i) => {
    const qty = parseInt(searchParams.get(`t${i}`) || "0", 10);
    if (qty > 0) cart[i] = qty;
  });

  const total = ev.tiers.reduce((sum, t, i) => sum + (cart[i] || 0) * t.p, 0);
  const count = ev.tiers.reduce((sum, _t, i) => sum + (cart[i] || 0), 0);

  async function checkout() {
    if (count === 0) return;
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    const items = ev.tiers
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
        eventSlug: ev.id,
        items,
        customer: { name: name.trim(), email: email.trim() || undefined },
      });
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Checkout failed.");
    }
  }

  if (count === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center p-12 text-[var(--ink)]">No tickets selected. Please go back.</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full pt-[100px] px-6 pb-20">
      <h1 className="text-3xl font-bold mb-8 text-[var(--ink)]">Checkout</h1>
      <div className="bg-[var(--line)]/10 backdrop-blur-xl border border-[var(--line)] rounded-xl p-6 mb-8 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4 text-[var(--ink)]">Order Summary</h2>
        <div className="mb-4">
          <h3 className="text-lg text-[var(--ink)]/80">{ev.name}</h3>
          <p className="text-sm text-[var(--ink)]/60">{ev.date} · {ev.venue}</p>
        </div>
        <div className="space-y-3 mb-6">
          {ev.tiers.map((t, i) => {
            const qty = cart[i] || 0;
            if (qty === 0) return null;
            return (
              <div key={i} className="flex justify-between items-center text-[var(--ink)]">
                <div>
                  <div className="font-medium">{t.n}</div>
                  <div className="text-sm opacity-60">{qty} × ${t.p}</div>
                </div>
                <div className="font-semibold">${qty * t.p}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-[var(--line)] text-[var(--ink)] text-xl font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      <div className="bg-[var(--line)]/10 backdrop-blur-xl border border-[var(--line)] rounded-xl p-6 shadow-2xl">
        <h2 className="text-xl font-semibold mb-6 text-[var(--ink)]">Your Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--ink)]/80">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/40 border border-[var(--line)] rounded-lg p-3 text-[var(--ink)] focus:outline-none focus:border-white/50 transition-colors"
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--ink)]/80">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-[var(--line)] rounded-lg p-3 text-[var(--ink)] focus:outline-none focus:border-white/50 transition-colors"
              placeholder="john@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        {error && <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">{error}</div>}

        <button
          onClick={checkout}
          disabled={busy}
          className="w-full mt-8 bg-[var(--accent)] text-[var(--accent-ink)] font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          style={{ backgroundColor: ev.color, color: ev.ink }}
        >
          {busy ? "Processing..." : `Checkout · $${total}`}
        </button>
        <p className="text-center text-xs text-[var(--ink)]/40 mt-4">Secure payment via Airwallex</p>
      </div>
    </div>
  );
}
