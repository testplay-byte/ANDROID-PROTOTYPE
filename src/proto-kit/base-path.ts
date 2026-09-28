/**
 * proto-kit / base-path — the one place that knows the deploy prefix.
 *
 * next.config.ts sets `basePath: "/ANDROID-PROTOTYPE"`, so every URL this
 * repo builds or links to needs that prefix. Relative hrefs break when the
 * current page sits at a different depth (a desktop prototype is two
 * segments deep, a phone one), which is why cross-prototype links are
 * built from this constant instead of `../`.
 *
 * If the deployment prefix ever changes, change it here AND in
 * next.config.ts — the build fails loudly if the two disagree.
 */
export const BASE_PATH = "/ANDROID-PROTOTYPE";

/** Absolute, basePath-aware href for a prototype on a given surface. */
export function prototypeHref(slug: string, surface?: "phone" | "tablet" | "desktop"): string {
  return surface && surface !== "phone"
    ? `${BASE_PATH}/prototypes/${slug}/${surface}/`
    : `${BASE_PATH}/prototypes/${slug}/`;
}

/** The dashboard root. NOTE: from a prototype route a relative "../../"
 *  lands on /prototypes/ (the gallery anchor), not the dashboard — every
 *  "back to dashboard" link must use this instead. */
export const DASHBOARD_HREF = `${BASE_PATH}/`;
