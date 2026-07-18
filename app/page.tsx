import SiteProvider from "@/components/SiteProvider";
import Nav from "@/components/Nav";
import HeroVideo from "@/components/HeroVideo";
import SponsorMarquee from "@/components/SponsorMarquee";
import EventCards from "@/components/EventCards";
import Gallery from "@/components/Gallery";
import TrackRecord from "@/components/TrackRecord";
import News from "@/components/News";
import About from "@/components/About";
import Services from "@/components/Services";
import SocialSelector from "@/components/SocialSelector";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import TicketDrawer from "@/components/TicketDrawer";
import MusicPlayer from "@/components/MusicPlayer";
import { NEWS, RESULTS, SERVICES, type EventItem } from "@/lib/data";
import {
  getFeaturedEvent,
  getGalleryImages,
  getOnsaleEvents,
} from "@/lib/db";

// Read fresh from the DB on each request so edits appear without a redeploy.
// Swap to `export const revalidate = 30` for ISR caching if preferred.
export const dynamic = "force-dynamic";

export default async function Home() {
  // Never let a DB hiccup turn the homepage into a 500 — degrade gracefully.
  let events: EventItem[] = [];
  let featured: EventItem | null = null;
  let gallery: string[] = [];
  try {
    [events, featured, gallery] = await Promise.all([
      getOnsaleEvents(),
      getFeaturedEvent(),
      getGalleryImages(),
    ]);
  } catch (err) {
    console.error("Home DB load failed — rendering without dynamic data:", err);
  }

  const weekMeta = `${events.length} events · 14–24 Jul`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nova Events",
    url: "https://www.novaeventsgroup.com",
    logo: "https://www.novaeventsgroup.com/nova-logo.png",
    description: "Shanghai's premier luxury event planner and corporate event management agency.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Shanghai",
      addressCountry: "CN",
    },
    sameAs: ["https://www.instagram.com/novaeventsshanghai"],
  };

  return (
    <SiteProvider events={events} featuredId={featured?.id ?? null}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      {featured && <HeroVideo event={featured} />}
      <SponsorMarquee />

      <main className="shell">
        <EventCards events={events} weekMeta={weekMeta} />
        <Gallery images={gallery} limit={5} />
        <TrackRecord results={RESULTS} />
        <News news={NEWS.slice(0, 3)} />
        <About />
        <Services services={SERVICES} />
      </main>

      <SocialSelector />
      <ContactForm />
      <Footer />

      <TicketDrawer />
      <MusicPlayer />
    </SiteProvider>
  );
}
