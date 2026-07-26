"use client";
/**
 * setup-wizard / screens / format-not-supported-screen — step 5.
 *
 * A fun "backup format not supported" screen. After the user clicks
 * "Select Backup File", this screen shows a playful warning that the
 * format isn't recognized — but then reassures them with "Don't worry,
 * you can restore from this format too" and a Continue button.
 *
 * Clicking Continue advances to the processing-backup screen (step 6).
 */
import type { ThemePalette } from "../lib/themes";

interface FormatNotSupportedScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
}

export function FormatNotSupportedScreen({ active, onNext, onBack, palette }: FormatNotSupportedScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Fun warning illustration — a file with a caution symbol */}
        <div className="illustration" key={active ? "on" : "off"}>
          <svg viewBox="0 0 200 200" role="img" aria-label="Unsupported format warning" style={{ overflow: "visible", width: "100%", height: "100%" }}>
            <style>{`
              .fns-file { transform-box: fill-box; transform-origin: center; animation: fns-bob 3s ease-in-out infinite; }
              @keyframes fns-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
              .fns-warn { transform-box: fill-box; transform-origin: center; animation: fns-pulse 1.5s ease-in-out infinite; }
              @keyframes fns-pulse { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.1); opacity: 1; } }
              .fns-spark { transform-box: fill-box; transform-origin: center; animation: fns-twinkle 2s ease-in-out infinite; }
              @keyframes fns-twinkle { 0%,100% { opacity: 0.2; transform: scale(0.5); } 50% { opacity: 0.9; transform: scale(1.2); } }
              @media (prefers-reduced-motion: reduce) { .fns-file, .fns-warn, .fns-spark { animation: none !important; } }
            `}</style>

            {/* Glow */}
            <circle cx={100} cy={100} r={60} fill="var(--color-warn)" opacity={0.18} style={{ filter: "blur(10px)" }} />

            {/* File body */}
            <g className="fns-file">
              <path
                d="M 64 50 L 64 150 Q 64 156 70 156 L 130 156 Q 136 156 136 150 L 136 72 L 114 50 Z"
                fill="var(--color-surface-3)"
                stroke="var(--color-warn)"
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <path d="M 114 50 L 114 72 L 136 72" fill="none" stroke="var(--color-warn)" strokeWidth={2} strokeLinejoin="round" />
              {/* File content lines */}
              <rect x={76} y={86} width={48} height={4} rx={2} fill="var(--color-warn)" opacity={0.5} />
              <rect x={76} y={98} width={40} height={4} rx={2} fill="var(--color-warn)" opacity={0.35} />
              <rect x={76} y={110} width={44} height={4} rx={2} fill="var(--color-warn)" opacity={0.35} />
              <rect x={76} y={122} width={36} height={4} rx={2} fill="var(--color-warn)" opacity={0.3} />
            </g>

            {/* Warning triangle badge */}
            <g className="fns-warn">
              <circle cx={140} cy={140} r={22} fill="var(--color-warn)" />
              <circle cx={140} cy={140} r={22} fill="none" stroke="var(--color-bg)" strokeWidth={2} opacity={0.3} />
              <path d="M 140 128 L 140 142" stroke="var(--color-bg)" strokeWidth={3.5} strokeLinecap="round" />
              <circle cx={140} cy={150} r={2} fill="var(--color-bg)" />
            </g>

            {/* Sparkles */}
            <circle className="fns-spark" cx={40} cy={60} r={3} fill="var(--color-warn)" />
            <circle className="fns-spark" cx={160} cy={50} r={2.5} fill="var(--color-tertiary)" style={{ animationDelay: "0.6s" }} />
            <circle className="fns-spark" cx={36} cy={150} r={2} fill="var(--color-primary)" style={{ animationDelay: "1.1s" }} />
          </svg>
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800, color: "var(--color-warn)" }}>
          Format not supported
        </h1>
        <p className="wizard-subtitle">
          We don&apos;t recognize this backup format. But don&apos;t worry —
          we can still try to restore from it!
        </p>

        {/* Info card */}
        <div
          className="mock-card"
          style={{
            borderColor: `${palette.primary}44`,
            background: "var(--color-surface-2)",
          }}
        >
          <div
            className="mock-icon"
            style={{ background: `${palette.primary}22`, color: palette.primary }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="mock-info">
            <p className="mock-title">anime_backup_2025-01-15.json</p>
            <p className="mock-desc">2.3 MB · unknown format</p>
          </div>
        </div>
      </div>

      <div className="wizard-actions">
        <button type="button" className="wizard-btn wizard-btn--secondary" onClick={onBack} style={{ fontWeight: 800 }}>
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
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Don&apos;t worry, restore it
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
