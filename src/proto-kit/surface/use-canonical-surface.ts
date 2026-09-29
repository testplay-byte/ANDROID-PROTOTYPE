"use client";

/**
 * useCanonicalSurface — keeps the URL honest about which surface is shown.
 *
 * Every surface of a prototype has its own address
 * (`/prototypes/<slug>/<surface>/`), so a phone app and a desktop app that
 * share a name never collide, and the address bar always says what you are
 * looking at.
 *
 * The ROUTE wins. Opening `/prototypes/meridian/tablet/` must stay on
 * `/tablet/` — so this reads the surface the route provided (via
 * SurfaceProvider) and only falls back to the caller's default on a bare slug
 * route, where rewriting to the canonical desktop URL is what you want.
 *
 * It RETURNS the effective surface, so the caller can hand it to <Stage> and
 * the surface switcher highlights the surface actually on screen.
 */

import { useEffect } from "react";
import { prototypeHref } from "../base-path";
import { useCurrentSurface } from "./surface-context";
import type { Surface } from "./types";

export function useCanonicalSurface(
  slug: string,
  fallback: Exclude<Surface, "phone"> = "desktop",
): Exclude<Surface, "phone"> {
  const routeSurface = useCurrentSurface();
  const surface = routeSurface ?? fallback;

  useEffect(() => {
    const canonical = prototypeHref(slug, surface);
    if (window.location.pathname === canonical) return;
    try {
      history.replaceState(null, "", canonical + window.location.hash);
    } catch {
      /* sandbox may block history writes */
    }
  }, [slug, surface]);

  return surface;
}
