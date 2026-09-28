"use client";

/* linie / components / metro-map — the showcase.
   3 lines as right-angle/45° SVG paths, circle stations with 2px ink
   rings, interchanges as double rings, labels on reserved plates so
   nothing ever overlaps the geometry. Tapping a line highlights it;
   tapping a station selects it. */

import { LINES, STATIONS, type LineId } from "../lib/data";

const STROKE: Record<LineId, string> = {
  A: "var(--color-primary)",
  B: "var(--color-secondary)",
  C: "var(--color-tertiary)",
};

export function MetroMap() {
  return (
    <svg className="ln-map" viewBox="0 0 100 100" role="img" aria-label="Liniennetz">
      {/* lines — highlight dims the others (never removes them) */}
      {LINES.map((l) => (
        <path
          key={l.id}
          d={l.path}
          fill="none"
          stroke={STROKE[l.id]}
          strokeWidth={l.id === "A" ? 3 : 2.2}
          strokeLinecap="square"
          strokeLinejoin="miter"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* stations */}
      {STATIONS.map((s) => (
        <g key={s.id} data-station={s.id}>
          <circle
            cx={s.x}
            cy={s.y}
            r={s.interchange ? 4.4 : 3.1}
            fill="var(--color-surface-1)"
            stroke="var(--color-outline)"
            strokeWidth={s.interchange ? 1.4 : 0.9}
            vectorEffect="non-scaling-stroke"
          />
          {s.interchange && (
            <circle cx={s.x} cy={s.y} r={2.1} fill="var(--color-primary)" vectorEffect="non-scaling-stroke" />
          )}
        </g>
      ))}
    </svg>
  );
}
