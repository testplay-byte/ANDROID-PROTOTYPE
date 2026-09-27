"use client";

/* ============================================================
   drift / components / icons.tsx — inline SVG icon set.
   All stroke icons use currentColor; filled glyphs (play) inherit
   too. No emoji anywhere in this prototype.
   ============================================================ */

interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

export function HeadphonesIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4" height="6" rx="2" />
      <rect x="17" y="14" width="4" height="6" rx="2" />
    </svg>
  );
}

export function CompassIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.2 8.8-2 5.2-5.2 2 2-5.2z" />
    </svg>
  );
}

export function WaveIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M3 12h.01M6.5 8.5v7M10 5.5v13M13.5 8.5v7M17 6.5v11M20.5 10v4" />
    </svg>
  );
}

export function StackIcon({ size = 22, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3.5 12.5 8.5 4.7 8.5-4.7" />
      <path d="m3.5 16.7 8.5 4.7 8.5-4.7" />
    </svg>
  );
}

export function PlayIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8.2 5.6a1.2 1.2 0 0 1 1.83-1.02l8.2 5.4a1.2 1.2 0 0 1 0 2.04l-8.2 5.4a1.2 1.2 0 0 1-1.83-1.02z" transform="translate(0 -0.4)" />
    </svg>
  );
}

export function PauseIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="6.5" y="5" width="4" height="14" rx="1.6" />
      <rect x="13.5" y="5" width="4" height="14" rx="1.6" />
    </svg>
  );
}

export function PrevTrackIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M5 6.4a1 1 0 0 1 2 0v4.4l7.3-4.6a1 1 0 0 1 1.53.85v9.5a1 1 0 0 1-1.53.85L7 12.8v4.4a1 1 0 1 1-2 0z" />
      <rect x="17.5" y="5.5" width="2.2" height="13" rx="1.1" />
    </svg>
  );
}

export function NextTrackIcon({ size = 22, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19 6.4a1 1 0 0 0-2 0v4.4L9.7 6.2a1 1 0 0 0-1.53.85v9.5A1 1 0 0 0 9.7 17.4L17 12.8v4.4a1 1 0 1 0 2 0z" />
      <rect x="4.3" y="5.5" width="2.2" height="13" rx="1.1" />
    </svg>
  );
}

export function Back15Icon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 8.5A8.5 8.5 0 1 1 3.6 13" />
      <path d="M4.2 4.2v4.6h4.6" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7.4" fontWeight="700" fill="currentColor" stroke="none">
        15
      </text>
    </svg>
  );
}

export function Fwd30Icon({ size = 26, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M19.5 8.5A8.5 8.5 0 1 0 20.4 13" />
      <path d="M19.8 4.2v4.6h-4.6" />
      <text x="12" y="15.4" textAnchor="middle" fontSize="7.4" fontWeight="700" fill="currentColor" stroke="none">
        30
      </text>
    </svg>
  );
}

export function DownloadIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M12 3.5v10m0 0 3.8-3.8M12 13.5 8.2 9.7" />
      <path d="M4.5 16.5v2a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function DownloadDoneIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 12.5 9 17 19.5 6.5" />
    </svg>
  );
}

export function TrashIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
      <path d="M6.8 6.5 7.6 19a2 2 0 0 0 2 1.9h4.8a2 2 0 0 0 2-1.9l.8-12.5" />
    </svg>
  );
}

export function HeartIcon({ size = 20, className, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} fill={filled ? "currentColor" : "none"} className={className}>
      <path d="M12 20s-7.4-4.6-9.2-9A5 5 0 0 1 12 6.8 5 5 0 0 1 21.2 11c-1.8 4.4-9.2 9-9.2 9z" />
    </svg>
  );
}

export function MoonIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" />
    </svg>
  );
}

export function SearchIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

export function MicIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <rect x="9" y="3.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
    </svg>
  );
}

export function ClockIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function InfoIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8.2v.1" />
    </svg>
  );
}
