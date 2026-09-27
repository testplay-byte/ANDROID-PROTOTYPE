"use client";

/* ============================================================
   drift / state / drift-context.tsx — central client state.

   - now-playing: show + episode + ticking progress (setInterval
     while playing, advancing by the playback speed), skip within
     the show, click/drag seek, speed, sleep timer
   - downloads + subscriptions + history: persisted sets/lists
   - prefs: speed + sleep persist; first-run seeds a few so the
     Library has content
   - toast (message + icon slot)

   localStorage keys are all namespaced `drift-*` (SSR-safe:
   everything hydrates in one effect after mount).
   ============================================================ */

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
import {
  neighborEpisode,
  showById,
  type Episode,
  type Show,
} from "../lib/data";

export type ToastIcon = "play" | "download" | "check" | "heart" | "moon" | "info";
export const SPEEDS = [1, 1.25, 1.5, 2] as const;
export type Speed = (typeof SPEEDS)[number];
export const SLEEP_OPTIONS = [0, 15, 30, 45, 60] as const; // minutes, 0 = off

export interface NowPlaying {
  showId: string;
  episodeId: string;
  progress: number; // seconds
  playing: boolean;
}

export interface HistoryEntry {
  episodeId: string;
  at: number; // epoch ms
}

interface Toast {
  msg: string;
  icon: ToastIcon;
}

interface DriftContextValue {
  /* now playing */
  now: NowPlaying;
  show: Show;
  episode: Episode;
  duration: number;
  speed: Speed;
  sleepMin: number;
  play: (showId: string, episodeId: string, startAt?: number) => void;
  togglePlay: () => void;
  skip: (dir: 1 | -1) => void;
  seek: (sec: number) => void;
  setSpeed: (s: Speed) => void;
  setSleep: (m: number) => void;

  /* library state */
  downloads: string[];
  toggleDownload: (episodeId: string) => void;
  subscriptions: string[];
  toggleSubscribe: (showId: string) => void;
  history: HistoryEntry[];
  clearHistory: () => void;

  /* toast */
  toast: Toast | null;
  showToast: (msg: string, icon?: ToastIcon) => void;
}

const NOW_KEY = "drift-now-v1";
const DOWNLOADS_KEY = "drift-downloads-v1";
const SUBS_KEY = "drift-subs-v1";
const HISTORY_KEY = "drift-history-v1";
const PREFS_KEY = "drift-prefs-v1";

const DEFAULT_NOW: NowPlaying = {
  showId: "tidal",
  episodeId: "td-75",
  progress: 512,
  playing: false,
};
const DEFAULT_DOWNLOADS = ["gh-117", "ss-60", "us-30"];
const DEFAULT_SUBS = ["golden-hour", "tidal", "understory", "signal-static", "coastal-drift"];

function loadJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function saveJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode — session-only state is fine */
  }
}

const DriftContext = createContext<DriftContextValue | null>(null);

