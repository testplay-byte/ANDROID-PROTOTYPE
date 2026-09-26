"use client";

/**
 * SettingsScreen — theme toggle (useDeviceTheme), notifications switch,
 * currency segmented control (USD/EUR/GBP via lib/currency.ts).
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { BrutalSwitch } from "../components/brutal-switch";
import { CURRENCIES } from "../lib/currency";
import type { Currency } from "../lib/currency";
import styles from "./settings-screen.module.css";

export function SettingsScreen({
  currency,
  onCurrency,
}: {
  currency: Currency;
  onCurrency: (c: Currency) => void;
}) {
  const { theme, setTheme } = useDeviceTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="SETTINGS" subtitle="DROP 07 — STORE APP" />

      <div className={styles.content}>
        {/* Appearance */}
        <span className={styles.groupLabel}>APPEARANCE</span>
        <div className={styles.group}>
          <span className={styles.groupTitle}>Theme</span>
          <div className={styles.segmented}>
            <button
              type="button"
              className={`${styles.segmentBtn} ${theme === "light" ? styles.segmentBtnActive : ""}`}
              onClick={() => setTheme("light" as AppTheme)}
              aria-pressed={theme === "light"}
            >
              LIGHT
            </button>
            <button
              type="button"
              className={`${styles.segmentBtn} ${theme === "dark" ? styles.segmentBtnActive : ""}`}
              onClick={() => setTheme("dark" as AppTheme)}
              aria-pressed={theme === "dark"}
            >
              DARK
            </button>
          </div>
        </div>

        {/* Notifications */}
        <span className={styles.groupLabel}>NOTIFICATIONS</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Drop alerts</span>
              <span className={styles.rowDesc}>Ping me when a new drop goes live</span>
            </div>
            <BrutalSwitch
              on={notifications}
              onToggle={() => setNotifications((v) => !v)}
              label="Drop alerts"
            />
          </div>
        </div>

        {/* Currency */}
        <span className={styles.groupLabel}>CURRENCY</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Display currency</span>
              <span className={styles.rowDesc}>Prices convert instantly across the store</span>
            </div>
          </div>
          <div className={styles.segmented}>
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.segmentBtn} ${currency === c ? styles.segmentBtnActive : ""}`}
                onClick={() => onCurrency(c)}
                aria-pressed={currency === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <span className={styles.groupLabel}>ABOUT</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>DROP 07 Store</span>
              <span className={styles.rowDesc}>v1.0 · Neo-brutalism · mock catalog</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
