import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import EventTickets from "@/components/EventTickets";
import { getEventBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Event not found — NOVA" };
  return {
    title: `${event.name} — NOVA Shanghai`,
    description: event.desc,
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const fromPrice = Math.min(...event.tiers.map((t) => t.p));

  // Scope the accent to this event's mood color.
  const scope = {
    "--accent": event.color,
    "--accent-ink": event.ink,
    "--cardc": event.color,
  } as CSSProperties;

  return (
    <div style={scope}>
      <Nav />

      {/* Event hero */}
      <header
        className="hero"
        style={{ height: "auto", minHeight: "70svh" }}
      >
        <div className="bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={event.img} alt={event.name} />
        </div>
        <div className="hero-content shell" style={{ maxWidth: "none" }}>
          <a
            href="/#events"
            className="eyebrow"
            style={{ marginBottom: 18, display: "inline-block" }}
          >
            ← All events
          </a>
          <span className="now-tag">
            {event.type} · {event.status}
          </span>
          <h1>{event.name}</h1>
          <div className="hero-meta">
            <span>
              {event.weekday} {event.date}
            </span>
            <span className="sep">/</span>
            <span>{event.time}</span>
            <span className="sep">/</span>
            <span>
              {event.venue}
              {event.area ? `, ${event.area}` : ""}
            </span>
            <span className="sep">/</span>
            <span>from ${fromPrice}</span>
          </div>
        </div>
      </header>

      {/* Detail body */}
      <main className="shell">
        <section className="sec">
          <div
            className="about"
            style={{ alignItems: "start" }}
          >
            <div>
              <span className="eyebrow">About the night</span>
              <h2 style={{ fontFamily: "var(--disp)", fontWeight: 900, fontSize: "clamp(28px,4vw,44px)", textTransform: "uppercase", letterSpacing: "-.03em", margin: "12px 0 20px", lineHeight: 0.95 }}>
                {event.lineup || event.name}
              </h2>
              <p style={{ color: "var(--ink-dim)", fontSize: 16, lineHeight: 1.6, maxWidth: 460, marginBottom: 24 }}>
                {event.desc}
              </p>
              <dl className="dmeta" style={{ maxWidth: 420 }}>
                <dt>Date</dt>
                <dd>
                  {event.weekday} {event.date}
                </dd>
                <dt>Doors</dt>
                <dd>{event.time}</dd>
                <dt>Venue</dt>
                <dd>{event.venue}</dd>
                {event.address && (
                  <>
                    <dt>Address</dt>
                    <dd>{event.address}</dd>
                  </>
                )}
                <dt>Area</dt>
                <dd>{event.area}</dd>
              </dl>
            </div>

            <div>
              <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>
                Tickets
              </span>
              <EventTickets event={event} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
