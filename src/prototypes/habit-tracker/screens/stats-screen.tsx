"use client";

/**
 * StatsScreen — 7-column weekly grid per habit (filled square = done,
 * hairline square = missed, faint square = future day). Big completion
 * percentage + best-streak stat. Monochrome heatmap, no color.
 */

import { TopBar } from "../../../proto-kit";
import { weekStats, weekDayLabels } from "../lib/stats";
import type { Habit, WeekStart } from "../lib/types";
import styles from "./stats-screen.module.css";

export function StatsScreen({
  habits,
  weekStart,
}: {
  habits: Habit[];
  weekStart: WeekStart;
}) {
  const { done, possible, pct, bestStreak, keys, todayIdx } = weekStats(
    habits,
    weekStart
  );
  const labels = weekDayLabels(weekStart);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Stats" subtitle="This week" />

      <div className={styles.content}>
        <div>
          <span className={styles.bigPct}>{pct}</span>
          <span className={styles.bigPctSign}>%</span>
          <p className={styles.bigCaption}>
            {done} of {possible} possible checks so far
          </p>

          <div className={styles.statRow}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{bestStreak}</span>
              <span className={styles.statLabel}>Best streak (days)</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{habits.length}</span>
              <span className={styles.statLabel}>Active habits</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionLabel}>Weekly grid</h2>

          <div className={styles.dayHead} aria-hidden="true">
            <span />
            {labels.map((l, i) => (
              <span key={`${l}-${i}`} className={styles.dayHeadCell}>
                {l}
              </span>
            ))}
          </div>

          {habits.map((h) => (
            <div key={h.id} className={styles.weekRow}>
              <span className={styles.weekName}>{h.name}</span>
              {keys.map((k, i) => {
                const isDone = !!h.history[k];
                const isFuture = i > todayIdx;
                return (
                  <span
                    key={k}
                    className={[
                      styles.cell,
                      isDone
                        ? styles.cellDone
                        : isFuture
                          ? styles.cellFuture
                          : styles.cellMissed,
                    ].join(" ")}
                    title={`${h.name} — ${k}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
