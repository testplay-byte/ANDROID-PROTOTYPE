"use client";

/**
 * stockyard / page — "Stockyard" inventory + fulfilment console.
 *
 * A Neo-brutalism DESKTOP build. It follows the meridian shell exactly:
 *
 *   DeviceThemeProvider (scoped to the SURFACE, not just .device)
 *     → StockyardProvider
 *       → Stage (info panels + preview controls, OUTSIDE the app)
 *         → SurfaceFrame (surface="desktop", style="brutalism",
 *                         windowChrome, menu bar, draggable)
 *           · DesktopSidebar — sectioned rail navigation
 *           · DesktopTopBar  — title + ⌘K search slot + actions
 *           · SurfaceScreen  — the active view
 *           · CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, the stock table is multi-column, sortable
 *   and multi-select, detail opens BESIDE the data in a drawer, the
 *   command palette exists, a density preference changes every row
 *   app-wide, and the window auto-fits the stage instead of scrolling.
 *
 * Desktop chrome only: there is no status bar and no bottom nav anywhere
 * in here. Every preview control (fullscreen, surface switcher) belongs
 * to <Stage> and is deliberately outside the app.
 */

import { useEffect, type ReactNode } from "react";
import {
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Stage,
  SurfaceFrame,
  SurfaceScreen,
  DesktopSidebar,
  DesktopTopBar,
  useCanonicalSurface,
  type DesktopNavItem,
} from "../../../src/proto-kit";
import {
  StockyardProvider,
  VIEWS,
  useStockyard,
} from "../../../src/prototypes/stockyard/state/stockyard-context";
import { CommandPalette } from "../../../src/prototypes/stockyard/components/command-palette";
import {
  BellIcon,
  CrateIcon,
  FlowIcon,
  SearchIcon,
  SlidersIcon,
  TruckIcon,
} from "../../../src/prototypes/stockyard/components/icons";
import { InventoryScreen, StockWarning } from "../../../src/prototypes/stockyard/screens/inventory";
import { OrdersScreen } from "../../../src/prototypes/stockyard/screens/orders";
import { MovementScreen } from "../../../src/prototypes/stockyard/screens/movement";
import { SettingsScreen } from "../../../src/prototypes/stockyard/screens/settings";
import { money } from "../../../src/prototypes/stockyard/data";

const NAV: { id: string; label: string; icon: ReactNode }[] = [
  { id: "inventory", label: "Inventory", icon: <CrateIcon /> },
  { id: "orders", label: "Orders", icon: <TruckIcon /> },
  { id: "movement", label: "Movement", icon: <FlowIcon /> },
  { id: "settings", label: "Settings", icon: <SlidersIcon /> },
];

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  inventory: {
    name: "Inventory",
    desc: "The main screen: a category rail, a fixed-layout sortable multi-select stock table (SKU · on-hand · reserved · free · reorder point · unit cost · state) and a detail drawer that opens BESIDE the data with a per-bin breakdown and a working restock form.",
  },
  orders: {
    name: "Orders",
    desc: "The despatch queue. Status chips, a dock list of packed orders, and a detail panel beside the queue. Marking an order shipped draws every line out of the shared inventory and writes the picks to the ledger.",
  },
  movement: {
    name: "Movement",
    desc: "The stock ledger with type filters and a 14-day column chart of units moved. Receipts and picks written by the other two screens land here, and today's bar moves with them.",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop settings: theme (scoped to the window), a row-density switch with a LIVE table preview, four alert switches that read in both palettes, the keyboard map and a yard reset.",
  },
};

