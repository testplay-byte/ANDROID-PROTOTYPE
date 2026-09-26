/**
 * smart-home / lib / data — types + realistic mock data.
 * Pure logic + constants, no React imports.
 */

export type RoomId = "living" | "kitchen" | "bedroom";

export type DeviceKind =
  | "thermostat"
  | "light"
  | "camera"
  | "speaker"
  | "lock"
  | "plug";

export interface HomeDevice {
  id: string;
  name: string;
  room: RoomId;
  kind: DeviceKind;
  on: boolean;
  /** Lights only — 0..100. */
  brightness: number;
  /** Thermostat only — target °C. */
  target: number;
}

export interface Room {
  id: RoomId;
  label: string;
  /** Current temperature °C. */
  temp: number;
}

export const ROOMS: Room[] = [
  { id: "living", label: "Living", temp: 21.5 },
  { id: "kitchen", label: "Kitchen", temp: 22.1 },
  { id: "bedroom", label: "Bedroom", temp: 20.4 },
];

export const INITIAL_DEVICES: HomeDevice[] = [
  { id: "thermostat", name: "Thermostat", room: "living", kind: "thermostat", on: true, brightness: 0, target: 21.5 },
  { id: "light-lamp", name: "Floor lamp", room: "living", kind: "light", on: true, brightness: 72, target: 0 },
  { id: "light-kitchen", name: "Ceiling light", room: "kitchen", kind: "light", on: false, brightness: 100, target: 0 },
  { id: "light-bedside", name: "Bedside light", room: "bedroom", kind: "light", on: true, brightness: 35, target: 0 },
  { id: "camera", name: "Front door cam", room: "living", kind: "camera", on: true, brightness: 0, target: 0 },
  { id: "speaker", name: "Living speaker", room: "living", kind: "speaker", on: true, brightness: 0, target: 0 },
  { id: "lock", name: "Front door lock", room: "living", kind: "lock", on: true, brightness: 0, target: 0 },
  { id: "plug-coffee", name: "Coffee maker", room: "kitchen", kind: "plug", on: false, brightness: 0, target: 0 },
];

/* ---- Energy mock data ---- */

export interface UsagePoint {
  label: string;
  kwh: number;
}

/** Usage per day this week (kWh). */
export const WEEK_USAGE: UsagePoint[] = [
  { label: "Mon", kwh: 14.2 },
  { label: "Tue", kwh: 11.8 },
  { label: "Wed", kwh: 16.5 },
  { label: "Thu", kwh: 12.1 },
  { label: "Fri", kwh: 18.9 },
  { label: "Sat", kwh: 21.4 },
  { label: "Sun", kwh: 9.6 },
];

/** Usage by time-of-day today (kWh). */
export const TODAY_USAGE: UsagePoint[] = [
  { label: "6a", kwh: 1.2 },
  { label: "9a", kwh: 2.8 },
  { label: "12p", kwh: 3.4 },
  { label: "3p", kwh: 2.1 },
  { label: "6p", kwh: 5.6 },
  { label: "9p", kwh: 3.9 },
];

export interface DeviceUsage {
  id: string;
  name: string;
  kwh: number;
}

/** Per-device usage this week (kWh). */
export const DEVICE_USAGE: DeviceUsage[] = [
  { id: "thermostat", name: "Thermostat", kwh: 38.2 },
  { id: "lights", name: "Lights", kwh: 14.6 },
  { id: "camera", name: "Security cam", kwh: 9.1 },
  { id: "speaker", name: "Speaker", kwh: 6.4 },
  { id: "coffee", name: "Coffee maker", kwh: 3.8 },
  { id: "other", name: "Other", kwh: 12.4 },
];

export function weekTotal(points: UsagePoint[]): number {
  return points.reduce((sum, p) => sum + p.kwh, 0);
}

export function peakIndex(points: UsagePoint[]): number {
  let idx = 0;
  for (let i = 1; i < points.length; i++) {
    if (points[i].kwh > points[idx].kwh) idx = i;
  }
  return idx;
}

export function maxUsage(points: UsagePoint[]): number {
  return points.reduce((m, p) => Math.max(m, p.kwh), 0);
}
