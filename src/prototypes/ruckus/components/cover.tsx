"use client";

/* ruckus / components / cover — generative geometric "album art".
   Solid blocks + one circle motif chosen by the band's `motif` index;
   brutalism forbids gradients, so every fill is a flat token color. */

import type { Band, CoverTone } from "../lib/data";

const TONE_BG: Record<CoverTone, string> = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  tertiary: "var(--color-tertiary)",
  surface: "var(--color-surface-2)",
};

export function Cover({ band, size = 96 }: { band: Band; size?: number }) {
  const bg = TONE_BG[band.tone];
  const ink = band.tone === "surface" ? "var(--color-text)" : "var(--color-primary-fg)";
  const m = band.motif;
  return (
    <span
      className="rk-cover"
      style={{ width: size, height: size, background: bg, color: ink }}
      aria-hidden="true"
    >
      {/* bar stack — rotated blocky 'equalizer' */}
      <span className="rk-cover__bars" data-m={m}>
        <i style={{ height: "34%" }} />
        <i style={{ height: "68%" }} />
        <i style={{ height: "46%" }} />
        <i style={{ height: "86%" }} />
        <i style={{ height: "56%" }} />
      </span>
      {/* single circle motif — bottom-left on 0/2, top-right on 1/3 */}
      <span className="rk-cover__dot" data-m={m} />
    </span>
  );
}
