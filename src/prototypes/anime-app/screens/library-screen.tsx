"use client";

/**
 * anime-app / screens / library-screen — saved anime.
 *
 * localStorage-backed (useLibrary). Status tabs filter the list:
 * All / Watching / Completed / Plan to Watch. Each card has an X button
 * that opens a confirm dialog before removing. Clicking the card opens
 * the detail screen.
 *
 * Customizable via the LibraryCustomizeSheet (gear button in the topbar):
 *   - Layout: grid | list
 *   - Grid columns: 2–5
 *   - Text placement: below cover | on cover (overlay)
 */
import { useState } from "react";
import { useLibrary } from "../hooks/use-library";
import { useSettings } from "../hooks/use-settings";
import { useCollapsingHeader } from "../hooks/use-collapsing-header";
import { AnimeCard } from "../components/anime-card";
import { LibraryCustomizeSheet } from "../components/library-customize-sheet";
import { fmtScore } from "../lib/anilist";
import type { Anime, LibraryStatus } from "../lib/types";
import styles from "./library-screen.module.css";

interface LibraryScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

const TABS: { id: LibraryStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "watching", label: "Watching" },
  { id: "completed", label: "Completed" },
  { id: "plan", label: "Plan to Watch" },
];

export function LibraryScreen({ active, onOpenAnime }: LibraryScreenProps) {
  const { settings } = useSettings();
  const { items, remove } = useLibrary();
  const [filter, setFilter] = useState<LibraryStatus | "all">("all");
  const [pendingRemove, setPendingRemove] = useState<number | null>(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const { contentRef, collapsed } = useCollapsingHeader();

  // Filter by the active tab.
  const visible = filter === "all" ? items : items.filter((x) => x.status === filter);
  const pendingItem = items.find((x) => x.id === pendingRemove) ?? null;

  function confirmRemove() {
    if (pendingRemove != null) remove(pendingRemove);
    setPendingRemove(null);
  }

  function itemToAnime(id: number): Anime {
    const it = items.find((x) => x.id === id)!;
    return {
      id: it.id,
      title: { romaji: it.title, english: null },
      coverImage: { large: it.cover, extraLarge: it.cover },
      averageScore: it.score,
      format: it.format,
      episodes: it.episodes,
      seasonYear: null,
    };
  }

  const densityClass =
    settings.cardDensity === "compact"
      ? "results-grid--compact"
      : settings.cardDensity === "comfortable"
        ? "results-grid--comfortable"
        : "";

  const isGrid = settings.libraryLayout === "grid";
  const isOverlay = settings.libraryTextPlacement === "overlay";

  // Build a column-count style for grid mode.
  const gridStyle = isGrid
    ? { gridTemplateColumns: `repeat(${settings.libraryColumns}, minmax(0, 1fr))` }
    : undefined;

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="library"
      aria-label="Library"
      aria-hidden={!active}
    >
      <div className={`${styles.topbar} ${collapsed ? styles.topbarIsCollapsed : ""}`}>
        <h1 className={styles.topbarTitle}>Library</h1>
        <button
          type="button"
          className={styles.customizeBtn}
          aria-label="Customize library"
          onClick={() => setCustomizeOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
      <div ref={contentRef} className={styles.content}>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.tab} ${filter === t.id ? styles.tabIsActive : ""}`}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h3 className={styles.emptyStateTitle}>Your library is empty</h3>
            <p className={styles.emptyStateDesc}>
              Browse anime and add them to your library.
            </p>
          </div>
        ) : isGrid ? (
          /* ---- Grid layout ---- */
          <div
            className={`${styles.grid} results-grid ${densityClass} ${isOverlay ? styles.gridOverlay : ""}`}
            style={gridStyle}
          >
            {visible.map((item, i) => (
              <div key={item.id} className={styles.cardWrap}>
                <AnimeCard
                  anime={itemToAnime(item.id)}
                  index={i}
                  onClick={onOpenAnime}
                />
                <button
                  type="button"
                  className={styles.removeBtn}
                  aria-label="Remove from library"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPendingRemove(item.id);
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* ---- List layout ---- */
          <div className={styles.list}>
            {visible.map((item, i) => (
              <div key={item.id} className={styles.listRow} style={{ animationDelay: `${i * 40}ms` }}>
                <button
                  type="button"
                  className={styles.listItem}
                  onClick={() => onOpenAnime(item.id)}
                >
                  <div className={styles.listCover}>
                    <img src={item.cover} alt="" loading="lazy" />
                  </div>
                  <div className={styles.listInfo}>
                    <h3 className={styles.listTitle}>{item.title}</h3>
                    <div className={styles.listMeta}>
                      {item.format && <span>{item.format}</span>}
                      {item.episodes != null && <span>{item.episodes} ep</span>}
                      {item.score != null && (
                        <span className={styles.listScore}>★ {fmtScore(item.score)}</span>
                      )}
                    </div>
                    <span className={styles.listStatus}>{statusLabel(item.status)}</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={styles.listRemove}
                  aria-label="Remove from library"
                  onClick={() => setPendingRemove(item.id)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customize sheet */}
      <LibraryCustomizeSheet
        open={customizeOpen}
        onClose={() => setCustomizeOpen(false)}
      />

      {/* Confirm-delete dialog */}
      {pendingItem && (
        <div
          className="confirm-dialog is-visible"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm removal"
        >
          <div className="confirm-dialog__card">
            <h3 className="confirm-dialog__title">Remove from library?</h3>
            <p className="confirm-dialog__desc">
              &ldquo;{pendingItem.title}&rdquo; will be removed from your
              library.
            </p>
            <div className="confirm-dialog__actions">
              <button
                type="button"
                className="btn-outlined"
                onClick={() => setPendingRemove(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-filled"
                style={{ background: "var(--color-error)" }}
                onClick={confirmRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function statusLabel(s: LibraryStatus): string {
  if (s === "watching") return "Watching";
  if (s === "completed") return "Completed";
  return "Plan to Watch";
}
