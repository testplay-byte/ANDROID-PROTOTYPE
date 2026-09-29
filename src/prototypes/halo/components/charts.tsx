"use client";

/**
 * halo / components / charts — pure inline-SVG, deterministic geometry.
 *
 * Nothing here reads a clock or a random source: the same array always draws
 * the same picture. A chart is the one place a neumorphic surface must stay
 * honest, so the fills are flat token colours inside carved grooves — no
 * gradients, no filters, no invented colours.
 */

import { PEAK_WINDOW, hourLabel } from "../data";

const W = 640;
const H = 160;
const PAD_L = 6;
const PAD_R = 6;
const PAD_T = 14;
const PAD_B = 26;
const IW = W - PAD_L - PAD_R;
const IH = H - PAD_T - PAD_B;

const xAt = (i: number, n: number) => PAD_L + (i / (n - 1)) * IW;

/**
 * Hour ticks rendered as HTML BELOW each chart, not as SVG text: the plots
 * use `preserveAspectRatio="none"` so they always fill their card, and that
 * would horizontally squash anything drawn inside the viewBox.
 */
export const HOUR_TICKS = [0, 6, 12, 18, 23];

const line = (points: number[], max: number) =>
  points
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(i, points.length).toFixed(1)} ${(PAD_T + IH - (p / max) * IH).toFixed(1)}`)
    .join(" ");

/* ------------------------------------------------------------ power curve
   A filled area + line, with a fixed "now" marker at the frozen wall clock
   and a soft wash over the meter's peak window. */

export function PowerCurve({
  values,
  nowHour,
  label,
}: {
  values: number[];
  nowHour: number;
  label: string;
}) {
  const max = Math.max(...values) * 1.1;
  const path = line(values, max);
  const area = `${path} L${xAt(values.length - 1, values.length).toFixed(1)} ${PAD_T + IH} L${PAD_L} ${PAD_T + IH} Z`;
  const peakIdx = values.indexOf(Math.max(...values));
  const nowIdx = Math.min(nowHour, values.length - 1);
  const nowY = PAD_T + IH - (values[nowIdx] / max) * IH;

  return (
    <svg className="halo-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={label}>
      {/* peak-rate window, washed in rather than outlined */}
      <rect
        x={xAt(PEAK_WINDOW.from, values.length)}
        y={PAD_T}
        width={xAt(PEAK_WINDOW.to, values.length) - xAt(PEAK_WINDOW.from, values.length)}
        height={IH}
        className="halo-chart__peak"
      />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={PAD_L}
          x2={W - PAD_R}
          y1={PAD_T + (IH / 3) * i}
          y2={PAD_T + (IH / 3) * i}
          className="halo-chart__grid"
        />
      ))}
      <path d={area} className="halo-chart__area" />
      <path d={path} className="halo-chart__line" />
      <circle cx={xAt(peakIdx, values.length)} cy={PAD_T + IH - (values[peakIdx] / max) * IH} r="3.5" className="halo-chart__dot" />
      <line x1={xAt(nowIdx, values.length)} x2={xAt(nowIdx, values.length)} y1={PAD_T} y2={PAD_T + IH} className="halo-chart__now" />
      <circle cx={xAt(nowIdx, values.length)} cy={nowY} r="3" className="halo-chart__nowdot" />
    </svg>
  );
}

/* ----------------------------------------------------------- hourly bars
   Today as extruded bars, yesterday as a thin line across the same frame —
   the comparison the Energy view is built around. */

export function HourlyBars({
  today,
  prev,
  nowHour,
}: {
  today: number[];
  prev: number[];
  nowHour: number;
}) {
  const max = Math.max(...today, ...prev) * 1.08;
  const n = today.length;
  const slot = IW / n;
  const barW = Math.max(4, slot * 0.52);
  const peakValue = Math.max(...today);

  return (
    <svg className="halo-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Hourly energy use today against yesterday">
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={PAD_L}
          x2={W - PAD_R}
          y1={PAD_T + (IH / 3) * i}
          y2={PAD_T + (IH / 3) * i}
          className="halo-chart__grid"
        />
      ))}
      <rect
        x={xAt(PEAK_WINDOW.from, n)}
        y={PAD_T}
        width={xAt(PEAK_WINDOW.to, n) - xAt(PEAK_WINDOW.from, n)}
        height={IH}
        className="halo-chart__peak"
      />
      {today.map((v, i) => {
        const h = (v / max) * IH;
        const isPeak = v === peakValue;
        return (
          <rect
            key={i}
            x={PAD_L + slot * i + (slot - barW) / 2}
            y={PAD_T + IH - h}
            width={barW}
            height={Math.max(1, h)}
            rx={Math.min(4, barW / 2)}
            className="halo-chart__bar"
            data-peak={isPeak || undefined}
            data-past={i <= nowHour || undefined}
          />
        );
      })}
      <path d={line(prev, max)} className="halo-chart__prev" />
      <line x1={PAD_L} x2={W - PAD_R} y1={PAD_T + IH} y2={PAD_T + IH} className="halo-chart__base" />
    </svg>
  );
}

/* ------------------------------------------------------------ peak strip
   A 24-cell bar strip: the peak-rate hours are filled, everything else is a
   quiet well. This is the one chart that stays a DOM list, so it reflows
   with the grid instead of scaling. */

export function PeakStrip({ values, nowHour }: { values: number[]; nowHour: number }) {
  const max = Math.max(...values);
  return (
    <div className="halo-peak" role="img" aria-label={`Hourly peak strip, busiest ${hourLabel(values.indexOf(max))}`}>
      {values.map((v, h) => {
        const inPeak = h >= PEAK_WINDOW.from && h <= PEAK_WINDOW.to;
        return (
          <span
            key={h}
            className="halo-peak__cell"
            data-peak={inPeak || undefined}
            data-past={h <= nowHour || undefined}
            style={{ height: `${Math.max(6, (v / max) * 100)}%` }}
            title={`${hourLabel(h)} · ${v.toFixed(2)} kWh`}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ hour axis
   The tick row that sits under every 24-hour plot. Rendered as HTML so the
   labels are never distorted by `preserveAspectRatio="none"`. */

export function ChartAxis() {
  return (
    <div className="halo-chartaxis" aria-hidden="true">
      {HOUR_TICKS.map((h) => (
        <span key={h} className="tnum" style={{ left: `${(h / 23) * 100}%` }}>
          {hourLabel(h)}
        </span>
      ))}
    </div>
  );
}

/* --------------------------------------------------------- device bars
   A carved groove per device with a filled bar for today and a tick for
   yesterday — the by-device half of the comparison. */
export function DeviceBar({ today, prev }: { today: number; prev: number }) {
  const max = Math.max(today, prev, 0.01);
  return (
    <span className="halo-bar" aria-hidden="true">
      <i className="halo-bar__fill" style={{ width: `${(today / max) * 100}%` }} />
      <i className="halo-bar__tick" style={{ left: `${(prev / max) * 100}%` }} />
    </span>
  );
}
