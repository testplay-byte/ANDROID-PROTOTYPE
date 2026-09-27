"use client";

/* atlas / screens / places — the collection.

   Different tile grammar from Trip: a wide collection hero on top (the
   saved count IS the stat), then destination cards as 2-up bento pairs —
   each card a media tile with the generative landscape behind a muted
   scrim, city loud / country quiet, a days chip, and a bookmark button
   that flips the saved state (persisted via context). Tapping the city
   side makes that destination the active Trip and opens the expand. */

import { useAtlas } from "../state/atlas-context";
import { Tile } from "../components/tile";
import { LandscapeArt } from "../components/landscape-art";
import { PinIcon, StarIcon } from "../components/icons";
import { departureLabel } from "../lib/data";

export function PlacesScreen({ onGoTrip }: { onGoTrip?: () => void }) {
  const { trips, saved, isSaved, toggleSaved, setTripIdx, setExpanded } = useAtlas();

  return (
    <div className="at-screen at-screen-places">
      {/* collection hero — saved count as the big numeral */}
      <Tile wide i={0} className="at-coll">
        <div className="at-coll-txt">
          <span className="at-coll-n tnum">{saved.length}</span>
          <span className="at-coll-l">saved places</span>
        </div>
        <div className="at-coll-strip" aria-hidden="true">
          {trips.map((t) => (
            <span
              key={t.id}
              className={"at-coll-pip" + (isSaved(t.id) ? " on" : "")}
              style={{ background: isSaved(t.id) ? t.sky[1] : undefined }}
            />
          ))}
        </div>
        <span className="at-coll-sub">Tap a city to make it your next trip</span>
      </Tile>

      {/* destination cards — 2-up bento pairs straight on the grid */}
      {trips.map((t, i) => {
          const savedNow = isSaved(t.id);
          return (
            <Tile key={t.id} i={i + 1} tone="art" className={"at-pcard" + (savedNow ? " saved" : "")}>
              <LandscapeArt d={t} />
              <div
                className="at-pcard-hit"
                role="button"
                tabIndex={0}
                aria-label={`Plan ${t.city}`}
                onClick={() => {
                  /* switch tab FIRST (go() clears any open expand), then
                     re-open the destination view for this city */
                  if (onGoTrip) onGoTrip();
                  const idx = trips.findIndex((x) => x.id === t.id);
                  if (idx >= 0) setTripIdx(idx);
                  setExpanded("destination");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).click();
                  }
                }}
              />
              <div className="at-pcard-txt">
                <span className="at-pcard-city">{t.city}</span>
                <span className="at-pcard-country">{t.country}</span>
              </div>
              <span className="at-pcard-days tnum">{t.days}d</span>
              <span className="at-pcard-when">{departureLabel(t)}</span>
              <button
                type="button"
                className={"at-pcard-save" + (savedNow ? " on" : "")}
                aria-label={savedNow ? `Unsave ${t.city}` : `Save ${t.city}`}
                aria-pressed={savedNow}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaved(t.id);
                }}
              >
                {savedNow ? <StarIcon size={16} filled /> : <PinIcon size={16} strokeWidth={2.2} />}
              </button>
            </Tile>
          );
        })}
    </div>
  );
}
