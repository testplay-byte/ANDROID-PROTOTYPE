"use client";

/* atlas / screens / trip — the showcase bento.

   Tile hierarchy = information architecture: the destination hero spans
   both columns (it is the trip), weather is the next-most-frequent wide
   glance, the countdown is a tall 1x2 number, and the four utility
   tiles (flights / stay / budget / activities) are 1x1. Every owned
   tile taps into the expand overlay; the header itself is a tile grown
   from the grid (Chrome mandate: no large-title + floating pill). */

import { useAtlas } from "../state/atlas-context";
import { Tile, TileHead } from "../components/tile";
import { LandscapeArt } from "../components/landscape-art";
import {
  BedIcon,
  CalendarIcon,
  CompassIcon,
  SunIcon,
  PlaneIcon,
  WalletIcon,
  CheckIcon,
} from "../components/icons";
import {
  condLabel,
  daysUntilDeparture,
  departureLabel,
  greeting,
  money,
  packTotal,
} from "../lib/data";

export function TripScreen({ onGoPack }: { onGoPack?: () => void }) {
  const { trip, tripIdx, setTripIdx, trips, packedCount, setExpanded } = useAtlas();
  const d = trip;
  const until = daysUntilDeparture(d);
  const packed = packedCount(d.id);
  const total = packTotal();

  /* weather tile: mini forecast bars scaled to the week's extent */
  const tMax = Math.max(...d.forecast.map((f) => f.hi));
  const tMin = Math.min(...d.forecast.map((f) => f.lo));
  const span = Math.max(1, tMax - tMin);
  const today = d.forecast[0];

  const pct = Math.min(1, d.budget.spent / d.budget.total);
  const r = 22;
  const c = 2 * Math.PI * r;

  return (
    <div className="at-screen at-screen-trip">
      {/* header grown from the grid: one rounded tile, same gutter/radius */}
      <Tile className="at-head-tile" i={0}>
        <div className="at-head">
          <div className="at-head-txt">
            <span className="at-head-hi">{greeting()}</span>
            <span className="at-head-name">Atlas</span>
          </div>
          <div className="at-tripdots" role="tablist" aria-label="Switch trip">
            {trips.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === tripIdx}
                aria-label={`${t.city} trip`}
                className={"at-dot" + (i === tripIdx ? " on" : "")}
                onClick={() => setTripIdx(i)}
              />
            ))}
          </div>
        </div>
      </Tile>

      {/* hero: the next destination — generative landscape art */}
      <Tile wide i={1} tone="art" className="at-hero" label={`Open ${d.city} details`} onClick={() => setExpanded("destination")}>
        <LandscapeArt d={d} />
        <div className="at-hero-txt">
          <span className="at-hero-kicker">
            <CompassIcon size={12} strokeWidth={2.4} /> Next destination
          </span>
          <span className="at-hero-city">{d.city}</span>
          <span className="at-hero-country">
            {d.country} · {d.code} · {d.days} days
          </span>
        </div>
        <span className="at-hero-chip tnum">{departureLabel(d)}</span>
      </Tile>

      {/* weather 2x1: today + mini forecast bars */}
      <Tile wide i={2} className="at-wx" label="Open forecast" onClick={() => setExpanded("weather")}>
        <div className="at-wx-left">
          <TileHead icon={<SunIcon size={15} strokeWidth={2.2} />} title="Weather" />
          <span className="at-wx-temp tnum">{today.hi}°</span>
          <span className="at-wx-cond">{condLabel[today.cond]} · {d.city}</span>
        </div>
        <div className="at-wx-mini" aria-hidden="true">
          {d.forecast.map((f) => (
            <span className="at-wx-col" key={f.day}>
              <span
                className={"at-wx-bar wx-" + f.cond}
                style={{ height: `${26 + ((f.hi - tMin) / span) * 74}%` }}
              />
              <span className="at-wx-d">{f.day[0]}</span>
            </span>
          ))}
        </div>
      </Tile>

      {/* countdown 1x2: the big numeral */}
      <Tile tall i={3} className="at-count" label="Open destination" onClick={() => setExpanded("destination")}>
        <TileHead icon={<PlaneIcon size={15} strokeWidth={2.2} />} title="Departs" />
        <div className="at-count-mid">
          <span className="at-count-n tnum">{until}</span>
          <span className="at-count-l">days</span>
        </div>
        <span className="at-count-foot">{d.flights[0].when}</span>
      </Tile>

      {/* small utility tiles — 1x1, one job each */}
      <Tile i={4} className="at-ut" label="Open flights" onClick={() => setExpanded("flights")}>
        <TileHead icon={<PlaneIcon size={15} strokeWidth={2.2} />} title="Flights" />
        <span className="at-ut-big tnum">{d.flights[0].code}</span>
        <span className="at-ut-sub">
          {d.flights[0].from} → {d.flights[0].to} · <b className={d.flights[0].live ? "at-live" : ""}>{d.flights[0].status}</b>
        </span>
      </Tile>

      <Tile i={5} className="at-ut" label="Open stay" onClick={() => setExpanded("stay")}>
        <TileHead icon={<BedIcon size={15} strokeWidth={2.2} />} title="Stay" />
        <span className="at-ut-big at-ut-name">{d.stay.name}</span>
        <span className="at-ut-sub">{d.stay.area} · {d.stay.nights} nights</span>
      </Tile>

      <Tile i={6} className="at-ut" label="Open budget" onClick={() => setExpanded("budget")}>
        <TileHead icon={<WalletIcon size={15} strokeWidth={2.2} />} title="Budget" />
        <div className="at-ut-row">
          <svg viewBox="0 0 56 56" className="at-miniring" aria-hidden="true">
            <circle cx="28" cy="28" r={r} fill="none" stroke="var(--ring-track)" strokeWidth="6" />
            <circle
              cx="28"
              cy="28"
              r={r}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${c * pct} ${c}`}
              transform="rotate(-90 28 28)"
            />
          </svg>
          <div className="at-ut-rowtxt">
            <span className="at-ut-big tnum">{money(d.budget.spent, d.budget.currency)}</span>
            <span className="at-ut-sub">of {money(d.budget.total, d.budget.currency)}</span>
          </div>
        </div>
      </Tile>

      <Tile i={7} className="at-ut" label="Open activities" onClick={() => setExpanded("activities")}>
        <TileHead icon={<CalendarIcon size={15} strokeWidth={2.2} />} title="Activities" />
        <span className="at-ut-big tnum">{d.activities.length}</span>
        <span className="at-ut-sub">planned · {d.activities[0].name}</span>
      </Tile>

      {/* pack progress lives on Trip too — the tile links to #pack */}
      <Tile wide i={8} className="at-packmini" label="Open packing list" onClick={onGoPack}>
        <div className="at-packmini-txt">
          <TileHead icon={<CheckIcon size={15} strokeWidth={2.6} />} title="Packing" />
          <span className="at-ut-sub tnum">
            {packed} of {total} items · {d.city}
          </span>
        </div>
        <div className="at-packtrack" aria-hidden="true">
          <div
            className="at-packfill"
            style={{ width: `${(packed / total) * 100}%` }}
          />
        </div>
      </Tile>
    </div>
  );
}
