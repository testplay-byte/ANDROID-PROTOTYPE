"use client";

/**
 * drift / page — "Drift" podcast & audio player (Glassmorphism, style `glass`).
 *
 * The color-discipline showcase: milky low-alpha white glass (0.10–0.22 +
 * blur + saturate 1.6) floating over a fixed vivid mesh-gradient backdrop
 * whose hue rotates per tab — dawn amber (Listen) → sea teal (Browse) →
 * dusk magenta (Player) → forest green (Library). Warm-led, never a
 * generic blue. All glass chrome is its own language here: a floating
 * glass header pill instead of a large-title bar, a persistent mini-player
 * above the proto-kit glass dock.
 *
 * Shell:
 *   DeviceThemeProvider (drift-theme, persisted, initial dark) →
 *   DriftProvider → Stage (side panels) → DeviceFrame (theme="dark",
 *   style="glass")
 *     .dr — app root: hash-routed screens (#listen #browse #player
 *           #library), data-scene drives the backdrop cross-fade;
 *           ambient (.dr-bg wash/fields/orbs/grain), DrHeader pill,
 *           scroll content, DrMiniPlayer + BottomNav(glass) dock pair,
 *           toast. Views remount with key={view} to replay the staggered
 *           entrance. Swipe left/right navigates the tabs.
 */

import { useEffect, useState } from "react";
import {
  BottomNav,
  DeviceFrame,
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Screen,
  Stage,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { DriftProvider, useDrift } from "../../../src/prototypes/drift/state/drift-context";
import { DrHeader, DrMiniPlayer, DrToast } from "../../../src/prototypes/drift/components/chrome";
import { ListenScreen } from "../../../src/prototypes/drift/screens/listen-screen";
import { BrowseScreen } from "../../../src/prototypes/drift/screens/browse-screen";
import { PlayerScreen } from "../../../src/prototypes/drift/screens/player-screen";
import { LibraryScreen } from "../../../src/prototypes/drift/screens/library-screen";
import { HeadphonesIcon, WaveIcon, CompassIcon, StackIcon } from "../../../src/prototypes/drift/components/icons";

type ViewId = "listen" | "browse" | "player" | "library";
const ORDER: ViewId[] = ["listen", "browse", "player", "library"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "listen";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "listen";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  listen: {
    name: "Listen",
    desc: "Featured-show hero over a full-bleed generative cover, follow toggle, continue-listening card with the live waveform, and a grid of eight shows. Dawn-amber scene; tapping a card jumps to Browse with that show open.",
  },
  browse: {
    name: "Browse",
    desc: "Warm category chips, three horizontal snap rows (editor's picks / wind down / long-form), and an in-place show detail with the episode list — play, follow and download per episode. Sea-teal scene.",
  },
  player: {
    name: "Player",
    desc: "The showcase glass screen: big cover on a breathing palette glow, waveform + draggable glass scrubber (click or drag to seek), full transport, segmented speed picker and sleep-timer chips. Dusk-magenta scene.",
  },
  library: {
    name: "Library",
    desc: "Segmented glass sections — Downloads (stateful toggles + total hours), Following (unfollow), History (resume where you left off, clear) — each with a glass empty state. Forest-green scene.",
  },
};

const NAV_ITEMS = [
  { id: "listen", label: "Listen", icon: <HeadphonesIcon size={22} /> },
  { id: "browse", label: "Browse", icon: <CompassIcon size={22} /> },
  { id: "player", label: "Player", icon: <WaveIcon size={22} /> },
  { id: "library", label: "Library", icon: <StackIcon size={22} /> },
];

function Shell() {
  const [view, setView] = useState<ViewId>("listen");
  const [browseShowId, setBrowseShowId] = useState<string | null>(null);
  const { now, show, episode, downloads, subscriptions } = useDrift();

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#listen");
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

  function openShow(showId: string) {
    setBrowseShowId(showId);
    go("browse");
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
          <PanelTitle>Drift</PanelTitle>
          <PanelDesc>
            A podcast &amp; audio player that makes glassmorphism&apos;s color
            discipline the product: milky low-alpha glass over a vivid
            mesh-gradient backdrop whose hue rotates per tab — dawn amber,
            sea teal, dusk magenta, forest green. Generative cover art,
            live waveforms, a draggable glass scrubber and a mini-player
            docked above the glass nav.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Glass</span>
            <span className="tag">Podcasts</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Per-tab scenes</span>
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
            <MiniBar label="Scene" num={view} width="100%" color="var(--color-primary)" />
            <MiniBar label="Now" num={now.playing ? "live" : "paused"} width={now.playing ? "86%" : "34%"} color="#5eead4" />
            <MiniBar label="Saved" num={String(downloads.length)} width={`${Math.min(downloads.length * 25, 100)}%`} color="#ffb45c" />
            <MiniBar label="Follows" num={String(subscriptions.length)} width={`${Math.min(subscriptions.length * 18, 100)}%`} color="#f56bb0" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Glass · milky white</b>
            </div>
            <div className="kvlist__row">
              <span>Glass fills</span>
              <b>0.10 → 0.22 + sat 1.6</b>
            </div>
            <div className="kvlist__row">
              <span>Backdrop</span>
              <b>4 tab scenes, animated</b>
            </div>
            <div className="kvlist__row">
              <span>Nav</span>
              <b>BottomNav glass + mini bar</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="glass">
        <Screen>
          <div className="dr" data-scene={view}>
            {/* ambient scene — fixed, hue rotates per tab */}
            <div className="dr-bg" aria-hidden="true">
              <span className="dr-bg__wash" />
              <span className="dr-bg__field" />
              <span className="dr-bg__orb o1" />
              <span className="dr-bg__orb o2" />
              <span className="dr-bg__orb o3" />
              <span className="dr-bg__scrim" />
              <span className="dr-bg__grain" />
            </div>

            <DrHeader view={view} />

            <div className="dr-screens" key={view}>
              {view === "listen" && <ListenScreen onOpenShow={openShow} />}
              {view === "browse" && (
                <BrowseScreen openShowId={browseShowId} onConsumed={() => setBrowseShowId(null)} />
              )}
              {view === "player" && <PlayerScreen />}
              {view === "library" && <LibraryScreen />}
            </div>

            {view !== "player" && <DrMiniPlayer onOpen={() => go("player")} />}

            <BottomNav
              variant="glass"
              items={NAV_ITEMS}
              activeId={view}
              onSelect={(id) => go(id as ViewId)}
            />

            <DrToast />
            {/* keep cover art's aria quiet for reviewers — now-playing chip */}
            <span className="dr-sr" aria-live="polite">
              {now.playing ? `Playing ${episode.title} from ${show.title}` : ""}
            </span>
          </div>
        </Screen>
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
    <DeviceThemeProvider storageKey="drift-theme" initialTheme="dark">
      <DriftProvider>
        <Shell />
      </DriftProvider>
    </DeviceThemeProvider>
  );
}
