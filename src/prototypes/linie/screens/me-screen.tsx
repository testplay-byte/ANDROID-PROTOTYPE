"use client";

/* linie / screens / me — saved routes, ticket passes (triad
   colored cards, buy → owned), theme segmented and switches. */

import { useDeviceTheme } from "../../../proto-kit";
import { TICKETS } from "../lib/data";
import { useLinie } from "../state/linie-context";
import { CheckIcon, CloseIcon, DotIcon, TicketIcon } from "../components/icons";

const TONE: Record<string, string> = {
  Rot: "var(--color-primary)",
  Gelb: "var(--color-tertiary)",
  Blau: "var(--color-secondary)",
};

export function MeScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { routes, removeRoute, passes, buyPass, prefs, setPrefs, showToast } = useLinie();

  return (
    <section className="ln-screen" aria-label="Ich">
      <div className="ln-content">
        <header className="ln-head">
          <span className="ln-kicker">Meine Linie</span>
          <h1 className="ln-title">ICH</h1>
        </header>

        {/* saved routes */}
        <div className="ln-sectionhead">GESPEICHERTE ROUTEN</div>
        {routes.length === 0 ? (
          <div className="ln-empty">Noch keine Route gespeichert.</div>
        ) : (
          <div className="ln-routes">
            {routes.map((r) => (
              <div key={r.id} className="ln-rout">
                <b>{r.from} → {r.to}</b>
                <span>{r.stops} Halte · {r.mins} min</span>
                <button type="button" className="ln-x" aria-label={`Route ${r.from} löschen`} onClick={() => removeRoute(r.id)}>
                  <CloseIcon size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* passes */}
        <div className="ln-sectionhead">FAHRKARTEN</div>
        <div className="ln-passes">
          {TICKETS.map((t) => {
            const owned = passes.includes(t.id);
            return (
              <div key={t.id} className="ln-pass" style={{ background: TONE[t.color], borderColor: "var(--color-outline)" }}>
                <TicketIcon size={18} />
                <b>{t.name}</b>
                <span className="tnum">{t.price} €</span>
                <em>{t.note}</em>
                <button
                  type="button"
                  className="ln-btn ln-btn--dark"
                  onClick={() => {
                    buyPass(t.id);
                    showToast(owned ? "Bereits im Portemonnaie" : `${t.name} gekauft`);
                  }}
                >
                  {owned ? <CheckIcon size={14} /> : null}
                  {owned ? "IM PORTEMONNAIE" : "KAUFEN"}
                </button>
              </div>
            );
          })}
        </div>

        {/* settings */}
        <div className="ln-sectionhead">EINSTELLUNGEN</div>
        <div className="ln-group">
          <div className="ln-trow">
            <span className="ln-trow__label">Erscheinungsbild</span>
            <div className="ln-seg" role="radiogroup" aria-label="Erscheinungsbild">
              {(["dark", "light"] as const).map((t) => (
                <button key={t} type="button" className={"ln-seg__b" + (theme === t ? " is-on" : "")} aria-pressed={theme === t} onClick={() => setTheme(t)}>
                  {t === "dark" ? "DUNKEL" : "HELL"}
                </button>
              ))}
            </div>
          </div>
          <div className="ln-trow">
            <span className="ln-trow__label">Verspätungsalarm</span>
            <button type="button" className={"ln-sw" + (prefs.alerts ? " is-on" : "")} role="switch" aria-checked={prefs.alerts} aria-label="Verspätungsalarm" onClick={() => setPrefs({ alerts: !prefs.alerts })}>
              <i />
            </button>
          </div>
          <div className="ln-trow">
            <span className="ln-trow__label">Ansagen im Wagen</span>
            <button type="button" className={"ln-sw" + (prefs.announceStops ? " is-on" : "")} role="switch" aria-checked={prefs.announceStops} aria-label="Ansagen im Wagen" onClick={() => setPrefs({ announceStops: !prefs.announceStops })}>
              <i />
            </button>
          </div>
        </div>

        <div className="ln-about" onClick={() => showToast("Linie 1.0 · Prototyp-Daten")} role="button" tabIndex={0}>
          <DotIcon size={14} />
          <span>LINIE 1.0 · Prototyp</span>
        </div>
      </div>
    </section>
  );
}
