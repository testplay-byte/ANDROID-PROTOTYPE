"use client";

/**
 * halo / components / command-palette — the ⌘K command surface.
 *
 * A desktop-only interaction. Phones get a search screen; a desktop gets a
 * modal that can jump to a view, open a room's drawer, or bring a device to
 * the front. It is deliberately a different object from the search field on
 * the Rooms view, which filters; this one navigates.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { KIND_LABEL, ROOMS, roomById, type DeviceKind, type RoomId } from "../data";
import { VIEWS, useHalo, type ViewId } from "../state/halo-context";
import { DeviceIcon, SearchIcon } from "./icons";

type Result = {
  kind: "View" | "Room" | "Device";
  id: string;
  label: string;
  hint: string;
  deviceKind?: DeviceKind;
};

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, go, selectRoom, toggleDevice, devices, notify } = useHalo();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<Result[]>(() => {
    const term = q.trim().toLowerCase();
    const views: Result[] = VIEWS.filter((v) => !term || v.label.toLowerCase().includes(term)).map((v) => ({
      kind: "View",
      id: v.id,
      label: v.label,
      hint: v.hint,
    }));
    const rooms: Result[] = ROOMS.filter((r) => !term || r.name.toLowerCase().includes(term)).map((r) => ({
      kind: "Room",
      id: r.id,
      label: r.name,
      hint: `${devices.filter((d) => d.room === r.id && d.on).length} of ${devices.filter((d) => d.room === r.id).length} active`,
    }));
    const list: Result[] = devices
      .filter((d) => !term || d.name.toLowerCase().includes(term) || KIND_LABEL[d.kind].toLowerCase().includes(term))
      .slice(0, term ? 6 : 0)
      .map((d) => ({
        kind: "Device",
        id: d.id,
        label: d.name,
        hint: roomById(d.room).name,
        deviceKind: d.kind,
      }));
    return [...views, ...rooms, ...list].slice(0, 9);
  }, [q, devices]);

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
    if (r.kind === "View") {
      go(r.id as ViewId);
    } else if (r.kind === "Room") {
      go("rooms");
      selectRoom(r.id as RoomId);
    } else {
      toggleDevice(r.id);
      notify(`${r.label} switched`);
    }
  };

  return (
    <div
      className="halo-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="halo-palette__box halo-raised-lg" onClick={(e) => e.stopPropagation()}>
        <label className="halo-palette__input halo-press">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, a room or a device…"
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
        <ul className="halo-palette__list">
          {results.map((r, i) => (
            <li key={`${r.kind}-${r.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(r)}
              >
                <span className="halo-palette__kind">{r.kind}</span>
                {r.deviceKind && (
                  <span className="halo-palette__glyph" aria-hidden="true">
                    <DeviceIcon kind={r.deviceKind} size={15} />
                  </span>
                )}
                <b>{r.label}</b>
                <span className="halo-palette__hint">{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="halo-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
