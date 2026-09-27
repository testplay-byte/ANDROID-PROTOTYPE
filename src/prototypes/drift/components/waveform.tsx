"use client";

/* ============================================================
   drift / components / waveform.tsx — the animated audio bars.

   Deterministic heights per episode (seeded), CSS-keyframe
   pulse while playing. The `played` fraction tints the bars
   with the show accent; the rest stay milky white.
   ============================================================ */

import type { CSSProperties } from "react";
import { waveformHeights } from "../lib/data";

interface WaveformProps {
  /** seed string — usually the episode id */
  seed: string;
  bars: number;
  /** 0..1 — how much of the strip reads as "played" */
  played: number;
  playing: boolean;
  /** accent color for the played portion (show.palette-derived) */
  accent: string;
  height?: number;
  className?: string;
}

export function Waveform({ seed, bars, played, playing, accent, height = 34, className }: WaveformProps) {
  const hs = waveformHeights(seed, bars);
  return (
    <div
      className={`dr-wave${className ? ` ${className}` : ""}${playing ? " dr-wave--live" : ""}`}
      style={{ height }}
      aria-hidden="true"
    >
      {hs.map((h, i) => (
        <span
          key={i}
          className="dr-wave__bar"
          style={
            {
              "--h": h.toFixed(3),
              "--d": `${(i % 7) * 90}ms`,
              height: `${Math.round(h * 100)}%`,
              background: i / bars <= played ? accent : "var(--dr-wave-idle)",
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
