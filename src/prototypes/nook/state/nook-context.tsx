"use client";

/* ============================================================
   nook-context — central client state for Nook (wallet/bloom
   pattern). Everything the screens read flows from here:

   - library: BOOKS from lib/data with persisted progress/status
     overlays (nook-progress-v1)
   - reading: the active book (nook-active-v1); the reader is
     scroll-driven — setProgress only moves forward and feeds
     minutes + the day-keyed streak (nook-stats-v1)
   - highlights: tap-a-paragraph marks (nook-highlights-v1)
   - prefs: font step, leading, tap-to-highlight, minute
     tracking (nook-prefs-v1)
   - view: the #shelf #read #notes #you hash router (so any
     screen can hand navigation to another)
   - toast: quiet one-line confirmation channel
   ============================================================ */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { BOOKS, type Book, type BookStatus, bookById } from "../lib/data";

export type ViewId = "shelf" | "read" | "notes" | "you";
export const VIEWS: ViewId[] = ["shelf", "read", "notes", "you"];

export interface NookBook extends Book {
  /** Live progress 0–100 (seed overlaid by persisted state). */
  pct: number;
  /** Live status (seed overlaid by persisted state). */
  status: BookStatus;
}

export interface Highlight {
  id: string;
  bookId: string;
  passageId: string;
  paraIndex: number;
  text: string;
}

export interface NookPrefs {
  fontStep: 0 | 1 | 2; // three persisted reader sizes
  looseLeading: boolean;
  tapToHighlight: boolean;
  trackMinutes: boolean;
}

const DEFAULT_PREFS: NookPrefs = {
  fontStep: 1,
  looseLeading: false,
  tapToHighlight: true,
  trackMinutes: true,
};

const DEFAULT_STATS = { minutes: 486, streak: 4 };

const PROGRESS_KEY = "nook-progress-v1"; // bookId -> { pct, status }
const HL_KEY = "nook-highlights-v1"; // Highlight[]
const PREFS_KEY = "nook-prefs-v1";
const STATS_KEY = "nook-stats-v1"; // { minutes, streak, lastDay }
const ACTIVE_KEY = "nook-active-v1"; // { bookId }

type ProgressMap = Record<string, { pct: number; status: BookStatus }>;

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

