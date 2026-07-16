"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type EventItem } from "@/lib/data";

type SiteContextValue = {
  openDrawer: (id: string) => void;
  closeDrawer: () => void;
  drawerEvent: EventItem | null;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within <SiteProvider>");
  return ctx;
}

// Mirrors nova.html's setRoom(): the accent adapts to the current/featured event.
function setRoom(color: string, ink: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", color);
  root.style.setProperty("--accent-ink", ink);
}

export default function SiteProvider({
  events,
  featuredId,
  children,
}: {
  events: EventItem[];
  featuredId: string | null;
  children: React.ReactNode;
}) {
  const [drawerEvent, setDrawerEvent] = useState<EventItem | null>(null);

  const featured = useMemo(
    () => events.find((e) => e.id === featuredId) ?? events[0] ?? null,
    [events, featuredId]
  );

  // On mount / when featured changes: paint the accent from the featured event.
  useEffect(() => {
    if (featured) setRoom(featured.color, featured.ink);
  }, [featured]);

  // Reveal-on-scroll observer (ports nova.html's rev()).
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".rev:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const openDrawer = useCallback(
    (id: string) => {
      const ev = events.find((e) => e.id === id);
      if (!ev) return;
      setRoom(ev.color, ev.ink);
      setDrawerEvent(ev);
      document.body.style.overflow = "hidden";
    },
    [events]
  );

  const closeDrawer = useCallback(() => {
    setDrawerEvent(null);
    document.body.style.overflow = "";
    if (featured) setRoom(featured.color, featured.ink);
  }, [featured]);

  return (
    <SiteContext.Provider value={{ openDrawer, closeDrawer, drawerEvent }}>
      {children}
    </SiteContext.Provider>
  );
}
