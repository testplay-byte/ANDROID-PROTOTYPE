"use client";
/**
 * setup-wizard / screens / restore-screen — step 5.
 *
 * User can restore from a previous backup. The "Select Backup File" button
 * is a mock — clicking it sets `backupSelected = true` and reveals a mock
 * card showing "anime_backup_2025-01-15.json — 2.3 MB". Continue is
 * disabled until a backup is selected. Skip advances without restoring.
 */
import type { ThemePalette } from "../lib/themes";
import { CloudBackup } from "../components/illustrations";

interface RestoreScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  backupSelected: boolean;
  setBackupSelected: (selected: boolean) => void;
  palette: ThemePalette;
}

export function RestoreScreen({
  active,
  onNext,
  onBack,
  backupSelected,
  setBackupSelected,
  palette,
}: RestoreScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration */}
        <div className="illustration" key={active ? "on" : "off"}>
          <CloudBackup />
        </div>

        <h1 className="wizard-title">Restore backup</h1>
        <p className="wizard-subtitle">
          Got a backup from a previous install? Restore your library, history,
          and settings in one tap.
        </p>

        {!backupSelected ? (
          <button
            type="button"
            className="wizard-btn wizard-btn--primary"
            style={{
              background: palette.primary,
              color: palette.onPrimary,
              maxWidth: 280,
              animation: "pulse 2.4s ease-in-out infinite",
            }}
            onClick={() => setBackupSelected(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 4v12M7 11l5 5 5-5M5 20h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Select Backup File
          </button>
        ) : (
          <div
            className="mock-card"
            style={{ animation: "cardEntry 0.4s var(--ease-emphasized-decel) backwards" }}
          >
            <div
              className="mock-icon"
              style={{ background: palette.primaryContainerDark, color: palette.onPrimaryContainer }}
            >
              {/* File/document SVG icon (NOT an emoji) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"
                  fill="currentColor"
                />
                <path d="M14 3v5h5" fill="var(--color-bg)" opacity="0.4" />
              </svg>
            </div>
            <div className="mock-info">
              <p className="mock-title">anime_backup_2025-01-15.json</p>
              <p className="mock-desc">2.3 MB · ready to restore</p>
            </div>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ color: palette.primary, flex: "0 0 auto" }}
            >
              <circle cx="12" cy="12" r="11" fill={palette.primary} opacity="0.18" />
              <path
                d="M7 12.5l3.5 3.5L17 9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
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
        <button type="button" className="wizard-btn wizard-btn--ghost" onClick={onNext}>
          Skip
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          disabled={!backupSelected}
          style={{
            background: palette.primary,
            color: palette.onPrimary,
            opacity: backupSelected ? 1 : 0.4,
            cursor: backupSelected ? "pointer" : "not-allowed",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