function dayKey(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function readHashView(): ViewId {
  if (typeof window === "undefined") return "shelf";
  const h = window.location.hash.replace(/^#/, "") as ViewId;
  return (VIEWS as string[]).includes(h) ? h : "shelf";
}

interface Toast {
  msg: string;
  tone: "plain" | "warn";
}

interface NookContextValue {
  /* library */
  books: NookBook[];
  bookOf: (id: string | null) => NookBook | null;

  /* reading */
  activeBookId: string | null;
  activeBook: NookBook | null;
  openBook: (id: string) => void;
  closeBook: () => void;
  /** Paragraph index the reader opens at, derived from stored progress. */
  startParagraphOf: (id: string, totalParas: number) => number;
  /** Scroll-driven progress: monotonic; feeds minutes + streak + finish. */
  setProgress: (bookId: string, pct: number) => void;

  /* highlights */
  highlights: Highlight[];
  isHighlighted: (bookId: string, passageId: string, paraIndex: number) => boolean;
  toggleHighlight: (h: Omit<Highlight, "id">) => void;
  removeHighlight: (id: string) => void;
  jumpTarget: { passageId: string; paraIndex: number } | null;
  requestJump: (bookId: string, passageId: string, paraIndex: number) => void;
  clearJump: () => void;

  /* prefs + stats */
  prefs: NookPrefs;
  setPrefs: (p: Partial<NookPrefs>) => void;
  minutes: number;
  streak: number;
  resetAll: () => void;

  /* navigation (shared so any screen can hand off to another tab) */
  view: ViewId;
  go: (v: ViewId) => void;

  /* toast */
  toast: Toast | null;
  showToast: (msg: string, tone?: "plain" | "warn") => void;
}

const NookContext = createContext<NookContextValue | null>(null);

export function NookProvider({ children }: { children: ReactNode }) {
  const [progress, setProgressState] = useState<ProgressMap>({});
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [prefs, setPrefsState] = useState<NookPrefs>(DEFAULT_PREFS);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [jumpTarget, setJumpTarget] =
    useState<{ passageId: string; paraIndex: number } | null>(null);
  const [view, setView] = useState<ViewId>("shelf");
  const [toast, setToast] = useState<Toast | null>(null);

  /* ---------- hydrate persisted state after mount (SSR-safe) ---------- */
  useEffect(() => {
    const p = loadJson<ProgressMap>(PROGRESS_KEY);
    if (p) setProgressState(p);
    const h = loadJson<Highlight[]>(HL_KEY);
    if (h && Array.isArray(h)) setHighlights(h);
    const pr = loadJson<NookPrefs>(PREFS_KEY);
    if (pr) setPrefsState((prev) => ({ ...prev, ...pr }));
    const st = loadJson<{ minutes?: number; streak?: number }>(STATS_KEY);
    if (st) {
      setStats((prev) => ({
        minutes: typeof st.minutes === "number" ? st.minutes : prev.minutes,
        streak: typeof st.streak === "number" ? st.streak : prev.streak,
      }));
    }
    const act = loadJson<{ bookId?: string | null }>(ACTIVE_KEY);
    if (act?.bookId && bookById(act.bookId)) setActiveBookId(act.bookId);
    setView(readHashView());
  }, []);

  /* ---------- view: back/forward support ---------- */
  useEffect(() => {
    const onPop = () => setView(readHashView());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView((prev) => {
      if (prev !== v) {
        try {
          history.pushState(null, "", `#${v}`);
        } catch {
          /* sandbox may block hash writes */
        }
      }
      return v;
    });
  }, []);

  const showToast = useCallback((msg: string, tone: "plain" | "warn" = "plain") => {
    setToast({ msg, tone });
    window.setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 2400);
  }, []);

  /* ---------- library merge ---------- */
  const books = useMemo<NookBook[]>(
    () =>
      BOOKS.map((b) => {
        const o = progress[b.id];
        return { ...b, pct: o ? o.pct : b.seedProgress, status: o ? o.status : b.seedStatus };
      }),
    [progress],
  );

  const bookOf = useCallback(
    (id: string | null) => (id ? books.find((b) => b.id === id) ?? null : null),
    [books],
  );

  const activeBook = useMemo(() => bookOf(activeBookId), [bookOf, activeBookId]);

  /* ---------- reading: progress, minutes, streak, finish ---------- */
  const writeProgress = useCallback((bookId: string, pct: number, status: BookStatus) => {
    setProgressState((prev) => {
      const next = { ...prev, [bookId]: { pct, status } };
      saveJson(PROGRESS_KEY, next);
      return next;
    });
  }, []);

  const touchStreak = useCallback(() => {
    const stored = loadJson<{ lastDay?: string }>(STATS_KEY) ?? {};
    if (stored.lastDay === dayKey()) return;
    setStats((prev) => {
      const next = {
        ...prev,
        streak: stored.lastDay === dayKey(-1) ? prev.streak + 1 : Math.max(1, prev.streak),
      };
      saveJson(STATS_KEY, { minutes: next.minutes, streak: next.streak, lastDay: dayKey() });
      return next;
    });
  }, []);

  const setProgress = useCallback(
    (bookId: string, rawPct: number) => {
      const book = bookOf(bookId);
      if (!book) return;
      // Monotonic: the reader may scroll back, progress only moves forward.
      const pct = Math.max(book.pct, Math.min(100, Math.round(rawPct)));
      if (pct === book.pct) return;
      let status = book.status;
      if (pct >= 100 && status !== "finished") {
        status = "finished";
        showToast(`Finished — ${book.shortTitle}`, "plain");
      } else if (pct < 100 && status === "to-read") {
        status = "reading";
      }
      writeProgress(bookId, pct, status);
      // Time read ≈ the ground covered (1 progress point ≈ 1 minute).
      const gained = pct - book.pct;
      setStats((prev) => {
        const minutes = prev.minutes + (prefs.trackMinutes ? gained : 0);
        const next = { minutes, streak: prev.streak };
        const stored = loadJson<Record<string, unknown>>(STATS_KEY) ?? {};
        saveJson(STATS_KEY, { ...stored, ...next });
        return next;
      });
      touchStreak();
    },
    [bookOf, prefs.trackMinutes, showToast, touchStreak, writeProgress],
  );

  const startParagraphOf = useCallback(
    (id: string, totalParas: number) => {
      const book = bookOf(id);
      const pct = book ? book.pct : 0;
      return Math.max(0, Math.min(totalParas - 1, Math.floor((pct / 100) * totalParas)));
    },
    [bookOf],
  );

  const openBook = useCallback(
    (id: string) => {
      const book = bookOf(id);
      if (!book) return;
      setActiveBookId(id);
      saveJson(ACTIVE_KEY, { bookId: id });
      if (book.status === "to-read") {
        writeProgress(id, Math.max(1, book.pct), "reading");
        showToast(`Started — ${book.shortTitle}`, "plain");
      }
    },
    [bookOf, writeProgress, showToast],
  );

  const closeBook = useCallback(() => {
    setActiveBookId(null);
    saveJson(ACTIVE_KEY, { bookId: null });
  }, []);

  /* ---------- highlights ---------- */
  const isHighlighted = useCallback(
    (bookId: string, passageId: string, paraIndex: number) =>
      highlights.some(
        (h) =>
          h.bookId === bookId && h.passageId === passageId && h.paraIndex === paraIndex,
      ),
    [highlights],
  );

  const persistHl = useCallback((next: Highlight[]) => {
    setHighlights(next);
    saveJson(HL_KEY, next);
  }, []);

  const toggleHighlight = useCallback(
    (h: Omit<Highlight, "id">) => {
      const existing = highlights.find(
        (x) =>
          x.bookId === h.bookId && x.passageId === h.passageId && x.paraIndex === h.paraIndex,
      );
      if (existing) {
        persistHl(highlights.filter((x) => x.id !== existing.id));
      } else {
        persistHl([...highlights, { ...h, id: `h-${Date.now()}` }]);
        showToast("Marked a passage", "plain");
      }
    },
    [highlights, persistHl, showToast],
  );

  const removeHighlight = useCallback(
    (id: string) => {
      persistHl(highlights.filter((h) => h.id !== id));
      showToast("Note removed", "warn");
    },
    [highlights, persistHl, showToast],
  );

  const requestJump = useCallback(
    (bookId: string, passageId: string, paraIndex: number) => {
      openBook(bookId);
      setJumpTarget({ passageId, paraIndex });
      go("read");
    },
    [openBook, go],
  );

  const clearJump = useCallback(() => setJumpTarget(null), []);

  /* ---------- prefs ---------- */
  const setPrefs = useCallback((p: Partial<NookPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...p };
      saveJson(PREFS_KEY, next);
      return next;
    });
  }, []);

  /* ---------- reset ---------- */
  const resetAll = useCallback(() => {
    setProgressState({});
    persistHl([]);
    setPrefsState(DEFAULT_PREFS);
    setStats(DEFAULT_STATS);
    setActiveBookId(null);
    setJumpTarget(null);
    try {
      [PROGRESS_KEY, HL_KEY, PREFS_KEY, STATS_KEY, ACTIVE_KEY].forEach((k) =>
        localStorage.removeItem(k),
      );
    } catch {
      /* ignore */
    }
    showToast("Shelf reset to the seed library", "warn");
  }, [persistHl, showToast]);

  const value: NookContextValue = {
    books,
    bookOf,
    activeBookId,
    activeBook,
    openBook,
    closeBook,
    startParagraphOf,
    setProgress,
    highlights,
    isHighlighted,
    toggleHighlight,
    removeHighlight,
    jumpTarget,
    requestJump,
    clearJump,
    prefs,
    setPrefs,
    minutes: stats.minutes,
    streak: stats.streak,
    resetAll,
    view,
    go,
    toast,
    showToast,
  };

  return <NookContext.Provider value={value}>{children}</NookContext.Provider>;
}

export function useNook(): NookContextValue {
  const ctx = useContext(NookContext);
  if (!ctx) throw new Error("useNook must be used within <NookProvider>");
  return ctx;
}
