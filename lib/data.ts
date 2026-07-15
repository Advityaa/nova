// Static content ported from nova.html. In the next stage this comes from a DB;
// the shapes here are the props each component will accept.

export type Tier = {
  n: string; // tier name
  d: string; // tier description
  p: number; // price (¥)
};

export type EventItem = {
  id: string;
  name: string;
  type: string;
  color: string; // mood color
  ink: string; // ink color paired with the mood color
  lineup: string;
  weekday: string;
  date: string;
  time: string;
  venue: string;
  area: string;
  img: string;
  status: string;
  desc: string;
  tiers: Tier[];
};

export const EVENTS: EventItem[] = [
  {
    id: "blacklist",
    name: "Blacklist",
    type: "Rooftop",
    color: "#E0A03C",
    ink: "#0A0A0C",
    lineup: "RAIN / UACA",
    weekday: "FRI",
    date: "17.07",
    time: "20:00–02:00",
    venue: "Skyline Dome",
    area: "The Bund",
    img: "/images/event-blacklist.jpg",
    status: "Selling fast",
    desc: "A Tokyo-inspired night above the Bund. Deep house, handcrafted cocktails and Shanghai's most stylish crowd, with panoramic skyline views. One drink included.",
    tiers: [
      { n: "Early bird", d: "Incl. 1 drink", p: 118 },
      { n: "Regular", d: "Incl. 1 drink", p: 148 },
      { n: "Door", d: "On the night", p: 188 },
    ],
  },
  {
    id: "mass",
    name: "Mass × Sevenn",
    type: "Techno",
    color: "#864bff",
    ink: "#ffffff",
    lineup: "SEVENN — Afterlife (USA)",
    weekday: "SAT",
    date: "18.07",
    time: "23:00–late",
    venue: "Mass Club",
    area: "138 Middle Huaihai Rd",
    img: "/images/event-mass.jpg",
    status: "Few left",
    desc: "Afterlife artist Sevenn takes over Mass for the weekend. Progressive and tech-house, world-class sound, LED visuals and immersive lighting. Two drinks included.",
    tiers: [
      { n: "Early bird", d: "早鸟票 · 2 drinks", p: 98 },
      { n: "Regular", d: "预售票 · 2 drinks", p: 128 },
      { n: "Door", d: "现场票", p: 158 },
    ],
  },
  {
    id: "pool",
    name: "Sunset Pool",
    type: "Pool",
    color: "#FF4D8D",
    ink: "#0A0A0C",
    lineup: "NOVA Residents",
    weekday: "SUN",
    date: "20.07",
    time: "14:00–21:00",
    venue: "Rooftop Pool",
    area: "Jing'an",
    img: "/images/event-pool.jpg",
    status: "On sale",
    desc: "Sun, water and deep house. Nova's Sunday pool session runs from afternoon into golden hour. Bring your crew, we bring the soundtrack. Swimwear encouraged.",
    tiers: [
      { n: "Early bird", d: "Before 15:00", p: 100 },
      { n: "General", d: "Standard entry", p: 140 },
      { n: "Cabana", d: "Daybed + bottle", p: 600 },
    ],
  },
  {
    id: "warehouse",
    name: "Warehouse 04",
    type: "Techno",
    color: "#37b6ff",
    ink: "#0A0A0C",
    lineup: "NOVA Residents / Guests",
    weekday: "THU",
    date: "24.07",
    time: "22:00–late",
    venue: "Mass Club",
    area: "Huaihai Rd",
    img: "/images/event-warehouse.jpg",
    status: "On sale",
    desc: "Peak-time techno in the main room. Heads-down, lights-low, soundsystem-first. For the ones who came to dance.",
    tiers: [
      { n: "Early bird", d: "Limited", p: 80 },
      { n: "General", d: "Standard entry", p: 120 },
      { n: "VIP", d: "Table area", p: 350 },
    ],
  },
];

export const FEATURED_ID = "mass";

export const WEEK_META = `${EVENTS.length} events · 14–24 Jul`;

// ---- Gallery ----
export const GALLERY_IMAGES: string[] = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
];

// ---- Track record ----
export type ResultItem = {
  venue: string;
  quote: string;
  metrics: { n: string; k: string }[];
};

