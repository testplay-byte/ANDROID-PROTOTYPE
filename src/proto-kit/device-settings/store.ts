"use client";

/**
 * proto-kit / device-settings / store — tiny observable store for the
 * configurable device chrome (cutout type / position / pill size).
 *
 * Why not React context? The StatusBar lives inside every prototype page
 * (via DeviceFrame), while the Settings page lives on the dashboard route —
 * they are separate pages, never mounted together. A module-level store +
 * localStorage + a `storage`-style custom event keeps them in sync within a
 * tab, and the native `storage` event syncs across tabs.
 *
 * The chosen values are applied to every `.device` element as data
 * attributes (`data-cutout`, `data-cutout-pos`, `data-pill-size`) by
 * <StatusBar>, so all styling lives in CSS (device-frame.module.css) and
 * prototypes never need to touch this API.
 */

import { useEffect, useState } from "react";
import {
  CUSTOM_SIZE_BOUNDS,
  DEFAULT_DEVICE_SETTINGS,
  DEVICE_SETTINGS_KEY,
  type CutoutPosition,
  type CutoutType,
  type DeviceSettings,
  type PhoneSizePreset,
} from "./types";

export type { DeviceSettings };
export { DEVICE_SETTINGS_KEY, DEFAULT_DEVICE_SETTINGS, CUSTOM_SIZE_BOUNDS };
export {
  PHONE_SIZE_PRESETS,
  resolveDeviceSize,
  type PhoneSizePreset,
} from "./types";

const CHANGE_EVENT = "proto-kit-device-settings";

function clampInt(v: unknown, min: number, max: number): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function sanitize(raw: unknown): DeviceSettings {
  const d = DEFAULT_DEVICE_SETTINGS;
  if (!raw || typeof raw !== "object") return { ...d };
  const s = raw as Partial<DeviceSettings>;
  const position: CutoutPosition = s.position === "left" ? "left" : d.position;
  let cutout: CutoutType =
    s.cutout === "pill" || s.cutout === "notch" ? s.cutout : d.cutout;
  // notch is a center-only chrome (a left notch would collide with the clock)
  if (position === "left" && cutout === "notch") cutout = "punch";
  const size: DeviceSettings["size"] =
    s.size === "compact" || s.size === "large" || s.size === "custom" ? s.size : d.size;
  return {
    cutout,
    position,
    pillSize: s.pillSize === "wide" ? "wide" : d.pillSize,
    punchSize: s.punchSize === "large" ? "large" : d.punchSize,
    size,
    customW: clampInt(s.customW, CUSTOM_SIZE_BOUNDS.minW, CUSTOM_SIZE_BOUNDS.maxW),
    customH: clampInt(s.customH, CUSTOM_SIZE_BOUNDS.minH, CUSTOM_SIZE_BOUNDS.maxH),
  };
}

export function loadDeviceSettings(): DeviceSettings {
  try {
    return sanitize(JSON.parse(localStorage.getItem(DEVICE_SETTINGS_KEY) ?? "null"));
  } catch {
    return { ...DEFAULT_DEVICE_SETTINGS };
  }
}

export function saveDeviceSettings(next: Partial<DeviceSettings>): DeviceSettings {
  const merged = sanitize({ ...loadDeviceSettings(), ...next });
  try {
    localStorage.setItem(DEVICE_SETTINGS_KEY, JSON.stringify(merged));
  } catch {
    /* best-effort */
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: merged }));
  return merged;
}

/** Subscribe to changes (same-tab custom event + cross-tab `storage`). */
function subscribe(cb: (s: DeviceSettings) => void): () => void {
  const onCustom = (e: Event) => cb((e as CustomEvent<DeviceSettings>).detail);
  const onStorage = (e: StorageEvent) => {
    if (e.key === DEVICE_SETTINGS_KEY) cb(loadDeviceSettings());
  };
  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

/** Reactive hook — returns the current settings. */
export function useDeviceSettings(): DeviceSettings {
  const [settings, setSettings] = useState<DeviceSettings>(DEFAULT_DEVICE_SETTINGS);
  useEffect(() => {
    setSettings(loadDeviceSettings());
    return subscribe(setSettings);
  }, []);
  return settings;
}
