import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SiteProvider from "@/components/SiteProvider";
import { STATS, type EventItem } from "@/lib/data";
import { getOnsaleEvents, getFeaturedEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  let events: EventItem[] = [];
  let featured: EventItem | null = null;
  try {
    [events, featured] = await Promise.all([
      getOnsaleEvents(),
      getFeaturedEvent(),
    ]);
  } catch (err) {
    console.error("DB load failed:", err);
  }

  return (
    <SiteProvider events={events} featuredId={featured?.id ?? null}>
      <Nav />
      <main className="shell" style={{ paddingTop: '120px', minHeight: '80vh', paddingBottom: '80px' }}>
        <section className="sec" id="about">
          {/* WHO WE ARE */}
          <div className="about-hero rev">
            <div className="about-hero-top">
              <h1>Who<br />We Are</h1>
              <p>
                In an era of digital noise, Nova Events creates physical touchpoints that drive social currency. 
                We bridge the gap between elite hospitality and brand loyalty by transforming venues into immersive 
                &apos;Pinnacle Moments&apos;.
              </p>
            </div>
            </div>

          {/* GRADIENT SECTION */}
          <div className="about-gradient-sec rev">
            {/* WHY US */}
            <div className="why-us-grid">
              <div className="why-us-left">
                <h2>Why<br />Us</h2>
                <p>High-Octane Exposure</p>
                <p style={{ marginTop: 8 }}>Low-Friction Production</p>
              </div>
              <div className="why-us-cards">
                <div className="why-us-card">
                  <h3>Traditional Agency</h3>
                  <ul>
                    <li>High Build Costs</li>
                    <li>Static Decor</li>
                    <li>Zero Guaranteed Audience</li>
                  </ul>
                </div>
                <div className="why-us-card nova-card">
                  <h3 style={{ fontSize: 40 }}>NOVA</h3>
                  <ul>
                    <li>Efficient Plug-and-Play Production</li>
                    <li>Guaranteed Elite Audience</li>
                    <li>Global Social Visibility</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* MARKET DOMINANCE */}
            <div className="market-dom">
              <h2>Market Dominance:</h2>
              <p>Shanghai&apos;s Fastest Growing Event Community</p>
              <div className="market-stats">
                {STATS.map((s, i) => (
                  <div className="market-stat" key={i}>
                    <div className="n">{s.n}</div>
                    <div className="k">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RESULTS & TEAM */}
          <div className="results-section" style={{ marginTop: '120px' }}>
            <h2 style={{ 
              fontFamily: 'var(--disp)', 
              fontWeight: 900, 
              fontSize: 'clamp(32px, 5vw, 58px)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '40px',
              color: 'var(--ink)' 
            }}>
              How We Drive Results
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '30px' 
            }}>
              {/* Card 1 */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(15,10,12,1) 0%, rgba(45,20,15,1) 100%)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                    <circle cx="18" cy="6" r="1.5" />
                    <circle cx="6" cy="18" r="1.5" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '8px' }}>
                  Community Over<br/>Audience
                </h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                  The Science of Growth
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--ink-dim)' }}>
                  Our community doesn't just watch; they participate. Nova is officially recognized as the fastest-growing event ecosystem in the region, turning passive observers into active brand advocates.
                </p>
              </div>

              {/* Card 2 */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(10,10,20,1) 0%, rgba(30,15,50,1) 100%)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '8px' }}>
                  Glocal<br/>Visibility
                </h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                  Cross-Border Brand Resonance
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--ink-dim)' }}>
                  We offer a rare dual-market advantage by seamlessly integrating China's domestic social giants with international platforms. By synchronizing WeChat and RED with Instagram, we ensure your event achieves 360-degree visibility across both local tastemakers and the global elite.
                </p>
              </div>

              {/* Card 3 */}
              <div style={{
                background: 'linear-gradient(145deg, rgba(20,10,15,1) 0%, rgba(60,20,40,1) 100%)',
                border: '1px solid var(--line)',
                borderRadius: '16px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ marginBottom: '24px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 3v18h18M18 9l-5 5-4-4-6 6" />
                    <path d="M14 9h4v4" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', lineHeight: '1.2', marginBottom: '8px' }}>
                  Yield-Driven<br/>Execution
                </h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>
                  Commercial Precision
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--ink-dim)' }}>
                  Every project is optimized for high engagement and financial success. We treat event production as a profitable brand asset, ensuring high ROI with optimized production spend.
                </p>
              </div>
            </div>
          </div>

          <div className="team-section" style={{ marginTop: '120px' }}>
            <h2 style={{ 
              fontFamily: 'var(--disp)', 
              fontWeight: 900, 
              fontSize: 'clamp(32px, 5vw, 58px)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em', 
              marginBottom: '40px',
              color: 'var(--ink)' 
            }}>
              The Core Team
            </h2>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '30px' 
            }}>
              {/* Darpan */}
              <div>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '308/210', 
                  overflow: 'hidden',
                  marginBottom: '20px',
                  border: '1px solid var(--line)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/team/darpan.jpg" alt="Darpan Agarwal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Darpan<br/>Agarwal
                </h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', lineHeight: '1.6', letterSpacing: '0.04em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
                  Innovative vision and creative thinking aspire to create value and leveraging \ analytical and problem-solving skills picked up from more than 7 countries \ leading different projects and 3 top leading business schools
                </p>
              </div>

              {/* Bonnie */}
              <div>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '308/210', 
                  overflow: 'hidden',
                  marginBottom: '20px',
                  border: '1px solid var(--line)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/team/bonnie.jpg" alt="Bonnie Wang" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Bonnie<br/>Wang
                </h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', lineHeight: '1.6', letterSpacing: '0.04em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
                  Educated at top-tier UK business schools, with early-career experience in international banking and finance. Combines strong financial and strategic analysis with hands-on leadership in strategy, brand positioning, and go-to-market execution across China's F&B and entertainment sectors.
                </p>
              </div>

              {/* Nacim */}
              <div>
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '308/210', 
                  overflow: 'hidden',
                  marginBottom: '20px',
                  border: '1px solid var(--line)'
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/team/nacim.jpg" alt="Nacim Elcure" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Nacim<br/>Elcure
                </h3>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', lineHeight: '1.6', letterSpacing: '0.04em', color: 'var(--ink-dim)', textTransform: 'uppercase' }}>
                  • Major in Finance, International Trade & Marketing.<br/>
                  • Diploma course in International Management.<br/>
                  Shanghai University MBA.
                </p>
              </div>
            </div>
          </div>

          {/* CLOSING / FOOTER TEXT */}
          <div className="rev" style={{ textAlign: 'center', maxWidth: 800, margin: '80px auto 40px', color: 'var(--ink-dim)' }}>
            <h3 style={{ fontFamily: 'var(--disp)', fontSize: 'clamp(24px, 4vw, 36px)', color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>From the Venue to the Feed</h3>
            <p style={{ fontSize: 16, lineHeight: 1.6 }}>
              With 1000+ guests per activation, each a curated digital storyteller, Nova generates thousands of organic impressions in real time across WeChat and Instagram.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </SiteProvider>
  );
}
