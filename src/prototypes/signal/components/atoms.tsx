"use client";

/**
 * signal / components / atoms — the shared console vocabulary.
 *
 * Console is an INSTRUMENT language, so the atoms are deliberately plain:
 * hairline-ruled panels on squared surfaces, tabular numerals everywhere, and
 * a legend / unit / value readout that every chart is required to carry.
 * Colour comes only from tokens — the atoms never name a hue.
 */

import type { ReactNode } from "react";
import { fmtDelta } from "../data";

/* ------------------------------------------------------------------ *
 * Sparkline
 * ------------------------------------------------------------------ */
/**
 * The one chart primitive small enough to live with the atoms — and it
 * LIVES here on purpose: `charts.tsx` needs the legend + readout atoms, so
 * putting Sparkline in charts.tsx would make the two modules import each
 * other. charts.tsx re-exports it, so screens can import either path.
 *
 * `preserveAspectRatio="none"` is correct here and nowhere else: a sparkline
 * has no axes to distort, and it must fill whatever card width it is given.
 */
export function Sparkline({
  values,
  series = 1,
  height = 30,
  area = true,
}: {
  values: number[];
  /** 1..5 → --chart-series-N */
  series?: number;
  height?: number;
  area?: boolean;
}) {
  const W = 100;
  const H = 32;
  const path = (() => {
    if (values.length < 2) return "";
    const max = Math.max(...values);
    const min = Math.min(...values);
    const span = max - min || 1;
    return values
      .map((v, i) => {
        const x = (i / (values.length - 1)) * W;
        const y = H - 2 - ((v - min) / span) * (H - 5);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  })();

  if (!path) return <svg className="sig-sparkline" viewBox={`0 0 ${W} ${H}`} style={{ height }} aria-hidden="true" />;

  return (
    <svg
      className="sig-sparkline"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ height }}
      data-series={series}
      aria-hidden="true"
    >
      {area && <path d={`${path} L${W} ${H} L0 ${H} Z`} className="sig-sparkline__area" />}
      <path d={path} className="sig-sparkline__line sig-draw" pathLength={1} />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Panel — the only container primitive. A hairline border, no shadow.
 * ------------------------------------------------------------------ */
export function Panel({
  children,
  className = "",
  tone,
  ...rest
}: { children: ReactNode; className?: string; tone?: "quiet" } & React.HTMLAttributes<HTMLElement>) {
  return (
    <section className={`sig-panel ${className}`} data-tone={tone} {...rest}>
      {children}
    </section>
  );
}

export function PanelHead({
  title,
  unit,
  right,
  sub,
}: {
  title: string;
  /** the measurement unit, always shown next to the title */
  unit?: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sig-panel__head">
      <div className="sig-panel__id">
        <h2>{title}</h2>
        {unit && <span className="sig-unit">{unit}</span>}
        {sub && <p className="sig-panel__sub">{sub}</p>}
      </div>
      {right && <div className="sig-panel__right">{right}</div>}
    </header>
  );
}

/* ------------------------------------------------------------------ *
 * Legend — required whenever a chart draws more than one series.
 * ------------------------------------------------------------------ */
export interface LegendEntry {
  label: string;
  /** 1..5 → --chart-series-N */
  series?: number;
  /** extra visual: a filled swatch instead of a stroke */
  fill?: boolean;
  value?: string;
  tone?: "ok" | "warn" | "bad" | "mute";
}

export function Legend({ items }: { items: LegendEntry[] }) {
  return (
    <ul className="sig-legend">
      {items.map((it) => (
        <li key={it.label} data-tone={it.tone ?? "mute"}>
          <i className="sig-legend__key" data-series={it.series} data-fill={it.fill || undefined} aria-hidden="true" />
          <span className="sig-legend__label">{it.label}</span>
          {it.value && <b className="sig-legend__value tnum">{it.value}</b>}
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ *
 * Readout — the value a chart is currently reporting.
 * ------------------------------------------------------------------ */
export function Readout({
  items,
  note,
}: {
  items: { label: string; value: string; series?: number; delta?: string; tone?: "ok" | "bad" | "mute" }[];
  note?: string;
}) {
  return (
    <div className="sig-readout">
      {items.map((it) => (
        <div key={it.label} className="sig-readout__cell" data-tone={it.tone ?? "mute"}>
          <span className="sig-readout__label">
            {it.series ? <i className="sig-legend__key" data-series={it.series} aria-hidden="true" /> : null}
            {it.label}
          </span>
          <b className="sig-readout__value tnum">{it.value}</b>
          {it.delta && <span className="sig-readout__delta tnum">{it.delta}</span>}
        </div>
      ))}
      {note && <p className="sig-readout__note">{note}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * StatCard — a KPI with a delta and a sparkline.
 * ------------------------------------------------------------------ */
export function StatCard({
  label,
  unit,
  value,
  delta,
  spark,
  inverse,
  series = 1,
}: {
  label: string;
  unit: string;
  value: string;
  /** signed percentage change — NUMERIC, so the tone and arrow are honest */
  delta: number;
  spark: number[];
  /** a falling number is good news (latency) */
  inverse?: boolean;
  series?: number;
}) {
  const good = inverse ? delta <= 0 : delta >= 0;
  return (
    <article className="sig-stat">
      <header className="sig-stat__head">
        <span className="sig-stat__label">{label}</span>
        <span className="sig-stat__delta tnum" data-tone={good ? "ok" : "bad"}>
          <i aria-hidden="true" className="sig-stat__arrow" data-dir={delta >= 0 ? "up" : "down"} />
          {fmtDelta(delta)}
        </span>
      </header>
      <strong className="sig-stat__value tnum">{value}</strong>
      <span className="sig-stat__unit">{unit}</span>
      <div className="sig-stat__spark">
        <Sparkline values={spark} series={series} />
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ *
 * Controls
 * ------------------------------------------------------------------ */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  compact,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  compact?: boolean;
}) {
  return (
    <div className={`sig-seg ${compact ? "sig-seg--compact" : ""}`} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`sig-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Chip({
  on,
  onClick,
  children,
  count,
}: {
  on?: boolean;
  onClick?: () => void;
  children: ReactNode;
  count?: number;
}) {
  return (
    <button type="button" className={`sig-chip ${on ? "is-on" : ""}`} aria-pressed={!!on} onClick={onClick}>
      {children}
      {count !== undefined && <b className="sig-chip__count tnum">{count}</b>}
    </button>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "solid" | "danger";
  title?: string;
}) {
  return (
    <button type="button" className={`sig-btn sig-btn--${variant}`} onClick={onClick} title={title}>
      {children}
    </button>
  );
}

export function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`sig-toggle ${on ? "is-on" : ""}`}
      onClick={() => onChange(!on)}
    >
      <span className="sig-toggle__track" aria-hidden="true">
        <span className="sig-toggle__knob" />
      </span>
    </button>
  );
}

/** A hairline meter — the console replacement for a progress bar. */
export function Meter({ value, tone }: { value: number; tone?: "ok" | "warn" | "bad" }) {
  return (
    <span className="sig-meter" role="img" aria-label={`${Math.round(value * 100)} percent`}>
      <i style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} data-tone={tone} />
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="sig-kbd">{children}</kbd>;
}

/* ------------------------------------------------------------------ *
 * Small shared bits
 * ------------------------------------------------------------------ */
export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const rounded = Math.abs(value) < 10 ? value.toFixed(2) : value.toFixed(1);
  return (
    <span className="sig-delta tnum" data-tone={value >= 0 ? "ok" : "bad"}>
      {value >= 0 ? "+" : "−"}
      {rounded}
      {suffix}
    </span>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="sig-empty">{children}</p>;
}
