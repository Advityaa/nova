"use client";

import { useEffect, useState } from "react";
import { type EventItem } from "@/lib/data";
import { startCheckout } from "@/lib/checkout";
import { useSite } from "./SiteProvider";

export default function TicketDrawer() {
  const { drawerEvent, closeDrawer } = useSite();
  // Keep the last event mounted so the slide-out animation still shows content.
  const [shown, setShown] = useState<EventItem | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (drawerEvent) {
      setShown(drawerEvent);
      setCart({});
      setError("");
      setBusy(false);
    }
  }, [drawerEvent]);

  const open = drawerEvent !== null;
  const ev = shown;

  const step = (i: number, d: number) =>
    setCart((c) => ({ ...c, [i]: Math.max(0, (c[i] || 0) + d) }));

  const total =
    ev?.tiers.reduce((sum, t, i) => sum + (cart[i] || 0) * t.p, 0) ?? 0;
  const count =
    ev?.tiers.reduce((sum, _t, i) => sum + (cart[i] || 0), 0) ?? 0;

  async function checkout() {
    if (!ev || count === 0) return;
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
      // startCheckout redirects on success; nothing else to do.
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Checkout failed.");
    }
  }

  return (
    <>
      <div
        className={`scrim${open ? " open" : ""}`}
        onClick={closeDrawer}
      ></div>
      <aside className={`drawer${open ? " open" : ""}`}>
        <div className="dh">
          <button className="x" onClick={closeDrawer}>
            ×
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ev?.img || ""} alt={ev?.name || ""} />
        </div>
        <div className="db">
          <span className="dtype">{ev?.type}</span>
          <h3>{ev?.name}</h3>
          <dl className="dmeta">
            <dt>Date</dt>
            <dd>
              {ev?.weekday} {ev?.date}
            </dd>
            <dt>Doors</dt>
            <dd>{ev?.time}</dd>
            <dt>Venue</dt>
            <dd>{ev?.venue}</dd>
            <dt>Area</dt>
            <dd>{ev?.area}</dd>
          </dl>
          <p className="ddesc">{ev?.desc}</p>
          <div>
            {ev?.tiers.map((t, i) => (
              <div
                key={i}
                className={`tier${(cart[i] || 0) > 0 ? " on" : ""}`}
              >
                <div>
                  <div className="tn">{t.n}</div>
                  <div className="td">{t.d}</div>
                </div>
                <div className="tr">
                  <span className="tp">¥{t.p}</span>
                  <div className="step">
                    <button onClick={() => step(i, -1)}>−</button>
                    <span className="q">{cart[i] || 0}</span>
                    <button onClick={() => step(i, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="df">
          {count > 0 && (
            <div className="dcust">
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
          <div className="tot">
            <span className="tl">Total</span>
            <span className="tv">¥{total}</span>
          </div>
          {error && <div className="derror">{error}</div>}
          <button
            className="co"
            onClick={checkout}
            disabled={count === 0 || busy}
          >
            {busy
              ? "Redirecting…"
              : count === 0
                ? "Select tickets"
                : `Checkout · ${count} ${count === 1 ? "ticket" : "tickets"}`}
          </button>
          <div className="note">Secure payment · Mock mode (no real charge)</div>
        </div>
      </aside>
    </>
  );
}
