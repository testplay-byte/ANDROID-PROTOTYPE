"use client";

/**
 * fitness-tracker / screens / settings-screen — iOS inset grouped style:
 * appearance (Light/Dark segmented → useDeviceTheme), units (km/mi),
 * weekly goal stepper, About row.
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import { Group, Row, SectionLabel } from "../components/grouped-list";
import { Segmented } from "../components/segmented";
import styles from "./settings-screen.module.css";

type Units = "km" | "mi";

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const [units, setUnits] = useState<Units>("km");
  const [weeklyGoal, setWeeklyGoal] = useState(5);

  return (
    <div className={styles.root}>
      <TopBar variant="center" title="Settings" />

      <div className={styles.content}>
        {/* Appearance */}
        <SectionLabel>Appearance</SectionLabel>
        <Group>
          <Row
            icon={<MoonIcon />}
            iconClassName={styles.tintIndigo}
            title="Theme"
            subtitle={theme === "light" ? "Light" : "Dark"}
            last
          />
          <div className={styles.segmentRow}>
            <Segmented
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { id: "light", label: "Light" },
                { id: "dark", label: "Dark" },
              ]}
            />
          </div>
        </Group>

        {/* Units */}
        <SectionLabel>Units</SectionLabel>
        <Group>
          <div className={styles.segmentRow}>
            <span className={styles.segmentRowLabel}>Distance</span>
            <div className={styles.segmentInline}>
              <Segmented
                label="Distance units"
                value={units}
                onChange={setUnits}
                options={[
                  { id: "km", label: "km" },
                  { id: "mi", label: "mi" },
                ]}
              />
            </div>
          </div>
        </Group>

        {/* Weekly goal */}
        <SectionLabel>Goals</SectionLabel>
        <Group>
          <div className={styles.segmentRow}>
            <span className={styles.segmentRowLabel}>Weekly workouts</span>
            <div className={styles.stepper} role="group" aria-label="Weekly workout goal">
              <button
                type="button"
                className={styles.stepperBtn}
                aria-label="Decrease weekly goal"
                disabled={weeklyGoal <= 1}
                onClick={() => setWeeklyGoal((g) => Math.max(1, g - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className={styles.stepperValue}>{weeklyGoal}</span>
              <button
                type="button"
                className={styles.stepperBtn}
                aria-label="Increase weekly goal"
                disabled={weeklyGoal >= 7}
                onClick={() => setWeeklyGoal((g) => Math.min(7, g + 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </Group>

        {/* About */}
        <SectionLabel>About</SectionLabel>
        <Group>
          <Row
            icon={<InfoIcon />}
            iconClassName={styles.tintBlue}
            title="Version"
            value="1.0.0"
          />
          <Row
            icon={<StarIcon />}
            iconClassName={styles.tintOrange}
            title="Rate Fitness Tracker"
            chevron
            last
            onClick={() => undefined}
          />
        </Group>

        <p className={styles.footer}>Fitness Tracker · Prototype</p>
      </div>
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
