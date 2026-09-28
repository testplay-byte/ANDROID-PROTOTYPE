"use client";

/* ruckus / icons — inline SVG only (no emoji anywhere in this app).
   All icons are square-joined 2px strokes: the brutalist cut-paper look. */

interface IconProps {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
});

/** Bottom nav: gigs = lightning bolt (the energy). */
export function BoltIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M13 2 5 13h5l-2 9 8-11h-5z" />
    </svg>
  );
}

/** Bottom nav: bands = a speaker cabinet with a cone. */
export function SpeakerIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="5" y="3" width="14" height="18" />
      <circle cx="12" cy="14" r="3.5" />
      <path d="M9 7h6" />
    </svg>
  );
}

/** Bottom nav: venues = warehouse/venue front. */
export function VenueIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M3 21V9l9-6 9 6v12" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

/** Bottom nav: me = a person cut from cardstock. */
export function PersonIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="8.5" y="3.5" width="7" height="7" />
      <path d="M4 21v-3a8 8 0 0 1 16 0v3" />
    </svg>
  );
}

/** Ticket stub glyph (wallet + CTA). */
export function TicketIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M3 8v3a2 2 0 0 0 0 4v3h18v-3a2 2 0 0 0 0-4V8z" />
      <path d="M14 8v3M14 13v3" />
    </svg>
  );
}

/** Back arrow — square chevron. */
export function BackIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M15 4 7 12l8 8" />
    </svg>
  );
}

/** Clock (doors time). */
export function ClockIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="4" y="4" width="16" height="16" />
      <path d="M12 7v5h4" />
    </svg>
  );
}

/** Map pin (venue/area rows). */
export function PinIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 10 12 3l7 7-7 11z" />
      <path d="M10 10h4" />
    </svg>
  );
}

/** Users (follower counts). */
export function CrowdIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="4" y="5" width="7" height="7" />
      <path d="M2 20v-2a5 5 0 0 1 10 0v2" />
      <path d="M15 4h5v7h-5M16 20v-2a4 4 0 0 1 6-3" />
    </svg>
  );
}

/** Bell (alert switches section). */
export function BellIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M6 16V9a6 6 0 0 1 12 0v7l2 3H4z" />
      <path d="M10 22h4" />
    </svg>
  );
}

/** Check — used on done states in toasts/buttons. */
export function CheckIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 12l6 6L20 6" />
    </svg>
  );
}

/** X — toast/dismiss, sold-out strikes. */
export function XIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 5l14 14M19 5 5 19" />
    </svg>
  );
}
