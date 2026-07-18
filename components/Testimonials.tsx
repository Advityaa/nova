import React from 'react';

const TESTIMONIALS = [
  {
    quote: "Nova Events completely transformed our brand activation in Shanghai. Flawless execution from start to finish.",
    author: "Marketing Director",
    company: "Global Fashion Brand"
  },
  {
    quote: "The best nightlife curators in the city. Their attention to detail and atmosphere is unmatched.",
    author: "Managing Partner",
    company: "Premium Hospitality Group"
  },
  {
    quote: "Working with Nova was the best decision for our annual gala. They handled everything seamlessly.",
    author: "Event Coordinator",
    company: "Tech Enterprise"
  },
  {
    quote: "The energy and crowd they brought to our venue residency revitalized our entire weekend program.",
    author: "Venue Owner",
    company: "Downtown Club"
  },
  {
    quote: "Absolute professionals. Their artist booking network is top-tier and they negotiated perfectly on our behalf.",
    author: "Festival Organizer",
    company: "Summer Beats Festival"
  },
  {
    quote: "From lighting design to talent curation, Nova Events delivered a world-class experience.",
    author: "Creative Director",
    company: "Creative Agency"
  },
  {
    quote: "They understand the upscale market better than anyone else. Highly recommended.",
    author: "Brand Manager",
    company: "Luxury Spirits"
  },
  {
    quote: "A seamless partnership. They took our vision and scaled it to a 2,000-person unforgettable night.",
    author: "Head of PR",
    company: "Lifestyle Magazine"
  },
  {
    quote: "Nova's team is reliable, creative, and always pushes boundaries. We won't work with anyone else.",
    author: "Sponsorship Lead",
    company: "Beverage Conglomerate"
  },
  {
    quote: "Our private event was exclusive, sophisticated, and executed with absolute precision.",
    author: "Private Client",
    company: "Shanghai VIP"
  },
  {
    quote: "The pre-event marketing and on-the-ground management were perfectly synchronized.",
    author: "Operations Manager",
    company: "International Exhibitions"
  },
  {
    quote: "If you want a premium, high-energy event that leaves a lasting impression, call Nova.",
    author: "CEO",
    company: "Media Group"
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
          {TESTIMONIALS.map((t, i) => (
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
