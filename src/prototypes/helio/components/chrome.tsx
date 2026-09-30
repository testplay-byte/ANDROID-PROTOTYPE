"use client";

/**
 * helio / components / chrome — the app's own furniture.
 *
 * The top bar is a single row: wordmark, five nav pills, then a right cluster.
 * The active state IS the pill (white fill, dark text) — there is no underline
 * or indicator anywhere, which is what keeps the header quiet.
 */

import type { ReactNode } from "react";
import { VIEWS, useHelio, type ViewId } from "../state/helio-context";
import { useDeviceTheme } from "@/proto-kit";
import {
  BellIcon,
  BoltIcon,
  ChartIcon,
  GridIcon,
  RadarIcon,
  SearchIcon,
  SignalIcon,
  SiteIcon,
  SunIcon,
  MoonIcon,
} from "./icons";

const ICONS: Record<ViewId, ReactNode> = {
  overview: <GridIcon size={17} />,
  analytics: <ChartIcon size={17} />,
  sites: <SiteIcon size={17} />,
  insights: <RadarIcon size={17} />,
  tracker: <SignalIcon size={17} />,
};

export function TopBar() {
  const { view, go, density, setDensity, toggleLive, live, notify } = useHelio();
  const { theme, toggleTheme } = useDeviceTheme();

  return (
    <header className="hl-topbar">
      <div className="hl-brand">
        <span className="hl-brand__mark" aria-hidden="true">
          <BoltIcon size={18} />
        </span>
        <span className="hl-brand__name">HELIO</span>
      </div>

      <nav className="hl-nav" aria-label="Sections">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className="hl-nav__pill"
            data-on={view === v.id || undefined}
            aria-current={view === v.id ? "page" : undefined}
            onClick={() => go(v.id)}
          >
            <span className="hl-nav__icon" aria-hidden="true">
              {ICONS[v.id]}
            </span>
            {v.label}
          </button>
        ))}
      </nav>

      <div className="hl-topbar__right">
        <button
          className="hl-pillbtn"
          type="button"
          data-on={live || undefined}
          onClick={toggleLive}
          aria-pressed={live}
        >
          <span className="hl-live-dot" aria-hidden="true" />
          {live ? "Live" : "Paused"}
        </button>
        <button
          className="hl-pillbtn"
          type="button"
          onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
          aria-label={`Density: ${density}`}
        >
          {density === "comfortable" ? "Roomy" : "Compact"}
        </button>
        <button
          className="hl-iconbtn"
          type="button"
          aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </button>
        <button className="hl-iconbtn" type="button" aria-label="Search" onClick={() => notify("Search is on the Sites view") }>
          <SearchIcon size={16} />
        </button>
        <button className="hl-iconbtn" type="button" aria-label="Notifications" onClick={() => notify("2 alerts need a review") }>
          <BellIcon size={16} />
          <i className="hl-iconbtn__dot" />
        </button>
        <span className="hl-avatar" aria-hidden="true">
          AK
        </span>
      </div>
    </header>
  );
}
