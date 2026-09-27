"use client";

/* chrome — the app's floating glass topbar + dock nav
   (exact port of the reference .topbar / .dock markup & behavior) */

import { topbarInfo, useWeather } from "../state/weather-context";
import type { ViewId } from "../state/weather-context";

const TABS: { id: ViewId; label: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "Weather",
    icon: <path d="M12 3.6l7.6 6.3V20a.9.9 0 01-.9.9h-4.1v-5.3a2.6 2.6 0 00-5.2 0v5.3H5.3a.9.9 0 01-.9-.9V9.9L12 3.6z" />,
  },
  {
    id: "forecast",
    label: "Forecast",
    icon: (
      <>
        <path d="M4 17.5l4.4-5.2 3.3 3.1L20 7.4" />
        <path d="M20 11.6V7.4h-4.2" />
      </>
    ),
  },
  {
    id: "cities",
    label: "Cities",
    icon: (
      <>
        <path d="M12 21s6.4-5.3 6.4-10.1A6.4 6.4 0 005.6 10.9C5.6 15.7 12 21 12 21z" />
        <circle cx="12" cy="10.7" r="2.4" />
      </>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <>
        <path d="M4.5 7.5h15M4.5 12h15M4.5 16.5h15" />
        <circle cx="9" cy="7.5" r="2" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="10.5" cy="16.5" r="2" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export function WaTopbar() {
  const { view, city, go, refreshWeather, refreshing } = useWeather();
  const info = topbarInfo(view === "error" ? "error" : view, city);

  return (
    <header className="topbar glass">
      <div className="tb-title">
        <div className="t1">
          {info.pin && (
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" style={{ flex: "none", opacity: 0.9 }}>
              <path d="M12 21.5s6.6-5.5 6.6-10.4A6.6 6.6 0 0 0 5.4 11c0 5 6.6 10.5 6.6 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <circle cx="12" cy="10.9" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          )}
          {info.t1}
        </div>
        <div className="t2">{info.t2}</div>
      </div>
      <div className="tb-actions">
        <button
          className={"icon-btn" + (refreshing ? " spinning" : "")}
          onClick={refreshWeather}
          aria-label="Refresh weather"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 12a8 8 0 1 1-2.6-5.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20.4 4.2v4.4H16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="icon-btn"
          aria-label="Search cities"
          onClick={() => {
            go("cities");
            setTimeout(() => document.querySelector<HTMLInputElement>(".wa-search")?.focus(), 420);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="M15.8 15.8 20.4 20.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export function WaDock() {
  const { view, go } = useWeather();
  const activeIdx = Math.max(
    0,
    TABS.findIndex((t) => t.id === view || (view === "error" && t.id === "home"))
  );
  return (
    <nav className="dock glass rim" aria-label="Primary">
      <div className="dock-tabs">
        <span
          className="dock-ind"
          style={{ transform: `translateX(${activeIdx * 100}%)` }}
          aria-hidden="true"
        />
        {TABS.map((tab) => {
          const on = view === tab.id || (view === "error" && tab.id === "home");
          return (
            <button
              key={tab.id}
              className={"tab" + (on ? " on" : "")}
              aria-current={on ? "page" : undefined}
              onClick={() => go(tab.id)}
            >
              <svg viewBox="0 0 24 24">{tab.icon}</svg>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
