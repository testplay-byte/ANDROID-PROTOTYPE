"use client";

/**
 * Library screen — all tracks.
 * Tap a row to load the song into the Player (shared page state) and start
 * playback. The current track shows an animated equalizer glyph.
 */

import { TopBar } from "../../../proto-kit";
import { TRACKS } from "../lib/data";
import { formatTime } from "../lib/data";
import { HeartIcon, PauseIcon, PlayIcon } from "../components/icons";
import styles from "./library-screen.module.css";

export interface LibraryScreenProps {
  currentTrackId: string;
  isPlaying: boolean;
  likedIds: string[];
  onPlayTrack: (id: string) => void;
  onToggleLike: (id: string) => void;
}

export function LibraryScreen({
  currentTrackId,
  isPlaying,
  likedIds,
  onPlayTrack,
  onToggleLike,
}: LibraryScreenProps) {
  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Library" subtitle={`${TRACKS.length} tracks`} />

      <div className={styles.content}>
        {TRACKS.map((track, i) => {
          const isCurrent = track.id === currentTrackId;
          const liked = likedIds.includes(track.id);
          return (
            <button
              type="button"
              key={track.id}
              className={`${styles.row} ${isCurrent ? styles.rowCurrent : ""} stagger`}
              style={{ ["--stagger-i" as string]: i } as React.CSSProperties}
              onClick={() => onPlayTrack(track.id)}
              aria-label={`Play ${track.title} by ${track.artist}`}
            >
              <span className={`${styles.thumb} ${styles["thumb" + track.art]}`}>
                {isCurrent && (
                  <span className={styles.thumbIcon}>
                    {isPlaying ? (
                      <>
                        <span className={styles.eqBar} />
                        <span className={`${styles.eqBar} ${styles.eqBar2}`} />
                        <span className={`${styles.eqBar} ${styles.eqBar3}`} />
                      </>
                    ) : (
                      <PlayIcon size={14} />
                    )}
                  </span>
                )}
              </span>

              <span className={styles.rowText}>
                <span className={`${styles.rowTitle} ${isCurrent ? styles.rowTitleCurrent : ""}`}>
                  {track.title}
                </span>
                <span className={styles.rowArtist}>
                  {track.artist} — {track.album}
                </span>
              </span>

              <span
                className={styles.like}
                role="button"
                tabIndex={0}
                aria-label={liked ? "Unlike" : "Like"}
                aria-pressed={liked}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(track.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleLike(track.id);
                  }
                }}
              >
                <HeartIcon size={18} filled={liked} />
              </span>

              <span className={`${styles.duration} ${isCurrent ? styles.rowTitleCurrent : ""}`}>
                {isCurrent && isPlaying ? <PauseIcon size={14} /> : formatTime(track.duration)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
