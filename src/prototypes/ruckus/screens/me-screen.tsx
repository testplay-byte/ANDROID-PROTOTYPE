"use client";

/* ruckus / screens / me — ticket wallet (perforated stubs),
   counts, alert switches and the about block. */

import { useDeviceTheme } from "../../../proto-kit";
import { bandById, gigById, venueById } from "../lib/data";
import { useRuckus } from "../state/ruckus-context";
import { Banner, Switch } from "../components/chrome";
import { BellIcon, CheckIcon, TicketIcon } from "../components/icons";

export function MeScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const { tickets, followed, prefs, setPrefs, showToast } = useRuckus();

  return (
    <section className="rk-screen" aria-label="Me">
      <div className="rk-content">
        <header className="rk-slabhead">
          <h1 className="rk-h1">MY BAG</h1>
          <span className="rk-count tnum">{tickets.length} TICKETS</span>
        </header>

        {tickets.length === 0 ? (
          <div className="rk-empty">
            <b>NO TICKETS YET.</b>
            <span>Grab one from tonight's lineup.</span>
          </div>
        ) : (
          <div className="rk-wallet">
            {tickets.map((t) => {
              const g = gigById(t.gigId);
              if (!g) return null;
              const band = bandById(g.bandId)!;
              const v = venueById(g.venueId)!;
              return (
                <div key={t.serial} className="rk-stub">
                  <div className="rk-stub__l">
                    <b>{band.name}</b>
                    <span>{g.day} · {g.time}</span>
                    <span>{v.name}</span>
                  </div>
                  <div className="rk-stub__perf" aria-hidden="true" />
                  <div className="rk-stub__r">
                    <TicketIcon size={16} />
                    <b className="tnum">№{t.serial}</b>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Banner n="03" tone="ink">{followed.length} BANDS FOLLOWED</Banner>

        <div className="rk-group">
          <div className="rk-row rk-row--btn">
            <span className="rk-row__main">
              <b className="rk-row__band">New gig alerts</b>
              <span className="rk-row__meta">Ping when a band you follow books a date</span>
            </span>
            <Switch on={prefs.alertsNewGigs} onChange={(v) => setPrefs({ alertsNewGigs: v })} label="New gig alerts" />
          </div>
          <div className="rk-row rk-row--btn">
            <span className="rk-row__main">
              <b className="rk-row__band">Sell-out alerts</b>
              <span className="rk-row__meta">When a date you're watching sells out</span>
            </span>
            <Switch on={prefs.alertsSellOut} onChange={(v) => setPrefs({ alertsSellOut: v })} label="Sell-out alerts" />
          </div>
        </div>

        <div className="rk-group">
          <div className="rk-row">
            <span className="rk-row__main">
              <b className="rk-row__band">Appearance</b>
              <span className="rk-row__meta">Ink on paper or paper on ink</span>
            </span>
            <div className="rk-seg" role="radiogroup" aria-label="Theme">
              {(["dark", "light"] as const).map((t) => (
                <button key={t} type="button" className={"rk-seg__b" + (theme === t ? " is-on" : "")} aria-pressed={theme === t} onClick={() => setTheme(t)}>
                  {t === "dark" ? "DARK" : "LIGHT"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button type="button" className="rk-about" onClick={() => showToast("Ruckus v1.0 · data is simulated")}>
          <BellIcon size={16} />
          <span>
            <b>RUCKUS 1.0</b>
            <em>Neo-brutalist gig guide · prototype data</em>
          </span>
          <CheckIcon size={16} />
        </button>
      </div>
    </section>
  );
}
