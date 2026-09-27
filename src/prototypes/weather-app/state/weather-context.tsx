"use client";

/* weather-context — central client state for the aurora weather prototype.
   Owns: persisted prefs (localStorage), the hash router (home/forecast/
   cities/settings), transient overlays (splash/loading/toast/day modal),
   and every action (refresh, city switch, favorites, settings toggles).
   The device light/dark theme is derived: night ⇒ dark, else light. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { CITY_BY_ID, cityNow, dateLabelLong } from "../lib/data";
import type { City } from "../lib/data";
import { cityWeather, resetCache } from "../lib/engine";
import type { CityWeatherData } from "../lib/engine";
import {
  DEFAULT_PREFS,
  loadPrefs,
  resetPrefs,
  savePrefs,
} from "../lib/prefs";
import type { Prefs, ThemeId, Unit, WindUnit, TimeFormat } from "../lib/prefs";

export type ViewId = "home" | "forecast" | "cities" | "settings" | "error";
const VIEWS: ViewId[] = ["home", "forecast", "cities", "settings"];

interface WeatherContextValue {
  prefs: Prefs;
  view: ViewId;
  go: (v: ViewId) => void;
  city: City;
  wx: CityWeatherData;
  effTheme: ThemeId;
  loading: boolean;
  splashHidden: boolean;
  refreshing: boolean;
  modalDay: number | null;
  openDayModal: (i: number) => void;
  closeModal: () => void;
  toastMsg: string | null;
  showToast: (m: string) => void;
  refreshWeather: () => void;
  selectCity: (id: string) => void;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  setUnit: (u: Unit) => void;
  setWindU: (u: WindUnit) => void;
  setTimeF: (f: TimeFormat) => void;
  setTheme: (t: ThemeId) => void;
  setThemeAuto: (on: boolean) => void;
  setBlur: (px: number) => void;
  setReduceMotion: (on: boolean) => void;
  setSimError: (on: boolean) => void;
  resetAll: () => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

function readHashView(): ViewId {
  if (typeof window === "undefined") return "home";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (VIEWS as string[]).includes(h) ? h : "home";
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [view, setView] = useState<ViewId>("home");
  const [loading, setLoading] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* load persisted prefs once */
  useEffect(() => {
    setPrefsState(loadPrefs());
  }, []);

  const patch = useCallback((p: Partial<Prefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      savePrefs(next);
      return next;
    });
  }, []);

  /* splash → hide after 1.5s (transition .65s) */
  useEffect(() => {
    const t = setTimeout(() => setSplashHidden(true), 1500);
    return () => clearTimeout(t);
  }, []);

  /* hash routing */
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
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

  const go = useCallback((v: ViewId) => {
    setView((prev) => {
      if (v === prev) return prev;
      try {
        history.pushState(null, "", `#${v}`);
      } catch {
        /* ignore */
      }
      return v;
    });
  }, []);

  const city = CITY_BY_ID[prefs.city] ?? CITY_BY_ID[DEFAULT_PREFS.city];
  const wx = useMemo(() => cityWeather(city), [city]);
  const localHour = cityNow(city).getHours();

  /* auto theme maps the city's local hour onto a backdrop theme */
  const effTheme: ThemeId = useMemo(() => {
    if (!prefs.themeAuto) return prefs.theme;
    if (localHour >= 5 && localHour < 10) return "dawn";
    if (localHour >= 10 && localHour < 17) return "day";
    if (localHour >= 17 && localHour < 21) return "dusk";
    return "night";
  }, [prefs.themeAuto, prefs.theme, localHour]);

  const showToast = useCallback((m: string) => {
    setToastMsg(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2300);
  }, []);

  const refreshWeather = useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    setTimeout(() => {
      setRefreshing(false);
      if (prefs.simError) {
        setLoading(false);
        setView((v) => {
          try {
            history.pushState(null, "", "#home");
          } catch {
            /* ignore */
          }
          return "error";
        });
        return;
      }
      patch({ updated: Date.now() });
      resetCache();
      setLoading(false);
      setView((prev) => (prev === "error" ? "home" : prev));
      showToast("Forecast refreshed");
    }, 820);
  }, [prefs.simError, patch, showToast]);

  const selectCity = useCallback(
    (id: string) => {
      if (id === prefs.city) {
        go("home");
        return;
      }
      patch({ city: id });
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        go("home");
      }, 720);
    },
    [prefs.city, patch, go]
  );

  const addFavorite = useCallback(
    (id: string) => {
      if (prefs.favorites.includes(id)) {
        showToast("Already in your list");
        return;
      }
      patch({ favorites: [...prefs.favorites, id] });
      showToast(CITY_BY_ID[id].name + " added to your cities");
    },
    [prefs.favorites, patch, showToast]
  );

  const removeFavorite = useCallback(
    (id: string) => {
      if (prefs.city === id) {
        showToast("Switch away from this city first");
        return;
      }
      patch({ favorites: prefs.favorites.filter((f) => f !== id) });
      showToast(CITY_BY_ID[id].name + " removed");
    },
    [prefs.city, prefs.favorites, patch, showToast]
  );

  const value: WeatherContextValue = {
    prefs,
    view,
    go,
    city,
    wx,
    effTheme,
    loading,
    splashHidden,
    refreshing,
    modalDay,
    openDayModal: setModalDay,
    closeModal: () => setModalDay(null),
    toastMsg,
    showToast,
    refreshWeather,
    selectCity,
    addFavorite,
    removeFavorite,
    setUnit: (u) => {
      patch({ unit: u });
      showToast("Temperature in " + (u === "c" ? "Celsius" : "Fahrenheit"));
    },
    setWindU: (u) => patch({ windU: u }),
    setTimeF: (f) => patch({ timeF: f }),
    setTheme: (t) => patch({ theme: t, themeAuto: false }),
    setThemeAuto: (on) => {
      patch({ themeAuto: on });
      showToast(on ? "Theme follows the city's clock" : "Auto theme off");
    },
    setBlur: (px) => patch({ blur: px }),
    setReduceMotion: (on) => patch({ reduceMotion: on }),
    setSimError: (on) => {
      patch({ simError: on });
      showToast(on ? "Errors on — try the refresh button" : "Errors off — refresh will succeed");
    },
    resetAll: () => {
      setPrefsState(resetPrefs());
      showToast("Prototype reset");
    },
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(): WeatherContextValue {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within <WeatherProvider>");
  return ctx;
}

/** Topbar subtitle per view (ported from the reference router.js chrome sync) */
export function topbarInfo(view: ViewId, city: City): { t1: string; t2: string; pin: boolean } {
  switch (view) {
    case "home":
      return { t1: city.name, t2: dateLabelLong(cityNow(city)), pin: true };
    case "forecast":
      return { t1: city.name, t2: "7-day & hourly outlook", pin: false };
    case "cities":
      return { t1: "Cities", t2: "Search & manage your saved places", pin: false };
    case "settings":
      return { t1: "Settings", t2: "Units, theme & preferences", pin: false };
    case "error":
      return { t1: "Weather", t2: "Connection issue", pin: false };
  }
}
