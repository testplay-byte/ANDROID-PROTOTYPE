"use client";

/**
 * PlateView — the full-screen artwork "plate": a gallery-wall presentation
 * built entirely in CSS. Bordered plate, museum caption, triad colour chips
 * (tap one to re-ink the composition), and a diamond favourite toggle.
 * Rendered by page.tsx above everything else; shows nothing while plateId
 * is null. Swipe right / ZURÜCK closes it (page.tsx wires the gesture).
 */

import { useEffect, useState } from "react";
import { ARTWORK_BY_ID, CATEGORY_LABELS } from "../lib/data";
import type { Accent } from "../lib/types";
import { useGallery } from "../state/gallery-context";
import { GeometricArt } from "./geometric-art";
import styles from "./plate-view.module.css";

const ACCENTS: Accent[] = ["red", "blue", "yellow"];
const ACCENT_LABELS: Record<Accent, string> = {
  red: "ROT",
  blue: "BLAU",
  yellow: "GELB",
};

export function PlateView() {
  const { plateId, closePlate, isFavorite, toggleFavorite, showToast } = useGallery();
  const [override, setOverride] = useState<Accent | null>(null);

  // Reset the colour override whenever a new plate opens.
  useEffect(() => setOverride(null), [plateId]);

  if (plateId == null) return null;
  const art = ARTWORK_BY_ID[plateId];
  if (!art) return null;

  const accent: Accent = override ?? art.accent;
  const fav = isFavorite(art.id);

  function onChip(a: Accent) {
    setOverride(a);
  }

  function onFav() {
    const nowOn = toggleFavorite(art.id);
    showToast(
      nowOn ? `${art.title.toUpperCase()} — GESAMMELT` : "AUS DER SAMMLUNG ENFERNT",
      nowOn ? "yellow" : "blue"
    );
  }

  return (
    <div className={styles.root} role="dialog" aria-label={`${art.title}, artwork plate`}>
      {/* top bar: close + room tag */}
      <div className={styles.topRow}>
        <button type="button" className={styles.closeBtn} onClick={closePlate}>
          <span className={styles.closeGlyph} aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
              <path d="M2 2l10 10M12 2 2 12" />
            </svg>
          </span>
          ZURÜCK
        </button>
        <span className={styles.roomTag}>{art.room}</span>
      </div>

      {/* the plate itself — bordered mat with the composition inside */}
      <div className={styles.plateWrap}>
        <div className={styles.mat}>
          <GeometricArt key={accent} motif={art.motif} accent={accent} className={styles.plateArt} />
        </div>
      </div>

      {/* caption block */}
      <div className={styles.caption}>
        <div className={styles.captionTop}>
          <div className={styles.captionMeta}>
            <h2 className={styles.title}>{art.title}</h2>
            <p className={styles.artist}>
              {art.artist} · {art.year}
            </p>
            <p className={styles.tech}>
              {CATEGORY_LABELS[art.category]} · {art.medium} · {art.dimensions}
            </p>
            <p className={styles.note}>{art.note}</p>
          </div>
          <button
            type="button"
            className={styles.favBtn}
            aria-pressed={fav}
            aria-label={fav ? "Remove from collection" : "Add to collection"}
            onClick={onFav}
          >
            <span className={`${styles.diamond} ${fav ? styles.diamondOn : ""}`} aria-hidden="true" />
          </button>
        </div>

        {/* triad colour chips — re-ink the plate */}
        <div className={styles.chipsRow} role="group" aria-label="Plate colour">
          {ACCENTS.map((a) => (
            <button
              key={a}
              type="button"
              className={styles.chip}
              data-accent={a}
              data-on={a === accent || undefined}
              onClick={() => onChip(a)}
            >
              <span className={styles.chipSwatch} aria-hidden="true" />
              {ACCENT_LABELS[a]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
