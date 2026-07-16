import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

const SPONSORS = [
  { name: "Partner 1", logo: "/sponsors/1_white.png" },
  { name: "Partner 2", logo: "/sponsors/2_white.png" },
  { name: "Partner 3", logo: "/sponsors/3_white.png" },
  { name: "Partner 4", logo: "/sponsors/4_white.png" },
  { name: "Partner 5", logo: "/sponsors/5_white.png" },
  { name: "Partner 6", logo: "/sponsors/6_white.png" },
  { name: "Partner 7", logo: "/sponsors/7_white.png" },
  { name: "Partner 8", logo: "/sponsors/8_white.png" },
  { name: "Partner 9", logo: "/sponsors/9_white.png" },
  { name: "Partner 10", logo: "/sponsors/10_white.png" },
  { name: "Partner 11", logo: "/sponsors/11_white.png" },
  { name: "Partner 12", logo: "/sponsors/12_white.png" },
  { name: "Partner 13", logo: "/sponsors/13_white.png" },
  { name: "Partner 14", logo: "/sponsors/14_white.png" },
  { name: "Partner 15", logo: "/sponsors/15_white.png" },
  { name: "Partner 16", logo: "/sponsors/16_white.png" },
  { name: "Partner 17", logo: "/sponsors/17_white.png" },
  { name: "Partner 18", logo: "/sponsors/18_white.png" },
];

export default function SponsorsPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="sec">
          <div className="rev" style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2>Official Partners</h2>
            <p style={{ color: 'var(--ink-dim)' }}>The brands that power our experiences.</p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '20px', 
            alignItems: 'center', 
            justifyItems: 'center', 
            padding: '0 15px' 
          }}>
            {SPONSORS.map((s, i) => (
              <div key={i} style={{ 
                padding: 15, 
                background: 'rgba(255,255,255,0.02)', 
                borderRadius: 8, 
                width: '100%', 
                height: 100, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={s.logo} 
                  alt={s.name} 
                  style={{ 
                    maxWidth: '90%', 
                    maxHeight: '70%', 
                    objectFit: 'contain'
                  }} 
                />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </SiteProvider>
  );
}
