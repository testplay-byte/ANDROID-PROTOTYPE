/**
 * ProgressRing — the big circular day-progress indicator on the Today
 * screen. Ink stroke on a hairline track; center shows the completion
 * percentage plus "done of total".
 */

import styles from "./progress-ring.module.css";

const SIZE = 176;
const R = 80;
const C = 2 * Math.PI * R;

export function ProgressRing({
  pct,
  done,
  total,
}: {
  pct: number;
  done: number;
  total: number;
}) {
  const offset = C * (1 - Math.min(100, Math.max(0, pct)) / 100);
  return (
    <div className={styles.ring}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle className={styles.track} cx={SIZE / 2} cy={SIZE / 2} r={R} />
        <circle
          className={styles.fill}
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          strokeDasharray={C}
          strokeDashoffset={offset}
        />
      </svg>
      <div className={styles.center}>
        <span>
          <span className={styles.pct}>{pct}</span>
          <span className={styles.pctSign}>%</span>
        </span>
        <span className={styles.caption}>
          {done} of {total} done
        </span>
      </div>
    </div>
  );
}
