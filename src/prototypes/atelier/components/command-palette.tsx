"use client";

/**
 * atelier / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a modal command surface that jumps to any view,
 * any work, any board column, or runs an action. Phones have no equivalent
 * (they get search screens), which is another reason the desktop app is its
 * own prototype.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { DISCIPLINE_LABEL, MAKERS, STAGES, WORKS } from "../data";
import { VIEWS, useAtelier, type ViewId } from "../state/atelier-context";
import { SearchIcon } from "./icons";

type Result = { kind: "View" | "Work" | "Column" | "Maker"; id: string; label: string; hint: string };

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, go, selectWork, setDiscipline, setBoardColumn, notify } =
    useAtelier();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    const match = (s: string) => !term || s.toLowerCase().includes(term);

    const views: Result[] = VIEWS.filter((v) => match(v.label)).map((v) => ({
      kind: "View",
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));
    const works: Result[] = WORKS.filter((w) => match(w.title) || match(w.client)).map((w) => ({
      kind: "Work",
      id: w.id,
      label: w.title,
      hint: `${w.plateNo} · ${DISCIPLINE_LABEL[w.discipline]} · ${w.client}`,
    }));
    const columns: Result[] = STAGES.map((s, i): Result => ({
      kind: "Column",
      id: s.id,
      label: `${s.index} ${s.label}`,
      hint: `Go to column ${i + 1}`,
    })).filter((c) => match(c.label));
    const makers: Result[] = MAKERS.filter((m) => match(m.name)).map((m) => ({
      kind: "Maker",
      id: m.id,
      label: m.name,
      hint: `${m.role} · ${m.discipline}`,
    }));

    return [...views, ...works, ...columns, ...makers].slice(0, 10);
  }, [q]);

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
    switch (r.kind) {
      case "View":
        go(r.id as ViewId);
        break;
      case "Work":
        go("work");
        setDiscipline("all");
        selectWork(r.id);
        break;
      case "Column":
        go("board");
        setBoardColumn(STAGES.findIndex((s) => s.id === r.id));
        break;
      case "Maker":
        go("studio");
        notify(`${r.label} — capacity shown in the studio view`);
        break;
    }
  };

  return (
    <div
      className="atl-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="atl-palette__box" onClick={(e) => e.stopPropagation()}>
        <div className="atl-palette__input">
          <SearchIcon size={15} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, plate, column or maker…"
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
          <kbd>ESC</kbd>
        </div>
        <ul className="atl-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r)}
              >
                <span className={`atl-palette__kind atl-palette__kind--${r.kind.toLowerCase()}`}>
                  {r.kind}
                </span>
                <b>{r.label}</b>
                <span className="atl-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="atl-palette__empty">No plate matches “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
