"use client";

/* ============================================================
   drift / components / cover-art.tsx — generative show covers.

   Layered gradient mesh (radial blobs from the show's palette)
   + a geometric waveform band + a motif emblem (sun / wave /
   spike / orbit / arc / ridge), all deterministic per show via
   the seeded PRNG in lib/data. Rendered as inline SVG so it
   scales from 56px nav thumbs to the 300px player art.
   ============================================================ */

import { useId } from "react";
import { mulberry32, waveformHeights, type Show } from "../lib/data";

interface CoverArtProps {
  show: Show;
  /** px — square output */
  size: number;
  /** hide the emblem on very small thumbs for legibility */
  minimal?: boolean;
  /** true when CSS stretches this art into a non-square box (hero) */
  cover?: boolean;
  className?: string;
}

export function CoverArt({ show, size, minimal = false, cover = false, className }: CoverArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [c0, c1, c2, c3] = show.palette;
  const bars = waveformHeights(`${show.id}-cover`, 13);
  const rnd = mulberry32(show.seed);
  const blobX = [18 + rnd() * 20, 62 + rnd() * 25, 30 + rnd() * 40];
  const blobY = [20 + rnd() * 18, 34 + rnd() * 26, 74 + rnd() * 16];
  const grad = `dcv-${uid}`;
  const clip = `dcc-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      preserveAspectRatio={cover ? "xMidYMid slice" : "xMidYMid meet"}
      className={className}
      role="img"
      aria-label={`${show.title} cover art`}
    >
      <defs>
        <radialGradient id={grad} cx="30%" cy="24%" r="95%">
          <stop offset="0%" stopColor={c0} />
          <stop offset="42%" stopColor={c1} />
          <stop offset="78%" stopColor={c2} />
          <stop offset="100%" stopColor={c3} />
        </radialGradient>
        <clipPath id={clip}>
          <rect width="100" height="100" rx={cover ? 0 : size >= 120 ? 22 : 14} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {/* mesh gradient base + soft color blobs */}
        <rect width="100" height="100" fill={`url(#${grad})`} />
        <circle cx={blobX[0]} cy={blobY[0]} r="34" fill={c0} opacity="0.5" />
        <circle cx={blobX[1]} cy={blobY[1]} r="30" fill={c2} opacity="0.45" />
        <circle cx={blobX[2]} cy={blobY[2]} r="38" fill={c3} opacity="0.55" />

        {/* geometric waveform band across the lower third */}
        <g opacity="0.9">
          {bars.map((h, i) => (
            <rect
              key={i}
              x={6 + i * 7}
              y={78 - h * 26}
              width="3.4"
              height={h * 26}
              rx="1.7"
              fill="#ffffff"
              opacity={0.16 + (i % 3) * 0.08}
            />
          ))}
        </g>

        {/* motif emblem */}
        {!minimal && <Motif show={show} accent="#ffffff" />}

        {/* top-left sheen — reads as glossy print varnish */}
        <path d="M0 0 L64 0 L0 52 Z" fill="#ffffff" opacity="0.08" />
      </g>
    </svg>
  );
}

function Motif({ show, accent }: { show: Show; accent: string }) {
  const common = { stroke: accent, fill: "none", strokeWidth: 2.6, strokeLinecap: "round" as const, opacity: 0.9 };
  switch (show.motif) {
    case "sun":
      return (
        <g {...common}>
          <circle cx="50" cy="38" r="13" fill={accent} stroke="none" opacity="0.9" />
          <path d="M22 60h56" opacity="0.6" />
          <path d="M30 67h40" opacity="0.4" />
        </g>
      );
    case "wave":
      return (
        <g {...common}>
          <path d="M14 36q9-9 18 0t18 0 18 0 18 0" />
          <path d="M14 48q9-9 18 0t18 0 18 0 18 0" opacity="0.65" />
          <path d="M14 60q9-9 18 0t18 0 18 0 18 0" opacity="0.4" />
        </g>
      );
    case "spike":
      return (
        <g {...common}>
          <path d="M16 44h10l6-16 8 30 7-20 6 6h14" />
        </g>
      );
    case "orbit":
      return (
        <g {...common}>
          <circle cx="50" cy="40" r="7" fill={accent} stroke="none" />
          <ellipse cx="50" cy="40" rx="24" ry="10" transform="rotate(-18 50 40)" opacity="0.75" />
          <ellipse cx="50" cy="40" rx="24" ry="10" transform="rotate(34 50 40)" opacity="0.4" />
        </g>
      );
    case "arc":
      return (
        <g {...common}>
          <path d="M14 62a36 36 0 0 1 72 0" />
          <path d="M26 62a24 24 0 0 1 48 0" opacity="0.6" />
          <circle cx="50" cy="30" r="4" fill={accent} stroke="none" />
        </g>
      );
    case "ridge":
      return (
        <g {...common}>
          <path d="M10 62 30 36l14 16 12-22 24 32z" fill={accent} stroke="none" opacity="0.85" />
          <path d="M44 30h.01" strokeWidth="5" />
        </g>
      );
  }
}
