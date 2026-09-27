"use client";

/**
 * ArtTile — one artwork in a grid: 2px ink-bordered tile, generated square
 * plate, a corner diamond that toggles the collection favourite, and a
 * caption body. Tap the plate to open the full-screen PlateView.
 */

import type { CSSProperties } from "react";
import type { Artwork } from "../lib/types";
import { useGallery } from "../state/gallery-context";
import { GeometricArt } from "./geometric-art";
import artStyles from "./geometric-art.module.css";
import styles from "./art-tile.module.css";

export function ArtTile({ art, index = 0 }: { art: Artwork; index?: number }) {
  const { isFavorite, toggleFavorite, openPlate, showToast } = useGallery();
  const fav = isFavorite(art.id);

  return (
    <div
      className={styles.tile}
      style={{ ["--stagger" as string]: `${Math.min(index, 7) * 45}ms` } as CSSProperties}
    >
      <button
        type="button"
        className={styles.plateBtn}
        onClick={() => openPlate(art.id)}
        aria-label={`Open plate: ${art.title}`}
      >
        <GeometricArt
          motif={art.motif}
          accent={art.accent}
          className={`${styles.art} ${artStyles.noBorder}`}
        />
        <span className={styles.roomTag}>{art.room}</span>
      </button>

      <div className={styles.body}>
        <button
          type="button"
          className={styles.diamondBtn}
          aria-pressed={fav}
          aria-label={fav ? `Remove ${art.title} from collection` : `Save ${art.title} to collection`}
          onClick={() => {
            const nowOn = toggleFavorite(art.id);
            showToast(
              nowOn ? "ZUR SAMMLUNG GELEGT" : "AUS DER SAMMLUNG ENFERNT",
              nowOn ? "yellow" : "blue"
            );
          }}
        >
          <span className={`${styles.diamond} ${fav ? styles.diamondOn : ""}`} aria-hidden="true" />
        </button>
        <div className={styles.caption}>
          <span className={styles.title}>{art.title}</span>
          <span className={styles.meta}>
            {art.artist} · {art.year}
          </span>
        </div>
      </div>
    </div>
  );
}
