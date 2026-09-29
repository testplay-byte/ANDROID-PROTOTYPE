/**
 * stockyard / components / icons — 18px stroke icons for desktop chrome.
 * Phone prototypes use 22-24px; desktop chrome is denser, so the set sits
 * at 18-20px and the sidebar scales it down. No emoji, no bitmaps.
 */

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

/** Inventory — a stacked pallet. */
export function CrateIcon({ size = 20, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="6" />
      <rect x="3" y="14" width="18" height="6" />
      <path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01" />
    </svg>
  );
}

/** Orders — a despatch truck. */
export function TruckIcon({ size = 20, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M2 6h11v10H2z" />
      <path d="M13 9h4l4 3.5V16h-8" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

/** Movement — ledger lines with a moving delta. */
export function FlowIcon({ size = 20, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 7h11M3 12h7M3 17h11" />
      <path d="M15 15l4 3 4-6" />
    </svg>
  );
}

/** Settings — sliders. */
export function SlidersIcon({ size = 20, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2.2" />
      <circle cx="9" cy="17" r="2.2" />
    </svg>
  );
}

export function SearchIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </svg>
  );
}

export function PlusIcon({ size = 15, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function BellIcon({ size = 17, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
      <path d="M10 18a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function CheckIcon({ size = 14, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 12.5 9.5 18 20 6.5" />
    </svg>
  );
}

export function XIcon({ size = 15, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowIcon({ size = 14, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/** Low-stock warning — a hard triangle, not a soft badge. */
export function AlertIcon({ size = 15, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5 22 20H2L12 3.5Z" />
      <path d="M12 10v4.5M12 17h.01" />
    </svg>
  );
}

/** Bin / location. */
export function BinIcon({ size = 15, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h16v13H4z" />
      <path d="M2.5 7 5 3.5h14L21.5 7M9.5 12h5" />
    </svg>
  );
}

export function RefreshIcon({ size = 14, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 11a8 8 0 1 0-.8 5" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

export function ExportIcon({ size = 14, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
      <path d="M4 17v3h16v-3" />
    </svg>
  );
}
