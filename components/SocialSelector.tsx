"use client";

import { useState } from "react";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_LINK,
  WECHAT_ID,
  WHATSAPP_LINK,
  type SocialKey,
} from "@/lib/data";

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M17.5 14.4c-.3-.15-1.7-.85-2-.95-.26-.1-.45-.15-.64.15-.19.28-.73.94-.9 1.13-.16.19-.33.21-.62.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.29-.02-.44.13-.59.13-.13.3-.34.44-.51.15-.17.2-.29.3-.48.1-.2.05-.36-.02-.51-.08-.15-.64-1.55-.88-2.12-.23-.55-.47-.48-.64-.49h-.55c-.19 0-.5.07-.76.36-.26.29-1 .98-1 2.38s1.02 2.76 1.16 2.95c.14.19 2.01 3.08 4.88 4.32.68.29 1.21.47 1.63.6.68.22 1.31.19 1.8.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34zM12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.5A10 10 0 1012 2z" />
    </svg>
  );
}
function IgIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .46 1.4.9.44.4.7.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.46 1-.9 1.4-.4.44-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42a3.8 3.8 0 01-1.4-.9 3.8 3.8 0 01-.9-1.4c-.17-.4-.36-1-.42-2.2C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.46-1 .9-1.4.4-.44.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.21 8.8 2.2 12 2.2zm0 4.86A4.94 4.94 0 1016.94 12 4.94 4.94 0 0012 7.06zm0 8.14A3.2 3.2 0 1115.2 12 3.2 3.2 0 0112 15.2zm6.29-8.34a1.15 1.15 0 11-1.15-1.15 1.15 1.15 0 011.15 1.15z" />
    </svg>
  );
}
function WcIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M8.7 4C4.9 4 2 6.6 2 9.9c0 1.8.9 3.4 2.5 4.5l-.6 1.9 2.2-1.1c.8.2 1.5.3 2.3.3h.5a5 5 0 01-.2-1.4c0-3 2.8-5.3 6.2-5.3h.6C15 6.1 12.2 4 8.7 4zM22 14.2c0-2.7-2.6-4.9-5.8-4.9s-5.8 2.2-5.8 4.9 2.6 4.9 5.8 4.9c.7 0 1.3-.1 1.9-.3l1.8.9-.5-1.6c1.6-.9 2.6-2.3 2.6-3.9z" />
    </svg>
  );
}

const QR: Record<SocialKey, string> = {
  wa: "/qr/whatsapp.jpg",
  ig: "/qr/instagram.jpg",
  wc: "/qr/wechat.jpg",
};

export default function SocialSelector() {
  const [active, setActive] = useState<SocialKey>("wa");

  return (
    <section className="sec" id="connect">
      <div className="sec-head">
        <div className="l">
          <span className="eyebrow">Find us</span>
          <h2>Connect</h2>
        </div>
        <div className="r">WhatsApp · IG · WeChat</div>
      </div>
      <div className="social-block">
        <div className="social-panel">
          <div className="social-tabs">
            <button
              className={`wa${active === "wa" ? " on" : ""}`}
              onClick={() => setActive("wa")}
            >
              <WaIcon /> WhatsApp
            </button>
            <button
              className={`ig${active === "ig" ? " on" : ""}`}
              onClick={() => setActive("ig")}
            >
              <IgIcon /> Instagram
            </button>
            <button
              className={`wc${active === "wc" ? " on" : ""}`}
              onClick={() => setActive("wc")}
            >
              <WcIcon /> WeChat
            </button>
          </div>

          {active === "wa" && (
            <div className="sp-content">
              <h3>WhatsApp</h3>
              <p>
                Fastest way to reach the team for bookings, tickets and brand
                enquiries. Message Nova directly.
              </p>
            </div>
          )}

          {active === "ig" && (
            <div className="sp-content">
              <h3>Instagram</h3>
              <p>Recaps, teasers and the visual world of every Nova activation.</p>
            </div>
          )}

          {active === "wc" && (
            <div className="sp-content">
              <h3>WeChat</h3>
              <p>
                Join 20K+ followers and 150+ groups — the epicenter of the
                community. Add Nova to get on the list.
              </p>
            </div>
          )}
        </div>
        <div className="social-qr flex flex-col items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {active === "wa" && (
            <div className="flex flex-col items-center">
              <div className="font-mono text-[14px] text-[var(--accent)] tracking-wide mb-4 text-center">+91 75320 99689</div>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener" className="block transition-transform hover:scale-105">
                <img src={QR.wa} alt="WhatsApp QR" />
              </a>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {active === "ig" && (
            <div className="flex flex-col items-center">
              <div className="font-mono text-[14px] text-[var(--accent)] tracking-wide mb-4 text-center">@{INSTAGRAM_HANDLE}</div>
              <a href={INSTAGRAM_LINK} target="_blank" rel="noopener" className="block transition-transform hover:scale-105">
                <img src={QR.ig} alt="Instagram QR" />
              </a>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {active === "wc" && (
            <div className="flex flex-col items-center">
              <div className="font-mono text-[14px] text-[var(--accent)] tracking-wide mb-4 text-center">ID: {WECHAT_ID}</div>
              <button 
                onClick={() => alert(`WeChat ID: ${WECHAT_ID}\n\nScan the QR or search this ID in WeChat.`)}
                className="block w-full border-none bg-transparent p-0 cursor-pointer transition-transform hover:scale-105"
              >
                <img src={QR.wc} alt="WeChat QR" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
