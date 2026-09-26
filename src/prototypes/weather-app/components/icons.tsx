/**
 * weather-app / components / icons — inline SVG icon set.
 * stroke="currentColor", 24 viewBox. No emoji, no icon fonts.
 */

interface IconProps {
  size?: number;
}

function base(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

/* ---- Weather condition icons ---- */

export function SunIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function MoonIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function CloudIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.36 2.2A4 4 0 0 0 6 19z" />
    </svg>
  );
}

export function CloudSunIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 2v2M6.3 4.3l1.4 1.4M4 10h2M20.4 8.6a4 4 0 0 0-6.5-1.7" />
      <path d="M17.5 19a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-11.2 1.3" />
      <path d="M4.6 13.2A4 4 0 0 0 6 19h11.5" />
    </svg>
  );
}

export function RainIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M17.5 15a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.36 2.2A4 4 0 0 0 6 15z" />
      <path d="M8 19v1M12 18v2M16 19v1" />
    </svg>
  );
}

export function StormIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M17.5 14a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.36 2.2A4 4 0 0 0 6 14z" />
      <path d="M13 12l-3 5h4l-3 5" />
    </svg>
  );
}

export function SnowIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M17.5 15a4.5 4.5 0 0 0 .42-8.98 7 7 0 0 0-13.36 2.2A4 4 0 0 0 6 15z" />
      <path d="M8 19h.01M12 21h.01M16 19h.01" strokeWidth="2.5" />
    </svg>
  );
}

/** Condition → icon component map. */
export function ConditionIcon({
  condition,
  size = 22,
}: {
  condition: "clear" | "partly" | "cloudy" | "rain" | "storm" | "snow";
  size?: number;
}) {
  switch (condition) {
    case "clear":
      return <SunIcon size={size} />;
    case "partly":
      return <CloudSunIcon size={size} />;
    case "cloudy":
      return <CloudIcon size={size} />;
    case "rain":
      return <RainIcon size={size} />;
    case "storm":
      return <StormIcon size={size} />;
    case "snow":
      return <SnowIcon size={size} />;
  }
}

/* ---- Metric + UI icons ---- */

export function DropletIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 2.7S6 9.2 6 13.8a6 6 0 0 0 12 0C18 9.2 12 2.7 12 2.7z" />
    </svg>
  );
}

export function WindIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
      <path d="M17.5 8a2.5 2.5 0 1 1 2 4H2" />
    </svg>
  );
}

export function UvIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      <path d="M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

export function GaugeIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M4 14a8 8 0 1 1 16 0" />
      <path d="M12 14l3.5-3.5" />
      <path d="M4 14h2M18 14h2M12 6v2" />
    </svg>
  );
}

export function ThermometerIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M14 14.76V5a2 2 0 0 0-4 0v9.76a4 4 0 1 0 4 0z" />
    </svg>
  );
}

export function MapPinIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function SearchIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function PlusIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CheckIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CalendarIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function SettingsIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 22 }: IconProps) {
  return (
    <svg {...base(size)}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
