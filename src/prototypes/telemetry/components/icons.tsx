/**
 * telemetry / components / icons — 16-20px stroke icon set for desktop chrome.
 *
 * Desktop chrome is denser than phone chrome, so these default to 16-18px and
 * draw with square caps (Carbon's signature corner). No emoji, no external
 * assets — same rule as every other prototype in the repo.
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

/* ---- navigation ---- */

/** Server stack — Fleet. */
export function FleetIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="6" />
      <rect x="3" y="14" width="18" height="6" />
      <path d="M7 7h.01M7 17h.01" strokeWidth={strokeWidth + 0.8} />
    </svg>
  );
}

/** Warning triangle — Incidents. */
export function AlertIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3 22 20H2z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" strokeWidth={strokeWidth + 1} />
    </svg>
  );
}

/** Trend line — Metrics. */
export function TrendIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 18l5.5-7 4 3.5L21 5" />
      <path d="M15.5 5H21v5.5" />
    </svg>
  );
}

/** Sliders — Settings. */
export function SlidersIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h6M14 7h6M4 17h10M18 17h2" />
      <rect x="11.5" y="4.5" width="4" height="5" fill="currentColor" stroke="none" />
      <rect x="15.5" y="14.5" width="4" height="5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ---- toolbar ---- */

export function SearchIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="4" y="4" width="11" height="11" />
      <path d="m15 15 5 5" />
    </svg>
  );
}

export function RefreshIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 11a8 8 0 1 0-2.5 6" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

export function BellIcon({ size = 17, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ChevronIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CheckIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m4 12 6 6L20 6" />
    </svg>
  );
}

export function CloseIcon({ size = 15, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

export function PlusIcon({ size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 4v16M4 12h16" />
    </svg>
  );
}

export function MinusIcon({ size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 12h16" />
    </svg>
  );
}

export function ClockIcon({ size = 14, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

/** Crosshair — a service / probe. */
export function TargetIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

/** Terminal / runbook — command palette hint. */
export function TerminalIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="4.5" width="18" height="15" />
      <path d="m7 10 3 2.5L7 15M12.5 15H17" />
    </svg>
  );
}
