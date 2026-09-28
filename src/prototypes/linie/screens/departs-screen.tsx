"use client";

/* linie / screens / depart — live departures. Hero "next 3" block
   with tabular countdowns that tick down each minute, then the full
   list, then the service-status strip (green/amber/red squares). */

import { DEPARTURES, STATIONS, byId, departsFor, nameOf } from "../lib/data";
import { useLinie } from "../state/linie-context";
import { ClockIcon, TrainIcon } from "../components/icons";

const STROKE: Record<string, string> = {
  A: "var(--color-primary)",
  B: "var(--color-secondary)",
  C: "var(--color-tertiary)",
};

const SERVICE = [
  { label: "Rolltreppe Zirkusplatz", tone: "warn" as const },
  { label: "Alle Linien fahren", tone: "good" as const },
];

export function DepartsScreen() {
  const { station, pickStation, due } = useLinie();
  const sel = station ?? "markt";
  const list = departsFor(sel);
  const indices = DEPARTURES.map((_, i) => i).filter((i) => DEPARTURES[i].stationId === sel);
  const next3 = indices.slice(0, 3);

  return (
    <section className="ln-screen" aria-label="Abfahrten">
      <div className="ln-content">
        <header className="ln-head">
          <span className="ln-kicker">Nächste Züge</span>
          <h1 className="ln-title">ABFAHRT</h1>
        </header>

        <div className="ln-stationscroll" aria-label="Station wählen">
          {STATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={"ln-statchip" + (sel === s.id ? " is-on" : "")}
              style={sel === s.id ? { borderColor: STROKE[s.lines[0]], background: STROKE[s.lines[0]] } : undefined}
              onClick={() => pickStation(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* hero: next three */}
        <div className="ln-hero" style={{ borderColor: STROKE[byId(sel)?.lines[0] ?? "A"] }}>
          <span className="ln-hero__label">NÄCHSTE 3 · {nameOf(sel)}</span>
          {next3.map((i) => (
            <div key={i} className="ln-hero__row">
              <span className="ln-linebox" style={{ background: STROKE[DEPARTURES[i].line] }}>{DEPARTURES[i].line}</span>
              <b className="ln-hero__dest">{DEPARTURES[i].dest}</b>
              <b className="ln-hero__mins tnum">{due(i)}′</b>
            </div>
          ))}
          {next3.length === 0 && <p className="ln-empty">Keine Abfahrten an dieser Station.</p>}
        </div>

        {/* full list */}
        <div className="ln-departs">
          {list.map((d) => {
            const idx = DEPARTURES.indexOf(d);
            return (
              <div key={`${d.line}-${d.dest}`} className="ln-drow">
                <span className="ln-linebox" style={{ background: STROKE[d.line] }}>{d.line}</span>
                <span className="ln-drow__dest">{d.dest}</span>
                <span className="ln-drow__mins tnum">
                  <ClockIcon size={13} />
                  {due(idx)}′
                </span>
              </div>
            );
          })}
        </div>

        {/* service strip */}
        <div className="ln-service">
          {SERVICE.map((s) => (
            <div key={s.label} className={"ln-service__row ln-service__row--" + s.tone}>
              <span className="ln-service__dot" />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
