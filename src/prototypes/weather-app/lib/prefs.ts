/* prefs — persisted preferences + display formatting
   (ported from the reference state.js; formatters take prefs explicitly) */

export type Unit = "c" | "f";
export type WindUnit = "kmh" | "mph" | "ms";
export type TimeFormat = "12h" | "24h";
export type ThemeId = "dawn" | "day" | "dusk" | "night";

export interface Prefs {
  city: string;
  favorites: string[];
  unit: Unit;
  windU: WindUnit;
  timeF: TimeFormat;
  theme: ThemeId;
  themeAuto: boolean;
  blur: number;
  reduceMotion: boolean;
  simError: boolean;
  updated: number;
}

export const PREFS_KEY = "weather-app-prefs-v1";

export const DEFAULT_PREFS: Prefs = {
  city: "sf",
  favorites: ["sf", "lon", "tok", "par", "nyc", "syd", "dxb", "rey"],
  unit: "c",
  windU: "kmh",
  timeF: "12h",
  theme: "dawn",
  themeAuto: false,
  blur: 26,
  reduceMotion: false,
  simError: false,
  updated: Date.now(),
};

export function loadPrefs(): Prefs {
  try {
    const s = JSON.parse(localStorage.getItem(PREFS_KEY) ?? "null");
    if (s && Array.isArray(s.favorites)) return { ...DEFAULT_PREFS, ...s };
  } catch {
    /* private mode etc. */
  }
  return { ...DEFAULT_PREFS };
}

export function savePrefs(p: Prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function resetPrefs(): Prefs {
  try {
    localStorage.removeItem(PREFS_KEY);
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_PREFS, updated: Date.now() };
}

/* ---------------- formatting ---------------- */

export const t = (c: number, unit: Unit) => Math.round(unit === "f" ? (c * 9) / 5 + 32 : c);
export const deg = (c: number, unit: Unit) => t(c, unit) + "°";

export function windV(kmh: number, unit: WindUnit): [number, string] {
  if (unit === "mph") return [Math.round(kmh * 0.6214), "mph"];
  if (unit === "ms") return [Math.round(kmh / 3.6), "m/s"];
  return [Math.round(kmh), "km/h"];
}

export function timeStr(h: number, m: number, fmt: TimeFormat): string {
  if (fmt === "24h") return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  const ap = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return h12 + ":" + String(m).padStart(2, "0") + " " + ap;
}

export const hourLabel = (h24: number, fmt: TimeFormat) =>
  fmt === "12h"
    ? (h24 % 12 === 0 ? 12 : h24 % 12) + (h24 < 12 ? " AM" : " PM")
    : String(h24).padStart(2, "0") + ":00";

export const minStr = (mins: number, fmt: TimeFormat) => timeStr(Math.floor(mins / 60) % 24, mins % 60, fmt);
