"use client";

/**
 * quill / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a small overlay that jumps to any view or opens
 * any note by title, tag or body text. Phones get a search screen instead,
 * which is exactly why the desktop app is its own prototype.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { matchNote, relativeTime, titleOf } from "../data";
import { VIEWS, useQuill, type ViewId } from "../state/quill-context";
import { ChevronRightIcon, LibraryIcon, NoteIcon, SearchIcon } from "./icons";

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, go, openNote, notes, notify } = useQuill();
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
      icon: <LibraryIcon size={16} />,
    }));
    const matched = notes
      .filter((n) => {
        if (!term) return true;
        return (
          titleOf(n).toLowerCase().includes(term) ||
          n.tags.some((t) => t.includes(term)) ||
          matchNote(n, term, "all").length > 0
        );
      })
      .slice(0, term ? 6 : 4)
      .map((n) => ({
        kind: "Note" as const,
        id: n.id,
        label: titleOf(n),
        hint: `${n.folder} · ${relativeTime(n.updatedMins)}`,
        icon: <NoteIcon size={16} />,
      }));
    return [...views, ...matched];
  }, [q, notes]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (kind: "View" | "Note", id: string) => {
    setPaletteOpen(false);
    if (kind === "View") {
      go(id as ViewId);
      notify(`Jumped to ${id}`);
    } else {
      openNote(id);
      notify("Note opened");
    }
  };

  return (
    <div
      className="ql-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="ql-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="ql-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view or a note…"
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
        <ul className="ql-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r.kind, r.id)}
              >
                <span className="ql-palette__icon" aria-hidden="true">
                  {r.icon}
                </span>
                <span className="ql-palette__label">
                  <b>{r.label}</b>
                  <span className="ql-palette__hint">{r.hint}</span>
                </span>
                <span className="ql-palette__kind">{r.kind}</span>
                <ChevronRightIcon size={14} />
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="ql-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
