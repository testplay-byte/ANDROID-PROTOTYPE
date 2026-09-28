/* ruckus / data — the local live-music scene.
   Bands, venues and a week of gigs. Everything the app renders flows from
   these arrays (counts, tickers, per-band/per-venue listings are DERIVED,
   never hardcoded twice). Prices are integer euros; distances in km. */

export type Genre = "PUNK" | "GARAGE" | "POST-PUNK" | "LO-FI" | "METAL" | "FOLK";

export const GENRES: Genre[] = ["PUNK", "GARAGE", "POST-PUNK", "LO-FI", "METAL", "FOLK"];

/** Flat colorway for a band's generative cover — a token, not a literal. */
export type CoverTone = "primary" | "secondary" | "tertiary" | "surface";

export interface Band {
  id: number;
  name: string;
  genre: Genre;
  followers: number;
  /** Cover base block tone. */
  tone: CoverTone;
  /** Geometric motif variant 0-3 — picks circle + bar placement. */
  motif: 0 | 1 | 2 | 3;
  blurb: string;
}

export interface Venue {
  id: number;
  name: string;
  area: string;
  /** Capacity at the door — drives the segmented meter. */
  capacity: number;
  distanceKm: number;
  note: string;
}

export type GigDay = "TONIGHT" | "TOMORROW" | "FRI" | "SAT";

export interface Gig {
  id: number;
  bandId: number;
  venueId: number;
  day: GigDay;
  /** ISO-ish date label for the detail slabs, e.g. "28 SEP". */
  date: string;
  /** Doors time, 24h "HH:MM". */
  time: string;
  /** Entry price in whole euros. */
  price: number;
  soldOut?: boolean;
}

export const BANDS: Band[] = [
  {
    id: 1,
    name: "Tacky Waves",
    genre: "PUNK",
    followers: 4210,
    tone: "secondary",
    motif: 0,
    blurb: "Three chords, no apologies. The loudest thing to come out of the rehearsal-room block since the block itself.",
  },
  {
    id: 2,
    name: "Slotch",
    genre: "POST-PUNK",
    followers: 2860,
    tone: "primary",
    motif: 1,
    blurb: "Chorused bass, dry vocals, shirts untucked. Post-punk with a spreadsheet and a grudge.",
  },
  {
    id: 3,
    name: "The Vrats",
    genre: "GARAGE",
    followers: 1740,
    tone: "tertiary",
    motif: 2,
    blurb: "Fuzz pedals stacked like bricks. Garage-rock straight off the floor of Tiny Big Room.",
  },
  {
    id: 4,
    name: "Bone Choir",
    genre: "METAL",
    followers: 6050,
    tone: "surface",
    motif: 3,
    blurb: "Eight-string hymns and a kick drum that files noise complaints by itself.",
  },
  {
    id: 5,
    name: "Meralda",
    genre: "LO-FI",
    followers: 980,
    tone: "primary",
    motif: 3,
    blurb: "Tape hiss, cheap synths, one pedalboard in perpetual revolt. Songs about bus routes.",
  },
  {
    id: 6,
    name: "Hollow Coast",
    genre: "FOLK",
    followers: 2230,
    tone: "tertiary",
    motif: 0,
    blurb: "Two guitars, one mandolin, zero amplification. Bring a jumper and your quietest voice.",
  },
  {
    id: 7,
    name: "Ferrous Youth",
    genre: "PUNK",
    followers: 3480,
    tone: "secondary",
    motif: 1,
    blurb: "Hardcore from the loading dock. Merch table is a blanket on the floor, cash only.",
  },
];

export const VENUES: Venue[] = [
  {
    id: 1,
    name: "The Basement",
    area: "OLD TOWN",
    capacity: 120,
    distanceKm: 1.2,
    note: "Ceiling sweat is part of the experience. Capacity is honestly a suggestion down there.",
  },
  {
    id: 2,
    name: "Feedback Hall",
    area: "DOCKS",
    capacity: 450,
    distanceKm: 3.4,
    note: "Former freight depot, now the loudest room in the city. Door list closes at 21:30 sharp.",
  },
  {
    id: 3,
    name: "Tiny Big Room",
    area: "CANAL SIDE",
    capacity: 80,
    distanceKm: 0.6,
    note: "Eighty people and a bar made of scaffolding. The best-sounding room per euro anywhere.",
  },
  {
    id: 4,
    name: "Old Slaughterhouse",
    area: "EAST WORKS",
    capacity: 900,
    distanceKm: 5.1,
    note: "Big room, big PA, big yellow lines on the floor. Capacity at the door is enforced by two very serious people.",
  },
  {
    id: 5,
    name: "The Laundrette",
    area: "MARKET ROW",
    capacity: 150,
    distanceKm: 2.2,
    note: "Gigs between the dryers on weekdays, full lock-in on weekends. Earplugs at the till.",
  },
];

