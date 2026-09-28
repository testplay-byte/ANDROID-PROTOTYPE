"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { SURFACE_PRESETS, type Surface } from "./types";
import styles from "./surface-frame.module.css";

/**
 * SurfaceFrame — the tablet / desktop window.
 *
 * Renders a sized window (the desktop layout surface) with optional OS-style
 * window chrome. The design language is chosen with `style` exactly like
 * <DeviceFrame> — it sets `data-style`, and the token layer in
 * proto-kit/styles/* does the rest, so every surface of the same language
 * looks like the same family.
 *
 * Sizing: defaults come from SURFACE_PRESETS; `width` / `height` (or
 * `orientation="landscape"` for tablet) override per prototype. Like the
 * phone frame, the window auto-fits the stage with `zoom` so a 1280px
 * desktop is fully visible on a laptop screen.
 *
 * There is NO status bar and NO bottom nav here by design: desktop
 * navigation is a sidebar, a rail or a top bar (<DesktopSidebar>,
 * <DesktopRail>, <DesktopTopBar>), which is exactly why desktop apps are
 * built separately rather than rescaled from mobile.
 *
 * Usage:
 * ```tsx
 * <SurfaceFrame surface="desktop" style="carbon" windowChrome windowTitle="Pulse">
 *   <SurfaceScreen>{children}</SurfaceScreen>
 * </SurfaceFrame>
 * ```
 */
export interface SurfaceFrameProps {
  /** tablet (device-shaped) or desktop (window-shaped). Default desktop. */
  surface?: Exclude<Surface, "phone">;
  theme?: "dark" | "light";
  /** Design language — same values as <DeviceFrame style="...">. */
  style?: string;
  /** Frame size overrides (CSS px). */
  width?: number;
  height?: number;
  /** Tablet only: flip to landscape (1112×834). */
  orientation?: "portrait" | "landscape";
  /** OS-style window chrome: traffic lights + title + optional menu bar. */
  windowChrome?: boolean;
  windowTitle?: string;
  /** Menu bar entries — desktop apps have a menu; mobile apps never do. */
  menu?: string[];
  children: ReactNode;
}

export function SurfaceFrame({
  surface = "desktop",
  theme = "dark",
  style,
  width,
  height,
  orientation = "portrait",
  windowChrome = false,
  windowTitle,
  menu,
  children,
}: SurfaceFrameProps) {
  const preset = SURFACE_PRESETS[surface];
  const w =
    width ??
    (surface === "tablet" && orientation === "landscape" ? preset.h : preset.w);
  const h =
    height ??
    (surface === "tablet" && orientation === "landscape" ? preset.w : preset.h);

  // Auto-fit the stage (same trick as the phone frame): zoom, not transform,
  // so the stage still lays out around the scaled window.
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const compute = () => {
      if (window.innerWidth <= 480) {
        setFit(1);
        return;
      }
      const pad = 48;
      setFit(Math.min(1, (window.innerHeight - pad) / h, (window.innerWidth - pad) / w));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [w, h]);

  return (
    <div
      className={`${styles.surface} surface`}
      data-surface={surface}
      data-style={style}
      data-theme={theme}
      style={
        {
          "--surface-w": `${w}px`,
          "--surface-h": `${h}px`,
          ...(fit < 1 ? { zoom: fit } : {}),
        } as CSSProperties
      }
    >
      {windowChrome && (
        <div className={styles.winbar} aria-hidden="true">
          <span className={styles.winbar__lights}>
            <i /><i /><i />
          </span>
          {windowTitle && <span className={styles.winbar__title}>{windowTitle}</span>}
        </div>
      )}
      {menu && menu.length > 0 && (
        <div className={styles.menubar} role="menubar" aria-label="Application menu">
          {menu.map((m) => (
            <span className={styles.menubar__item} role="menuitem" key={m}>
              {m}
            </span>
          ))}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  );
}

/** SurfaceScreen — the scrollable app area inside a SurfaceFrame. */
export function SurfaceScreen({ children }: { children: ReactNode }) {
  return <main className={styles.screen}>{children}</main>;
}
