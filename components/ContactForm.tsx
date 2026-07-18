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

// WaIcon removed

export default function ContactForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function sendEnquiry() {
    if (!name.trim() || !contact.trim()) {
      alert("Please add your name and how we can reach you.");
      return;
    }
    
    setSubmitting(true);
    
    const res = await submitEnquiry({
      name,
      company,
      contact,
      eventType: type,
      message: msg,
    });
    
    setSubmitting(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
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
            <label>Phone Number (with Country Code)</label>
            <input
              placeholder="+86 123 4567 8900"
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
          {success ? (
            <div style={{ padding: '24px', background: 'var(--bg-soft)', border: '1px solid var(--accent)', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--accent)', marginBottom: '8px', fontFamily: 'var(--disp)', fontSize: '24px', textTransform: 'uppercase' }}>Enquiry Sent</h3>
              <p style={{ color: 'var(--ink)' }}>Someone from our team will contact you shortly.</p>
            </div>
          ) : (
            <>
              <button className="submit" onClick={sendEnquiry} disabled={submitting} style={{ opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Sending..." : "Submit Enquiry"}
              </button>
              <div className="cnote">
                We typically respond within 24 hours.
              </div>
            </>
          )}
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
