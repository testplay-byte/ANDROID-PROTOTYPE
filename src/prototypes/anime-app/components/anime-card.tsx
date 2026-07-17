"use client";

/**
 * anime-app / components / anime-card — reusable result tile.
 *
 * Used in: home (seasonal + top-rated), search (results), library (saved).
 * Drives the global `[data-anime-id]` click → detail navigation, so the
 * parent must pass `onClick(id)` (the page-level handler). Staggered
 * fade-in is driven by `index` via inline `animationDelay`.
 *
 * Reads `singleLineTitles` from useSettings() to switch the title between
 * 1-line ellipsis and 2-line clamp.
 */
import type { Anime } from "../lib/types";
import { fmtScore } from "../lib/anilist";
import { useSettings } from "../hooks/use-settings";
import styles from "./anime-card.module.css";

interface AnimeCardProps {
  anime: Anime;
  index: number;
  onClick: (id: number) => void;
}

export function AnimeCard({ anime, index, onClick }: AnimeCardProps) {
  const { settings } = useSettings();
  const title = anime.title.romaji || anime.title.english || "Unknown";
  const cover = anime.coverImage.large || anime.coverImage.extraLarge || "";

  const metaParts: string[] = [];
  if (anime.format) metaParts.push(anime.format);
  if (anime.episodes) metaParts.push(`${anime.episodes} ep`);
  else if (anime.seasonYear) metaParts.push(String(anime.seasonYear));
  const meta = metaParts.join(" · ");

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 40}ms` }}
      data-anime-id={anime.id}
      onClick={() => onClick(anime.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(anime.id);
        }
      }}
    >
      <div className={`${styles.cover} anime-card__cover`}>
        {cover && <img src={cover} alt={title} loading="lazy" />}
        {anime.averageScore ? (
          <span className={styles.score}>
            <span className={styles.star}>★</span>
            {fmtScore(anime.averageScore)}
          </span>
        ) : null}
      </div>
      <h3
        className={`${styles.title} ${
          settings.singleLineTitles ? styles.titleSingle : ""
        }`}
      >
        {title}
      </h3>
      {meta && <span className={styles.meta}>{meta}</span>}
    </div>
  );
}
