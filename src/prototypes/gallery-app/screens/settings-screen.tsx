"use client";

/**
 * SettingsScreen — theme toggle (useDeviceTheme), guided-tours toggle and
 * newsletter toggle in sharp-cornered bordered groups.
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import { BauhausSwitch } from "../components/bauhaus-switch";
import styles from "./settings-screen.module.css";

export function SettingsScreen() {
  const { theme, toggleTheme } = useDeviceTheme();
  const [tours, setTours] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Settings" subtitle="Galerie Bauhaus" />

      <div className={styles.content}>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Dark theme</span>
              <span className={styles.rowCaption}>
                {theme === "dark" ? "Ink on paper, inverted" : "Paper and ink"}
              </span>
            </div>
            <BauhausSwitch
              on={theme === "dark"}
              onToggle={toggleTheme}
              label="Toggle dark theme"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Guided tours</span>
              <span className={styles.rowCaption}>Sat + Sun, 11:00, red key</span>
            </div>
            <BauhausSwitch
              on={tours}
              onToggle={() => setTours(!tours)}
              label="Toggle guided tours"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Newsletter</span>
              <span className={styles.rowCaption}>One grid-letter a month</span>
            </div>
            <BauhausSwitch
              on={newsletter}
              onToggle={() => setNewsletter(!newsletter)}
              label="Toggle newsletter"
            />
          </div>
        </div>

        <p className={styles.footer}>Galerie Bauhaus — Form follows colour.</p>
      </div>
    </div>
  );
}
