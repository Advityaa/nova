"use client";

import { useState } from "react";
import { INSTAGRAM_LINK } from "@/lib/data";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [openSec, setOpenSec] = useState<string | null>(null);

  const toggle = (sec: string) => setOpenSec(openSec === sec ? null : sec);

  function joinList() {
    if (email && email.includes("@")) {
      alert("You're on the list. See you on the floor.");
      setEmail("");
    } else {
      alert("Enter a valid email.");
    }
  }

  return (
    <footer id="tickets">
      <div className="shell">
        <div className="foot">
          <div className="brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/nova-logo.png" alt="Nova" />
            <p>Shanghai&apos;s after-dark, seven nights a week.</p>
            <div className="sub">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={joinList}>Join</button>
            </div>
          </div>
          <div className={`foot-sec ${openSec === "explore" ? "open" : ""}`}>
            <h4 onClick={() => toggle("explore")}>Explore</h4>
            <div className="foot-links">
              <a href="/events">Events</a>
              <a href="/about">About</a>
              <a href="/services">Services</a>
              <a href="/gallery">Gallery</a>
            </div>
          </div>
          <div className={`foot-sec ${openSec === "book" ? "open" : ""}`}>
            <h4 onClick={() => toggle("book")}>Book</h4>
            <div className="foot-links">
              <a href="/sponsors">Sponsors</a>
              <a href="/contact">Private events</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
          <div className={`foot-sec ${openSec === "follow" ? "open" : ""}`}>
            <h4 onClick={() => toggle("follow")}>Follow</h4>
            <div className="foot-links">
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener">Instagram</a>
              <a href="/contact">WeChat</a>
            </div>
          </div>
          <div className={`foot-sec ${openSec === "legal" ? "open" : ""}`}>
            <h4 onClick={() => toggle("legal")}>Legal</h4>
            <div className="foot-links">
              <a href="/terms">Terms &amp; Conditions</a>
              <a href="/privacy">Privacy Policy</a>
              <a href="/refunds">Refunds &amp; Cancellations</a>
            </div>
          </div>
        </div>
        <div className="foot-biz" style={{ 
          borderTop: "1px solid var(--line)", 
          marginTop: "40px", 
          paddingTop: "20px", 
          fontSize: "12px", 
          color: "var(--ink-dim)", 
          lineHeight: "1.6",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          <strong style={{ color: "var(--ink)" }}>Naiwa (Shanghai) Culture Communication Co., Ltd. (奈瓦(上海)文化传播有限公司)</strong>
          <span><strong>Reg No:</strong> 91310000MA1GMEUA46</span>
          <span><strong>Address:</strong> No.608 XiKang Road WeWork 03-111, Jing An District, Shanghai (上海市静安区西康路608号3楼WeWork 03-111)</span>
          <span><strong>Email:</strong> novaeventsshanghai@gmail.com | <strong>Phone:</strong> +86 13524177794</span>
        </div>
        <div className="foot-bot" style={{ marginTop: "20px", borderTop: "none", paddingTop: "0" }}>
          <span>© 2026 Nova Events Shanghai</span>
          <span>Built for the night</span>
        </div>
      </div>
    </footer>
  );
}
