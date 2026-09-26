"use client";

/**
 * ActivityRings — three concentric SVG rings (move / exercise / stand)
 * drawn with stroke-dasharray. Move uses --color-primary (iOS blue),
 * exercise --color-success, stand --color-warn.
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
  { key: "move", color: "var(--color-primary)", width: 12 },
  { key: "exercise", color: "var(--color-success)", width: 12 },
  { key: "stand", color: "var(--color-warn)", width: 12 },
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

  const radii = [78, 60, 42];
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
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="var(--ring-track)"
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
              style={{ transition: "stroke-dashoffset var(--dur-4) var(--ease-emphasized-decel)" }}
            />
          </g>
        );
      })}
    </svg>
  );
}
