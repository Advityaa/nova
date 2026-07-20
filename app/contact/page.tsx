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
        <div style={{ paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: 'clamp(20px, 4vw, 40px)', borderBottom: '1px solid var(--line)' }}>
          <div className="contact-address" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '40px', 
            maxWidth: '1320px', 
            marginLeft: 'auto', 
            marginRight: 'auto',
            paddingLeft: 'clamp(18px, 4vw, 54px)',
            paddingRight: 'clamp(18px, 4vw, 54px)'
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--ink)' }}>Business Details</h3>
              <p style={{ color: 'var(--ink-dim)', lineHeight: '1.6' }}>
                <strong>奈瓦(上海)文化传播有限公司</strong><br />
                Naiwa (Shanghai) Culture Communication Co., Ltd.<br />
                <br />
                <strong>Business Registration Number:</strong><br />
                91310000MA1GMEUA46<br />
                <br />
                <strong>Contact:</strong><br />
                Phone: <a href="tel:+8613524177794" style={{ color: 'var(--ink-dim)', textDecoration: 'none' }}>+86 13524177794</a><br />
                Email: <a href="mailto:novaeventsshanghai@gmail.com" style={{ color: 'var(--ink-dim)', textDecoration: 'none' }}>novaeventsshanghai@gmail.com</a>
              </p>
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--ink)' }}>Office Address</h3>
              <p style={{ color: 'var(--ink-dim)', lineHeight: '1.6' }}>
                <strong>NOVA SHANGHAI</strong><br />
                No.608 XiKang Road WeWork 03-111, Jing An District, Shanghai<br />
                上海市静安区西康路608号3楼WeWork 03-111
              </p>
            </div>
          </div>
        </div>
        
        <ContactForm />
        <SocialSelector />
      </main>
      <Footer />
    </SiteProvider>
  );
}
