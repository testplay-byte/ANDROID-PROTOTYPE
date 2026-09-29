/**
 * facet / components / icons — 20px stroke icons for desktop chrome.
 * No emoji, no external assets — the same rule as every other prototype.
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

/** Sidebar: board — a bento grid of mixed tiles. */
export function BoardIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="3" width="8" height="11" rx="2" />
      <rect x="13" y="3" width="8" height="5" rx="2" />
      <rect x="3" y="16" width="8" height="5" rx="2" />
      <rect x="13" y="10" width="8" height="11" rx="2" />
    </svg>
  );
}

export function CalendarIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="17" rx="3" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14h2M14 14h2M8 17.5h2" />
    </svg>
  );
}

export function NoteIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h4" />
    </svg>
  );
}

export function SlidersIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2.2" />
      <circle cx="10" cy="17" r="2.2" />
    </svg>
  );
}

export function SearchIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function PlusIcon({ size = 18, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ size = 18, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function CloseIcon({ size = 16, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function LeftIcon({ size = 16, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M14.5 5 8 12l6.5 7" />
    </svg>
  );
}

export function RightIcon({ size = 16, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9.5 5 16 12l-6.5 7" />
    </svg>
  );
}

/** The tile span cycle control — a square with a resize corner. */
export function ResizeIcon({ size = 14, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 4h6v6H4zM11.5 11.5 20 20M20 15.5V20h-4.5" />
    </svg>
  );
}

export function EyeOffIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.3A8.6 8.6 0 0 1 12 6.2c5 0 9 4.6 9 5.8 0 .6-.9 2-2.4 3.3" />
      <path d="M6.4 7.9C4.2 9.2 3 11 3 12c0 1.2 4 5.8 9 5.8 1 0 2-.2 2.9-.6" />
    </svg>
  );
}

export function EyeIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 12s4-5.8 9-5.8S21 12 21 12s-4 5.8-9 5.8S3 12 3 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

export function RestoreIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 5v5h5" />
      <path d="M4.6 10a7.5 7.5 0 1 1 1.6 6.4" />
    </svg>
  );
}

export function SunIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </svg>
  );
}

export function CloudIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M7 18.5h10.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.5 1.6A3.7 3.7 0 0 0 7 18.5Z" />
    </svg>
  );
}

export function RainIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M7 15.5h10.5a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.5 1.6A3.7 3.7 0 0 0 7 15.5Z" />
      <path d="M9 18.5l-1 2.5M13 18.5l-1 2.5M17 18.5l-1 2.5" />
    </svg>
  );
}

export function PartIcon({ size = 20, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="9" cy="9" r="3.4" />
      <path d="M10 18h7.5a3 3 0 0 0 .3-6 4.6 4.6 0 0 0-8.6 1.2A3.1 3.1 0 0 0 10 18Z" />
    </svg>
  );
}

export function InboxIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3 13.5 5.8 5.4A2 2 0 0 1 7.7 4h8.6a2 2 0 0 1 1.9 1.4L21 13.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      <path d="M3 13.5h5l1 2.5h6l1-2.5h5" />
    </svg>
  );
}

export function RingIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5A8.5 8.5 0 0 1 12 20.5" strokeWidth="3" />
    </svg>
  );
}

export function PinIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9 3.5h6l-.8 5.2 3.3 3.1H6.5l3.3-3.1Z" />
      <path d="M12 11.8V20.5" />
    </svg>
  );
}