export const RESULTS: ResultItem[] = [
  {
    venue: "Park Hyatt · Level 91",
    quote: "A 3-year legacy: Golden Hour, the city's definitive NYE tradition",
    metrics: [
      { n: "550+", k: "Guests / activation" },
      { n: "100%", k: "Sell-out, 3 yrs" },
    ],
  },
  {
    venue: "Flair · Rooftop Series",
    quote: "The city's most viral rooftop series, a record-breaking activation",
    metrics: [
      { n: "1,200", k: "Peak guests" },
      { n: "100%", k: "Season consistency" },
    ],
  },
  {
    venue: "Grand Hyatt · 87F",
    quote: 'Skyline Vintage: a "new classic" for high-net-worth Shanghai',
    metrics: [
      { n: "1,200+", k: "Guests / 2 nights" },
      { n: "100%", k: "Sold out" },
    ],
  },
  {
    venue: "Bellagio · The Terrace",
    quote: "Epic Oasis: positioning the terrace as the elite's premier oasis",
    metrics: [
      { n: "3,500+", k: "Yearly guests" },
      { n: "700+", k: "Avg / event" },
    ],
  },
];

// ---- News ----
export type NewsItem = {
  href: string;
  tag: string;
  title: string;
  body: string;
};

export const NEWS: NewsItem[] = [
  {
    href: "https://www.smartshanghai.com/event/nova-events-presents-shanghai-summer-yacht-party-techno-chill-dxb-boat-party-2026-05-30",
    tag: "Yacht Party",
    title: "Shanghai Summer Yacht Party",
    body: "Nova, Boatriders and Techno N Chill take over the Huangpu River — three levels of music across two stages on the water.",
  },
  {
    href: "https://www.smartshanghai.com/events/nightlife/",
    tag: "Rooftop",
    title: "Tribeat on the Bund",
    body: "A rooftop party on the 33rd floor of Hyatt on the Bund with four international headliners — sunset into moonlight, nine hours of music.",
  },
  {
    href: "https://www.smartshanghai.com/event/golden-2026-nye-countdown-party-by-nova-events-at-bellagio-shanghai-2025-12-31",
    tag: "NYE",
    title: "Golden NYE at Bellagio",
    body: "Nova's New Year countdown inside the Bellagio ballroom — a giant LED countdown, five DJs and free-flow drinks into 2026.",
  },
];

// ---- Services ----
export type ServiceItem = {
  n: string;
  title: string;
  items: string[];
};

export const SERVICES: ServiceItem[] = [
  {
    n: "01",
    title: "Creative Production",
    items: [
      "Immersive theme concepting",
      "Curation of international & local talent",
      "Atmospheric lighting & sound architecture",
      "High-engagement photo/video moments",
    ],
  },
  {
    n: "02",
    title: "Strategic Marketing",
    items: [
      "Targeted promotion to 30,000+ verified guests",
      "Influencer & KOL integration (RED/IG)",
      "Pre-event hype & post-event recap campaigns",
      "Database management",
    ],
  },
  {
    n: "03",
    title: "Management & Execution",
    items: [
      "End-to-end project management",
      "On-site operations & guest flow control",
      "Luxury venue & hotel liaison",
      "Commercial ROI tracking",
    ],
  },
  {
    n: "04",
    title: "Artist Management",
    items: [
      "Global & local DJs, performers, musicians",
      "Vibe curation & tailored soundscapes",
      "End-to-end booking & talent hospitality",
    ],
  },
  {
    n: "05",
    title: "Production Design",
    items: [
      "Custom stage, lighting & LED setups",
      "Bespoke VJ sets & motion graphics",
      "On-site technical management & rigging",
    ],
  },
  {
    n: "06",
    title: "Visual & Editorial",
    items: [
      "Concept development & recurring event IP",
      "Premium posters & motion teasers",
      "WeChat & RED copywriting / layout",
    ],
  },
];

// ---- Stats (about) ----
export const STATS: { n: string; k: string }[] = [
  { n: "80", k: "Premium events / yr" },
  { n: "700+", k: "Avg guests / event" },
  { n: "20K", k: "WeChat followers" },
  { n: "15K+", k: "IG & RED followers" },
];

// ---- Socials ----
export const WHATSAPP_NUMBER = "917532099689";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const INSTAGRAM_HANDLE = "novaeventsshanghai";
export const INSTAGRAM_LINK = "https://www.instagram.com/novaeventsshanghai";
export const WECHAT_ID = "Novaevents";

export type SocialKey = "wa" | "ig" | "wc";

// ---- Music queue ----
export type Track = { title: string; src: string };

export const QUEUE: Track[] = [
  { title: "Fire Fire", src: "/audio/fire-fire.mp3" },
  { title: "Move", src: "/audio/move.mp3" },
  { title: "Ma Tanasi", src: "/audio/ma-tanasi.mp3" },
];
