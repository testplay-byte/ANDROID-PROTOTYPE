"use client";

/* atlas / components / expand — the signature interaction.

   Any tile that owns a data view (destination hero, weather, flights,
   stay, budget, activities) writes `expanded` in atlas-context; this
   overlay morphs out of the grid into a full-screen tile (~300ms scale +
   fade, emphasized easing) and collapses back on the in-header chevron.
   It lives at page level so both Trip and Places can drive it. */

import { useAtlas } from "../state/atlas-context";
import type { ExpandedTile } from "../state/atlas-context";
import { condLabel, daysUntilDeparture, money } from "../lib/data";
import { LandscapeArt } from "./landscape-art";
import {
  BedIcon,
  CalendarIcon,
  ChevronLeftIcon,
  CloudIcon,
  PartIcon,
  PlaneIcon,
  RainIcon,
  SunIcon,
} from "./icons";

const TITLES: Record<Exclude<ExpandedTile, null>, string> = {
  destination: "Destination",
  weather: "Forecast",
  flights: "Flights",
  stay: "Where you're staying",
  budget: "Budget",
  activities: "Activities",
};

function CondIcon({ cond, size = 16 }: { cond: "sun" | "part" | "rain" | "cloud"; size?: number }) {
  if (cond === "sun") return <SunIcon size={size} strokeWidth={2.2} />;
  if (cond === "part") return <PartIcon size={size} strokeWidth={2.2} />;
  if (cond === "rain") return <RainIcon size={size} strokeWidth={2.2} />;
  return <CloudIcon size={size} strokeWidth={2.2} />;
}

