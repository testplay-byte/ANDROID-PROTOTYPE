"use client";

/**
 * anime-app / screens / settings-screen — full settings page.
 *
 * Groups:
 *   - Appearance: theme toggle (Dark/Light) — uses useDeviceTheme().
 *   - Display: single-line titles toggle, poster style select, card
 *     density select — uses useSettings().
 *   - Animations: animation speed select — uses useSettings().
 *   - Data: clear history + clear library buttons (with confirm() —
 *     matches the original script.js behaviour).
 *   - About: app name + version string.
 *
 * Theme persists via the DeviceThemeProvider (storageKey="anime-app-theme").
 * The other settings persist via useSettings (storageKey="anime-app-settings").
 */
import { useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { useSettings } from "../hooks/use-settings";
import { useLibrary } from "../hooks/use-library";
import { useHistory } from "../hooks/use-history";
import { useCollapsingHeader } from "../hooks/use-collapsing-header";
import styles from "./settings-screen.module.css";

interface SettingsScreenProps {
  active: boolean;
}

export function SettingsScreen({ active }: SettingsScreenProps) {
  const { theme, setTheme } = useDeviceTheme();
  const { settings, update, toggleSingleLine } = useSettings();
  const { clear: clearLibrary } = useLibrary();
  const { clear: clearHistory } = useHistory();
  const { contentRef, collapsed } = useCollapsingHeader();

  function handleClearHistory() {
    if (typeof window !== "undefined" && window.confirm("Clear all watch history?")) {
      clearHistory();
    }
  }
  function handleClearLibrary() {
    if (typeof window !== "undefined" && window.confirm("Clear entire library?")) {
      clearLibrary();
    }
  }

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="settings"
      aria-label="Settings"
      aria-hidden={!active}
    >
      <div className={`${styles.topbar} ${collapsed ? styles.topbarIsCollapsed : ""}`}>
        <h1 className={styles.topbarTitle}>Settings</h1>
      </div>
      <div ref={contentRef} className={styles.content}>
        {/* Appearance */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Appearance</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Theme</span>
                <span className={styles.rowDesc}>
                  Switch between dark and light mode
                </span>
              </div>
              <ThemeToggle theme={theme} onChange={setTheme} />
            </div>
          </div>
        </div>

        {/* Display */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Display</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Single-line titles</span>
                <span className={styles.rowDesc}>
                  Show anime titles on one line (truncate with ellipsis)
                </span>
              </div>
              <button
                type="button"
                className={`${styles.toggle} ${settings.singleLineTitles ? styles.toggleIsOn : ""}`}
                onClick={toggleSingleLine}
                aria-label="Toggle single-line titles"
                aria-pressed={settings.singleLineTitles}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
            <div className={styles.rowStacked}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Poster style</span>
                <span className={styles.rowDesc}>
                  Cover image border radius
                </span>
              </div>
              <div className={styles.posterSelector}>
                <button
                  type="button"
                  className={`${styles.posterOption} ${settings.posterStyle === "rounded" ? styles.posterOptionIsActive : ""}`}
                  onClick={() => update({ posterStyle: "rounded" })}
                  aria-label="Rounded posters"
                  aria-pressed={settings.posterStyle === "rounded"}
                >
                  <span className={`${styles.posterPreview} ${styles.posterPreviewRounded}`} />
                  <span className={styles.posterLabel}>Rounded</span>
                </button>
                <button
                  type="button"
                  className={`${styles.posterOption} ${settings.posterStyle === "sharp" ? styles.posterOptionIsActive : ""}`}
                  onClick={() => update({ posterStyle: "sharp" })}
                  aria-label="Sharp posters"
                  aria-pressed={settings.posterStyle === "sharp"}
                >
                  <span className={`${styles.posterPreview} ${styles.posterPreviewSharp}`} />
                  <span className={styles.posterLabel}>Sharp</span>
                </button>
                <button
                  type="button"
                  className={`${styles.posterOption} ${settings.posterStyle === "circle" ? styles.posterOptionIsActive : ""}`}
                  onClick={() => update({ posterStyle: "circle" })}
                  aria-label="Circle posters"
                  aria-pressed={settings.posterStyle === "circle"}
                >
                  <span className={`${styles.posterPreview} ${styles.posterPreviewCircle}`} />
                  <span className={styles.posterLabel}>Circle</span>
                </button>
              </div>
            </div>
            <div className={styles.rowStacked}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Card density</span>
                <span className={styles.rowDesc}>Spacing between cards</span>
              </div>
              <div className={styles.densitySelector}>
                <button
                  type="button"
                  className={`${styles.densityOption} ${settings.cardDensity === "compact" ? styles.densityOptionIsActive : ""}`}
                  onClick={() => update({ cardDensity: "compact" })}
                  aria-label="Compact density"
                  aria-pressed={settings.cardDensity === "compact"}
                >
                  <span className={`${styles.densityPreview} ${styles.densityPreviewCompact}`}>
                    <span className={styles.densityDot} />
                    <span className={styles.densityDot} />
                    <span className={styles.densityDot} />
                  </span>
                  <span className={styles.densityLabel}>Compact</span>
                </button>
                <button
                  type="button"
                  className={`${styles.densityOption} ${settings.cardDensity === "default" ? styles.densityOptionIsActive : ""}`}
                  onClick={() => update({ cardDensity: "default" })}
                  aria-label="Default density"
                  aria-pressed={settings.cardDensity === "default"}
                >
                  <span className={`${styles.densityPreview} ${styles.densityPreviewDefault}`}>
                    <span className={styles.densityDot} />
                    <span className={styles.densityDot} />
                    <span className={styles.densityDot} />
                  </span>
                  <span className={styles.densityLabel}>Default</span>
                </button>
                <button
                  type="button"
                  className={`${styles.densityOption} ${settings.cardDensity === "comfortable" ? styles.densityOptionIsActive : ""}`}
                  onClick={() => update({ cardDensity: "comfortable" })}
                  aria-label="Comfortable density"
                  aria-pressed={settings.cardDensity === "comfortable"}
                >
                  <span className={`${styles.densityPreview} ${styles.densityPreviewComfortable}`}>
                    <span className={styles.densityDot} />
                    <span className={styles.densityDot} />
                    <span className={styles.densityDot} />
                  </span>
                  <span className={styles.densityLabel}>Comfortable</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animations */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Animations</div>
          <div className={styles.card}>
            <div className={styles.row}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Animation speed</span>
                <span className={styles.rowDesc}>
                  Speed of transitions and effects
                </span>
              </div>
              <select
                className={styles.select}
                value={settings.animSpeed}
                onChange={(e) =>
                  update({
                    animSpeed: e.target.value as typeof settings.animSpeed,
                  })
                }
              >
                <option value="fast">Fast</option>
                <option value="normal">Normal</option>
                <option value="slow">Slow</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>Data</div>
          <div className={styles.card}>
            <button
              type="button"
              className={`${styles.row} ${styles.rowBtn}`}
              onClick={handleClearHistory}
            >
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Clear history</span>
                <span className={styles.rowDesc}>
                  Remove all recently viewed anime
                </span>
              </div>
              <span className={styles.rowValue}>→</span>
            </button>
            <button
              type="button"
              className={`${styles.row} ${styles.rowBtn}`}
              onClick={handleClearLibrary}
            >
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Clear library</span>
                <span className={styles.rowDesc}>Remove all saved anime</span>
              </div>
              <span className={styles.rowValue}>→</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className={styles.group}>
          <div className={styles.groupLabel}>About</div>
          <div className={styles.card}>
            <div className={`${styles.row} ${styles.rowStatic}`}>
              <div className={styles.rowInfo}>
                <span className={styles.rowTitle}>Anime App</span>
                <span className={styles.rowDesc}>
                  v2.0 · Material 3 Expressive · AniList API
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Theme toggle — segmented Dark/Light pill.
// ---------------------------------------------------------------------------

interface ThemeToggleProps {
  theme: AppTheme;
  onChange: (t: AppTheme) => void;
}

function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className={styles.themeToggle}>
      <button
        type="button"
        className={`${styles.themeToggleBtn} ${theme === "dark" ? styles.themeToggleBtnIsActive : ""}`}
        onClick={() => onChange("dark")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <span>Dark</span>
      </button>
      <button
        type="button"
        className={`${styles.themeToggleBtn} ${theme === "light" ? styles.themeToggleBtnIsActive : ""}`}
        onClick={() => onChange("light")}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <span>Light</span>
      </button>
    </div>
  );
}
