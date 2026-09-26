"use client";

/**
 * weather-app / page — the prototype entry point (glassmorphism).
 *
 * Renders the full shell:
 *   DeviceThemeProvider (theme, scoped to .device, persisted) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame (style="glass", dark default) → Screen →
 *   ambient blobs (behind everything) → view switch + BottomNav variant="glass".
 *
 * Shared state lives here:
 *   - active city (Today + Forecast + Cities read it; Cities can switch it)
 *   - unit (°C / °F — converted in every screen via lib helpers)
 *   - user-added cities (React state; not persisted — prototype only)
 *
 * Hash router: #today / #forecast / #cities / #settings.
 */

import { useEffect, useMemo, useState } from "react";
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
import { TodayScreen } from "../../../src/prototypes/weather-app/screens/today-screen";
import { ForecastScreen } from "../../../src/prototypes/weather-app/screens/forecast-screen";
import { CitiesScreen } from "../../../src/prototypes/weather-app/screens/cities-screen";
import { SettingsScreen } from "../../../src/prototypes/weather-app/screens/settings-screen";
import {
  CITIES,
  makeCity,
  formatTemp,
  type CityWeather,
  type Unit,
} from "../../../src/prototypes/weather-app/lib/weather";
import {
  SunIcon,
  CalendarIcon,
  MapPinIcon,
  SettingsIcon,
} from "../../../src/prototypes/weather-app/components/icons";

type ViewId = "today" | "forecast" | "cities" | "settings";

const VIEWS: ViewId[] = ["today", "forecast", "cities", "settings"];

const NAV_ITEMS = [
  {
    id: "today",
    label: "Today",
    icon: <SunIcon size={22} />,
  },
  {
    id: "forecast",
    label: "Forecast",
    icon: <CalendarIcon size={22} />,
  },
  {
    id: "cities",
    label: "Cities",
    icon: <MapPinIcon size={22} />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <SettingsIcon size={22} />,
  },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  today: {
    name: "Today",
    desc: "Current conditions for the active city — big temp, glass hourly strip, detail tiles.",
  },
  forecast: {
    name: "Forecast",
    desc: "7-day glass list with hi/lo range bars. Follows the active city and unit.",
  },
  cities: {
    name: "Cities",
    desc: "Saved cities with live temps. Tap to switch the active city, or add a new one.",
  },
  settings: {
    name: "Settings",
    desc: "Theme (light/dark) and °C/°F unit toggle — units apply everywhere instantly.",
  },
};

function readHashView(): ViewId {
  if (typeof window === "undefined") return "today";
  const h = window.location.hash.replace(/^#/, "");
  return (VIEWS as string[]).includes(h) ? (h as ViewId) : "today";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("today");

  // ── Shared state ─────────────────────────────────────────────────────
  const [cityId, setCityId] = useState<string>(CITIES[0].id);
  const [extraCities, setExtraCities] = useState<CityWeather[]>([]);
  const [unit, setUnit] = useState<Unit>("c");

  const cities = useMemo<CityWeather[]>(
    () => [...CITIES, ...extraCities],
    [extraCities]
  );
  const city = cities.find((c) => c.id === cityId) ?? cities[0];

  // ── Hash routing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#today");
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

  // ── City / unit actions ──────────────────────────────────────────────
  function selectCity(id: string) {
    setCityId(id);
  }

  function addCity(name: string) {
    const built = makeCity(name);
    // Avoid exact-duplicate ids (same name added twice).
    if (cities.some((c) => c.id === built.id)) return false;
    setExtraCities((list) => [...list, built]);
    setCityId(built.id);
    return true;
  }

  // ── Swipe gestures (proto-kit) ───────────────────────────────────────
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      const idx = VIEWS.indexOf(view);
      if (idx >= 0 && idx < VIEWS.length - 1) handleNav(VIEWS[idx + 1]);
    },
    onSwipeRight: () => {
      const idx = VIEWS.indexOf(view);
      if (idx > 0) handleNav(VIEWS[idx - 1]);
    },
  });

  const info = SCREEN_INFO[view];

  return (
    <DeviceThemeProvider storageKey="weather-theme" initialTheme="dark">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Weather App</PanelTitle>
            <PanelDesc>
              A glassmorphism weather app. Frosted translucent panels floating
              over colorful ambient light — violet, cyan and amber blobs blur
              behind every surface. Four screens: Today, Forecast, Cities and
              Settings with °C/°F conversion.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Glassmorphism</span>
              <span className="tag">Dark</span>
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
              <MiniBar
                label="City"
                num={city.name.split(" ")[0]}
                width="100%"
                color="var(--color-primary)"
              />
              <MiniBar
                label="Temp"
                num={formatTemp(city.tempC, unit)}
                width="85%"
                color="var(--color-tertiary)"
              />
              <MiniBar
                label="Unit"
                num={unit.toUpperCase()}
                width="45%"
                color="var(--color-warn)"
              />
              <MiniBar
                label="Cities"
                num={String(cities.length)}
                width="70%"
                color="var(--color-success)"
              />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Glass</b>
              </div>
              <div className="kvlist__row">
                <span>Blur</span>
                <b>backdrop 20px · sat 160%</b>
              </div>
              <div className="kvlist__row">
                <span>Ambient</span>
                <b>3 light fields</b>
              </div>
            </div>
          </>
        }
      >
        <DeviceFrame theme="dark" style="glass">
          <Screen>
            {/* Ambient colorful background — behind all glass panels. */}
            <div className="ambient" aria-hidden="true">
              <span className="ambient__blob ambient__blob--violet" />
              <span className="ambient__blob ambient__blob--cyan" />
              <span className="ambient__blob ambient__blob--amber" />
            </div>

            <div className="view" key={view}>
              {view === "today" && <TodayScreen city={city} unit={unit} />}
              {view === "forecast" && (
                <ForecastScreen city={city} unit={unit} />
              )}
              {view === "cities" && (
                <CitiesScreen
                  cities={cities}
                  activeCityId={city.id}
                  unit={unit}
                  onSelectCity={selectCity}
                  onAddCity={addCity}
                />
              )}
              {view === "settings" && (
                <SettingsScreen unit={unit} onUnitChange={setUnit} />
              )}
            </div>
          </Screen>

          <BottomNav
            items={NAV_ITEMS}
            activeId={view}
            onSelect={handleNav}
            variant="glass"
          />
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
  );

  /** Small helper — one metric row for the right panel. */
  function MiniBar({
    label,
    num,
    width,
    color,
  }: {
    label: string;
    num: string;
    width: string;
    color: string;
  }) {
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
}
