/**
 * mochi / components / atoms — the clay building blocks.
 *
 * Clay has three physical states and every control in Mochi is one of
 * them, which is why there are so few atoms:
 *
 *   raised   a puffy card that casts an ambient shadow (--mch-lift)
 *   pressed  a dough dent (--mch-press) — inputs, tracks, unselected pills
 *   floating something lifted off the card, e.g. the day-progress knob
 *
 * No borders anywhere: separation comes from the shadow recipe and the
 * surface ladder, never from a 1px outline.
 */

import type { ReactNode } from "react";
import type { Tone } from "../data";

/* ------------------------------------------------------------------ *
 * Card
 * ------------------------------------------------------------------ */

export function Card({
  title,
  sub,
  meta,
  action,
  tone,
  children,
  className = "",
}: {
  title?: string;
  sub?: string;
  meta?: ReactNode;
  action?: ReactNode;
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mch-card ${className}`} data-tone={tone}>
      {title && (
        <header className="mch-card__head">
          <div className="mch-card__heading">
            <h2>{title}</h2>
            {sub && <p>{sub}</p>}
          </div>
          {meta && <span className="mch-card__meta">{meta}</span>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Ring — the real spend/budget and habit-progress dials
 * ------------------------------------------------------------------ */

export function Ring({
  ratio,
  size = 128,
  stroke = 14,
  children,
  tone = "primary",
  label,
}: {
  ratio: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  tone?: Tone;
  label: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const safe = Math.max(0, Math.min(1, ratio));
  return (
    <div className="mch-ring" data-tone={tone} style={{ width: size }}>
      <svg
        className="mch-ring__svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={label}
      >
        <circle
          className="mch-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="mch-ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c.toFixed(2)}
          strokeDashoffset={(c * (1 - safe)).toFixed(2)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="mch-ring__centre">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Bar — a pressed dough track with a raised fill
 * ------------------------------------------------------------------ */

export function Bar({
  ratio,
  tone = "primary",
  height = 10,
  className = "",
}: {
  ratio: number;
  tone?: Tone;
  height?: number;
  className?: string;
}) {
  const safe = Math.max(0, Math.min(1, ratio));
  return (
    <span
      className={`mch-bar ${className}`}
      data-tone={tone}
      style={{ height }}
      role="presentation"
    >
      <span className="mch-bar__fill" style={{ width: `${(safe * 100).toFixed(1)}%` }} />
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Segmented — a pressed channel with a floating selected knob
 * ------------------------------------------------------------------ */

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  block = false,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  block?: boolean;
}) {
  return (
    <div className="mch-seg" role="radiogroup" aria-label={label} data-block={block || undefined}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          className={`mch-seg__btn ${value === o.id ? "is-on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Fact row — label on the left, value on the right (no rule between)
 * ------------------------------------------------------------------ */

export function Fact({ label, value, tone }: { label: string; value: ReactNode; tone?: Tone }) {
  return (
    <div className="mch-fact" data-tone={tone}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Check puck — the habit toggle
 * ------------------------------------------------------------------ */

export function CheckPuck({ on, tone = "primary" }: { on: boolean; tone?: Tone }) {
  return (
    <span className="mch-puck" data-on={on || undefined} data-tone={tone} aria-hidden="true">
      {on && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      )}
    </span>
  );
}
