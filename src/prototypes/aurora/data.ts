/**
 * aurora / data — fixed demo data for "Aurora", the desktop weather +
 * ambience window.
 *
 * DETERMINISM — every number below is either a literal or comes out of the
 * seeded LCG at the bottom of this file. There is no Math.random and no
 * Date.now anywhere, so Lisbon is always 18°, the radar blob is always in
 * the same place and the 7-day never shifts between loads. "Today" is pinned
 * to Tuesday 29 September 2026, exactly like the other prototypes pin their
 * demo clock.
 *
 * The per-city hourly strip, the 7-day list and the radar grid are GENERATED
 * at module load (once, deterministic) rather than in render, so a screen can
 * just read `HOURLY[id]`.
 */

/* ------------------------------------------------------------------ units */

export type Unit = "c" | "f";

export const toF = (c: number) => (c * 9) / 5 + 32;

/** Celsius → the active unit, rounded, with the degree symbol. */
export function formatTemp(c: number, unit: Unit): string {
  const v = unit === "f" ? toF(c) : c;
  return `${Math.round(v)}°${unit.toUpperCase()}`;
}

/** Celsius → the active unit as a bare number (for sliders and meters). */
export function toUnit(c: number, unit: Unit): number {
  return unit === "f" ? toF(c) : c;
}

export const UNIT_LABEL: Record<Unit, string> = { c: "°C", f: "°F" };

/* ------------------------------------------------------------- conditions */

export type ConditionId = "clear" | "partly" | "cloudy" | "fog" | "rain" | "storm" | "snow" | "wind";

/** `tone` drives the accent mix in CSS (data-tone) — no colour literals. */
export type ConditionTone = "sun" | "cloud" | "water" | "storm" | "snow" | "wind";

export const CONDITIONS: Record<ConditionId, { label: string; short: string; tone: ConditionTone }> = {
  clear: { label: "Clear sky", short: "Clear", tone: "sun" },
  partly: { label: "Partly cloudy", short: "Partly", tone: "cloud" },
  cloudy: { label: "Overcast", short: "Cloudy", tone: "cloud" },
  fog: { label: "Sea fog", short: "Fog", tone: "cloud" },
  rain: { label: "Light rain", short: "Rain", tone: "water" },
  storm: { label: "Thunderstorms", short: "Storm", tone: "storm" },
  snow: { label: "Snow showers", short: "Snow", tone: "snow" },
  wind: { label: "Gale force winds", short: "Wind", tone: "wind" },
};

/* ----------------------------------------------------------------- cities */

export interface City {
  id: string;
  name: string;
  region: string;
  country: string;
  /** fixed local clock — no Date, no timezone maths */
  time: string;
  /** local solar offset label */
  offset: string;
  tempC: number;
  feelsC: number;
  highC: number;
  lowC: number;
  condition: ConditionId;
  summary: string;
  humidity: number;
  dewPointC: number;
  windKph: number;
  windGustKph: number;
  windDeg: number;
  windLabel: string;
  uvIndex: number;
  uvLabel: string;
  aqi: number;
  aqiLabel: string;
  precipChance: number;
  precipMm: number;
  pressureKpa: number;
  visibilityKm: number;
  cloudCover: number;
  sunrise: string;
  sunset: string;
  daylight: string;
  moonPhase: string;
  moonIllum: number;
  moonrise: string;
  /** which ambience scene plays in this city by default */
  ambience: AmbienceId;
  /** seed for the LCG — different cities get different curves */
  seed: number;
  /** first hour of the 24-slot hourly strip (local) */
  hour0: number;
}

/**
 * Nine cities: five ship saved, four wait in the catalogue until you add
 * them. Every field is literal — the hourly/week/radar layers derive from
 * `seed`.
 */
