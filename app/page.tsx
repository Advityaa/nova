import SiteProvider from "@/components/SiteProvider";
import Nav from "@/components/Nav";
import HeroVideo from "@/components/HeroVideo";
import EventCards from "@/components/EventCards";
import Gallery from "@/components/Gallery";
import TrackRecord from "@/components/TrackRecord";
import News from "@/components/News";
import Vip from "@/components/Vip";
import About from "@/components/About";
import Services from "@/components/Services";
import SocialSelector from "@/components/SocialSelector";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import TicketDrawer from "@/components/TicketDrawer";
import MusicPlayer from "@/components/MusicPlayer";
import {
  EVENTS,
  FEATURED_ID,
  GALLERY_IMAGES,
  NEWS,
  RESULTS,
  SERVICES,
  WEEK_META,
} from "@/lib/data";

export default function Home() {
  const featured = EVENTS.find((e) => e.id === FEATURED_ID) ?? EVENTS[0];

  return (
    <SiteProvider>
      <Nav />
      <HeroVideo event={featured} />

      <main className="shell">
        <EventCards events={EVENTS} weekMeta={WEEK_META} />
        <Gallery images={GALLERY_IMAGES} />
        <TrackRecord results={RESULTS} />
        <News news={NEWS} />
        <Vip />
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
