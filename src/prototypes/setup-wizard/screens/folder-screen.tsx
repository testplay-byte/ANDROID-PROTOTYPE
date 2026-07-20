"use client";
/**
 * setup-wizard / screens / folder-screen — step 2.
 *
 * User selects their anime library folder. In this prototype the "Select
 * Folder" button is a mock — it sets `folderSelected = true` and reveals a
 * mock card showing "/storage/anime-library — 247 items detected" with a
 * checkmark. The Next button stays disabled until a folder is selected.
 */
import type { ThemePalette } from "../lib/themes";
import { FolderOpen } from "../components/illustrations";

interface FolderScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  folderSelected: boolean;
  setFolderSelected: (selected: boolean) => void;
  palette: ThemePalette;
}

export function FolderScreen({
  active,
  onNext,
  onBack,
  folderSelected,
  setFolderSelected,
  palette,
}: FolderScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        {/* Illustration */}
        <div className="illustration" key={active ? "on" : "off"}>
          <FolderOpen />
        </div>

        <h1 className="wizard-title">Select your anime folder</h1>
        <p className="wizard-subtitle">
          Pick the folder where your anime library lives. We&apos;ll scan it and
          organize everything for you.
        </p>

        {/* Select Folder button OR mock card with selected folder */}
        {!folderSelected ? (
          <button
            type="button"
            className="wizard-btn wizard-btn--primary"
            style={{
              background: palette.primary,
              color: palette.onPrimary,
              maxWidth: 280,
              animation: "pulse 2.4s ease-in-out infinite",
            }}
            onClick={() => setFolderSelected(true)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M12 11v5M9.5 13.5L12 16l2.5-2.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Select Folder
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
              {/* Folder SVG icon (NOT an emoji) */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="mock-info">
              <p className="mock-title">/storage/anime-library</p>
              <p className="mock-desc">247 items detected</p>
            </div>
            {/* Success checkmark */}
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
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          disabled={!folderSelected}
          style={{
            background: palette.primary,
            color: palette.onPrimary,
            opacity: folderSelected ? 1 : 0.4,
            cursor: folderSelected ? "pointer" : "not-allowed",
          }}
        >
          Next
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
