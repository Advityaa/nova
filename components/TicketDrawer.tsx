"use client";

import { useEffect, useState } from "react";
import { type EventItem } from "@/lib/data";
import { useSite } from "./SiteProvider";

export default function TicketDrawer() {
  const { drawerEvent, closeDrawer } = useSite();
  // Keep the last event mounted so the slide-out animation still shows content.
  const [shown, setShown] = useState<EventItem | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});

  useEffect(() => {
    if (drawerEvent) {
      setShown(drawerEvent);
      setCart({});
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

  function checkout() {
    if (!ev) return;
    const items = ev.tiers
      .map((t, i) => ({
        name: `${ev.name} — ${t.n}`,
        price: t.p,
        qty: cart[i] || 0,
      }))
      .filter((x) => x.qty > 0);
    const tot = items.reduce((s, x) => s + x.qty * x.price, 0);
    // Stubbed until stage 3 — real Stripe handoff comes later.
    alert(
      "STRIPE CHECKOUT (preview)\n\n" +
        items.map((x) => `${x.qty}× ${x.name}  ¥${x.price}`).join("\n") +
        `\n\nTotal ¥${tot}\n\nConnect the backend to hand off to Stripe.`
    );
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
          <div className="tot">
            <span className="tl">Total</span>
            <span className="tv">¥{total}</span>
          </div>
          <button className="co" onClick={checkout} disabled={count === 0}>
            {count === 0
              ? "Select tickets"
              : `Checkout · ${count} ${count === 1 ? "ticket" : "tickets"}`}
          </button>
          <div className="note">Secure payment · Powered by Stripe</div>
        </div>
      </aside>
    </>
  );
}
