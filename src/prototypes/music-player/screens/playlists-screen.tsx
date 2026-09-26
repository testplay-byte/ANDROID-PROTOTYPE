"use client";

/**
 * Playlists screen — 2-column grid of puffy playlist cards.
 * Each card: gradient cover + name + track count. Tapping a card plays the
 * first library track as a stand-in (prototype behavior) and presses in.
 */

import { TopBar } from "../../../proto-kit";
import { PLAYLISTS } from "../lib/data";
import { PlusIcon } from "../components/icons";
import styles from "./playlists-screen.module.css";

export function PlaylistsScreen({
  onOpenPlaylist,
}: {
  /** Called when a playlist card is tapped (plays a stand-in track). */
  onOpenPlaylist: (trackId: string) => void;
}) {
  return (
    <div className={styles.root}>
      <TopBar
        variant="large"
        title="Playlists"
        subtitle={`${PLAYLISTS.length} collections`}
        trailing={
          <button type="button" className={styles.newBtn} aria-label="New playlist">
            <PlusIcon size={20} />
          </button>
        }
      />

      <div className={styles.content}>
        <div className={styles.grid}>
          {PLAYLISTS.map((pl, i) => (
            <button
              type="button"
              key={pl.id}
              className={`${styles.card} stagger`}
              style={{ ["--stagger-i" as string]: i } as React.CSSProperties}
              onClick={() => onOpenPlaylist("t1")}
              aria-label={`Play playlist ${pl.name}, ${pl.trackCount} tracks`}
            >
              <span className={`${styles.cover} ${styles["cover" + pl.art]}`}>
                <span className={styles.coverHole} />
              </span>
              <span className={styles.cardName}>{pl.name}</span>
              <span className={styles.cardCount}>{pl.trackCount} tracks</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
