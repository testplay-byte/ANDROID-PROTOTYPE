"use client";

/**
 * signal / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction. It runs VIEWS, every event in the table, and a
 * handful of live commands (range switch, segment reset, export) so the
 * palette does real work rather than just navigating.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_LABEL, EVENTS, RANGES } from "../data";
import { VIEWS, useSignal, type ViewId } from "../state/signal-context";
import { SearchIcon } from "./icons";

type Result = {
  kind: "View" | "Event" | "Action";
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    go,
    selectEvent,
    setRange,
    resetSegments,
    notify,
    density,
    setDensity,
    reduceMotion,
    setReduceMotion,
  } = useSignal();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    const hit = (s: string) => !term || s.toLowerCase().includes(term);

    const views: Result[] = VIEWS.filter((v) => hit(v.label) || hit(v.hint)).map((v) => ({
      kind: "View",
      id: v.id,
      label: v.label,
      hint: v.hint,
      run: () => go(v.id as ViewId),
    }));

    const events: Result[] = EVENTS.filter((e) => hit(e.event) || hit(CATEGORY_LABEL[e.category]))
      .slice(0, 6)
      .map((e) => ({
        kind: "Event",
        id: e.id,
        label: e.event,
        hint: CATEGORY_LABEL[e.category],
        run: () => {
          go("explore");
          selectEvent(e.id);
        },
      }));

    const rangeActions: Result[] = RANGES.map((r) => ({
      kind: "Action",
      id: `range-${r.id}`,
      label: `Set range to ${r.label}`,
      hint: `${r.days} days`,
      run: () => {
        setRange(r.id);
        notify(`Range set to ${r.label}`);
      },
    }));

    const allActions: Result[] = [
      ...rangeActions,
      {
        kind: "Action",
        id: "reset-segments",
        label: "Reset segments",
        hint: "All platforms · all plans",
        run: () => {
          resetSegments();
          notify("Segments reset");
        },
      },
      {
        kind: "Action",
        id: "density",
        label: density === "compact" ? "Row density: comfortable" : "Row density: compact",
        hint: "Rescales every table app-wide",
        run: () => setDensity(density === "compact" ? "comfortable" : "compact"),
      },
      {
        kind: "Action",
        id: "motion",
        label: reduceMotion ? "Enable chart motion" : "Reduce motion",
        hint: "Stops chart draw-in animations",
        run: () => setReduceMotion(!reduceMotion),
      },
    ];
    const actions = allActions.filter((a) => hit(a.label) || hit(a.hint));

    return [...views, ...events, ...actions].slice(0, 10);
  }, [q, go, selectEvent, setRange, resetSegments, notify, density, setDensity, reduceMotion, setReduceMotion]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (r: Result) => {
    setPaletteOpen(false);
    r.run();
  };

  return (
    <div
      className="sig-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="sig-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="sig-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, event or action…"
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
          <kbd className="sig-kbd">Esc</kbd>
        </label>
        <ul className="sig-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r)}
              >
                <span className="sig-palette__kind">{r.kind}</span>
                <b>{r.label}</b>
                <span className="sig-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="sig-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
