/**
 * telemetry / components / command-palette — the ⌘K / Ctrl+K command surface.
 *
 * A desktop-only interaction. Phones get a search screen; a console gets a
 * command surface that jumps to a view, a service, an incident or an action.
 * ↑ ↓ move the cursor, Enter runs, Esc closes.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { INCIDENTS, serviceById } from "../data";
import { VIEWS, useTelemetry, type ViewId } from "../state/telemetry-context";
import { SearchIcon, TargetIcon, TerminalIcon } from "./icons";

type Kind = "View" | "Service" | "Incident" | "Action";

interface Command {
  kind: Kind;
  id: string;
  label: string;
  hint: string;
}

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, go, inspect, triggerPoll, density, setDensity } = useTelemetry();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Derived from live state, so the palette only ever offers actions that
     make sense right now (poll, flip density, jump to a service…). */
  const commands = useMemo<Command[]>(() => {
    const term = q.trim().toLowerCase();
    const all: Command[] = [
      ...VIEWS.map<Command>((v) => ({ kind: "View", id: v.id, label: v.label, hint: v.hint })),
      ...INCIDENTS.map<Command>((i) => ({
        kind: "Service",
        id: i.serviceId,
        label: serviceById(i.serviceId)?.name ?? i.serviceId,
        hint: `${i.severity.toUpperCase()} · ${i.id}`,
      })),
      ...INCIDENTS.map<Command>((i) => ({
        kind: "Incident",
        id: i.id,
        label: `${i.id} — ${i.title}`,
        hint: i.age,
      })),
      { kind: "Action", id: "poll", label: "Poll the fleet now", hint: "refresh" },
      {
        kind: "Action",
        id: "density",
        label: `Switch to ${density === "compact" ? "comfortable" : "compact"} rows`,
        hint: "density",
      },
    ];
    return all
      .filter((c) => !term || c.label.toLowerCase().includes(term) || c.hint.toLowerCase().includes(term))
      .slice(0, 9);
  }, [q, density]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const run = (c: Command) => {
    setPaletteOpen(false);
    switch (c.kind) {
      case "View":
        go(c.id as ViewId);
        break;
      case "Service":
        inspect(c.id);
        break;
      case "Incident":
        go("incidents");
        break;
      case "Action":
        if (c.id === "poll") triggerPoll();
        else setDensity(density === "compact" ? "comfortable" : "compact");
        break;
    }
  };

  return (
    <div
      className="tel-palette"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={() => setPaletteOpen(false)}
    >
      <div className="tel-palette__box" onClick={(e) => e.stopPropagation()}>
        <label className="tel-palette__input">
          <SearchIcon size={16} />
          <input
            ref={inputRef}
            value={q}
            placeholder="Jump to a view, service or incident…"
            aria-label="Command palette search"
            onChange={(e) => {
              setQ(e.target.value);
              setCursor(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setCursor((c) => Math.min(c + 1, commands.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setCursor((c) => Math.max(c - 1, 0));
              } else if (e.key === "Enter" && commands[cursor]) {
                run(commands[cursor]);
              }
            }}
          />
          <span className="tel-kbd">Esc</span>
        </label>
        <ul className="tel-palette__list">
          {commands.map((c, i) => (
            <li key={`${c.kind}-${c.id}`}>
              <button
                type="button"
                className={i === cursor ? "is-cursor" : ""}
                onMouseEnter={() => setCursor(i)}
                onClick={() => run(c)}
              >
                <span className="tel-palette__kind">{c.kind}</span>
                {c.kind === "View" || c.kind === "Action" ? (
                  <TerminalIcon size={15} />
                ) : (
                  <TargetIcon size={15} />
                )}
                <b>{c.label}</b>
                <span className="tel-palette__hint">{c.hint}</span>
              </button>
            </li>
          ))}
          {commands.length === 0 && <li className="tel-palette__empty">No matches for “{q}”</li>}
        </ul>
      </div>
    </div>
  );
}
