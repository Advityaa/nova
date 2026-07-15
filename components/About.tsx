import { STATS } from "@/lib/data";

export default function About() {
  return (
    <section className="sec" id="about">
      <div className="about">
        <div className="rev">
          <span className="eyebrow">Redefining luxury engagement</span>
          <h2>
            Architecture
            <br />
            of atmosphere
          </h2>
          <p>
            In an era of digital noise, Nova creates physical touchpoints that
            drive social currency — bridging elite hospitality and brand loyalty
            by turning venues into immersive &apos;Pinnacle Moments&apos;.
          </p>
          <p>
            From the venue to the feed: with 700+ guests per activation, each a
            curated digital storyteller, Nova generates thousands of organic
            impressions in real time across WeChat, RED and Instagram.
            Shanghai&apos;s fastest-growing event community.
          </p>
        </div>
        <div className="statgrid rev">
          {STATS.map((s) => (
            <div className="s" key={s.k}>
              <div className="n">{s.n}</div>
              <div className="k">{s.k}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
