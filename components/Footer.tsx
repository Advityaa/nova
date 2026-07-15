"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");

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
          <div>
            <h4>Explore</h4>
            <a href="#events">This week</a>
            <a href="#">Calendar</a>
            <a href="#vip">Tables</a>
            <a href="#about">About</a>
          </div>
          <div>
            <h4>Book</h4>
            <a href="#vip">VIP tables</a>
            <a href="#">Private events</a>
            <a href="#">Guestlist</a>
            <a href="#">WeChat: Novaevents</a>
          </div>
          <div>
            <h4>Follow</h4>
            <a href="#">Instagram</a>
            <a href="#">WeChat</a>
            <a href="#">RED / 小红书</a>
            <a href="#">TikTok</a>
          </div>
        </div>
        <div className="foot-bot">
          <span>© 2026 Nova Events Shanghai</span>
          <span>Built for the night</span>
        </div>
      </div>
    </footer>
  );
}
