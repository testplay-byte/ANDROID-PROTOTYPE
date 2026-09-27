/* atlas / components / icons — inline SVG icon set (stroke = currentColor).
   No emoji, no icon fonts. 22px default, tuned per usage site. */

interface IconProps {
  size?: number;
  strokeWidth?: number;
}

const base = (size: number, strokeWidth: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/* ---- nav ---- */

export function CompassIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PinIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21z" />
      <circle cx="12" cy="10.6" r="2.4" />
    </svg>
  );
}

export function BagIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <rect x="4.5" y="7.5" width="15" height="12.5" rx="2.5" />
      <path d="M9 7.5V6a3 3 0 0 1 6 0v1.5" />
      <path d="M4.5 12.5h15" />
    </svg>
  );
}

export function UserIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

/* ---- trip data ---- */

export function PlaneIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M10.5 3.5 12 3l1.5.5 1 6.5 6 3.4v1.6l-6.4-1.4-1.3 4.2 2.2 1.6v1.2L12 20.9l-3 .4-2.2-1.4v-1.2l2.2-1.6-1.3-4.2L3.5 13v-1.6l6-3.4z" />
    </svg>
  );
}

export function BedIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M3.5 18.5v-11" />
      <path d="M3.5 12.5h17v6" />
      <path d="M20.5 12.5a3 3 0 0 0-3-3h-6.5v3" />
      <circle cx="7.5" cy="10.5" r="1.8" />
    </svg>
  );
}

export function WalletIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <rect x="3.5" y="6" width="17" height="13" rx="3" />
      <path d="M3.5 9.5h13a2.5 2.5 0 0 1 0 5h-13" />
      <circle cx="15.8" cy="12" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function CalendarIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M3.5 10h17" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function GlobeIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z" />
    </svg>
  );
}

export function StarIcon({ size = 22, strokeWidth = 2, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size, strokeWidth)} fill={filled ? "currentColor" : "none"}>
      <path d="m12 3.6 2.4 5 5.5.7-4 3.8 1 5.4-4.9-2.6-4.9 2.6 1-5.4-4-3.8 5.5-.7z" />
    </svg>
  );
}

/* ---- weather ---- */

export function SunIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function PartIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <circle cx="8.2" cy="7.6" r="2.8" />
      <path d="M8.2 2.6v1.4M3.2 7.6h1.4M4.7 4.1l1 1M11.7 4.1l-1 1" />
      <path d="M9 18.8h8a3.3 3.3 0 0 0 .6-6.5 4.6 4.6 0 0 0-8.9 1.2A2.7 2.7 0 0 0 9 18.8z" />
    </svg>
  );
}

export function CloudIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M7 18.5h10.5a3.5 3.5 0 0 0 .5-7 5 5 0 0 0-9.7 1.3A2.9 2.9 0 0 0 7 18.5z" />
    </svg>
  );
}

export function RainIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M7 14.5h10.5a3.4 3.4 0 0 0 .5-6.8 4.9 4.9 0 0 0-9.5 1.3A2.8 2.8 0 0 0 7 14.5z" />
      <path d="M8.5 18l-1 2.6M13 18l-1 2.6M17.5 18l-1 2.6" />
    </svg>
  );
}

/* ---- utility ---- */

export function CheckIcon({ size = 22, strokeWidth = 2.6 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 22, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="m14.5 5-7 7 7 7" />
    </svg>
  );
}

export function InfoIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="0.4" fill="currentColor" />
    </svg>
  );
}

export function BellIcon({ size = 22, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M6 9.5a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13.5 6 9.5z" />
      <path d="M10 18.5a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function PlusIcon({ size = 22, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ size = 22, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg {...base(size, strokeWidth)}>
      <path d="M5 12h14" />
    </svg>
  );
}
