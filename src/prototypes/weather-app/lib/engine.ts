/* engine — deterministic mock weather generation, cached per city/day
   (ported from the reference engine.js; identical math & seeds) */

import { hashStr, mulberry, clamp } from "./utils";
import type { City, CondCode } from "./data";
import { cityNow } from "./data";

export interface DayForecast {
  code: CondCode;
  hi: number;
  lo: number;
  date: Date;
  dow: string;
  dowS: string;
  dateLabel: string;
  pp: number;
  rh: number;
  wind: number;
  wdir: number;
  uv: number;
  cloud: number;
}

export interface HourPoint {
  h24: number;
  m: number;
  isDay: boolean;
  code: CondCode;
  temp: number;
  pp: number;
  wind: number;
}

export interface CurrentWeather extends DayForecast {
  temp: number;
  isDay: boolean;
  feels: number;
  aqi: number;
}

export interface CityWeatherData {
  now: number;
  riseM: number;
  setM: number;
  daily: DayForecast[];
  hourly: HourPoint[];
  current: CurrentWeather;
  localTime: string;
}

const wxCache: Record<string, CityWeatherData> = {};

const hmToMin = (s: string) => {
  const [a, b] = s.split(":");
  return +a * 60 + +b;
};

function feelsLike(t: number, rh: number, wind: number): number {
  const windChill =
    13.12 + 0.6215 * t - 11.37 * Math.pow(Math.max(wind, 1), 0.16) + 0.3965 * t * Math.pow(Math.max(wind, 1), 0.16);
  const heat = t + 0.33 * Math.exp(((rh / 100) * 17.27 * t) / (237.7 + t)) - 4;
  return t < 10 ? windChill : t > 26 ? heat : t;
}

function pickVariant(code: CondCode, r: () => number): CondCode {
  const map: Record<string, CondCode[]> = {
    clear: ["partly", "clear", "clear"],
    partly: ["clear", "cloudy", "partly"],
    cloudy: ["partly", "overcast", "cloudy"],
    overcast: ["cloudy", "drizzle", "overcast"],
    drizzle: ["cloudy", "rain", "drizzle"],
    rain: ["drizzle", "storm", "rain"],
    storm: ["rain", "storm", "storm"],
    snow: ["snow", "overcast", "snow"],
    fog: ["cloudy", "overcast", "fog"],
  };
  const arr = map[code] || [code];
  return arr[Math.floor(r() * arr.length)];
}

/** Build (or fetch cached) weather for a city: current + 24h + 7 days.
    Same city + same calendar day ⇒ identical data, so renders are stable. */
export function cityWeather(city: City): CityWeatherData {
  if (wxCache[city.id]) return wxCache[city.id];

  const now = cityNow(city);
  const dowS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dowsFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateKey = now.toDateString().slice(4, 10);

  const daily: DayForecast[] = city.codes.map((code, i) => {
    const r = mulberry(hashStr(city.id + "d" + i + dateKey));
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const hi = +(city.base + (i ? r() * 4 - 1.5 : 1.2)).toFixed(0);
    const lo = +(hi - (4.5 + r() * 4)).toFixed(0);
    const ppBase =
      ({ clear: 4, partly: 16, cloudy: 24, overcast: 30, drizzle: 52, rain: 72, storm: 80, snow: 64, fog: 10 } as Record<CondCode, number>)[code] || 20;
    return {
      code,
      hi,
      lo,
      date,
      dow: dowsFull[date.getDay()],
      dowS: dowS[date.getDay()],
      dateLabel: months[date.getMonth()] + " " + date.getDate(),
      pp: Math.round(ppBase + r() * 14 - 6),
      rh: Math.round(clamp(city.rh + (r() * 14 - 7), 20, 98)),
      wind: Math.round(city.wind + r() * 10 - 4),
      wdir: (city.wdir + r() * 50 - 25 + 360) % 360,
      uv: clamp(Math.round(city.uv + r() * 2 - 1), 0, 11),
      cloud: Math.round(12 + r() * 74),
    };
  });
  const t0 = daily[0];

  const localMin = now.getHours() * 60 + now.getMinutes();
  const riseM = hmToMin(city.rise);
  const setM = hmToMin(city.set);

  const hourly: HourPoint[] = [];
  for (let i = 0; i < 24; i++) {
    const m = (localMin + i * 60) % 1440;
    const h24 = Math.floor(m / 60);
    const isDay = m >= riseM && m < setM;
    const r = mulberry(hashStr(city.id + "h" + h24 + dateKey));
    const diurnal = Math.sin(((h24 - 9) / 24) * Math.PI * 2); // peak ~15:00
    const temp = t0.lo + (t0.hi - t0.lo) * (0.5 + 0.5 * diurnal) + (i ? r() * 1.6 - 0.8 : 0);
    let code = t0.code;
    if (i > 0 && r() < 0.22) code = pickVariant(code, r);
    hourly.push({
      h24,
      m,
      isDay,
      code,
      temp: +temp.toFixed(1),
      pp: Math.round(clamp(t0.pp + r() * 22 - 11, 0, 98)),
      wind: Math.max(1, Math.round(city.wind + r() * 8 - 3 + diurnal * 2)),
    });
  }

  const rr = mulberry(hashStr(city.id + "x" + dateKey));
  const current: CurrentWeather = {
    ...t0,
    temp: hourly[0].temp,
    isDay: hourly[0].isDay,
    feels: Math.round(feelsLike(hourly[0].temp, city.rh, city.wind)),
    aqi: Math.round(12 + rr() * 66),
  };

  const out: CityWeatherData = {
    now: localMin,
    riseM,
    setM,
    daily,
    hourly,
    current,
    localTime: String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0"),
  };
  wxCache[city.id] = out;
  return out;
}

export function resetCache() {
  Object.keys(wxCache).forEach((k) => delete wxCache[k]);
}
