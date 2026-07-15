"use client";

import { useRef, useState } from "react";
import { type EventItem } from "@/lib/data";
import { useSite } from "./SiteProvider";

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView();
}

export default function HeroVideo({ event }: { event: EventItem }) {
  const { openDrawer } = useSite();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [soundOn, setSoundOn] = useState(false);

  const fromPrice = Math.min(...event.tiers.map((t) => t.p));

  function toggleSound() {
    const v = videoRef.current;
    const next = !soundOn;
    setSoundOn(next);
    if (v) {
      v.muted = !next;
      if (next) v.play().catch(() => {});
    }
  }

  return (
    <header className="hero" id="top">
      <div className="bg">
        <video
          ref={videoRef}
          id="heroVideo"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="hero-content shell" style={{ maxWidth: "none" }}>
        <span className="now-tag">On now · Shanghai</span>
        <h1 id="hTitle">{event.name}</h1>
        <div className="hero-meta" id="hMeta">
          <span>
            {event.weekday} {event.date}
          </span>
          <span className="sep">/</span>
          <span>{event.time}</span>
          <span className="sep">/</span>
          <span>
            {event.venue}, {event.area}
          </span>
          <span className="sep">/</span>
          <span>from ¥{fromPrice}</span>
        </div>
        <div className="hero-cta">
          <button className="buy" onClick={() => openDrawer(event.id)}>
            Get tickets →
          </button>
          <button className="alt" onClick={() => scrollTo("events")}>
            All events
          </button>
        </div>
      </div>

      <button
        className="vsound"
        onClick={toggleSound}
        aria-label="Toggle sound"
      >
        <svg
          id="soundIcon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
          {soundOn ? (
            <>
              <path d="M17 8a5 5 0 010 8" strokeLinecap="round" />
              <path d="M19.5 5.5a9 9 0 010 13" strokeLinecap="round" />
            </>
          ) : (
            <path d="M17 8a5 5 0 010 8" strokeLinecap="round" opacity={0.4} />
          )}
        </svg>
      </button>

      <button className="scrollcue" onClick={() => scrollTo("events")}>
        <span>Scroll</span>
        <span className="l"></span>
      </button>
    </header>
  );
}
