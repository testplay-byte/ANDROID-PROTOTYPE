"use client";

/* pulse / components/charts — pure-SVG charts for the Metrics screen.
   Deterministic geometry: the same data array always renders the same
   polyline/bars, so re-scaling on range change is the only transition. */

import type { RangeDef } from "../lib/data";

const W = 320;
const H = 132;
const PAD_L = 30;
const PAD_R = 6;
const PAD_T = 8;
const PAD_B = 20;
const IW = W - PAD_L - PAD_R;
const IH = H - PAD_T - PAD_B;

function scale(points: number[], hi: number) {
  const max = Math.max(hi, ...points) * 1.08;
  return points.map((p) => PAD_T + IH - (p / max) * IH);
}

function gridRows(): number[] {
  return [0, 1, 2, 3].map((i) => PAD_T + (IH / 3) * i);
}

/* ------------------------------ line ------------------------------ */

export function LineChart({
  points,
  color,
  unit,
  hi,
  range,
}: {
  points: number[];
  color: string;
  unit: string;
  hi: number;
  range: RangeDef;
}) {
  const ys = scale(points, hi);
  const xs = points.map((_, i) => PAD_L + (i / (points.length - 1)) * IW);
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${ys[i].toFixed(1)}`).join(" ");
  const area = `${line} L${xs[xs.length - 1].toFixed(1)} ${PAD_T + IH} L${xs[0].toFixed(1)} ${PAD_T + IH} Z`;
  const peakIdx = points.indexOf(Math.max(...points));
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return (
    <svg className="plu-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`line chart, peak ${Math.max(...points).toFixed(0)}${unit}`}>
      {gridRows().map((y, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--color-outline-variant)" strokeWidth="1" />
          <text x={PAD_L - 5} y={y + 3} className="plu-chart-axis tnum" textAnchor="end">
            {Math.round(hi * (1 - i / 3))}
          </text>
        </g>
      ))}
      <path d={area} fill={color} opacity="0.1" stroke="none" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" />
      {xs.map((x, i) => (
        <rect key={i} x={x - 1.5} y={ys[i] - 1.5} width="3" height="3" fill={color} opacity={i === peakIdx ? 1 : 0.55} />
      ))}
      {ticks.map((t, i) => (
        <text
          key={i}
          x={PAD_L + IW * t}
          y={H - 5}
          className="plu-chart-axis"
          textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
        >
          {range.labels[i]}
        </text>
      ))}
    </svg>
  );
}

/* ------------------------------- bar -------------------------------- */

export function BarChart({
  points,
  color,
  unit,
  hi,
  range,
}: {
  points: number[];
  color: string;
  unit: string;
  hi: number;
  range: RangeDef;
}) {
  const max = Math.max(hi, ...points) * 1.08;
  const n = points.length;
  const slot = IW / n;
  const barW = slot * 0.62;
  const peak = Math.max(...points);
  return (
    <svg className="plu-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`bar chart, peak ${peak.toFixed(0)}${unit}`}>
      {gridRows().map((y, i) => (
        <g key={i}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y} stroke="var(--color-outline-variant)" strokeWidth="1" />
          <text x={PAD_L - 5} y={y + 3} className="plu-chart-axis tnum" textAnchor="end">
            {Math.round(hi * (1 - i / 3))}
          </text>
        </g>
      ))}
      {points.map((p, i) => {
        const h = (p / max) * IH;
        const x = PAD_L + slot * i + (slot - barW) / 2;
        return (
          <rect
            key={i}
            className="plu-bar"
            x={x}
            y={PAD_T + IH - h}
            width={barW}
            height={h}
            fill={p === peak ? "var(--color-primary)" : color}
            opacity={p === peak ? 1 : 0.85}
          />
        );
      })}
      <line x1={PAD_L} y1={PAD_T + IH} x2={W - PAD_R} y2={PAD_T + IH} stroke="var(--color-outline)" strokeWidth="1" />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <text
          key={i}
          x={PAD_L + IW * t}
          y={H - 5}
          className="plu-chart-axis"
          textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"}
        >
          {range.labels[i]}
        </text>
      ))}
    </svg>
  );
}

/* --------------------------- donut (health) --------------------------- */

export function HealthRing({
  ok,
  total,
}: {
  ok: number;
  total: number;
}) {
  const size = 64;
  const r = 26;
  const c = 2 * Math.PI * r;
  const frac = total > 0 ? ok / total : 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="plu-ring">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-outline-variant)" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--color-tertiary)"
        strokeWidth="6"
        strokeDasharray={`${(c * frac).toFixed(2)} ${c.toFixed(2)}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" className="plu-ring-text tnum">
        {Math.round(frac * 100)}%
      </text>
    </svg>
  );
}