export const CITIES: City[] = [
  {
    id: "lisbon",
    name: "Lisbon",
    region: "Lisboa",
    country: "Portugal",
    time: "14:20",
    offset: "UTC+1",
    tempC: 18.4,
    feelsC: 17.6,
    highC: 21.2,
    lowC: 13.1,
    condition: "clear",
    summary: "Clear and warm · 12 h of sun left",
    humidity: 46,
    dewPointC: 7.1,
    windKph: 11,
    windGustKph: 19,
    windDeg: 312,
    windLabel: "NW",
    uvIndex: 6,
    uvLabel: "High",
    aqi: 32,
    aqiLabel: "Good",
    precipChance: 4,
    precipMm: 0,
    pressureKpa: 1018,
    visibilityKm: 22,
    cloudCover: 8,
    sunrise: "07:24",
    sunset: "19:36",
    daylight: "12 h 12 m",
    moonPhase: "Waxing crescent",
    moonIllum: 18,
    moonrise: "20:12",
    ambience: "ocean-swell",
    seed: 10427,
    hour0: 0,
  },
  {
    id: "reykjavik",
    name: "Reykjavík",
    region: "Capital Region",
    country: "Iceland",
    time: "13:20",
    offset: "UTC+0",
    tempC: 4.1,
    feelsC: -1.3,
    highC: 6.0,
    lowC: 1.2,
    condition: "wind",
    summary: "Strong north-westerly · spray on the coast road",
    humidity: 81,
    dewPointC: 1.0,
    windKph: 42,
    windGustKph: 68,
    windDeg: 318,
    windLabel: "NW",
    uvIndex: 1,
    uvLabel: "Low",
    aqi: 18,
    aqiLabel: "Excellent",
    precipChance: 62,
    precipMm: 3.4,
    pressureKpa: 994,
    visibilityKm: 11,
    cloudCover: 74,
    sunrise: "07:16",
    sunset: "19:22",
    daylight: "12 h 06 m",
    moonPhase: "Waxing crescent",
    moonIllum: 16,
    moonrise: "19:04",
    ambience: "night-storm",
    seed: 33191,
    hour0: 0,
  },
  {
    id: "kyoto",
    name: "Kyoto",
    region: "Kansai",
    country: "Japan",
    time: "22:20",
    offset: "UTC+9",
    tempC: 14.9,
    feelsC: 15.4,
    highC: 18.0,
    lowC: 11.4,
    condition: "partly",
    summary: "Partly cloudy · humid, still",
    humidity: 72,
    dewPointC: 9.8,
    windKph: 6,
    windGustKph: 12,
    windDeg: 145,
    windLabel: "SE",
    uvIndex: 0,
    uvLabel: "None",
    aqi: 54,
    aqiLabel: "Moderate",
    precipChance: 18,
    precipMm: 0.2,
    pressureKpa: 1013,
    visibilityKm: 15,
    cloudCover: 38,
    sunrise: "05:50",
    sunset: "18:04",
    daylight: "12 h 14 m",
    moonPhase: "First quarter",
    moonIllum: 47,
    moonrise: "21:31",
    ambience: "forest-hush",
    seed: 88231,
    hour0: 0,
  },
  {
    id: "vancouver",
    name: "Vancouver",
    region: "British Columbia",
    country: "Canada",
    time: "06:20",
    offset: "UTC−7",
    tempC: 9.7,
    feelsC: 8.1,
    highC: 13.2,
    lowC: 6.8,
    condition: "rain",
    summary: "Steady drizzle · clearing by mid-morning",
    humidity: 88,
    dewPointC: 7.8,
    windKph: 14,
    windGustKph: 24,
    windDeg: 225,
    windLabel: "SW",
    uvIndex: 1,
    uvLabel: "Low",
    aqi: 27,
    aqiLabel: "Good",
    precipChance: 84,
    precipMm: 6.1,
    pressureKpa: 1006,
    visibilityKm: 8,
    cloudCover: 92,
    sunrise: "07:08",
    sunset: "19:12",
    daylight: "12 h 04 m",
    moonPhase: "Waxing crescent",
    moonIllum: 22,
    moonrise: "20:44",
    ambience: "rain-on-glass",
    seed: 51013,
    hour0: 0,
  },
  {
    id: "nairobi",
    name: "Nairobi",
    region: "Nairobi County",
    country: "Kenya",
    time: "16:20",
    offset: "UTC+3",
    tempC: 24.3,
    feelsC: 25.0,
    highC: 26.7,
    lowC: 16.2,
    condition: "storm",
    summary: "Thunder build-up · squall after 17:00",
    humidity: 63,
    dewPointC: 16.8,
    windKph: 9,
    windGustKph: 28,
    windDeg: 120,
    windLabel: "ESE",
    uvIndex: 9,
    uvLabel: "Very high",
    aqi: 44,
    aqiLabel: "Fair",
    precipChance: 91,
    precipMm: 12.8,
    pressureKpa: 1010,
    visibilityKm: 9,
    cloudCover: 79,
    sunrise: "06:32",
    sunset: "18:44",
    daylight: "12 h 12 m",
    moonPhase: "Waxing gibbous",
    moonIllum: 64,
    moonrise: "18:22",
    ambience: "rain-on-glass",
    seed: 76455,
    hour0: 0,
  },
  {
    id: "bergen",
    name: "Bergen",
    region: "Vestland",
    country: "Norway",
    time: "15:20",
    offset: "UTC+2",
    tempC: 11.2,
    feelsC: 9.4,
    highC: 13.8,
    lowC: 8.1,
    condition: "rain",
    summary: "Rain, then brighter spells by dusk",
    humidity: 84,
    dewPointC: 8.7,
    windKph: 26,
    windGustKph: 44,
    windDeg: 250,
    windLabel: "WSW",
    uvIndex: 2,
    uvLabel: "Low",
    aqi: 21,
    aqiLabel: "Good",
    precipChance: 88,
    precipMm: 8.2,
    pressureKpa: 1002,
    visibilityKm: 7,
    cloudCover: 95,
    sunrise: "07:31",
    sunset: "19:41",
    daylight: "12 h 10 m",
    moonPhase: "Waxing crescent",
    moonIllum: 14,
    moonrise: "20:58",
    ambience: "rain-on-glass",
    seed: 20488,
    hour0: 0,
  },
  {
    id: "marrakesh",
    name: "Marrakesh",
    region: "Marrakesh-Safi",
    country: "Morocco",
    time: "14:20",
    offset: "UTC+1",
    tempC: 27.6,
    feelsC: 27.1,
    highC: 31.4,
    lowC: 18.0,
    condition: "clear",
    summary: "Dry heat · haze over the Atlas foothills",
    humidity: 22,
    dewPointC: 4.2,
    windKph: 8,
    windGustKph: 17,
    windDeg: 45,
    windLabel: "NE",
    uvIndex: 10,
    uvLabel: "Extreme",
    aqi: 71,
    aqiLabel: "Moderate",
    precipChance: 1,
    precipMm: 0,
    pressureKpa: 1015,
    visibilityKm: 18,
    cloudCover: 3,
    sunrise: "07:26",
    sunset: "19:33",
    daylight: "12 h 07 m",
    moonPhase: "Waxing gibbous",
    moonIllum: 71,
    moonrise: "19:10",
    ambience: "ember-fire",
    seed: 61807,
    hour0: 0,
  },
  {
    id: "ushuaia",
    name: "Ushuaia",
    region: "Tierra del Fuego",
    country: "Argentina",
    time: "10:20",
    offset: "UTC−3",
    tempC: 2.3,
    feelsC: -3.6,
    highC: 4.0,
    lowC: -1.1,
    condition: "snow",
    summary: "Snow flurries · 22 cm settled on the ridge",
    humidity: 76,
    dewPointC: -2.0,
    windKph: 33,
    windGustKph: 58,
    windDeg: 200,
    windLabel: "SSW",
    uvIndex: 1,
    uvLabel: "Low",
    aqi: 12,
    aqiLabel: "Excellent",
    precipChance: 76,
    precipMm: 4.1,
    pressureKpa: 998,
    visibilityKm: 6,
    cloudCover: 88,
    sunrise: "08:12",
    sunset: "18:56",
    daylight: "10 h 44 m",
    moonPhase: "Waxing crescent",
    moonIllum: 12,
    moonrise: "21:40",
    ambience: "night-storm",
    seed: 94620,
    hour0: 0,
  },
  {
    id: "wellington",
    name: "Wellington",
    region: "Wellington Region",
    country: "New Zealand",
    time: "02:20",
    offset: "UTC+13",
    tempC: 12.5,
    feelsC: 11.2,
    highC: 14.1,
    lowC: 9.4,
    condition: "cloudy",
    summary: "Overcast and close · low cloud on the hill road",
    humidity: 79,
    dewPointC: 9.1,
    windKph: 22,
    windGustKph: 39,
    windDeg: 190,
    windLabel: "S",
    uvIndex: 0,
    uvLabel: "None",
    aqi: 16,
    aqiLabel: "Excellent",
    precipChance: 44,
    precipMm: 1.2,
    pressureKpa: 1009,
    visibilityKm: 12,
    cloudCover: 96,
    sunrise: "07:14",
    sunset: "19:11",
    daylight: "11 h 57 m",
    moonPhase: "Waxing gibbous",
    moonIllum: 58,
    moonrise: "22:14",
    ambience: "ocean-swell",
    seed: 47002,
    hour0: 0,
  },
];

