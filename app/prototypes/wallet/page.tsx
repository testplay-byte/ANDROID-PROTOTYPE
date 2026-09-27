"use client";

/**
 * wallet / page — "Wallet" prototype (HIG · iOS 26/27 Liquid Glass).
 *
 * An Apple Wallet–style passes & payments app. Registered under the `hig`
 * design language (iOS system palette, SF type scale, grouped lists); the
 * Liquid Glass material (iOS 26) and its iOS 27 refinements — lighter dark
 * glass, a Clear ↔ Tinted density setting, content scrolling under floating
 * glass bars — live in src/prototypes/wallet/wallet.css scoped under `.wl`.
 *
 * Shell:
 *   DeviceThemeProvider (wallet-theme, persisted) → WalletProvider →
 *   Stage (side panels) → DeviceFrame (style="hig") →
 *     .wl  — app root: data-glass = clear|tinted (iOS 27 slider),
 *            screens (large-title nav + scrolling content), floating
 *            glass tab bar, toast.
 *
 * Hash router: #passes / #activity / #pay / #settings.
 */

import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Stage,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { WalletProvider, useWallet } from "../../../src/prototypes/wallet/state/wallet-context";
import { PassesScreen } from "../../../src/prototypes/wallet/screens/passes-screen";
import { ActivityScreen } from "../../../src/prototypes/wallet/screens/activity-screen";
import { PayScreen } from "../../../src/prototypes/wallet/screens/pay-screen";
import { SettingsScreen } from "../../../src/prototypes/wallet/screens/settings-screen";

type ViewId = "passes" | "activity" | "pay" | "settings";
const ORDER: ViewId[] = ["passes", "activity", "pay", "settings"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "passes";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "passes";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  passes: {
    name: "Passes",
    desc: "The Wallet stack — tap a peeking pass to spring it to the front, quick Liquid Glass actions and recent activity per pass.",
  },
  activity: {
    name: "Activity",
    desc: "Searchable transactions across all passes, grouped by day with iOS inset-grouped rows and hairline separators.",
  },
  pay: {
    name: "Pay",
    desc: "Apple Pay–style flow: contact row, glass keypad, Face ID confirmation — payments append to the activity feed.",
  },
  settings: {
    name: "Settings",
    desc: "iOS 27 Liquid Glass density (Clear ↔ Tinted), default card, Express Transit, Face ID and notification toggles.",
  },
};

