import Nav from "@/components/Nav";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import { SERVICES } from "@/lib/data";

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <Services services={SERVICES} />
      </main>
      <Footer />
    </>
  );
}
