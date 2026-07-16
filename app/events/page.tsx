import SiteProvider from "@/components/SiteProvider";
import Nav from "@/components/Nav";
import EventCards from "@/components/EventCards";
import Footer from "@/components/Footer";
import TicketDrawer from "@/components/TicketDrawer";
import { getOnsaleEvents, getFeaturedEvent } from "@/lib/db";
import type { EventItem } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: EventItem[] = [];
  let featured: EventItem | null = null;
  try {
    [events, featured] = await Promise.all([
      getOnsaleEvents(),
      getFeaturedEvent(),
    ]);
  } catch (err) {
    console.error("DB load failed:", err);
  }
  const weekMeta = `${events.length} events · 14–24 Jul`;

  return (
    <SiteProvider events={events} featuredId={featured?.id ?? null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <EventCards events={events} weekMeta={weekMeta} />
      </main>
      <Footer />
      <TicketDrawer />
    </SiteProvider>
  );
}
