/* atlas / lib / data — the trip-planner dataset.

   Everything visual about a destination is *data*: the landscape art in the
   hero tile is layered CSS (sky gradient + sun disc + two mountain ridges)
   painted from `sky` / `sun` / `ridge` colour tokens per city — zero bitmaps,
   zero SVG files, no emoji. Flights, stays, budget, forecast, activities and
   the packing lists all hang off the trip ids so every tile, detail sheet and
   stat is derived from one source of truth. */

export type SkyStops = [string, string, string];

export interface Destination {
  id: string;
  city: string;
  country: string;
  code: string; // airport code
  days: number; // planned trip length
  blurb: string;
  /* generative landscape art parameters (pure CSS) */
  sky: SkyStops; // gradient top → bottom
  sun: string; // sun disc colour
  glow: string; // horizon haze
  ridge: [string, string]; // far → near mountain silhouette
  haze: string; // detail-sheet sky haze
  forecast: DayForecast[];
  flights: Flight[];
  stay: Stay;
  budget: Budget;
  activities: Activity[];
}

export interface DayForecast {
  day: string; // Mon..Sun
  lo: number;
  hi: number;
  cond: "sun" | "part" | "rain" | "cloud";
}

export interface Flight {
  code: string;
  from: string;
  to: string;
  when: string;
  seat: string;
  status: string;
  live: boolean; // on-time / boarding → accent dot
}

export interface Stay {
  name: string;
  area: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  rating: number;
}

export interface Budget {
  spent: number;
  total: number;
  currency: string;
  buckets: { label: string; amount: number; color: string }[];
}

export interface Activity {
  time: string;
  name: string;
  where: string;
}

/* ------------------------------------------------------------------ */
/* Destinations (current trip first — its index is the persisted tripIdx) */
/* ------------------------------------------------------------------ */

