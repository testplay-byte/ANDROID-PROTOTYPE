"use client";

/* progress-ring — circular moisture gauge.
   The arc = remaining hydration (full circle = happy, it drains as thirst
   grows; a parched plant keeps a red sliver). SVG stroke-dashoffset animates
   from empty to the current value on mount (emphasized-decel) — so the ring
   "fills in" on screen entrance and springs back to full after watering.
   Color follows the thirst bucket (--bl-thirst-* tokens: green → amber → red). */

import { useEffect, useState } from "react";
import { thirstState } from "../lib/data";

interface ProgressRingProps {
  /** 0-100 — 0 = freshly watered, 100 = parched */
  thirst: number;
  size?: number;
  stroke?: number;
  className?: string;
  /** re-mount key to replay the fill animation / spring pop */
  popKey?: string | number;
}

export function ProgressRing({ thirst, size = 40, stroke = 4, className, popKey }: ProgressRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const moisture = Math.min(100, Math.max(4, 100 - thirst)); // keep a visible sliver
  const target = c * (1 - moisture / 100);

  const [offset, setOffset] = useState(c);

  useEffect(() => {
    // animate in one frame after mount so the transition actually runs
    const id = requestAnimationFrame(() => setOffset(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  const state = thirstState(thirst);
  const cls =
    "bl-ring" +
    (className ? " " + className : "") +
    (state === "ok" ? "" : ` is-${state}`);

  return (
    <svg
      key={popKey}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cls}
      aria-hidden="true"
      focusable="false"
    >
      <circle
        className="bl-ring-track"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        fill="none"
      />
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        <circle
          className="bl-ring-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </g>
    </svg>
  );
}
