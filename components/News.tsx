import { type NewsItem } from "@/lib/data";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path
        d="M7 17L17 7M17 7H9M17 7v8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function News({ news }: { news: NewsItem[] }) {
  return (
    <section className="sec" id="news">
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow">Press</span>
          <h2>In the news</h2>
        </div>
        <div className="r">As featured on SmartShanghai</div>
      </div>
      <div className="news">
        {news.map((a) => (
          <a
            className="narticle"
            key={a.href}
            href={a.href}
            target="_blank"
            rel="noopener"
          >
            <div className="ntop">
              <span className="nsrc">SmartShanghai</span>
              <span>{a.tag}</span>
            </div>
            <h3>{a.title}</h3>
            <p>{a.body}</p>
            <span className="nread">
              Read on SmartShanghai <ArrowIcon />
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
