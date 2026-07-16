import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

export default function SponsorsPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="sec">
          <div className="rev">
            <h2>Sponsors</h2>
            <p>Coming soon...</p>
          </div>
        </section>
      </main>
      <Footer />
    </SiteProvider>
  );
}
