"use client";

/**
 * smart-home / screens / settings-screen — theme toggle (useDeviceTheme),
 * eco mode toggle, guest access toggle, home name input.
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import { Toggle } from "../components/toggle";
import styles from "./settings-screen.module.css";

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const [eco, setEco] = useState(true);
  const [guest, setGuest] = useState(false);
  const [homeName, setHomeName] = useState("Maple Street");

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Settings" subtitle="Home preferences" />

      <div className={styles.content}>
        {/* Appearance */}
        <span className={styles.groupLabel}>Appearance</span>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowInfo}>
              <span className={styles.rowName}>Theme</span>
              <span className={styles.rowSub}>Currently {theme === "light" ? "light" : "dark"}</span>
            </span>
            <div className={styles.segmented}>
              <button
                type="button"
                className={`${styles.segment} ${theme === "light" ? styles.segmentActive : ""}`}
                aria-pressed={theme === "light"}
                onClick={() => setTheme("light")}
              >
                Light
              </button>
              <button
                type="button"
                className={`${styles.segment} ${theme === "dark" ? styles.segmentActive : ""}`}
                aria-pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
              >
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Modes */}
        <span className={styles.groupLabel}>Modes</span>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </span>
            <span className={styles.rowInfo}>
              <span className={styles.rowName}>Eco mode</span>
              <span className={styles.rowSub}>Trim standby power automatically</span>
            </span>
            <Toggle checked={eco} onChange={() => setEco(!eco)} label="Eco mode" />
          </div>
          <div className={styles.row}>
            <span className={styles.rowIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className={styles.rowInfo}>
              <span className={styles.rowName}>Guest access</span>
              <span className={styles.rowSub}>Temporary pin for visitors</span>
            </span>
            <Toggle checked={guest} onChange={() => setGuest(!guest)} label="Guest access" />
          </div>
        </div>

        {/* Home identity */}
        <span className={styles.groupLabel}>Home</span>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.rowInfo}>
              <label className={styles.rowName} htmlFor="home-name">Home name</label>
              <span className={styles.rowSub}>Shown on the dashboard header</span>
            </span>
          </div>
          <input
            id="home-name"
            className={styles.input}
            type="text"
            value={homeName}
            maxLength={24}
            onChange={(e) => setHomeName(e.target.value)}
            placeholder="My home"
          />
        </div>
      </div>
    </div>
  );
}
