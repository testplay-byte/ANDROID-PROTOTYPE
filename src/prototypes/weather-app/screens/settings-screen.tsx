"use client";

/**
 * Settings screen — glassmorphism settings.
 * - Theme: light/dark segmented glass toggle (persists via useDeviceTheme).
 * - Units: °C / °F toggle (shared page state — converts temps everywhere).
 * - Ambient: decorative intensity presets (visual only, per-tab React state).
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import type { Unit } from "../lib/weather";
import { MoonIcon, SunIcon, ThermometerIcon, DropletIcon } from "../components/icons";
import styles from "./settings-screen.module.css";

export interface SettingsScreenProps {
  unit: Unit;
  onUnitChange: (unit: Unit) => void;
}

export function SettingsScreen({ unit, onUnitChange }: SettingsScreenProps) {
  const { theme, setTheme } = useDeviceTheme();
  const [ambient, setAmbient] = useState<"soft" | "balanced" | "vivid">("balanced");

  return (
    <div className={styles.root}>
      <TopBar variant="center" title="Settings" leading={<SunIcon size={18} />} />

      <div className={styles.content}>
        {/* Appearance */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>Appearance</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowIcon}><MoonIcon size={18} /></span>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Theme</span>
                <span className={styles.rowDesc}>Frost tint for all glass surfaces</span>
              </div>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${theme === "light" ? styles.segmentBtnActive : ""}`}
                  onClick={() => setTheme("light" as AppTheme)}
                  aria-pressed={theme === "light"}
                >
                  <SunIcon size={14} />
                  Light
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${theme === "dark" ? styles.segmentBtnActive : ""}`}
                  onClick={() => setTheme("dark" as AppTheme)}
                  aria-pressed={theme === "dark"}
                >
                  <MoonIcon size={14} />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Units */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>Units</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowIcon}><ThermometerIcon size={18} /></span>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Temperature</span>
                <span className={styles.rowDesc}>Applies to every screen instantly</span>
              </div>
              <div className={styles.segmented}>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${unit === "c" ? styles.segmentBtnActive : ""}`}
                  onClick={() => onUnitChange("c")}
                  aria-pressed={unit === "c"}
                >
                  °C
                </button>
                <button
                  type="button"
                  className={`${styles.segmentBtn} ${unit === "f" ? styles.segmentBtnActive : ""}`}
                  onClick={() => onUnitChange("f")}
                  aria-pressed={unit === "f"}
                >
                  °F
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient light (visual preset) */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>Ambient light</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <span className={styles.rowIcon}><DropletIcon size={18} /></span>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Blob intensity</span>
                <span className={styles.rowDesc}>Preview of the ambient presets</span>
              </div>
              <div className={styles.segmented}>
                {(["soft", "balanced", "vivid"] as const).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`${styles.segmentBtn} ${ambient === preset ? styles.segmentBtnActive : ""}`}
                    onClick={() => setAmbient(preset)}
                    aria-pressed={ambient === preset}
                  >
                    {preset === "soft" ? "Soft" : preset === "balanced" ? "Std" : "Vivid"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* About */}
        <div className={styles.group}>
          <span className={styles.groupLabel}>About</span>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Glass Weather</span>
                <span className={styles.rowDesc}>v1.0 · Glassmorphism · simulated data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
