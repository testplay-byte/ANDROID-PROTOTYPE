"use client";

/* ============================================================
   drift / screens / player-screen.tsx — the #player tab.

   The showcase screen: big cover on a tinted glow, a draggable
   glass scrubber (pointer down + move = live seek, click = jump),
   full transport (back-15 / prev / play / next / fwd-30), the
   segmented speed picker and the sleep-timer chips. Everything
   rides the now-playing state from DriftProvider, so the mini
   bar, the waveform and the scrubber stay in lockstep.
   ============================================================ */

import { useCallback, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { SPEEDS, SLEEP_OPTIONS, useDrift } from "../state/drift-context";
import { fmtClock } from "../lib/data";
import { CoverArt } from "../components/cover-art";
import { Waveform } from "../components/waveform";
import {
  Back15Icon,
  DownloadDoneIcon,
  DownloadIcon,
  Fwd30Icon,
  MoonIcon,
  NextTrackIcon,
  PauseIcon,
  PlayIcon,
  PrevTrackIcon,
} from "../components/icons";

export function PlayerScreen() {
  const { now, show, episode, duration, speed, setSpeed, sleepMin, setSleep, togglePlay, skip, seek, downloads, toggleDownload } = useDrift();
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const played = Math.min(1, now.progress / duration);
  const downloaded = downloads.includes(episode.id);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      seek(t * duration);
    },
    [duration, seek],
  );

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromClientX(e.clientX);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging.current) seekFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <section className="dr-screen dr-screen--player" aria-label="Player">
      <div className="dr-content dr-player">
        {/* cover + glow */}
        <div className="dr-player__coverwrap" style={{ ["--stagger" as string]: "0ms", ["--ep-accent" as string]: show.accent } as CSSProperties}>
          <span className="dr-player__glow" aria-hidden="true" />
          <CoverArt show={show} size={252} className="dr-player__cover" />
        </div>

        <div className="dr-player__meta" style={{ ["--stagger" as string]: "90ms" } as CSSProperties}>
          <span className="dr-kicker">{show.title}</span>
          <h2 className="dr-player__title">{episode.title}</h2>
          <p className="dr-player__sub">{episode.blurb}</p>
        </div>

        {/* scrubber */}
        <div className="dr-player__scrub dr-glass" style={{ ["--stagger" as string]: "140ms", ["--dr-blur" as string]: "22px", ["--ep-accent" as string]: show.accent } as CSSProperties}>
          <Waveform seed={episode.id} bars={34} played={played} playing={now.playing} accent={show.accent} height={38} className="dr-player__wave" />
          <div
            ref={trackRef}
            className="dr-scrub"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(now.progress)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span className="dr-scrub__rail" aria-hidden="true" />
            <span className="dr-scrub__fill" style={{ transform: `scaleX(${played.toFixed(4)})` } as CSSProperties} aria-hidden="true" />
            <span className="dr-scrub__knob" style={{ left: `${(played * 100).toFixed(3)}%` } as CSSProperties} aria-hidden="true" />
          </div>
          <div className="dr-scrub__times tnum">
            <span>{fmtClock(now.progress)}</span>
            <span>-{fmtClock(Math.max(0, duration - now.progress))}</span>
          </div>
        </div>

        {/* transport */}
        <div className="dr-player__transport" style={{ ["--stagger" as string]: "190ms", ["--ep-accent" as string]: show.accent } as CSSProperties}>
          <button className="dr-tp__side" type="button" aria-label="Back 15 seconds" onClick={() => seek(Math.max(0, now.progress - 15))}>
            <Back15Icon size={25} />
          </button>
          <button className="dr-tp__step" type="button" aria-label="Previous episode" onClick={() => skip(-1)}>
            <PrevTrackIcon size={23} />
          </button>
          <button className="dr-tp__play" type="button" aria-label={now.playing ? "Pause" : "Play"} onClick={togglePlay}>
            {now.playing ? <PauseIcon size={27} /> : <PlayIcon size={27} />}
          </button>
          <button className="dr-tp__step" type="button" aria-label="Next episode" onClick={() => skip(1)}>
            <NextTrackIcon size={23} />
          </button>
          <button className="dr-tp__side" type="button" aria-label="Forward 30 seconds" onClick={() => seek(Math.min(duration - 1, now.progress + 30))}>
            <Fwd30Icon size={25} />
          </button>
        </div>

        {/* speed + sleep + download */}
        <div className="dr-player__under" style={{ ["--stagger" as string]: "240ms", ["--ep-accent" as string]: show.accent } as CSSProperties}>
          <div className="dr-seg dr-glass" role="group" aria-label="Playback speed" style={{ ["--dr-blur" as string]: "16px" } as CSSProperties}>
            {SPEEDS.map((s) => (
              <button
                key={s}
                type="button"
                className={`dr-seg__btn${speed === s ? " is-on" : ""}`}
                aria-pressed={speed === s}
                onClick={() => setSpeed(s)}
              >
                {s === 1 ? "1×" : `${s}×`}
              </button>
            ))}
          </div>

          <div className="dr-sleep" role="group" aria-label="Sleep timer">
            <span className="dr-sleep__icon"><MoonIcon size={16} /></span>
            {SLEEP_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                className={`dr-sleep__chip${sleepMin === m ? " is-on" : ""}`}
                aria-pressed={sleepMin === m}
                onClick={() => setSleep(m)}
              >
                {m === 0 ? "Off" : `${m}m`}
              </button>
            ))}
          </div>

          <button
            className={`dr-player__dl${downloaded ? " is-on" : ""}`}
            type="button"
            onClick={() => toggleDownload(episode.id)}
            aria-pressed={downloaded}
            aria-label={downloaded ? "Remove download" : "Download episode"}
          >
            {downloaded ? <DownloadDoneIcon size={17} /> : <DownloadIcon size={17} />}
          </button>
        </div>
      </div>
    </section>
  );
}
