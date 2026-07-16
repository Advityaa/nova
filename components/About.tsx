import { STATS } from "@/lib/data";

export default function About() {
  return (
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
        <div className="about-hero-grid">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/event-blacklist.jpg" alt="Shanghai Skyline Party" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/event-mass.jpg" alt="DJ Performing" />
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

      {/* CLOSING / FOOTER TEXT */}
      <div className="rev" style={{ textAlign: 'center', maxWidth: 800, margin: '80px auto 40px', color: 'var(--ink-dim)' }}>
        <h3 style={{ fontFamily: 'var(--disp)', fontSize: 'clamp(24px, 4vw, 36px)', color: '#fff', textTransform: 'uppercase', marginBottom: 16 }}>From the Venue to the Feed</h3>
        <p style={{ fontSize: 16, lineHeight: 1.6 }}>
          With 700+ guests per activation, each a curated digital storyteller, Nova generates thousands of organic impressions in real time across WeChat, RED and Instagram.
        </p>
      </div>
    </section>
  );
}
