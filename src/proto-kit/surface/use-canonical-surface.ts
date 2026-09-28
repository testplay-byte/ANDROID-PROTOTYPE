"use client";

/**
 * useCanonicalSurface — keeps the URL honest about which surface is shown.
 *
 * Every surface of a prototype has its own address
 * (`/prototypes/<slug>/<surface>/`), so a phone app and a desktop app that
 * share a name can never collide, and the address bar always says what you
 * are looking at. When a prototype is opened at its bare `/prototypes/<slug>/`
 * URL, this rewrites the address in place (no reload) to the canonical
 * surface URL.
 */

import { useEffect } from "react";
import { prototypeHref } from "../base-path";
import type { Surface } from "./types";

export function useCanonicalSurface(slug: string, surface: Exclude<Surface, "phone">) {
  useEffect(() => {
    const canonical = prototypeHref(slug, surface);
    if (window.location.pathname === canonical) return;
    try {
      history.replaceState(null, "", canonical + window.location.hash);
    } catch {
      /* sandbox may block history writes */
    }
  }, [slug, surface]);
}
