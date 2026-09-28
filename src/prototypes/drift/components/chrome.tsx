"use client";

/* ============================================================
   drift / components / chrome.tsx — the floating glass chrome.

   - DrHeader:    glass pill (title left, search + avatar right)
                  pinned over the scroll; content slides under it.
   - DrMiniPlayer: persistent now-playing glass bar above the nav
                  dock while an episode is loaded; tap → player.
   - DrToast:     transient glass pill for state feedback.

   The nav dock itself is proto-kit's <BottomNav variant="glass">;
   drift.css re-positions it (and the mini-player) as a pair.
   ============================================================ */

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useDrift } from "../state/drift-context";
import { fmtClock } from "../lib/data";
import { CoverArt } from "./cover-art";
import {
  CheckIcon,
  DownloadIcon,
  HeartIcon,
  InfoIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  SearchIcon,
} from "./icons";

const TITLES: Record<string, string> = {
  listen: "Drift",
  browse: "Browse",
  player: "Now Playing",
  library: "Library",
};

export function DrHeader({ view, onSearch }: { view: string; onSearch: () => void }) {
  return (
    <header className="dr-glass dr-head" style={{ ["--dr-blur" as string]: "22px" } as CSSProperties}>
      <div className="dr-head__brand">
        <span className="dr-head__mark" aria-hidden="true">
          <span /><span /><span />
        </span>
        <h1 className="dr-head__title">{TITLES[view] ?? "Drift"}</h1>
      </div>
      <div className="dr-head__actions">
        <button className="dr-head__iconbtn" aria-label="Search shows" type="button" onClick={onSearch}>
          <SearchIcon size={19} />
        </button>
        <button className="dr-head__avatar" aria-label="Your profile" type="button">
          <span>AV</span>
        </button>
      </div>
    </header>
  );
}

export function DrMiniPlayer({ onOpen }: { onOpen: () => void }) {
  const { now, show, episode, duration, togglePlay } = useDrift();
  const played = Math.min(1, now.progress / duration);

  return (
    <div className="dr-glass dr-mini" style={{ ["--dr-blur" as string]: "24px" } as CSSProperties} data-playing={now.playing || undefined}>
      <button className="dr-mini__body" onClick={onOpen} type="button" aria-label="Open player">
        <CoverArt show={show} size={40} minimal />
        <span className="dr-mini__meta">
          <span className="dr-mini__title">{episode.title}</span>
          <span className="dr-mini__sub">{show.title} · {fmtClock(duration - now.progress)} left</span>
        </span>
      </button>
      <button
        className="dr-mini__play"
        onClick={togglePlay}
        type="button"
        aria-label={now.playing ? "Pause" : "Play"}
      >
        {now.playing ? <PauseIcon size={17} /> : <PlayIcon size={17} />}
      </button>
      <span className="dr-mini__line" aria-hidden="true">
        <span className="dr-mini__linefill" style={{ transform: `scaleX(${played.toFixed(4)})` }} />
      </span>
    </div>
  );
}

export function DrToast() {
  const { toast } = useDrift();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setShown(true);
    const t = window.setTimeout(() => setShown(false), 2200);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  const Icon = toast.icon === "download" ? DownloadIcon
    : toast.icon === "heart" ? HeartIcon
    : toast.icon === "moon" ? MoonIcon
    : toast.icon === "play" ? PlayIcon
    : toast.icon === "check" ? CheckIcon
    : InfoIcon;

  return (
    <div className={`dr-toast dr-glass${shown ? " is-in" : ""}`} role="status">
      {Icon ? <Icon size={16} /> : null}
      <span>{toast.msg}</span>
    </div>
  );
}
