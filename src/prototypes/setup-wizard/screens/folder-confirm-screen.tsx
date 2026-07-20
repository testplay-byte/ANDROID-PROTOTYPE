"use client";
/**
 * setup-wizard / screens / folder-confirm-screen — step 3.
 *
 * Confirmation screen after the user picks a folder. Shows the CheckCircle
 * illustration (animated checkmark drawing) and a mock card with the folder
 * path + item count. A "Continue" button advances to the permissions step.
 */
import type { ThemePalette } from "../lib/themes";
import { CheckCircle } from "../components/illustrations";

interface FolderConfirmScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
}

export function FolderConfirmScreen({ active, onNext, onBack, palette }: FolderConfirmScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration — re-mounts when active so the checkmark redraws */}
        <div className="illustration" key={active ? "on" : "off"}>
          <CheckCircle />
        </div>

        <h1 className="wizard-title">Folder Connected!</h1>
        <p className="wizard-subtitle">
          Your anime library is ready to roll. We&apos;ll scan it in the
          background while you finish setup.
        </p>

        {/* Mock card with folder details */}
        <div
          className="mock-card"
          style={{ animation: "cardEntry 0.5s var(--ease-emphasized-decel) 0.6s backwards" }}
        >
          <div
            className="mock-icon"
            style={{ background: palette.primaryContainerDark, color: palette.onPrimaryContainer }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="mock-info">
            <p className="mock-title">/storage/anime-library</p>
            <p className="mock-desc">247 items · scan started</p>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ color: palette.primary, flex: "0 0 auto" }}
          >
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
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
          Continue
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
