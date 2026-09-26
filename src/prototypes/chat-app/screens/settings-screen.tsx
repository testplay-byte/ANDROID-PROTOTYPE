"use client";

/**
 * chat-app / screens / settings-screen — flat settings.
 *
 * Profile row + theme toggle (useDeviceTheme) + notification & read
 * receipt toggles. All flat: NO shadows anywhere — structure comes from
 * --color-surface-* tones and the bold teal accent.
 */
import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { CURRENT_USER } from "../lib/data";
import { FlatSwitch } from "../components/flat-switch";
import styles from "./settings-screen.module.css";

interface SettingsScreenProps {
  active: boolean;
}

export function SettingsScreen({ active }: SettingsScreenProps) {
  const { theme, setTheme } = useDeviceTheme();
  const [notifications, setNotifications] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="settings"
      aria-label="Settings"
      aria-hidden={!active}
    >
      <TopBar variant="inline" title="Settings" subtitle="Preferences" />
      <div className={styles.content}>
        {/* Profile row */}
        <button type="button" className={styles.profileRow}>
          <span className={styles.profileAvatar} aria-hidden="true">
            {CURRENT_USER[0]}
          </span>
          <span className={styles.profileInfo}>
            <span className={styles.profileName}>{CURRENT_USER} Morgan</span>
            <span className={styles.profileDesc}>
              Available · {CURRENT_USER.toLowerCase()}@chatmail.com
            </span>
          </span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.chevron}
            aria-hidden="true"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Appearance */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Appearance</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Theme</span>
                <span className={styles.rowDesc}>Light or dark mode</span>
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Chat</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Notifications</span>
                <span className={styles.rowDesc}>Message alerts and sounds</span>
              </div>
              <FlatSwitch
                on={notifications}
                onChange={setNotifications}
                label="Notifications"
              />
            </div>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Read receipts</span>
                <span className={styles.rowDesc}>
                  Let contacts know when you've read a message
                </span>
              </div>
              <FlatSwitch
                on={readReceipts}
                onChange={setReadReceipts}
                label="Read receipts"
              />
            </div>
          </div>
        </div>

        <p className={styles.version}>Chat App · Flat Design 2.0</p>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Theme toggle — flat segmented Light/Dark control (no shadows).
// ---------------------------------------------------------------------------

function ThemeToggle({
  theme,
  onChange,
}: {
  theme: AppTheme;
  onChange: (t: AppTheme) => void;
}) {
  return (
    <div className={styles.themeToggle} role="group" aria-label="Theme">
      <button
        type="button"
        className={`${styles.themeBtn} ${theme === "light" ? styles.themeBtnActive : ""}`}
        onClick={() => onChange("light")}
        aria-pressed={theme === "light"}
      >
        <svg
          width="15"
          height="15"
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
        Light
      </button>
      <button
        type="button"
        className={`${styles.themeBtn} ${theme === "dark" ? styles.themeBtnActive : ""}`}
        onClick={() => onChange("dark")}
        aria-pressed={theme === "dark"}
      >
        <svg
          width="15"
          height="15"
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
        Dark
      </button>
    </div>
  );
}
