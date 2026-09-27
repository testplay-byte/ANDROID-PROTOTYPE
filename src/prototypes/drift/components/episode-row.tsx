"use client";

/* ============================================================
   drift / components / episode-row.tsx — the shared episode row.

   Play button (shows the pause glyph when this row is the live
   one), title/date/duration, inline progress thread when it's
   the now-playing episode, and a download toggle. Used by
   Browse's episode list and both Library lists.
   ============================================================ */

import type { CSSProperties } from "react";
import { fmtMins, type Episode, type Show } from "../lib/data";
import { useDrift } from "../state/drift-context";
import { DownloadDoneIcon, DownloadIcon, PauseIcon, PlayIcon } from "./icons";

interface EpisodeRowProps {
  show: Show;
  episode: Episode;
  index: number;
}

export function EpisodeRow({ show, episode, index }: EpisodeRowProps) {
  const { now, play, togglePlay, toggleDownload, downloads } = useDrift();
  const live = now.showId === show.id && now.episodeId === episode.id;
  const downloaded = downloads.includes(episode.id);
  const played = live ? Math.min(1, now.progress / episode.seconds) : 0;

  return (
    <div
      className={`dr-eprow dr-glass${live ? " dr-eprow--live" : ""}`}
      style={{ ["--stagger" as string]: `${index * 55}ms`, ["--dr-blur" as string]: "18px" } as CSSProperties}
    >
      <button
        className="dr-eprow__play"
        type="button"
        aria-label={live && now.playing ? `Pause ${episode.title}` : `Play ${episode.title}`}
        style={{ ["--ep-accent" as string]: show.accent } as CSSProperties}
        onClick={() => (live ? togglePlay() : play(show.id, episode.id))}
      >
        {live && now.playing ? <PauseIcon size={15} /> : <PlayIcon size={15} />}
      </button>

      <button className="dr-eprow__text" type="button" onClick={() => (live ? togglePlay() : play(show.id, episode.id))}>
        <span className="dr-eprow__title">{episode.title}</span>
        <span className="dr-eprow__sub">
          {episode.dateLabel} · {fmtMins(episode.seconds)}
          {downloaded ? " · offline" : ""}
        </span>
        {live && (
          <span className="dr-eprow__thread" aria-hidden="true">
            <span className="dr-eprow__threadfill" style={{ transform: `scaleX(${played.toFixed(4)})`, background: show.accent }} />
          </span>
        )}
      </button>

      <button
        className={`dr-eprow__dl${downloaded ? " is-on" : ""}`}
        type="button"
        aria-label={downloaded ? `Remove download of ${episode.title}` : `Download ${episode.title}`}
        onClick={() => toggleDownload(episode.id)}
      >
        {downloaded ? <DownloadDoneIcon size={17} /> : <DownloadIcon size={17} />}
      </button>
    </div>
  );
}
