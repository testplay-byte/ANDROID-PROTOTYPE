"use client";

/**
 * Settings screen — theme + playback switches.
 * - Theme: light/dark segmented toggle (persists via useDeviceTheme).
 * - Playback: gapless + crossfade NeuSwitch (carved off / extruded on).
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { NeuSwitch } from "../components/neu-switch";
import { MoonIcon, SunIcon, MusicIcon } from "../components/icons";
import styles from "./settings-screen.module.css";

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const [gapless, setGapless] = useState(true);
  const [crossfade, setCrossfade] = useState(false);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Settings" />

      <div className={styles.content}>
        {/* Appearance */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>Appearance</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Theme</span>
                <span className={styles.rowDesc}>Light or dark soft-UI surfaces</span>
              </div>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${theme === "light" ? styles.segmentBtnActive : ""}`}
                  onClick={() => setTheme("light" as AppTheme)}
                  aria-pressed={theme === "light"}
                >
                  <SunIcon size={15} />
                  Light
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${theme === "dark" ? styles.segmentBtnActive : ""}`}
                  onClick={() => setTheme("dark" as AppTheme)}
                  aria-pressed={theme === "dark"}
                >
                  <MoonIcon size={15} />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Playback */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>Playback</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowIcon}>
                <MusicIcon size={20} />
              </div>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Gapless playback</span>
                <span className={styles.rowDesc}>No silence between album tracks</span>
              </div>
              <NeuSwitch on={gapless} onChange={() => setGapless((v) => !v)} label="Gapless playback" />
            </div>
            <div className={styles.row}>
              <div className={styles.rowIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h4l3-8 4 16 3-8h6" />
                </svg>
              </div>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Crossfade</span>
                <span className={styles.rowDesc}>Blend tracks over 4 seconds</span>
              </div>
              <NeuSwitch on={crossfade} onChange={() => setCrossfade((v) => !v)} label="Crossfade" />
            </div>
          </div>
        </div>

        {/* About */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>About</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Soft Player</span>
                <span className={styles.rowDesc}>v1.0 · Neumorphism · simulated audio</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
