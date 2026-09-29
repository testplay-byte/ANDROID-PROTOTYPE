/**
 * halo / data — deterministic demo data for the desktop smart-home console.
 *
 * Every number here is a fixed literal. There is no `Math.random`, no
 * `Date.now()` and no clock read anywhere in the prototype, so the home
 * summary, the 24-hour power curve, the energy comparison and every counter
 * look byte-identical on every load — the same rule every phone prototype in
 * this repo follows.
 *
 * Energy model (deliberately simple so the numbers add up in the UI):
 *   watts(dev)   = dev.on ? dev.watts   : dev.standby
 *   kwh(dev)     = dev.on ? dev.kwh24   : dev.idle      (today)
 *   kwhPrev(dev) = dev.on ? dev.kwh24y  : dev.idle      (yesterday)
 * Switching a device off therefore drops it to its idle draw in BOTH the
 * "live load" readout and the energy view, which is what makes the rooms
 * drawer and the home grid feel like one app.
 */

export type RoomId = "living" | "kitchen" | "hall" | "bedroom" | "office" | "bath";

export type DeviceKind =
  | "light"
  | "climate"
  | "media"
  | "camera"
  | "lock"
  | "plug"
  | "sensor"
  | "purifier"
  | "blind";

export interface Room {
  id: RoomId;
  name: string;
  floor: string;
  /** Measured temperature °C — fixed, not derived from the device state. */
  temp: number;
  /** Target setpoint the room's climate devices are holding. */
  target: number;
}

export interface Device {
  id: string;
  name: string;
  room: RoomId;
  kind: DeviceKind;
  /** Power state. For a lock, `on` means LOCKED. For a sensor, ARMED. */
  on: boolean;
  /** The dimmable/measurable value shown in the carved well. */
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  /** Instantaneous draw while on, watts. */
  watts: number;
  /** Draw while off, watts (standby). */
  standby: number;
  /** kWh used today while on. */
  kwh24: number;
  /** kWh used yesterday while on — the comparison baseline. */
  kwh24y: number;
  /** kWh used today while off (standby). */
  idle: number;
  online: boolean;
}

/* ------------------------------------------------------------------ rooms */

export const ROOMS: Room[] = [
  { id: "living", name: "Living room", floor: "Ground floor", temp: 21.6, target: 20.5 },
  { id: "kitchen", name: "Kitchen", floor: "Ground floor", temp: 22.4, target: 19.0 },
  { id: "hall", name: "Hallway", floor: "Ground floor", temp: 18.9, target: 17.0 },
  { id: "bedroom", name: "Bedroom", floor: "First floor", temp: 19.4, target: 18.0 },
  { id: "office", name: "Home office", floor: "First floor", temp: 21.9, target: 21.0 },
  { id: "bath", name: "Bathroom", floor: "First floor", temp: 23.1, target: 21.0 },
];

export const roomById = (id: RoomId) => ROOMS.find((r) => r.id === id)!;

/* ---------------------------------------------------------------- devices */

