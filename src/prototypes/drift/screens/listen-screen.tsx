"use client";

/* ============================================================
   drift / screens / listen-screen.tsx — the #listen tab.

   Featured-show hero (full-bleed generative cover under a glass
   panel), "continue listening" card with the live waveform, and
   the shows grid. Tapping a grid card opens it in Browse.
   ============================================================ */

import type { CSSProperties } from "react";
import { useDrift } from "../state/drift-context";
import { FEATURED_SHOW_ID, SHOWS, fmtClock, showById } from "../lib/data";
import { CoverArt } from "../components/cover-art";
import { Waveform } from "../components/waveform";
import { HeartIcon, PauseIcon, PlayIcon } from "../components/icons";

interface ListenScreenProps {
  onOpenShow: (showId: string) => void;
}

export function ListenScreen({ onOpenShow }: ListenScreenProps) {
  const { now, show, episode, duration, play, togglePlay, subscriptions, toggleSubscribe } = useDrift();
  const featured = showById(FEATURED_SHOW_ID)!;
  const fresh = featured.episodes[0];
  const playingFeatured = now.showId === featured.id && now.playing;
  const followed = subscriptions.includes(featured.id);
  const played = Math.min(1, now.progress / duration);

  return (
    <section className="dr-screen" aria-label="Listen">
      <div className="dr-content">
        {/* featured hero — the glass layer is the veil (blurs the art into
            the panel); the frame itself stays blur-free (no glass-on-glass) */}
        <div className="dr-hero" style={{ ["--ep-accent" as string]: featured.accent } as CSSProperties}>
          <CoverArt show={featured} size={196} className="dr-hero__art" minimal cover />
          <div className="dr-hero__veil" aria-hidden="true" />
          <div className="dr-hero__body">
            <span className="dr-kicker">Featured today</span>
            <h2 className="dr-hero__title">{featured.title}</h2>
            <p className="dr-hero__sub">{featured.blurb}</p>
            <div className="dr-hero__row">
              <button
                className="dr-hero__play"
                type="button"
                style={{ ["--ep-accent" as string]: featured.accent } as CSSProperties}
                onClick={() => (playingFeatured ? togglePlay() : play(featured.id, fresh.id))}
                aria-label={playingFeatured ? "Pause Golden Hour" : "Play latest Golden Hour episode"}
              >
                {playingFeatured ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                <span>{playingFeatured ? "Playing" : "Play latest"}</span>
              </button>
              <button
                className={`dr-hero__follow${followed ? " is-on" : ""}`}
                type="button"
                onClick={() => toggleSubscribe(featured.id)}
                aria-pressed={followed}
              >
                <HeartIcon size={17} filled={followed} />
                <span>{followed ? "Following" : "Follow"}</span>
              </button>
            </div>
            <span className="dr-hero__ep">{fresh.dateLabel} · “{fresh.title}” · {fmtClock(fresh.seconds)}</span>
          </div>
        </div>

        {/* continue listening */}
        <h2 className="dr-sechead" style={{ ["--stagger" as string]: "90ms" } as CSSProperties}>Continue listening</h2>
        <div className="dr-cont dr-glass" style={{ ["--stagger" as string]: "130ms", ["--dr-blur" as string]: "22px" } as CSSProperties}>
          <button className="dr-cont__art" type="button" onClick={() => onOpenShow(show.id)} aria-label={`Open ${show.title}`}>
            <CoverArt show={show} size={64} minimal />
          </button>
          <div className="dr-cont__meta">
            <span className="dr-cont__show">{show.title}</span>
            <span className="dr-cont__ep">{episode.title}</span>
            <div className="dr-cont__wave">
              <Waveform
                seed={episode.id}
                bars={26}
                played={played}
                playing={now.playing}
                accent={show.accent}
                height={30}
              />
            </div>
            <div className="dr-cont__times tnum">
              <span>{fmtClock(now.progress)}</span>
              <span>-{fmtClock(Math.max(0, duration - now.progress))}</span>
            </div>
          </div>
          <button
            className="dr-cont__play"
            type="button"
            style={{ ["--ep-accent" as string]: show.accent } as CSSProperties}
            onClick={togglePlay}
            aria-label={now.playing ? "Pause" : "Resume"}
          >
            {now.playing ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </button>
        </div>

        {/* shows grid */}
        <h2 className="dr-sechead" style={{ ["--stagger" as string]: "190ms" } as CSSProperties}>In your orbit</h2>
        <div className="dr-grid">
          {SHOWS.map((s, i) => (
            <button
              key={s.id}
              className="dr-card dr-glass"
              style={{ ["--stagger" as string]: `${230 + i * 50}ms`, ["--dr-blur" as string]: "18px", ["--ep-accent" as string]: s.accent } as CSSProperties}
              type="button"
              onClick={() => onOpenShow(s.id)}
            >
              <CoverArt show={s} size={128} className="dr-card__art" minimal />
              <span className="dr-card__body">
                <span className="dr-card__title">{s.title}</span>
                <span className="dr-card__sub">{s.host} · {s.episodes.length} eps</span>
              </span>
              <span className="dr-card__go" aria-hidden="true">
                <PlayIcon size={13} />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
