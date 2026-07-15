"use client";

import { useState } from "react";

const LINKS = [
  { n: "01", label: "Events", href: "#events" },
  { n: "02", label: "About", href: "#about" },
  { n: "03", label: "Services", href: "#services" },
  { n: "04", label: "Gallery", href: "#gallery" },
  { n: "05", label: "Results", href: "#press" },
  { n: "06", label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/nova-logo.png" className="logo-float" alt="Nova" />

      <button
        className={`menu-fab${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`overlay${open ? " open" : ""}`} id="overlay">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={close}>
            <span className="n">{l.n}</span>
            {l.label}
          </a>
        ))}
        <div className="foot">
          <span>Shanghai · Est. 2015</span>
          <span>
            <a href="#">Instagram</a> &nbsp; <a href="#">WeChat: Novaevents</a>{" "}
            &nbsp; <a href="#">RED</a>
          </span>
        </div>
      </nav>
    </>
  );
}
