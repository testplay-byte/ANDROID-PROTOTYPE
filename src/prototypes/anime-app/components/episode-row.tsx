"use client";

/**
 * anime-app / components / episode-row — a single episode list entry.
 *
 * Redesigned layout (per user spec):
 *
 *   ┌───────────────────────────────────────────────┐  ← entry container
 *   │ ┌────────┬──────────────────────────────────┐ │     (uniform lighter bg)
 *   │ │        │ ┌────────────────────────────┐   │ │
 *   │ │ THUMB  │ │  Episode Title (with bg)   │   │ │  ← top section
 *   │ │ + ep#  │ └────────────────────────────┘   │ │     upper right: title
 *   │ │ badge  │ ┌────────────────────────────┐   │ │
 *   │ │        │ │ Jan 15 • SUB•DUB           │   │ │     lower right: date + sub/dub
 *   │ │        │ └────────────────────────────┘   │ │
 *   │ └────────┴──────────────────────────────────┘ │
 *   │ ┌──────────────────────────────────────────┐ │
 *   │ │  Description / synopsis text…            │ │  ← bottom section
 *   │ └──────────────────────────────────────────┘ │     (description only)
 *   └───────────────────────────────────────────────┘
 *
 * Key behaviors:
 *   - `showDecorativeBackgrounds`: when false, the colored chip backgrounds
 *     behind the episode number, release date, sub/dub, and title are
 *     hidden (labels render as plain text).
 *   - `allowTwoLineTitle`: when true, long titles wrap to a second line;
 *     when false, titles are clamped to a single line with ellipsis.
 *   - Sub/dub is always shown as full text "SUB•DUB" (or just "SUB" / "DUB").
 *   - Height is dynamic, driven by the thumbnail size.
 */
import type { EpisodeData } from "../lib/types";
import styles from "./episode-row.module.css";

interface EpisodeRowProps {
  episode: EpisodeData;
  /** Show/hide the decorative background chips behind labels + title. */
  showDecorativeBackgrounds: boolean;
  /** Allow the title to wrap onto a second line when long. */
  allowTwoLineTitle: boolean;
  /** Click handler (optional — row is clickable). */
  onClick?: () => void;
}

export function EpisodeRow({
  episode,
  showDecorativeBackgrounds,
  allowTwoLineTitle,
  onClick,
}: EpisodeRowProps) {
  // Build the sub/dub label: "SUB•DUB", "SUB", or "DUB".
  const parts: string[] = [];
  if (episode.subAvailable) parts.push("SUB");
  if (episode.dubAvailable) parts.push("DUB");
  const subDubLabel = parts.join("•") || "SUB";

  return (
    <div
      className={`${styles.entry} ${showDecorativeBackgrounds ? "" : styles.noDecor}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* ---- Top section: thumbnail (left) + title/meta (right) ---- */}
      <div className={styles.top}>
        {/* Thumbnail with episode-number badge overlay */}
        <div className={styles.thumbWrap}>
          {episode.thumbnail ? (
            <img
              src={episode.thumbnail}
              alt={`Episode ${episode.number}`}
              className={styles.thumb}
              loading="lazy"
            />
          ) : (
            <div className={styles.thumbPlaceholder} />
          )}
          <span
            className={`${styles.epBadge} ${showDecorativeBackgrounds ? "" : styles.plainLabel}`}
          >
            EP {episode.number}
          </span>
        </div>

        {/* Right side: two stacked sections (title on top, date+subdub below) */}
        <div className={styles.right}>
          {/* Upper right: title */}
          <div className={styles.titleWrap}>
            <span
              className={`${styles.title} ${allowTwoLineTitle ? styles.titleTwoLine : styles.titleOneLine}`}
            >
              {episode.title}
            </span>
          </div>

          {/* Lower right: release date + sub/dub */}
          <div className={styles.meta}>
            <span
              className={`${styles.dateBadge} ${showDecorativeBackgrounds ? "" : styles.plainLabel}`}
            >
              {episode.releaseDate}
            </span>
            <span
              className={`${styles.subDubBadge} ${showDecorativeBackgrounds ? "" : styles.plainLabel}`}
            >
              {subDubLabel}
            </span>
          </div>
        </div>
      </div>

      {/* ---- Bottom section: description only ---- */}
      <div className={styles.bottom}>
        <p className={styles.description}>{episode.description}</p>
      </div>
    </div>
  );
}
