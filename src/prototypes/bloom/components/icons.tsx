/* icons — shared inline SVG glyphs for Bloom (no emojis anywhere).
   All icons inherit `currentColor` and default to 20px. */

interface IconProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function LeafIcon({ size = 20, strokeWidth = 2, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4.5-9 16-9 0 10-4.5 14.5-9 15" />
      <path d="M4.5 21C6 15 10 10.5 15.5 8" />
    </svg>
  );
}

export function DropIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.2c3.4 4 6.4 7.4 6.4 11a6.4 6.4 0 0 1-12.8 0c0-3.6 3-7 6.4-11z" />
      <path d="M9 14.2a3 3 0 0 0 2.2 3.1" opacity=".6" />
    </svg>
  );
}

export function DropFilledIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 3.2c3.4 4 6.4 7.4 6.4 11a6.4 6.4 0 0 1-12.8 0c0-3.6 3-7 6.4-11z" />
    </svg>
  );
}

export function SunIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7" />
    </svg>
  );
}

export function ThermIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3a2.2 2.2 0 0 0-2.2 2.2v8.1a4.6 4.6 0 1 0 4.4 0V5.2A2.2 2.2 0 0 0 12 3z" />
      <path d="M12 9.5v6" />
    </svg>
  );
}

export function ClockIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function CheckIcon({ size = 20, strokeWidth = 2.6 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m4.8 12.6 4.8 4.8L19.4 7" />
    </svg>
  );
}

export function CloseIcon({ size = 20, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function PlusIcon({ size = 20, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 20, strokeWidth = 2.2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9.5 6 5.5 6-5.5" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9.2 5.5 6.5 6.5-6.5 6.5" />
    </svg>
  );
}

export function BellIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 1.6 6.4 2 6.4H4c.4 0 2-1.4 2-6.4z" />
      <path d="M10 19a2.2 2.2 0 0 0 4 0" />
    </svg>
  );
}

export function FlameLeafIcon({ size = 28 }: IconProps) {
  /* streak flame — a flame silhouette with a leaf vein inside */
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2.5c.8 3-1.2 4.4-2.8 6C7.4 10.3 6 12 6 14.2A6 6 0 0 0 18 14.2c0-3.4-2.4-5.6-3.6-8-.5 1.4-1.3 2.2-2.2 2.9.4-2.2.2-4.4-.2-6.6z"
        fill="currentColor"
      />
      <path d="M12 18.6c-1.6-1.6-2-3.6-1.2-5.6" stroke="var(--color-surface-3)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BookIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" opacity=".7" />
    </svg>
  );
}

export function PawIcon({ size = 20 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="7.6" cy="8.4" rx="2.1" ry="2.7" transform="rotate(-18 7.6 8.4)" />
      <ellipse cx="16.4" cy="8.4" rx="2.1" ry="2.7" transform="rotate(18 16.4 8.4)" />
      <ellipse cx="4" cy="13.2" rx="1.8" ry="2.2" transform="rotate(-24 4 13.2)" />
      <ellipse cx="20" cy="13.2" rx="1.8" ry="2.2" transform="rotate(24 20 13.2)" />
      <path d="M12 11.6c3.4 0 6.6 2.7 6.6 5.7 0 2.2-1.8 3.4-3.7 2.9-1-.3-1.9-.7-2.9-.7s-1.9.4-2.9.7c-1.9.5-3.7-.7-3.7-2.9 0-3 3.2-5.7 6.6-5.7z" />
    </svg>
  );
}

export function InfoIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 11v5.2M12 7.8v.2" />
    </svg>
  );
}

export function UserIcon({ size = 20, strokeWidth = 2 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
    </svg>
  );
}

export function MinusIcon({ size = 18, strokeWidth = 2.4 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}
