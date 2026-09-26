"use client";

/**
 * TodayScreen — big day-progress ring + hairline habit checklist.
 * Tapping the circular check fills it with ink and bumps the streak
 * (pop animation); unchecking decrements it.
 */

import { TopBar } from "../../../proto-kit";
import { ProgressRing } from "../components/progress-ring";
import { HabitIcon } from "../components/habit-icon";
import { todayProgress } from "../lib/stats";
import { todayKey } from "../lib/data";
import type { Habit } from "../lib/types";
import styles from "./today-screen.module.css";

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function TodayScreen({
  habits,
  onToggle,
}: {
  habits: Habit[];
  onToggle: (id: number) => void;
}) {
  const key = todayKey();
  const prog = todayProgress(habits);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Today" subtitle={formatToday()} />

      <div className={styles.content}>
        <div className={styles.ringWrap}>
          <ProgressRing pct={prog.pct} done={prog.done} total={prog.total} />
        </div>

        {habits.length === 0 ? (
          <p className={styles.empty}>No habits yet — add one in Habits.</p>
        ) : (
          <ul className={styles.list}>
            {habits.map((h) => {
              const done = !!h.history[key];
              return (
                <li
                  key={h.id}
                  className={`${styles.row} ${done ? styles.rowDone : ""}`}
                >
                  <span className={styles.icon}>
                    <HabitIcon icon={h.icon} size={20} />
                  </span>
                  <span className={styles.name}>{h.name}</span>
                  <span className={styles.streakBox}>
                    {/* key={h.streak} remounts the number → pop animation */}
                    <span key={h.streak} className={styles.streak}>
                      {h.streak}
                    </span>
                    <span className={styles.streakLabel}>
                      {h.streak === 1 ? "day" : "days"}
                    </span>
                  </span>
                  <button
                    type="button"
                    className={`${styles.check} ${done ? styles.checkDone : ""}`}
                    aria-pressed={done}
                    aria-label={done ? `Uncheck ${h.name}` : `Check ${h.name}`}
                    onClick={() => onToggle(h.id)}
                  >
                    {done ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m6 12.5 4 4 8-9" />
                      </svg>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
