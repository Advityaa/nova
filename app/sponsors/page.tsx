import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function SponsorsPage() {
  return (
    <>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="sec">
          <div className="sec-head">
            <div className="l">
              <span className="eyebrow">Partners</span>
              <h2>Sponsors</h2>
            </div>
          </div>
          <p>Sponsors content coming soon...</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
