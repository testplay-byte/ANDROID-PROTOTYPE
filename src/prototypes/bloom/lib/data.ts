/* data — curated mock data, types and pure helpers for the Bloom prototype.
   No React imports here; screens and the context read from this file.
   Thirst is 0-100 (0 = freshly watered, 100 = parched); plant art is
   generated from `shape` + `pot` tokens by components/plant-art.tsx. */

export type PlantShape = "monstera" | "snake" | "pothos" | "fiddle" | "succulent" | "calathea" | "zz";
export type PotColor = "clay" | "sand" | "plum" | "slate" | "terracotta" | "cream";
export type LightNeed = "Bright indirect" | "Low light" | "Medium light" | "Direct sun";
export type GuideCategory = "Watering" | "Light" | "Soil" | "Pets";

export interface Plant {
  id: string;
  name: string;
  species: string;
  shape: PlantShape;
  pot: PotColor;
  /** days between waterings */
  intervalDays: number;
  /** days since last watered (day 0 = today) — drives initial thirst */
  daysSinceWatered: number;
  light: LightNeed;
  temp: string;
  /** ISO date acquired */
  added: string;
  /** the care task due in today's schedule (Water / Mist / Feed) */
  task: "Water" | "Mist" | "Feed";
  slot: string; // "08:00"
}

export interface SpeciesPreset {
  species: string;
  common: string;
  shape: PlantShape;
  pot: PotColor;
  intervalDays: number;
  light: LightNeed;
  temp: string;
}

export interface GuideArticle {
  id: string;
  category: GuideCategory;
  title: string;
  minutes: number;
  body: string;
  tip: string;
}

/* ---- The curated collection (day 0 of the demo = 2026-09-27) ---- */

export const PLANTS: Plant[] = [
  {
    id: "p-monstera",
    name: "Monstera",
    species: "Monstera deliciosa",
    shape: "monstera",
    pot: "clay",
    intervalDays: 7,
    daysSinceWatered: 6,
    light: "Bright indirect",
    temp: "18–27°C",
    added: "2025-04-12",
    task: "Water",
    slot: "08:00",
  },
  {
    id: "p-snake",
    name: "Mother in Law",
    species: "Dracaena trifasciata",
    shape: "snake",
    pot: "slate",
    intervalDays: 12,
    daysSinceWatered: 2,
    light: "Low light",
    temp: "15–29°C",
    added: "2024-11-03",
    task: "Water",
    slot: "08:30",
  },
  {
    id: "p-pothos",
    name: "Golden Pothos",
    species: "Epipremnum aureum",
    shape: "pothos",
    pot: "cream",
    intervalDays: 9,
    daysSinceWatered: 8,
    light: "Medium light",
    temp: "17–28°C",
    added: "2025-07-29",
    task: "Water",
    slot: "09:00",
  },
  {
    id: "p-fiddle",
    name: "Fiddle Fig",
    species: "Ficus lyrata",
    shape: "fiddle",
    pot: "terracotta",
    intervalDays: 10,
    daysSinceWatered: 4,
    light: "Bright indirect",
    temp: "18–26°C",
    added: "2024-02-18",
    task: "Mist",
    slot: "18:00",
  },
  {
    id: "p-calathea",
    name: "Zebra Plant",
    species: "Calathea zebrina",
    shape: "calathea",
    pot: "plum",
    intervalDays: 5,
    daysSinceWatered: 5,
    light: "Low light",
    temp: "16–24°C",
    added: "2025-09-06",
    task: "Water",
    slot: "18:30",
  },
  {
    id: "p-zz",
    name: "ZZ Stem",
    species: "Zamioculcas zamiifolia",
    shape: "zz",
    pot: "sand",
    intervalDays: 16,
    daysSinceWatered: 6,
    light: "Low light",
    temp: "18–28°C",
    added: "2025-01-22",
    task: "Feed",
    slot: "19:00",
  },
];

/* ---- Add-plant presets (FAB sheet) ---- */

export const SPECIES_PRESETS: SpeciesPreset[] = [
  { species: "Monstera deliciosa", common: "Monstera", shape: "monstera", pot: "clay", intervalDays: 7, light: "Bright indirect", temp: "18–27°C" },
  { species: "Sansevieria trifasciata", common: "Snake Plant", shape: "snake", pot: "slate", intervalDays: 12, light: "Low light", temp: "15–29°C" },
  { species: "Epipremnum aureum", common: "Golden Pothos", shape: "pothos", pot: "cream", intervalDays: 9, light: "Medium light", temp: "17–28°C" },
  { species: "Echeveria elegans", common: "Echeveria", shape: "succulent", pot: "terracotta", intervalDays: 14, light: "Direct sun", temp: "10–27°C" },
  { species: "Calathea zebrina", common: "Zebra Plant", shape: "calathea", pot: "plum", intervalDays: 5, light: "Low light", temp: "16–24°C" },
  { species: "Zamioculcas zamiifolia", common: "ZZ Plant", shape: "zz", pot: "sand", intervalDays: 16, light: "Low light", temp: "18–28°C" },
];

