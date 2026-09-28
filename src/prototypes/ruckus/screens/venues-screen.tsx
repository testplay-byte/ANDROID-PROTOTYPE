"use client";

/* ruckus / screens / venues — list of rooms with a segmented
   capacity meter (hard blocks, no gradient) and each room's dates. */

import { GIGS, venueById } from "../lib/data";
import { Banner } from "../components/chrome";
import { PinIcon } from "../components/icons";

const VENUES = [...new Set(GIGS.map((g) => g.venueId))].map((id) => venueById(id)!);

export function VenuesScreen({ onOpenGig }: { onOpenGig: (gigId: number) => void }) {
  return (
    <section className="rk-screen" aria-label="Venues">
      <div className="rk-content">
        <header className="rk-slabhead">
          <h1 className="rk-h1">ROOMS</h1>
          <span className="rk-count">{VENUES.length} VENUES</span>
        </header>
        <Banner n="02" tone="primary">CAPACITY = LOUDNESS</Banner>

        <div className="rk-list">
          {VENUES.map((v, i) => {
            const gigs = GIGS.filter((g) => g.venueId === v.id);
            const load = Math.min(100, Math.round((gigs.length / 4) * 100));
            return (
              <div key={v.id} className="rk-venue">
                <div className="rk-venue__top">
                  <span className="rk-venue__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="rk-row__main">
                    <b className="rk-row__band">{v.name}</b>
                    <span className="rk-row__meta">
                      <PinIcon size={12} /> {v.area} · {v.distanceKm} km
                    </span>
                  </span>
                  <span className="rk-venue__cap tnum">{v.capacity}</span>
                </div>
                {/* capacity meter — segmented hard blocks */}
                <div className="rk-meter" aria-label={`${load}% booked`}>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((b) => (
                    <i key={b} className={b / 8 < load / 100 ? "is-on" : ""} />
                  ))}
                </div>
                <p className="rk-venue__note">{v.note}</p>
                <div className="rk-venue__gigs">
                  {gigs.map((g) => (
                    <button key={g.id} type="button" className="rk-minitag" onClick={() => onOpenGig(g.id)}>
                      {g.day} {g.time}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
