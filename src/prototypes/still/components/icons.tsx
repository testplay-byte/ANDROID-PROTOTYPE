"use client";

/* still / components / icons — the prototype's inline SVG icon set.
   All stroke-based, currentColor, sized via prop. No emoji anywhere. */

interface IconProps {
  size?: number;
}

function svgProps(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

/** Today — a quiet sunrise mark. */
export function SunIcon({ size = 22 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M4 18h16" />
      <path d="M12 5v2.5" />
      <path d="M5.6 8.6 7.3 10.3" />
      <path d="M18.4 8.6 16.7 10.3" />
      <path d="M2 21h20" opacity="0.35" />
      <path d="M8 18a4 4 0 0 1 8 0" />
    </svg>
  );
}

/** Breathe — concentric breath rings. */
export function BreathIcon({ size = 22 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 6.2a5.8 5.8 0 0 1 5.8 5.8" />
      <path d="M12 17.8A5.8 5.8 0 0 1 6.2 12" />
      <path d="M12 2.8a9.2 9.2 0 0 1 9.2 9.2" opacity="0.4" />
      <path d="M12 21.2A9.2 9.2 0 0 1 2.8 12" opacity="0.4" />
    </svg>
  );
}

/** Sessions — stacked program rows. */
export function LibraryIcon({ size = 22 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
      <circle cx="18" cy="18" r="2" opacity="0.5" />
    </svg>
  );
}

/** Profile. */
export function UserIcon({ size = 22 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 19.4a7.2 7.2 0 0 1 14.4 0" />
    </svg>
  );
}

export function PlayIcon({ size = 22 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M8.4 6.6v10.8L17.4 12z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PauseIcon({ size = 22 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <rect x="7.4" y="6.4" width="3" height="11.2" rx="1.2" fill="currentColor" stroke="none" />
      <rect x="13.6" y="6.4" width="3" height="11.2" rx="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CheckIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M5 12.5l4.4 4.4L19 7" />
    </svg>
  );
}

export function PlusIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

export function MinusIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M5.5 12h13" />
    </svg>
  );
}

export function BellIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M6.4 16.2V10.6a5.6 5.6 0 0 1 11.2 0v5.6l1.4 2H5l1.4-2z" />
      <path d="M10.2 20.6a2 2 0 0 0 3.6 0" />
    </svg>
  );
}

/** Soundscape — rain. */
export function RainIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M7 10.6a3.6 3.6 0 0 1 .6-7.1 4.6 4.6 0 0 1 8.8 1.2 3 3 0 0 1 .4 5.9" opacity="0.55" />
      <path d="M8.4 14.2l-1.2 3.4" />
      <path d="M12.4 13.8l-1.2 3.4" />
      <path d="M16.4 14.2l-1.2 3.4" />
    </svg>
  );
}

/** Soundscape — singing bowl. */
export function BowlIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M5 11h14a7 7 0 0 1-14 0z" />
      <path d="M12 4v3.2" opacity="0.55" />
      <path d="M9 5.4l.9 2.1M15 5.4l-.9 2.1" opacity="0.55" />
    </svg>
  );
}

/** Soundscape — soft noise (waves). */
export function WavesIcon({ size = 20 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M3.5 8.5c2-2 4-2 6 0s4 2 6 0 2.5-1.4 5-1.4" opacity="0.55" />
      <path d="M3.5 12.5c2-2 4-2 6 0s4 2 6 0 2.5-1.4 5-1.4" />
      <path d="M3.5 16.5c2-2 4-2 6 0s4 2 6 0 2.5-1.4 5-1.4" opacity="0.55" />
    </svg>
  );
}

/** Neutral info dot. */
export function InfoIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.9" r="0.4" fill="currentColor" />
    </svg>
  );
}

/** Leaf — the intention card's quiet mark. */
export function LeafIcon({ size = 18 }: IconProps) {
  return (
    <svg {...svgProps(size)}>
      <path d="M5.6 18.4C4.5 12 8.6 6 18.4 5.2c.8 9.4-4.9 13.7-12.8 13.2" />
      <path d="M5.6 18.4C8.4 14 12 11.4 16 9.8" opacity="0.55" />
    </svg>
  );
}
