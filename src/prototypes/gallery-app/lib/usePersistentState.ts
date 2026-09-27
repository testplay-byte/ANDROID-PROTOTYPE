"use client";

/**
 * usePersistentState — tiny localStorage-backed useState for gallery-app.
 * JSON-encoded, private-mode safe (falls back to session-only state).
 */

import { useEffect, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

export function usePersistentState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(initial);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* unreadable storage — keep the initial value */
    }
    hydrated.current = true;
    // Only on mount; `key` is a constant per call site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* private mode — session-only state is fine */
    }
  }, [key, value]);

  return [value, setValue];
}
