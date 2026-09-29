"use client";

/**
 * facet / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a modal command surface that jumps to a view,
 * opens a note, selects a board tile or runs a board action. Every row is a
 * real action on the context — there are no dead commands.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { SPAN_LABEL, TILE_BY_ID, TILES } from "../data";
import { VIEWS, useFacet, type ViewId } from "../state/facet-context";
import { SearchIcon } from "./icons";

type Kind = "View" | "Note" | "Tile" | "Action";

interface Row {
  kind: Kind;
  id: string;
  label: string;
  hint: string;
}

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    go,
    notes,
    selectNote,
    prefs,
    spans,
    activeTile,
    setActiveTile,
    cycleSpan,
    resetSpans,
    showAllTiles,
    addNote,
    focusCapture,
    notify,
  } = useFacet();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  const rows = useMemo<Row[]>(() => {
    const term = q.trim().toLowerCase();
    const keep = (list: Row[]) =>
      list.filter(
        (r) =>
          !term ||
          r.label.toLowerCase().includes(term) ||
          r.hint.toLowerCase().includes(term)
      );

    const views = keep(
      VIEWS.map((v) => ({ kind: "View" as const, id: v.id, label: v.label, hint: v.hint }))
    );

    const found = keep(
      notes.slice(0, term ? 6 : 4).map((n) => ({
        kind: "Note" as const,
        id: n.id,
        label: n.title,
        hint: `${n.tag} · ${n.stamp}`,
      }))
    );

    const tiles = keep(
      TILES.filter((t) => !prefs.hidden.includes(t.id))
        .slice(0, term ? 9 : 5)
        .map((t) => ({
          kind: "Tile" as const,
          id: t.id,
          label: t.job,
          hint: `${SPAN_LABEL[spans[t.id] ?? t.span]} on the board`,
        }))
    );

    const active = activeTile ? TILE_BY_ID[activeTile] : null;

    const actions = keep([
      {
        kind: "Action" as const,
        id: "cycle",
        label: "Cycle the selected tile's size",
        hint: active
          ? `${active.job} · now ${SPAN_LABEL[spans[active.id] ?? active.span]}`
          : "select a tile first — click its dot",
      },
      {
        kind: "Action" as const,
        id: "reset-layout",
        label: "Reset the tile layout",
        hint: "Put every tile back to its default span",
      },
      {
        kind: "Action" as const,
        id: "restore",
        label: "Show every hidden tile",
        hint: prefs.hidden.length ? `${prefs.hidden.length} hidden right now` : "nothing is hidden",
      },
      {
        kind: "Action" as const,
        id: "capture",
        label: "Capture a thought",
        hint: "Focus the capture tile",
      },
      {
        kind: "Action" as const,
        id: "new-note",
        label: "New note",
        hint: "Add an empty note to the drawer",
      },
    ]);

    return [...views, ...found, ...tiles, ...actions].slice(0, 10);
  }, [q, notes, prefs.hidden, spans, activeTile]);

  if (!paletteOpen) return null;

  const run = (row: Row) => {
    setPaletteOpen(false);
    if (row.kind === "View") {
      go(row.id as ViewId);
      return;
    }
    if (row.kind === "Note") {
      selectNote(row.id);
      go("notes");
      return;
    }
    if (row.kind === "Tile") {
      go("board");
      setActiveTile(row.id);
      return;
    }
    /* actions */
    if (row.id === "cycle") {
      const id = activeTile ?? "agenda";
      go("board");
      setActiveTile(id);
      cycleSpan(id);
      return;
    }
    if (row.id === "reset-layout") {
      resetSpans();
      notify("Tile layout reset");
      go("board");
      return;
    }
    if (row.id === "restore") {
      showAllTiles();
      notify("Every tile is back on the board");
      go("board");
      return;
    }
    if (row.id === "capture") {
      focusCapture();
      return;
    }
    addNote();
  };

  return (
    <div
      className="fc-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="fc-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="fc-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, note, tile or action…"
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
        <ul className="fc-palette__list">
          {rows.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r)}
              >
                <span className="fc-palette__kind" data-kind={r.kind}>
                  {r.kind}
                </span>
                <b>{r.label}</b>
                <span className="fc-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {rows.length === 0 && <li className="fc-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
