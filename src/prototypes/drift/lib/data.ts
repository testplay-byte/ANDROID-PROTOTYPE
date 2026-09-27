/* ============================================================
   drift / lib / data.ts — mock podcast catalog for "Drift".

   Eight shows, each carrying its own VIVID content palette that
   drives the generative cover art AND the accent tint of the rows
   it touches. Palettes are warm-led (sunset / ember / coastal /
   forest) — deliberately never a generic blue-purple default.

   Motifs seed the generative cover geometry: how the waveform
   bars are laid out and which emblem sits over the gradient mesh.
   ============================================================ */

export type Motif = "sun" | "wave" | "spike" | "orbit" | "arc" | "ridge";

export interface Episode {
  id: string;
  title: string;
  dateLabel: string; // short relative label, e.g. "2d ago"
  seconds: number; // total duration
  blurb: string;
}

export interface Show {
  id: string;
  title: string;
  host: string;
  category: string;
  blurb: string;
  /** vivid mesh colors, inner → outer (never blue-purple defaults) */
  palette: [string, string, string, string];
  /** accent derived from the palette — used for tinted fills and progress */
  accent: string;
  motif: Motif;
  /** deterministic seed for the cover's waveform bars */
  seed: number;
  episodes: Episode[];
}

export const CATEGORIES = ["All", "Culture", "Science", "Tech", "Wellbeing", "Stories"] as const;
export type Category = (typeof CATEGORIES)[number];

export const SHOWS: Show[] = [
  {
    id: "golden-hour",
    title: "Golden Hour",
    host: "Marisol Vane",
    category: "Culture",
    blurb: "Long conversations recorded at dusk about craft, memory and the light we live in.",
    palette: ["#ffd166", "#ff9d4d", "#ff5e62", "#8c2f39"],
    accent: "#ffb45c",
    motif: "sun",
    seed: 17,
    episodes: [
      { id: "gh-118", title: "The Potter of Rue Camille", dateLabel: "1d ago", seconds: 2312, blurb: "A ceramicist on forty years of hands in wet clay." },
      { id: "gh-117", title: "Lighthouse Keepers, After Dark", dateLabel: "8d ago", seconds: 2688, blurb: "The last manned light station on the north coast." },
      { id: "gh-116", title: "Songs for a Dying Orchard", dateLabel: "2w ago", seconds: 1985, blurb: "A folk singer replants a melody, one verse at a time." },
      { id: "gh-115", title: "Bread, Salt, Patience", dateLabel: "3w ago", seconds: 2240, blurb: "The baker who refuses to hurry anything." },
    ],
  },
  {
    id: "tidal",
    title: "Tidal",
    host: "Dev Okonkwo",
    category: "Science",
    blurb: "Ocean science in short waves — currents, creatures and the water that keeps us alive.",
    palette: ["#7ef0d8", "#35d0ba", "#0fa38f", "#063a4a"],
    accent: "#38d9be",
    motif: "wave",
    seed: 42,
    episodes: [
      { id: "td-76", title: "Where the Warm Water Hides", dateLabel: "2d ago", seconds: 1730, blurb: "A subsurface river in the Atlantic, mapped for the first time." },
      { id: "td-75", title: "Whale Song Syntax", dateLabel: "9d ago", seconds: 2015, blurb: "Humpback phrases change like dialects — researchers listen." },
      { id: "td-74", title: "The Silence Between Tides", dateLabel: "2w ago", seconds: 1588, blurb: "What happens in an estuary when the water stops moving." },
    ],
  },
  {
    id: "understory",
    title: "Understory",
    host: "June Hale",
    category: "Wellbeing",
    blurb: "Slow radio from the forest floor: breathing, birdsong and the ecology of attention.",
    palette: ["#d6e88a", "#7cc26b", "#2f7d43", "#0d3b1e"],
    accent: "#8ad06a",
    motif: "ridge",
    seed: 7,
    episodes: [
      { id: "us-31", title: "Ten Minutes Under Beeches", dateLabel: "1d ago", seconds: 640, blurb: "A guided rest beneath the old growth." },
      { id: "us-30", title: "Mycelium & Mending", dateLabel: "6d ago", seconds: 1896, blurb: "What fungal networks teach us about recovery." },
      { id: "us-29", title: "Dawn Chorus, Deconstructed", dateLabel: "2w ago", seconds: 1642, blurb: "Why 5 a.m. in a wood sounds like an orchestra tuning." },
    ],
  },
  {
    id: "ember-talk",
    title: "Ember Talk",
    host: "Cass Idarre",
    category: "Stories",
    blurb: "True stories told around a fire that is absolutely not a metaphor, mostly.",
    palette: ["#ffd0a8", "#ff8a5c", "#e8503f", "#5c1024"],
    accent: "#ff7a59",
    motif: "spike",
    seed: 55,
    episodes: [
      { id: "et-52", title: "The Fire That Followed Me Home", dateLabel: "3d ago", seconds: 2450, blurb: "A smokejumper's first season, and his last." },
      { id: "et-51", title: "Cooking for Strangers at 3 A.M.", dateLabel: "10d ago", seconds: 1980, blurb: "One diner, one stove, a rotating cast of night people." },
      { id: "et-50", title: "Ash Wednesday in a Paper Town", dateLabel: "2w ago", seconds: 2175, blurb: "The mill fire that rewrote a county's memory." },
    ],
  },
  {
    id: "nightbloom",
    title: "Nightbloom",
    host: "Ada Quill",
    category: "Culture",
    blurb: "Gardens that open after dark — and the artists, insomniacs and moths who tend them.",
    palette: ["#ffc4dd", "#f973b6", "#c93b8c", "#4a0d3f"],
    accent: "#f56bb0",
    motif: "orbit",
    seed: 23,
    episodes: [
      { id: "nb-24", title: "The Evening Primrose Protocol", dateLabel: "4d ago", seconds: 1720, blurb: "Botanical timers, and why flowers keep better hours than we do." },
      { id: "nb-23", title: "Moth Clocks", dateLabel: "2w ago", seconds: 2050, blurb: "A lepidopterist's midnight census." },
      { id: "nb-22", title: "Insomnia, Beautifully", dateLabel: "3w ago", seconds: 1875, blurb: "Three night-shifters on what 4 a.m. gives them." },
    ],
  },
  {
    id: "alpenglow",
    title: "Alpenglow",
    host: "Tomas Rieder",
    category: "Stories",
    blurb: "Summit diaries from the high Alps — cold mornings, warm egos, thin air.",
    palette: ["#ffe29a", "#ffab6e", "#ef6292", "#5a1a4a"],
    accent: "#ff9d6e",
    motif: "arc",
    seed: 88,
    episodes: [
      { id: "ap-40", title: "The Red Ridge, in Fog", dateLabel: "5d ago", seconds: 2288, blurb: "A climb narrated entirely from a bivy sack." },
      { id: "ap-39", title: "Hut Warden of the Furka", dateLabel: "1w ago", seconds: 1934, blurb: "Forty winters serving soup above the clouds." },
      { id: "ap-38", title: "First Light, Every Light", dateLabel: "3w ago", seconds: 2105, blurb: "Why climbers fall in love with a five-minute color." },
    ],
  },
  {
    id: "signal-static",
    title: "Signal & Static",
    host: "Priya Nandakumar",
    category: "Tech",
    blurb: "Hardware archaeology and the people who keep old signals alive.",
    palette: ["#ffe08a", "#eab308", "#c2410c", "#3a1a08"],
    accent: "#f0b135",
    motif: "spike",
    seed: 64,
    episodes: [
      { id: "ss-61", title: "The Last Analog Switchboard", dateLabel: "2d ago", seconds: 1860, blurb: "One operator, one board, zero dial tones left." },
      { id: "ss-60", title: "Rescuing a 1977 Synthesizer", dateLabel: "8d ago", seconds: 2340, blurb: "Forty-five capacitors and a very patient restorer." },
      { id: "ss-59", title: "Numbers Stations for Beginners", dateLabel: "2w ago", seconds: 1610, blurb: "Shortwave cryptography's strangest broadcast." },
    ],
  },
  {
    id: "coastal-drift",
    title: "Coastal Drift",
    host: "Finn & Coral",
    category: "Wellbeing",
    blurb: "Two hosts, one shoreline, zero agenda — a walking meditation by the sea.",
    palette: ["#a8f0d0", "#5eead4", "#fb7185", "#134f5a"],
    accent: "#5eead4",
    motif: "wave",
    seed: 31,
    episodes: [
      { id: "cd-19", title: "The Long Shore Path, Part Two", dateLabel: "3d ago", seconds: 3020, blurb: "Eleven kilometres of shingle, gossip and gulls." },
      { id: "cd-18", title: "Cold Water Thinking", dateLabel: "1w ago", seconds: 1745, blurb: "Why sea swimmers wake up earlier than their problems." },
      { id: "cd-17", title: "Tide Tables for the Hopeless", dateLabel: "2w ago", seconds: 1688, blurb: "Planning a life around a number that changes daily." },
    ],
  },
];

