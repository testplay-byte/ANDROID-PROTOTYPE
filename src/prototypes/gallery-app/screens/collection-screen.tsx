"use client";

/**
 * CollectionScreen — permanent collection. Chrome experiment: instead of a
 * TopBar, a bordered segmented INDEX STRIP acts as the category filter
 * (00 ALL / 01 PAINTING / 02 SCULPTURE / 03 PRINT). Below it a count
 * ledger, a "NUR SAMMLUNG" (favourites-only) ink toggle, and the artwork
 * grid of generated plates. Favourites persist via gallery-context; the
 * diamond toggles them, the plate opens the full-screen PlateView.
 */

import { useState } from "react";
import { ArtTile } from "../components/art-tile";
import { IndexStrip, SectionLabel, TriadRule } from "../components/bits";
import { ARTWORKS, TRIAD_STUDY } from "../lib/data";
import type { ArtCategory } from "../lib/types";
import { useGallery } from "../state/gallery-context";
import styles from "./collection-screen.module.css";

type Filter = "all" | ArtCategory;

const FILTERS: { id: Filter; num: string; label: string }[] = [
  { id: "all", num: "00", label: "Alle" },
  { id: "painting", num: "01", label: "Gemälde" },
  { id: "sculpture", num: "02", label: "Plastik" },
  { id: "print", num: "03", label: "Grafik" },
];

export function CollectionScreen() {
  const { favorites, clearFavorites, showToast } = useGallery();
  const [filter, setFilter] = useState<Filter>("all");
  const [onlyFavs, setOnlyFavs] = useState(false);

  const shown = ARTWORKS.filter(
    (a) =>
      (filter === "all" || a.category === filter) &&
      (!onlyFavs || favorites.includes(a.id))
  );

  return (
    <div className={styles.root}>
      {/* segmented index strip = the chrome (no TopBar here) */}
      <div className={styles.stripHead}>
        <span className={styles.masthead}>
          <span className={styles.mastDisc} aria-hidden="true" />
          Sammlung — Galerie Bauhaus
        </span>
        <IndexStrip items={FILTERS} activeId={filter} onSelect={(id) => setFilter(id as Filter)} />
      </div>

      <div className={styles.content}>
        {/* ledger: counts + favourites-only toggle */}
        <div className={styles.ledger}>
          <div className={styles.ledgerCell}>
            <span className={styles.ledgerNum}>{shown.length}</span>
            <span className={styles.ledgerLabel}>im Saal</span>
          </div>
          <div className={styles.ledgerCell}>
            <span className={styles.ledgerNum}>{favorites.length}</span>
            <span className={styles.ledgerLabel}>gesammelt</span>
          </div>
          <button
            type="button"
            className={`${styles.favToggle} ${onlyFavs ? styles.favToggleOn : ""}`}
            aria-pressed={onlyFavs}
            onClick={() => {
              if (!onlyFavs && favorites.length === 0) {
                showToast("NOCH KEINE SAMMLUNG — TIPPE AUF EIN DIAMANT", "yellow");
                return;
              }
              setOnlyFavs(!onlyFavs);
            }}
          >
            {onlyFavs ? "ALLE WERKE" : "NUR SAMMLUNG"}
          </button>
        </div>

        <SectionLabel trailing={FILTERS.find((f) => f.id === filter)?.label.toUpperCase()}>
          Werke
        </SectionLabel>

        {shown.length > 0 ? (
          <div className={styles.grid}>
            {shown.map((a, i) => (
              <ArtTile key={a.id} art={a} index={i} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span className={styles.emptyQuarter} aria-hidden="true" />
            <p className={styles.emptyText}>
              {onlyFavs ? "Deine Sammlung ist leer." : "Kein Werk in dieser Kategorie."}
            </p>
          </div>
        )}

        {/* triad footer rule — the collection in three colours */}
        <div className={styles.footer}>
          <TriadRule />
          <div className={styles.footerChips}>
            {TRIAD_STUDY.map((t) => (
              <span key={t.id} className={styles.footerChip}>
                <span className={styles.footerSwatch} style={{ background: `var(${t.token})` }} />
                {t.label}
              </span>
            ))}
          </div>
          <p className={styles.footerNote}>
            Ein Klick auf den Diamanten legt das Werk in deine Sammlung — sie bleibt
            erhalten, auch nach dem Neuladen.
          </p>
        </div>

        {/* one-click clearing of the favourites ledger */}
        {favorites.length > 0 && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              clearFavorites();
              showToast("SAMMLUNG GELEERT", "blue");
            }}
          >
            SAMMLUNG LEEREN
          </button>
        )}
      </div>
    </div>
  );
}
