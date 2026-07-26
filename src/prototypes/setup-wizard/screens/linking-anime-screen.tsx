"use client";
/**
 * setup-wizard / screens / linking-anime-screen — step 8.
 *
 * Shows the anime linking progress. At the top: stats (X linked, Y
 * unlinked, Z total). Below: a list of anime being linked — linked ones
 * show the matched name on the right, unlinked ones show "no match".
 *
 * A "Next" button advances to the manual linking screen (step 9).
 */
import { useEffect, useState } from "react";
import type { ThemePalette } from "../lib/themes";
import type { LinkedAnime } from "../hooks/use-wizard-state";

interface LinkingAnimeScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
  linkedAnime: LinkedAnime[];
}

export function LinkingAnimeScreen({ active, onNext, onBack, palette, linkedAnime }: LinkingAnimeScreenProps) {
  // Simulate progressive linking: reveal anime one by one.
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setRevealedCount(0);
      return;
    }
    setRevealedCount(0);
    const interval = setInterval(() => {
      setRevealedCount((c) => {
        if (c >= linkedAnime.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [active, linkedAnime.length]);

  const linkedCount = linkedAnime.filter((a) => a.linked).length;
  const unlinkedCount = linkedAnime.filter((a) => !a.linked).length;
  const allRevealed = revealedCount >= linkedAnime.length;

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Linking anime</h1>
        <p className="wizard-subtitle">
          Matching your backup entries to AniList…
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 8,
            width: "100%",
            maxWidth: 320,
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "var(--r-sm)",
              background: "var(--color-surface-2)",
              border: `1px solid ${palette.primary}33`,
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: palette.primary }}>
              {linkedCount}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600 }}>
              Linked
            </p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "var(--r-sm)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-error)33",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--color-error)" }}>
              {unlinkedCount}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600 }}>
              No match
            </p>
          </div>
          <div
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: "var(--r-sm)",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-surface-4)",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "var(--color-text)" }}>
              {linkedAnime.length}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "var(--color-text-muted)", fontWeight: 600 }}>
              Total
            </p>
          </div>
        </div>

        {/* Anime list (revealed progressively) */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 200,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {linkedAnime.slice(0, revealedCount).map((anime) => (
            <div
              key={anime.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "8px 12px",
                borderRadius: "var(--r-sm)",
                background: "var(--color-surface-2)",
                animation: "cardEntry 0.3s var(--ease-emphasized-decel) backwards",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                {anime.backupName}
              </span>
              {anime.linked ? (
                <span style={{ fontSize: 11, fontWeight: 600, color: palette.primary, flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {anime.matchedName}
                </span>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-error)", flexShrink: 0 }}>
                  No match
                </span>
              )}
            </div>
          ))}
          {/* Loading indicator while revealing */}
          {!allRevealed && (
            <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
              <span
                className="scanning-dots"
                aria-hidden="true"
                style={{ display: "inline-flex", gap: 4 }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.primary, display: "inline-block" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.primary, display: "inline-block" }} />
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.primary, display: "inline-block" }} />
              </span>
            </div>
          )}
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
          disabled={!allRevealed}
          style={{
            background: palette.primary,
            color: palette.onPrimary,
            fontWeight: 800,
            opacity: allRevealed ? 1 : 0.5,
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
