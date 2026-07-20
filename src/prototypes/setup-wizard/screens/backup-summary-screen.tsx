"use client";
/**
 * setup-wizard / screens / backup-summary-screen — step 6.
 *
 * After the user picks a backup file, this screen shows a stats grid with
 * what was found: 247 anime, 12 categories, 1,432 episodes tracked, 89
 * completed. Each stat card uses a scale-in entry animation (staggered).
 */
import type { ThemePalette } from "../lib/themes";
import { StatsChart } from "../components/illustrations";

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
        {/* Illustration */}
        <div className="illustration" key={active ? "on" : "off"}>
          <StatsChart />
        </div>

        <h1 className="wizard-title">Backup summary</h1>
        <p className="wizard-subtitle">Here&apos;s what we found in your backup</p>

        {/* Stats grid (4 cards, scale-in staggered) */}
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-card"
              style={{
                animation: `scaleIn 0.4s var(--ease-emphasized-decel) ${0.1 * i + 0.2}s backwards`,
              }}
            >
              <span className="stat-value" style={{ color: palette.primary }}>
                {stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--secondary" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M11 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary }}
        >
          Looks good!
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
