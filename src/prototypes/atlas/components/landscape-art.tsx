"use client";

/* atlas / components / landscape-art — generative destination art.
   Pure layered CSS/SVG painted from the destination's colour tokens:
   gradient sky → sun disc + horizon glow → two procedural mountain
   ridges whose silhouettes are derived from a hash of the city name,
   so every destination gets a unique but stable skyline. Zero bitmaps,
   zero emoji. Fills its absolutely-positioned parent (.at-artbox). */

import { useMemo } from "react";
import type { Destination } from "../lib/data";

/* tiny deterministic string hash → ridge shape seed */
function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/* Build a jagged ridge polyline across a 100x40 viewBox.
   `peaks` tall far ridge vs short near ridge keeps depth. */
function ridgePath(seed: number, salt: number, base: number, amp: number): string {
  let s = (seed ^ salt) >>> 0;
  const rnd = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const steps = 7;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const wobble = (i % 2 === 0 ? 1 : -1) * (0.35 + rnd() * 0.65);
    const y = base - Math.abs(wobble) * amp - rnd() * amp * 0.35;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,40 L${pts.join(" L")} L100,40 Z`;
}

export function LandscapeArt({ d }: { d: Destination }) {
  const seed = useMemo(() => seedOf(d.id + d.city), [d.id, d.city]);
  const far = useMemo(() => ridgePath(seed, 0x9e37, 30, 16), [seed]);
  const near = useMemo(() => ridgePath(seed, 0x3039, 36, 9), [seed]);
  /* sun position drifts per city so the composition never repeats */
  const sunX = 24 + (seed % 46); // 24..69 (%)
  const sunY = 30 + ((seed >> 4) % 16); // 30..45 (%)

  return (
    <div className="at-art" aria-hidden="true">
      <div
        className="at-art-sky"
        style={{
          background: `linear-gradient(180deg, ${d.sky[0]} 0%, ${d.sky[1]} 52%, ${d.sky[2]} 86%)`,
        }}
      />
      <div
        className="at-art-sun"
        style={{
          left: `${sunX}%`,
          top: `${sunY}%`,
          background: d.sun,
          boxShadow: `0 0 42px 14px ${d.glow}, 0 0 120px 40px ${d.glow}`,
        }}
      />
      <div className="at-art-haze" style={{ background: `linear-gradient(180deg, transparent 45%, ${d.glow})` }} />
      <svg className="at-art-ridge at-art-far" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d={far} fill={d.ridge[0]} />
      </svg>
      <svg className="at-art-ridge at-art-near" viewBox="0 0 100 40" preserveAspectRatio="none">
        <path d={near} fill={d.ridge[1]} />
      </svg>
    </div>
  );
}
