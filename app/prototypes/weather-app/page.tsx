"use client";

/**
 * weather-app / page — "Aurora Weather" glassmorphism prototype.
 *
 * Exact recreation of the reference project (C:/Users/khurr/Desktop/GLASS/DL/aurora-weather,
 * v3 ES-modules app) on this repo's stack: React screens + proto-kit shell.
 * The reference's look, animations and functionality are kept 1:1 — see
 * the prototype README and docs/design-languages/glass.md.
 *
 * Shell:
 *   DeviceThemeProvider (device dark/light derived from the backdrop theme,
 *     night ⇒ dark) → WeatherProvider (prefs, router, overlays) →
 *   Stage (side panels + device) → DeviceFrame (style="glass") →
 *     .wa  — the app root: data-sky = dawn|day|dusk|night drives the ambient
 *            palette; carries --wa-blur (glass blur setting) + .wa-rm (reduce
 *            motion). Inside: .wa-bg ambient (orbs + spheres + grain),
 *            .chrome-fade scrim, .wa-screens (hash-routed views),
 *            glass topbar, dock nav, splash/loading/toast/modal overlays.
 *
 * Hash router: #home / #forecast / #cities / #settings.
 */

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Stage,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useDeviceTheme,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { WeatherProvider, useWeather } from "../../../src/prototypes/weather-app/state/weather-context";
import type { ViewId } from "../../../src/prototypes/weather-app/state/weather-context";
import { GradientDefs } from "../../../src/prototypes/weather-app/components/icons";
import { WaTopbar, WaDock } from "../../../src/prototypes/weather-app/components/chrome";
import { WaSplash, WaLoading, WaToast, WaDayModal } from "../../../src/prototypes/weather-app/components/overlays";
import { HomeScreen } from "../../../src/prototypes/weather-app/screens/home-screen";
import { ForecastScreen } from "../../../src/prototypes/weather-app/screens/forecast-screen";
import { CitiesScreen } from "../../../src/prototypes/weather-app/screens/cities-screen";
import { SettingsScreen } from "../../../src/prototypes/weather-app/screens/settings-screen";
import { ErrorScreen } from "../../../src/prototypes/weather-app/screens/error-screen";
import { deg } from "../../../src/prototypes/weather-app/lib/prefs";
import { rafThrottle } from "../../../src/prototypes/weather-app/lib/utils";

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  home: {
    name: "Weather",
    desc: "Hero card with count-up temperature, glossy condition glyph, 7 metric tiles, sun arc, hourly strip and 7-day outlook.",
  },
  forecast: {
    name: "Forecast",
    desc: "24-hour chart with Temperature / Precipitation / Wind modes, hourly tiles, detail grid and 7-day rows.",
  },
  cities: {
    name: "Cities",
    desc: "Search to add or open cities, star favorites, current-city badge and remove — persisted in localStorage.",
  },
  settings: {
    name: "Settings",
    desc: "°C/°F, wind units, 12h/24h, four backdrop themes (night = dark), auto theme, glass blur, reduce motion, error simulation, reset.",
  },
  error: {
    name: "Error",
    desc: "Connection-failure state — triggered by the refresh button when 'Simulate connection error' is on in Settings.",
  },
};

const ORDER: ViewId[] = ["home", "forecast", "cities", "settings"];