export const DEVICES: Device[] = [
  /* ---- living room ---- */
  { id: "ceil-living", name: "Ceiling lights", room: "living", kind: "light", on: true, value: 70, unit: "%", min: 0, max: 100, step: 5, watts: 42, standby: 0.4, kwh24: 1.42, kwh24y: 1.61, idle: 0.02, online: true },
  { id: "lamp-living", name: "Floor lamp", room: "living", kind: "light", on: true, value: 45, unit: "%", min: 0, max: 100, step: 5, watts: 9, standby: 0.2, kwh24: 0.38, kwh24y: 0.44, idle: 0.01, online: true },
  { id: "blind-living", name: "Living room blinds", room: "living", kind: "blind", on: false, value: 100, unit: "%", min: 0, max: 100, step: 10, watts: 0, standby: 0.3, kwh24: 0.06, kwh24y: 0.09, idle: 0.06, online: true },
  { id: "sound-living", name: "Soundbar", room: "living", kind: "media", on: false, value: 35, unit: "%", min: 0, max: 100, step: 5, watts: 22, standby: 1.2, kwh24: 0.18, kwh24y: 0.41, idle: 0.29, online: true },
  { id: "tv-living", name: "TV wall plug", room: "living", kind: "plug", on: true, value: 0, unit: "W", min: 0, max: 0, step: 0, watts: 118, standby: 2.4, kwh24: 1.24, kwh24y: 1.02, idle: 0.48, online: true },
  { id: "valve-living", name: "Radiator valve", room: "living", kind: "climate", on: true, value: 20.5, unit: "°C", min: 15, max: 23, step: 0.5, watts: 0, standby: 0.5, kwh24: 1.85, kwh24y: 2.14, idle: 0.12, online: true },

  /* ---- kitchen ---- */
  { id: "pendant-kitchen", name: "Island pendants", room: "kitchen", kind: "light", on: false, value: 80, unit: "%", min: 0, max: 100, step: 5, watts: 36, standby: 0.4, kwh24: 0.95, kwh24y: 1.28, idle: 0.02, online: true },
  { id: "kettle-kitchen", name: "Kettle plug", room: "kitchen", kind: "plug", on: true, value: 0, unit: "W", min: 0, max: 0, step: 0, watts: 1850, standby: 0.3, kwh24: 1.12, kwh24y: 0.86, idle: 0.07, online: true },
  { id: "fan-kitchen", name: "Extractor fan", room: "kitchen", kind: "climate", on: false, value: 30, unit: "%", min: 0, max: 100, step: 10, watts: 64, standby: 0.2, kwh24: 0.34, kwh24y: 0.51, idle: 0.05, online: true },
  { id: "leak-kitchen", name: "Leak sensor", room: "kitchen", kind: "sensor", on: true, value: 0, unit: "", min: 0, max: 0, step: 0, watts: 0.4, standby: 0.4, kwh24: 0.09, kwh24y: 0.09, idle: 0.09, online: true },

  /* ---- hallway ---- */
  { id: "strip-hall", name: "Hallway strip", room: "hall", kind: "light", on: true, value: 40, unit: "%", min: 0, max: 100, step: 5, watts: 12, standby: 0.3, kwh24: 0.44, kwh24y: 0.52, idle: 0.01, online: true },
  { id: "lock-hall", name: "Front door lock", room: "hall", kind: "lock", on: true, value: 0, unit: "", min: 0, max: 0, step: 0, watts: 0.6, standby: 0.6, kwh24: 0.11, kwh24y: 0.11, idle: 0.11, online: true },
  { id: "cam-hall", name: "Hallway camera", room: "hall", kind: "camera", on: true, value: 0, unit: "", min: 0, max: 0, step: 0, watts: 5.4, standby: 0.3, kwh24: 0.86, kwh24y: 0.74, idle: 0.07, online: true },

  /* ---- bedroom ---- */
  { id: "bed-bed", name: "Bedside lamp", room: "bedroom", kind: "light", on: false, value: 30, unit: "%", min: 0, max: 100, step: 5, watts: 7, standby: 0.2, kwh24: 0.21, kwh24y: 0.36, idle: 0.01, online: true },
  { id: "thermo-bed", name: "Bedroom thermostat", room: "bedroom", kind: "climate", on: true, value: 18, unit: "°C", min: 15, max: 23, step: 0.5, watts: 0, standby: 0.5, kwh24: 2.34, kwh24y: 2.71, idle: 0.12, online: true },
  { id: "blind-bed", name: "Blackout blind", room: "bedroom", kind: "blind", on: false, value: 0, unit: "%", min: 0, max: 100, step: 10, watts: 0, standby: 0.3, kwh24: 0.05, kwh24y: 0.07, idle: 0.05, online: true },
  { id: "purifier-bed", name: "Air purifier", room: "bedroom", kind: "purifier", on: true, value: 40, unit: "%", min: 0, max: 100, step: 10, watts: 28, standby: 0.6, kwh24: 0.74, kwh24y: 0.92, idle: 0.14, online: true },

  /* ---- home office ---- */
  { id: "desk-office", name: "Desk light", room: "office", kind: "light", on: true, value: 85, unit: "%", min: 0, max: 100, step: 5, watts: 11, standby: 0.2, kwh24: 0.52, kwh24y: 0.48, idle: 0.01, online: true },
  { id: "rig-office", name: "Workstation plug", room: "office", kind: "plug", on: true, value: 0, unit: "W", min: 0, max: 0, step: 0, watts: 214, standby: 1.8, kwh24: 2.61, kwh24y: 2.88, idle: 0.43, online: true },
  { id: "thermo-office", name: "Office thermostat", room: "office", kind: "climate", on: true, value: 21, unit: "°C", min: 15, max: 23, step: 0.5, watts: 0, standby: 0.5, kwh24: 1.42, kwh24y: 1.66, idle: 0.12, online: true },

  /* ---- bathroom ---- */
  { id: "mirror-bath", name: "Mirror light", room: "bath", kind: "light", on: true, value: 60, unit: "%", min: 0, max: 100, step: 5, watts: 8, standby: 0.2, kwh24: 0.29, kwh24y: 0.33, idle: 0.01, online: true },
  { id: "towel-bath", name: "Towel rail plug", room: "bath", kind: "plug", on: false, value: 0, unit: "W", min: 0, max: 0, step: 0, watts: 180, standby: 0.2, kwh24: 0.64, kwh24y: 0.48, idle: 0.05, online: false },
  { id: "humid-bath", name: "Humidity sensor", room: "bath", kind: "sensor", on: true, value: 0, unit: "", min: 0, max: 0, step: 0, watts: 0.4, standby: 0.4, kwh24: 0.09, kwh24y: 0.09, idle: 0.09, online: true },
];

