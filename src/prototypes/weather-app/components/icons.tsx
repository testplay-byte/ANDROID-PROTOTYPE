"use client";

/* icons — UI stroke icons + glossy gradient weather glyphs
   (ported from the reference icons.js; fills reference the shared
   <GradientDefs/> block rendered once by the shell) */

const CLOUD_PATH =
  "M6.6 18.4h10.1a3.7 3.7 0 0 0 .3-7.39 5.05 5.05 0 0 0-9.62-1.2A3.65 3.65 0 0 0 6.6 18.4Z";
const MOON_PATH = "M20 14.4A8.6 8.6 0 0 1 9.6 4a8.6 8.6 0 1 0 10.4 10.4Z";

/** Shared SVG gradient defs — render once near the app root. */
export function GradientDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <linearGradient id="gSun" x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0" stopColor="#FFF3C4" />
          <stop offset=".5" stopColor="#FFD470" />
          <stop offset="1" stopColor="#FFA83D" />
        </linearGradient>
        <linearGradient id="gCloud" x1=".1" y1="0" x2=".5" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset=".55" stopColor="#E4EDFB" />
          <stop offset="1" stopColor="#B9C8E4" />
        </linearGradient>
        <linearGradient id="gCloudDim" x1=".1" y1="0" x2=".5" y2="1">
          <stop offset="0" stopColor="#DCE3EF" />
          <stop offset="1" stopColor="#98A4BE" />
        </linearGradient>
        <linearGradient id="gRain" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#BFE9FF" />
          <stop offset="1" stopColor="#4E9BFF" />
        </linearGradient>
        <linearGradient id="gRainV" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4E9BFF" />
          <stop offset="1" stopColor="#BFE9FF" />
        </linearGradient>
        <linearGradient id="gWindV" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#5a7de0" />
          <stop offset="1" stopColor="#c8e6ff" />
        </linearGradient>
        <linearGradient id="gBolt" x1="0" y1="0" x2=".3" y2="1">
          <stop offset="0" stopColor="#FFE9A0" />
          <stop offset="1" stopColor="#FF8F3C" />
        </linearGradient>
        <linearGradient id="gMoon" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0" stopColor="#FFFBE8" />
          <stop offset="1" stopColor="#CFC2F5" />
        </linearGradient>
        <linearGradient id="gFog" x1="0" y1="0" x2=".4" y2="1">
          <stop offset="0" stopColor="#EDF2FA" />
          <stop offset="1" stopColor="#A9B6CE" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* UI stroke icons — monochrome line work, inherits currentColor */
const UI: Record<string, React.ReactNode> = {
  pin: (
    <>
      <path d="M12 21.5s6.6-5.5 6.6-10.4A6.6 6.6 0 0 0 5.4 11c0 5 6.6 10.5 6.6 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10.9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M15.8 15.8 20.4 20.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20.4 4.2v4.4H16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  plus: <path d="M12 5.4v13.2M5.4 12h13.2" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />,
  x: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  trash: (
    <path
      d="M5.4 7.4h13.2M9.4 7.4V5.6h5.2v1.8M7.6 7.4l.8 11.2h7.2l.8-11.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: <path d="m5.6 12.4 4 4 8.8-9.2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  thermo: <path d="M13.8 13.6V5.4a1.8 1.8 0 0 0-3.6 0v8.2a3.6 3.6 0 1 0 3.6 0Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  drop: <path d="M12 3.6s5.4 5.6 5.4 9.4a5.4 5.4 0 1 1-10.8 0C6.6 9.2 12 3.6 12 3.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
  dropletSm: <path d="M12 3.6s5.4 5.6 5.4 9.4a5.4 5.4 0 1 1-10.8 0C6.6 9.2 12 3.6 12 3.6Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />,
  wind: <path d="M3.6 8.6h9.4a2.5 2.5 0 1 0-2.5-2.5M3.6 13h13a2.6 2.6 0 1 1-2.6 2.6M3.6 17.6h6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />,
  uv: (
    <>
      <circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" />
      </g>
    </>
  ),
  gauge: (
    <>
      <path d="M4.6 17.4a8.4 8.4 0 1 1 14.8 0" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="m12 13.8 3.6-3.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </>
  ),
  eye: (
    <>
      <path d="M2.6 12S6 6.4 12 6.4 21.4 12 21.4 12 18 17.6 12 17.6 2.6 12 2.6 12Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </>
  ),
  sunrise: <path d="M12 3.4v5.2M9.2 6.4 12 3.4l2.8 3M4 17.4h16M6.4 17.4a5.6 5.6 0 0 1 11.2 0M2.8 21h18.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  sunset: <path d="M12 3.4v5.2M9.2 8.6 12 11.6l2.8-3M4 17.4h16M6.4 17.4a5.6 5.6 0 0 1 11.2 0M2.8 21h18.4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.6V12l3.2 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.6 8 4.2-8 4.2-8-4.2 8-4.2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="m4 12.6 8 4.2 8-4.2M4 16.8l8 4.2 8-4.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </>
  ),
  alert: (
    <>
      <path d="M12 4.4 21 19.6H3L12 4.4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 10v4M12 16.8v.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  star: <path d="m12 3.8 2.6 5.3 5.8.85-4.2 4.1 1 5.8-5.2-2.75L6.8 19.85l1-5.8-4.2-4.1 5.8-.85L12 3.8Z" fill="currentColor" />,
  sparkle: <path d="M12 3.6 13.8 9l5.4 1.8-5.4 1.8L12 18l-1.8-5.4L4.8 10.8 10.2 9 12 3.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />,
};

export function UiIcon({ name, size = 18 }: { name: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ width: size, height: size, flex: "none" }}>
      {UI[name] ?? null}
    </svg>
  );
}