export function DriftProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<NowPlaying>(DEFAULT_NOW);
  const [speed, setSpeedState] = useState<Speed>(1);
  const [sleepMin, setSleepMin] = useState<number>(0);
  const [downloads, setDownloads] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const hydrated = useRef(false);

  const show = showById(now.showId) ?? showById(DEFAULT_NOW.showId)!;
  const episode = show.episodes.find((e) => e.id === now.episodeId) ?? show.episodes[0];
  const duration = episode.seconds;

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const n = loadJson<NowPlaying>(NOW_KEY);
    if (n && showById(n.showId) && typeof n.progress === "number") {
      setNow({ ...n, playing: false }); // never autoplay across reloads
    }
    const d = loadJson<string[]>(DOWNLOADS_KEY);
    setDownloads(Array.isArray(d) ? d : DEFAULT_DOWNLOADS);
    const s = loadJson<string[]>(SUBS_KEY);
    setSubscriptions(Array.isArray(s) ? s : DEFAULT_SUBS);
    const h = loadJson<HistoryEntry[]>(HISTORY_KEY);
    setHistory(Array.isArray(h) ? h : []);
    const p = loadJson<{ speed?: Speed; sleep?: number }>(PREFS_KEY);
    if (p && (SPEEDS as readonly number[]).includes(p.speed ?? 1)) setSpeedState(p.speed ?? 1);
    if (p && typeof p.sleep === "number") setSleepMin(p.sleep);
    hydrated.current = true;
  }, []);

  const showToast = useCallback((msg: string, icon: ToastIcon = "info") => {
    setToast({ msg, icon });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  /* persist progress — throttled to every 5 s of playback + on pause */
  useEffect(() => {
    if (!hydrated.current) return;
    if (!now.playing || now.progress % 5 === 0) saveJson(NOW_KEY, now);
  }, [now]);

  /* the tick — 1 s of wall-clock adds `speed` seconds of audio */
  useEffect(() => {
    if (!now.playing) return;
    const t = window.setInterval(() => {
      setNow((n) => (n.playing ? { ...n, progress: n.progress + speed } : n));
    }, 1000);
    return () => window.clearInterval(t);
  }, [now.playing, speed]);

  /* episode finished — with a sleep timer on, drift off here instead
     (the demo's timer fires at end-of-episode, not after real minutes) */
  useEffect(() => {
    if (now.progress < duration) return;
    if (sleepMin > 0) {
      setNow((n) => ({ ...n, playing: false, progress: duration }));
      showToast("Sleep timer — drift off", "moon");
      return;
    }
    const next = neighborEpisode(show, episode.id, 1);
    setNow((n) => ({ ...n, episodeId: next.id, progress: 0 }));
    recordHistory(next.id);
    showToast(`Next: ${next.title}`, "play");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now.progress >= duration]);

  const recordHistory = useCallback((episodeId: string) => {
    setHistory((prev) => {
      const next = [{ episodeId, at: Date.now() }, ...prev.filter((h) => h.episodeId !== episodeId)].slice(0, 24);
      saveJson(HISTORY_KEY, next);
      return next;
    });
  }, []);

  const play = useCallback(
    (showId: string, episodeId: string, startAt = 0) => {
      setNow({ showId, episodeId, progress: startAt, playing: true });
      saveJson(NOW_KEY, { showId, episodeId, progress: startAt, playing: false });
      recordHistory(episodeId);
    },
    [recordHistory],
  );

  const togglePlay = useCallback(() => {
    setNow((n) => {
      const next = { ...n, playing: !n.playing };
      saveJson(NOW_KEY, next);
      return next;
    });
  }, []);

  const skip = useCallback(
    (dir: 1 | -1) => {
      const s = showById(now.showId);
      if (!s) return;
      const ep = s.episodes.find((e) => e.id === now.episodeId) ?? s.episodes[0];
      const target = neighborEpisode(s, ep.id, dir);
      const next = { ...now, episodeId: target.id, progress: 0 };
      setNow(next);
      saveJson(NOW_KEY, next);
      if (dir === 1) recordHistory(target.id);
    },
    [now, recordHistory],
  );

  const seek = useCallback((sec: number) => {
    setNow((n) => {
      const next = { ...n, progress: Math.max(0, Math.min(duration - 1, sec)) };
      saveJson(NOW_KEY, next);
      return next;
    });
  }, [duration]);

  const setSpeed = useCallback((s: Speed) => {
    setSpeedState(s);
    const p = loadJson<{ speed?: Speed; sleep?: number }>(PREFS_KEY) ?? {};
    saveJson(PREFS_KEY, { ...p, speed: s });
  }, []);

  const setSleep = useCallback(
    (m: number) => {
      setSleepMin(m);
      const p = loadJson<{ speed?: Speed; sleep?: number }>(PREFS_KEY) ?? {};
      saveJson(PREFS_KEY, { ...p, sleep: m });
      showToast(m > 0 ? `Sleep timer: ${m} min` : "Sleep timer off", "moon");
    },
    [showToast],
  );

  const toggleDownload = useCallback(
    (episodeId: string) => {
      setDownloads((prev) => {
        const on = !prev.includes(episodeId);
        const next = on ? [episodeId, ...prev] : prev.filter((d) => d !== episodeId);
        saveJson(DOWNLOADS_KEY, next);
        showToast(on ? "Saved for offline" : "Download removed", on ? "download" : "check");
        return next;
      });
    },
    [showToast],
  );

  const toggleSubscribe = useCallback(
    (showId: string) => {
      setSubscriptions((prev) => {
        const on = !prev.includes(showId);
        const next = on ? [...prev, showId] : prev.filter((s) => s !== showId);
        saveJson(SUBS_KEY, next);
        const s = showById(showId);
        if (s) showToast(on ? `Following ${s.title}` : `Unfollowed ${s.title}`, on ? "heart" : "check");
        return next;
      });
    },
    [showToast],
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveJson(HISTORY_KEY, []);
    showToast("History cleared", "check");
  }, [showToast]);

  const value: DriftContextValue = useMemo(
    () => ({
      now,
      show,
      episode,
      duration,
      speed,
      sleepMin,
      play,
      togglePlay,
      skip,
      seek,
      setSpeed,
      setSleep,
      downloads,
      toggleDownload,
      subscriptions,
      toggleSubscribe,
      history,
      clearHistory,
      toast,
      showToast,
    }),
    [
      now,
      show,
      episode,
      duration,
      speed,
      sleepMin,
      play,
      togglePlay,
      skip,
      seek,
      setSpeed,
      setSleep,
      downloads,
      toggleDownload,
      subscriptions,
      toggleSubscribe,
      history,
      clearHistory,
      toast,
      showToast,
    ],
  );

  return <DriftContext.Provider value={value}>{children}</DriftContext.Provider>;
}

export function useDrift(): DriftContextValue {
  const ctx = useContext(DriftContext);
  if (!ctx) throw new Error("useDrift must be used within <DriftProvider>");
  return ctx;
}
