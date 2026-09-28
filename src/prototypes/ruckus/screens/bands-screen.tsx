"use client";

/* ruckus / screens / bands — grid of band cards with generative
   cover art, follow toggle, and a tap-through to the band's first gig. */

import { BANDS, GENRES, gigsForBand } from "../lib/data";
import { useRuckus } from "../state/ruckus-context";
import { Cover } from "../components/cover";
import { Banner, Sticker } from "../components/chrome";
import { BoltIcon } from "../components/icons";

export function BandsScreen({ onOpenGig }: { onOpenGig: (gigId: number) => void }) {
  const { isFollowed, toggleFollow, followed } = useRuckus();
  const sorted = [...BANDS].sort((a, b) => (isFollowed(b.id) ? 1 : 0) - (isFollowed(a.id) ? 1 : 0) || b.followers - a.followers);

  return (
    <section className="rk-screen" aria-label="Bands">
      <div className="rk-content">
        <header className="rk-slabhead">
          <h1 className="rk-h1">BANDS</h1>
          <span className="rk-count">{followed.length} FOLLOWED</span>
        </header>
        <Banner n="01" tone="flame">{GENRES.length} GENRES · {BANDS.length} ACTIVE</Banner>

        <div className="rk-grid">
          {sorted.map((b) => (
            <div key={b.id} className="rk-card">
              <button type="button" className="rk-card__art" onClick={() => { const g = gigsForBand(b.id)[0]; if (g) onOpenGig(g.id); }} aria-label={`Open ${b.name}`}>
                <Cover band={b} size={96} />
                <Sticker tone={b.followers > 1200 ? "flame" : "ink"} tilt={-3}>
                  {b.followers > 1200 ? "LOUD" : "RISING"}
                </Sticker>
              </button>
              <div className="rk-card__body">
                <b className="rk-card__name">{b.name}</b>
                <span className="rk-card__meta">{b.genre} · {b.followers} fans</span>
                <button
                  type="button"
                  className={"rk-follow rk-follow--sm" + (isFollowed(b.id) ? " is-on" : "")}
                  aria-pressed={isFollowed(b.id)}
                  onClick={() => toggleFollow(b.id)}
                >
                  <BoltIcon size={14} />
                  {isFollowed(b.id) ? "FOLLOWING" : "FOLLOW"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
