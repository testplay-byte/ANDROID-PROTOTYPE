"use client";

/**
 * signal / components / charts — hand-built inline SVG. No chart library.
 *
 * The rules this file exists to keep:
 *   · every chart is SVG written from scratch against a fixed viewBox, so it
 *     sizes to its CONTAINER (`width:100%; height:auto` + the viewBox aspect)
 *     and can never overflow at 1280, 1000 or 760;
 *   · gridlines are `--chart-grid`, axes and tick labels are `--chart-axis`,
 *     and every data stroke is a `--chart-series-N` token. No hue is named in
 *     this file — a series is an index, and the token supplies the ink;
 *   · area fills are `color-mix(... var(--chart-series-N) ...)` tints, never a
 *     second literal colour;
 *   · geometry is pure: the same numbers always produce the same path.
 */

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Cohort, FunnelStep, PlanId, Slice, Stack } from "../data";
import { fmtDelta, fmtInt, compact } from "../data";
import { Legend, Readout, type LegendEntry } from "./atoms";

/* ------------------------------------------------------------------ *
 * shared scale helpers
 * ------------------------------------------------------------------ */
export function niceMax(v: number, ticks = 4): { max: number; step: number } {
  if (!(v > 0)) return { max: 1, step: 0.25 };
  const rough = v / ticks;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const n = rough / mag;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  return { max: step * ticks, step };
}

const px = (n: number) => n.toFixed(1);

/** Pick at most `want` evenly spaced label indices so ticks never collide. */
function tickIdx(n: number, want: number): number[] {
  if (n <= want) return Array.from({ length: n }, (_, i) => i);
  const stride = Math.ceil(n / want);
  const out: number[] = [];
  for (let i = 0; i < n; i += stride) out.push(i);
  if (out[out.length - 1] !== n - 1) out.push(n - 1);
  return out;
}

