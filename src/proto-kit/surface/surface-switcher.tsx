"use client";

/**
 * SurfaceSwitcher — bottom-right quick switch between the surfaces a
 * prototype exists on.
 *
 * Each surface has its OWN URL (`/prototypes/<slug>/<surface>/`), so a
 * phone app and a desktop app with the same name never collide, and the
 * address bar always says which surface you are looking at.
 */

import { SURFACE_LABELS, type Surface } from "./types";
import { prototypeHref } from "../base-path";
import styles from "./surface-switcher.module.css";

export interface SurfaceSwitcherProps {
  /** every surface this prototype exists on */
  surfaces: Surface[];
  /** the surface currently being viewed */
  current: Surface;
  /** the prototype slug, e.g. "meridian" */
  slug: string;
}

const GLYPH: Record<Surface, string> = { phone: "▯", tablet: "▭", desktop: "▬" };

export function SurfaceSwitcher({ surfaces, current, slug }: SurfaceSwitcherProps) {
  return (
    <nav className={styles.switcher} aria-label="Switch surface">
      {surfaces.map((s) => {
        const active = s === current;
        return (
          <a
            key={s}
            className={`${styles.btn} ${active ? styles.isActive : ""}`}
            href={prototypeHref(slug, s)}
            aria-current={active ? "page" : undefined}
            title={`View as ${SURFACE_LABELS[s].toLowerCase()}`}
          >
            <span className={styles.glyph} aria-hidden="true">
              {GLYPH[s]}
            </span>
            <span className={styles.label}>{SURFACE_LABELS[s]}</span>
          </a>
        );
      })}
    </nav>
  );
}
