"use client";
/**
 * setup-wizard / screens / restore-summary-screen — step 10.
 *
 * The final summary before the actual restore. Shows all stats again
 * (now with linked count) + a Restore button that advances to the
 * restore-successful screen (step 11).
 */
import type { ThemePalette } from "../lib/themes";
import type { LinkedAnime } from "../hooks/use-wizard-state";

interface RestoreSummaryScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
  linkedAnime: LinkedAnime[];
}

export function RestoreSummaryScreen({ active, onNext, onBack, palette, linkedAnime }: RestoreSummaryScreenProps) {
  const linkedCount = linkedAnime.filter((a) => a.linked).length;
  const unlinkedCount = linkedAnime.filter((a) => !a.linked).length;

  const STATS = [
    { value: "247", label: "Anime to restore" },
    { value: String(linkedCount), label: "Auto-linked" },
    { value: String(unlinkedCount), label: "Manually linked" },
    { value: "1,432", label: "Episodes" },
  ];

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Restore summary</h1>
        <p className="wizard-subtitle">
          Ready to restore. Review the details below.
        </p>

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

        {/* Info note */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "12px 16px",
            borderRadius: "var(--r-md)",
            background: `${palette.primary}11`,
            border: `1px solid ${palette.primary}33`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
            This will overwrite any existing library data. The restore
            process may take a few moments.
          </p>
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--secondary" onClick={onBack} style={{ fontWeight: 800 }}>
          Back
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Restore Now
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
