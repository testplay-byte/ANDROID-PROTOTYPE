"use client";
/**
 * setup-wizard / screens / manual-linking-screen — step 9.
 *
 * Shows the unlinked anime. User can click any unlinked anime to open
 * the search overlay, search for the correct match, and link it. Linked
 * anime disappear from the list.
 *
 * A "Continue" button advances to the restore summary screen (step 10).
 */
import { useState } from "react";
import type { ThemePalette } from "../lib/themes";
import type { LinkedAnime } from "../hooks/use-wizard-state";

interface ManualLinkingScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  palette: ThemePalette;
  linkedAnime: LinkedAnime[];
  onLink: (id: number, matchedName: string) => void;
}

/** Mock search results for the manual linking search overlay. */
const MOCK_SEARCH_RESULTS = [
  "Demon Slayer: Hashira Training Arc",
  "Kimetsu no Yaiba: Hashira Geiko-hen",
  "Demon Slayer Season 4",
  "Demon Slayer: To the Swordsmith Village",
  "Kimetsu no Yaiba: Yuukaku-hen",
];

export function ManualLinkingScreen({
  active,
  onNext,
  onBack,
  palette,
  linkedAnime,
  onLink,
}: ManualLinkingScreenProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);

  const unlinked = linkedAnime.filter((a) => !a.linked);
  const selectedAnime = linkedAnime.find((a) => a.id === selectedAnimeId);

  const handleOpenSearch = (anime: LinkedAnime) => {
    setSelectedAnimeId(anime.id);
    setSearchQuery(anime.backupName);
    setSearchOpen(true);
  };

  const handleSelectResult = (result: string) => {
    if (selectedAnimeId !== null) {
      onLink(selectedAnimeId, result);
    }
    setSearchOpen(false);
    setSelectedAnimeId(null);
    setSearchQuery("");
  };

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content">
        <h1 className="wizard-title" style={{ fontWeight: 800 }}>Manual linking</h1>
        <p className="wizard-subtitle">
          {unlinked.length > 0
            ? `${unlinked.length} anime need your help. Tap any entry to search for a match.`
            : "All anime are linked! You're ready to continue."}
        </p>

        {/* Unlinked anime list */}
        <div
          style={{
            width: "100%",
            maxWidth: 320,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            maxHeight: 280,
            overflowY: "auto",
            scrollbarWidth: "none",
          }}
        >
          {unlinked.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                borderRadius: "var(--r-md)",
                background: "var(--color-surface-2)",
                border: `1px solid ${palette.primary}33`,
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={palette.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 8px" }}>
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: palette.primary }}>
                All linked!
              </p>
            </div>
          ) : (
            unlinked.map((anime) => (
              <button
                key={anime.id}
                type="button"
                onClick={() => handleOpenSearch(anime)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  padding: "10px 12px",
                  borderRadius: "var(--r-sm)",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-surface-4)",
                  cursor: "pointer",
                  textAlign: "left",
                  animation: "cardEntry 0.3s var(--ease-emphasized-decel) backwards",
                  transition: "background 0.15s var(--ease-standard)",
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  {anime.backupName}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-text-muted)", flexShrink: 0, display: "flex", alignItems: "center", gap: 3 }}>
                  Search
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            ))
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
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
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

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            background: "var(--color-bg)",
            display: "flex",
            flexDirection: "column",
            animation: "cardEntry 0.3s var(--ease-emphasized-decel)",
          }}
        >
          {/* Search header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderBottom: "1px solid var(--color-surface-3)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSelectedAnimeId(null);
              }}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "none",
                background: "var(--color-surface-2)",
                color: "var(--color-text)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div style={{ flex: 1, position: "relative" }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for anime…"
                autoFocus
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px 0 36px",
                  borderRadius: "var(--r-pill)",
                  border: "1px solid var(--color-surface-4)",
                  background: "var(--color-surface-2)",
                  color: "var(--color-text)",
                  fontSize: 13,
                  outline: "none",
                }}
              />
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ position: "absolute", left: 12, top: 12 }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>

          {/* Search info */}
          <div style={{ padding: "8px 16px", fontSize: 11, color: "var(--color-text-muted)" }}>
            Linking: <b style={{ color: "var(--color-text)" }}>{selectedAnime?.backupName}</b>
          </div>

          {/* Search results */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {MOCK_SEARCH_RESULTS
              .filter((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((result, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectResult(result)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: "var(--r-sm)",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-surface-4)",
                    cursor: "pointer",
                    textAlign: "left",
                    animation: "cardEntry 0.2s var(--ease-emphasized-decel) backwards",
                    animationDelay: `${i * 0.05}s`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 44,
                      borderRadius: 4,
                      background: `linear-gradient(135deg, ${palette.primary}44, ${palette.primary}22)`,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text)", flex: 1 }}>
                    {result}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={palette.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
              ))}
            {MOCK_SEARCH_RESULTS.filter((r) => r.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
              <div style={{ padding: 24, textAlign: "center", color: "var(--color-text-muted)", fontSize: 12 }}>
                No results found. Try a different search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
