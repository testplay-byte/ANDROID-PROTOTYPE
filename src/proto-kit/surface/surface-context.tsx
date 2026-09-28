"use client";

/**
 * SurfaceProvider — tells a prototype which surface it is being rendered on.
 *
 * The same page component is reused for `/prototypes/<slug>/desktop/` and
 * `/prototypes/<slug>/tablet/`. Rather than making every prototype read the
 * URL, the surface route wraps the page in this provider, and <SurfaceFrame>
 * reads it: a tablet build then renders as a device (bigger radii, no window
 * chrome, no menu bar) while desktop keeps its title bar and menu.
 *
 * A slug route (no provider) falls back to the prototype's own default.
 */
import { createContext, useContext, type ReactNode } from "react";
import type { Surface } from "./types";

const Ctx = createContext<Exclude<Surface, "phone"> | null>(null);

export function SurfaceProvider({
  surface,
  children,
}: {
  surface: Exclude<Surface, "phone">;
  children: ReactNode;
}) {
  return <Ctx.Provider value={surface}>{children}</Ctx.Provider>;
}

/** The surface this prototype is being rendered on, or null on a slug route. */
export function useCurrentSurface(): Exclude<Surface, "phone"> | null {
  return useContext(Ctx);
}
