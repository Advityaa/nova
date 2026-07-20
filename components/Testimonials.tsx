import React from 'react';

const TESTIMONIALS = [
  {
    quote: "Nova Events completely transformed our brand activation in Shanghai. Flawless execution from start to finish.",
    author: "Elena Rostov",
    company: "Marketing Director, Global Fashion Brand"
  },
  {
    quote: "The best nightlife curators in the city. Their attention to detail and atmosphere is unmatched.",
    author: "Marcus Chen",
    company: "Managing Partner, Premium Hospitality Group"
  },
  {
    quote: "Working with Nova was the best decision for our annual gala. They handled everything seamlessly.",
    author: "Sarah Jenkins",
    company: "Event Coordinator, Tech Enterprise"
  },
  {
    quote: "The energy and crowd they brought to our venue residency revitalized our entire weekend program.",
    author: "David Wu",
    company: "Venue Owner, Downtown Club"
  },
  {
    quote: "Absolute professionals. Their artist booking network is top-tier and they negotiated perfectly on our behalf.",
    author: "Liam O'Connor",
    company: "Festival Organizer, Summer Beats Festival"
  },
  {
    quote: "From lighting design to talent curation, Nova Events delivered a world-class experience.",
    author: "Chloe Martinez",
    company: "Creative Director, Creative Agency"
  },
  {
    quote: "They understand the upscale market better than anyone else. Highly recommended.",
    author: "Wei Lin",
    company: "Brand Manager, Luxury Spirits"
  },
  {
    quote: "A seamless partnership. They took our vision and scaled it to a 2,000-person unforgettable night.",
    author: "Amanda Sterling",
    company: "Head of PR, Lifestyle Magazine"
  },
  {
    quote: "Nova's team is reliable, creative, and always pushes boundaries. We won't work with anyone else.",
    author: "James Takahashi",
    company: "Sponsorship Lead, Beverage Conglomerate"
  },
  {
    quote: "Our private event was exclusive, sophisticated, and executed with absolute precision.",
    author: "Isabella Rossi",
    company: "Private Client, Shanghai VIP"
  },
  {
    quote: "The pre-event marketing and on-the-ground management were perfectly synchronized.",
    author: "Thomas Wright",
    company: "Operations Manager, International Exhibitions"
  },
  {
    quote: "If you want a premium, high-energy event that leaves a lasting impression, call Nova.",
    author: "Michael Chang",
    company: "CEO, Media Group"
  }
];

export default function Testimonials() {
  return (
    <section className="sec t-sec" style={{ overflow: 'hidden' }}>
      <div className="shell">
        <div className="t-intro" style={{ marginBottom: '40px' }}>
          <span className="eyebrow">Client Feedback</span>
          <h2>What they say</h2>
        </div>
      </div>
      <div className="t-slider-wrapper">
        <div className="t-slider">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="t-card">
              <p className="t-quote">"{t.quote}"</p>
              <div className="t-meta">
                <span className="t-author">{t.author}</span>
                <span className="t-company">{t.company}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
