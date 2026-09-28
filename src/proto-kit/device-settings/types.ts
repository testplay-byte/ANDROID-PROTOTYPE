/**
 * proto-kit / device-settings — types for the configurable device chrome.
 *
 * The dashboard Settings page lets the user configure the phone cutout that
 * every DeviceFrame's StatusBar renders:
 *
 *   cutout:    "punch"  — small centered punch-hole camera (Android default)
 *              "pill"   — iPhone Dynamic Island style rounded pill
 *              "notch"  — classic iPhone notch tab hanging from the top edge
 *                        (center only — unavailable when position = left)
 *   position:  "center" | "left" — where the cutout sits; the clock shifts to
 *              stay clear of it when the cutout is on the left.
 *   pillSize:  "compact" — narrower island (same height as wide)
 *              "wide"    — wider island (default pill)
 *              (left-positioned pills are automatically much smaller)
 *   punchSize: "normal"  — the default 13px dot
 *              "large"   — a slightly bigger 17px dot
 *
 * Persisted under DEVICE_SETTINGS_KEY in localStorage; applied to every
 * `.device` element as data-* attributes by <StatusBar> (see store.ts).
 */

export type CutoutType = "punch" | "pill" | "notch";
export type CutoutPosition = "center" | "left";
export type PillSize = "compact" | "wide";
export type PunchSize = "normal" | "large";
export type PhoneSizePreset = "compact" | "standard" | "large";

export interface DeviceSettings {
  cutout: CutoutType;
  position: CutoutPosition;
  pillSize: PillSize;
  punchSize: PunchSize;
  /** named phone size; "custom" means customW/customH drive the frame */
  size: PhoneSizePreset | "custom";
  /** custom frame size in CSS px — only used when size === "custom" */
  customW: number | null;
  customH: number | null;
}

/** Named phone sizes. The frame is `w × h` CSS px inside the stage. */
export const PHONE_SIZE_PRESETS: Record<
  Exclude<PhoneSizePreset, "custom"> | "custom",
  { label: string; w: number; h: number; hint: string }
> = {
  compact: { label: "Compact", w: 360, h: 740, hint: "small phone · 360×740" },
  standard: { label: "Standard", w: 390, h: 844, hint: "iPhone 14 / Pixel · 390×844" },
  large: { label: "Large", w: 430, h: 932, hint: "iPhone Pro Max · 430×932" },
  custom: { label: "Custom", w: 390, h: 844, hint: "your own width × height" },
};

/** Bounds for the custom frame — keeps every prototype renderable. */
export const CUSTOM_SIZE_BOUNDS = { minW: 320, maxW: 520, minH: 600, maxH: 1000 } as const;

export function resolveDeviceSize(
  s: Pick<DeviceSettings, "size" | "customW" | "customH">,
): { w: number; h: number; preset: PhoneSizePreset | "custom" } {
  if (s.size === "custom" && s.customW && s.customH) {
    return { w: s.customW, h: s.customH, preset: "custom" };
  }
  const preset = (s.size === "custom" ? "standard" : s.size) as Exclude<PhoneSizePreset, "custom">;
  return { ...PHONE_SIZE_PRESETS[preset], preset };
}

export const DEVICE_SETTINGS_KEY = "proto-kit-device-settings-v1";

export const DEFAULT_DEVICE_SETTINGS: DeviceSettings = {
  cutout: "punch",
  position: "center",
  pillSize: "compact",
  punchSize: "normal",
  size: "standard",
  customW: null,
  customH: null,
};
