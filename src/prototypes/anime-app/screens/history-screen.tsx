"use client";

/**
 * anime-app / screens / history-screen — recently viewed anime.
 *
 * localStorage-backed (useHistory). Renders one row per item with a
 * cover, title, and "5m ago" / "2h ago" timestamp. Clicking a row
 * re-opens the detail screen.
 *
 * History is automatically populated when the detail screen loads —
 * the page.tsx wires useAnimeDetail's result into useHistory.add().
 */
import { useHistory } from "../hooks/use-history";
import { timeAgo } from "../lib/anilist";
import styles from "./history-screen.module.css";

interface HistoryScreenProps {
  active: boolean;
  onOpenAnime: (id: number) => void;
}

export function HistoryScreen({ active, onOpenAnime }: HistoryScreenProps) {
  const { items } = useHistory();

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="history"
      aria-label="History"
      aria-hidden={!active}
    >
      <div className={styles.topbar}>
        <h1 className={styles.topbarTitle}>History</h1>
      </div>
      <div className={styles.content}>
        <div className={styles.tray}>
          {items.length === 0 ? (
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 className={styles.emptyStateTitle}>No history yet</h3>
              <p className={styles.emptyStateDesc}>
                Anime you view will appear here.
              </p>
            </div>
          ) : (
            <div className={styles.list}>
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={styles.row}
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                  onClick={() => onOpenAnime(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpenAnime(item.id);
                    }
                  }}
                >
                  <div className={styles.rowCover}>
                    {item.cover && (
                      <img
                        src={item.cover}
                        alt={item.title}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowTitle}>{item.title}</span>
                    <span className={styles.rowMeta}>
                      {timeAgo(item.viewedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
