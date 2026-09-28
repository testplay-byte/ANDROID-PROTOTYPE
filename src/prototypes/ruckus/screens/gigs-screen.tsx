"use client";

/* ruckus / screens / gigs — tonight's lineup as numbered poster rows.
   Row tap pushes the detail view (parent page holds the route). */

import * as React from "react";
import { GENRES, GIGS, bandById, venueById, type Genre } from "../lib/data";
import { useRuckus } from "../state/ruckus-context";
import { Marquee } from "../components/marquee";
import { Banner, Sticker } from "../components/chrome";

export function GigsScreen({ onOpenGig }: { onOpenGig: (gigId: number) => void }) {
  const { hasTicket } = useRuckus();
  const [genre, setGenre] = React.useState<Genre | "ALL">("ALL");
  const open = GIGS.filter((g) => genre === "ALL" || bandById(g.bandId)?.genre === genre);
  const ticker = `${open.length} SHOWS · ${GIGS.filter((g) => g.soldOut).length} SOLD OUT · TONIGHT`;

  return (
    <section className="rk-screen" aria-label="Gigs">
      <div className="rk-content">
        <div className="rk-poster" data-stagger="0">
          <span className="rk-poster__kicker">Live this week</span>
          <h1 className="rk-poster__title">RUCKUS</h1>
          <p className="rk-poster__sub">DIY gigs · loud rooms · no seated encore</p>
          <Sticker tone="flame" tilt={-3}>NEW WEEK</Sticker>
        </div>

        <div data-stagger="1">
          <Marquee items={[ticker]} />
        </div>

        {/* genre filters — square ink chips */}
        <div className="rk-chips" role="group" aria-label="Filter by genre" data-stagger="2">
          {(["ALL", ...GENRES] as (Genre | "ALL")[]).map((g) => (
            <button key={g} type="button" className={"rk-chip" + (genre === g ? " is-on" : "")} aria-pressed={genre === g} onClick={() => setGenre(g)}>
              {g}
            </button>
          ))}
        </div>

        {open.length === 0 ? (
          <div className="rk-empty" data-stagger="3">
            <b>NO SHOWS HERE.</b>
            <span>Try another genre.</span>
          </div>
        ) : (
          <div className="rk-list" data-stagger="3">
            {open.map((g, i) => {
              const band = bandById(g.bandId)!;
              const venue = venueById(g.venueId)!;
              const owned = hasTicket(g.id);
              return (
                <button key={g.id} type="button" className={"rk-row" + (g.soldOut ? " is-out" : "")} onClick={() => onOpenGig(g.id)}>
                  <span className="rk-row__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rk-row__main">
                    <b className="rk-row__band">{band.name}</b>
                    <span className="rk-row__meta">
                      {venue.name} · {g.time} · {g.day}
                    </span>
                  </span>
                  <span className="rk-row__price">
                    {g.soldOut ? <Sticker tone="flame" tilt={4}>SOLD OUT</Sticker> : owned ? <Sticker tone="ink" tilt={4}>GOT IT</Sticker> : <em>€{g.price}</em>}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <Banner n="—" tone="primary">DOORS AT 19:00</Banner>
      </div>
    </section>
  );
}