/* ---- Guide articles ---- */

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    id: "g-finger",
    category: "Watering",
    title: "The finger test beats any schedule",
    minutes: 2,
    body:
      "Push a finger two knuckles deep into the soil. If it comes out dry and clean, water; if it's cool and clumpy, wait another few days. Schedules are a starting point — roots care about moisture, not calendars.",
    tip: "Bottom-water thirsty plants: soak the pot in a tray for 20 minutes so roots drink from below.",
  },
  {
    id: "g-symptom",
    category: "Watering",
    title: "Yellow leaves: thirst or drowning?",
    minutes: 3,
    body:
      "Both over- and under-watering turn leaves yellow — the difference is texture. Crispy, papery edges mean thirst. Soft, limp yellows with brown mushy stems mean soggy roots. Check the soil before you reach for the can.",
    tip: "When unsure, trust the soil, not the leaf. Dry soil plus droop is almost always thirst.",
  },
  {
    id: "g-light",
    category: "Light",
    title: "Reading your window's light",
    minutes: 2,
    body:
      "North windows give soft, even light; east gives gentle morning sun; south is the brightest, hottest spot; west bakes in afternoon. Hold a hand 30 cm in front of the plant at noon: a sharp shadow means bright, a blurry one means medium, no shadow means low.",
    tip: "Sheer curtain turns harsh south light into perfect bright-indirect for figs and monsteras.",
  },
  {
    id: "g-rotate",
    category: "Light",
    title: "Rotate for a balanced plant",
    minutes: 1,
    body:
      "Stems lean toward the light, so a plant by a window will stretch one-sided within weeks. Turn the pot a quarter-rotation every watering — by the next can, it's back where it started, growing evenly on all sides.",
    tip: "Stretching stems plus tiny new leaves are the classic 'needs more light' combo.",
  },
  {
    id: "g-soil",
    category: "Soil",
    title: "Chunky mixes prevent root rot",
    minutes: 3,
    body:
      "Most houseplants die from soggy soil, not dry. Amend bagged potting mix with perlite, bark, or pumice (roughly 1:2) so water drains in seconds and air reaches the roots. Aeration is the single cheapest upgrade you can make.",
    tip: "Repot when water runs straight through in under five seconds — the mix has compacted.",
  },
  {
    id: "g-pets",
    category: "Pets",
    title: "Keeping cats safe around green friends",
    minutes: 2,
    body:
      "Monsteras, pothos, ZZ plants and calatheas are toxic to cats if chewed — irritation, drooling, vomiting. Snake plants are mildly toxic too. Choose pet-safe greenery (spider plants, pilea, Boston fern) or keep toxic pots on high shelves and in rooms cats don't sleep in.",
    tip: "A sprinkle of citrus peel on the soil surface discourages most cats from grazing.",
  },
];

/* ---- Helpers ---- */

/** 0-100 thirst from days since watering vs the plant's interval. */
export function thirstOf(plant: Pick<Plant, "daysSinceWatered" | "intervalDays">): number {
  return clamp(Math.round((plant.daysSinceWatered / plant.intervalDays) * 100), 0, 100);
}

/** Watering urgency bucket for ring color + label (0 thirsty-ok → 100 parched). */
export function thirstState(t: number): "ok" | "soon" | "due" | "parched" {
  if (t < 55) return "ok";
  if (t < 80) return "soon";
  if (t < 100) return "due";
  return "parched";
}

export function thirstLabel(t: number): string {
  const s = thirstState(t);
  if (s === "ok") return "Happy";
  if (s === "soon") return "Thirsty soon";
  if (s === "due") return "Needs water";
  return "Parched";
}

/** "watered 2d ago" — day 0 reads "today". */
export function wateredAgo(days: number): string {
  if (days <= 0) return "watered today";
  if (days === 1) return "watered yesterday";
  if (days < 7) return `watered ${days}d ago`;
  const w = Math.floor(days / 7);
  return w === 1 ? "watered 1wk ago" : `watered ${w}wks ago`;
}

/** Days until the next watering (negative = overdue). */
export function daysUntilWater(plant: Pick<Plant, "daysSinceWatered" | "intervalDays">): number {
  return plant.intervalDays - plant.daysSinceWatered;
}

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** "Today"/"Tomorrow"/weekday label for the upcoming-week strip. */
export function dayPillLabel(offset: number): { top: string; big: string } {
  const d = new Date(2026, 8, 27 + offset); // demo anchor: Sun 27 Sep 2026
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  return { top: offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : wd, big: String(d.getDate()) };
}

export function formatClock(h: number, m: number): string {
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")}`;
}

export function greeting(): string {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 18) return "Good afternoon";
  return "Good evening";
}
