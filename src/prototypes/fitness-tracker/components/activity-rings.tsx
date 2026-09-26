"use client";

/**
 * ActivityRings — three concentric SVG rings (move / exercise / stand)
 * drawn with stroke-dasharray. Move uses --color-primary (iOS blue),
 * exercise --color-success, stand --color-warn. Rounded caps, and each
 * ring gets its own subtle track (its color at ~20% over the canvas)
 * the way Apple Fitness renders unfilled ring segments.
 */

export interface RingValues {
  move: number;
  moveGoal: number;
  exercise: number;
  exerciseGoal: number;
  stand: number;
  standGoal: number;
}

const RINGS = [
  { key: "move", color: "var(--color-primary)", width: 11 },
  { key: "exercise", color: "var(--color-success)", width: 11 },
  { key: "stand", color: "var(--color-warn)", width: 11 },
] as const;

function pct(value: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(1, value / goal);
}

export function ActivityRings({
  values,
  size = 180,
}: {
  values: RingValues;
  size?: number;
}) {
  const pcts = [
    pct(values.move, values.moveGoal),
    pct(values.exercise, values.exerciseGoal),
    pct(values.stand, values.standGoal),
  ];

  const radii = [78, 61, 44];
  const center = 90;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      role="img"
      aria-label={`Move ${Math.round(pcts[0] * 100)}%, exercise ${Math.round(pcts[1] * 100)}%, stand ${Math.round(pcts[2] * 100)}%`}
    >
      {RINGS.map((ring, i) => {
        const r = radii[i];
        const c = 2 * Math.PI * r;
        const p = pcts[i];
        return (
          <g key={ring.key}>
            {/* Subtle per-ring track (the ring's own color, ~20%) */}
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={`color-mix(in srgb, ${ring.color} 22%, transparent)`}
              strokeWidth={ring.width}
            />
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={ring.color}
              strokeWidth={ring.width}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - p)}
              transform={`rotate(-90 ${center} ${center})`}
              style={{ transition: "stroke-dashoffset 600ms var(--ios-ease)" }}
            />
          </g>
        );
      })}
    </svg>
  );
}
