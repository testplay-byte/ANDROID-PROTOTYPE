"use client";

/**
 * kids-learning / screens / settings-screen — kid-friendly settings.
 *
 * - Kid profile row (puffy avatar circle + name)
 * - Theme toggle (uses useDeviceTheme from proto-kit)
 * - Sound effects toggle (puffy switch, local state)
 * - Reset stars button with a two-tap confirm state
 */
import { useEffect, useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { KID_NAME } from "../lib/data";
import { ClaySwitch } from "../components/clay-switch";
import styles from "./settings-screen.module.css";

interface SettingsScreenProps {
  active: boolean;
  onResetStars: () => void;
}

export function SettingsScreen({ active, onResetStars }: SettingsScreenProps) {
  const { theme, setTheme } = useDeviceTheme();
  const [soundOn, setSoundOn] = useState(true);
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Auto-cancel the confirm state after a few seconds.
  useEffect(() => {
    if (!confirmingReset) return;
    const t = window.setTimeout(() => setConfirmingReset(false), 3000);
    return () => window.clearTimeout(t);
  }, [confirmingReset]);

  function handleReset() {
    if (confirmingReset) {
      onResetStars();
      setConfirmingReset(false);
    } else {
      setConfirmingReset(true);
    }
  }

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="settings"
      aria-label="Settings"
      aria-hidden={!active}
    >
      <TopBar variant="hero" title="SETTINGS" subtitle={`GROWN-UPS ONLY`} />
      <div className={styles.content}>
        {/* Kid profile */}
        <div className={styles.profileCard}>
          <span className={styles.avatar} aria-hidden="true">
            {KID_NAME[0]}
          </span>
          <span className={styles.profileInfo}>
            <span className={styles.profileName}>{KID_NAME}</span>
            <span className={styles.profileDesc}>Age 5 · Preschool star</span>
          </span>
        </div>

        {/* Appearance */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Look &amp; Feel</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Night mode</span>
                <span className={styles.rowDesc}>Easier on sleepy eyes</span>
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Sound effects</span>
                <span className={styles.rowDesc}>Fun sounds while playing</span>
              </div>
              <ClaySwitch on={soundOn} onChange={setSoundOn} label="Sound effects" />
            </div>
          </div>
        </div>

        {/* Data */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Progress</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Reset stars</span>
                <span className={styles.rowDesc}>
                  {confirmingReset
                    ? "Tap again to erase all stars!"
                    : "Start fresh with zero stars"}
                </span>
              </div>
              <button
                type="button"
                className={`${styles.resetButton} ${confirmingReset ? styles.resetButtonConfirm : ""}`}
                onClick={handleReset}
              >
                {confirmingReset ? "Sure?" : "Reset"}
              </button>
            </div>
          </div>
        </div>

        <p className={styles.version}>Kids Learning · made with love</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Theme toggle — puffy segmented Dark/Light pill.
// ---------------------------------------------------------------------------

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: AppTheme;
  onChange: (t: AppTheme) => void;
}) {
  return (
    <div className={styles.themeToggle}>
      <button
        type="button"
        className={`${styles.themeBtn} ${theme === "dark" ? styles.themeBtnActive : ""}`}
        onClick={() => onChange("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Dark theme"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.themeBtn} ${theme === "light" ? styles.themeBtnActive : ""}`}
        onClick={() => onChange("light")}
        aria-pressed={theme === "light"}
        aria-label="Light theme"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      </button>
    </div>
  );
}
