import Nav from "@/components/Nav";
import TrackRecord from "@/components/TrackRecord";
import News from "@/components/News";
import Footer from "@/components/Footer";
import { RESULTS, NEWS } from "@/lib/data";

export default function ResultsPage() {
  return (
    <>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <TrackRecord results={RESULTS} />
        <News news={NEWS} />
      </main>
      <Footer />
    </>
  );
}
