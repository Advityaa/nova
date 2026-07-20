"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { type EventItem } from "@/lib/data";
import { useSite } from "./SiteProvider";

export default function TicketDrawer() {
  const { drawerEvent, closeDrawer } = useSite();
  // Keep the last event mounted so the slide-out animation still shows content.
  const router = useRouter();
  const [shown, setShown] = useState<EventItem | null>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (drawerEvent) {
      setShown(drawerEvent);
      setCart({});
      setError("");
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

  function proceed() {
    if (!ev || count === 0) return;
    
    const params = new URLSearchParams();
    Object.entries(cart).forEach(([i, qty]) => {
      if (qty > 0) params.append(`t${i}`, qty.toString());
    });

    if (Array.from(params.keys()).length === 0) {
      setError("Tickets are not available right now.");
      return;
    }
    
    closeDrawer();
    router.push(`/checkout/${ev.id}?${params.toString()}`);
  }

  return (
    <>
      <div
        className={`scrim${open ? " open" : ""}`}
        onClick={closeDrawer}
      ></div>
      <aside className={`drawer${open ? " open" : ""}`}>
        <button className="x" onClick={closeDrawer}>
          ×
        </button>
        <div className="dh">
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

          {ev?.id === "summer-splash-2026" && (
            <div className="w-full mt-5 mb-5 rounded-lg overflow-hidden border border-[var(--line)] shadow-lg">
              <video
                src="/video/venue-summer-splash.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto object-cover block"
              />
            </div>
          )}

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
        </div>
        <div className="df">
          <div className="tot">
            <span className="tl" style={{ display: "flex", flexDirection: "column" }}>
              Total
              <span style={{ fontSize: "10px", color: "var(--ink-dim)", fontWeight: "normal" }}>(inclusive of all taxes)</span>
            </span>
            <span className="tv">CNY ¥{total}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-dim)', marginBottom: '16px', textAlign: 'center' }}>
            Prices in CNY. International cards will automatically convert to your local currency.
          </div>
          {error && <div className="derror">{error}</div>}
          <button
            className="co"
            onClick={proceed}
            disabled={count === 0}
          >
            {count === 0
              ? "Select tickets"
              : `Proceed · ${count} ${count === 1 ? "ticket" : "tickets"}`}
          </button>
        </div>
      </aside>
    </>
  );
}
