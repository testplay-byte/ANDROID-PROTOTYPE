/**
 * aurora / components / icons — the inline SVG set for the Aurora desktop
 * window.
 *
 * Same rule as every other prototype: no emoji, no external assets, no icon
 * font. Desktop chrome is denser than phone chrome, so the default size here
 * is 18–20px rather than 22–24px. Every glyph is `currentColor`, so colour
 * comes from the token layer (and from `data-tone` on the condition chips).
 */

import type { ReactElement } from "react";
import type { ConditionId } from "../data";

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

/* ---- navigation (sidebar + top bar) -------------------------------------- */

export function NowIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="10" r="3.6" />
      <path d="M12 2.6v2M12 15.4v2M4.6 10h-2M21.4 10h-2M6.8 4.8 5.4 3.4M18.6 16.6l-1.4-1.4M17.2 4.8l1.4-1.4M5.4 16.6l1.4-1.4" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

export function DetailsIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 18.5a9 9 0 0 1 17 0" />
      <path d="M3.5 18.5h17" />
      <path d="M12 18.5 16.4 10" />
      <circle cx="12" cy="18.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CitiesIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 21s6.5-6.1 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 14.9 12 21 12 21Z" />
      <circle cx="12" cy="10.4" r="2.4" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </svg>
  );
}

export function AmbienceIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9 18.2V6.4l8.5-2v11" />
      <circle cx="6.6" cy="18.4" r="2.6" />
      <circle cx="15.1" cy="15.6" r="2.6" />
    </svg>
  );
}

/* ---- chrome actions ------------------------------------------------------ */

export function SearchIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function PlusIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function RemoveIcon({ size = 15, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M5 7h14M10 7V5.5h4V7M6.5 7l.8 12h9.4l.8-12" />
      <path d="M10.5 10.5v5M13.5 10.5v5" />
    </svg>
  );
}

export function ContrastIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 0 0 17Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function RefreshIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" />
      <path d="M20 4.5V10h-5.5" />
    </svg>
  );
}

export function LayersIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5 3 8l9 4.5L21 8l-9-4.5Z" />
      <path d="m3 13 9 4.5L21 13" />
    </svg>
  );
}

/* ---- conditions ---------------------------------------------------------- */

function ClearIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5 7.2 7.2M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
    </svg>
  );
}

export function PartlyIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M8 4.4v2M2.8 9h2M4.2 5.6l1.4 1.4" />
      <path d="M17.6 21H9.4a4.4 4.4 0 0 1-.6-8.7 5.6 5.6 0 0 1 10.7 1.4 3.7 3.7 0 0 1-1.9 7.3Z" />
    </svg>
  );
}

export function CloudyIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M17.6 19H9.4a4.4 4.4 0 0 1-.6-8.7 5.6 5.6 0 0 1 10.7 1.4 3.7 3.7 0 0 1-1.9 7.3Z" />
      <path d="M6.6 19a3.4 3.4 0 0 1-.5-6.7" opacity=".75" />
    </svg>
  );
}

export function FogIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M17.2 13.4H9a4 4 0 0 1-.5-8 5.2 5.2 0 0 1 9.9 1.2 3.4 3.4 0 0 1-1.2 6.8Z" />
      <path d="M4 16.6h16M6.5 19.6h11M9 22.2h6" />
    </svg>
  );
}

export function RainIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M17.2 14.6H9a4 4 0 0 1-.5-8 5.2 5.2 0 0 1 9.9 1.2 3.4 3.4 0 0 1-1.2 6.8Z" />
      <path d="M8.6 17.4 7.4 20M12.4 17.4 11.2 20M16.2 17.4 15 20" />
    </svg>
  );
}

export function StormIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M17.2 13.6H9a4 4 0 0 1-.5-8 5.2 5.2 0 0 1 9.9 1.2 3.4 3.4 0 0 1-1.2 6.8Z" />
      <path d="m13.2 15.6-3.4 4h2.6l-1.2 3.4" />
    </svg>
  );
}

export function SnowIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M17.2 13.6H9a4 4 0 0 1-.5-8 5.2 5.2 0 0 1 9.9 1.2 3.4 3.4 0 0 1-1.2 6.8Z" />
      <path d="M8.6 17v4M6.9 18l3.4 2M10.3 18l-3.4 2M15.6 17v4M13.9 18l3.4 2M17.3 18l-3.4 2" />
    </svg>
  );
}

export function WindIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 8.6h9.2a2.7 2.7 0 1 0-2.7-2.7" />
      <path d="M3.5 15.4h12a2.9 2.9 0 1 1-2.9 2.9" />
      <path d="M3.5 12h16" />
    </svg>
  );
}

const CONDITION_ICON: Record<ConditionId, (p: IconProps) => ReactElement> = {
  clear: ClearIcon,
  partly: PartlyIcon,
  cloudy: CloudyIcon,
  fog: FogIcon,
  rain: RainIcon,
  storm: StormIcon,
  snow: SnowIcon,
  wind: WindIcon,
};

/** The glyph for a condition id — one lookup, no branching in screens. */
export function ConditionIcon({ id, size = 20, strokeWidth = 1.7 }: IconProps & { id: ConditionId }) {
  const Glyph = CONDITION_ICON[id] ?? CloudyIcon;
  return <Glyph size={size} strokeWidth={strokeWidth} />;
}

export function SunIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return <ClearIcon size={size} strokeWidth={strokeWidth} />;
}

export function MoonIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 14.4A8.4 8.4 0 0 1 9.6 4 8.5 8.5 0 1 0 20 14.4Z" />
    </svg>
  );
}

export function DropletIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.2 6.9 9.4a6.4 6.4 0 1 0 10.2 0Z" />
    </svg>
  );
}

export function LeafIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 4.5c-8 0-13.5 2.6-13.5 9A5.5 5.5 0 0 0 12 19c6.4 0 8-5.4 8-14.5Z" />
      <path d="M4.5 20.5C7 16 11 12.5 16 10.5" />
    </svg>
  );
}

export function CompassIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.6" />
      <path d="m15 9-1.8 5.2L8 16l1.8-5.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GaugeIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 17.5a8.5 8.5 0 1 1 16 0" />
      <path d="M12 17.5 15.6 11" />
      <circle cx="12" cy="17.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function EyeIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M2.6 12S6 5.8 12 5.8 21.4 12 21.4 12 18 18.2 12 18.2 2.6 12 2.6 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function SparkIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.4 13.8 9 19.4 10.8 13.8 12.6 12 18.2l-1.8-5.6L4.6 10.8 10.2 9 12 3.4Z" />
    </svg>
  );
}
