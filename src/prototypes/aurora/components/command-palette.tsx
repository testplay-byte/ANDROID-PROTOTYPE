"use client";

/**
 * aurora / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: one overlay that jumps to a view, switches the
 * active city, flips units, cycles the glass recipe or changes the ambience
 * scene. A phone prototype would need a whole search screen for the same job,
 * which is exactly why the desktop build is its own app.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { AMBIENCES, CONDITIONS, formatTemp } from "../data";
import { VIEWS, useAurora, type ViewId } from "../state/aurora-context";
import { ConditionIcon, ContrastIcon, SearchIcon, LayersIcon } from "./icons";

type Entry = {
  kind: "View" | "City" | "Action" | "Ambience";
  id: string;
  label: string;
  hint: string;
};

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    go,
    unit,
    toggleUnit,
    setActive,
    savedCities,
    setAmbience,
    ambience,
    cycleGlass,
    glass,
    notify,
  } = useAurora();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Entry[]>(() => {
    const term = q.trim().toLowerCase();
    const hit = (...words: string[]) => !term || words.some((w) => w.toLowerCase().includes(term));

    const views: Entry[] = VIEWS.filter((v) => hit(v.label, v.hint)).map((v) => ({
      kind: "View",
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));

    const cities: Entry[] = savedCities
      .filter((c) => hit(c.name, c.region, c.country))
      .map((c) => ({
        kind: "City",
        id: c.id,
        label: c.name,
        hint: `${formatTemp(c.tempC, unit)} · ${CONDITIONS[c.condition].label}`,
      }));

    const actions: Entry[] = (
      [
        {
          kind: "Action",
          id: "unit",
          label: `Switch to ${unit === "c" ? "°F" : "°C"}`,
          hint: "Re-renders every temperature",
        },
        {
          kind: "Action",
          id: "glass",
          label: `Glass: ${glass} → next`,
          hint: "Changes the blur recipe app-wide",
        },
        { kind: "Action", id: "theme", label: "Flip light / dark", hint: "Scoped to the Aurora window" },
      ] as Entry[]
    ).filter((a) => hit(a.label, a.hint));

    const scenes: Entry[] = AMBIENCES.filter((a) => hit(a.label, a.hint)).map((a) => ({
      kind: "Ambience",
      id: a.id,
      label: a.label,
      hint: a.hint,
    }));

    return [...views, ...cities, ...actions, ...scenes].slice(0, 9);
  }, [q, unit, savedCities, glass]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (entry: Entry) => {
    setPaletteOpen(false);
    switch (entry.kind) {
      case "View":
        go(entry.id as ViewId);
        break;
      case "City":
        setActive(entry.id);
        go("now");
        notify(`${entry.label} is now the active city`);
        break;
      case "Ambience":
        setAmbience(entry.id as (typeof AMBIENCES)[number]["id"]);
        notify(`Ambience: ${entry.label}`);
        break;
      case "Action":
        if (entry.id === "unit") {
          toggleUnit();
          notify(`Units switched to ${unit === "c" ? "°F" : "°C"}`);
        } else if (entry.id === "glass") {
          cycleGlass();
          notify("Glass recipe stepped");
        } else {
          notify("Theme is flipped from the Settings view");
          go("settings");
        }
        break;
    }
  };

  return (
    <div
      className="aur-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="aur-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="aur-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, a city or a setting…"
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && results[cursor]) {
                run(results[cursor]);
              }
            }}
            aria-label="Command palette search"
          />
          <kbd>Esc</kbd>
        </label>
        <ul className="aur-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r)}
              >
                <span className="aur-palette__kind">{r.kind}</span>
                <span className="aur-palette__glyph" aria-hidden="true">
                  {r.kind === "City" ? <ConditionIcon id={savedCities.find((c) => c.id === r.id)?.condition ?? "clear"} size={15} /> : r.kind === "Ambience" ? <LayersIcon size={15} /> : r.kind === "Action" ? <ContrastIcon size={15} /> : <SearchIcon size={15} />}
                </span>
                <b>{r.label}</b>
                <span className="aur-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="aur-palette__empty">No matches for “{q}”</li>}
        </ul>
        <p className="aur-palette__foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> run
          </span>
          <span>
            <kbd>Esc</kbd> dismiss
          </span>
        </p>
      </div>
    </div>
  );
}
