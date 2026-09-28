"use client";

/* linie / components / icons — inline geometric SVG set
   (bauhaus: square caps, no strokes thinner than the ink). */

interface Props {
  size?: number;
  className?: string;
}

export function TrainIcon({ size = 22, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="5" y="3" width="14" height="15" fill="currentColor" />
      <rect x="8" y="6" width="8" height="5" fill="var(--color-surface-1)" />
      <circle cx="9" cy="21" r="1.8" fill="currentColor" />
      <circle cx="15" cy="21" r="1.8" fill="currentColor" />
    </svg>
  );
}

export function RouteIcon({ size = 22, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 19 V11 H12 V5 H19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" fill="none" />
      <circle cx="5" cy="19" r="2.4" fill="currentColor" />
      <circle cx="19" cy="5" r="2.4" fill="currentColor" />
    </svg>
  );
}

export function ClockIcon({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" fill="none" />
      <path d="M12 7 V12 L15.5 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" fill="none" />
    </svg>
  );
}

export function TicketIcon({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="7" width="18" height="10" fill="currentColor" />
      <path d="M12 7 V17" stroke="var(--color-surface-1)" strokeWidth="1.6" strokeDasharray="2 2" />
    </svg>
  );
}

export function CheckIcon({ size = 18, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 13 L10 18 L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" fill="none" />
    </svg>
  );
}

export function CloseIcon({ size = 18, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" />
    </svg>
  );
}

export function DotIcon({ size = 14, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" />
    </svg>
  );
}

export function SwapIcon({ size = 20, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 4 V18 M4 8 L7 4 L10 8" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="square" />
      <path d="M17 20 V6 M14 16 L17 20 L20 16" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="square" />
    </svg>
  );
}
