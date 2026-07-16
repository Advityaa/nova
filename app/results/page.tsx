import Nav from "@/components/Nav";
import TrackRecord from "@/components/TrackRecord";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";
import { RESULTS } from "@/lib/data";

export default function ResultsPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <TrackRecord results={RESULTS} />
      </main>
      <Footer />
    </SiteProvider>
  );
}
