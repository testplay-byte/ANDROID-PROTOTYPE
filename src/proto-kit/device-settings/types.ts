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

export interface DeviceSettings {
  cutout: CutoutType;
  position: CutoutPosition;
  pillSize: PillSize;
  punchSize: PunchSize;
}

export const DEVICE_SETTINGS_KEY = "proto-kit-device-settings-v1";

export const DEFAULT_DEVICE_SETTINGS: DeviceSettings = {
  cutout: "punch",
  position: "center",
  pillSize: "compact",
  punchSize: "normal",
};
