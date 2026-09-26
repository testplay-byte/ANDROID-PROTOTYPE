/**
 * weather-app / lib / weather — types, deterministic mock weather data,
 * and unit-conversion helpers. Pure logic, no React.
 */

export type Unit = "c" | "f";

export type Condition =
  | "clear" // sunny / clear night
  | "partly" // partly cloudy
  | "cloudy"
  | "rain"
  | "storm"
  | "snow";

export interface HourPoint {
  /** Display label, e.g. "Now", "14". */
  hour: string;
  tempC: number;
  condition: Condition;
}

export interface DayPoint {
  /** Display label, e.g. "Today", "Thu". */
  day: string;
  hiC: number;
  loC: number;
  condition: Condition;
}

export interface CityWeather {
  id: string;
  name: string;
  country: string;
  tempC: number;
  feelsLikeC: number;
  condition: Condition;
  /** Short condition description, e.g. "Partly cloudy". */
  description: string;
  humidity: number;
  windKph: number;
  uv: number;
  /** hPa */
  pressure: number;
  hiC: number;
  loC: number;
  hourly: HourPoint[];
  daily: DayPoint[];
}

/** Fixed wobble so generated data looks natural but stays deterministic. */
const WOBBLE = [0, 1.5, -1, 2, -2, 1, -1.5, 2.5, -0.5, 1.5];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const DAY_LABELS = ["Today", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];

interface CitySeed {
  id: string;
  name: string;
  country: string;
  baseC: number;
  condition: Condition;
  description: string;
  humidity: number;
  windKph: number;
  uv: number;
  /** Starting hour for the hourly strip (0-23). */
  startHour: number;
}

const SEEDS: CitySeed[] = [
  { id: "sf", name: "San Francisco", country: "USA", baseC: 22, condition: "clear", description: "Sunny", humidity: 58, windKph: 14, uv: 6, startHour: 14 },
  { id: "tokyo", name: "Tokyo", country: "Japan", baseC: 27, condition: "partly", description: "Partly cloudy", humidity: 71, windKph: 9, uv: 5, startHour: 21 },
  { id: "london", name: "London", country: "UK", baseC: 15, condition: "rain", description: "Light rain", humidity: 84, windKph: 22, uv: 2, startHour: 9 },
  { id: "reykjavik", name: "Reykjavik", country: "Iceland", baseC: 3, condition: "snow", description: "Snow showers", humidity: 77, windKph: 31, uv: 1, startHour: 6 },
  { id: "dubai", name: "Dubai", country: "UAE", baseC: 36, condition: "clear", description: "Clear and hot", humidity: 41, windKph: 11, uv: 9, startHour: 11 },
];

const CONDITIONS_BY_BASE: Condition[] = ["clear", "partly", "cloudy", "rain", "partly", "storm", "cloudy"];

function buildCity(seed: CitySeed): CityWeather {
  const h = hashStr(seed.id);
  const w = (i: number) => WOBBLE[(h + i) % WOBBLE.length];

  const hourly: HourPoint[] = [];
  for (let i = 0; i < 8; i++) {
    hourly.push({
      hour: i === 0 ? "Now" : String((seed.startHour + i) % 24),
      tempC: Math.round(seed.baseC + w(i) - i * 0.4),
      condition:
        i === 0
          ? seed.condition
          : CONDITIONS_BY_BASE[(h + i) % CONDITIONS_BY_BASE.length],
    });
  }

  const daily: DayPoint[] = DAY_LABELS.map((day, i) => ({
    day,
    hiC: Math.round(seed.baseC + 4 + w(i * 2 + 1) - i * 0.3),
    loC: Math.round(seed.baseC - 5 + w(i * 2 + 2) - i * 0.2),
    condition:
      i === 0
        ? seed.condition
        : CONDITIONS_BY_BASE[(h + i * 3) % CONDITIONS_BY_BASE.length],
  }));

  return {
    id: seed.id,
    name: seed.name,
    country: seed.country,
    tempC: seed.baseC,
    feelsLikeC: Math.round(seed.baseC + (seed.humidity > 70 ? 2 : -1) + w(3) * 0.5),
    condition: seed.condition,
    description: seed.description,
    humidity: seed.humidity,
    windKph: seed.windKph,
    uv: seed.uv,
    pressure: 1004 + (h % 18),
    hiC: daily[0].hiC,
    loC: daily[0].loC,
    hourly,
    daily,
  };
}

export const CITIES: CityWeather[] = SEEDS.map(buildCity);

/**
 * Build a placeholder CityWeather for the add-city input — deterministic
 * per name, so the same city always gets the same (fake) data.
 */
export function makeCity(name: string): CityWeather {
  const clean = name.trim();
  const h = hashStr(clean.toLowerCase());
  const seed: CitySeed = {
    id: `user-${h}`,
    name: clean,
    country: "Added",
    baseC: 8 + (h % 26),
    condition: CONDITIONS_BY_BASE[h % CONDITIONS_BY_BASE.length],
    description: "Prototype data",
    humidity: 45 + (h % 40),
    windKph: 5 + (h % 25),
    uv: 1 + (h % 8),
    startHour: h % 24,
  };
  return buildCity(seed);
}

/** Convert a Celsius value to the active unit (rounded). */
export function toUnit(tempC: number, unit: Unit): number {
  if (unit === "f") return Math.round((tempC * 9) / 5 + 32);
  return Math.round(tempC);
}

/** 22.4 °C + "f" → "72°" — converts and formats for display everywhere. */
export function formatTemp(tempC: number, unit: Unit): string {
  return `${toUnit(tempC, unit)}°`;
}
