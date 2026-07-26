"use client";
/**
 * setup-wizard / screens / backup-summary-screen — step 7.
 *
 * Shows the backup summary with stats (anime, categories, episodes, etc.)
 * + a RED manga warning at the bottom ("Manga entries detected, manga
 * is not supported"). Two buttons: Cancel (back) and Restore (advance to
 * the linking anime screen).
 */
import type { ThemePalette } from "../lib/themes";
import { SummaryVisual } from "../components/visuals";

interface BackupSummaryScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
}

interface StatDef {
  value: string;
  label: string;
}

const STATS: StatDef[] = [
  { value: "247", label: "Anime detected" },
  { value: "12", label: "Categories" },
  { value: "1,432", label: "Episodes tracked" },
  { value: "89", label: "Completed" },
];

export function BackupSummaryScreen({ active, onNext, onBack, palette }: BackupSummaryScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — growing bar chart with trend arrow */}
        <div className="illustration" key={active ? "on" : "off"}>
          <SummaryVisual />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Backup summary</h1>
        <p className="wizard-subtitle">Here&apos;s what we found in your backup</p>

        {/* Stats grid */}
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{
                animation: `cardEntry 0.5s var(--ease-emphasized-decel) ${0.08 * i + 0.15}s backwards`,
                borderColor: `${palette.primary}44`,
              }}
            >
              <span
                className="stat-value stat-value--anim"
                style={{
                  color: palette.primary,
                  animationDelay: `${0.08 * i + 0.35}s`,
                }}
              >
                {stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Manga warning — RED format */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "12px 16px",
            borderRadius: "var(--r-md)",
            background: "color-mix(in srgb, var(--color-error) 15%, transparent)",
            border: "1px solid color-mix(in srgb, var(--color-error) 40%, transparent)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "cardEntry 0.5s var(--ease-emphasized-decel) 0.55s backwards",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: "var(--color-error)", flex: "0 0 auto" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "var(--color-error)" }}>
              Manga entries detected
            </p>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>
              Manga is not supported — these entries will be skipped.
            </p>
          </div>
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--secondary" onClick={onBack} style={{ fontWeight: 800 }}>
          Cancel
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Restore
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
