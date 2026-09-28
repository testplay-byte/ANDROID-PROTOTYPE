"use client";

/* ruckus / screens / gig-detail — the pushed gig view.
   Poster header, slab facts, GET TICKETS slab (visible without
   scrolling) and the band's other dates. */

import { bandById, gigById, gigsForBand, venueById } from "../lib/data";
import { useRuckus } from "../state/ruckus-context";
import { Cover } from "../components/cover";
import { Sticker } from "../components/chrome";
import { BackIcon, ClockIcon, CrowdIcon, PinIcon, TicketIcon } from "../components/icons";

export function GigDetail({ gigId, onBack, onOpenGig }: { gigId: number; onBack: () => void; onOpenGig: (id: number) => void }) {
  const { hasTicket, buyTicket, isFollowed, toggleFollow, showToast } = useRuckus();
  const gig = gigById(gigId);
  if (!gig) return null;
  const band = bandById(gig.bandId)!;
  const venue = venueById(gig.venueId)!;
  const owned = hasTicket(gig.id);
  const others = gigsForBand(band.id).filter((g) => g.id !== gig.id);

  return (
    <section className="rk-screen rk-detail" aria-label={`${band.name} gig`}>
      <div className="rk-content">
        <header className="rk-dhead">
          <button type="button" className="rk-back" onClick={onBack} aria-label="Back to gigs">
            <BackIcon size={18} />
          </button>
          <span className="rk-dhead__crumb">{band.genre} / {gig.day}</span>
        </header>

        {/* poster: huge name stacked, rotated stickers, flat cover art */}
        <div className="rk-poster rk-poster--detail">
          <Cover band={band} size={120} />
          <h1 className="rk-poster__title">{band.name}</h1>
          <p className="rk-poster__sub">{band.blurb}</p>
          {gig.soldOut ? <Sticker tone="flame" tilt={-3}>SOLD OUT</Sticker> : null}
        </div>

        {/* facts — 3px ink slabs, no shadows, plenty of padding */}
        <div className="rk-slabs">
          <div className="rk-slab">
            <PinIcon size={16} />
            <span>
              <b>{venue.name}</b>
              <em>{venue.area}</em>
            </span>
          </div>
          <div className="rk-slab">
            <ClockIcon size={16} />
            <span>
              <b>{gig.day} · {gig.time}</b>
              <em>{gig.date} · doors open</em>
            </span>
          </div>
          <div className="rk-slab">
            <CrowdIcon size={16} />
            <span>
              <b>{venue.capacity} cap</b>
              <em>{venue.distanceKm} km away</em>
            </span>
          </div>
        </div>

        {/* primary CTA — always visible, no scroll needed */}
        <button
          type="button"
          className={"rk-cta" + (owned ? " is-owned" : "")}
          disabled={gig.soldOut && !owned}
          onClick={() => {
            buyTicket(gig.id);
            showToast(`${band.name} · ticket bought`, "flame");
          }}
        >
          <TicketIcon size={20} />
          <span>{gig.soldOut ? "SOLD OUT" : owned ? "TICKET IN YOUR WALLET" : `GET TICKETS · €${gig.price}`}</span>
        </button>

        <button
          type="button"
          className={"rk-follow" + (isFollowed(band.id) ? " is-on" : "")}
          aria-pressed={isFollowed(band.id)}
          onClick={() => toggleFollow(band.id)}
        >
          {isFollowed(band.id) ? "FOLLOWING" : "FOLLOW BAND"}
        </button>

        {others.length > 0 && (
          <div className="rk-list">
            <div className="rk-listhead">MORE DATES</div>
            {others.map((g) => {
              const v = venueById(g.venueId)!;
              return (
                <button key={g.id} type="button" className="rk-row" onClick={() => onOpenGig(g.id)}>
                  <span className="rk-row__main">
                    <b className="rk-row__band">{g.day} · {g.time}</b>
                    <span className="rk-row__meta">{v.name}</span>
                  </span>
                  <span className="rk-row__price">{g.soldOut ? <Sticker tone="flame" tilt={4}>OUT</Sticker> : <em>€{g.price}</em>}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