function Shell() {
  useCanonicalSurface("stockyard", "desktop");
  const { view, go, density, setDensity, setPaletteOpen, toast, notify, counts, notifications } = useStockyard();

  /* Desktop shortcuts, wired at the window (not on a view). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = !!(e.target as HTMLElement)?.closest("input, textarea, select");
      if (e.key === "/" && !typing) {
        e.preventDefault();
        go("inventory");
        window.setTimeout(() => document.querySelector<HTMLInputElement>(".sy-search input")?.focus(), 60);
      }
      if (/^[1-4]$/.test(e.key) && !typing) {
        go(VIEWS[Number(e.key) - 1].id);
      }
      if ((e.key === "d" || e.key === "D") && !typing && !e.metaKey && !e.ctrlKey) {
        setDensity(density === "dense" ? "regular" : "dense");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, density, setDensity]);

  const navItems: DesktopNavItem[] = [
    { id: "section-yard", label: "Yard", icon: <></>, kind: "section" },
    { id: "inventory", label: "Inventory", icon: <CrateIcon />, badge: counts.skus },
    { id: "orders", label: "Orders", icon: <TruckIcon />, badge: counts.openOrders },
    { id: "movement", label: "Movement", icon: <FlowIcon /> },
    { id: "section-system", label: "System", icon: <></>, kind: "section" },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];
  const alertsOn = Object.values(notifications).filter(Boolean).length;

  return (
    <Stage
      surfaces={["desktop", "tablet"]}
      currentSurface="desktop"
      slug="stockyard"
      fullscreen
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Stockyard</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            <span className="tag">Neo-brutalism</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>SKUs</span>
                <b>{counts.skus}</b>
              </div>
              <div className="kvlist__row">
                <span>Units</span>
                <b>{counts.units.toLocaleString("en-US")}</b>
              </div>
              <div className="kvlist__row">
                <span>Stock value</span>
                <b>{money(counts.value)}</b>
              </div>
              <div className="kvlist__row">
                <span>Low / critical</span>
                <b>
                  {counts.low} / {counts.critical}
                </b>
              </div>
              <div className="kvlist__row">
                <span>Open orders</span>
                <b>{counts.openOrders}</b>
              </div>
            </div>
            <span className="sidepanel__note">
              0px radius, 2px ink borders and hard offset shadows — the brutalism token contract,
              read straight off the surface.
            </span>
          </PanelHead>
        </>
      }
      rightPanel={
        <>
          <PanelBadge>screen</PanelBadge>
          <PanelTitle>{current.name}</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            {VIEWS.map((v) => (
              <span className="tag" key={v.id}>
                {v.label}
              </span>
            ))}
          </div>
        </>
      }
    >
      <SurfaceFrame
        surface="desktop"
        style="brutalism"
        theme="dark"
        windowChrome
        windowTitle="Stockyard — Fulfilment Console"
        menu={["Stockyard", "File", "Edit", "View", "Orders", "Help"]}
        storageKey="stockyard"
        draggable
      >
        <DesktopSidebar items={navItems} activeId={view} onSelect={(id) => go(id as never)} />
        <div className="sy" data-density={density}>
          <DesktopTopBar
            title={current.name}
            subtitle={`Stockyard · ${counts.skus} SKUs · ${counts.units.toLocaleString("en-US")} units`}
            tools={
              <button className="sy-searchbtn" type="button" onClick={() => setPaletteOpen(true)}>
                <SearchIcon size={15} />
                <span>Search or run a command…</span>
                <kbd>⌘K</kbd>
              </button>
            }
            actions={
              <>
                <StockWarning />
                <button
                  className="sy-btn sy-btn--solid"
                  type="button"
                  onClick={() => {
                    go("inventory");
                    notify("Pick the SKU you want to receive into");
                  }}
                >
                  Receive stock
                </button>
                <button
                  className="sy-iconbtn"
                  type="button"
                  aria-label={`Notifications — ${alertsOn} channels on`}
                  onClick={() => go("settings")}
                >
                  <BellIcon size={16} />
                  {alertsOn > 0 && <i className="sy-dot" />}
                </button>
                <button
                  className="sy-btn"
                  type="button"
                  onClick={() => setDensity(density === "dense" ? "regular" : "dense")}
                  aria-label="Toggle row density"
                  title="Toggle row density (D)"
                >
                  {density === "dense" ? "Dense" : "Regular"}
                </button>
                <span className="sy-avatar" aria-hidden="true">
                  DK
                </span>
              </>
            }
          />
          <SurfaceScreen>
            {view === "inventory" && <InventoryScreen />}
            {view === "orders" && <OrdersScreen />}
            {view === "movement" && <MovementScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="sy-toast" role="status">
              {toast}
            </div>
          )}
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="stockyard-theme" initialTheme="dark">
      <StockyardProvider>
        <Shell />
      </StockyardProvider>
    </DeviceThemeProvider>
  );
}