export const FEATURED_SHOW_ID = "golden-hour";

/** The featured show plus everything "Continue listening"-adjacent. */
export function showById(id: string): Show | undefined {
  return SHOWS.find((s) => s.id === id);
}

/** Flat episode list across all shows (library + history lookups). */
export interface FlatEpisode {
  show: Show;
  episode: Episode;
}

export const ALL_EPISODES: FlatEpisode[] = SHOWS.flatMap((show) =>
  show.episodes.map((episode) => ({ show, episode })),
);

export function findEpisode(epId: string): FlatEpisode | undefined {
  return ALL_EPISODES.find((f) => f.episode.id === epId);
}

/** Next/previous episode within a show, wrapping at the ends. */
export function neighborEpisode(show: Show, epId: string, dir: 1 | -1): Episode {
  const idx = show.episodes.findIndex((e) => e.id === epId);
  const next = (idx + dir + show.episodes.length) % show.episodes.length;
  return show.episodes[Math.max(0, next)];
}

/* ---------------- formatters ---------------- */

/** 3661 → "1:01:01", 2312 → "38:32" (player clock). */
export function fmtClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}

/** 2312 → "38m" (row labels). */
export function fmtMins(sec: number): string {
  return `${Math.round(sec / 60)}m`;
}

/* ---------------- deterministic PRNG (cover art + waveforms) ---------------- */

/** FNV-1a hash → 32-bit seed. */
export function hashSeed(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 PRNG — same seed, same waveform, every render. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** n bar heights in [0.18, 1], stable for a given seed string. */
export function waveformHeights(seedStr: string, n: number): number[] {
  const rnd = mulberry32(hashSeed(seedStr));
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    // layered sines keep the shape musical, noise keeps it honest
    const env = 0.45 + 0.55 * Math.abs(Math.sin((i / n) * Math.PI * 2.2 + rnd() * 0.6));
    out.push(Math.min(1, Math.max(0.18, env * (0.55 + rnd() * 0.6))));
  }
  return out;
}
