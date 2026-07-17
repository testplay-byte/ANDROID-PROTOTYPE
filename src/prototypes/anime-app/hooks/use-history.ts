"use client";

/**
 * anime-app / hooks / use-history — localStorage-backed recently-viewed list.
 *
 *  - Items live at `localStorage["anime-history"]`.
 *  - `add(anime)` dedupes by id and prepends; the list is capped at 20.
 *  - `clear()` wipes the list.
 *
 * Cross-component sync: same custom-event pattern as useLibrary — when one
 * instance mutates the data, it writes to localStorage + dispatches an
 * `anime-history-change` event; all other instances re-read.
 */
import { useCallback, useEffect, useState } from "react";
import type { Anime, HistoryItem } from "../lib/types";

const HIST_KEY = "anime-history";
const HIST_LIMIT = 20;
const EVENT = "anime-history-change";

function read(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    if (raw) return JSON.parse(raw) as HistoryItem[];
  } catch {
    /* ignore */
  }
  return [];
}

function write(items: HistoryItem[]): void {
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify(items));
  } catch {
    /* best-effort */
  }
}

function emitChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export interface UseHistoryResult {
  items: HistoryItem[];
  add: (anime: Anime) => void;
  clear: () => void;
}

export function useHistory(): UseHistoryResult {
  const [items, setItems] = useState<HistoryItem[]>([]);

  // Read once on mount + subscribe to cross-instance changes.
  useEffect(() => {
    setItems(read());
    function onChange() {
      setItems(read());
    }
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((anime: Anime) => {
    // Read latest from localStorage (not React state) so the EVENT we
    // dispatch carries the just-written value to other instances —
    // calling write() inside the setItems updater is unsafe (React may
    // run the updater async / twice in StrictMode), so we do all the
    // side-effecting work here, then commit to React state.
    const prev = read();
    const title = anime.title.romaji || anime.title.english || "Unknown";
    const cover =
      anime.coverImage.large || anime.coverImage.extraLarge || "";
    const next = [
      { id: anime.id, title, cover, viewedAt: Date.now() },
      ...prev.filter((x) => x.id !== anime.id),
    ].slice(0, HIST_LIMIT);
    write(next);
    setItems(next);
    emitChange();
  }, []);

  const clear = useCallback(() => {
    write([]);
    setItems([]);
    emitChange();
  }, []);

  return { items, add, clear };
}
