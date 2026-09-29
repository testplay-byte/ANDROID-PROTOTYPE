"use client";

/**
 * counter / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction: a modal command surface that jumps to any view,
 * any customer booking, or runs a status action on the current selection.
 * Phones have no equivalent — they get search screens — which is another
 * reason the desktop app is its own prototype.
 *
 * Every command is a real action on the context, never a dead row.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { serviceById, staffById, type BookingStatus } from "../data";
import { VIEWS, useCounter, type ViewId } from "../state/counter-context";
import { SearchIcon } from "./icons";

type Kind = "View" | "Booking" | "Action";

/** The status actions the palette can run on the current selection. */
const ACTIONS: { id: string; label: string; hint: string; status: BookingStatus }[] = [
  { id: "confirm", label: "Confirm", hint: "Move the selection to confirmed", status: "confirmed" },
  { id: "checkin", label: "Check in", hint: "Move the selection to checked in", status: "checked-in" },
  { id: "complete", label: "Complete", hint: "Move the selection to completed", status: "completed" },
];

export function CommandPalette() {
  const {
    paletteOpen,
    setPaletteOpen,
    go,
    select,
    bookings,
    checked,
    selectedId,
    visibleBookings,
    setStatus,
  } = useCounter();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /** The status actions apply to whatever is ticked, else the open booking. */
  const actionTargets = checked.length > 0 ? checked : selectedId ? [selectedId] : [];

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();

    const views = VIEWS.filter((v) => !term || v.label.toLowerCase().includes(term)).map((v) => ({
      kind: "View" as const,
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));

    const found = bookings
      .filter((b) => !term || b.customer.toLowerCase().includes(term))
      .slice(0, term ? 6 : 4)
      .map((b) => ({
        kind: "Booking" as const,
        id: b.id,
        label: b.customer,
        hint: `${serviceById(b.serviceId)?.name ?? "—"} · ${staffById(b.staffId)?.name ?? "—"}`,
      }));

    const actions = ACTIONS.filter((a) => !term || a.label.toLowerCase().includes(term)).map(
      (a) => ({ kind: "Action" as const, ...a })
    );

    return [...views, ...found, ...actions].slice(0, 9);
  }, [bookings, q]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (kind: Kind, id: string) => {
    setPaletteOpen(false);
    if (kind === "View") {
      go(id as ViewId);
      return;
    }
    if (kind === "Booking") {
      go("bookings");
      select(id);
      return;
    }
    go("bookings");
    const status = ACTIONS.find((a) => a.id === id)?.status;
    if (!status) return;
    // no explicit selection → act on the first visible row, and say so
    const targets = actionTargets.length > 0 ? actionTargets : visibleBookings.slice(0, 1).map((b) => b.id);
    setStatus(targets, status);
  };

  return (
    <div
      className="ctr-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="ctr-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="ctr-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, customer or action…"
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
        <ul className="ctr-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r.kind, r.id)}
              >
                <span className="ctr-palette__kind">{r.kind}</span>
                <b>{r.label}</b>
                <span className="ctr-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="ctr-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
