"use client";

/**
 * gallery-context — the state gallery-app shares across screens:
 *   - favorites: artwork ids collected by the visitor (persisted,
 *     `gallery-favs-v1`; toggled from collection hearts AND the plate view)
 *   - detailId / plateId: the pushed exhibition-detail screen and the
 *     full-screen artwork plate overlay (page.tsx reads these to make the
 *     right-swipe gesture close them before navigating tabs)
 *   - toast: one bordered ink slab at a time (message + triad accent)
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import { usePersistentState } from "../lib/usePersistentState";

export type ToastAccent = "red" | "blue" | "yellow";

interface Toast {
  msg: string;
  accent: ToastAccent;
}

interface GalleryContextValue {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => boolean; // returns the new on/off state
  clearFavorites: () => void;

  detailId: number | null;
  openDetail: (id: number) => void;
  closeDetail: () => void;

  plateId: number | null;
  openPlate: (id: number) => void;
  closePlate: () => void;

  toast: Toast | null;
  showToast: (msg: string, accent?: ToastAccent) => void;
}

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function GalleryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = usePersistentState<number[]>("gallery-favs-v1", [3]);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [plateId, setPlateId] = useState<number | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const toggleFavorite = useCallback(
    (id: number) => {
      const nowOn = !favorites.includes(id);
      setFavorites(nowOn ? [...favorites, id] : favorites.filter((f) => f !== id));
      return nowOn;
    },
    [favorites, setFavorites]
  );

  const clearFavorites = useCallback(() => setFavorites([]), [setFavorites]);

  const showToast = useCallback((msg: string, accent: ToastAccent = "red") => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ msg, accent });
    timer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  return (
    <GalleryContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        detailId,
        openDetail: setDetailId,
        closeDetail: () => setDetailId(null),
        plateId,
        openPlate: setPlateId,
        closePlate: () => setPlateId(null),
        toast,
        showToast,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery(): GalleryContextValue {
  const ctx = useContext(GalleryContext);
  if (!ctx) throw new Error("useGallery must be used within <GalleryProvider>");
  return ctx;
}