/** Split a label into at most two balanced lines for narrow columns. */
function twoLines(s: string): [string, string] {
  const words = s.split(" ");
  if (words.length < 2) return [s, ""];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

/* Sparkline lives in atoms.tsx (see the note there): charts.tsx already
   imports the legend + readout atoms, and keeping Sparkline here would make
   the two modules import each other. Re-exported so screens can import it
   from either path. */
export { Sparkline } from "./atoms";

/* ================================================================== *
 * 2. Time series — the flagship chart
 *    current + comparison, crosshair readout, drag-to-brush window.
 * ================================================================== */
const TS = { w: 960, h: 300, l: 58, r: 18, t: 18, b: 38 };
const TS_IW = TS.w - TS.l - TS.r;
const TS_IH = TS.h - TS.t - TS.b;

export function TimeSeriesChart({
  current,
  previous,
  dates,
  unit,
  format,
  primaryLabel,
  comparisonLabel,
  brush,
  onBrush,
}: {
  current: number[];
  previous: number[];
  /** one label per plotted point — the x axis ticks off THIS, not the
      window's bucket labels, which are a different length by design */
  dates: string[];
  unit: string;
  format: (n: number) => string;
  primaryLabel: string;
  comparisonLabel: string;
  brush: { a: number; b: number } | null;
  onBrush: (b: { a: number; b: number } | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const n = current.length;
  const [hover, setHover] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ a: number; b: number } | null>(null);

  const { max, step } = useMemo(
    () => niceMax(Math.max(...current, ...previous, 1) * 1.06),
    [current, previous]
  );

  const x = (i: number) => TS.l + (n <= 1 ? TS_IW / 2 : (i / (n - 1)) * TS_IW);
  const y = (v: number) => TS.t + TS_IH - (v / max) * TS_IH;

  const line = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${px(x(i))} ${px(y(v))}`).join(" ");
  const areaPath = `${line(current)} L${px(x(n - 1))} ${px(TS.t + TS_IH)} L${px(TS.l)} ${px(TS.t + TS_IH)} Z`;

  const indexAt = (clientX: number) => {
    const el = svgRef.current;
    if (!el || n === 0) return 0;
    const r = el.getBoundingClientRect();
    const vx = ((clientX - r.left) / (r.width || 1)) * TS.w;
    const t = (vx - TS.l) / TS_IW;
    return Math.max(0, Math.min(n - 1, Math.round(t * (n - 1))));
  };

  const onMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const i = indexAt(e.clientX);
    setHover(i);
    if (drag) setDrag({ ...drag, b: i });
  };

  const startDrag = (e: ReactPointerEvent<SVGSVGElement>) => {
    const i = indexAt(e.clientX);
    setDrag({ a: i, b: i });
    setHover(i);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const endDrag = (e: ReactPointerEvent<SVGSVGElement>) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (!drag) return;
    const a = Math.min(drag.a, drag.b);
    const b = Math.max(drag.a, drag.b);
    setDrag(null);
    onBrush(b - a >= 1 ? { a, b } : null);
  };

  const sel = drag ?? brush;
  const hasSel = !!sel && sel.b > sel.a;

  /* readout: brushed aggregate, otherwise the hovered day */
  const from = hasSel ? sel.a : 0;
  const to = hasSel ? sel.b : n - 1;
  const curSum = current.slice(from, to + 1).reduce((a, b) => a + b, 0);
  const prevSum = previous.slice(from, to + 1).reduce((a, b) => a + b, 0);
  const readIdx = hover ?? n - 1;
  const isAgg = hasSel;
  const curVal = isAgg ? curSum / (to - from + 1) : current[readIdx];
  const prevVal = isAgg ? prevSum / (to - from + 1) : previous[readIdx] ?? 0;
  const delta = prevVal ? ((curVal - prevVal) / prevVal) * 100 : 0;

  const legend: LegendEntry[] = [
    { label: primaryLabel, series: 1, value: isAgg ? format(curSum) : format(current[readIdx]) },
    { label: comparisonLabel, series: 2, value: isAgg ? format(prevSum) : format(previous[readIdx] ?? 0) },
  ];

  return (
    <figure className="sig-figure">
      <div className="sig-plot">
        <svg
          ref={svgRef}
          className="sig-svg sig-svg--plot"
          viewBox={`0 0 ${TS.w} ${TS.h}`}
          role="img"
          aria-label={`${primaryLabel} over time, ${unit}, with the ${comparisonLabel.toLowerCase()} for comparison`}
          onPointerMove={onMove}
          onPointerDown={startDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={() => setHover(null)}
        >
          {/* gridlines — --chart-grid */}
          {Array.from({ length: 5 }, (_, i) => {
            const v = max - step * i;
            const gy = TS.t + (TS_IH / 4) * i;
            return (
              <g key={i}>
                <line x1={TS.l} y1={px(gy)} x2={TS.w - TS.r} y2={px(gy)} className="sig-gridline" />
                <text x={TS.l - 10} y={px(gy + 3.5)} className="sig-axis" textAnchor="end">
                  {format(v)}
                </text>
              </g>
            );
          })}

          {/* a transparent hit area over the whole plot: without it the empty
              space above and below the line swallows the pointer, and the
              crosshair would only follow the stroke itself */}
          <rect x={TS.l} y={TS.t} width={TS_IW} height={TS_IH} className="sig-barhit" />

          {/* brushed window band */}
          {hasSel && (
            <rect
              x={px(x(sel.a))}
              y={px(TS.t)}
              width={px(Math.max(2, x(sel.b) - x(sel.a)))}
              height={px(TS_IH)}
              className="sig-brush"
            />
          )}

          {/* comparison first so the signal sits on top */}
          <path d={line(previous)} className="sig-line sig-line--alt" pathLength={1} />
          <path d={areaPath} className="sig-area" />
          <path d={line(current)} className="sig-line sig-draw" pathLength={1} />

          {/* crosshair */}
          {hover !== null && !hasSel && (
            <g className="sig-cross">
              <line x1={px(x(hover))} y1={px(TS.t)} x2={px(x(hover))} y2={px(TS.t + TS_IH)} />
              <circle cx={px(x(hover))} cy={px(y(current[hover]))} r="3.5" data-series="2" />
              <circle cx={px(x(hover))} cy={px(y(current[hover]))} r="3.5" data-series="1" />
            </g>
          )}

          {/* brush handles */}
          {hasSel && (
            <g className="sig-brushhandles">
              <line x1={px(x(sel.a))} y1={px(TS.t)} x2={px(x(sel.a))} y2={px(TS.t + TS_IH)} />
              <line x1={px(x(sel.b))} y1={px(TS.t)} x2={px(x(sel.b))} y2={px(TS.t + TS_IH)} />
            </g>
          )}

          {/* baseline — the axis ink, one hairline */}
          <line x1={TS.l} y1={px(TS.t + TS_IH)} x2={TS.w - TS.r} y2={px(TS.t + TS_IH)} className="sig-baseline" />

          {tickIdx(n, 7).map((i) => (
            <text key={i} x={px(x(i))} y={TS.h - 12} className="sig-axis" textAnchor={i === 0 ? "start" : i === n - 1 ? "end" : "middle"}>
              {dates[i]}
            </text>
          ))}
        </svg>
      </div>

      <Legend items={legend} />
      <Readout
        items={[
          {
            label: isAgg ? `${to - from + 1}-day mean` : dates[readIdx],
            value: format(isAgg ? curSum / (to - from + 1) : current[readIdx]),
            series: 1,
          },
          {
            label: `${comparisonLabel} · ${isAgg ? "same window" : "same day"}`,
            value: format(prevVal),
            series: 2,
          },
          {
            label: "Change",
            value: fmtDelta(delta),
            tone: delta >= 0 ? "ok" : "bad",
          },
        ]}
        note={hasSel ? "Window selected — drag again to change it, or press Esc to clear." : "Drag across the plot to brush a window."}
      />
    </figure>
  );
}

/* ================================================================== *
 * 3. Stacked bars — sessions by platform
 * ================================================================== */
const SB = { w: 620, h: 300, l: 56, r: 14, t: 16, b: 40 };
const SB_IW = SB.w - SB.l - SB.r;
const SB_IH = SB.h - SB.t - SB.b;

export function StackedBars({
  stacks,
  labels,
  totals,
  onPick,
  active,
}: {
  stacks: Stack[];
  labels: string[];
  totals: number[];
  onPick: (i: number) => void;
  /** index of the hovered bucket, or -1 for "none" */
  active: number;
}) {
  const { max, step } = useMemo(() => niceMax(Math.max(...totals, 1) * 1.08), [totals]);
  const n = totals.length || 1;
  const slot = SB_IW / n;
  const barW = Math.max(4, Math.min(34, slot * 0.62));
  const y = (v: number) => SB.t + SB_IH - (v / max) * SB_IH;
  const hovered = active >= 0 ? active : n - 1;
  const bucketTotal = totals[hovered] ?? 0;

  return (
    <figure className="sig-figure">
      <div className="sig-plot">
        <svg
          className="sig-svg sig-svg--plot"
          viewBox={`0 0 ${SB.w} ${SB.h}`}
          role="img"
          aria-label="Sessions per bucket, stacked by platform"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const v = max - step * i;
            const gy = SB.t + (SB_IH / 4) * i;
            return (
              <g key={i}>
                <line x1={SB.l} y1={px(gy)} x2={SB.w - SB.r} y2={px(gy)} className="sig-gridline" />
                <text x={SB.l - 10} y={px(gy + 3.5)} className="sig-axis" textAnchor="end">
                  {compact(v)}
                </text>
              </g>
            );
          })}

          {totals.map((total, i) => {
            const cx = SB.l + slot * i + slot / 2;
            let acc = 0;
            return (
              <g
                key={i}
                className="sig-bargroup"
                data-dim={active >= 0 && i !== active ? "true" : undefined}
                onPointerEnter={() => onPick(i)}
                onPointerLeave={() => onPick(-1)}
              >
                <rect x={px(cx - slot / 2)} y={SB.t} width={px(slot)} height={px(SB_IH)} className="sig-barhit" />
                {stacks.map((s, k) => {
                  const v = s.values[i] ?? 0;
                  const y0 = y(acc);
                  const y1 = y(acc + v);
                  acc += v;
                  return (
                    <rect
                      key={s.key}
                      x={px(cx - barW / 2)}
                      y={px(y1)}
                      width={px(barW)}
                      height={px(Math.max(0.5, y0 - y1))}
                      data-series={k + 1}
                      className="sig-bar"
                      style={{ "--i": k } as React.CSSProperties}
                    />
                  );
                })}
                <text x={px(cx)} y={px(y(total) - 8)} className="sig-value" textAnchor="middle">
                  {compact(total)}
                </text>
              </g>
            );
          })}

          <line x1={SB.l} y1={px(SB.t + SB_IH)} x2={SB.w - SB.r} y2={px(SB.t + SB_IH)} className="sig-baseline" />
          {tickIdx(n, 6).map((i) => (
            <text key={i} x={px(SB.l + slot * i + slot / 2)} y={SB.h - 14} className="sig-axis" textAnchor="middle">
              {labels[i]}
            </text>
          ))}
        </svg>
      </div>

      <Legend
        items={stacks.map((s, k) => ({
          label: s.label,
          series: k + 1,
          fill: true,
          value: compact(s.values[hovered] ?? 0),
        }))}
      />
      <Readout
        items={[
          { label: labels[hovered] ?? "", value: `${compact(bucketTotal)} sessions` },
          { label: "Top platform", value: stacks.slice().sort((a, b) => (b.values[hovered] ?? 0) - (a.values[hovered] ?? 0))[0]?.label ?? "—" },
        ]}
        note="Hover a column to read that bucket."
      />
    </figure>
  );
}

/* ================================================================== *
 * 4. Donut — revenue mix by plan
 * ================================================================== */
export function Donut({
  slices,
  mrr,
  centreLabel,
  centreValue,
  active,
  onPick,
}: {
  slices: Slice[];
  /** monthly recurring revenue — the centre readout when nothing is hovered */
  mrr: number;
  centreLabel: string;
  centreValue: string;
  /** index of the hovered slice, or -1 for "none" */
  active: number;
  onPick: (i: number) => void;
}) {
  const R = 62;
  const C = 2 * Math.PI * R;
  const hovered = active >= 0 ? active : null;

  let offset = 0;
  const arcs = slices.map((s, i) => {
    const len = s.share * C;
    const arc = { s, i, dash: `${Math.max(0, len - 3)} ${C}`, offset: -offset };
    offset += len;
    return arc;
  });

  return (
    <figure className="sig-figure sig-figure--ring">
      <div className="sig-ring">
        <svg className="sig-svg sig-svg--ring" viewBox="0 0 180 180" role="img" aria-label={`${centreLabel}: paying-user share by plan`}>
          <circle cx="90" cy="90" r={R} className="sig-ring__track" />
          {arcs.map((a) => (
            <circle
              key={a.s.key}
              cx="90"
              cy="90"
              r={R}
              className="sig-ring__arc"
              data-series={slices.indexOf(a.s) + 1}
              data-dim={hovered !== null && hovered !== a.i ? "true" : undefined}
              strokeDasharray={a.dash}
              strokeDashoffset={a.offset}
              onPointerEnter={() => onPick(a.i)}
              onPointerLeave={() => onPick(-1)}
            />
          ))}
        </svg>
        <div className="sig-ring__centre">
          <b className="tnum">
            {hovered === null ? centreValue : fmtInt(slices[hovered].users)}
          </b>
          <span>{hovered === null ? centreLabel : slices[hovered].label}</span>
        </div>
      </div>
      <Legend
        items={slices.map((s, i) => ({
          label: s.label,
          series: i + 1,
          fill: true,
          value: `${(s.share * 100).toFixed(1)}%`,
        }))}
      />
      <Readout
        items={[
          { label: "MRR in window", value: `$${Math.round(mrr).toLocaleString("en-US")}` },
          { label: "Paying users", value: fmtInt(slices.reduce((a, s) => a + s.users, 0)) },
        ]}
        note="Hover a segment to isolate it. Segments are the paying-user split; MRR is the ARPU-weighted sum."
      />
    </figure>
  );
}

/* ================================================================== *
 * 5. Funnel — two orientations, same data.
 *    The vertical one is the desktop default; the horizontal one is what the
 *    @container surface (max-width: 900px) rule reveals on tablet. Both are
 *    real SVG — the CSS swaps which one is displayed, it does not rescale one.
 * ================================================================== */
const RAIL = 400;

export function FunnelChart({
  steps,
  orientation,
  onPick,
  active,
}: {
  steps: FunnelStep[];
  orientation: "vertical" | "horizontal";
  onPick: (i: number) => void;
  /** index of the hovered step, or -1 for "none" */
  active: number;
}) {
  const top = steps[0]?.users || 1;
  const dimmed = active >= 0;

  if (orientation === "horizontal") {
    const W = 760;
    const H = 300;
    const n = steps.length;
    const col = W / n;
    const base = 214;
    const maxH = 138;
    return (
      <figure className="sig-figure">
        <div className="sig-plot">
          <svg
            className="sig-svg sig-svg--plot"
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label="Activation funnel, horizontal"
          >
            <line x1="4" y1={px(base)} x2={W - 4} y2={px(base)} className="sig-baseline" />
            {steps.map((s, i) => {
              const h = Math.max(3, (s.users / top) * maxH);
              const cx = col * i + col / 2;
              const bw = Math.min(78, col * 0.56);
              const [l1, l2] = twoLines(s.label);
              return (
                <g
                  key={s.id}
                  className="sig-fstep"
                  data-dim={dimmed && active !== i ? "true" : undefined}
                  onPointerEnter={() => onPick(i)}
                  onPointerLeave={() => onPick(-1)}
                >
                  <rect x={px(cx - col / 2)} y="0" width={px(col)} height={px(base)} className="sig-barhit" />
                  <text x={px(cx)} y="18" className="sig-value" textAnchor="middle">
                    {fmtInt(s.users)}
                  </text>
                  <rect
                    x={px(cx - bw / 2)}
                    y={px(base - maxH)}
                    width={px(bw)}
                    height={px(maxH)}
                    className="sig-fghost"
                  />
                  <rect
                    x={px(cx - bw / 2)}
                    y={px(base - h)}
                    width={px(bw)}
                    height={px(h)}
                    className="sig-fbar"
                    style={{ "--i": i } as React.CSSProperties}
                  />
                  <text x={px(cx)} y={px(base + 20)} className="sig-axis" textAnchor="middle">
                    {l1}
                  </text>
                  {l2 && (
                    <text x={px(cx)} y={px(base + 34)} className="sig-axis" textAnchor="middle">
                      {l2}
                    </text>
                  )}
                  <text x={px(cx)} y={px(base + 52)} className="sig-axis sig-axis--strong" textAnchor="middle">
                    {(s.ofTop * 100).toFixed(0)}% of top
                  </text>
                  {i > 0 && (
                    <text x={px(cx + col / 2)} y={px(base + 68)} className="sig-axis" textAnchor="middle">
                      ↓ {(s.ofPrev * 100).toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </figure>
    );
  }

  const W = 900;
  const rowH = 52;
  const H = steps.length * rowH + 8;
  const RAILX = 190;

  return (
    <figure className="sig-figure">
      <div className="sig-plot">
        <svg
          className="sig-svg sig-svg--plot"
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Activation funnel, vertical"
        >
          {steps.map((s, i) => {
            const y0 = 4 + i * rowH;
            const w = Math.max(2, (s.users / top) * RAIL);
            return (
              <g
                key={s.id}
                className="sig-fstep"
                data-dim={dimmed && active !== i ? "true" : undefined}
                onPointerEnter={() => onPick(i)}
                onPointerLeave={() => onPick(-1)}
              >
                <rect x="0" y={px(y0)} width={W} height={px(rowH)} className="sig-barhit" />
                <text x="0" y={px(y0 + 15)} className="sig-value" textAnchor="start">
                  {s.label}
                </text>
                <text x="0" y={px(y0 + 31)} className="sig-axis" textAnchor="start">
                  {s.hint}
                </text>

                <rect x={RAILX} y={px(y0 + 4)} width={RAIL} height="20" className="sig-fghost" />
                <rect
                  x={RAILX}
                  y={px(y0 + 4)}
                  width={px(w)}
                  height="20"
                  className="sig-fbar"
                  style={{ "--i": i } as React.CSSProperties}
                />
                <text x={px(RAILX + RAIL + 18)} y={px(y0 + 19)} className="sig-value" textAnchor="start">
                  {fmtInt(s.users)}
                </text>
                <text x={px(RAILX + RAIL + 18)} y={px(y0 + 35)} className="sig-axis" textAnchor="start">
                  {(s.ofTop * 100).toFixed(1)}% of top
                </text>
                {i > 0 && (
                  <text x={W - 4} y={px(y0 + 19)} className="sig-axis" textAnchor="end">
                    ↓ {(s.ofPrev * 100).toFixed(1)}% · −{fmtInt(s.lost)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

/* ================================================================== *
 * 6. Cohort heat grid — weeks × cohorts, one hoverable cell
 * ================================================================== */
const HG = { w: 900, l: 132, cellW: 92, cellH: 26, gap: 3, top: 34 };

export function HeatGrid({
  cohorts,
  weeks,
  onHover,
  hover,
}: {
  cohorts: Cohort[];
  weeks: number;
  onHover: (cell: { c: number; w: number; v: number; cohort: Cohort } | null) => void;
  hover: { c: number; w: number } | null;
}) {
  const rows = cohorts.length;
  const H = HG.top + rows * (HG.cellH + HG.gap) + 6;
  const W = HG.l + weeks * (HG.cellW + HG.gap) + 4;

  return (
    <figure className="sig-figure">
      <div className="sig-plot sig-plot--scroll">
        <svg
          className="sig-svg sig-svg--plot"
          viewBox={`0 0 ${W} ${H}`}
          style={{ minWidth: 640 }}
          role="img"
          aria-label="Weekly cohort retention grid"
        >
          {Array.from({ length: weeks }, (_, w) => (
            <text key={w} x={HG.l + w * (HG.cellW + HG.gap) + HG.cellW / 2} y={20} className="sig-axis" textAnchor="middle">
              W{w}
            </text>
          ))}
          {cohorts.map((c, r) => {
            const cy = HG.top + r * (HG.cellH + HG.gap);
            return (
              <g key={c.id}>
                <text x={0} y={px(cy + HG.cellH / 2 + 4)} className="sig-value" textAnchor="start">
                  {c.label}
                </text>
                <text x={HG.l - 10} y={px(cy + HG.cellH / 2 + 4)} className="sig-axis" textAnchor="end">
                  {fmtInt(c.size)}
                </text>
                {c.values.slice(0, weeks).map((v, w) => {
                  if (Number.isNaN(v)) {
                    return (
                      <rect
                        key={w}
                        x={HG.l + w * (HG.cellW + HG.gap)}
                        y={cy}
                        width={HG.cellW}
                        height={HG.cellH}
                        className="sig-cell sig-cell--empty"
                      />
                    );
                  }
                  const step = v >= 70 ? 5 : v >= 55 ? 4 : v >= 40 ? 3 : v >= 25 ? 2 : v >= 12 ? 1 : 0;
                  return (
                    <g key={w}>
                      <rect
                        x={HG.l + w * (HG.cellW + HG.gap)}
                        y={cy}
                        width={HG.cellW}
                        height={HG.cellH}
                        className="sig-cell"
                        data-step={step}
                        data-on={hover?.c === r && hover?.w === w ? "true" : undefined}
                        onPointerEnter={() => onHover({ c: r, w, v, cohort: c })}
                        onPointerLeave={() => onHover(null)}
                      />
                      <text
                        x={HG.l + w * (HG.cellW + HG.gap) + HG.cellW / 2}
                        y={cy + HG.cellH / 2 + 4}
                        className="sig-cellvalue"
                        data-step={step}
                        textAnchor="middle"
                      >
                        {v}%
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

/* ================================================================== *
 * 7. Retention curve — the grid's line equivalent
 * ================================================================== */
const RC = { w: 620, h: 260, l: 44, r: 14, t: 16, b: 32 };
const RC_IW = RC.w - RC.l - RC.r;
const RC_IH = RC.h - RC.t - RC.b;

export function RetentionCurve({
  cohorts,
  onHover,
  hover,
}: {
  cohorts: Cohort[];
  onHover: (w: number | null) => void;
  hover: number | null;
}) {
  const weeks = Math.max(...cohorts.map((c) => c.values.length));
  const shown = cohorts.filter((_, i) => i % 2 === 0 || i === cohorts.length - 1).slice(0, 5);
  const y = (v: number) => RC.t + RC_IH - (v / 100) * RC_IH;
  const x = (w: number) => RC.l + (w / (weeks - 1)) * RC_IW;
  const read = hover ?? weeks - 1;
  const svgRef = useRef<SVGSVGElement | null>(null);

  /* the crosshair picks the week column under the pointer, so the legend
     readouts below follow it */
  const weekAt = (clientX: number) => {
    const el = svgRef.current;
    if (!el || weeks < 2) return 0;
    const r = el.getBoundingClientRect();
    const vx = ((clientX - r.left) / (r.width || 1)) * RC.w;
    const t = (vx - RC.l) / RC_IW;
    return Math.max(0, Math.min(weeks - 1, Math.round(t * (weeks - 1))));
  };

  return (
    <figure className="sig-figure">
      <div className="sig-plot">
        <svg
          ref={svgRef}
          className="sig-svg sig-svg--plot"
          viewBox={`0 0 ${RC.w} ${RC.h}`}
          role="img"
          aria-label="Retention by week for selected cohorts"
          onPointerMove={(e) => onHover(weekAt(e.clientX))}
          onPointerLeave={() => onHover(null)}
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={RC.l} y1={px(y(v))} x2={RC.w - RC.r} y2={px(y(v))} className="sig-gridline" />
              <text x={RC.l - 8} y={px(y(v) + 3.5)} className="sig-axis" textAnchor="end">
                {v}%
              </text>
            </g>
          ))}
          {shown.map((c, k) => {
            const pts = c.values
              .map((v, w) => (Number.isNaN(v) ? null : `${w === 0 ? "M" : "L"}${px(x(w))} ${px(y(v))}`))
              .filter(Boolean)
              .join(" ");
            return <path key={c.id} d={pts} className="sig-line sig-draw" data-series={k + 1} pathLength={1} />;
          })}
          {/* full-plot hit area, so the empty space above the lines is live */}
          <rect x={RC.l} y={RC.t} width={RC_IW} height={RC_IH} className="sig-barhit" />
          {hover !== null && (
            <g className="sig-cross">
              <line x1={px(x(read))} y1={px(RC.t)} x2={px(x(read))} y2={px(RC.t + RC_IH)} />
              {shown.map((c, k) =>
                Number.isNaN(c.values[read]) ? null : (
                  <circle key={c.id} cx={px(x(read))} cy={px(y(c.values[read]))} r="3" data-series={k + 1} />
                )
              )}
            </g>
          )}
          <line x1={RC.l} y1={px(RC.t + RC_IH)} x2={RC.w - RC.r} y2={px(RC.t + RC_IH)} className="sig-baseline" />
          {Array.from({ length: weeks }, (_, w) => (
            <text key={w} x={px(x(w))} y={RC.h - 10} className="sig-axis" textAnchor="middle">
              W{w}
            </text>
          ))}
        </svg>
      </div>
      <Legend
        items={shown.map((c, k) => ({
          label: c.label.replace("W/c ", ""),
          series: k + 1,
          value: Number.isNaN(c.values[read]) ? "—" : `${c.values[read]}%`,
        }))}
      />
    </figure>
  );
}

/* ================================================================== *
 * 8. Heat legend — the ramp, drawn from the same token as the grid
 * ================================================================== */
export function HeatLegend({ min, max }: { min: number; max: number }) {
  const steps = [
    { label: "<12%", hint: "churned" },
    { label: "12–25%", hint: "at risk" },
    { label: "25–40%", hint: "soft" },
    { label: "40–55%", hint: "holding" },
    { label: "55–70%", hint: "strong" },
    { label: "70%+", hint: "core" },
  ];
  return (
    <ul className="sig-heatlegend">
      {steps.map((s, i) => (
        <li key={s.label}>
          <i data-step={i} aria-hidden="true" />
          <b className="tnum">{s.label}</b>
          <span>{s.hint}</span>
        </li>
      ))}
      <li className="sig-heatlegend__note">
        W0 is the cohort&apos;s own size ({fmtInt(min)}–{fmtInt(max)} users); later cells are the share still
        active in that week.
      </li>
    </ul>
  );
}

/* ================================================================== *
 * 9. Plan bar — a tiny horizontal comparison used in the funnel breakdown
 * ================================================================== */
export function PlanBars({ rows }: { rows: { label: string; value: number; share: number; plan: PlanId }[] }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="sig-planbars">
      {rows.map((r, i) => (
        <li key={r.label}>
          <span className="sig-planbars__label">{r.label}</span>
          <span className="sig-planbars__track">
            <i style={{ width: `${(r.value / max) * 100}%` }} data-series={i + 1} />
          </span>
          <b className="tnum">{fmtInt(r.value)}</b>
          <span className="sig-planbars__share tnum">{(r.share * 100).toFixed(1)}%</span>
        </li>
      ))}
    </ul>
  );
}

export const CHART_SERIES_COUNT = 5;
