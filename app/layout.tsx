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
  metadataBase: new URL("https://novaeventsgroup.com"),
  title: "NOVA — Shanghai",
  description: "Nova Events — Shanghai nightlife & events.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "NOVA — Shanghai",
    description: "Nova Events — Shanghai nightlife & events.",
    url: "https://novaeventsgroup.com",
    siteName: "NOVA Events",
    type: "website",
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
