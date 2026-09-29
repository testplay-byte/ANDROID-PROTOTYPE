import type { ComponentType } from "react";
import type { Surface } from "@/proto-kit/surface/types";
import MeridianPage from "./meridian/page";
import QuillPage from "./quill/page";
import TelemetryPage from "./telemetry/page";
import AuroraPage from "./aurora/page";
import StockyardPage from "./stockyard/page";
import MochiPage from "./mochi/page";
import AtelierPage from "./atelier/page";
import SignalPage from "./signal/page";
import HaloPage from "./halo/page";
import CounterPage from "./counter/page";
import FacetPage from "./facet/page";
import ThinPage from "./thin/page";

/**
 * app/prototypes/_registry — which prototype exists on which surface.
 *
 * The `_` prefix keeps this out of the router: it is data, not a route.
 * The dynamic route `app/prototypes/[slug]/[surface]/` reads it to render
 * the right build of a prototype at a surface-specific URL, so:
 *
 *   /prototypes/meridian/           → canonicalises to /prototypes/meridian/desktop/
 *   /prototypes/meridian/desktop/   → the desktop build
 *   /prototypes/meridian/tablet/    → the same build at tablet size
 *
 * Phone prototypes have no entry here — they live at /prototypes/<slug>/.
 * When a phone app later gets a desktop build, add its entry and the
 * quick surface switcher appears automatically.
 */
export interface PrototypeEntry {
  /** human name (for titles) */
  name: string;
  /** the surfaces this prototype is built for, primary first */
  surfaces: Surface[];
  /** the component for each non-phone surface */
  views: Partial<Record<Exclude<Surface, "phone">, ComponentType>>;
}

export const PROTOTYPE_REGISTRY: Record<string, PrototypeEntry> = {
  meridian: {
    name: "Meridian",
    surfaces: ["desktop", "tablet"],
    views: { desktop: MeridianPage, tablet: MeridianPage },
  },
  quill: {
    name: "Quill",
    surfaces: ["desktop", "tablet"],
    views: { desktop: QuillPage, tablet: QuillPage },
  },
  telemetry: {
    name: "Telemetry",
    surfaces: ["desktop"],
    views: { desktop: TelemetryPage },
  },
  aurora: {
    name: "Aurora",
    surfaces: ["desktop", "tablet"],
    views: { desktop: AuroraPage, tablet: AuroraPage },
  },
  stockyard: {
    name: "Stockyard",
    surfaces: ["desktop", "tablet"],
    views: { desktop: StockyardPage, tablet: StockyardPage },
  },
  mochi: {
    name: "Mochi",
    surfaces: ["desktop", "tablet"],
    views: { desktop: MochiPage, tablet: MochiPage },
  },
  atelier: {
    name: "Atelier",
    surfaces: ["desktop", "tablet"],
    views: { desktop: AtelierPage, tablet: AtelierPage },
  },
  signal: {
    name: "Signal",
    surfaces: ["desktop", "tablet"],
    views: { desktop: SignalPage, tablet: SignalPage },
  },
  halo: {
    name: "Halo",
    surfaces: ["desktop", "tablet"],
    views: { desktop: HaloPage, tablet: HaloPage },
  },
  counter: {
    name: "Counter",
    surfaces: ["desktop", "tablet"],
    views: { desktop: CounterPage, tablet: CounterPage },
  },
  facet: {
    name: "Facet",
    surfaces: ["desktop", "tablet"],
    views: { desktop: FacetPage, tablet: FacetPage },
  },
  thin: {
    name: "Thin",
    surfaces: ["desktop", "tablet"],
    views: { desktop: ThinPage, tablet: ThinPage },
  },
};

/** Every (slug, surface) pair, for generateStaticParams. */
export function allSurfaceRoutes(): { slug: string; surface: string }[] {
  const out: { slug: string; surface: string }[] = [];
  for (const [slug, entry] of Object.entries(PROTOTYPE_REGISTRY)) {
    for (const surface of entry.surfaces) {
      if (surface === "phone") continue;
      out.push({ slug, surface });
    }
  }
  return out;
}
