"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { n: "01", label: "About", href: "/about" },
  { n: "02", label: "Contact", href: "/contact" },
  { n: "03", label: "Events", href: "/events" },
  { n: "04", label: "Gallery", href: "/gallery" },
  { n: "05", label: "Results", href: "/results" },
  { n: "06", label: "Services", href: "/services" },
  { n: "07", label: "Sponsors", href: "/sponsors" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    const threshold = 80; // px before the logo morphs
    function onScroll() {
      setScrolled(window.scrollY > threshold);
    }
    onScroll(); // set initial state
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Floating header bar — holds logo + menu fab */}
      <header className={`topbar${scrolled ? " scrolled" : ""}`}>
        <a href="/" aria-label="Nova home" className="topbar-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nova-logo.png" alt="Nova" />
        </a>

        <button
          className={`menu-fab${open ? " open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

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
