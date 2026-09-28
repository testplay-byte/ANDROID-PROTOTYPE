"use client";

/**
 * meridian / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a modal command surface that jumps to any view
 * or project. Phones have no equivalent (they get search screens), which is
 * another reason the desktop app is its own prototype.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "../data";
import { VIEWS, useMeridian, type ViewId } from "../state/meridian-context";
import { SearchIcon } from "./icons";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, go, selectProject, notify } = useMeridian();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const views = VIEWS.filter((v) => !term || v.label.toLowerCase().includes(term)).map((v) => ({
      kind: "View" as const,
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));
    const projects = PROJECTS.filter(
      (p) => !term || p.name.toLowerCase().includes(term) || p.client.toLowerCase().includes(term)
    ).map((p) => ({
      kind: "Project" as const,
      id: p.id,
      label: p.name,
      hint: p.client,
    }));
    return [...views, ...projects].slice(0, 8);
  }, [q]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (kind: "View" | "Project", id: string) => {
    setPaletteOpen(false);
    if (kind === "View") go(id as ViewId);
    else {
      go("projects");
      selectProject(id);
      notify(`Inspecting ${id}`);
    }
  };

  return (
    <div className="mrd-palette" role="dialog" aria-modal="true" aria-label="Command palette" onClick={() => setPaletteOpen(false)}>
      <div className="mrd-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="mrd-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view or project…"
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
                run(results[cursor].kind, results[cursor].id);
              }
            }}
            aria-label="Command palette search"
          />
          <kbd>Esc</kbd>
        </label>
        <ul className="mrd-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r.kind, r.id)}
              >
                <span className="mrd-palette__kind">{r.kind}</span>
                <b>{r.label}</b>
                <span className="mrd-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="mrd-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
