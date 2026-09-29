"use client";

/**
 * aurora / screens / cities — the saved-locations view.
 *
 * This is the desktop multi-city workspace: a grid of city cards (3 → 2 → 1
 * columns as the window narrows), each selectable, each removable, plus an
 * add-city panel that actually adds. The search field is the "/" target the
 * top bar points at, and the add panel is reachable from the menu bar's City
 * entry as well as the button.
 */

import { useEffect, useRef } from "react";
import { CONDITIONS, formatTemp, ambienceById } from "../data";
import { useAurora } from "../state/aurora-context";
import {
  AmbienceIcon,
  ConditionIcon,
  DropletIcon,
  PlusIcon,
  RemoveIcon,
  SearchIcon,
  WindIcon,
} from "../components/icons";

export function CitiesScreen() {
  const {
    savedCities,
    catalogue,
    activeId,
    setActive,
    addCity,
    removeCity,
    unit,
    cityQuery,
    setCityQuery,
    addPanelOpen,
    setAddPanelOpen,
    go,
    notify,
  } = useAurora();
  const searchRef = useRef<HTMLInputElement>(null);

  /* the catalogue panel owns the search field while it is open */
  useEffect(() => {
    if (addPanelOpen) window.setTimeout(() => searchRef.current?.focus(), 40);
  }, [addPanelOpen]);

  const term = cityQuery.trim().toLowerCase();
  const matches = catalogue.filter(
    (c) =>
      !term ||
      c.name.toLowerCase().includes(term) ||
      c.region.toLowerCase().includes(term) ||
      c.country.toLowerCase().includes(term)
  );

  return (
    <div className="aur-view">
      <div className="aur-cities__bar">
        <label className="aur-input">
          <SearchIcon size={15} />
          <input
            ref={searchRef}
            value={cityQuery}
            placeholder="Search the catalogue to add a city…"
            onChange={(e) => setCityQuery(e.target.value)}
            aria-label="Search cities"
          />
          <span className="aur-kbd">/</span>
        </label>
        <button
          className="aur-btn aur-btn--filled"
          type="button"
          onClick={() => setAddPanelOpen(!addPanelOpen)}
          aria-expanded={addPanelOpen}
        >
          <PlusIcon size={15} />
          {addPanelOpen ? "Close catalogue" : "Add city"}
        </button>
        <span className="aur-panel__meta">
          {savedCities.length} saved · click a card to make it the active location
        </span>
      </div>

      {addPanelOpen && (
        <section className="aur-panel aur-addpanel">
          <header className="aur-addpanel__head">
            <div>
              <h2>Catalogue</h2>
              <p>{matches.length} location(s) you have not saved yet</p>
            </div>
            <button className="aur-iconbtn" type="button" aria-label="Close catalogue" onClick={() => setAddPanelOpen(false)}>
              <RemoveIcon size={16} />
            </button>
          </header>
          {matches.length === 0 ? (
            <p className="aur-addempty">
              {term
                ? `Nothing in the catalogue matches “${cityQuery}”.`
                : "Every catalogue city is already saved — remove one below to add it back."}
            </p>
          ) : (
            <div className="aur-addlist">
              {matches.map((c) => (
                <div className="aur-addrow" key={c.id}>
                  <span className="aur-week__icon">
                    <ConditionIcon id={c.condition} size={18} strokeWidth={1.6} />
                  </span>
                  <span className="aur-addrow__text">
                    <b>{c.name}</b>
                    <span>
                      {c.region}, {c.country} · {c.time}
                    </span>
                  </span>
                  <span className="aur-addrow__temp tnum">{formatTemp(c.tempC, unit)}</span>
                  <button
                    className="aur-btn"
                    type="button"
                    onClick={() => {
                      addCity(c.id);
                      setCityQuery("");
                    }}
                  >
                    <PlusIcon size={14} /> Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div className="aur-cities">
        {savedCities.map((c) => {
          const isActive = c.id === activeId;
          return (
            <article
              className="aur-panel aur-city"
              key={c.id}
              data-active={isActive ? "" : undefined}
              /* the card itself is the selection target; the buttons inside
                 keep their own actions, so ignore clicks that land on one */
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                setActive(c.id);
                notify(`${c.name} is now the active city`);
              }}
            >
              <div className="aur-city__top">
                <div>
                  <span className="aur-city__name">{c.name}</span>
                  <span className="aur-city__where">
                    {c.region}, {c.country} · {c.time} {c.offset}
                  </span>
                </div>
                <span className="aur-city__temp tnum">
                  <span className="aur-city__num">{formatTemp(c.tempC, unit)}</span>
                </span>
              </div>

              <div className="aur-city__cond">
                <ConditionIcon id={c.condition} size={18} strokeWidth={1.6} />
                <span>
                  {CONDITIONS[c.condition].label} · hi {formatTemp(c.highC, unit)} / lo{" "}
                  {formatTemp(c.lowC, unit)}
                </span>
              </div>

              <div className="aur-city__metrics">
                <div>
                  <span>
                    <DropletIcon size={11} /> Rain
                  </span>
                  <b>{c.precipChance}%</b>
                </div>
                <div>
                  <span>
                    <WindIcon size={11} /> Wind
                  </span>
                  <b>
                    {c.windKph} km/h {c.windLabel}
                  </b>
                </div>
                <div>
                  <span>Feels</span>
                  <b>{formatTemp(c.feelsC, unit)}</b>
                </div>
              </div>

              <div className="aur-city__tags">
                <span className="aur-chip">
                  <AmbienceIcon size={12} /> {ambienceById(c.ambience).label}
                </span>
                {isActive && <span className="aur-chip aur-chip--accent">Active</span>}
              </div>

              <div className="aur-city__actions">
                <button
                  className={isActive ? "aur-btn aur-btn--filled" : "aur-btn"}
                  type="button"
                  disabled={isActive}
                  onClick={() => {
                    setActive(c.id);
                    notify(`${c.name} is now the active city`);
                    go("now");
                  }}
                >
                  {isActive ? "Showing now" : "Make active"}
                </button>
                <button
                  className="aur-btn aur-btn--ghost"
                  type="button"
                  disabled={savedCities.length <= 1}
                  title={savedCities.length <= 1 ? "Aurora keeps at least one location" : `Remove ${c.name}`}
                  onClick={() => removeCity(c.id)}
                >
                  <RemoveIcon size={14} /> Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
