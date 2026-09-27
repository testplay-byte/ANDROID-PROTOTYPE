"use client";

/* simmer / components/icons — inline SVG icon set (stroke=currentColor).
   No emoji anywhere in this prototype. */

interface IconProps {
  size?: number;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

/* nav: pot / search / calendar / kitchen shelf */
export function PotIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 9h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M2.5 11h-1M23.5 11h-1" />
      <path d="M9 6c0-1.5 1-2 1.5-3M14 6c0-1.5 1-2 1.5-3" />
    </svg>
  );
}

export function SearchIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </svg>
  );
}

export function CalIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="4" y="5.5" width="16" height="15" rx="3.5" />
      <path d="M4 10.5h16M8.5 3.5V7M15.5 3.5V7" />
      <path d="M9 15h3.5" />
    </svg>
  );
}

export function ShelfIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M5 3.5v17M19 3.5v17" />
      <path d="M5 9.5h14M5 16h14" />
      <path d="M8 6.5v3M12.5 6.5v3M8.5 13v3M14 13v3" />
    </svg>
  );
}

/* bits */
export function ClockIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function FlameIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 3s4.5 3.6 4.5 8.2A4.5 4.5 0 0 1 12 15.7a4.5 4.5 0 0 1-4.5-4.5C7.5 6.6 12 3 12 3Z" />
      <path d="M12 21c-3 0-5-1.8-5-4 0-1.6 1.4-2.6 2.3-3.7.4 1.6 1.5 2.2 2.7 2.2 1.6 0 3-1 3-2.7 1.3 1.3 2 2.6 2 4.2 0 2.2-2 4-5 4Z" />
    </svg>
  );
}

export function HeartIcon({ size = 18, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} fill={filled ? "currentColor" : "none"}>
      <path d="M12 20.3s-7.5-4.4-7.5-9.6A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.7c0 5.2-7.5 9.6-7.5 9.6Z" />
    </svg>
  );
}

export function CheckIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.6}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function BackIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.6}>
      <path d="M15 5.5 8.5 12l6.5 6.5" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function ChevronIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.4}>
      <path d="m8.5 5.5 7 6.5-7 6.5" />
    </svg>
  );
}

export function PlusIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.6}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} strokeWidth={2.6}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlayIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none">
      <path d="M8 5.6c0-1 1.1-1.6 2-1.1l8.4 5.4a1.9 1.9 0 0 1 0 3.2L10 18.5c-.9.6-2 0-2-1.1V5.6Z" />
    </svg>
  );
}

export function PauseIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} fill="currentColor" stroke="none">
      <rect x="6.5" y="5" width="3.6" height="14" rx="1.6" />
      <rect x="13.9" y="5" width="3.6" height="14" rx="1.6" />
    </svg>
  );
}

export function ResetIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4.5 9.5A8 8 0 1 1 4 13" />
      <path d="M4.5 4.5v5h5" />
    </svg>
  );
}

export function CartIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M3 4.5h2.5l2.2 10.5h9.6L20 8H7" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="16.5" cy="19" r="1.4" />
    </svg>
  );
}

export function SunIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7" />
    </svg>
  );
}

export function MoonIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
    </svg>
  );
}

export function InfoIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 7.8v.4" />
    </svg>
  );
}

export function ChefIcon({ size = 18 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M7 15.5V11a5 5 0 0 1 10 0v4.5" />
      <path d="M5.5 15.5h13M6 19h12" />
    </svg>
  );
}
