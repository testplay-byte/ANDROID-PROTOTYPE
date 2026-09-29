/**
 * mochi / components / sparkline — the 30-day spending trace.
 *
 * Pure geometry over a fixed array: no randomness, no clock. The area is
 * the only fill in Mochi (clay is a solid material everywhere else), and
 * the last point is the day you are actually looking at.
 */

import { money } from "../data";

const W = 300;
const H = 96;

export function SpendSpark({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const step = W / (values.length - 1);
  const pts = values.map((v, i) => `${(i * step).toFixed(2)},${(H - (v / max) * (H - 8) - 4).toFixed(2)}`);
  const area = `0,${H} ${pts.join(" ")} ${W},${H}`;
  const lastX = (W - step).toFixed(2);
  const lastY = (H - (values[values.length - 1] / max) * (H - 8) - 4).toFixed(2);
  const peakIdx = values.indexOf(Math.max(...values));
  const peakX = (peakIdx * step).toFixed(2);
  const peakY = (H - (values[peakIdx] / max) * (H - 8) - 4).toFixed(2);

  return (
    <div className="mch-spark">
      <svg className="mch-spark__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Daily spend over the last 30 days">
        <polygon points={area} className="mch-spark__area" />
        <polyline points={pts.join(" ")} className="mch-spark__line" />
        <circle cx={peakX} cy={peakY} r="3.4" className="mch-spark__peak" />
        <circle cx={lastX} cy={lastY} r="3.4" className="mch-spark__now" />
      </svg>
      <div className="mch-spark__axis" aria-hidden="true">
        <span>31 Aug</span>
        <span className="mch-spark__peak-label tnum">peak {money(values[peakIdx])}</span>
        <span>29 Sep</span>
      </div>
    </div>
  );
}
