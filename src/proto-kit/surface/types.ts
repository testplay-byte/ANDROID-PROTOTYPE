/**
 * proto-kit / surface — the multi-surface concept.
 *
 * A SURFACE is where a prototype lives: a phone, a tablet, or a desktop
 * window. They are deliberately separate systems:
 *
 *   phone    — <DeviceFrame> (device-frame/). Status bar, bottom nav,
 *              touch targets. This is the original mobile surface.
 *   tablet   — <SurfaceFrame surface="tablet">. The DESKTOP layout system at
 *              tablet dimensions (wide content, rail/sidebar nav, pointer
 *              targets), framed as a device with a bezel.
 *   desktop  — <SurfaceFrame surface="desktop">. The desktop layout system in
 *              a desktop window. App-style by default; OS window chrome
 *              (traffic lights, title, menu bar) is opt-in.
 *
 * The rule that keeps this honest: a desktop prototype is NEVER a phone
 * prototype stretched to a wider size. They share design languages, tokens
 * and quality rules — never layouts or interaction patterns.
 */

export type Surface = "phone" | "tablet" | "desktop";

/** Default frame size per surface, in CSS px. Override per prototype with
 *  the `width` / `height` props on <SurfaceFrame> (or `orientation` for
 *  tablet). Phone size is user-controlled in the dashboard Settings page
 *  instead, so it is intentionally not repeated here. */
export const SURFACE_PRESETS: Record<
  Exclude<Surface, "phone">,
  { w: number; h: number; label: string; hint: string }
> = {
  tablet: { w: 834, h: 1112, label: "Tablet", hint: "834×1112 portrait · 1112×834 landscape" },
  desktop: { w: 1280, h: 800, label: "Desktop", hint: "1280×800 · scales to fit the stage" },
};

export const SURFACE_LABELS: Record<Surface, string> = {
  phone: "Phone",
  tablet: "Tablet",
  desktop: "Desktop",
};
