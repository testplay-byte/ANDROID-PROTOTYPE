"use client";

/**
 * SettingsScreen — appearance + notices:
 *   - theme: bordered SEGMENTED control (HELL / DUNKEL) via useDeviceTheme,
 *     persisted under the provider's `gallery-theme` key
 *   - BauhausSwitch toggles: guided tours, audio guide, newsletter
 *   - a collection ledger (persisted favourites count)
 *   - an about block closing the app in one triad rule
 */

import { useState } from "react";
import { TopBar, useDeviceTheme } from "../../../proto-kit";
import { BauhausSwitch } from "../components/bauhaus-switch";
import { SectionLabel, Segment, TriadRule } from "../components/bits";
import { useGallery } from "../state/gallery-context";
import styles from "./settings-screen.module.css";

type ThemeId = "light" | "dark";

export function SettingsScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { favorites, showToast } = useGallery();
  const [tours, setTours] = useState(true);
  const [audio, setAudio] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Settings" subtitle="Galerie Bauhaus" />

      <div className={styles.content}>
        <SectionLabel>Erscheinung</SectionLabel>
        <div className={styles.group}>
          <div className={styles.rowStack}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Thema</span>
              <span className={styles.rowCaption}>
                Papier und Tinte — oder Tinte bei Nacht
              </span>
            </div>
            <Segment<ThemeId>
              label="Theme"
              value={theme}
              onChange={(id) => {
                setTheme(id);
                showToast(
                  id === "dark" ? "DUNKEL — TINTE BEI NACHT" : "HELL — TINTE AUF PAPIER",
                  "yellow"
                );
              }}
              options={[
                { id: "light", label: "Hell" },
                { id: "dark", label: "Dunkel" },
              ]}
            />
          </div>
        </div>

        <SectionLabel>Besuch</SectionLabel>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Führungen</span>
              <span className={styles.rowCaption}>Sa + So, 11:00, roter Schlüssel</span>
            </div>
            <BauhausSwitch
              on={tours}
              onToggle={() => {
                const on = !tours;
                setTours(on);
                showToast(on ? "FÜHRUNGEN AKTIV" : "FÜHRUNGEN AUS", on ? "red" : "blue");
              }}
              label="Toggle guided tours"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Audio-Guide</span>
              <span className={styles.rowCaption}>Deutsch · Englisch · Russisch</span>
            </div>
            <BauhausSwitch
              on={audio}
              onToggle={() => {
                const on = !audio;
                setAudio(on);
                showToast(on ? "AUDIO-GUIDE AN" : "AUDIO-GUIDE AUS", on ? "red" : "blue");
              }}
              label="Toggle audio guide"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.rowMeta}>
              <span className={styles.rowName}>Newsletter</span>
              <span className={styles.rowCaption}>Ein Grid-Brief im Monat</span>
            </div>
            <BauhausSwitch
              on={newsletter}
              onToggle={() => {
                const on = !newsletter;
                setNewsletter(on);
                showToast(on ? "ANGEMELDET — DANKE" : "ABGEMELDET", on ? "yellow" : "blue");
              }}
              label="Toggle newsletter"
            />
          </div>
        </div>

        <SectionLabel>Meine Sammlung</SectionLabel>
        <div className={styles.ledger}>
          <span className={styles.ledgerNum}>{String(favorites.length).padStart(2, "0")}</span>
          <span className={styles.ledgerText}>
            {favorites.length === 1 ? "WERK GESAMMELT" : "WERKE GESAMMELT"}
          </span>
          <span className={styles.ledgerDiamond} aria-hidden="true" />
        </div>

        <div className={styles.about}>
          <TriadRule />
          <p className={styles.footer}>Galerie Bauhaus — Form folgt Farbe.</p>
        </div>
      </div>
    </div>
  );
}
