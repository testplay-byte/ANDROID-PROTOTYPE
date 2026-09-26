"use client";

/**
 * CollectionScreen — filter chips (ALL / PAINTING / SCULPTURE / PRINT)
 * over a grid of geometric artworks. Tapping a card toggles its favorite
 * (filled / outline ink heart).
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { GeometricArt } from "../components/geometric-art";
import { ARTWORKS, CATEGORY_LABELS } from "../lib/data";
import type { ArtCategory, Artwork } from "../lib/types";
import styles from "./collection-screen.module.css";

type Filter = "all" | ArtCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "painting", label: "PAINTING" },
  { id: "sculpture", label: "SCULPTURE" },
  { id: "print", label: "PRINT" },
];

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

export function CollectionScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [favs, setFavs] = useState<Record<number, boolean>>({});

  const shown: Artwork[] =
    filter === "all" ? ARTWORKS : ARTWORKS.filter((a) => a.category === filter);

  function toggleFav(id: number) {
    setFavs((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="Collection" subtitle="Permanent Works" />

      <div className={styles.content}>
        {/* Filter chips */}
        <div className={styles.chips} role="group" aria-label="Filter by category">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              className={`${styles.chip} ${filter === f.id ? styles.chipActive : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Art grid */}
        <div className={styles.grid}>
          {shown.map((a) => {
            const fav = !!favs[a.id];
            return (
              <button
                key={a.id}
                type="button"
                className={styles.artCard}
                aria-pressed={fav}
                aria-label={`${fav ? "Unfavorite" : "Favorite"} ${a.title}`}
                onClick={() => toggleFav(a.id)}
              >
                <div className={styles.artTop}>
                  <GeometricArt motif={a.motif} accent={a.accent} />
                  <span className={styles.heart} data-on={fav || undefined}>
                    <Heart filled={fav} />
                  </span>
                </div>
                <div className={styles.artBody}>
                  <span className={styles.artTitle}>{a.title}</span>
                  <span className={styles.artMeta}>
                    {a.artist} · {a.year} · {CATEGORY_LABELS[a.category]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {shown.length === 0 && (
          <p className={styles.empty}>Nothing in this category.</p>
        )}
      </div>
    </div>
  );
}
