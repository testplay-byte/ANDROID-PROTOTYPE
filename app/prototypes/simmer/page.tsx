"use client";

/**
 * simmer / page — "Simmer" recipes & cooking companion (Claymorphism).
 *
 * Puffy clay surfaces everywhere: idle cards ride --shadow-2, every
 * press sinks with translateY + --shadow-inset ("pressed dough"). Dish
 * art is generative CSS (layered clay shapes per recipe), no bitmaps.
 *
 * Shell:
 *   DeviceThemeProvider (simmer-theme, persisted, initial dark) →
 *   SimmerProvider → KeyboardProvider → Stage (side panels) →
 *   DeviceFrame (theme="dark", style="clay")
 *     .sm — app root: hash-routed tabs (#cook #find #plan #kitchen),
 *           a pushed recipe-detail view over the active tab, chunky
 *           soft BottomNav, meal picker sheet, toast. Views remount
 *           with key={view} to replay the staggered entrance. Swipe
 *           left/right walks the tabs; right closes the detail first.
 */

import { useEffect, useState } from "react";
import {
  BottomNav,
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
import { SimmerProvider, useSimmer } from "../../../src/prototypes/simmer/state/simmer-context";
import { CookScreen } from "../../../src/prototypes/simmer/screens/cook-screen";
import { FindScreen } from "../../../src/prototypes/simmer/screens/find-screen";
import { PlanScreen } from "../../../src/prototypes/simmer/screens/plan-screen";
import { KitchenScreen } from "../../../src/prototypes/simmer/screens/kitchen-screen";
import { DetailScreen } from "../../../src/prototypes/simmer/screens/detail-screen";
import { PickerSheet } from "../../../src/prototypes/simmer/components/picker-sheet";
import { Toast } from "../../../src/prototypes/simmer/components/toast";
import { CalIcon, PotIcon, SearchIcon, ShelfIcon } from "../../../src/prototypes/simmer/components/icons";
import { planEntries, RECIPES } from "../../../src/prototypes/simmer/lib/data";

type ViewId = "cook" | "find" | "plan" | "kitchen";
const ORDER: ViewId[] = ["cook", "find", "plan", "kitchen"];

function readHashView(): ViewId {
  if (typeof window === "undefined") return "cook";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (ORDER as string[]).includes(h) ? h : "cook";
}

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  cook: {
    name: "Cook",
    desc: "Home tab — rounded clay header the content scrolls behind, a 'what's cooking' hero with a big generative dish (layered CSS clay shapes per recipe), time/difficulty chips, 'Simmer now' arms the Kitchen dial, and a snap-scrolling Today's picks rail.",
  },
  find: {
    name: "Find",
    desc: "Inset clay search pill (proto-kit keyboard) matching names, blurbs and ingredients; category filter chips with counts. Puffy recipe cards — ingredient count + time — push into the detail view.",
  },
  plan: {
    name: "Plan",
    desc: "Five day cards, midday + evening slots — tap opens a clay picker sheet. The shopping list auto-derives from the week: merged quantities, grouped by aisle, every line a press-in checkbox. All persisted.",
  },
  kitchen: {
    name: "Kitchen",
    desc: "Favorites grid (persisted), the chunky clay dial — start / pause / reset a countdown on a draining ring — quick presets, pantry pucks, and the Dark/Light segmented switch scoped to the device.",
  },
};

const NAV_ITEMS = [
  { id: "cook", label: "Cook", icon: <PotIcon size={22} /> },
  { id: "find", label: "Find", icon: <SearchIcon size={22} /> },
  { id: "plan", label: "Plan", icon: <CalIcon size={22} /> },
  { id: "kitchen", label: "Kitchen", icon: <ShelfIcon size={22} /> },
];

function Shell() {
  const [view, setView] = useState<ViewId>("cook");
  const { openRecipeId, openRecipe, favorites, plan, doneSteps } = useSimmer();
  const stepsDone = Object.values(doneSteps).reduce((n, list) => n + list.length, 0);

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#cook");
      } catch {
        /* sandbox may block hash writes */
      }
    } else {
      setView(readHashView());
    }
    const onPop = () => {
      if (openRecipeId) {
        openRecipe(null);
        return;
      }
      setView(readHashView());
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [openRecipeId, openRecipe]);

  function go(v: ViewId) {
    if (v === view && !openRecipeId) return;
    openRecipe(null);
    if (v !== view) {
      try {
        history.pushState(null, "", `#${v}`);
      } catch {
        /* ignore */
      }
      setView(v);
    }
  }

  /* swipe navigation — right closes the pushed detail first */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (openRecipeId) return;
      const idx = ORDER.indexOf(view);
      if (idx >= 0 && idx < ORDER.length - 1) go(ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      if (openRecipeId) {
        openRecipe(null);
        return;
      }
      const idx = ORDER.indexOf(view);
      if (idx > 0) go(ORDER[idx - 1]);
    },
  });

  const meals = planEntries(plan).filter((e) => e.recipe).length;
  const info = openRecipeId
    ? {
        name: "Recipe detail",
        desc: "Pushed view with its own sticky clay header and puffy back button: big dish, live serving stepper that rescales every quantity, ingredient list, numbered clay-blob steps that press in when done (persisted), and a button that puts the recipe on the clay dial.",
      }
    : SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Simmer</PanelTitle>
          <PanelDesc>
            A recipes &amp; cooking companion molded in Claymorphism —
            puffy shadow-layered surfaces, generative CSS dish art, a
            week&apos;s meal plan that derives an aisle-grouped shopping
            list, and one chunky clay kitchen dial.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Claymorphism</span>
            <span className="tag">Recipes</span>
            <span className="tag">4 tabs</span>
            <span className="tag">Meal planner</span>
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
            <MiniBar label="Recipes" num={String(RECIPES.length)} width={`${Math.min(RECIPES.length * 10, 100)}%`} color="var(--color-primary)" />
            <MiniBar label="Planned" num={String(meals)} width={`${Math.min(meals * 10, 100)}%`} color="#0fa05c" />
            <MiniBar label="Favorites" num={String(favorites.length)} width={`${Math.min(favorites.length * 18, 100)}%`} color="#c94f8c" />
            <MiniBar label="Steps done" num={String(stepsDone)} width={`${Math.min(stepsDone * 7, 100)}%`} color="#f2a618" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Claymorphism</b>
            </div>
            <div className="kvlist__row">
              <span>Surfaces</span>
              <b>Puffy (shadow-2)</b>
            </div>
            <div className="kvlist__row">
              <span>Pressed</span>
              <b>Inset dough</b>
            </div>
            <div className="kvlist__row">
              <span>Dish art</span>
              <b>Generative CSS</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="clay">
        <Screen>
          <div className="sm">
            <div className="sm-screens" key={view}>
              {view === "cook" && <CookScreen />}
              {view === "find" && <FindScreen />}
              {view === "plan" && <PlanScreen />}
              {view === "kitchen" && <KitchenScreen />}
            </div>

            {openRecipeId && <DetailScreen />}

            <PickerSheet />
            <Toast />

            <BottomNav
              items={NAV_ITEMS}
              activeId={view}
              onSelect={(id) => go(id as ViewId)}
              variant="soft"
            />
            <Keyboard />
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
    <DeviceThemeProvider storageKey="simmer-theme" initialTheme="dark">
      <SimmerProvider>
        <KeyboardProvider>
          <Shell />
        </KeyboardProvider>
      </SimmerProvider>
    </DeviceThemeProvider>
  );
}