export const TRIPS: Destination[] = [
  {
    id: "kyoto",
    city: "Kyoto",
    country: "Japan",
    code: "KIX",
    days: 6,
    blurb: "Temple mornings, lantern evenings",
    sky: ["#31244e", "#a4506b", "#f2a86e"],
    sun: "#ffd08a",
    glow: "rgba(242, 168, 110, 0.45)",
    ridge: ["#3a2f52", "#1f1a30"],
    haze: "rgba(242, 168, 110, 0.25)",
    forecast: [
      { day: "Mon", lo: 12, hi: 21, cond: "sun" },
      { day: "Tue", lo: 13, hi: 23, cond: "sun" },
      { day: "Wed", lo: 11, hi: 19, cond: "part" },
      { day: "Thu", lo: 10, hi: 18, cond: "rain" },
      { day: "Fri", lo: 12, hi: 20, cond: "part" },
      { day: "Sat", lo: 13, hi: 22, cond: "sun" },
      { day: "Sun", lo: 11, hi: 17, cond: "cloud" },
    ],
    flights: [
      { code: "JL 631", from: "HND", to: "KIX", when: "Sat 09:05", seat: "14A", status: "On time", live: true },
      { code: "JL 638", from: "KIX", to: "HND", when: "Thu 18:40", seat: "7C", status: "Gate B22", live: false },
    ],
    stay: { name: "Ryokan Ayanokoji", area: "Shimogyo Ward", checkIn: "Sat 15:00", checkOut: "Fri 10:00", nights: 6, rating: 4.8 },
    budget: {
      spent: 1240,
      total: 2600,
      currency: "$",
      buckets: [
        { label: "Flights", amount: 780, color: "#ff7a45" },
        { label: "Stay", amount: 310, color: "#38bdf8" },
        { label: "Food", amount: 105, color: "#a3e635" },
        { label: "Rail pass", amount: 45, color: "#facc15" },
      ],
    },
    activities: [
      { time: "07:30", name: "Fushimi Inari at dawn", where: "Taisha-sha" },
      { time: "13:00", name: "Nishiki market crawl", where: "Nishiki-en" },
      { time: "19:30", name: "Kaiseki dinner", where: "Gion" },
    ],
  },
  {
    id: "lisbon",
    city: "Lisbon",
    country: "Portugal",
    code: "LIS",
    days: 5,
    blurb: "Tiled hills and Atlantic light",
    sky: ["#123a5d", "#2f7fae", "#9fd3ea"],
    sun: "#ffe9a8",
    glow: "rgba(159, 211, 234, 0.45)",
    ridge: ["#274a63", "#14283a"],
    haze: "rgba(159, 211, 234, 0.25)",
    forecast: [
      { day: "Mon", lo: 15, hi: 24, cond: "sun" },
      { day: "Tue", lo: 16, hi: 25, cond: "sun" },
      { day: "Wed", lo: 14, hi: 22, cond: "part" },
      { day: "Thu", lo: 13, hi: 21, cond: "cloud" },
      { day: "Fri", lo: 15, hi: 23, cond: "sun" },
      { day: "Sat", lo: 16, hi: 26, cond: "sun" },
      { day: "Sun", lo: 14, hi: 20, cond: "rain" },
    ],
    flights: [
      { code: "TP 841", from: "JFK", to: "LIS", when: "Fri 21:45", seat: "22C", status: "Boarding", live: true },
      { code: "TP 834", from: "LIS", to: "JFK", when: "Fri 13:20", seat: "18A", status: "On time", live: true },
    ],
    stay: { name: "Casa do Príncipe", area: "Príncipe Real", checkIn: "Sat 14:00", checkOut: "Fri 11:00", nights: 5, rating: 4.7 },
    budget: {
      spent: 860,
      total: 1900,
      currency: "$",
      buckets: [
        { label: "Flights", amount: 540, color: "#ff7a45" },
        { label: "Stay", amount: 240, color: "#38bdf8" },
        { label: "Food", amount: 80, color: "#a3e635" },
      ],
    },
    activities: [
      { time: "10:00", name: "Belém + pasteis", where: "Belém" },
      { time: "15:00", name: "Alfama tram 28", where: "Martim Moniz" },
      { time: "20:00", name: "Fado in a tiny tavern", where: "Mouraria" },
    ],
  },
  {
    id: "cusco",
    city: "Cusco",
    country: "Peru",
    code: "CUZ",
    days: 8,
    blurb: "High Andes, Inca stone",
    sky: ["#20303a", "#4d8a8c", "#a5c9b4"],
    sun: "#ffe27a",
    glow: "rgba(165, 201, 180, 0.4)",
    ridge: ["#33555c", "#15272e"],
    haze: "rgba(165, 201, 180, 0.22)",
    forecast: [
      { day: "Mon", lo: 4, hi: 19, cond: "sun" },
      { day: "Tue", lo: 3, hi: 18, cond: "part" },
      { day: "Wed", lo: 2, hi: 16, cond: "rain" },
      { day: "Thu", lo: 1, hi: 17, cond: "cloud" },
      { day: "Fri", lo: 3, hi: 19, cond: "sun" },
      { day: "Sat", lo: 4, hi: 20, cond: "sun" },
      { day: "Sun", lo: 2, hi: 15, cond: "rain" },
    ],
    flights: [
      { code: "LA 2203", from: "LIM", to: "CUZ", when: "Sun 08:10", seat: "5F", status: "On time", live: true },
      { code: "LA 2211", from: "CUZ", to: "LIM", when: "Wed 17:05", seat: "12B", status: "Delayed 40m", live: false },
    ],
    stay: { name: "Tierra Inn Plaza", area: "San Blas", checkIn: "Sun 13:00", checkOut: "Sun 09:00", nights: 8, rating: 4.6 },
    budget: {
      spent: 1520,
      total: 2400,
      currency: "$",
      buckets: [
        { label: "Flights", amount: 640, color: "#ff7a45" },
        { label: "Treks", amount: 620, color: "#a3e635" },
        { label: "Stay", amount: 260, color: "#38bdf8" },
      ],
    },
    activities: [
      { time: "06:00", name: "Inca Trail day 2", where: "Dead Woman's Pass" },
      { time: "13:30", name: "San Pedro market", where: "Cusco" },
      { time: "19:00", name: "Pisco night", where: "Plaza de Armas" },
    ],
  },
  {
    id: "marrakech",
    city: "Marrakech",
    country: "Morocco",
    code: "RAK",
    days: 4,
    blurb: "Souk maze, Atlas shadow",
    sky: ["#1e4d4f", "#c76b35", "#f7b955"],
    sun: "#ffdc73",
    glow: "rgba(247, 185, 85, 0.45)",
    ridge: ["#5d3a37", "#2b1b1e"],
    haze: "rgba(247, 185, 85, 0.25)",
    forecast: [
      { day: "Mon", lo: 17, hi: 31, cond: "sun" },
      { day: "Tue", lo: 18, hi: 33, cond: "sun" },
      { day: "Wed", lo: 16, hi: 29, cond: "part" },
      { day: "Thu", lo: 15, hi: 27, cond: "sun" },
      { day: "Fri", lo: 17, hi: 30, cond: "sun" },
      { day: "Sat", lo: 18, hi: 32, cond: "cloud" },
      { day: "Sun", lo: 16, hi: 28, cond: "part" },
    ],
    flights: [
      { code: "AT 803", from: "CDG", to: "RAK", when: "Thu 11:25", seat: "9D", status: "On time", live: true },
      { code: "AT 810", from: "RAK", to: "CDG", when: "Sun 19:50", seat: "3C", status: "Gate A7", live: false },
    ],
    stay: { name: "Riad El Fenn", area: "Medina", checkIn: "Thu 15:00", checkOut: "Sun 12:00", nights: 4, rating: 4.9 },
    budget: {
      spent: 610,
      total: 1500,
      currency: "$",
      buckets: [
        { label: "Flights", amount: 420, color: "#ff7a45" },
        { label: "Riad", amount: 130, color: "#38bdf8" },
        { label: "Souk", amount: 60, color: "#facc15" },
      ],
    },
    activities: [
      { time: "09:00", name: "Jemaa el-Fnaa stalls", where: "Medina" },
      { time: "14:00", name: "Atlas foothill drive", where: "Imlil road" },
      { time: "20:30", name: "Rooftop tagine", where: "Riad" },
    ],
  },
  {
    id: "reykjavik",
    city: "Reykjavík",
    country: "Iceland",
    code: "KEF",
    days: 7,
    blurb: "Basalt coasts, aurora skies",
    sky: ["#0a1c33", "#1c4c66", "#8fc7cc"],
    sun: "#d9f2ee",
    glow: "rgba(143, 199, 204, 0.4)",
    ridge: ["#1d3a4d", "#0a1622"],
    haze: "rgba(143, 199, 204, 0.22)",
    forecast: [
      { day: "Mon", lo: -1, hi: 4, cond: "cloud" },
      { day: "Tue", lo: -3, hi: 2, cond: "rain" },
      { day: "Wed", lo: -2, hi: 3, cond: "part" },
      { day: "Thu", lo: -4, hi: 1, cond: "cloud" },
      { day: "Fri", lo: -2, hi: 5, cond: "sun" },
      { day: "Sat", lo: -1, hi: 4, cond: "part" },
      { day: "Sun", lo: -3, hi: 2, cond: "rain" },
    ],
    flights: [
      { code: "FI 605", from: "BOS", to: "KEF", when: "Mon 20:15", seat: "11A", status: "On time", live: true },
      { code: "FI 604", from: "KEF", to: "BOS", when: "Tue 17:30", seat: "8D", status: "Boarding", live: true },
    ],
    stay: { name: "Kex Hostel", area: "Grandi harbour", checkIn: "Tue 16:00", checkOut: "Wed 10:00", nights: 7, rating: 4.5 },
    budget: {
      spent: 1980,
      total: 3100,
      currency: "$",
      buckets: [
        { label: "Flights", amount: 890, color: "#ff7a45" },
        { label: "Car", amount: 640, color: "#38bdf8" },
        { label: "Stay", amount: 450, color: "#a3e635" },
      ],
    },
    activities: [
      { time: "11:00", name: "Golden Circle loop", where: "Thingvellir" },
      { time: "18:00", name: "Sky Lagoon soak", where: "Kársbakki" },
      { time: "22:30", name: "Aurora chase", where: "Grótta point" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Pack lists — grouped tiles; essentials span 2×2 (most work)         */
/* ------------------------------------------------------------------ */

export interface PackGroup {
  id: string;
  label: string;
  span: "hero" | "half"; // essentials 2×2 vs 1×1 tiles
  items: string[];
}

export const PACK_GROUPS: PackGroup[] = [
  {
    id: "essentials",
    label: "Essentials",
    span: "hero",
    items: [
      "Passport",
      "Wallet + cards",
      "Phone + charger",
      "Toothbrush",
      "Sunscreen",
      "Reusable bottle",
      "Day backpack",
      "Rain shell",
      "Comfy walking shoes",
      "Sundries pouch",
      "Earplugs",
      "Glasses + case",
    ],
  },
  {
    id: "tech",
    label: "Tech",
    span: "half",
    items: ["Camera", "Power bank", "Travel adapter", "Headphones"],
  },
  {
    id: "docs",
    label: "Docs",
    span: "half",
    items: ["Boarding passes", "Hotel confirmation", "Insurance card", "Permits / visa"],
  },
];

/* Default "packed" state seeded per trip so tiles show real progress. */
export const PACK_SEED: Record<string, string[]> = {
  kyoto: ["essentials:0", "essentials:2", "tech:1", "docs:0"],
  lisbon: ["essentials:0", "essentials:1"],
  cusco: ["essentials:0", "essentials:7", "docs:3"],
  marrakech: [],
  reykjavik: ["essentials:0"],
};

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const condLabel: Record<DayForecast["cond"], string> = {
  sun: "Clear",
  part: "Partly cloudy",
  rain: "Showers",
  cloud: "Overcast",
};

/** Days until the trip departs — a fixed fictional "today" keeps the
 *  countdown stable across the prototype's lifetime. */
const EPOCH = Date.UTC(2026, 8, 27); // 27 Sep 2026
const OFFSETS: Record<string, number> = {
  kyoto: 4,
  lisbon: 23,
  cusco: 47,
  marrakech: 68,
  reykjavik: 91,
};

export function daysUntilDeparture(d: Destination): number {
  return OFFSETS[d.id] ?? 30;
}

export function departureLabel(d: Destination): string {
  const n = daysUntilDeparture(d);
  if (n <= 0) return "Departing";
  if (n === 1) return "Tomorrow";
  return `In ${n} days`;
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 22) return "Good evening";
  return "Night owl";
}

export function packTotal(): number {
  return PACK_GROUPS.reduce((n, g) => n + g.items.length, 0);
}

export function money(n: number, currency: string): string {
  return `${currency}${n.toLocaleString("en-US")}`;
}

export interface AtlasPrefs {
  notifyDeals: boolean;
  notifyFlights: boolean;
  notifyPack: boolean;
  tripLength: number; // planner default, days
}

export const DEFAULT_PREFS: AtlasPrefs = {
  notifyDeals: true,
  notifyFlights: true,
  notifyPack: false,
  tripLength: 6,
};

export const STATS = {
  countries: 18,
  miles: 47_982,
  trips: 26,
  streakNights: 9,
};
