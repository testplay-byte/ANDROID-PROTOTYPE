"use client";

/* ============================================================
   drift / screens / browse-screen.tsx — the #browse tab.

   Warm category chips filter the curated rows; rows scroll
   horizontally with snap points. Selecting a show drops the
   view into a detail panel (in-place, no new route): header,
   follow button and the episode list.
   ============================================================ */

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import { CATEGORIES, SHOWS, type Show } from "../lib/data";
import { useDrift } from "../state/drift-context";
import { CoverArt } from "../components/cover-art";
import { EpisodeRow } from "../components/episode-row";
import { HeartIcon, PlayIcon, SearchIcon } from "../components/icons";

interface BrowseScreenProps {
  /** show opened from another tab ("In your orbit" cards) */
  openShowId: string | null;
  onConsumed: () => void;
  /** bumps when the header search button is pressed — focuses the field */
  searchSignal?: number;
}

const ROWS: { title: string; ids: string[]; tint: string }[] = [
  { title: "Editor's picks", ids: ["golden-hour", "nightbloom", "alpenglow", "signal-static"], tint: "#ffb45c" },
  { title: "Wind down", ids: ["understory", "tidal", "coastal-drift", "nightbloom"], tint: "#5eead4" },
  { title: "Long-form stories", ids: ["ember-talk", "alpenglow", "signal-static", "tidal"], tint: "#ff7a59" },
];

export function BrowseScreen({ openShowId, onConsumed, searchSignal = 0 }: BrowseScreenProps) {
  const { play, subscriptions, toggleSubscribe } = useDrift();
  const [category, setCategory] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const detailRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchSignal > 0) searchRef.current?.focus();
  }, [searchSignal]);

  useEffect(() => {
    if (openShowId) {
      setSelectedId(openShowId);
      onConsumed();
      window.setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  }, [openShowId, onConsumed]);

  const selected = useMemo(() => SHOWS.find((s) => s.id === selectedId) ?? null, [selectedId]);

  return (
    <section className="dr-screen" aria-label="Browse">
      <div className="dr-content">
        {/* category chips */}
        <div className="dr-cats" style={{ ["--stagger" as string]: "0ms" } as CSSProperties}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              className={`dr-cat${category === c ? " is-on" : ""}`}
              type="button"
              aria-pressed={category === c}
              style={{ ["--ep-accent" as string]: "#ffb45c" } as CSSProperties}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* curated rows — horizontal snap */}
        {ROWS.map((row, ri) => {
          const shows = row.ids.map((id) => SHOWS.find((s) => s.id === id)!).filter((s) => category === "All" || s.category === category);
          if (shows.length === 0) return null;
          return (
            <div key={row.title} style={{ ["--stagger" as string]: `${70 + ri * 60}ms` } as CSSProperties}>
              <h2 className="dr-sechead">{row.title}</h2>
              <div className="dr-row" style={{ ["--ep-accent" as string]: row.tint } as CSSProperties}>
                {shows.map((s) => (
                  <button
                    key={s.id}
                    className={`dr-rowcard${selectedId === s.id ? " is-selected" : ""}`}
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    style={{ ["--ep-accent" as string]: s.accent } as CSSProperties}
                  >
                    <CoverArt show={s} size={112} minimal />
                    <span className="dr-rowcard__title">{s.title}</span>
                    <span className="dr-rowcard__sub">{s.category}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {query.trim() && (() => {
          const q = query.trim().toLowerCase();
          const hits = SHOWS.filter(
            (s) => s.title.toLowerCase().includes(q) || s.host.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q),
          );
          if (hits.length === 0)
            return (
              <div className="dr-empty" style={{ ["--stagger" as string]: "240ms" } as CSSProperties}>
                <span className="dr-empty__mark"><SearchIcon size={22} /></span>
                <b>Nothing drifts under “{query.trim()}”</b>
                <span>Try a mood, a topic, or a host instead.</span>
              </div>
            );
          return (
            <div style={{ ["--stagger" as string]: "240ms" } as CSSProperties}>
              <h2 className="dr-sechead">All matches · {hits.length}</h2>
              <div className="dr-row" style={{ ["--ep-accent" as string]: "#ffb45c" } as CSSProperties}>
                {hits.map((s) => (
                  <button
                    key={s.id}
                    className={`dr-rowcard${selectedId === s.id ? " is-selected" : ""}`}
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    style={{ ["--ep-accent" as string]: s.accent } as CSSProperties}
                  >
                    <CoverArt show={s} size={112} minimal />
                    <span className="dr-rowcard__title">{s.title}</span>
                    <span className="dr-rowcard__sub">{s.category}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* show detail — in-place */}
        {selected && <ShowDetail show={selected} detailRef={detailRef} onPlay={(epId) => play(selected.id, epId)} followed={subscriptions.includes(selected.id)} onFollow={() => toggleSubscribe(selected.id)} />}
      </div>
    </section>
  );
}

function ShowDetail({
  show,
  detailRef,
  onPlay,
  followed,
  onFollow,
}: {
  show: Show;
  detailRef: RefObject<HTMLDivElement | null>;
  onPlay: (episodeId: string) => void;
  followed: boolean;
  onFollow: () => void;
}) {
  return (
    <div ref={detailRef} className="dr-detail dr-glass" style={{ ["--dr-blur" as string]: "26px", ["--ep-accent" as string]: show.accent } as CSSProperties}>
      <div className="dr-detail__head">
        <CoverArt show={show} size={86} />
        <div className="dr-detail__meta">
          <span className="dr-kicker">{show.category} · {show.episodes.length} episodes</span>
          <h2 className="dr-detail__title">{show.title}</h2>
          <p className="dr-detail__host">{show.host}</p>
          <p className="dr-detail__blurb">{show.blurb}</p>
        </div>
      </div>

      <div className="dr-detail__actions">
        <button className="dr-detail__play" type="button" style={{ ["--ep-accent" as string]: show.accent } as CSSProperties} onClick={() => onPlay(show.episodes[0].id)}>
          <PlayIcon size={17} />
          <span>Play latest</span>
        </button>
        <button className={`dr-hero__follow${followed ? " is-on" : ""}`} type="button" onClick={onFollow} aria-pressed={followed}>
          <HeartIcon size={17} filled={followed} />
          <span>{followed ? "Following" : "Follow"}</span>
        </button>
      </div>

      <h3 className="dr-detail__listhead">Episodes</h3>
      <div className="dr-epstack">
        {show.episodes.map((ep, i) => (
          <EpisodeRow key={ep.id} show={show} episode={ep} index={i} />
        ))}
      </div>
    </div>
  );
}
