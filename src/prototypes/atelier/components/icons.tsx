/**
 * atelier / components / icons — 18–20px stroke icons sized for desktop
 * chrome (phone prototypes use 22–24px; desktop chrome is denser).
 * No emoji, no external assets — same rule as every other prototype.
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
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
});

/** Work — a circle, a square and a rule: the studio's own vocabulary. */
export function PlateIcon({ size = 20, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" />
      <circle cx="17" cy="7.25" r="3.75" />
      <path d="M3.5 13h17M3.5 17h17M3.5 21h17" />
    </svg>
  );
}

/** Board — four stacked columns, the primary triad plus ink. */
export function BoardIcon({ size = 20, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 4v16M9.5 4v16M15.5 4v16M21.5 4v16" />
      <path d="M3.5 4h18" />
      <rect x="1" y="8" width="5" height="6" />
      <rect x="7" y="12" width="5" height="8" />
      <rect x="13" y="7" width="5" height="5" />
    </svg>
  );
}

/** Studio — three makers on a rule. */
export function StudioIcon({ size = 20, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="7" cy="8" r="3.2" />
      <circle cx="17" cy="8" r="3.2" />
      <path d="M1.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5M11.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    </svg>
  );
}

/** Settings — a triangular arrangement of stops. */
export function StopsIcon({ size = 20, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5 21 19.5H3Z" />
      <path d="M12 9.5v5M12 17.2v.6" />
    </svg>
  );
}

export function SearchIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
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

export function ArrowIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function CloseIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon({ size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function StickyIcon({ size = 14, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4.5 4.5h15v7L14 17H4.5Z" />
      <path d="M14 17v2.5" />
    </svg>
  );
}
