"use client";

/* pulse / components/icons — inline SVG icon set (Carbon-style: square
   caps, 2px stroke, currentColor). No emoji anywhere in the prototype. */

interface IconProps {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "square" as const,
});

/* Grid squares — Overview tab */
export function GridIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="3" width="8" height="8" />
      <rect x="13" y="3" width="8" height="8" />
      <rect x="3" y="13" width="8" height="8" />
      <rect x="13" y="13" width="8" height="8" />
    </svg>
  );
}

/* Warning triangle — Incidents tab */
export function AlertIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3 22 20H2z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" strokeWidth={2.6} />
    </svg>
  );
}

/* Pulse line — Metrics tab */
export function PulseIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M2 12h5l2-7 4 14 2-7h7" />
    </svg>
  );
}

/* Settings — Sliders — Settings tab */
export function SlidersIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <rect x="8.5" y="3.5" width="5" height="5" fill="currentColor" stroke="none" />
      <rect x="14.5" y="9.5" width="5" height="5" fill="currentColor" stroke="none" />
      <rect x="5.5" y="15.5" width="5" height="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChevronIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.2}>
      <path d="m4 12 6 6L20 6" />
    </svg>
  );
}

export function RefreshIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <path d="M20 11a8 8 0 1 0-2 6" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

export function BellIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function CloseIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

/* Minus / plus for the stepper */
export function MinusIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2}>
      <path d="M4 12h16" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

/* Time clock — footer stamp */
export function ClockIcon({ size = 14 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

/* Search */
export function SearchIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={1.8}>
      <rect x="4" y="4" width="11" height="11" />
      <path d="m15 15 5 5" />
    </svg>
  );
}
