"use client";

/* linie / screens / route — journey planner. FROM/TO square
   selects open a station picker overlay; FIND ROUTE draws the
   vertical diagram (line-colored segment bars + circle stops +
   interchange diamonds) with duration/fare stat blocks. The
   primary CTA sits above the fold. */

import { useMemo, useState } from "react";
import { STATIONS, byId, nameOf } from "../lib/data";
import { useLinie } from "../state/linie-context";
import { CheckIcon, CloseIcon, RouteIcon, SwapIcon } from "../components/icons";

const STROKE: Record<string, string> = {
  A: "var(--color-primary)",
  B: "var(--color-secondary)",
  C: "var(--color-tertiary)",
};

type Leg = { stop: string; line: string };

function plan(from: string, to: string): Leg[] {
  // naive but deterministic: walk from→to through the shared interchange
  const a = byId(from);
  const b = byId(to);
  if (!a || !b) return [];
  if (a.lines[0] === b.lines[0]) return [{ stop: from, line: a.lines[0] }, { stop: to, line: b.lines[0] }];
  const hub = STATIONS.find((s) => s.interchange && s.lines.includes(a.lines[0]) && s.lines.includes(b.lines[0]));
  if (hub) return [{ stop: from, line: a.lines[0] }, { stop: hub.id, line: hub.lines[1] }, { stop: to, line: b.lines[0] }];
  return [{ stop: from, line: a.lines[0] }, { stop: to, line: b.lines[0] }];
}

export function RouteScreen() {
  const { saveRoute, showToast } = useLinie();
  const [from, setFrom] = useState("wested");
  const [to, setTo] = useState("ost");
  const [picking, setPicking] = useState<"from" | "to" | null>(null);
  const [result, setResult] = useState<Leg[] | null>(null);

  const legs = useMemo(() => (result ? result : plan(from, to)), [result, from, to]);
  const mins = 8 + legs.length * 6;
  const fare = 4;

  function find() {
    const p = plan(from, to);
    setResult(p);
    showToast(`Route berechnet · ${mins} min`);
  }
  function pick(id: string) {
    if (picking === "from") setFrom(id);
    if (picking === "to") setTo(id);
    setPicking(null);
  }

  return (
    <section className="ln-screen" aria-label="Route">
      <div className="ln-content">
        <header className="ln-head">
          <span className="ln-kicker">Fahrplan</span>
          <h1 className="ln-title">ROUTE</h1>
        </header>

        <div className="ln-selects">
          <button type="button" className="ln-select" onClick={() => setPicking("from")}>
            <span>Von</span>
            <b>{nameOf(from)}</b>
          </button>
          <button type="button" className="ln-swap" aria-label="Vertauschen" onClick={() => { const t = from; setFrom(to); setTo(t); }}>
            <SwapIcon size={18} />
          </button>
          <button type="button" className="ln-select" onClick={() => setPicking("to")}>
            <span>Nach</span>
            <b>{nameOf(to)}</b>
          </button>
        </div>

        <button type="button" className="ln-btn ln-btn--primary ln-cta" onClick={find}>
          <RouteIcon size={18} />
          ROUTE FINDEN
        </button>

        {/* vertical diagram */}
        <div className="ln-diagram" aria-label="Streckenverlauf">
          {legs.map((leg, i) => (
            <div key={`${leg.stop}-${i}`} className="ln-leg">
              <span className="ln-leg__node" style={{ background: i === 0 || i === legs.length - 1 ? STROKE[leg.line] : "var(--color-surface-1)", borderColor: "var(--color-outline)" }} />
              {i < legs.length - 1 && <span className="ln-leg__bar" style={{ background: STROKE[legs[i + 1].line] }} />}
              <span className="ln-leg__name">{nameOf(leg.stop)}</span>
              {byId(leg.stop)?.interchange && <i className="ln-leg__dia" aria-hidden="true" />}
            </div>
          ))}
        </div>

        <div className="ln-stats">
          <div className="ln-stat" style={{ borderColor: "var(--color-primary)" }}>
            <b>{mins}</b>
            <span>MINUTEN</span>
          </div>
          <div className="ln-stat" style={{ borderColor: "var(--color-secondary)" }}>
            <b>{legs.length}</b>
            <span>HALTE</span>
          </div>
          <div className="ln-stat" style={{ borderColor: "var(--color-tertiary)" }}>
            <b>{fare}</b>
            <span>EURO</span>
          </div>
        </div>

        <button
          type="button"
          className="ln-btn"
          onClick={() => {
            saveRoute({ from: nameOf(from), to: nameOf(to), stops: legs.length, mins });
            showToast("Route gespeichert");
          }}
        >
          <CheckIcon size={16} />
          ROUTE SPEICHERN
        </button>

        {picking && (
          <div className="ln-overlay" role="dialog" aria-label="Station wählen">
            <div className="ln-overlay__scrim" onClick={() => setPicking(null)} />
            <div className="ln-overlay__panel">
              <header className="ln-overlay__head">
                <b>{picking === "from" ? "VON" : "NACH"}</b>
                <button type="button" className="ln-x" aria-label="Schließen" onClick={() => setPicking(null)}>
                  <CloseIcon size={16} />
                </button>
              </header>
              <div className="ln-overlay__list">
                {STATIONS.map((s) => (
                  <button key={s.id} type="button" className="ln-overlay__row" onClick={() => pick(s.id)}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
