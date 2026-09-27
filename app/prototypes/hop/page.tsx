"use client";

/**
 * hop / page — "Hop" food-delivery prototype (Flat Design 2.0).
 *
 * Shell:
 *   DeviceThemeProvider (hop-theme, persisted, initial dark) →
 *   KeyboardProvider (search field uses the custom keyboard) →
 *   HopProvider → Stage (side panels) → DeviceFrame (theme="dark", style="flat")
 *     .hp — app root: hash-routed views (#home #search #orders #account +
 *           #menu<id> pushes), the custom edge-to-edge TabBar (solid inverted
 *           segments — flat chrome, no floating pill), item sheet, cart sheet,
 *           toast. Views remount with key={view} to replay the staggered
 *           entrance. Swipe left/right navigates the tabs; swipe right on a
 *           menu push closes it.
 */

import { useEffect, useState } from "react";
import {
  DeviceFrame,
  DeviceThemeProvider,
  Keyboard,
  KeyboardProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Screen,
  Stage,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { HopProvider, useHop } from "../../../src/prototypes/hop/state/hop-context";
import { TabBar } from "../../../src/prototypes/hop/components/tab-bar";
import { ItemSheet } from "../../../src/prototypes/hop/components/item-sheet";
import { Toast } from "../../../src/prototypes/hop/components/toast";
import { HomeScreen } from "../../../src/prototypes/hop/screens/home-screen";
import { SearchScreen } from "../../../src/prototypes/hop/screens/search-screen";
import { MenuScreen } from "../../../src/prototypes/hop/screens/menu-screen";
import { OrdersScreen, CartSheet } from "../../../src/prototypes/hop/screens/orders-screen";
import { AccountScreen } from "../../../src/prototypes/hop/screens/account-screen";
import { CUISINES, RESTAURANTS, restaurantById } from "../../../src/prototypes/hop/lib/data";
import type { NavTab } from "../../../src/prototypes/hop/lib/data";

const TABS: NavTab[] = ["home", "search", "orders", "account"];

interface Route {
  view: "tab" | "menu";
  tab: NavTab;
  restaurantId: string | null;
}

function parseHash(): Route {
  const fallback: Route = { view: "tab", tab: "home", restaurantId: null };
  if (typeof window === "undefined") return fallback;
  const h = window.location.hash.replace(/^#/, "");
  if ((TABS as string[]).includes(h)) return { view: "tab", tab: h as NavTab, restaurantId: null };
  if (h.startsWith("menu")) {
    const id = h.replace("menu", "");
    if (id) return { view: "menu", tab: "search", restaurantId: id };
  }
  return fallback;
}

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  home: {
    name: "Home",
    desc: "Opens ON a full-bleed cuisine colour plane (flat SVG food art, cuisine squares swap the block), category strips, 'back by demand' rows with solid rating chips + heart squares, and a rotating promo plane.",
  },
  search: {
    name: "Search",
    desc: "Big flat search block (custom keyboard), cuisine colour-grid filter tiles, two-tone split result blocks — art half on the cuisine hue, info half on surface. Rating is a solid chip, never stars.",
  },
  menu: {
    name: "Menu",
    desc: "Pushed restaurant: colour-plane header with knocked-out back/fav, flat delivery strip, menu rows. Square + quick-adds (dot flies into the tab-bar count); items with options open the sheet with square toggles.",
  },
  orders: {
    name: "Orders",
    desc: "Live tracker: 1px rail with a coral dot travelling Confirmed → Cooking → On the way (stage blocks colour-swap as they hit), line summary, past orders with Reorder. Cart sheet: block steppers + solid subtotal footer, Place order starts the tracker.",
  },
  account: {
    name: "Account",
    desc: "Teal identity plane, address cards (tap = default, persisted), payment blocks with square radios, Dark/Light segmented control (hop-theme), notification switches (hop-prefs). Zero shadows throughout.",
  },
};

function Shell() {
  const [route, setRoute] = useState<Route>({ view: "tab", tab: "home", restaurantId: null });
  const { cartCount, cartOpen, liveOrder, pastOrders, favorites, setCartOpen } = useHop();

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
      } catch {
        /* sandbox may block hash writes */
      }
    } else {
      setRoute(parseHash());
    }
    const onPop = () => setRoute(parseHash());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function goTab(tab: NavTab) {
    if (route.view === "tab" && route.tab === tab) return;
    try {
      history.pushState(null, "", `#${tab}`);
    } catch {
      /* ignore */
    }
    setRoute({ view: "tab", tab, restaurantId: null });
  }

  function openRestaurant(id: string) {
    try {
      history.pushState(null, "", `#menu${id}`);
    } catch {
      /* ignore */
    }
    setCartOpen(false);
    setRoute((r) => ({ view: "menu", tab: r.view === "tab" ? r.tab : "search", restaurantId: id }));
  }

  function closeMenu() {
    history.back();
  }

  /* swipe navigation: right on a menu push = back; tabs otherwise */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (route.view === "menu") return;
      const idx = TABS.indexOf(route.tab);
      if (idx >= 0 && idx < TABS.length - 1) goTab(TABS[idx + 1]);
    },
    onSwipeRight: () => {
      if (route.view === "menu") {
        closeMenu();
        return;
      }
      const idx = TABS.indexOf(route.tab);
      if (idx > 0) goTab(TABS[idx - 1]);
    },
  });

  const key = route.view === "menu" ? `menu-${route.restaurantId}` : route.tab;
  const info =
    route.view === "menu" && route.restaurantId
      ? { name: `Menu · ${restaurantById(route.restaurantId).name}`, desc: SCREEN_INFO.menu.desc }
      : SCREEN_INFO[route.tab];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Hop</PanelTitle>
          <PanelDesc>
            A food-delivery app in Flat Design 2.0 — solid cuisine colour
            planes, zero shadows, edge-to-edge inverted tab segments. Four
            tabs plus pushed menus, a live order tracker with a dot
            travelling a 1px rail, cart sheet checkout and a flying-square
            add-to-cart motion.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Flat 2.0</span>
            <span className="tag">Food delivery</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Live tracker</span>
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
            <MiniBar label="Kitchens" num={String(RESTAURANTS.length)} width={`${Math.min(RESTAURANTS.length * 12, 100)}%`} color="#26a69a" />
            <MiniBar label="Cuisines" num={String(CUISINES.length)} width={`${CUISINES.length * 25}%`} color="#ff8a65" />
            <MiniBar label="In cart" num={String(cartCount)} width={`${Math.min(cartCount * 14, 100)}%`} color="#ffb300" />
            <MiniBar label="Delivered" num={String(pastOrders.length)} width={`${Math.min(pastOrders.length * 25, 100)}%`} color="#66bb6a" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Flat 2.0</b>
            </div>
            <div className="kvlist__row">
              <span>Palette</span>
              <b>Teal · coral · amber</b>
            </div>
            <div className="kvlist__row">
              <span>Shadows</span>
              <b>None</b>
            </div>
            <div className="kvlist__row">
              <span>Live order</span>
              <b>{liveOrder ? "tracking" : `${favorites.length} saved`}</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="flat">
        <Screen>
          <div className="hp">
            <div className="hp-views" key={key}>
              {route.view === "tab" && route.tab === "home" && (
                <HomeScreen onOpenRestaurant={openRestaurant} onGoTab={goTab} />
              )}
              {route.view === "tab" && route.tab === "search" && <SearchScreen onOpenRestaurant={openRestaurant} />}
              {route.view === "tab" && route.tab === "orders" && <OrdersScreen />}
              {route.view === "tab" && route.tab === "account" && <AccountScreen />}
              {route.view === "menu" && route.restaurantId && (
                <MenuScreen restaurantId={route.restaurantId} onBack={closeMenu} />
              )}
            </div>

            <ItemSheet />
            <CartSheet />
            <Toast />

            <TabBar active={route.tab} onSelect={goTab} />
          </div>
        </Screen>
        <Keyboard />
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
    <DeviceThemeProvider storageKey="hop-theme" initialTheme="dark">
      <KeyboardProvider>
        <HopProvider>
          <Shell />
        </HopProvider>
      </KeyboardProvider>
    </DeviceThemeProvider>
  );
}
