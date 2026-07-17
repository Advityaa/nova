import type { Config } from "tailwindcss";

/**
 * Nova Events design tokens — extracted from the approved `nova.html` prototype.
 * Do not redesign; these values mirror the prototype's CSS `:root` variables.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        ink: "var(--ink)",
        "ink-dim": "var(--ink-dim)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        // Per-event "mood" colors (used later, one per event)
        mood: {
          techno: "var(--mood-techno)",
          rooftop: "var(--mood-rooftop)",
          pool: "var(--mood-pool)",
          "blue-techno": "var(--mood-blue-techno)",
        },
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      fontFamily: {
        // Display headings
        display: ["var(--font-archivo)", "system-ui", "sans-serif"],
        // Body copy
        body: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        // All numeric / data (dates, prices, times)
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