export const GIGS: Gig[] = [
  { id: 1, bandId: 1, venueId: 1, day: "TONIGHT", date: "28 SEP", time: "20:30", price: 12 },
  { id: 2, bandId: 2, venueId: 2, day: "TONIGHT", date: "28 SEP", time: "21:00", price: 18, soldOut: true },
  { id: 3, bandId: 3, venueId: 3, day: "TONIGHT", date: "28 SEP", time: "19:45", price: 9 },
  { id: 4, bandId: 4, venueId: 4, day: "TONIGHT", date: "28 SEP", time: "22:00", price: 22, soldOut: true },
  { id: 5, bandId: 5, venueId: 5, day: "TOMORROW", date: "29 SEP", time: "20:00", price: 8 },
  { id: 6, bandId: 6, venueId: 5, day: "TOMORROW", date: "29 SEP", time: "19:00", price: 14 },
  { id: 7, bandId: 7, venueId: 2, day: "TOMORROW", date: "29 SEP", time: "21:30", price: 16 },
  { id: 8, bandId: 1, venueId: 4, day: "FRI", date: "02 OCT", time: "20:00", price: 20 },
  { id: 9, bandId: 6, venueId: 3, day: "FRI", date: "02 OCT", time: "18:30", price: 10 },
  { id: 10, bandId: 2, venueId: 1, day: "SAT", date: "03 OCT", time: "21:00", price: 15 },
  { id: 11, bandId: 5, venueId: 3, day: "SAT", date: "03 OCT", time: "17:00", price: 8 },
  { id: 12, bandId: 7, venueId: 2, day: "SAT", date: "03 OCT", time: "22:00", price: 17 },
];

/* ── Lookup helpers ─────────────────────────────────────────────────── */

export const bandById = (id: number): Band | undefined => BANDS.find((b) => b.id === id);
export const venueById = (id: number): Venue | undefined => VENUES.find((v) => v.id === id);
export const gigById = (id: number): Gig | undefined => GIGS.find((g) => g.id === id);

export const gigsForBand = (bandId: number): Gig[] => GIGS.filter((g) => g.bandId === bandId);
export const gigsForVenue = (venueId: number): Gig[] => GIGS.filter((g) => g.venueId === venueId);

/** Tonight's lineup, in doors order — the poster rows on the Gigs tab. */
export const tonightGigs = (): Gig[] =>
  GIGS.filter((g) => g.day === "TONIGHT").sort((a, b) => a.time.localeCompare(b.time));

/** All gigs matching a genre filter ("ALL" = everything), tonight first. */
export function gigsFiltered(genre: Genre | "ALL"): Gig[] {
  const dayRank: Record<GigDay, number> = { TONIGHT: 0, TOMORROW: 1, FRI: 2, SAT: 3 };
  return GIGS.filter((g) => {
    if (genre === "ALL") return true;
    const band = bandById(g.bandId);
    return band?.genre === genre;
  }).sort(
    (a, b) => dayRank[a.day] - dayRank[b.day] || a.time.localeCompare(b.time),
  );
}

/** Ticker items — counts derived from the data, never hardcoded. */
export function tickerItems(): string[] {
  const tonight = tonightGigs();
  const sold = tonight.filter((g) => g.soldOut).length;
  const parts = ["TONIGHT", `${tonight.length} SHOWS`];
  if (sold > 0) parts.push(`${sold} SOLD OUT`);
  parts.push("ALL AGES", "MERCH ON THE FLOOR", "NO REHEARSALS");
  return parts;
}

/* ── Formatters (tabular figures, number+unit never split) ──────────── */

/** "€12" */
export const money = (n: number): string => `€${n}`;

/** 4210 → "4.2K" · 980 → "980" */
export function fans(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k.toFixed(1).replace(/\.0$/, "")}K`;
}

/** 1.2 → "1.2 KM" */
export const dist = (km: number): string => `${km.toFixed(1)} KM`;

/** 450 → "450 CAP" */
export const cap = (n: number): string => `${n} CAP`;

/** Meter segments: capacity mapped onto 10 hard blocks. */
export const capacitySegments = (n: number): number => Math.max(2, Math.round((n / 900) * 10));
