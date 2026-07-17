import React from "react";

// Update this array with only the "big name" sponsors you'd like to show on the homepage.
const BIG_SPONSORS = [
  { name: "Partner 1", logo: "/sponsors/1_white.png" },
  { name: "Partner 2", logo: "/sponsors/2_white.png" },
  { name: "Partner 3", logo: "/sponsors/3_white.png" },
  { name: "Partner 4", logo: "/sponsors/4_white.png" },
  { name: "Partner 5", logo: "/sponsors/5_white.png" },
  { name: "Partner 6", logo: "/sponsors/6_white.png" },
  { name: "Partner 7", logo: "/sponsors/7_white.png" },
  { name: "Partner 8", logo: "/sponsors/8_white.png" },
];

export default function SponsorMarquee() {
  return (
    <div className="w-full overflow-hidden bg-black py-8 border-b border-[var(--line)]">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {/* Render the list twice to create a seamless looping effect */}
        {[...BIG_SPONSORS, ...BIG_SPONSORS].map((sponsor, i) => (
          <div
            key={i}
            className="flex items-center justify-center w-32 md:w-48 mx-6 opacity-50 hover:opacity-100 transition-opacity duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="max-w-full max-h-12 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
