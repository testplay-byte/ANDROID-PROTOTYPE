"use client";

/**
 * mochi / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a modal that jumps to a view, opens a budget
 * envelope or selects a habit. Phones have no equivalent (they get search
 * screens), which is one of the reasons the desktop build is its own
 * prototype. It is never rendered on the tablet layout — the trigger is
 * desktop-only and the context closes it when the surface narrows.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { VIEWS, useMochi, type ViewId } from "../state/mochi-context";
import { SearchIcon } from "./icons";

type Row = { kind: "View" | "Envelope" | "Habit"; id: string; label: string; hint: string };

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, go, categories, habits, selectCategory, selectHabit, notify } =
    useMochi();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const rows = useMemo<Row[]>(() => {
    const term = q.trim().toLowerCase();
    const hit = (s: string) => !term || s.toLowerCase().includes(term);
    const views: Row[] = VIEWS.filter((v) => hit(v.label)).map((v) => ({
      kind: "View",
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));
    const envelopes: Row[] = categories.filter((c) => hit(c.name)).map((c) => ({
      kind: "Envelope",
      id: c.id,
      label: c.name,
      hint: `£${c.spent.toFixed(0)} of £${c.limit.toFixed(0)}`,
    }));
    const hs: Row[] = habits.filter((h) => hit(h.name) || hit(h.cue)).map((h) => ({
      kind: "Habit",
      id: h.id,
      label: h.name,
      hint: h.cue,
    }));
    return [...views, ...envelopes, ...hs].slice(0, 9);
  }, [q, categories, habits]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (row: Row) => {
    setPaletteOpen(false);
    if (row.kind === "View") go(row.id as ViewId);
    else if (row.kind === "Envelope") {
      go("budget");
      selectCategory(row.id);
    } else {
      go("habits");
      selectHabit(row.id);
    }
    notify(`${row.kind} · ${row.label}`);
  };

  return (
    <div
      className="mch-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="mch-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="mch-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, envelope or habit…"
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, rows.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && rows[cursor]) {
                run(rows[cursor]);
              }
            }}
            aria-label="Command palette search"
          />
          <kbd>Esc</kbd>
        </label>
        <ul className="mch-palette__list">
          {rows.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r)}
              >
                <span className="mch-palette__kind">{r.kind}</span>
                <b>{r.label}</b>
                <span className="mch-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {rows.length === 0 && <li className="mch-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
