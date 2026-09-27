"use client";

/* ============================================================
   drift / screens / library-screen.tsx — the #library tab.

   Segmented sections (Downloads / Following / History) over
   stateful lists: download rows reuse the shared episode row
   (toggle off), follows can unfollow, history replays from the
   saved progress and can be cleared. Empty states in glass.
   ============================================================ */

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useDrift } from "../state/drift-context";
import { findEpisode, showById } from "../lib/data";
import { CoverArt } from "../components/cover-art";
import { EpisodeRow } from "../components/episode-row";
import { HeadphonesIcon, HeartIcon, StackIcon, TrashIcon } from "../components/icons";

type Section = "downloads" | "following" | "history";

const SECTIONS: { id: Section; label: string; icon: (p: { size?: number }) => ReactNode }[] = [
  { id: "downloads", label: "Downloads", icon: (p) => <StackIcon {...p} /> },
  { id: "following", label: "Following", icon: (p) => <HeartIcon {...p} /> },
  { id: "history", label: "History", icon: (p) => <HeadphonesIcon {...p} /> },
];

export function LibraryScreen() {
  const { downloads, subscriptions, history, clearHistory, play, now } = useDrift();
  const [section, setSection] = useState<Section>("downloads");

  const downloadEpisodes = useMemo(
    () => downloads.map((id) => findEpisode(id)).filter((f) => f !== undefined),
    [downloads],
  );

  return (
    <section className="dr-screen" aria-label="Library">
      <div className="dr-content">
        {/* section picker — segmented glass */}
        <div className="dr-seg dr-glass" role="tablist" aria-label="Library sections" style={{ ["--dr-blur" as string]: "16px" } as CSSProperties}>
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={section === s.id}
                className={`dr-seg__btn dr-seg__btn--wide${section === s.id ? " is-on" : ""}`}
                onClick={() => setSection(s.id)}
              >
                <Icon size={15} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* downloads */}
        {section === "downloads" && (
          <div className="dr-liblist" key="dl">
            {downloadEpisodes.length === 0 ? (
              <EmptyGlass
                stagger={0}
                title="Nothing saved yet"
                desc="Tap the download arrow on any episode to keep it with you offline."
              />
            ) : (
              <>
                <div className="dr-libstats" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
                  <b className="tnum">{downloadEpisodes.length}</b> episodes ·{" "}
                  <b className="tnum">{Math.round(downloadEpisodes.reduce((n, f) => n + f.episode.seconds, 0) / 360) / 10}h</b> listening
                </div>
                {downloadEpisodes.map((f, i) => (
                  <EpisodeRow key={f.episode.id} show={f.show} episode={f.episode} index={i} />
                ))}
              </>
            )}
          </div>
        )}

        {/* following */}
        {section === "following" && (
          <div className="dr-liblist" key="subs">
            {subscriptions.length === 0 ? (
              <EmptyGlass stagger={0} title="No follows yet" desc="Follow a show from its cover in Listen or Browse and it lands here." />
            ) : (
              subscriptions.map((id, i) => {
                const s = showById(id);
                if (!s) return null;
                const live = now.showId === s.id;
                return (
                  <div
                    className="dr-follow dr-glass"
                    key={s.id}
                    style={{ ["--stagger" as string]: `${i * 55}ms`, ["--dr-blur" as string]: "18px", ["--ep-accent" as string]: s.accent } as CSSProperties}
                  >
                    <CoverArt show={s} size={54} minimal />
                    <button className="dr-follow__text" type="button" onClick={() => play(s.id, s.episodes[0].id)}>
                      <span className="dr-follow__title">{s.title}</span>
                      <span className="dr-follow__sub">{s.host} · {s.episodes.length} episodes{live ? " · playing" : ""}</span>
                    </button>
                    <FollowButton showId={s.id} />
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* history */}
        {section === "history" && (
          <div className="dr-liblist" key="hist">
            {history.length === 0 ? (
              <EmptyGlass stagger={0} title="Nothing heard yet" desc="Episodes you play show up here with where you left off." />
            ) : (
              <>
                <div className="dr-libstats" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
                  <b className="tnum">{history.length}</b> recently played
                  <button className="dr-libclear" type="button" onClick={clearHistory}>
                    <TrashIcon size={14} /> <span>Clear</span>
                  </button>
                </div>
                {history.map((h, i) => {
                  const f = findEpisode(h.episodeId);
                  if (!f) return null;
                  const live = now.episodeId === f.episode.id;
                  const progress = live ? now.progress : Math.min(f.episode.seconds * 0.72, f.episode.seconds);
                  return (
                    <div
                      className="dr-hist dr-glass"
                      key={h.episodeId}
                      style={{ ["--stagger" as string]: `${i * 55}ms`, ["--dr-blur" as string]: "18px", ["--ep-accent" as string]: f.show.accent } as CSSProperties}
                    >
                      <CoverArt show={f.show} size={50} minimal />
                      <button className="dr-hist__text" type="button" onClick={() => play(f.show.id, f.episode.id, progress)}>
                        <span className="dr-hist__title">{f.episode.title}</span>
                        <span className="dr-hist__sub">
                          {f.show.title} · {live ? "in progress" : "restarts at "+Math.round((progress / f.episode.seconds) * 100) + "%"}
                        </span>
                        <span className="dr-hist__bar" aria-hidden="true">
                          <span style={{ transform: `scaleX(${(progress / f.episode.seconds).toFixed(3)})`, background: f.show.accent }} />
                        </span>
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function FollowButton({ showId }: { showId: string }) {
  const { subscriptions, toggleSubscribe } = useDrift();
  const on = subscriptions.includes(showId);
  return (
    <button className={`dr-follow__btn${on ? " is-on" : ""}`} type="button" aria-pressed={on} onClick={() => toggleSubscribe(showId)}>
      <HeartIcon size={15} filled={on} />
      <span>{on ? "Following" : "Follow"}</span>
    </button>
  );
}

function EmptyGlass({ title, desc, stagger }: { title: string; desc: string; stagger: number }) {
  return (
    <div className="dr-empty dr-glass" style={{ ["--stagger" as string]: `${stagger}ms`, ["--dr-blur" as string]: "22px" } as CSSProperties}>
      <span className="dr-empty__mark"><HeadphonesIcon size={26} /></span>
      <b>{title}</b>
      <span>{desc}</span>
    </div>
  );
}
