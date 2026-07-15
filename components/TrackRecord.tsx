import { type ResultItem } from "@/lib/data";

export default function TrackRecord({ results }: { results: ResultItem[] }) {
  return (
    <section className="sec" id="press">
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow">They trust us</span>
          <h2>Track record</h2>
        </div>
        <div className="r">Verified results</div>
      </div>
      <div className="results">
        {results.map((r) => (
          <div className="result" key={r.venue}>
            <div className="r-venue">{r.venue}</div>
            <div className="r-quote">{r.quote}</div>
            <div className="r-metrics">
              {r.metrics.map((m) => (
                <div key={m.k}>
                  <span className="m-n">{m.n}</span>
                  <span className="m-k">{m.k}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
