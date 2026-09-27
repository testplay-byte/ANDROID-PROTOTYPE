/* data — mock city database & shared labels (ported from the reference data.js) */

export type CondCode =
  | "clear"
  | "partly"
  | "cloudy"
  | "overcast"
  | "drizzle"
  | "rain"
  | "storm"
  | "snow"
  | "fog";

export interface City {
  id: string;
  name: string;
  country: string;
  cc: string;
  tz: number;
  base: number;
  cond: CondCode;
  rh: number;
  wind: number;
  wdir: number;
  uv: number;
  pres: number;
  vis: number;
  dew: number;
  rise: string;
  set: string;
  codes: CondCode[];
}

export const CITIES: City[] = [
  { id: "sf", name: "San Francisco", country: "United States", cc: "US", tz: -7, base: 17.5, cond: "fog", rh: 78, wind: 14, wdir: 262, uv: 4, pres: 1014, vis: 8, dew: 12.5, rise: "06:58", set: "19:12", codes: ["fog", "partly", "cloudy", "partly", "clear", "partly", "fog"] },
  { id: "nyc", name: "New York", country: "United States", cc: "US", tz: -4, base: 16.0, cond: "rain", rh: 86, wind: 22, wdir: 74, uv: 2, pres: 1006, vis: 6, dew: 13.8, rise: "06:48", set: "18:56", codes: ["rain", "rain", "drizzle", "cloudy", "partly", "clear", "partly"] },
  { id: "lon", name: "London", country: "United Kingdom", cc: "GB", tz: 1, base: 13.5, cond: "cloudy", rh: 80, wind: 18, wdir: 205, uv: 3, pres: 1010, vis: 9, dew: 10.2, rise: "07:04", set: "18:58", codes: ["cloudy", "drizzle", "cloudy", "overcast", "partly", "rain", "cloudy"] },
  { id: "tok", name: "Tokyo", country: "Japan", cc: "JP", tz: 9, base: 23.5, cond: "clear", rh: 62, wind: 10, wdir: 120, uv: 6, pres: 1018, vis: 16, dew: 15.6, rise: "05:48", set: "17:46", codes: ["clear", "clear", "partly", "cloudy", "clear", "clear", "partly"] },
  { id: "par", name: "Paris", country: "France", cc: "FR", tz: 2, base: 18.0, cond: "partly", rh: 64, wind: 12, wdir: 160, uv: 5, pres: 1017, vis: 12, dew: 10.8, rise: "07:26", set: "19:32", codes: ["partly", "clear", "partly", "cloudy", "drizzle", "partly", "clear"] },
  { id: "syd", name: "Sydney", country: "Australia", cc: "AU", tz: 10, base: 20.5, cond: "clear", rh: 58, wind: 16, wdir: 40, uv: 8, pres: 1020, vis: 18, dew: 11.9, rise: "06:12", set: "18:24", codes: ["clear", "partly", "clear", "clear", "cloudy", "rain", "partly"] },
  { id: "dxb", name: "Dubai", country: "UAE", cc: "AE", tz: 4, base: 36.0, cond: "clear", rh: 42, wind: 9, wdir: 300, uv: 9, pres: 1008, vis: 14, dew: 20.5, rise: "05:58", set: "18:06", codes: ["clear", "clear", "clear", "partly", "clear", "clear", "clear"] },
  { id: "rey", name: "Reykjavík", country: "Iceland", cc: "IS", tz: 0, base: 2.5, cond: "snow", rh: 81, wind: 34, wdir: 180, uv: 1, pres: 998, vis: 3, dew: -0.5, rise: "07:32", set: "18:52", codes: ["snow", "snow", "cloudy", "overcast", "partly", "snow", "cloudy"] },
  { id: "sg", name: "Singapore", country: "Singapore", cc: "SG", tz: 8, base: 29.5, cond: "storm", rh: 88, wind: 11, wdir: 90, uv: 7, pres: 1009, vis: 8, dew: 26.8, rise: "07:02", set: "19:04", codes: ["storm", "rain", "drizzle", "partly", "storm", "rain", "cloudy"] },
  { id: "cpt", name: "Cape Town", country: "South Africa", cc: "ZA", tz: 2, base: 19.0, cond: "partly", rh: 66, wind: 24, wdir: 220, uv: 7, pres: 1016, vis: 15, dew: 12.4, rise: "06:38", set: "18:34", codes: ["partly", "clear", "cloudy", "rain", "partly", "clear", "partly"] },
  { id: "rio", name: "Rio de Janeiro", country: "Brazil", cc: "BR", tz: -3, base: 27.5, cond: "clear", rh: 72, wind: 13, wdir: 30, uv: 9, pres: 1012, vis: 17, dew: 22.0, rise: "05:54", set: "18:02", codes: ["clear", "partly", "clear", "storm", "rain", "partly", "clear"] },
  { id: "zrh", name: "Zürich", country: "Switzerland", cc: "CH", tz: 2, base: 11.5, cond: "fog", rh: 90, wind: 6, wdir: 140, uv: 2, pres: 1021, vis: 2, dew: 9.9, rise: "07:18", set: "19:08", codes: ["fog", "overcast", "cloudy", "drizzle", "partly", "fog", "cloudy"] },
];

export const CITY_BY_ID: Record<string, City> = Object.fromEntries(
  CITIES.map((c) => [c.id, c])
);

export const COND_LABEL: Record<CondCode, string> = {
  clear: "Clear",
  partly: "Partly Cloudy",
  cloudy: "Cloudy",
  overcast: "Overcast",
  drizzle: "Light Drizzle",
  rain: "Rain",
  storm: "Thunderstorm",
  snow: "Snow",
  fog: "Foggy",
};

const DIRS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
export const WDIR_LABEL = (d: number) =>
  DIRS[Math.round((d % 360) / 22.5) % 16];

export const greeting = (h: number) =>
  h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Good night";

export function dateLabelLong(d: Date): string {
  return (
    ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()] +
    ", " +
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()] +
    " " +
    d.getDate()
  );
}

/** Date shifted into the city's local frame (use local getters on the result) */
export function cityNow(city: City): Date {
  return new Date(Date.now() + city.tz * 3600e3 + new Date().getTimezoneOffset() * 60e3);
}
