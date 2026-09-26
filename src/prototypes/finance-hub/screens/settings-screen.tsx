"use client";

/**
 * SettingsScreen — theme toggle, notification toggles (push/email/SMS),
 * language select. All in 0-radius bordered groups with Carbon-style
 * section labels (11px uppercase subtle, letter-spacing).
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { CarbonSwitch } from "../components/carbon-switch";
import styles from "./settings-screen.module.css";

const LANGUAGES = ["English", "Deutsch", "Français", "日本語"];

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div className={styles.root}>
      <TopBar variant="inline" title="Settings" subtitle="Preferences" />

      <div className={styles.content}>
        {/* Appearance */}
        <span className={styles.groupLabel}>Appearance</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Theme</span>
              <span className={styles.rowDesc}>Dark (Carbon gray 100) or light (gray 10)</span>
            </div>
            <div className={styles.segmented}>
              <button
                type="button"
                className={`${styles.segmentBtn} ${theme === "dark" ? styles.segmentBtnActive : ""}`}
                onClick={() => setTheme("dark" as AppTheme)}
                aria-pressed={theme === "dark"}
              >
                Dark
              </button>
              <button
                type="button"
                className={`${styles.segmentBtn} ${theme === "light" ? styles.segmentBtnActive : ""}`}
                onClick={() => setTheme("light" as AppTheme)}
                aria-pressed={theme === "light"}
              >
                Light
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <span className={styles.groupLabel}>Notifications</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Push notifications</span>
              <span className={styles.rowDesc}>Transactions, alerts and updates</span>
            </div>
            <CarbonSwitch on={push} onToggle={() => setPush((v) => !v)} label="Push notifications" />
          </div>
          <div className={`${styles.row} ${styles.rowDivider}`}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Email statements</span>
              <span className={styles.rowDesc}>Monthly PDF statements</span>
            </div>
            <CarbonSwitch on={email} onToggle={() => setEmail((v) => !v)} label="Email statements" />
          </div>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>SMS alerts</span>
              <span className={styles.rowDesc}>Fraud and large-charge warnings</span>
            </div>
            <CarbonSwitch on={sms} onToggle={() => setSms((v) => !v)} label="SMS alerts" />
          </div>
        </div>

        {/* Language */}
        <span className={styles.groupLabel}>Language</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>App language</span>
              <span className={styles.rowDesc}>Applies to menus and statements</span>
            </div>
          </div>
          <select
            className={styles.select}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="App language"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* About */}
        <span className={styles.groupLabel}>About</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Finance Hub</span>
              <span className={styles.rowDesc}>v2.1 · IBM Carbon · mock data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
