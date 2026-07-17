import type { Metadata } from "next";
import { Archivo, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Display headings — weights 400–900 (heavy 800/900 used for the wordmark)
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

// Body copy
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

// All numeric / data — dates, prices, times
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.novaeventsgroup.com"),
  title: {
    default: "NOVA Events | Shanghai Luxury Event Planner & Corporate Management",
    template: "%s | NOVA Events Shanghai",
  },
  description: "Nova Events is Shanghai's premier luxury event planner and corporate event management agency. We specialize in high-end nightlife, yacht parties, and premium brand activations across Greater China.",
  keywords: ["Shanghai event organizer", "luxury event planning Shanghai", "corporate events Shanghai", "nightlife organizer Shanghai", "yacht parties Shanghai", "premium events China", "Nova Events"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "NOVA Events | Shanghai Luxury Event Planner",
    description: "Shanghai's premier luxury event planner and corporate management agency. Curation of high-end nightlife, yacht parties, and premium brand activations.",
    url: "https://www.novaeventsgroup.com",
    siteName: "NOVA Events",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOVA Events | Shanghai Luxury Event Planner",
    description: "Shanghai's premier luxury event planner and corporate management agency.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
