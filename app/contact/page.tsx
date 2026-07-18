import Nav from "@/components/Nav";
import SocialSelector from "@/components/SocialSelector";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

export default function ContactPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main style={{ paddingTop: '80px', minHeight: '80vh' }}>
        <SocialSelector />
        <ContactForm />
        <section className="sec" style={{ paddingTop: 0 }}>
          <div className="contact-address" style={{ marginTop: '0', paddingTop: '60px', borderTop: '1px solid var(--line)', maxWidth: '1320px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--ink)' }}>Office Address</h3>
            <p style={{ color: 'var(--ink-dim)', lineHeight: '1.6' }}>
              <strong>NOVA SHANGHAI</strong><br />
              No.608 XiKang Road WeWork 03-111, Jing An District, Shanghai<br />
              上海市静安区西康路608号3楼WeWork 03-111
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </SiteProvider>
  );
}
