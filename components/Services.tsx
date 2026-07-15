import { type ServiceItem } from "@/lib/data";

export default function Services({ services }: { services: ServiceItem[] }) {
  return (
    <section className="sec" id="services">
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow">What we do</span>
          <h2>Services</h2>
        </div>
        <div className="r">End-to-end</div>
      </div>
      <div className="services">
        {services.map((s) => (
          <div className="svc" key={s.n}>
            <div className="svc-n">{s.n}</div>
            <h3>{s.title}</h3>
            <ul>
              {s.items.map((li) => (
                <li key={li}>{li}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
