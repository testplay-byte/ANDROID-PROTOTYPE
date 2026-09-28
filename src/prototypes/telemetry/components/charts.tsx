/**
 * telemetry / components / charts — pure inline-SVG charts.
 *
 * Deterministic geometry: the same data array always produces the same
 * polyline/bars, so re-scaling on a range change is the only transition.
 * Carbon charts are flat — no gradients, no curves, square joins, hairline
 * gridlines in `--color-outline-variant` and the peak drawn in IBM blue.
 */

import type { RangeDef, ServiceState } from "../data";

const W = 560;
const H = 150;
const PAD_L = 38;
const PAD_R = 8;
const PAD_T = 10;
const PAD_B = 22;
const IW = W - PAD_L - PAD_R;
const IH = H - PAD_T - PAD_B;

function gridRows(): number[] {
  return [0, 1, 2, 3].map((i) => PAD_T + (IH / 3) * i);
}

function xAt(i: number, n: number): number {
  return PAD_L + (i / (n - 1)) * IW;
}

/* ------------------------------ line chart ------------------------------ */

export function LineChart({
  points,
  hi,
  unit,
  range,
  name,
}: {
  points: number[];
  hi: number;
  unit: "%" | "ms";
  range: RangeDef;
  name: string;
}) {
  const max = Math.max(hi, ...points) * 1.04;
  const n = points.length;
  const ys = points.map((p) => PAD_T + IH - (p / max) * IH);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i, n).toFixed(1)} ${ys[i].toFixed(1)}`)
    .join(" ");
  const area = `${path} L${xAt(n - 1, n).toFixed(1)} ${PAD_T + IH} L${PAD_L} ${PAD_T + IH} Z`;
  const peak = Math.max(...points);
  const peakIdx = points.indexOf(peak);
  return (
    <svg
      className="tel-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${name} line chart, peak ${Math.round(peak)}${unit === "ms" ? " ms" : " %"}`}
    >
      {gridRows().map((y, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--color-outline-variant)" strokeWidth="1" />
          <text x={PAD_L - 6} y={y + 3} className="tel-axis" textAnchor="end">
            {Math.round(hi * (1 - i / 3))}
          </text>
        </g>
      ))}
      <path d={area} fill="var(--color-primary)" opacity="0.1" stroke="none" />
      <path d={path} fill="none" stroke="var(--color-text)" strokeWidth="1.6" />
      {/* the peak is the one point that gets IBM blue */}
      <rect
        x={xAt(peakIdx, n) - 3}
        y={ys[peakIdx] - 3}
        width="6"
        height="6"
        fill="var(--color-primary)"
      />
      <line
        x1={xAt(peakIdx, n)}
        y1={ys[peakIdx] + 4}
        x2={xAt(peakIdx, n)}
        y2={PAD_T + IH}
        stroke="var(--color-primary)"
        strokeWidth="1"
        opacity="0.45"
      />
      <text
        x={Math.min(W - PAD_R, Math.max(PAD_L, xAt(peakIdx, n)))}
        y={Math.max(PAD_T + 8, ys[peakIdx] - 7)}
        className="tel-axis"
        textAnchor={peakIdx > n - 4 ? "end" : peakIdx < 3 ? "start" : "middle"}
        fill="var(--color-primary)"
      >
        peak {Math.round(peak)}
      </text>
      <line x1={PAD_L} y1={PAD_T + IH} x2={W - PAD_R} y2={PAD_T + IH} stroke="var(--color-outline)" strokeWidth="1" />
      {range.labels.map((l, i) => (
        <text
          key={l}
          x={PAD_L + IW * (i / (range.labels.length - 1))}
          y={H - 6}
          className="tel-axis"
          textAnchor={i === 0 ? "start" : i === range.labels.length - 1 ? "end" : "middle"}
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------ bar chart ------------------------------- */

export function BarChart({
  points,
  hi,
  unit,
  range,
  name,
}: {
  points: number[];
  hi: number;
  unit: "%" | "ms";
  range: RangeDef;
  name: string;
}) {
  const max = Math.max(hi, ...points) * 1.04;
  const n = points.length;
  const slot = IW / n;
  const barW = Math.max(3, slot * 0.6);
  const peak = Math.max(...points);
  return (
    <svg
      className="tel-chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${name} bar chart, peak ${Math.round(peak)}${unit === "ms" ? " ms" : " %"}`}
    >
      {gridRows().map((y, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--color-outline-variant)" strokeWidth="1" />
          <text x={PAD_L - 6} y={y + 3} className="tel-axis" textAnchor="end">
            {Math.round(hi * (1 - i / 3))}
          </text>
        </g>
      ))}
      {points.map((p, i) => {
        const h = (p / max) * IH;
        return (
          <rect
            key={i}
            x={PAD_L + slot * i + (slot - barW) / 2}
            y={PAD_T + IH - h}
            width={barW}
            height={h}
            fill={p === peak ? "var(--color-primary)" : "var(--color-text-muted)"}
            opacity={p === peak ? 1 : 0.5}
          />
        );
      })}
      <line x1={PAD_L} y1={PAD_T + IH} x2={W - PAD_R} y2={PAD_T + IH} stroke="var(--color-outline)" strokeWidth="1" />
      {range.labels.map((l, i) => (
        <text
          key={l}
          x={PAD_L + IW * (i / (range.labels.length - 1))}
          y={H - 6}
          className="tel-axis"
          textAnchor={i === 0 ? "start" : i === range.labels.length - 1 ? "end" : "middle"}
        >
          {l}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------ sparkline ------------------------------- */

const STROKE: Record<ServiceState, string> = {
  healthy: "var(--color-tertiary)",
  degraded: "var(--color-warn)",
  down: "var(--color-error)",
};

/** 20-point request-rate sparkline, coloured by the service state. */
export function Sparkline({
  points,
  state,
  width = 68,
  height = 18,
}: {
  points: number[];
  state: ServiceState;
  width?: number;
  height?: number;
}) {
  const n = points.length;
  const path = points
    .map((p, i) => `M${((i / (n - 1)) * width).toFixed(1)} ${(height - 1 - (p / 100) * (height - 2)).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" preserveAspectRatio="none">
      <path
        d={path}
        fill="none"
        stroke={STROKE[state]}
        strokeWidth="1.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/* --------------------------- 30-day uptime strip ------------------------ */

/**
 * 30 daily uptime columns, oldest → newest. Bars are DOM nodes rather than
 * SVG rects: at 1px they stay crisp, and the strip reflows with the grid.
 *   dip 0 = quiet green · 1 = noisy (still green, higher opacity)
 *   dip 2 = amber (degraded window) · 3 = red (down window)
 */
export function UptimeStrip({
  bars,
  state,
  label,
}: {
  bars: number[];
  state: ServiceState;
  label: string;
}) {
  const n = bars.length;
  return (
    <span className="tel-uptime" role="img" aria-label={label}>
      {bars.map((v, i) => {
        const fromEnd = n - 1 - i;
        let dip = 0;
        if (state === "down" && fromEnd < 2) dip = 3;
        else if (state === "degraded" && fromEnd < 3) dip = 2;
        else if (v < 99.5) dip = 1;
        const h = Math.max(3, Math.round((v / 100) * 16));
        return <i key={i} data-dip={dip || undefined} style={{ height: `${h}px` }} />;
      })}
    </span>
  );
}
