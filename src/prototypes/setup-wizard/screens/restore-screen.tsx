"use client";
/**
 * setup-wizard / screens / restore-screen — step 4.
 *
 * The initial restore screen. User can either:
 *   - Click "Select Backup File" → advances to the format-not-supported
 *     fun screen (step 5), which kicks off the full restore flow.
 *   - Click "Skip" → jumps directly to the Finish screen (step 12),
 *     skipping the entire restore flow.
 */
import type { ThemePalette } from "../lib/themes";
import { RestoreVisual } from "../components/visuals";

interface RestoreScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  /** Jump directly to the Finish screen, skipping all restore screens. */
  onSkip: () => void;
  palette: ThemePalette;
}

export function RestoreScreen({
  active,
  onNext,
  onBack,
  onSkip,
  palette,
}: RestoreScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — beautiful cloud with flowing data stream */}
        <div className="illustration" key={active ? "on" : "off"}>
          <RestoreVisual />
        </div>

        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Restore backup</h1>
        <p className="wizard-subtitle">
          Got a backup from a previous install? Restore your library, history,
          and settings in one tap.
        </p>

        {/* Compact "Select Backup File" button */}
        <button
          type="button"
          className="wizard-btn wizard-btn--select"
          style={{
            color: palette.primary,
            borderColor: palette.primary,
          }}
          onClick={onNext}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path
              d="M12 12v5M9.5 14.5L12 17l2.5-2.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Select Backup File
        </button>
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
          className="wizard-btn wizard-btn--ghost"
          onClick={onSkip}
          style={{ fontWeight: 800 }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