export function ExpandOverlay() {
  const { expanded, setExpanded, trip, showToast } = useAtlas();
  if (!expanded) return null;

  const close = () => setExpanded(null);
  const d = trip;

  /* temperature extent for the bar scale */
  const his = d.forecast.map((f) => f.hi);
  const los = d.forecast.map((f) => f.lo);
  const tMax = Math.max(...his);
  const tMin = Math.min(...los);
  const span = Math.max(1, tMax - tMin);

  const pct = Math.min(1, d.budget.spent / d.budget.total);
  const ringR = 42;
  const ringC = 2 * Math.PI * ringR;

  return (
    <div className="at-expand" role="dialog" aria-modal="true" aria-label={TITLES[expanded]}>
      <header className="at-expand-head">
        <button type="button" className="at-expand-back" onClick={close} aria-label="Back to grid">
          <ChevronLeftIcon size={20} />
        </button>
        <div className="at-expand-titles">
          <span className="at-expand-kicker">
            {d.city} · {d.code}
          </span>
          <h1 className="at-expand-title">{TITLES[expanded]}</h1>
        </div>
      </header>

      <div className="at-expand-body">
        {expanded === "destination" ? (
          <>
            <div className="at-artbox at-expand-art">
              <LandscapeArt d={d} />
              <div className="at-expand-artlabels">
                <span className="at-hero-city">{d.city}</span>
                <span className="at-hero-country">
                  {d.country} · {d.days} days
                </span>
              </div>
            </div>
            <p className="at-expand-blurb">{d.blurb}</p>
            <div className="at-factgrid">
              <div className="at-fact">
                <span className="at-fact-n tnum">{daysUntilDeparture(d)}</span>
                <span className="at-fact-l">days to go</span>
              </div>
              <div className="at-fact">
                <span className="at-fact-n tnum">{d.stay.nights}</span>
                <span className="at-fact-l">nights</span>
              </div>
              <div className="at-fact">
                <span className="at-fact-n tnum">{d.activities.length}</span>
                <span className="at-fact-l">planned</span>
              </div>
              <div className="at-fact">
                <span className="at-fact-n">{d.stay.rating.toFixed(1)}</span>
                <span className="at-fact-l">stay rating</span>
              </div>
            </div>
            <button
              type="button"
              className="at-expand-cta"
              onClick={() => showToast(`${d.city} itinerary shared`, "plane")}
            >
              Share itinerary
            </button>
          </>
        ) : null}

        {expanded === "weather" ? (
          <div className="at-wx-rows">
            {d.forecast.map((f) => (
              <div className="at-wx-row" key={f.day}>
                <span className="at-wx-day">{f.day}</span>
                <span className="at-wx-ic">
                  <CondIcon cond={f.cond} />
                </span>
                <span className="at-wx-cond">{condLabel[f.cond]}</span>
                <span className="at-wx-lo tnum">{f.lo}°</span>
                <span className="at-wx-barslot">
                  <span
                    className={"at-wx-bar wx-" + f.cond}
                    style={{
                      height: `${20 + ((f.hi - tMin) / span) * 80}%`,
                    }}
                  />
                </span>
                <span className="at-wx-hi tnum">{f.hi}°</span>
              </div>
            ))}
          </div>
        ) : null}

        {expanded === "flights" ? (
          <div className="at-flights">
            {d.flights.map((f) => (
              <div className="at-flight" key={f.code}>
                <div className="at-flight-top">
                  <span className="at-flight-code">{f.code}</span>
                  <span className={"at-flight-status" + (f.live ? " live" : "")}>
                    <i aria-hidden="true" />
                    {f.status}
                  </span>
                </div>
                <div className="at-flight-route">
                  <span className="at-flight-ac tnum">{f.from}</span>
                  <span className="at-flight-line">
                    <PlaneIcon size={13} strokeWidth={2.4} />
                  </span>
                  <span className="at-flight-ac tnum">{f.to}</span>
                </div>
                <div className="at-flight-meta">
                  <span>{f.when}</span>
                  <span>Seat {f.seat}</span>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {expanded === "stay" ? (
          <div className="at-stay">
            <div className="at-stay-icon">
              <BedIcon size={22} />
            </div>
            <h2 className="at-stay-name">{d.stay.name}</h2>
            <p className="at-stay-area">{d.stay.area}</p>
            <div className="at-stay-rows">
              <div className="at-stay-row">
                <span>Check-in</span>
                <b>{d.stay.checkIn}</b>
              </div>
              <div className="at-stay-row">
                <span>Check-out</span>
                <b>{d.stay.checkOut}</b>
              </div>
              <div className="at-stay-row">
                <span>Nights</span>
                <b className="tnum">{d.stay.nights}</b>
              </div>
              <div className="at-stay-row">
                <span>Guest rating</span>
                <b className="tnum">{d.stay.rating.toFixed(1)} / 5</b>
              </div>
            </div>
          </div>
        ) : null}

        {expanded === "budget" ? (
          <div className="at-budget">
            <div className="at-ringwrap">
              <svg viewBox="0 0 104 104" className="at-ring" aria-hidden="true">
                <circle cx="52" cy="52" r={ringR} fill="none" stroke="var(--ring-track)" strokeWidth="9" />
                <circle
                  cx="52"
                  cy="52"
                  r={ringR}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${ringC * pct} ${ringC}`}
                  transform="rotate(-90 52 52)"
                  className="at-ring-fill"
                />
              </svg>
              <div className="at-ring-center">
                <span className="at-ring-big tnum">{Math.round(pct * 100)}%</span>
                <span className="at-ring-sub">spent</span>
              </div>
            </div>
            <p className="at-budget-line tnum">
              {money(d.budget.spent, d.budget.currency)} of{" "}
              {money(d.budget.total, d.budget.currency)}
            </p>
            <div className="at-buckets">
              {d.budget.buckets.map((b) => (
                <div className="at-bucket" key={b.label}>
                  <span className="at-bucket-dot" style={{ background: b.color }} aria-hidden="true" />
                  <span className="at-bucket-label">{b.label}</span>
                  <span className="at-bucket-track">
                    <span
                      className="at-bucket-fill"
                      style={{
                        width: `${(b.amount / d.budget.spent) * 100}%`,
                        background: b.color,
                      }}
                    />
                  </span>
                  <span className="at-bucket-amt tnum">{money(b.amount, d.budget.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {expanded === "activities" ? (
          <ol className="at-acts">
            {d.activities.map((a) => (
              <li className="at-act" key={a.name}>
                <span className="at-act-time tnum">{a.time}</span>
                <span className="at-act-line" aria-hidden="true" />
                <span className="at-act-body">
                  <span className="at-act-name">{a.name}</span>
                  <span className="at-act-where">
                    <CalendarIcon size={12} strokeWidth={2.4} />
                    {a.where}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
    </div>
  );
}