/** The five cities saved on first launch. */
export const DEFAULT_SAVED = ["lisbon", "reykjavik", "kyoto", "vancouver", "nairobi"];

export const cityById = (id: string) => CITIES.find((c) => c.id === id) ?? CITIES[0];

/* --------------------------------------------------------------- ambience */

export type AmbienceId = "rain-on-glass" | "ocean-swell" | "forest-hush" | "night-storm" | "ember-fire";

export interface AmbienceLayer {
  name: string;
  gain: number; // 0..100
}

export interface Ambience {
  id: AmbienceId;
  label: string;
  hint: string;
  layers: AmbienceLayer[];
}

export const AMBIENCES: Ambience[] = [
  {
    id: "rain-on-glass",
    label: "Rain on glass",
    hint: "Steady drizzle against a warm room",
    layers: [
      { name: "Window rain", gain: 74 },
      { name: "Room tone", gain: 28 },
      { name: "Distant traffic", gain: 16 },
    ],
  },
  {
    id: "ocean-swell",
    label: "Ocean swell",
    hint: "Long sets on a shingle beach",
    layers: [
      { name: "Swell", gain: 62 },
      { name: "Shingle", gain: 40 },
      { name: "Gulls", gain: 12 },
    ],
  },
  {
    id: "forest-hush",
    label: "Forest hush",
    hint: "Understorey after rain",
    layers: [
      { name: "Canopy", gain: 55 },
      { name: "Understorey", gain: 34 },
      { name: "Creek", gain: 26 },
    ],
  },
  {
    id: "night-storm",
    label: "Night storm",
    hint: "Squall line crossing a dark coast",
    layers: [
      { name: "Rain on the roof", gain: 68 },
      { name: "Wind", gain: 47 },
      { name: "Thunder", gain: 21 },
    ],
  },
  {
    id: "ember-fire",
    label: "Ember fire",
    hint: "Dry heat, low fire, no wind",
    layers: [
      { name: "Fire", gain: 58 },
      { name: "Room", gain: 30 },
      { name: "Night insects", gain: 9 },
    ],
  },
];

