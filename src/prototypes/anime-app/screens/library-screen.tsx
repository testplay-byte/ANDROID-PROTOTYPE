"use client";

/**
 * anime-app / screens / library-screen — saved anime.
 *
 * localStorage-backed (useLibrary). Status tabs filter the list:
 * All / Watching / Completed / Plan to Watch. Each card has an X button
 * that opens a confirm dialog before removing. Clicking the card opens
 * the detail screen.
 *
 * Cards render via AnimeCard with a synthesized Anime object built from
 * the LibraryItem (which only stores the fields the library needs).
 */
import { useState } from "react";
import { useLibrary } from "../hooks/use-library";
import { useSettings } from "../hooks/use-settings";
import { AnimeCard } from "../components/anime-card";
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

  // Filter by the active tab.
  const visible = filter === "all" ? items : items.filter((x) => x.status === filter);

  // The confirm dialog state.
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

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="library"
      aria-label="Library"
      aria-hidden={!active}
    >
      <div className={styles.topbar}>
        <h1 className={styles.topbarTitle}>Library</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.tray}>
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
              <h3 className={styles.emptyStateTitle}>
                Your library is empty
              </h3>
              <p className={styles.emptyStateDesc}>
                Browse anime and add them to your library.
              </p>
            </div>
          ) : (
            <div className={`${styles.grid} results-grid ${densityClass}`}>
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
          )}
        </div>
      </div>

      {/* Confirm-delete dialog */}
      {pendingItem && (
        <div
          className={`confirm-dialog is-visible`}
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
