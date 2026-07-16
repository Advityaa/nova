import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

const SPONSORS = [
  { name: "Partner 1", logo: "/sponsors/1.jpg" },
  { name: "Partner 2", logo: "/sponsors/2.png" },
  { name: "Partner 3", logo: "/sponsors/3.png" },
  { name: "Partner 4", logo: "/sponsors/4.png" },
  { name: "Partner 5", logo: "/sponsors/5.png" },
];

export default function SponsorsPage() {
  return (
    <SiteProvider events={[]} featuredId={null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh' }}>
        <section className="sec">
          <div className="rev" style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2>Official Partners</h2>
            <p style={{ color: 'var(--ink-dim)' }}>The brands that power our experiences.</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, alignItems: 'center', justifyItems: 'center', padding: '0 20px' }}>
            {SPONSORS.map((s, i) => (
              <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 8, width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={s.logo} 
                  alt={s.name} 
                  style={{ 
                    maxWidth: '80%', 
                    maxHeight: '60%', 
                    objectFit: 'contain', 
                    filter: 'grayscale(100%) invert(100%) brightness(100)',
                    mixBlendMode: 'screen'
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
