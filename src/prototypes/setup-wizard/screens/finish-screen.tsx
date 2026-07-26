"use client";
/**
 * setup-wizard / screens / finish-screen — step 12 (last).
 *
 * The final "URL set" screen. Shows a beautiful modern animation
 * (abstract app logo with orbiting elements + URL/link visual) and a
 * "Start Exploring" button that restarts the wizard.
 */
import type { ThemePalette } from "../lib/themes";
import { WelcomeVisual } from "../components/visuals";

interface FinishScreenProps {
  active: boolean;
  onRestart: () => void;
  palette: ThemePalette;
}

export function FinishScreen({ active, onRestart, palette }: FinishScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content" style={{ position: "relative", zIndex: 2 }}>
        {/* Badge above the illustration */}
        <span
          className="finish-badge"
          style={{
            background: `${palette.primary}22`,
            color: palette.primary,
            animation: "scaleIn 0.5s var(--ease-emphasized-decel) 0.1s backwards",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.4-6.3-4.6-6.3 4.6L7.9 14l-6-4.6h7.6z"
              fill="currentColor"
            />
          </svg>
          Setup complete
        </span>

        {/* Illustration — modern abstract visual (moving background) */}
        <div
          className="illustration illustration--lg"
          key={active ? "on" : "off"}
          style={{ animation: "scaleIn 0.6s var(--ease-emphasized-decel) 0.2s backwards, float 4s ease-in-out 0.8s infinite" }}
        >
          <WelcomeVisual />
        </div>

        <h1
          className="wizard-title wizard-title--xl"
          style={{
            fontWeight: 800,
            background: `linear-gradient(135deg, ${palette.primary}, ${palette.primary}aa)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            animation: "titleSlideUp 0.5s var(--ease-emphasized-decel) 0.4s backwards",
          }}
        >
          You&apos;re all set!
        </h1>

        <p
          className="wizard-subtitle"
          style={{ animation: "titleSlideUp 0.5s var(--ease-emphasized-decel) 0.55s backwards" }}
        >
          Your anime journey begins now. Enjoy exploring thousands of titles,
          tracking your progress, and never missing a new episode.
        </p>

        {/* URL set card */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            padding: "12px 16px",
            borderRadius: "var(--r-md)",
            background: "var(--color-surface-2)",
            border: `1px solid ${palette.primary}33`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "cardEntry 0.5s var(--ease-emphasized-decel) 0.7s backwards",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}>
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
          </svg>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>
              API URL
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text)", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              https://api.anilist.co
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={palette.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "0 0 auto" }}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>

      <div className="wizard-actions" style={{ position: "relative", zIndex: 2 }}>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onRestart}
          style={{
            background: palette.primary,
            color: palette.onPrimary,
            fontWeight: 800,
            boxShadow: `0 6px 24px ${palette.primary}55`,
            animation: "scaleIn 0.5s var(--ease-emphasized-decel) 0.9s backwards",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12a7 7 0 0112-5l2 2M19 12a7 7 0 01-12 5l-2-2M19 4v5h-5M5 20v-5h5"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Start Exploring
        </button>
      </div>
    </div>
  );
}
