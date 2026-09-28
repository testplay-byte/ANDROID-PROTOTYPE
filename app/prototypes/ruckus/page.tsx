"use client";

/**
 * ruckus / page — "Ruckus" live-music gig guide (Neo-brutalism).
 *
 * Shell: DeviceThemeProvider (ruckus-theme) → RuckusProvider → Stage →
 * DeviceFrame (style="brutalism") → .rk root with hash routing
 * (#gigs #bands #venues #me) + a pushed gig detail + toast + swipe.
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
  type NavItem,
} from "../../../src/proto-kit";
import { RuckusProvider, useRuckus } from "../../../src/prototypes/ruckus/state/ruckus-context";
import { GIGS } from "../../../src/prototypes/ruckus/lib/data";
import { GigsScreen } from "../../../src/prototypes/ruckus/screens/gigs-screen";
import { Toast } from "../../../src/prototypes/ruckus/components/chrome";
import { GigDetail } from "../../../src/prototypes/ruckus/screens/gig-detail";
import { BandsScreen } from "../../../src/prototypes/ruckus/screens/bands-screen";
import { VenuesScreen } from "../../../src/prototypes/ruckus/screens/venues-screen";
import { MeScreen } from "../../../src/prototypes/ruckus/screens/me-screen";
import { BoltIcon, CrowdIcon, PersonIcon, SpeakerIcon, VenueIcon } from "../../../src/prototypes/ruckus/components/icons";

type ViewId = "gigs" | "bands" | "venues" | "me";
const ORDER: ViewId[] = ["gigs", "bands", "venues", "me"];

const NAV: NavItem[] = [
  { id: "gigs", label: "Gigs", icon: <BoltIcon size={22} /> },
  { id: "bands", label: "Bands", icon: <SpeakerIcon size={22} /> },
  { id: "venues", label: "Rooms", icon: <VenueIcon size={22} /> },
  { id: "me", label: "Me", icon: <PersonIcon size={22} /> },
];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "gigs";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "gigs";
}

const INFO: Record<ViewId, { name: string; desc: string }> = {
  gigs: { name: "Gigs", desc: "Tonight's lineup as numbered poster rows — tap for the gig, GET TICKETS buys a stub ticket that lands in your wallet." },
  bands: { name: "Bands", desc: "Grid of generative geometric cover art, follow toggles, tap for a band's dates. Followed bands sort first." },
  venues: { name: "Rooms", desc: "Venue list with a segmented capacity meter (loudness), distance and every date each room has booked." },
  me: { name: "Me", desc: "Ticket wallet with perforated stubs, alert switches, theme, and the about block." },
};

function Shell() {
  const [view, setView] = useState<ViewId>("gigs");
  const [gigId, setGigId] = useState<number | null>(null);
  const { tickets, followed } = useRuckus();

  useEffect(() => {
    if (window.location.hash === "") {
      try { history.replaceState(null, "", "#gigs"); } catch { /* sandbox */ }
    } else {
      setView(readHashView());
    }
    const onPop = () => setView(readHashView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function go(v: ViewId) {
    if (v === view) return;
    setGigId(null);
    try { history.pushState(null, "", `#${v}`); } catch { /* ignore */ }
    setView(v);
  }
  function openGig(id: number) { setGigId(id); }

  useSwipeSimulation({
    enabled: gigId === null,
    onSwipeLeft: () => { const i = ORDER.indexOf(view); if (i < ORDER.length - 1) go(ORDER[i + 1]); },
    onSwipeRight: () => { if (gigId !== null) { setGigId(null); return; } const i = ORDER.indexOf(view); if (i > 0) go(ORDER[i - 1]); },
  });

  const info = INFO[view];
  const openGigs = GIGS.filter((g) => !g.soldOut).length;

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Ruckus</PanelTitle>
          <PanelDesc>
            A DIY gig guide in Neo-brutalism — 0px radius, 2-3px ink borders, hard
            offset shadows, marquee tickers and poster type. Lineup, bands, rooms and
            a ticket wallet with perforated stubs.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Neo-brutalism</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Tickets</span>
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
            <div className="mini-bar-row"><span className="mini-bar-label">Tickets</span><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${Math.min(tickets.length * 25, 100)}%`, background: "var(--color-secondary)" }} /></div><span className="mini-bar-num">{tickets.length}</span></div>
            <div className="mini-bar-row"><span className="mini-bar-label">Open gigs</span><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${Math.min(openGigs * 14, 100)}%`, background: "var(--color-primary)" }} /></div><span className="mini-bar-num">{openGigs}</span></div>
            <div className="mini-bar-row"><span className="mini-bar-label">Following</span><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: `${Math.min(followed.length * 20, 100)}%`, background: "var(--color-primary-container)" }} /></div><span className="mini-bar-num">{followed.length}</span></div>
            <div className="mini-bar-row"><span className="mini-bar-label">Rooms</span><div className="mini-bar-track"><div className="mini-bar-fill" style={{ width: "80%", background: "var(--color-tertiary)" }} /></div><span className="mini-bar-num"><CrowdIcon size={12} /></span></div>
          </div>
          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row"><span>Style</span><b>Neo-brutalism</b></div>
            <div className="kvlist__row"><span>Radius</span><b>0px everywhere</b></div>
            <div className="kvlist__row"><span>Shadows</span><b>hard offset, 0 blur</b></div>
            <div className="kvlist__row"><span>Type</span><b>Arial Black poster</b></div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="brutalism">
        <Screen>
          <div className="rk">
            {gigId !== null ? (
              <GigDetail gigId={gigId} onBack={() => setGigId(null)} onOpenGig={openGig} />
            ) : (
              <div key={view}>
                {view === "gigs" && <GigsScreen onOpenGig={openGig} />}
                {view === "bands" && <BandsScreen onOpenGig={openGig} />}
                {view === "venues" && <VenuesScreen onOpenGig={openGig} />}
                {view === "me" && <MeScreen />}
              </div>
            )}
            <Toast />
            <BottomNav variant="hard" items={NAV} activeId={view} onSelect={(id) => go(id as ViewId)} />
          </div>
        </Screen>
      </DeviceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="ruckus-theme" initialTheme="dark">
      <RuckusProvider>
        <Shell />
      </RuckusProvider>
    </DeviceThemeProvider>
  );
}
