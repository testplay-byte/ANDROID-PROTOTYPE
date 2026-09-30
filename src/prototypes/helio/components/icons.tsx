/**
 * helio / components / icons — 18-20px stroke icons, no emoji, no bitmaps.
 */

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

const base = (size: number, w: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const GridIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </svg>
);

export const ChartIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </svg>
);

export const SiteIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M12 21s7-5.2 7-10.4A7 7 0 0 0 5 10.6C5 15.8 12 21 12 21Z" />
    <circle cx="12" cy="10.4" r="2.6" />
  </svg>
);

export const SignalIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M3 12h3l2-5 3 10 2.5-7 1.8 4H21" />
  </svg>
);

export const BoltIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
  </svg>
);

export const SearchIcon = ({ size = 18, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const BellIcon = ({ size = 18, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z" />
    <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const SunIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </svg>
);

export const BatteryIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <rect x="2.5" y="8" width="16" height="8" rx="2.5" />
    <path d="M21 11v2" />
  </svg>
);

export const GaugeIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M4 17a8.5 8.5 0 1 1 16 0" />
    <path d="M12 17l4-5" />
  </svg>
);

export const LeafIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M5 19C4 12 8 5 19 5c0 11-6 14-13 14Z" />
    <path d="M9 15c1.6-2.6 3.6-4.4 6-5.6" />
  </svg>
);

export const LayersIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
);

export const FlagIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M5 21V4M5 5h11l-1.5 3.5L16 12H5" />
  </svg>
);

export const ClockIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const RadarIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
  </svg>
);

export const MoonIcon = ({ size = 20, strokeWidth = 1.7 }: IconProps) => (
  <svg {...base(size, strokeWidth)}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
);