function Shell() {
  const { prefs, view, go, city, wx, effTheme } = useWeather();
  const { setTheme } = useDeviceTheme();
  const waRef = useRef<HTMLDivElement>(null);

  /* device chrome theme follows the backdrop theme: night ⇒ dark mode */
  useEffect(() => {
    setTheme(effTheme === "night" ? "dark" : "light");
  }, [effTheme, setTheme]);

  /* swipe navigation (proto-kit) */
  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (view === "error") return;
      const idx = ORDER.indexOf(view);
      if (idx >= 0 && idx < ORDER.length - 1) go(ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      if (view === "error") return;
      const idx = ORDER.indexOf(view);
      if (idx > 0) go(ORDER[idx - 1]);
    },
  });

  /* desktop parallax — rAF-throttled pointer drift on the ambient floaters
     (ported from the reference main.js initParallax) */
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const root = waRef.current;
    if (!root) return;
    const floaters = Array.from(root.querySelectorAll<HTMLElement>(".orb, .sphere"));
    const apply = rafThrottle((x: number, y: number) => {
      if (prefs.reduceMotion || document.hidden) return;
      const dx = x / window.innerWidth - 0.5;
      const dy = y / window.innerHeight - 0.5;
      floaters.forEach((o, i) => {
        const f = ((i % 4) + 2) * 7;
        o.style.translate = `${(dx * f).toFixed(1)}px ${(dy * f).toFixed(1)}px`;
      });
    });
    const onMove = (e: PointerEvent) => apply(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [prefs.reduceMotion]);

  const info = SCREEN_INFO[view] ?? SCREEN_INFO.home;

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>prototype</PanelBadge>
          <PanelTitle>Aurora Weather</PanelTitle>
          <PanelDesc>
            A glassmorphism weather app recreated 1:1 from the Aurora Weather
            reference: milky low-alpha glass over a vivid four-theme sky
            (dawn / day / dusk / night), drifting orbs and frosted spheres,
            glossy gradient weather glyphs and spring-soft motion throughout.
            Four screens: Weather, Forecast, Cities and Settings.
          </PanelDesc>
          <div className="tags">
            <span className="tag">Glassmorphism</span>
            <span className="tag">4 sky themes</span>
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
            <MiniBar label="City" num={city.name.split(" ")[0]} width="100%" color="var(--color-primary)" />
            <MiniBar label="Temp" num={deg(wx.current.temp, prefs.unit)} width="85%" color="var(--color-tertiary)" />
            <MiniBar label="Sky" num={effTheme} width="60%" color="var(--color-warn)" />
            <MiniBar label="Cities" num={String(prefs.favorites.length)} width="70%" color="var(--color-success)" />
          </div>

          <PanelHead>Design</PanelHead>
          <div className="kvlist">
            <div className="kvlist__row">
              <span>Style</span>
              <b>Glass</b>
            </div>
            <div className="kvlist__row">
              <span>Blur</span>
              <b>{prefs.blur}px · sat 160%</b>
            </div>
            <div className="kvlist__row">
              <span>Ambient</span>
              <b>orbs + spheres</b>
            </div>
          </div>
        </>
      }
    >
      <DeviceFrame theme="dark" style="glass">
        <GradientDefs />
        <div
          ref={waRef}
          className={"wa" + (prefs.reduceMotion ? " wa-rm" : "")}
          data-sky={effTheme}
          style={{ "--wa-blur": `${prefs.blur}px` } as CSSProperties}
        >
          {/* ambient scene — behind everything, including the status bar */}
          <div className="wa-bg" aria-hidden="true">
            <span className="orb b1" />
            <span className="orb b2" />
            <span className="orb b3" />
            <span className="orb b4" />
            <span className="sphere sp1" />
            <span className="sphere sp2" />
            <span className="sphere sp3" />
            <div className="grain" />
          </div>

          <div className="chrome-fade" aria-hidden="true" />

          <div className="wa-screens">
            <section className="wa-screen active enter" key={view} aria-label={info.name}>
              {view === "home" && <HomeScreen />}
              {view === "forecast" && <ForecastScreen />}
              {view === "cities" && <CitiesScreen />}
              {view === "settings" && <SettingsScreen />}
              {view === "error" && <ErrorScreen />}
            </section>
          </div>

          <WaTopbar />
          <WaDock />

          <WaLoading />
          <WaDayModal />
          <WaToast />
          <WaSplash />
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
    <DeviceThemeProvider storageKey="weather-theme" initialTheme="dark">
      <WeatherProvider>
        <Shell />
      </WeatherProvider>
    </DeviceThemeProvider>
  );
}
