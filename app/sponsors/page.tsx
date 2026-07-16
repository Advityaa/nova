import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";

const SPONSORS = [
  { name: "Dom Pérignon", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Dom_Perignon_Logo.svg" },
  { name: "Moët & Chandon", logo: "https://upload.wikimedia.org/wikipedia/en/3/3d/Mo%C3%ABt_%_%_Chandon_logo.svg" },
  { name: "Belvedere Vodka", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Belvedere_Vodka_logo.svg" },
  { name: "W Hotels", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/W_Hotels_logo.svg" },
  { name: "Red Bull", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/RedBullEnergyDrink.svg/1200px-RedBullEnergyDrink.svg.png" },
  { name: "Porsche", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Porsche_logo.svg" },
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
              <div key={i} style={{ padding: 20, background: 'rgba(255,255,255,0.05)', borderRadius: 8, width: '100%', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.logo} alt={s.name} style={{ maxWidth: '80%', maxHeight: '60%', objectFit: 'contain', filter: 'grayscale(100%) brightness(200%)' }} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </SiteProvider>
  );
}
