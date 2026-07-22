"use client";

/**
 * anime-app / components / episode-settings-view — a pushed sub-view within
 * the detail screen for configuring how the episode list looks.
 *
 * Layout:
 *   ┌─────────────────────────────────────┐
 *   │  [Sticky] Live Preview              │  ← stays fixed at top
 *   │  ┌─────────────────────────────┐    │     (shows a sample episode row
 *   │  │  (sample EpisodeRow)        │    │      with current settings applied)
 *   │  └─────────────────────────────┘    │
 *   ├─────────────────────────────────────┤
 *   │  Episode Display                    │  ← scrollable
 *   │    ☐ Show decorative backgrounds    │
 *   │    ☐ Allow two-line title           │
 *   │                                     │
 *   │  Episode Layout                     │
 *   │    [Single view — locked]           │
 *   │                                     │
 *   │  Metadata Fetching                  │
 *   │    Source: AniList                  │
 *   └─────────────────────────────────────┘
 *
 * The Live Preview section is sticky (position: sticky; top: 0) so it
 * remains visible while the user scrolls the settings sections below.
 * Only the lower content area scrolls.
 */
import { useSettings } from "../hooks/use-settings";
import { EpisodeRow } from "./episode-row";
import type { EpisodeData } from "../lib/types";
import styles from "./episode-settings-view.module.css";

interface EpisodeSettingsViewProps {
  active: boolean;
  onBack: () => void;
}

/** A fixed sample episode used for the Live Preview. */
const SAMPLE_EPISODE: EpisodeData = {
  number: 1,
  title: "A New Beginning: The Journey Starts",
  description:
    "Our hero sets out on a journey that will change everything. Old memories resurface as the first steps are taken into the unknown.",
  releaseDate: "Jan 15, 2024",
  subAvailable: true,
  dubAvailable: true,
  thumbnail: "",
};

export function EpisodeSettingsView({ active, onBack }: EpisodeSettingsViewProps) {
  const { settings, update } = useSettings();

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="episode-settings"
      aria-label="Episode settings"
      aria-hidden={!active}
    >
      {/* Top bar with back button + title */}
      <div className={styles.topbar}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Back to detail"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className={styles.title}>Episode Settings</h1>
      </div>

      {/* Scrollable content area — the live preview is sticky inside here */}
      <div className={styles.content}>
        {/* ---- Sticky Live Preview ---- */}
        <div className={styles.livePreviewWrap}>
          <div className={styles.livePreviewHeader}>
            <span className={styles.livePreviewLabel}>Live Preview</span>
            <span className={styles.livePreviewHint}>
              Changes apply instantly
            </span>
          </div>
          <div className={styles.livePreviewCard}>
            <EpisodeRow
              episode={SAMPLE_EPISODE}
              showDecorativeBackgrounds={settings.episodeShowDecorativeBackgrounds}
              allowTwoLineTitle={settings.episodeAllowTwoLineTitle}
            />
          </div>
        </div>

        {/* ---- Episode Display section ---- */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Episode Display</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Show decorative backgrounds</span>
                <span className={styles.rowDesc}>
                  Colored chips behind episode count, sub/dub, and release date
                </span>
              </div>
              <Toggle
                on={settings.episodeShowDecorativeBackgrounds}
                onChange={(v) => update({ episodeShowDecorativeBackgrounds: v })}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Allow two-line title</span>
                <span className={styles.rowDesc}>
                  Let long episode titles wrap onto a second line
                </span>
              </div>
              <Toggle
                on={settings.episodeAllowTwoLineTitle}
                onChange={(v) => update({ episodeAllowTwoLineTitle: v })}
              />
            </div>
          </div>
        </div>

        {/* ---- Episode Layout section ---- */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Episode Layout</div>
          <div className={styles.card}>
            <div className={styles.rowStacked}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>List layout</span>
                <span className={styles.rowDesc}>
                  The single supported view — thumbnail + title + description
                </span>
              </div>
              <div className={styles.textSelector}>
                <button
                  type="button"
                  className={`${styles.textOption} ${styles.textOptionIsActive}`}
                  disabled
                >
                  Detailed List
                </button>
                <button
                  type="button"
                  className={styles.textOption}
                  disabled
                  title="Compact view is not available yet"
                >
                  Compact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Metadata Fetching section ---- */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Metadata Fetching</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Episode data source</span>
                <span className={styles.rowDesc}>
                  Where episode titles and descriptions come from
                </span>
              </div>
              <span className={styles.rowValue}>AniList</span>
            </div>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Auto-fetch on open</span>
                <span className={styles.rowDesc}>
                  Load episode metadata when opening the detail page
                </span>
              </div>
              <Toggle on={true} onChange={() => {}} />
            </div>
          </div>
        </div>

        {/* Bottom spacing so the last group isn't flush against the nav */}
        <div style={{ height: 24 }} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Toggle sub-component (matches the settings-screen toggle style)
// ---------------------------------------------------------------------------

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className={`${styles.toggle} ${on ? styles.toggleIsOn : ""}`}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span className={styles.toggleKnob} />
    </button>
  );
}
