/**
 * thin / components / icons — hairline icons for a monochrome window.
 *
 * One rule for the whole set: 1.4px strokes on a 24px grid, round caps, no
 * fills, no colour. They sit next to 12px grey labels, so anything heavier
 * would shout. No emoji, no external assets.
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

/** Sidebar: today — a single line, like a ruled day. */
export function DayIcon({ size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 7h16M4 12h10M4 17h6" />
    </svg>
  );
}

/** Sidebar: projects — three stacked rows, a plain list. */
export function ProjectsIcon({ size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1" />
      <path d="M3.5 9h17M9 9v10.5" />
    </svg>
  );
}

/** Sidebar: inbox — a downward arrow into a tray. */
export function InboxIcon({ size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 3.5v10M8.5 10 12 13.5 15.5 10" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </svg>
  );
}

/** Sidebar: settings — a single pair of sliders, not a gear. */
export function SlidersIcon({ size = 18, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M4 8h9M17 8h3M4 16h4M12 16h8" />
      <circle cx="15" cy="8" r="2" />
      <circle cx="10" cy="16" r="2" />
    </svg>
  );
}

export function SearchIcon({ size = 16, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

/** The one accent mark in the whole app: a single hairline cross. */
export function PlusIcon({ size = 16, strokeWidth = 1.6 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M12 5.5v13M5.5 12h13" />
    </svg>
  );
}

/** Archive: a box with a lid. */
export function ArchiveIcon({ size = 16, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <rect x="3.5" y="4.5" width="17" height="4" rx="1" />
      <path d="M5 8.5v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-10M10 12.5h4" />
    </svg>
  );
}

/** Back affordance — only ever visible inside the tablet container query. */
export function BackIcon({ size = 16, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M14 5.5 8 12l6 6.5" />
    </svg>
  );
}

export function NoteIcon({ size = 16, strokeWidth = 1.4 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={strokeWidth}>
      <path d="M5 4.5h14v15H5z" />
      <path d="M8.5 9h7M8.5 12.5h7M8.5 16h4" />
    </svg>
  );
}
