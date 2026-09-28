"use client";

/* linie / screens / map — the network tab. Poster header with a
   quarter-circle motif, the SVG metro map (tap a line to highlight,
   tap a station to select), legend squares, and the station info
   slab for the current selection. */

import { LINES, STATIONS, byId, nameOf } from "../lib/data";
import { useLinie } from "../state/linie-context";
import { MetroMap } from "../components/metro-map";

const STROKE: Record<string, string> = {
  A: "var(--color-primary)",
  B: "var(--color-secondary)",
  C: "var(--color-tertiary)",
};

export function MapScreen({ onOpenDeparts }: { onOpenDeparts: () => void }) {
  const { station, pickStation, line, selectLine } = useLinie();
  const sel = station ? byId(station) : null;

  return (
    <section className="ln-screen" aria-label="Netz">
      <div className="ln-content">
        <header className="ln-poster">
          <span className="ln-poster__kicker">Netzkarte</span>
          <h1 className="ln-poster__title">LINIE</h1>
          <span className="ln-quarter" aria-hidden="true" />
        </header>

        {/* map plate — labels live outside the geometry */}
        <div className="ln-mapplate">
          <MetroMap />
          {/* hit targets over the SVG (kept in a sibling layer) */}
          <span className="ln-hits" aria-hidden="true">
            {STATIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={"ln-hit" + (station === s.id ? " is-on" : "")}
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label={`${s.name} wählen`}
                onClick={() => pickStation(s.id === station ? null : s.id)}
              />
            ))}
          </span>
        </div>

        {/* legend — square swatches, tap to isolate a line */}
        <div className="ln-legend" role="group" aria-label="Linie hervorheben">
          {LINES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={"ln-legend__item" + (line === l.id ? " is-on" : "")}
              style={{ borderColor: STROKE[l.id], background: line === l.id ? STROKE[l.id] : "var(--color-surface-1)" }}
              aria-pressed={line === l.id}
              onClick={() => selectLine(line === l.id ? null : l.id)}
            >
              <b>{l.id}</b>
              <span>{l.name}</span>
            </button>
          ))}
        </div>

        {/* selected station slab */}
        {sel ? (
          <div className="ln-slab" style={{ borderColor: STROKE[sel.lines[0]] }}>
            <div className="ln-slab__head">
              <b>{sel.name}</b>
              <span className="ln-lines">
                {sel.lines.map((l) => (
                  <i key={l} style={{ background: STROKE[l] }}>{l}</i>
                ))}
              </span>
            </div>
            <p>{sel.interchange ? "Umsteigehaltestelle — alle Linien hier." : "Endhaltestelle dieser Linie."}</p>
            <button type="button" className="ln-btn ln-btn--primary" onClick={onOpenDeparts}>
              ABFAHRTEN
            </button>
          </div>
        ) : (
          <div className="ln-slab ln-slab--empty">
            <p>Station antippen — Linie oder Haltestelle wählen.</p>
          </div>
        )}
        {line && (
          <p className="ln-note">
            Linie {line} hervorgehoben · {LINES.filter((l) => l.id === line).map((l) => l.name).join("")}
            {sel ? ` · ${nameOf(sel.id)}` : ""}
          </p>
        )}
      </div>
    </section>
  );
}