export const ambienceById = (id: AmbienceId) => AMBIENCES.find((a) => a.id === id) ?? AMBIENCES[0];

/* ----------------------------------------------- seeded generator (LCG) --- */

/** Numerical Recipes LCG — same seed, same sequence, every platform. */
function rng(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Offsets from "now" for each of the 24 hourly slots, in °C. */
const DIURNAL = [-4.2, -5.1, -6.0, -6.4, -5.8, -3.9, -1.6, 0.9, 2.8, 4.1, 5.0, 5.4, 5.3, 4.6, 3.4, 2.0, 0.6, -0.7, -1.9, -2.8, -3.5, -3.9, -4.1, -4.2];

/** How wet each condition is — scales the hourly precipitation chance. */
const WETNESS: Record<ConditionId, number> = {
  clear: 0.12,
  partly: 0.35,
  cloudy: 0.55,
  fog: 0.45,
  rain: 1,
  storm: 1.4,
  snow: 0.9,
  wind: 0.7,
};

const POOLS: Record<ConditionId, ConditionId[]> = {
  clear: ["clear", "clear", "partly", "partly", "wind"],
  partly: ["partly", "partly", "clear", "cloudy"],
  cloudy: ["cloudy", "cloudy", "partly", "rain", "fog"],
  fog: ["fog", "cloudy", "cloudy", "rain"],
  rain: ["rain", "rain", "cloudy", "storm", "partly"],
  storm: ["storm", "storm", "rain", "cloudy"],
  snow: ["snow", "snow", "cloudy", "wind"],
  wind: ["wind", "wind", "cloudy", "rain", "partly"],
};

/* ------------------------------------------------------------ hourly strip */

export interface HourPoint {
  /** local hour label, e.g. "14:00" */
  label: string;
  hour: number;
  tempC: number;
  condition: ConditionId;
  precip: number;
  windKph: number;
  aqi: number;
  isDay: boolean;
}

function buildHours(city: City): HourPoint[] {
  const r = rng(city.seed);
  const pool = POOLS[city.condition];
  const wet = WETNESS[city.condition];
  const out: HourPoint[] = [];
  for (let i = 0; i < 24; i += 1) {
    const hour = (city.hour0 + i) % 24;
    const noise = (r() - 0.5) * 1.7;
    out.push({
      label: `${String(hour).padStart(2, "0")}:00`,
      hour,
      tempC: r1(city.tempC + DIURNAL[i] + noise),
      condition: pool[Math.floor(r() * pool.length)],
      precip: clamp(Math.round(r() * 38 * wet), 0, 100),
      windKph: Math.round(city.windKph * (0.68 + r() * 0.72)),
      aqi: clamp(Math.round(city.aqi * (0.76 + r() * 0.48)), 5, 200),
      isDay: hour >= 6 && hour < 20,
    });
  }
  return out;
}

/** 24 hourly points per city, generated once at module load. */
export const HOURLY: Record<string, HourPoint[]> = Object.fromEntries(
  CITIES.map((c) => [c.id, buildHours(c)])
);

/* ----------------------------------------------------------------- 7-day */

export interface DayPoint {
  key: string;
  day: string;
  date: string;
  condition: ConditionId;
  highC: number;
  lowC: number;
  precip: number;
  windKph: number;
  aqi: number;
  isToday: boolean;
}

/** "Today" is pinned to Tuesday 29 September 2026. */
export const TODAY_LABEL = "Today";
const WEEK_DAYS = ["Today", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
const WEEK_DATES = ["29 Sep", "30 Sep", "01 Oct", "02 Oct", "03 Oct", "04 Oct", "05 Oct"];

function buildWeek(city: City): DayPoint[] {
  const r = rng(city.seed ^ 0x5f3a);
  const pool = POOLS[city.condition];
  const wet = WETNESS[city.condition];
  return WEEK_DAYS.map((day, i) => {
    const swing = (r() - 0.5) * 3.4;
    const spread = 5 + r() * 5;
    return {
      key: `${city.id}-d${i}`,
      day,
      date: WEEK_DATES[i],
      condition: pool[Math.floor(r() * pool.length)],
      highC: r1(city.highC + swing + (r() - 0.5) * 1.4),
      lowC: r1(city.highC - spread + swing),
      precip: clamp(Math.round(r() * 96 * wet), 0, 100),
      windKph: Math.round(city.windKph * (0.6 + r() * 0.9)),
      aqi: clamp(Math.round(city.aqi * (0.7 + r() * 0.7)), 5, 200),
      isToday: i === 0,
    };
  });
}

export const WEEK: Record<string, DayPoint[]> = Object.fromEntries(
  CITIES.map((c) => [c.id, buildWeek(c)])
);

/* ----------------------------------------------------------------- radar */

export const RADAR_COLS = 14;
export const RADAR_ROWS = 9;

export interface RadarCell {
  col: number;
  row: number;
  /** 0 = clear … 4 = violent */
  level: 0 | 1 | 2 | 3 | 4;
}

export const RADAR_LEGEND = ["Clear", "Light", "Moderate", "Heavy", "Violent"];

function buildRadar(): RadarCell[] {
  const r = rng(20260929);
  const cells: RadarCell[] = [];
  // two storm cores + one slow-moving band, so the field looks like weather
  const cores = [
    { cx: 4.4, cy: 3.1, rad: 3.0, peak: 1.0 },
    { cx: 9.6, cy: 6.0, rad: 2.4, peak: 0.86 },
    { cx: 11.8, cy: 1.6, rad: 1.8, peak: 0.7 },
  ];
  for (let row = 0; row < RADAR_ROWS; row += 1) {
    for (let col = 0; col < RADAR_COLS; col += 1) {
      const x = col + 0.5;
      const y = row + 0.5;
      let v = 0.1 + 0.22 * r();
      for (const c of cores) {
        const d = Math.hypot(x - c.cx, (y - c.cy) * 1.25);
        v += Math.max(0, 1 - d / c.rad) ** 1.7 * c.peak;
      }
      // the band sweeping in from the west edge
      v += Math.max(0, 1 - Math.abs(y - 7.4 - Math.sin(x / 3) * 0.9) / 1.6) * 0.55;
      const level = (v > 1.15 ? 4 : v > 0.85 ? 3 : v > 0.6 ? 2 : v > 0.38 ? 1 : 0) as RadarCell["level"];
      cells.push({ col, row, level });
    }
  }
  return cells;
}

export const RADAR: RadarCell[] = buildRadar();

/* ------------------------------------------------------ sun / moon track */

export interface SunMark {
  /** minutes since midnight */
  minutes: number;
  label: string;
  note: string;
  kind: "night" | "dawn" | "day" | "dusk";
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/**
 * The sun/moon arc for a city. The marker sits at the pinned local time
 * (`city.time`), so the arc is identical on every load.
 */
export function sunTrack(city: City): { marks: SunMark[]; progress: number; nowMinutes: number } {
  const rise = toMinutes(city.sunrise);
  const set = toMinutes(city.sunset);
  const now = toMinutes(city.time);
  const progress = clamp((now - rise) / (set - rise), 0, 1);
  const shift = (label: string, mins: number) => {
    const h = String(Math.floor((mins / 60) % 24)).padStart(2, "0");
    const m = String(mins % 60).padStart(2, "0");
    return `${h}:${m}`;
  };
  const marks: SunMark[] = [
    { minutes: 0, label: "00:00", note: "Midnight", kind: "night" },
    { minutes: rise - 75, label: shift("", rise - 75), note: "First light", kind: "dawn" },
    { minutes: rise, label: city.sunrise, note: "Sunrise", kind: "dawn" },
    { minutes: Math.round((rise + set) / 2), label: shift("", Math.round((rise + set) / 2)), note: "Solar noon", kind: "day" },
    { minutes: set, label: city.sunset, note: "Sunset", kind: "dusk" },
    { minutes: set + 62, label: shift("", set + 62), note: "Last light", kind: "dusk" },
    { minutes: 1439, label: "23:59", note: "Midnight", kind: "night" },
  ];
  return { marks, progress, nowMinutes: now };
}

/* --------------------------------------------------------------- sundesk */

export const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "1 – 4", action: "Jump to Now / Cities / Details / Settings" },
  { keys: "U", action: "Switch between °C and °F" },
  { keys: "C", action: "Cycle the glass intensity" },
  { keys: "/", action: "Focus the city search" },
  { keys: "Esc", action: "Close the palette or the add-city panel" },
];
