"use client";

/* cities screen — search, add/open results, saved city cards
   (exact port of the reference screens/cities.js) */

import { useState } from "react";
import { CITIES, CITY_BY_ID, COND_LABEL } from "../lib/data";
import { deg } from "../lib/prefs";
import { cityWeather } from "../lib/engine";
import { UiIcon, WxIcon } from "../components/icons";
import { useWeather } from "../state/weather-context";

export function CitiesScreen() {
  const { prefs, addFavorite, removeFavorite, selectCity } = useWeather();
  const [query, setQuery] = useState("");

  const saved = prefs.favorites.map((id) => CITY_BY_ID[id]).filter(Boolean);
  const q = query.trim().toLowerCase();
  const hits = q
    ? CITIES.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q))
    : [];

  return (
    <>
      <div className="search-wrap">
        <svg className="s-ic" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.4" />
          <path d="M15.8 15.8 20.4 20.4" />
        </svg>
        <input
          className="search-input wa-search"
          type="search"
          placeholder="Search city or country…"
          autoComplete="off"
          aria-label="Search cities"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            const first = hits[0];
            if (!first) return;
            if (prefs.favorites.includes(first.id)) selectCity(first.id);
            else {
              addFavorite(first.id);
              setQuery("");
            }
          }}
        />
        {query && (
          <button className="search-clear show" aria-label="Clear search" onClick={() => setQuery("")}>
            <UiIcon name="x" size={13} />
          </button>
        )}
      </div>

      <div className="results">
        {q &&
          (hits.length ? (
            hits.map((c) => {
              const wxc = cityWeather(c);
              const isSaved = prefs.favorites.includes(c.id);
              return (
                <button
                  key={c.id}
                  className="result-row"
                  onClick={() => {
                    if (isSaved) selectCity(c.id);
                    else {
                      addFavorite(c.id);
                      setQuery("");
                    }
                  }}
                >
                  <span className="r-ic" style={isSaved ? { color: "var(--gold)" } : undefined}>
                    <UiIcon name={isSaved ? "star" : "pin"} size={14} />
                  </span>
                  <span>
                    <span className="r-name">{c.name}</span>
                    <br />
                    <span className="r-country">
                      {c.country} · {isSaved ? "saved — tap to open" : COND_LABEL[wxc.current.code]}
                    </span>
                  </span>
                  <span className="r-temp">{deg(wxc.current.temp, prefs.unit)}</span>
                  <span className="r-add">
                    <UiIcon name={isSaved ? "check" : "plus"} size={14} />
                  </span>
                </button>
              );
            })
          ) : (
            <div className="empty">
              <span className="e-ic">
                <UiIcon name="search" size={20} />
              </span>
              <b>No cities found</b>
              <span>
                Try{" "}
                {CITIES.filter((c) => !prefs.favorites.includes(c.id))
                  .slice(0, 2)
                  .map((c) => `“${c.name}”`)
                  .join(" or ")}{" "}
                — or search by country name.
              </span>
            </div>
          ))}
      </div>

      <div className="sec-head">
        <span className="sec-title">Saved cities</span>
        <span className="sec-sub">{saved.length} places</span>
      </div>
      <div className="stack-12">
        {saved.map((c) => {
          const wxc = cityWeather(c);
          const cur = prefs.city === c.id;
          return (
            <button key={c.id} className={"city-card" + (cur ? " current" : "")} aria-label={`Open ${c.name} weather`} onClick={() => selectCity(c.id)}>
              <span className="c-info">
                <span className="c-name">
                  <span className="star">
                    <UiIcon name="star" size={14} />
                  </span>
                  {c.name} {cur && <span className="badge-now">Current</span>}
                </span>
                <span className="c-country">
                  {c.country} · {wxc.localTime} local
                </span>
                <span className="c-cond">
                  {COND_LABEL[wxc.current.code]} · Humidity {c.rh}%
                </span>
              </span>
              <span className="c-right">
                <span className="c-temp">{deg(wxc.current.temp, prefs.unit)}</span>
                <span className="c-hl">
                  H:{deg(wxc.daily[0].hi, prefs.unit)} L:{deg(wxc.daily[0].lo, prefs.unit)}
                </span>
              </span>
              <span className="c-ic">
                <WxIcon code={wxc.current.code} isDay={wxc.current.isDay} size={37} />
              </span>
              <span
                className="c-del"
                role="button"
                aria-label={`Remove ${c.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(c.id);
                }}
              >
                <UiIcon name="trash" size={12} />
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