/* weather glyphs — engine condition code → glyph kind, day/night aware */
export function glyphFor(code: string, isDay: boolean): string {
  if (code === "clear") return isDay ? "sun" : "moon";
  if (code === "partly") return isDay ? "partly" : "partlyNight";
  return (
    ({ cloudy: "cloud", overcast: "overcast", drizzle: "drizzle", rain: "rain", storm: "storm", snow: "snow", fog: "fog" } as Record<string, string>)[code] ||
    "cloud"
  );
}

function WxGlyph({ kind }: { kind: string }) {
  switch (kind) {
    case "sun":
      return (
        <>
          <circle cx="12" cy="12" r="4.6" fill="url(#gSun)" />
          <g className="ic-rays" stroke="url(#gSun)" strokeWidth="1.9" strokeLinecap="round">
            <path d="M12 2.4v2.6M12 19v2.6M2.4 12h2.6M19 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9" />
          </g>
        </>
      );
    case "moon":
      return <path d={MOON_PATH} fill="url(#gMoon)" />;
    case "partly":
      return (
        <>
          <circle cx="8.8" cy="8.4" r="3.4" fill="url(#gSun)" />
          <g stroke="url(#gSun)" strokeWidth="1.6" strokeLinecap="round">
            <path d="M8.8 2.2v1.9M3 8.4h1.9M4.9 4.5l1.3 1.3M12.7 4.5l-1.3 1.3M3 12.6h1.9" />
          </g>
          <path d={CLOUD_PATH} fill="url(#gCloud)" />
        </>
      );
    case "partlyNight":
      return (
        <>
          <g transform="translate(1.4 -.4) scale(.72)">
            <path d={MOON_PATH} fill="url(#gMoon)" />
          </g>
          <path d={CLOUD_PATH} fill="url(#gCloud)" />
        </>
      );
    case "overcast":
      return (
        <>
          <path d="M9 15.2h8.2a3.2 3.2 0 0 0 .2-6.4 4.4 4.4 0 0 0-8.4-1A3.2 3.2 0 0 0 9 15.2Z" fill="url(#gCloudDim)" opacity=".85" />
          <path d={CLOUD_PATH} fill="url(#gCloud)" />
        </>
      );
    case "drizzle":
      return (
        <>
          <path d={CLOUD_PATH} fill="url(#gCloudDim)" />
          <g stroke="url(#gRain)" strokeWidth="1.7" strokeLinecap="round">
            <path className="wx-drop" d="M9 19.2v1.9M13 19.6v1.4M16.6 19.2v1.9" />
          </g>
        </>
      );
    case "rain":
      return (
        <>
          <path d={CLOUD_PATH} fill="url(#gCloudDim)" />
          <g stroke="url(#gRain)" strokeWidth="1.9" strokeLinecap="round">
            <path className="wx-drop" d="M8.2 19l-1 2.6M12 18.8l-1 3.4" />
            <path className="wx-drop" d="M16 19l-1 2.6" />
          </g>
        </>
      );
    case "storm":
      return (
        <>
          <path d={CLOUD_PATH} fill="url(#gCloudDim)" />
          <path className="wx-bolt" d="M13.3 17.2h-3l2-3.1h-2.6l3.8-4.5-.9 3.1h2.5l-3 4.5Z" fill="url(#gBolt)" />
        </>
      );
    case "snow":
      return (
        <>
          <path d={CLOUD_PATH} fill="url(#gCloud)" />
          <g className="wx-flake" stroke="#DCEBFF" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 19.6v2.4M7.8 20.3l2.4 1M7.8 21.3l2.4-1M15.4 19.6v2.4M14.2 20.3l2.4 1M14.2 21.3l2.4-1" />
          </g>
        </>
      );
    case "fog":
      return (
        <>
          <path d={CLOUD_PATH} fill="url(#gFog)" />
          <g stroke="#E8EFFA" strokeWidth="1.8" strokeLinecap="round" opacity=".9">
            <path d="M6.4 19.6h11M8 22.4h8" />
          </g>
        </>
      );
    case "cloud":
    default:
      return <path d={CLOUD_PATH} fill="url(#gCloud)" />;
  }
}

export function WxIcon({ code, isDay, size = 24 }: { code: string; isDay: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ width: size, height: size, overflow: "visible", display: "block" }}>
      <WxGlyph kind={glyphFor(code, isDay)} />
    </svg>
  );
}
