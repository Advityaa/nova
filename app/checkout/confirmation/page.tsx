import Link from "next/link";
import type { CSSProperties } from "react";
import QRCode from "qrcode";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

function yuan(fen: number): string {
  return `¥${(fen / 100).toFixed(0)}`;
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: { order?: string; status?: string };
}) {
  const orderId = searchParams.order;
  const order = orderId ? await getOrder(orderId) : null;

  if (!order) {
    return (
      <div>
        <Nav />
        <main className="shell" style={{ paddingTop: 160, minHeight: "70svh" }}>
          <span className="eyebrow">Checkout</span>
          <h1
            style={{
              fontFamily: "var(--disp)",
              fontWeight: 900,
              fontSize: "clamp(32px,6vw,64px)",
              textTransform: "uppercase",
              letterSpacing: "-.03em",
              margin: "14px 0 18px",
            }}
          >
            Order not found
          </h1>
          <p style={{ color: "var(--ink-dim)", marginBottom: 24 }}>
            We couldn&apos;t find that order.
          </p>
          <Link href="/#events" className="eyebrow">
            ← Back to events
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const paid = order.status === "paid";
  const qrDataUrl = await QRCode.toDataURL(order.id, {
    margin: 1,
    width: 320,
    color: { dark: "#0a0a0c", light: "#ffffff" },
  });

  const scope = {
    "--accent": order.event_color ?? "#864bff",
    "--accent-ink": order.event_ink ?? "#ffffff",
  } as CSSProperties;

  return (
    <div style={scope}>
      <Nav />
      <main
        className="shell"
        style={{ paddingTop: 150, paddingBottom: 80, minHeight: "80svh" }}
      >
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <span
            className="now-tag"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 9,
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: paid ? "var(--accent)" : "var(--ink-dim)",
              marginBottom: 18,
            }}
          >
            {paid ? "● Payment confirmed" : "○ Payment not completed"}
          </span>
          <h1
            style={{
              fontFamily: "var(--disp)",
              fontWeight: 900,
              fontSize: "clamp(34px,7vw,72px)",
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "-.035em",
              marginBottom: 10,
            }}
          >
            {paid ? "You're in." : "Not paid"}
          </h1>
          <p style={{ color: "var(--ink-dim)", fontSize: 16, marginBottom: 34 }}>
            {paid
              ? "Your tickets are confirmed. Show this at the door."
              : "This order hasn't been paid. Please try again."}
          </p>

          {/* Ticket */}
          <div
            style={{
              border: "1px solid var(--line)",
              background: "var(--bg-soft)",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 24,
              padding: "clamp(22px,3vw,32px)",
              alignItems: "center",
            }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 10 }}>
                {order.event_type ?? "Event"}
              </div>
              <div
                style={{
                  fontFamily: "var(--disp)",
                  fontWeight: 800,
                  fontSize: "clamp(24px,4vw,36px)",
                  textTransform: "uppercase",
                  letterSpacing: "-.02em",
                  lineHeight: 0.95,
                  marginBottom: 14,
                }}
              >
                {order.event_name ?? "Nova event"}
              </div>
              <dl className="dmeta" style={{ marginBottom: 18 }}>
                {order.event_venue && (
                  <>
                    <dt>Venue</dt>
                    <dd>{order.event_venue}</dd>
                  </>
                )}
                {order.event_doors && (
                  <>
                    <dt>Doors</dt>
                    <dd>{order.event_doors}</dd>
                  </>
                )}
                <dt>Order</dt>
                <dd style={{ fontSize: 11 }}>{order.id}</dd>
              </dl>

              <div
                style={{
                  borderTop: "1px solid var(--line)",
                  paddingTop: 16,
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                }}
              >
                {order.items.map((it, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 6,
                    }}
                  >
                    <span>
                      {it.qty}× {it.tier_name}
                    </span>
                    <span style={{ color: "var(--ink-dim)" }}>
                      {yuan(it.qty * it.unit_price_fen)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 12,
                    paddingTop: 12,
                    borderTop: "1px solid var(--line)",
                    fontWeight: 700,
                  }}
                >
                  <span>Total</span>
                  <span>{yuan(order.amount_fen)}</span>
                </div>
              </div>
            </div>

            {/* QR of the order id */}
            <div
              style={{
                background: "#fff",
                padding: 10,
                width: 148,
                height: 148,
                flex: "none",
                alignSelf: "start",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Order QR"
                style={{ width: "100%", height: "100%", display: "block" }}
              />
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/#events"
              className="eyebrow"
              style={{ padding: "14px 0" }}
            >
              ← Back to events
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
