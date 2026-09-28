/**
 * quill / components / icons — 20px stroke icons sized for desktop chrome.
 * Same rule as every other prototype: inline SVG only, no emoji, no external
 * assets, `currentColor` so the HIG token layer decides the ink.
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

/** Library — stacked notes. */
export function LibraryIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="4" y="4" width="12" height="14" rx="2" />
      <path d="M8 4.5V3.6A1.6 1.6 0 0 1 9.6 2h8.8A1.6 1.6 0 0 1 20 3.6v12.8a1.6 1.6 0 0 1-1.6 1.6H16" />
      <path d="M7.5 8.5h5M7.5 12h5" />
    </svg>
  );
}

/** Note — a single page. */
export function NoteIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 3.5h7.5L18 8v12.5H6z" />
      <path d="M13.5 3.5V8H18" />
      <path d="M9 12h6M9 15.5h4" />
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

export function SlidersIcon({ size = 20, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h8M16 7h4M4 17h4M12 17h8" />
      <circle cx="14" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

export function PlusIcon({ size = 18, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ size = 18, strokeWidth = 2 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function ArrowLeftIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function TagIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 11.6V4.8a1.3 1.3 0 0 1 1.3-1.3h6.8a1.3 1.3 0 0 1 .9.4l7.2 7.2a1.3 1.3 0 0 1 0 1.8l-6.8 6.8a1.3 1.3 0 0 1-1.8 0L4 12.5a1.3 1.3 0 0 1-.5-.9Z" />
      <circle cx="8" cy="8" r="1.4" />
    </svg>
  );
}

export function ChecklistIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M10 6.5h9M10 12h9M10 17.5h9" />
      <path d="m3 6.2 1.6 1.6L7.6 4.8M3 16.7 4.6 18.3 7.6 15.3" />
    </svg>
  );
}

export function CodeIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5l-3 14" />
    </svg>
  );
}

export function QuoteIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9.5 6.5C7 7.6 5.5 9.8 5.5 12.4c0 2.5 1.5 4.1 3.6 4.1 1.8 0 3.1-1.3 3.1-3 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.4 1.2-2.6 2.6-3.4ZM18.5 6.5c-2.5 1.1-4 3.3-4 5.9 0 2.5 1.5 4.1 3.6 4.1 1.8 0 3.1-1.3 3.1-3 0-1.7-1.2-2.9-2.8-2.9-.3 0-.6 0-.8.1.3-1.4 1.2-2.6 2.6-3.4Z" />
    </svg>
  );
}

export function ClockIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function PinIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M9 3.5h6l-.8 5.2 3.3 3.1H6.5l3.3-3.1z" />
      <path d="M12 11.8V20.5" />
    </svg>
  );
}

export function FolderIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h3.2l2 2.4h7.8a2 2 0 0 1 2 2v8.1a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function MoonIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
    </svg>
  );
}

export function SunIcon({ size = 18, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
    </svg>
  );
}

export function KeyboardIcon({ size = 18, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6 9.5h.01M9.5 9.5h.01M13 9.5h.01M16.5 9.5h.01M6 12.8h.01M18 12.8h.01M9.5 15.4h5" />
    </svg>
  );
}

export function SparkIcon({ size = 16, strokeWidth = 1.7 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9z" />
    </svg>
  );
}

export function XIcon({ size = 16, strokeWidth = 1.9 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function InfoIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowUpDownIcon({ size = 16, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M8 4.5v15M8 4.5 4.5 8M8 4.5 11.5 8M16 19.5v-15M16 19.5 12.5 16M16 19.5 19.5 16" />
    </svg>
  );
}
