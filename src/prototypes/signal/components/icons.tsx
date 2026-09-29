/**
 * signal / components / icons — 18px stroke icons for desktop chrome.
 *
 * Console is an instrument language, so the icons are squared and technical:
 * 18px grid, 1.6 stroke, no emoji, no external assets. Same rule as every
 * other prototype in the repo.
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

/* ---- navigation ---- */

export function GaugeIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 18a8.5 8.5 0 1 1 17 0" />
      <path d="M12 18l4.2-5" />
      <circle cx="12" cy="18" r="1.2" />
    </svg>
  );
}

export function FunnelIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 4.5h17l-6.5 7.5v7l-4 2v-9L3.5 4.5Z" />
    </svg>
  );
}

export function GridIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
      <path d="M3.5 9.5h17M9.5 9.5v11" />
    </svg>
  );
}

export function TableIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="4" width="17" height="16" rx="2" />
      <path d="M3.5 9h17M9 9v11M14.5 9v11" />
    </svg>
  );
}

export function SlidersIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h9M17.5 7h2.5M4 17h4.5M13 17h7" />
      <rect x="14.5" y="5" width="2.5" height="4" rx="0.6" />
      <rect x="10" y="15" width="2.5" height="4" rx="0.6" />
    </svg>
  );
}

/* ---- chrome ---- */

export function SearchIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m15.8 15.8 4 4" />
    </svg>
  );
}

export function CloseIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
    </svg>
  );
}

export function BellIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 3.5 1.4 4.8 1.4 4.8H5.1S6.5 13.5 6.5 10Z" />
      <path d="M10 18.4a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function DownloadIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </svg>
  );
}

export function FilterIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

export function CheckIcon({ size = 16, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function KeyboardIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="2.5" y="6" width="19" height="12" rx="2" />
      <path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M6 13.5h.01M9.5 13.5h.01M13 13.5h.01M16.5 13.5h.01M8 16.5h8" />
    </svg>
  );
}

export function MotionIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 12h4l2.5-6 4 12 2.5-6h5" />
    </svg>
  );
}

export function DensityIcon({ size = 18, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 6h16M4 11h16M4 16h16M4 20h16" />
    </svg>
  );
}

export function PulseIcon({ size = 14, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M2.5 12h4l2-5 3 10 2.5-6 1.8 3h6.2" />
    </svg>
  );
}

export function AlertIcon({ size = 14, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 4.5 21 20H3L12 4.5Z" />
      <path d="M12 10v4.2M12 17h.01" />
    </svg>
  );
}
