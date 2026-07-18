"use client";

import { type CSSProperties } from "react";
import { type EventItem } from "@/lib/data";
import { useSite } from "./SiteProvider";

function EventCard({ event }: { event: EventItem }) {
  const { openDrawer } = useSite();
  const fromPrice = Math.min(...event.tiers.map((t) => t.p));

  return (
    <div
      className="card rev"
      style={{ ["--cardc" as string]: event.color } as CSSProperties}
      onClick={() => openDrawer(event.id)}
    >
      <div className="cimg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.img} alt={event.name} />
      </div>
      <div className="ctop">
        <span className="type">{event.type}</span>
        <span className="status">{event.status}</span>
      </div>
      <div className="cbody">
        <div className="cdate">
          {event.weekday} {event.date} · {event.time}
        </div>
        <h3>{event.name}</h3>
        <div className="cline">{event.lineup}</div>
        <div className="cvenue">
          {event.venue}, {event.area}
        </div>
        <div className="cfoot">
          <div className="cprice">
            <small>from</small> ${fromPrice}
          </div>
          <button
            className="cbtn"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer(event.id);
            }}
          >
            Tickets →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventCards({
  events,
  weekMeta,
}: {
  events: EventItem[];
  weekMeta: string;
}) {
  return (
    <section className="sec" id="events">
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow">Upcoming Events</span>
          <h2>This week</h2>
        </div>
        <div className="r" id="weekMeta">
          {weekMeta}
        </div>
      </div>
      <div className="cards" id="cards">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}
