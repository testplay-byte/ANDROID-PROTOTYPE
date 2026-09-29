/**
 * atelier / components / geometry — the only "imagery" in this prototype.
 *
 * A Bauhaus studio has no photographs: a project is identified by a PLATE of
 * primitives, and a person by the mark of their discipline. Both are drawn
 * here as inline SVG from the token layer — `currentColor` and the tone
 * classes (which atelier.css wires to --color-primary / -secondary /
 * -tertiary / --color-outline / --color-surface-1). There is not one hex
 * value and not one bitmap in the file.
 */

import type { Maker, PlateShape, ShapeKind, Tone } from "../data";
import { loadPct } from "../data";

/** One primitive, positioned in 0–100 plate units. */
function Primitive({ s }: { s: PlateShape }) {
  const x = s.x;
  const y = s.y;
  const h = s.s / 2;
  switch (s.kind) {
    case "circle":
      return <circle className={`atl-geo atl-geo--${s.tone}`} cx={x} cy={y} r={h} />;
    case "square":
      return <rect className={`atl-geo atl-geo--${s.tone}`} x={x - h} y={y - h} width={s.s} height={s.s} />;
    case "triangle":
      return (
        <polygon
          className={`atl-geo atl-geo--${s.tone}`}
          points={`${x},${y - h} ${x + h},${y + h} ${x - h},${y + h}`}
        />
      );
    case "half":
      return (
        <path
          className={`atl-geo atl-geo--${s.tone}`}
          d={`M${x - h},${y} A${h},${h} 0 0 1 ${x + h},${y} Z`}
        />
      );
    case "quarter":
      return (
        <path
          className={`atl-geo atl-geo--${s.tone}`}
          d={`M${x},${y - h} A${h},${h} 0 0 1 ${x + h},${y} Z`}
        />
      );
    case "bar":
    default:
      return (
        <rect
          className={`atl-geo atl-geo--${s.tone}`}
          x={x - s.s * 0.7}
          y={y - s.s * 0.16}
          width={s.s * 1.4}
          height={s.s * 0.32}
        />
      );
  }
}

/** The plate: a project's whole visual identity, in a square. */
export function Plate({ plate, className = "" }: { plate: PlateShape[]; className?: string }) {
  return (
    <svg className={`atl-plate ${className}`} viewBox="0 0 100 100" role="img" aria-label="Project plate" preserveAspectRatio="xMidYMid meet">
      {plate.map((s, i) => (
        <Primitive key={i} s={s} />
      ))}
    </svg>
  );
}

/** A single primitive used as an inline mark (cards, people, chips). */
export function Mark({ kind, tone, size = 16 }: { kind: ShapeKind; tone: Tone; size?: number }) {
  return (
    <svg className="atl-mark" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <Primitive s={{ kind, tone, x: 50, y: 50, s: 84 }} />
    </svg>
  );
}

/**
 * CapacityBar — booked vs free hours for one maker. A flat two-tone rule
 * with a hard edge: no gradient, no rounding, numerals on the right.
 */
export function CapacityBar({ maker, tone = "primary" }: { maker: Maker; tone?: Tone }) {
  const pct = loadPct(maker);
  const free = Math.max(0, maker.capacity - maker.booked);
  return (
    <div className="atl-cap">
      <div className="atl-cap__track" role="img" aria-label={`${pct}% booked`}>
        <span className={`atl-cap__booked atl-geo--${tone}`} style={{ width: `${pct}%` }} />
        <span className="atl-cap__free" style={{ width: `${100 - pct}%` }} />
      </div>
      <span className="atl-cap__pct tnum">{pct}%</span>
      <span className="atl-cap__hrs tnum">{free}h free</span>
    </div>
  );
}
