"use client";

/**
 * Player screen — now playing.
 *
 * Large circular album art in an extruded neumorphic ring, track meta with
 * a like button, an inset progress groove (seekable), and a transport row:
 * shuffle, prev, big play/pause (inset while playing), next, repeat.
 */

import { TopBar } from "../../../proto-kit";
import type { Track } from "../lib/data";
import { formatTime } from "../lib/data";
import {
  PlayIcon,
  PauseIcon,
  PrevIcon,
  NextIcon,
  ShuffleIcon,
  RepeatIcon,
  RepeatOneIcon,
  HeartIcon,
} from "../components/icons";
import styles from "./player-screen.module.css";

export interface PlayerScreenProps {
  track: Track;
  isPlaying: boolean;
  /** Seconds into the track. */
  progress: number;
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  liked: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onToggleLike: () => void;
}

export function PlayerScreen({
  track,
  isPlaying,
  progress,
  shuffle,
  repeat,
  liked,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleShuffle,
  onCycleRepeat,
  onToggleLike,
}: PlayerScreenProps) {
  const pct = Math.min(100, (progress / track.duration) * 100);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Now Playing" subtitle={track.album} />

      <div className={styles.content}>
        {/* Album art in an extruded ring */}
        <div className={styles.artWrap}>
          <div className={styles.ring}>
            <div className={`${styles.art} ${styles["art" + track.art]} ${isPlaying ? styles.artSpinning : ""}`}>
              <span className={styles.artHole} />
            </div>
          </div>
        </div>

        {/* Track meta + like */}
        <div className={styles.meta}>
          <div className={styles.metaText}>
            <span className={styles.title}>{track.title}</span>
            <span className={styles.artist}>{track.artist}</span>
          </div>
          <button
            type="button"
            className={`${styles.likeBtn} ${liked ? styles.likeActive : ""}`}
            onClick={onToggleLike}
            aria-label={liked ? "Unlike" : "Like"}
            aria-pressed={liked}
          >
            <HeartIcon size={22} filled={liked} />
          </button>
        </div>

        {/* Progress groove (inset) */}
        <div className={styles.progressBlock}>
          <div
            className={styles.groove}
            onClick={onSeek}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={track.duration}
            aria-valuenow={progress}
            aria-valuetext={`${formatTime(progress)} of ${formatTime(track.duration)}`}
            tabIndex={0}
          >
            <div className={styles.fill} style={{ width: `${pct}%` }}>
              <span className={styles.knob} />
            </div>
          </div>
          <div className={styles.times}>
            <span>{formatTime(progress)}</span>
            <span>-{formatTime(track.duration - progress)}</span>
          </div>
        </div>

        {/* Transport */}
        <div className={styles.transport}>
          <button
            type="button"
            className={`${styles.sideBtn} ${shuffle ? styles.sideActive : ""}`}
            onClick={onToggleShuffle}
            aria-label="Shuffle"
            aria-pressed={shuffle}
          >
            <ShuffleIcon size={20} />
          </button>

          <button type="button" className={styles.skipBtn} onClick={onPrev} aria-label="Previous track">
            <PrevIcon size={24} />
          </button>

          <button
            type="button"
            className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ""}`}
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon size={30} /> : <PlayIcon size={30} />}
          </button>

          <button type="button" className={styles.skipBtn} onClick={onNext} aria-label="Next track">
            <NextIcon size={24} />
          </button>

          <button
            type="button"
            className={`${styles.sideBtn} ${repeat !== "off" ? styles.sideActive : ""}`}
            onClick={onCycleRepeat}
            aria-label={`Repeat: ${repeat}`}
            aria-pressed={repeat !== "off"}
          >
            {repeat === "one" ? <RepeatOneIcon size={20} /> : <RepeatIcon size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