/* ------------------------------------------------------------------ meta */

export const KIND_LABEL: Record<DeviceKind, string> = {
  light: "Light",
  climate: "Climate",
  media: "Media",
  camera: "Camera",
  lock: "Lock",
  plug: "Smart plug",
  sensor: "Sensor",
  purifier: "Purifier",
  blind: "Blind",
};

/** Kinds whose value is a real dial the user can turn, not just a state. */
export const ADJUSTABLE: Record<DeviceKind, boolean> = {
  light: true,
  climate: true,
  blind: true,
  media: true,
  purifier: true,
  camera: false,
  lock: false,
  plug: false,
  sensor: false,
};

/** A locked door and an armed sensor read inverted to a plain on/off. */
export const ACTIVE_WORD: Record<DeviceKind, string> = {
  light: "On",
  climate: "Heating to",
  media: "Playing",
  camera: "Recording",
  lock: "Locked",
  plug: "Powered",
  sensor: "Armed",
  purifier: "Running",
  blind: "Open",
};

export const IDLE_WORD: Record<DeviceKind, string> = {
  light: "Off",
  climate: "Idle",
  media: "Paused",
  camera: "Standby",
  lock: "Unlocked",
  plug: "Standby",
  sensor: "Disarmed",
  purifier: "Off",
  blind: "Closed",
};

/* ---------------------------------------------------------------- energy */

/** The wall clock the prototype is frozen at — 14:00. Never `Date.now()`. */
export const CURRENT_HOUR = 14;

/** kWh per hour, today, 00:00 → 23:00. Fixed 24 values. */
export const USAGE_TODAY = [
  0.18, 0.14, 0.13, 0.12, 0.13, 0.19, 0.34, 0.62, 0.48, 0.31, 0.27, 0.3, 0.36, 0.33, 0.29, 0.32, 0.41, 0.66,
  0.83, 0.79, 0.62, 0.47, 0.33, 0.24,
];

/** The same 24 hours, yesterday — the comparison baseline. */
export const USAGE_PREV = [
  0.21, 0.16, 0.15, 0.13, 0.14, 0.22, 0.4, 0.71, 0.55, 0.36, 0.3, 0.33, 0.4, 0.36, 0.31, 0.34, 0.46, 0.74,
  0.91, 0.86, 0.68, 0.52, 0.36, 0.27,
];

/** Hours the meter flags as the expensive window. */
export const PEAK_WINDOW = { from: 18, to: 21, label: "18:00 – 21:00" };

/** Fixed tariff used to turn kWh into money (p/kWh). */
export const TARIFF_PENCE = 27.4;

export const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;

/* ------------------------------------------------------------- automations */

export interface Automation {
  id: string;
  name: string;
  detail: string;
  on: boolean;
}

export const AUTOMATIONS: Automation[] = [
  { id: "evening", name: "Evening lights", detail: "Hallway + living lights on at 17:30, off at 23:00", on: true },
  { id: "away", name: "Away eco", detail: "Everything off and heating to 16 °C when nobody is home", on: true },
  { id: "night", name: "Night setback", detail: "Bedroom setpoint drops 2 °C between 22:00 and 06:30", on: false },
  { id: "leak", name: "Leak alert", detail: "Notify the phone when any sensor reports water", on: true },
];

/* --------------------------------------------------------------- helpers */

/** Instantaneous draw in watts, honouring the power state. */
export const wattsNow = (d: Device) => (d.on ? d.watts : d.standby);

/** kWh used today, honouring the power state (off = idle draw). */
export const kwhToday = (d: Device) => (d.on ? d.kwh24 : d.idle);

/** kWh used yesterday — the baseline the energy view compares against. */
export const kwhPrev = (d: Device) => (d.on ? d.kwh24y : d.idle);

/** "+12%" / "−8%" — always signed, never a bare number. */
export const signedPct = (delta: number) =>
  `${delta >= 0 ? "+" : "−"}${Math.abs(Math.round(delta))}%`;

export const devicesInRoom = (room: RoomId) => DEVICES.filter((d) => d.room === room);
