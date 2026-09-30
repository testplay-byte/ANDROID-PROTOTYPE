"use client";

/**
 * helio / components / charts — the dashboard's visual vocabulary.
 *
 * Every mark is hand-built SVG (no chart library). The rules this file
 * follows, taken from the reference system:
 *
 *   · no chart border, no y-axis, no vertical gridlines unless they carry
 *     meaning — only hairline horizontals
 *   · rounded caps everywhere, including stacked segments
 *   · legends live in the card header, never inside the plot
 *   · missing data is drawn as a dashed ghost, not skipped
 *   · every number is tabular; the ink comes from the token palette
 */

import { useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

/** Catmull-Rom → cubic path (smooth trend lines). */
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

const INK = {
  idle: "var(--chart-bar-idle, color-mix(in srgb, var(--color-text) 22%, transparent))",
  axis: "var(--chart-axis)",
  grid: "var(--chart-grid)",
  s1: "var(--chart-series-1)",
  s2: "var(--chart-series-2)",
  s3: "var(--chart-series-3)",
  s4: "var(--chart-series-4)",
  s5: "var(--chart-series-5)",
};

/* ------------------------------------------------------------------ */
/* 1 · combo: columns + a smooth comparison line                       */
/* ------------------------------------------------------------------ */
export function ComboChart({
  values,
  compare,
  labels,
  highlight = 0,
  valueFmt = (v: number) => String(v),
  unit = "",
  height = 190,
}: {
  values: number[];
  compare?: number[];
  labels: string[];
  /** index of the emphasised column (-1 for none) */
  highlight?: number;
  valueFmt?: (v: number) => string;
  unit?: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = height;
  const padB = 22;
  const max = Math.max(...values, ...(compare ?? [])) * 1.15 || 1;
  const step = W / values.length;
  const bw = Math.min(26, step * 0.52);
  const y = (v: number) => H - padB - (v / max) * (H - padB - 8);
  const line = compare?.map((v, i) => [i * step + step / 2, y(v)] as [number, number]);

  return (
    <div className="hl-plot" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Production by hour with yesterday's comparison">
        {values.map((v, i) => {
          const active = i === highlight || i === hover;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect
                x={i * step + step / 2 - step / 2}
                y={0}
                width={step}
                height={H - padB}
                fill="transparent"
              />
              <rect
                className="hl-col"
                x={i * step + (step - bw) / 2}
                y={y(v)}
                width={bw}
                height={H - padB - y(v)}
                rx={bw / 2}
                fill={active ? INK.s1 : INK.idle}
              />
            </g>
          );
        })}
        {line && (
          <path
            d={smoothPath(line)}
            fill="none"
            stroke={INK.s2}
            strokeWidth={1.75}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        )}
        {labels.map((l, i) => (
          <text
            key={l + i}
            className="hl-axis-text"
            x={i * step + step / 2}
            y={H - 6}
            textAnchor="middle"
            fill={i === highlight ? "var(--color-text)" : INK.axis}
          >
            {l}
          </text>
        ))}
      </svg>
      {highlight >= 0 && (
        <span
          className="hl-valuepill tnum"
          style={{ left: `${((highlight + 0.5) / values.length) * 100}%` }}
        >
          {valueFmt(values[highlight])}
          {unit}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · donut with a centre readout                                      */
/* ------------------------------------------------------------------ */
export function Donut({
  pct,
  centre,
  sub,
  size = 168,
  stroke = 14,
  color = INK.s1,
}: {
  pct: number;
  centre: string;
  sub: string;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="hl-donut" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`${pct}% complete`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={INK.idle} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="hl-donut__centre">
        <strong className="tnum">{centre}</strong>
        <span>{sub}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · segmented progress (pills on a track)                          */
/* ------------------------------------------------------------------ */
export function SegmentedProgress({
  value,
  segments = 8,
  color = INK.s1,
  trailing = 0,
}: {
  value: number;
  segments?: number;
  color?: string;
  /** extra segments drawn in the error ink (reference: the red tail) */
  trailing?: number;
}) {
  const filled = Math.round((value / 100) * segments);
  return (
    <div className="hl-seg" aria-hidden="true">
      {Array.from({ length: segments }, (_, i) => (
        <span
          key={i}
          className="hl-seg__pill"
          style={{ background: i < filled ? color : undefined, opacity: i < filled ? 1 : 0.22 }}
        />
      ))}
      {trailing > 0 && (
        <span className="hl-seg__pill" style={{ background: INK.s5, opacity: 0.55 }} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · sparkline — sharp peaks (grid frequency) or a smooth trend       */
/* ------------------------------------------------------------------ */
export function Sparkline({
  values,
  color = INK.s1,
  area = false,
  smooth = false,
  height = 54,
  label,
}: {
  values: number[];
  color?: string;
  area?: boolean;
  smooth?: boolean;
  height?: number;
  label?: string;
}) {
  const W = 240;
  const H = height;
  const max = Math.max(...values, 1);
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - 4 - (v / max) * (H - 10)] as [number, number]);
  const line = smooth ? smoothPath(pts) : pts.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  const areaD = `${line} L ${W} ${H} L 0 ${H} Z`;
  return (
    <svg className="hl-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" height={H} role="img" aria-label={label}>
      {area && <path d={areaD} fill={color} opacity={0.14} />}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={color} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · step timeline (load bands through the day)                      */
/* ------------------------------------------------------------------ */
const LEVEL_COLOR = [INK.idle, INK.s4, INK.s1, INK.s3];
const LEVEL_NAME = ["Off-peak", "Base", "Peak", "Stress"];

export function StepTimeline({
  steps,
  labels,
  height = 130,
}: {
  steps: number[];
  labels: string;
  height?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 900;
  const H = height;
  const bw = W / steps.length;
  const y = (l: number) => 14 + l * 26;
  return (
    <div className="hl-plot">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" height={H} role="img" aria-label={`Load bands through the ${labels}`}>
        {steps.map((l, i) => {
          const next = steps[i + 1] ?? l;
          const top = y(Math.max(l, next));
          const h = Math.max(10, Math.abs(y(l) - y(next)) + 10);
          const on = i === hover;
          return (
            <rect
              key={i}
              className="hl-step"
              x={i * bw + 1}
              y={on ? top - 2 : top}
              width={Math.max(1, bw - 2)}
              height={h}
              rx={4}
              fill={LEVEL_COLOR[l]}
              opacity={on ? 1 : 0.82}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}
        {hover !== null && (
          <line className="hl-crosshair" x1={hover * bw + bw / 2} x2={hover * bw + bw / 2} y1={6} y2={H - 20} />
        )}
        <text className="hl-axis-text" x={0} y={H - 4} fill={INK.axis}>
          {labels}
        </text>
        <text className="hl-axis-text" x={W} y={H - 4} textAnchor="end" fill={INK.axis}>
          now
        </text>
      </svg>
      {hover !== null && (
        <div
          className="hl-tip"
          style={{ left: `${((hover + 0.5) / steps.length) * 100}%` }}
        >
          <span>{LEVEL_NAME[steps[hover]]}</span>
          <b className="tnum">
            {String(hover).padStart(2, "0")}:{String((hover % 4) * 15).padStart(2, "0")}
          </b>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · column chart with a selected bar and an average rule            */
/* ------------------------------------------------------------------ */
export function ColumnChart({
  data,
  selected = -1,
  avg,
  avgLabel,
  height = 190,
  format = (v: number) => String(v),
}: {
  data: { label: string; value: number }[];
  selected?: number;
  avg?: number;
  avgLabel?: string;
  height?: number;
  format?: (v: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = height;
  const padB = 22;
  const max = Math.max(...data.map((d) => d.value), avg ?? 0) * 1.18 || 1;
  const step = W / data.length;
  const bw = Math.min(30, step * 0.56);
  const y = (v: number) => H - padB - (v / max) * (H - padB - 10);
  return (
    <div className="hl-plot" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Weekly output">
        {avg !== undefined && (
          <>
            <line className="hl-rule" x1={0} x2={W} y1={y(avg)} y2={y(avg)} />
            <text className="hl-axis-text" x={2} y={y(avg) - 6} fill={INK.axis}>
              {avgLabel ?? `${format(avg)} AVG`}
            </text>
          </>
        )}
        {data.map((d, i) => {
          const on = i === selected || i === hover;
          return (
            <g key={d.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={i * step} y={0} width={step} height={H - padB} fill="transparent" />
              <rect
                className="hl-col"
                x={i * step + (step - bw) / 2}
                y={y(d.value)}
                width={bw}
                height={H - padB - y(d.value)}
                rx={bw / 2}
                fill={on ? INK.s1 : INK.idle}
              />
            </g>
          );
        })}
        {data.map((d, i) => (
          <text
            key={d.label + i}
            className="hl-axis-text"
            x={i * step + step / 2}
            y={H - 6}
            textAnchor="middle"
            fill={i === selected ? "var(--color-text)" : INK.axis}
          >
            {d.label}
          </text>
        ))}
      </svg>
      {hover !== null && <span className="hl-hoverpill tnum">{format(data[hover].value)}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · stacked mix bar with a legend                                   */
/* ------------------------------------------------------------------ */
export function StackedBar({
  segments,
}: {
  segments: { label: string; value: number; color: string }[];
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <div className="hl-stack" role="img" aria-label="Energy mix">
      <div className="hl-stack__bar">
        {segments.map((s) => (
          <span
            key={s.label}
            style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
            title={`${s.label} ${s.value}%`}
          />
        ))}
      </div>
      <ul className="hl-stack__legend">
        {segments.map((s) => (
          <li key={s.label}>
            <i style={{ background: s.color }} />
            {s.label}
            <b className="tnum">{s.value}%</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 8 · half gauge (storage) with a needle                              */
/* ------------------------------------------------------------------ */
export function HalfGauge({
  pct,
  centre,
  sub,
  color = INK.s3,
  size = 190,
}: {
  pct: number;
  centre: string;
  sub: string;
  color?: string;
  size?: number;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = Math.PI * r; // half circumference
  return (
    <div className="hl-gauge" style={{ width: size, height: size / 2 + 34 }}>
      <svg viewBox={`0 0 ${size} ${size / 2 + 4}`} width={size} height={size / 2 + 4} role="img" aria-label={`${pct}%`}>
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke={INK.idle}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
        <circle cx={size / 2} cy={size / 2} r={5} fill="var(--color-text)" />
      </svg>
      <div className="hl-gauge__readout">
        <strong className="tnum">{centre}</strong>
        <span>{sub}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 9 · ranked horizontal bars                                          */
/* ------------------------------------------------------------------ */
export function RankBars({
  rows,
  format = (v: number) => String(v),
}: {
  rows: { label: string; value: number; unit?: string }[];
  format?: (v: number) => string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="hl-rank">
      {rows.map((r) => (
        <li key={r.label}>
          <span className="hl-rank__label">{r.label}</span>
          <span className="hl-rank__track">
            <span className="hl-rank__fill" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <b className="tnum">
            {format(r.value)}
            {r.unit ? ` ${r.unit}` : ""}
          </b>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · area trend line                                                */
/* ------------------------------------------------------------------ */
export function AreaLine({
  values,
  labels,
  color = INK.s1,
  height = 150,
  emphasiseLast = true,
}: {
  values: number[];
  labels: string[];
  color?: string;
  height?: number;
  emphasiseLast?: boolean;
}) {
  const W = 520;
  const H = height;
  const padB = 20;
  const max = Math.max(...values) * 1.2 || 1;
  const min = Math.min(...values) * 0.8;
  const pts = values.map((v, i) => [(i / (values.length - 1)) * W, H - padB - ((v - min) / (max - min || 1)) * (H - padB - 12)] as [number, number]);
  const line = smoothPath(pts);
  return (
    <div className="hl-plot" style={{ height }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Trend">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} className="hl-grid" x1={0} x2={W} y1={H * f} y2={H * f} />
        ))}
        <path d={`${line} L ${W} ${H} L 0 ${H} Z`} fill={color} opacity={0.13} />
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={2.25}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {emphasiseLast && <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.5} fill={color} />}
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 4) === 0 ? (
            <text key={l + i} className="hl-axis-text" x={(i / (labels.length - 1)) * W} y={H - 5} textAnchor="middle" fill={INK.axis}>
              {l}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 11 · site map (abstract, token-drawn)                                */
/* ------------------------------------------------------------------ */
export function SiteMap({ points }: { points: { x: number; y: number; hot: boolean }[] }) {
  return (
    <svg className="hl-map" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Site map">
      <defs>
        <pattern id="hl-grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M 26 0 L 0 0 0 26" fill="none" stroke="var(--chart-grid)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="260" fill="url(#hl-grid)" />
      <path
        className="hl-map__route"
        d="M 48 208 C 120 190, 140 120, 214 108 S 320 96, 358 52"
        fill="none"
        stroke="var(--chart-series-1)"
        strokeWidth="3"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={9} fill={p.hot ? "var(--chart-series-1)" : "var(--color-surface-4)"} />
          {p.hot && <circle cx={p.x} cy={p.y} r={15} fill="none" stroke="var(--chart-series-1)" strokeOpacity={0.32} strokeWidth={2} />}
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 12 · card frame                                                     */
/* ------------------------------------------------------------------ */
export function ChartCard({
  title,
  icon,
  legend,
  aside,
  children,
  tall,
  area,
}: {
  title: string;
  icon?: ReactNode;
  legend?: { label: string; color: string }[];
  aside?: ReactNode;
  children: ReactNode;
  tall?: boolean;
  /** explicit placement inside a bento grid: how many tracks wide / tall */
  area?: { col?: number; row?: number };
}) {
  return (
    <section
      className="hl-card"
      data-tall={tall || undefined}
      style={
        area
          ? { gridColumn: `span ${area.col ?? 3}`, gridRow: `span ${area.row ?? 1}` }
          : undefined
      }
    >
      <header className="hl-card__head">
        {icon && <span className="hl-card__icon">{icon}</span>}
        <h3>{title}</h3>
        {legend && (
          <ul className="hl-legend">
            {legend.map((l) => (
              <li key={l.label}>
                <i style={{ background: l.color }} />
                {l.label}
              </li>
            ))}
          </ul>
        )}
        {aside}
        <button className="hl-dots" type="button" aria-label={`More options for ${title}`}>
          ···
        </button>
      </header>
      <div className="hl-card__body">{children}</div>
    </section>
  );
}

/* ================================================================== */
/* 13 · radial bars — concentric arcs, one per series                   */
/* ================================================================== */
export function RadialBars({
  rows,
  size = 210,
  thickness = 13,
  gap = 8,
}: {
  rows: { label: string; value: number; max: number; color: string }[];
  size?: number;
  thickness?: number;
  gap?: number;
}) {
  const r = size / 2 - thickness / 2 - 3;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="hl-radial" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radial progress">
        {rows.map((row, i) => {
          const frac = Math.max(0, Math.min(1, row.value / row.max));
          // one equal slot per row; the arc fills its own slot by the value
          const slot = c / rows.length;
          return (
            <g key={row.label} transform={`rotate(${(i * 360) / rows.length - 90} ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={INK.idle} strokeWidth={thickness} strokeLinecap="round"
                strokeDasharray={`${Math.max(0, slot - gap)} ${c}`}
              />
              <circle
                cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={row.color} strokeWidth={thickness} strokeLinecap="round"
                strokeDasharray={`${Math.max(0, frac * slot - gap)} ${c}`}
                className="hl-radial__arc"
              />
            </g>
          );
        })}
      </svg>
      <div className="hl-radial__key">
        {rows.map((row) => (
          <span key={row.label}>
            <i style={{ background: row.color }} />
            <b className="tnum">{row.value}</b>
            {row.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* 14 · radial gauge — 270° sweep, tick ring, needle                  */
/* ================================================================== */
export function RadialGauge({
  pct,
  centre,
  sub,
  ticks = 40,
  size = 200,
  color = INK.s1,
}: {
  pct: number;
  centre: string;
  sub: string;
  ticks?: number;
  size?: number;
  color?: string;
}) {
  const SWEEP = 270;
  const START = 135;
  const w = size;
  const h = size * 0.84;
  const cx = w / 2;
  const cy = size / 2;
  const r = size / 2 - 22;
  const polar = (deg: number, rad: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)] as const;
  };
  const angle = START + (pct / 100) * SWEEP;
  const [nx, ny] = polar(angle, r - 16);
  return (
    <div className="hl-rgauge" style={{ width: w, height: h }}>
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} role="img" aria-label={`${pct}%`}>
        {Array.from({ length: ticks }, (_, i) => {
          const deg = START + (i / (ticks - 1)) * SWEEP;
          const on = ((i / (ticks - 1)) * 100) <= pct;
          const [x1, y1] = polar(deg, r);
          const [x2, y2] = polar(deg, r - 8);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={on ? color : INK.idle}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          );
        })}
        <line
          x1={cx} y1={cy} x2={nx} y2={ny}
          stroke="var(--color-text)" strokeWidth={2.2} strokeLinecap="round"
          className="hl-rgauge__needle"
        />
        <circle cx={cx} cy={cy} r={5.5} fill="var(--color-text)" />
      </svg>
      <div className="hl-rgauge__readout">
        <strong className="tnum">{centre}</strong>
        <span>{sub}</span>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 15 · heat map — intensity grid with a hover readout                */
/* ================================================================== */
export function HeatMap({
  rows,
  cols,
  values,
  format = (v: number) => String(v),
  color = "var(--chart-series-1)",
}: {
  rows: string[];
  cols: string[];
  values: number[][];
  format?: (v: number) => string;
  color?: string;
}) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const flat = values.flat();
  const max = Math.max(...flat, 1);
  const min = Math.min(...flat, 0);
  return (
    <div className="hl-heat">
      <div className="hl-heat__grid" style={{ gridTemplateColumns: `48px repeat(${cols.length}, minmax(0, 1fr))` }}>
        <span />
        {cols.map((c) => (
          <span className="hl-heat__axis" key={c}>{c}</span>
        ))}
        {rows.map((r, ri) => (
          <FragmentRow
            key={r}
            label={r}
            ri={ri}
            cols={cols}
            values={values}
            min={min}
            max={max}
            color={color}
            hover={hover}
            setHover={setHover}
          />
        ))}
      </div>
      {hover && (
        <span className="hl-heat__readout tnum">
          {rows[hover.r]} · {cols[hover.c]} — <b>{format(values[hover.r][hover.c])}</b>
        </span>
      )}
    </div>
  );
}

function FragmentRow({
  label, ri, cols, values, min, max, color, hover, setHover,
}: {
  label: string; ri: number; cols: string[]; values: number[][];
  min: number; max: number; color: string;
  hover: { r: number; c: number } | null;
  setHover: (v: { r: number; c: number } | null) => void;
}) {
  return (
    <>
      <span className="hl-heat__axis">{label}</span>
      {cols.map((c, ci) => {
        const v = values[ri][ci];
        const t = (v - min) / (max - min || 1);
        const on = hover?.r === ri && hover?.c === ci;
        return (
          <span
            key={c}
            className="hl-heat__cell"
            data-on={on || undefined}
            style={{ background: `color-mix(in srgb, ${color} ${Math.round(12 + t * 78)}%, transparent)` }}
            onMouseEnter={() => setHover({ r: ri, c: ci })}
            onMouseLeave={() => setHover(null)}
          />
        );
      })}
    </>
  );
}

/* ================================================================== */
/* 16 · tree map — squarified rectangles sized by value               */
/* ================================================================== */
export interface TreeNode { label: string; value: number; color: string; fg?: string }

export function TreeMap({ nodes, height = 230 }: { nodes: TreeNode[]; height?: number }) {
  const [hover, setHover] = useState<TreeNode | null>(null);
  // keep the canvas near 3:2 — a tall narrow slot squashes the squarify
  const W = 420;
  const H = height;
  const rects = squarify(nodes, 0, 0, W, H);
  return (
    <div className="hl-treemap">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Share by segment">
        {rects.map((r, i) => (
          <g key={r.node.label + i} onMouseEnter={() => setHover(r.node)} onMouseLeave={() => setHover(null)}>
            <rect
              x={r.x + 2}
              y={r.y + 2}
              width={Math.max(0, r.w - 4)}
              height={Math.max(0, r.h - 4)}
              rx={6}
              fill={r.node.color}
              opacity={hover && hover.label !== r.node.label ? 0.4 : 1}
            />
            {r.w > 62 && r.h > 28 && (
              <text
                x={r.x + 11}
                y={r.y + 22}
                className="hl-treemap__label"
                style={{ fill: r.node.fg ?? "var(--color-primary-fg)" }}
              >
                {r.node.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      {hover && (
        <span className="hl-treemap__readout">
          {hover.label} · <b className="tnum">{hover.value}%</b>
        </span>
      )}
    </div>
  );
}

/** Squarified treemap (Bruls, Huizing & van Wijk): lay out rows greedily,
 *  each row minimising the worst cell aspect ratio. A treemap only means
 *  something if the AREA is honest, so the layout is never stretched. */
function squarify(
  nodes: TreeNode[],
  x: number,
  y: number,
  w: number,
  h: number
): { node: TreeNode; x: number; y: number; w: number; h: number }[] {
  const out: { node: TreeNode; x: number; y: number; w: number; h: number }[] = [];
  const sorted = [...nodes].sort((a, b) => b.value - a.value);
  let cx = x;
  let cy = y;
  let cw = w;
  let ch = h;
  let i = 0;
  let remaining = sorted.reduce((a, n) => a + n.value, 0) || 1;

  const thicknessOf = (sum: number, horizontal: boolean) =>
    (sum * cw * ch) / (remaining * (horizontal ? cw : ch));
  const ratioOf = (vals: number[], horizontal: boolean) => {
    const sum = vals.reduce((a, b) => a + b, 0);
    if (sum <= 0) return Infinity;
    const t = thicknessOf(sum, horizontal);
    let worst = 0;
    for (const v of vals) {
      const len = (v / sum) * (horizontal ? cw : ch);
      worst = Math.max(worst, len / t, t / len);
    }
    return worst;
  };

  while (i < sorted.length && cw > 1 && ch > 1) {
    const horizontal = cw >= ch;
    const row: TreeNode[] = [];
    while (i < sorted.length) {
      const cand = [...row.map((r) => r.value), sorted[i].value];
      if (row.length && ratioOf(cand, horizontal) > ratioOf(row.map((r) => r.value), horizontal)) break;
      row.push(sorted[i]);
      i++;
    }
    const sum = row.reduce((a, r) => a + r.value, 0);
    const t = thicknessOf(sum, horizontal);
    let off = 0;
    for (const node of row) {
      const len = (node.value / sum) * (horizontal ? cw : ch);
      out.push(
        horizontal
          ? { node, x: cx + off, y: cy, w: len, h: t }
          : { node, x: cx, y: cy + off, w: t, h: len }
      );
      off += len;
    }
    if (horizontal) {
      cy += t;
      ch -= t;
    } else {
      cx += t;
      cw -= t;
    }
    remaining -= sum;
  }
  return out;
}

/* ================================================================== */
/* 17 · radar chart — polygon grid with one series                    */
/* ================================================================== */
export function RadarChart({
  axes,
  series,
  size = 230,
  color = INK.s1,
  max = 100,
}: {
  axes: string[];
  series: number[];
  size?: number;
  color?: string;
  max?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 34;
  const pt = (i: number, v: number) => {
    const a = ((i / axes.length) * 360 - 90) * (Math.PI / 180);
    const rad = (v / max) * r;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)] as const;
  };
  const poly = series.map((v, i) => pt(i, v).join(",")).join(" ");
  return (
    <svg className="hl-radar" viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Radar chart">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={axes.map((_, i) => pt(i, max * f).join(",")).join(" ")} fill="none" stroke={INK.grid} strokeWidth={1} />
      ))}
      {axes.map((_, i) => {
        const [x, y] = pt(i, max);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={INK.grid} strokeWidth={1} />;
      })}
      <polygon points={poly} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} strokeLinejoin="round" className="hl-radar__poly" />
      {series.map((v, i) => {
        const [x, y] = pt(i, v);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={hover === i ? 6 : 3.5}
            fill={color}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ transition: "r 120ms var(--ease-emphasized)" }}
          />
        );
      })}
      {axes.map((a, i) => {
        const [x, y] = pt(i, max * 1.18);
        return (
          <text key={a} x={x} y={y} className="hl-radar__label" textAnchor="middle" dominantBaseline="middle">
            {a}
          </text>
        );
      })}
      {hover !== null && (
        <text x={cx} y={size - 2} className="hl-radar__readout" textAnchor="middle">
          {axes[hover]} · {series[hover]}
        </text>
      )}
    </svg>
  );
}

/* ================================================================== */
/* 18 · count-up number — entrance animation for every figure         */
/* ================================================================== */
export function CountUp({
  value,
  decimals = 0,
  duration = 900,
  suffix = "",
}: {
  value: number;
  decimals?: number;
  duration?: number;
  suffix?: string;
}) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <>
      {shown.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </>
  );
}
