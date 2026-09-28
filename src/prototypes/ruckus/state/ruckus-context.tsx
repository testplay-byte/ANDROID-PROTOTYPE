"use client";

/* ruckus-context — central client state for Ruckus:
   - tickets: the wallet (gig ids purchased, persisted; each ticket carries
     a stable serial generated at purchase time)
   - followed: band ids the user follows (persisted)
   - prefs: the two alert switches (persisted)
   - toast: transient message channel
   Everything screens show flows from here — no screen-local truth. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { bandById, gigById } from "../lib/data";

export interface Ticket {
  gigId: number;
  /** 4-digit seat serial, generated once at purchase and persisted. */
  serial: string;
}

export interface RuckusPrefs {
  alertsNewGigs: boolean;
  alertsSellOut: boolean;
}

const DEFAULT_PREFS: RuckusPrefs = { alertsNewGigs: true, alertsSellOut: false };

const TICKETS_KEY = "ruckus-tickets-v1";
const FOLLOWED_KEY = "ruckus-followed-v1";
const PREFS_KEY = "ruckus-prefs-v1";

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

interface Toast {
  msg: string;
  tone: "ink" | "flame";
}

interface RuckusContextValue {
  tickets: Ticket[];
  hasTicket: (gigId: number) => boolean;
  buyTicket: (gigId: number) => void;

  followed: number[];
  isFollowed: (bandId: number) => boolean;
  toggleFollow: (bandId: number) => void;

  prefs: RuckusPrefs;
  setPrefs: (p: Partial<RuckusPrefs>) => void;

  toast: Toast | null;
  showToast: (msg: string, tone?: "ink" | "flame") => void;
}

const RuckusContext = createContext<RuckusContextValue | null>(null);

export function RuckusProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [followed, setFollowed] = useState<number[]>([]);
  const [prefs, setPrefsState] = useState<RuckusPrefs>(DEFAULT_PREFS);
  const [toast, setToast] = useState<Toast | null>(null);

  /* hydrate persisted state after mount (SSR-safe) */
  useEffect(() => {
    const t = loadJson<Ticket[]>(TICKETS_KEY);
    if (t && Array.isArray(t)) setTickets(t);
    const f = loadJson<number[]>(FOLLOWED_KEY);
    if (f && Array.isArray(f)) setFollowed(f);
    const p = loadJson<RuckusPrefs>(PREFS_KEY);
    if (p) setPrefsState((prev) => ({ ...prev, ...p }));
  }, []);

  const showToast = useCallback((msg: string, tone: "ink" | "flame" = "ink") => {
    setToast({ msg, tone });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  const hasTicket = useCallback(
    (gigId: number) => tickets.some((t) => t.gigId === gigId),
    [tickets],
  );

  const buyTicket = useCallback(
    (gigId: number) => {
      if (tickets.some((t) => t.gigId === gigId)) return;
      const serial = String(1000 + Math.floor(Math.random() * 9000));
      setTickets((prev) => {
        const next = [...prev, { gigId, serial }];
        saveJson(TICKETS_KEY, next);
        return next;
      });
      const gig = gigById(gigId);
      const band = gig ? bandById(gig.bandId) : undefined;
      if (band) showToast(`TICKET ADDED — ${band.name.toUpperCase()}`, "flame");
    },
    [tickets, showToast],
  );

  const isFollowed = useCallback(
    (bandId: number) => followed.includes(bandId),
    [followed],
  );

  const toggleFollow = useCallback(
    (bandId: number) => {
      const on = !followed.includes(bandId);
      setFollowed((prev) => {
        const next = on ? [...prev, bandId] : prev.filter((id) => id !== bandId);
        saveJson(FOLLOWED_KEY, next);
        return next;
      });
      const band = bandById(bandId);
      if (band) {
        showToast(
          on ? `FOLLOWING ${band.name.toUpperCase()}` : `UNFOLLOWED — ${band.name.toUpperCase()}`,
          "ink",
        );
      }
    },
    [followed, showToast],
  );

  const setPrefs = useCallback((p: Partial<RuckusPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      saveJson(PREFS_KEY, next);
      return next;
    });
  }, []);

  const value = useMemo<RuckusContextValue>(
    () => ({
      tickets,
      hasTicket,
      buyTicket,
      followed,
      isFollowed,
      toggleFollow,
      prefs,
      setPrefs,
      toast,
      showToast,
    }),
    [tickets, hasTicket, buyTicket, followed, isFollowed, toggleFollow, prefs, setPrefs, toast, showToast],
  );

  return <RuckusContext.Provider value={value}>{children}</RuckusContext.Provider>;
}

export function useRuckus(): RuckusContextValue {
  const ctx = useContext(RuckusContext);
  if (!ctx) throw new Error("useRuckus must be used within <RuckusProvider>");
  return ctx;
}
