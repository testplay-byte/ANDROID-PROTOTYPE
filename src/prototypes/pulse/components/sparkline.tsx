"use client";

/* pulse / components/sparkline — inline SVG response-time sparkline.
   Pure function of the data array: same points → same path, no drift. */

import type { ServiceState } from "../lib/data";

const STROKE: Record<ServiceState, string> = {
  operational: "var(--color-tertiary)",
  degraded: "var(--color-warn)",
  down: "var(--color-error)",
};

export function Sparkline({
  points,
  status,
  width = 72,
  height = 22,
}: {
  points: number[];
  status: ServiceState;
  width?: number;
  height?: number;
}) {
  const n = points.length;
  const path = points
    .map((p, i) => {
      const x = (i / (n - 1)) * width;
      const y = height - 2 - (p / 100) * (height - 4);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${width} ${height} L0 ${height} Z`;
  return (
    <svg
      className="plu-spark"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path d={area} fill={STROKE[status]} opacity="0.12" stroke="none" />
      <path
        d={path}
        fill="none"
        stroke={STROKE[status]}
        strokeWidth="1.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}
