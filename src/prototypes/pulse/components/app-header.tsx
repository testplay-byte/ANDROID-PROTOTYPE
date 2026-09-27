"use client";

/* pulse / components/app-header — custom product chrome (deliberately NOT
   the shared TopBar): a single flat header row — blue logo mark + product
   name left, live system-status pill center, refresh + avatar right,
   1px outline-variant bottom border. The status pill reflects fleet health
   and re-stamps "last updated" whenever the refresh tick fires. */

import { useEffect, useState } from "react";
import { usePulse } from "../state/pulse-context";
import { STATUS_LABEL } from "../lib/data";
import { ClockIcon, RefreshIcon } from "./icons";

function stamp(tick: number): string {
  const d = new Date();
  const base = d.getTime() - (d.getTime() % 60000);
  const shown = new Date(base + ((tick * 13) % 60) * 1000);
  const hh = String(shown.getHours() % 12 || 12).padStart(2, "0");
  const mm = String(shown.getMinutes()).padStart(2, "0");
  const ss = String(shown.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function AppHeader({ onRefresh }: { onRefresh?: () => void }) {
  const { health, refreshTick, counts, triggerRefresh } = usePulse();
  const [time, setTime] = useState(() => stamp(refreshTick));

  useEffect(() => {
    setTime(stamp(refreshTick));
  }, [refreshTick]);

  return (
    <header className="plu-header">
      <div className="plu-header__brand">
        <span className="plu-header__mark" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-fg)" strokeWidth="3" strokeLinecap="square">
            <path d="M2 12h5l2-7 4 14 2-7h7" />
          </svg>
        </span>
        <span className="plu-header__name">
          Pulse<em className="plu-header__sub">status</em>
        </span>
      </div>

      <div className={`plu-header__pill plu-header__pill--${health}`} title={time}>
        <span className={`plu-sq plu-sq--sm plu-sq--${health}`} aria-hidden="true" />
        <span className="plu-header__pill-label">
          {health === "operational" ? "ALL SYSTEMS OPERATIONAL" : `${STATUS_LABEL[health]} · ${counts.down + counts.degraded}`}
        </span>
      </div>

      <div className="plu-header__actions">
        <button
          type="button"
          className="plu-header__iconbtn"
          aria-label="Refresh status"
          onClick={onRefresh ?? triggerRefresh}
        >
          <RefreshIcon />
        </button>
        <span className="plu-header__avatar" aria-label="Signed in as K. Rahman">
          KR
        </span>
      </div>
    </header>
  );
}

/* Small "Last updated HH:MM:SS" footer line used under scroll content. */
export function UpdatedStamp() {
  const { refreshTick } = usePulse();
  return (
    <div className="plu-stamp" key={refreshTick}>
      <ClockIcon />
      <span className="tnum">Last updated {stamp(refreshTick)}</span>
    </div>
  );
}
