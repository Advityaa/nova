import Nav from "@/components/Nav";
import TrackRecord from "@/components/TrackRecord";
import News from "@/components/News";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";
import { RESULTS, NEWS } from "@/lib/data";

export default function MediaPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <News news={NEWS} />
        <TrackRecord results={RESULTS} />
      </main>
      <Footer />
    </SiteProvider>
  );
}