/* SF-symbol-ish tab glyphs: outline (inactive) / filled (active) variants */
const TAB_ICONS: Record<ViewId, { outline: React.ReactNode; filled: React.ReactNode }> = {
  passes: {
    outline: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3 9.6c6-2.6 12-2.6 18 0" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </>
    ),
    filled: (
      <>
        <path d="M3.6 9.9C9 7.7 15 7.7 20.4 9.9V16a3.2 3.2 0 0 1-3.2 3.2H6.8A3.2 3.2 0 0 1 3.6 16V9.9Z" fill="currentColor" />
        <path d="M4 8.3c5.2-2.7 10.8-2.7 16 0v-.8a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v.8Z" fill="currentColor" opacity=".55" />
      </>
    ),
  },
  activity: {
    outline: (
      <>
        <circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7.6V12l3.2 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    filled: (
      <>
        <circle cx="12" cy="12" r="8.4" fill="currentColor" />
        <path d="M12 7.6V12l3.2 2" fill="none" stroke="var(--color-bg, #000)" strokeWidth="1.9" strokeLinecap="round" />
      </>
    ),
  },
  pay: {
    outline: (
      <>
        <rect x="3" y="6.5" width="18" height="11.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12.2" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.8 9.8v4.8M17.2 9.8v4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".7" />
      </>
    ),
    filled: (
      <>
        <rect x="3" y="6.5" width="18" height="11.5" rx="3" fill="currentColor" />
        <circle cx="12" cy="12.2" r="2.6" fill="var(--color-bg, #000)" />
        <path d="M6.8 9.8v4.8M17.2 9.8v4.8" stroke="var(--color-bg, #000)" strokeWidth="1.6" strokeLinecap="round" opacity=".55" />
      </>
    ),
  },
  settings: {
    outline: (
      <>
        <circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 3.4v2.2M12 18.4v2.2M3.4 12h2.2M18.4 12h2.2M5.9 5.9l1.6 1.6M16.5 16.5l1.6 1.6M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
    filled: (
      <>
        <path
          d="M13.9 2.6a1.4 1.4 0 0 1 1.4 1.2l.2 1.5c.7.3 1.4.7 2 1.2l1.4-.6a1.4 1.4 0 0 1 1.7.6l1.2 2a1.4 1.4 0 0 1-.3 1.8l-1.2 1c.1.4.1.8.1 1.2s0 .8-.1 1.2l1.2 1a1.4 1.4 0 0 1 .3 1.8l-1.2 2a1.4 1.4 0 0 1-1.7.6l-1.4-.6c-.6.5-1.3.9-2 1.2l-.2 1.5a1.4 1.4 0 0 1-1.4 1.2h-2.4a1.4 1.4 0 0 1-1.4-1.2l-.2-1.5a8 8 0 0 1-2-1.2l-1.4.6a1.4 1.4 0 0 1-1.7-.6l-1.2-2a1.4 1.4 0 0 1 .3-1.8l1.2-1a8 8 0 0 1 0-2.4l-1.2-1a1.4 1.4 0 0 1-.3-1.8l1.2-2a1.4 1.4 0 0 1 1.7-.6l1.4.6c.6-.5 1.3-.9 2-1.2l.2-1.5a1.4 1.4 0 0 1 1.4-1.2h2.4Z"
          fill="currentColor"
        />
        <circle cx="12" cy="12" r="3.1" fill="var(--color-bg, #000)" />
      </>
    ),
  },
};

const TAB_LABELS: Record<ViewId, string> = {
  passes: "Passes",
  activity: "Activity",
  pay: "Pay",
  settings: "Settings",
};

function Shell() {
  const { prefs, toastMsg, passes, selectedId } = useWallet();
  const [view, setView] = useState<ViewId>("passes");
  const activePass = passes.find((p) => p.id === selectedId) ?? passes[0];

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#passes");
      } catch {
        /* sandbox may block hash writes */
      }
    } else {
      setView(readHashView());
    }
    const onPop = () => setView(readHashView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(v: ViewId) {
    if (v === view) return;
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
    setView(v);
  }

  /* swipe navigation (proto-kit) */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = ORDER.indexOf(view);
      if (idx >= 0 && idx < ORDER.length - 1) go(ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = ORDER.indexOf(view);
      if (idx > 0) go(ORDER[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Wallet</PanelTitle>
          <PanelDesc>
            An Apple Wallet–style passes &amp; payments app in the iOS 26/27
            Liquid Glass design language: floating glass tab bar and nav bar,
            glass controls over rich pass art, the iOS type scale, inset-grouped
            lists and true iOS motion. Four screens: Passes, Activity, Pay and
            Settings — with the iOS 27 Clear ↔ Tinted glass density setting.
          </PanelDesc>
          <div className="tags">
            <span className="tag">HIG · iOS 26/27</span>
            <span className="tag">Liquid Glass</span>
            <span className="tag">4 screens</span>
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
            <MiniBar label="Pass" num={activePass.name.split(" ")[0]} width="100%" color="var(--color-primary)" />
            <MiniBar label="Face ID" num={prefs.faceId ? "On" : "Off"} width={prefs.faceId ? "85%" : "30%"} color="var(--color-success)" />
            <MiniBar label="Transit" num={prefs.expressTransit ? "On" : "Off"} width={prefs.expressTransit ? "70%" : "30%"} color="var(--color-tertiary)" />
            <MiniBar label="Glass" num={prefs.glass === "tinted" ? "Tinted" : "Clear"} width={prefs.glass === "tinted" ? "85%" : "45%"} color="var(--ios-indigo)" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>HIG · Liquid Glass</b>
            </div>
            <div className="kvlist__row">
              <span>Glass</span>
              <b>{prefs.glass === "tinted" ? "Tinted" : "Clear"} · iOS 27</b>
            </div>
            <div className="kvlist__row">
              <span>Passes</span>
              <b>5</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="hig">
        <div className="wl" data-glass={prefs.glass}>
          <div className="wl-screens">
            {view === "passes" && <PassesScreen go={go} />}
            {view === "activity" && <ActivityScreen />}
            {view === "pay" && <PayScreen />}
            {view === "settings" && <SettingsScreen onOpenPass={() => go("passes")} />}
          </div>

          <nav className="wl-tabbar" aria-label="Primary">
            {ORDER.map((id) => {
              const on = view === id;
              return (
                <button
                  key={id}
                  className={"wl-tab" + (on ? " on" : "")}
                  aria-current={on ? "page" : undefined}
                  onClick={() => go(id)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    {on ? TAB_ICONS[id].filled : TAB_ICONS[id].outline}
                  </svg>
                  <span>{TAB_LABELS[id]}</span>
                </button>
              );
            })}
          </nav>

          <div className={"wl-toast" + (toastMsg ? " show" : "")} role="status">
            {toastMsg}
          </div>
        </div>
      </DeviceFrame>
    </Stage>
  );
}

/** Small helper — one metric row for the right panel. */
function MiniBar({ label, num, width, color }: { label: string; num: string; width: string; color: string }) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">{num}</span>
    </div>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="wallet-theme" initialTheme="dark">
      <WalletProvider>
        <Shell />
      </WalletProvider>
    </DeviceThemeProvider>
  );
}
