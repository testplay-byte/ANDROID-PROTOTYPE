/**
 * helio / data — a deterministic grid-operations dataset.
 *
 * Every number here is fixed or derived by a seeded generator, so the
 * dashboard looks identical on every load (SPEC §8.6). "Today" is pinned.
 */

export const TODAY = "2026-09-29"; // Tuesday
export const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ---- deterministic noise (no Math.random) ---- */
function hash01(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
/** smooth-ish series in [0,1] */
export function series(seed: number, n: number, drift = 0): number[] {
  const out: number[] = [];
  let v = hash01(seed);
  for (let i = 0; i < n; i++) {
    v = v * 0.72 + hash01(seed + i * 7.13) * 0.28;
    out.push(Math.min(1, Math.max(0, v * 0.6 + drift + i * 0.012)));
  }
  return out;
}

/* ---- production, by hour (24 values, MWh) ---- */
export const PRODUCTION = [
  1.8, 1.6, 1.5, 1.6, 2.1, 3.4, 5.8, 8.9, 12.6, 16.2, 18.4, 19.6, 20.1, 19.2, 16.8, 13.4, 9.6, 6.2, 3.9, 2.8, 2.3, 2.1, 2.0, 1.9,
];

/** Yesterday's series, for the comparison line. */
export const PRODUCTION_PREV = PRODUCTION.map((v, i) => Number((v * (0.82 + hash01(i + 90) * 0.22)).toFixed(1)));

/* ---- grid frequency (ECG-ish, 64 samples, Hz deviation) ---- */
export const FREQUENCY = Array.from({ length: 64 }, (_, i) => {
  const base = 0.42 + hash01(i * 3.1) * 0.16;
  const spike = i === 8 || i === 21 || i === 33 || i === 47 || i === 58 ? 0.42 : 0;
  return Math.min(1, base + spike);
});

/* ---- storage, 15-minute buckets over a day (96 steps, 4 levels) ----
   level: 0 off-peak · 1 base · 2 peak · 3 stress            */
export const LOAD_LEVELS = [0, 1, 2, 3] as const;
export const LOAD_STEPS = Array.from({ length: 96 }, (_, i) => {
  const hour = i / 4;
  const shape =
    hour < 6 ? 0 : hour < 9 ? 1 : hour < 16 ? (hour < 12 ? 2 : 3) : hour < 20 ? 2 : 1;
  return shape + (hash01(i * 1.7) > 0.86 ? 1 : 0) === 0 ? 0 : shape;
});

/* ---- energy mix, 7 days (share %) ---- */
export const MIX = DOW.map((_, d) => ({
  day: DOW[d],
  solar: [12, 18, 24, 22, 15, 8, 6][d],
  wind: [34, 28, 22, 26, 31, 38, 41][d],
  grid: [44, 42, 40, 38, 39, 40, 39][d],
  battery: [10, 12, 14, 14, 15, 14, 14][d],
}));

/* ---- sites ---- */
export type SiteStatus = "online" | "curtailed" | "offline" | "maintenance";
export interface Site {
  id: string;
  name: string;
  region: string;
  capacityMw: number;
  outputMw: number;
  status: SiteStatus;
  efficiency: number;
}

export const SITES: Site[] = [
  { id: "s1", name: "Ardennes Array", region: "North", capacityMw: 420, outputMw: 388, status: "online", efficiency: 92.4 },
  { id: "s2", name: "Kestrel Ridge", region: "North", capacityMw: 260, outputMw: 214, status: "online", efficiency: 82.3 },
  { id: "s3", name: "Solano Flats", region: "West", capacityMw: 510, outputMw: 496, status: "online", efficiency: 97.3 },
  { id: "s4", name: "Vantbrook Wind", region: "East", capacityMw: 340, outputMw: 121, status: "curtailed", efficiency: 35.6 },
  { id: "s5", name: "Halloway Solar", region: "West", capacityMw: 180, outputMw: 172, status: "online", efficiency: 95.6 },
  { id: "s6", name: "Brackenmoor", region: "North", capacityMw: 300, outputMw: 268, status: "online", efficiency: 89.3 },
  { id: "s7", name: "Pell Basin", region: "East", capacityMw: 220, outputMw: 0, status: "offline", efficiency: 0 },
  { id: "s8", name: "Orrick Tidal", region: "Coast", capacityMw: 150, outputMw: 96, status: "maintenance", efficiency: 64 },
];

export const STATUS_LABEL: Record<SiteStatus, string> = {
  online: "Online",
  curtailed: "Curtailed",
  offline: "Offline",
  maintenance: "Maintenance",
};

/* ---- storage half-gauge ---- */
export const STORAGE = { usedMwh: 318, capacityMwh: 520, chargeRate: 42 };

/* ---- health score, 8 segments ---- */
export const HEALTH = { score: 84, label: "Stable" };

/* ---- goals donut ---- */
export const GOALS = { pct: 75, done: 12, total: 20, note: "On pace to clear the quarterly target by 6 October." };

/* ---- the 5 saturated tiles (the one pop moment) ---- */
export const TILES = [
  { label: "Output", value: "6.24", unit: "GW" },
  { label: "Carbon", value: "11.4", unit: "kt" },
  { label: "Curtail", value: "4.1", unit: "%" },
  { label: "Storage", value: "61", unit: "%" },
  { label: "Frequency", value: "50.01", unit: "Hz" },
];

/* ---- ranked horizontal bars (top contributors) ---- */
export const RANKED = [
  { label: "Solano Flats", value: 496, unit: "MW" },
  { label: "Ardennes Array", value: 388, unit: "MW" },
  { label: "Brackenmoor", value: 268, unit: "MW" },
  { label: "Kestrel Ridge", value: 214, unit: "MW" },
  { label: "Halloway Solar", value: 172, unit: "MW" },
  { label: "Vantbrook Wind", value: 121, unit: "MW" },
];

/* ---- alerts feed ---- */
export const ALERTS = [
  { id: "a1", text: "Vantbrook Wind curtailed by the balancing market", when: "4 min ago", severity: "warn" as const },
  { id: "a2", text: "Pell Basin lost connection — retrying", when: "22 min ago", severity: "bad" as const },
  { id: "a3", text: "Frequency restored to nominal", when: "1 h ago", severity: "ok" as const },
  { id: "a4", text: "Orrick Tidal maintenance window opened", when: "3 h ago", severity: "mute" as const },
];

/* ---- 8 weeks of output, for the overview column chart ---- */
export const WEEKS = [
  { label: "1w", value: 62 }, { label: "2w", value: 71 }, { label: "3w", value: 58 },
  { label: "4w", value: 84 }, { label: "5w", value: 76 }, { label: "6w", value: 91 },
  { label: "7w", value: 88 }, { label: "8w", value: 97 },
];
export const WEEK_AVG = 78;

export const fmt = (n: number, d = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const sum = (a: number[]) => a.reduce((x, y) => x + y, 0);
export const totalCapacity = SITES.reduce((a, s) => a + s.capacityMw, 0);
export const totalOutput = SITES.reduce((a, s) => a + s.outputMw, 0);

/* ---- insights view: heat map, tree map, radar, radial bars, gauge ---- */

export const HEAT_ROWS = ["Nord", "Ost", "West", "Coast"];
export const HEAT_COLS = ["00", "04", "08", "12", "16", "20"];
export const HEAT = HEAT_ROWS.map((_, r) =>
  HEAT_COLS.map((__, c) => Math.round(18 + 74 * Math.abs(Math.sin((r + 1) * 1.3 + c * 0.9))))
);

export const TREE = [
  { label: "Onshore wind", value: 34, color: "var(--chart-series-1)", fg: "var(--color-primary-fg)" },
  { label: "Utility solar", value: 26, color: "var(--chart-series-3)", fg: "var(--color-tertiary-fg)" },
  { label: "Offshore wind", value: 18, color: "var(--chart-series-4)", fg: "var(--color-primary-fg)" },
  { label: "Storage", value: 12, color: "var(--chart-series-2)", fg: "var(--color-secondary-fg)" },
  { label: "Demand response", value: 6, color: "var(--chart-series-5)", fg: "var(--color-error-fg)" },
  { label: "Other", value: 4, color: "var(--color-surface-4)", fg: "var(--color-text)" },
];

export const RADAR_AXES = ["Yield", "Predictability", "Storage", "Coverage", "Flexibility", "Cost"];
export const RADAR_NOW = [86, 71, 58, 92, 64, 77];
export const RADAR_TARGET = [92, 88, 74, 95, 81, 84];

export const RADIAL = [
  { label: "Capacity", value: 1755, max: 2380, color: "var(--chart-series-1)" },
  { label: "Storage", value: 318, max: 520, color: "var(--chart-series-2)" },
  { label: "Reserve", value: 61, max: 100, color: "var(--chart-series-3)" },
  { label: "Headroom", value: 44, max: 100, color: "var(--chart-series-4)" },
];

export const RESERVE = { pct: 61, sub: "reserve margin" };
