"use client";

/**
 * finance-hub / page — the prototype entry point.
 *
 * Renders the full shell:
 *   DeviceThemeProvider (dark default, scoped to .device, persisted) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame (style="carbon") → Screen → view switch + BottomNav
 *   (variant="labeled").
 *
 * Hash router: #overview / #activity / #cards / #settings.
 * Swipe left/right navigates the tabs in NAV_ITEMS order.
 */

import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { OverviewScreen } from "../../../src/prototypes/finance-hub/screens/overview-screen";
import { ActivityScreen } from "../../../src/prototypes/finance-hub/screens/activity-screen";
import { CardsScreen } from "../../../src/prototypes/finance-hub/screens/cards-screen";
import { SettingsScreen } from "../../../src/prototypes/finance-hub/screens/settings-screen";

type ViewId = "overview" | "activity" | "cards" | "settings";

const SWIPE_ORDER: ViewId[] = ["overview", "activity", "cards", "settings"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "overview";
  const h = window.location.hash.replace(/^#/, "");
  return (SWIPE_ORDER as string[]).includes(h) ? (h as ViewId) : "overview";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("overview");

  // ── Hash routing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#overview");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
    } else {
      setView(readHashView());
    }
  }, []);

  useEffect(() => {
    function onPop() {
      setView(readHashView());
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    if (id === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    setView(id as ViewId);
  }

  // ── Swipe gestures (proto-kit) ───────────────────────────────────────
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) handleNav(SWIPE_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) handleNav(SWIPE_ORDER[idx - 1]);
    },
  });

  const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
    overview: {
      name: "Overview",
      desc: "Balance card, 12-month spending bar chart (peak month in IBM blue), quick actions and a recent-transactions preview.",
    },
    activity: {
      name: "Activity",
      desc: "Filter chips (ALL/IN/OUT) and the full transaction list grouped by date. Tap a row to expand id, status tag and type.",
    },
    cards: {
      name: "Cards",
      desc: "Snap-scroll deck of two flat cards with IBM blue accent strip, per-card freeze toggles and a show-number reveal.",
    },
    settings: {
      name: "Settings",
      desc: "Theme toggle, push/email/SMS notification switches and language select in 0-radius bordered groups.",
    },
  };

  const info = SCREEN_INFO[view];

  const NAV_ITEMS = [
    {
      id: "overview",
      label: "Overview",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <rect x="3" y="3" width="8" height="10" />
          <rect x="13" y="3" width="8" height="6" />
          <rect x="3" y="15" width="8" height="6" />
          <rect x="13" y="11" width="8" height="10" />
        </svg>
      ),
    },
    {
      id: "activity",
      label: "Activity",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <path d="M3 12h4l3-8 4 16 3-8h4" />
        </svg>
      ),
    },
    {
      id: "cards",
      label: "Cards",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <rect x="2" y="5" width="20" height="14" />
          <path d="M2 10h20" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      ),
    },
  ];

  return (
    <DeviceThemeProvider storageKey="finance-hub-theme" initialTheme="dark">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Finance Hub</PanelTitle>
            <PanelDesc>
              An IBM Carbon banking app. Flat layer surfaces, 1px borders
              instead of shadows, 0px radius everywhere, IBM blue only for
              primary actions and active states. Overview with spending
              chart, filterable activity feed, snap-scroll cards with freeze
              toggles, and carbon-style settings.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Carbon</span>
              <span className="tag">IBM</span>
              <span className="tag">4 tabs</span>
            </div>
          </>
        }
        rightPanel={
          <>
            <PanelHead>Screen info</PanelHead>
            <div className="screeninfo">
              <span className="screeninfo__name">{info.name}</span>
              <span className="screeninfo__desc">{info.desc}</span>
            </div>

            <PanelHead>Interactions</PanelHead>
            <div className="mini-bars">
              <MiniBar label="Chart" width="100%" color="var(--color-primary)" />
              <MiniBar label="Filters" width="80%" color="var(--color-tertiary)" />
              <MiniBar label="Expand" width="70%" color="var(--color-warn)" />
              <MiniBar label="Freeze" width="55%" color="var(--color-error)" />
              <MiniBar label="Reveal" width="40%" color="var(--color-success)" />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>IBM Carbon</b>
              </div>
              <div className="kvlist__row">
                <span>Structure</span>
                <b>1px borders, layers</b>
              </div>
              <div className="kvlist__row">
                <span>Shadows</span>
                <b>none</b>
              </div>
              <div className="kvlist__row">
                <span>Primary</span>
                <b>#0f62fe</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="dark" style="carbon">
          <Screen>
            {view === "overview" && (
              <OverviewScreen onSeeAllActivity={() => handleNav("activity")} />
            )}
            {view === "activity" && <ActivityScreen />}
            {view === "cards" && <CardsScreen />}
            {view === "settings" && <SettingsScreen />}
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="labeled"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );
}

/** A single mini-bar row in the right info panel. */
function MiniBar({
  label,
  width,
  color,
}: {
  label: string;
  width: string;
  color: string;
}) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">•</span>
    </div>
  );
}
