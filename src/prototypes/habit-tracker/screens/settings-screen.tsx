"use client";

/**
 * SettingsScreen — theme, week start, reminders, reset data.
 * Monochrome rows on hairline borders. Reset asks for a confirm step
 * before firing (destructive — the single allowed use of --color-error).
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import { MinimalSwitch } from "../components/minimal-switch";
import type { WeekStart } from "../lib/types";
import styles from "./settings-screen.module.css";

export function SettingsScreen({
  weekStart,
  reminders,
  onWeekStart,
  onReminders,
  onReset,
}: {
  weekStart: WeekStart;
  reminders: boolean;
  onWeekStart: (w: WeekStart) => void;
  onReminders: (v: boolean) => void;
  onReset: () => void;
}) {
  const { theme, toggleTheme } = useDeviceTheme();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Settings" subtitle="Preferences" />

      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Dark theme</span>
              <span className={styles.rowCaption}>
                {theme === "dark" ? "On" : "Off"} — ink on paper
              </span>
            </div>
            <MinimalSwitch
              on={theme === "dark"}
              onToggle={toggleTheme}
              label="Toggle dark theme"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Week starts on</span>
              <span className={styles.rowCaption}>Affects the Stats grid</span>
            </div>
            <div className={styles.segment} role="radiogroup" aria-label="Week starts on">
              {(["mon", "sun"] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  role="radio"
                  aria-checked={weekStart === w}
                  className={`${styles.segBtn} ${weekStart === w ? styles.segBtnActive : ""}`}
                  onClick={() => onWeekStart(w)}
                >
                  {w === "mon" ? "Mon" : "Sun"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Daily reminder</span>
              <span className={styles.rowCaption}>9:00 in the morning</span>
            </div>
            <MinimalSwitch
              on={reminders}
              onToggle={() => onReminders(!reminders)}
              label="Toggle daily reminder"
            />
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Reset data</span>
              <span className={styles.rowCaption}>
                Restore the sample habits
              </span>
            </div>
            {confirming ? (
              <div className={styles.confirm}>
                <button
                  type="button"
                  className={styles.confirmYes}
                  onClick={() => {
                    onReset();
                    setConfirming(false);
                  }}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className={styles.confirmNo}
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={() => setConfirming(true)}
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <p className={styles.footer}>Habit — a quiet daily practice.</p>
      </div>
    </div>
  );
}
