"use client";

import { useState } from "react";
import { INSTAGRAM_HANDLE, INSTAGRAM_LINK, WHATSAPP_LINK, WHATSAPP_NUMBER } from "@/lib/data";
import { submitEnquiry } from "@/app/actions";

const EVENT_TYPES = [
  "Brand activation",
  "Venue residency",
  "Private event",
  "Artist booking",
  "Sponsorship",
  "Other",
];

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.45-.15-.64.15-.19.28-.73.94-.9 1.13-.16.19-.33.21-.62.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.29-.02-.44.13-.59.13-.13.3-.34.44-.51.15-.17.2-.29.3-.48.1-.2.05-.36-.02-.51-.08-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.16 2.95c.14.19 2.01 3.08 4.88 4.32.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2z" />
    </svg>
  );
}

export default function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [msg, setMsg] = useState("");

  async function sendEnquiry() {
    if (!name.trim() || !contact.trim()) {
      alert("Please add your name and how we can reach you.");
      return;
    }
    // Persist to the DB (best-effort — we still open WhatsApp regardless).
    submitEnquiry({
      name,
      company,
      contact,
      eventType: type,
      message: msg,
    }).catch(() => {});

    const lines = [
      "New enquiry via nova site",
      "Name: " + name.trim(),
      company.trim() ? "Company/Venue: " + company.trim() : "",
      "Contact: " + contact.trim(),
      "Event type: " + type,
      msg.trim() ? "Details: " + msg.trim() : "",
    ]
      .filter(Boolean)
      .join("\n");
    const url = WHATSAPP_LINK + "?text=" + encodeURIComponent(lines);
    window.open(url, "_blank");
  }

  return (
    <section className="sec" id="contact">
      <div className="contact">
        <div className="contact-intro">
          <span className="eyebrow">Work with us</span>
          <h2>
            Let&apos;s make your next event <em>unforgettable</em>
          </h2>
          <p>
            Brand activation, venue residency or private event — tell us what
            you&apos;re planning and the team will be in touch.
          </p>
          <div className="ci-meta">
            WhatsApp{" "}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener">
              +{WHATSAPP_NUMBER.slice(0, 2)} {WHATSAPP_NUMBER.slice(2, 7)}{" "}
              {WHATSAPP_NUMBER.slice(7)}
            </a>
            <br />
            WeChat <b>Novaevents</b>
            <br />
            IG{" "}
            <a href={INSTAGRAM_LINK} target="_blank" rel="noopener">
              @{INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>
        <div className="cform">
          <div>
            <label>Name</label>
            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Company / venue</label>
            <input
              placeholder="Optional"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div>
            <label>Email or phone</label>
            <input
              placeholder="How we reach you"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div>
            <label>Event type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {EVENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="full">
            <label>Tell us about it</label>
            <textarea
              placeholder="Date, venue, guest count, vision…"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
          </div>
          <button className="submit" onClick={sendEnquiry}>
            <WaIcon /> Send via WhatsApp
          </button>
          <div className="cnote">
            Opens WhatsApp with your enquiry pre-filled — one tap to send.
          </div>
        </div>
      </div>

      <div className="contact-address" style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid var(--line)', maxWidth: '1320px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h3 style={{ fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase', marginBottom: '16px', color: 'var(--ink)' }}>Office Address</h3>
        <p style={{ color: 'var(--ink-dim)', lineHeight: '1.6' }}>
          <strong>NOVA SHANGHAI</strong><br />
          No.608 XiKang Road WeWork 03-111, Jing An District, Shanghai<br />
          上海市静安区西康路608号3楼WeWork 03-111
        </p>
      </div>
    </section>
  );
}
