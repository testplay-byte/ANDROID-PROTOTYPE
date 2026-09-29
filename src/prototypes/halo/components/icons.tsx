/**
 * halo / components / icons — 20px stroke icons sized for desktop chrome.
 *
 * No emoji, no external assets, same rule as every other prototype. The set
 * is deliberately sparse: one glyph per device kind, one per view, and the
 * handful of controls the desktop shell needs.
 */

import type { ReactElement } from "react";
import type { DeviceKind } from "../data";

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/* ------------------------------------------------------------ view icons */

export function HomeIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5H9v5H5a1 1 0 0 1-1-1Z" />
    </svg>
  );
}

export function RoomsIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="8" height="7" rx="1.5" />
      <rect x="13" y="4" width="8" height="7" rx="1.5" />
      <rect x="3" y="13" width="8" height="7" rx="1.5" />
      <rect x="13" y="13" width="8" height="7" rx="1.5" />
    </svg>
  );
}

export function BoltIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12Z" />
    </svg>
  );
}

export function SlidersIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

export function SearchIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function BellIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
      <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function CloseIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon({ size = 18, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function MoonIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function LeafIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 20c0-8 5-13 16-13 0 11-5 15-12 15a4 4 0 0 1-4-2Z" />
      <path d="M9 15c2-2 4.5-3.5 7-4.5" />
    </svg>
  );
}

export function PlusIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function TrendIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 17l5.5-6 4 3.5L21 6" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

/* --------------------------------------------------------- device glyphs */

export function BulbIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9.5 17.5a6 6 0 1 1 5 0" />
      <path d="M9.5 17.5h5M10 20.5h4" />
    </svg>
  );
}

export function ThermostatIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M10 14.5V5.5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0Z" />
      <path d="M12 9v6" />
    </svg>
  );
}

export function SpeakerIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <circle cx="12" cy="14.5" r="3" />
      <circle cx="12" cy="7" r="1.2" />
    </svg>
  );
}

export function CameraIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2L8 5h8l1.5 2h2A1.5 1.5 0 0 1 21 8.5v8A1.5 1.5 0 0 1 19.5 18h-15A1.5 1.5 0 0 1 3 16.5Z" />
      <circle cx="12" cy="12.5" r="3" />
    </svg>
  );
}

export function LockIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function PlugIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9 3v5M15 3v5" />
      <path d="M6.5 8h11v3a5.5 5.5 0 0 1-11 0Z" />
      <path d="M12 16.5V21" />
    </svg>
  );
}

export function SensorIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="2" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.8 5.8a8.8 8.8 0 0 0 0 12.4M18.2 5.8a8.8 8.8 0 0 1 0 12.4" />
    </svg>
  );
}

export function PurifierIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="6" y="3" width="12" height="18" rx="3" />
      <path d="M9.5 8h5M9.5 11.5h5" />
      <circle cx="12" cy="16.5" r="1.6" />
    </svg>
  );
}

export function BlindIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="11" rx="1.5" />
      <path d="M3 8.3h18M3 12.6h18M12 4v11M12 15v5" />
    </svg>
  );
}

/** One glyph per device kind — the home grid and the drawer share it. */
const KIND_GLYPH: Record<DeviceKind, (p: IconProps) => ReactElement> = {
  light: BulbIcon,
  climate: ThermostatIcon,
  media: SpeakerIcon,
  camera: CameraIcon,
  lock: LockIcon,
  plug: PlugIcon,
  sensor: SensorIcon,
  purifier: PurifierIcon,
  blind: BlindIcon,
};

export function DeviceIcon({ kind, size = 20 }: { kind: DeviceKind; size?: number }) {
  const Glyph = KIND_GLYPH[kind];
  return <Glyph size={size} />;
}
