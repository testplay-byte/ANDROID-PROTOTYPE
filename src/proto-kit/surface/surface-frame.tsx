"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { SURFACE_PRESETS, type Surface } from "./types";
import { useCurrentSurface } from "./surface-context";
import { DASHBOARD_HREF } from "../base-path";
import styles from "./surface-frame.module.css";

/**
 * SurfaceFrame — the tablet / desktop window.
 *
 * A desktop window is a real window: it has window controls (minimize,
 * maximize/restore, close), it can be dragged to a new size, and it can go
 * fullscreen. All of that lives here so every desktop prototype inherits it.
 *
 *   windowChrome   OS-style title bar with working window buttons (top-right)
 *   menu           menu-bar entries (File · Edit · View…)
 *   draggable      8 resize handles (corners + edges), size persisted
 *
 * The maximize button goes REAL fullscreen (the browser chrome disappears)
 * and restores the previous size on the way back. Fullscreen and the surface
 * switcher are deliberately NOT here — they belong to the preview
 * environment, so pass `fullscreen` / `surfaces` to <Stage> instead.
 *
 * Sizing: SURFACE_PRESETS by default, overridable with `width`/`height`, and
 * user-resizable by dragging (persisted per `storageKey`). The window also
 * shrinks to the stage, and because it is a query container named `surface`,
 * `@container surface (max-width: …)` reflows the layout for real.
 *
 * On a phone-sized browser it does NOT squash the window: it explains that
 * this is a desktop/tablet prototype and how to open it properly.
 *
 * There is NO status bar and NO bottom nav here by design: desktop
 * navigation is a sidebar, a rail or a top bar — which is exactly why
 * desktop apps are built separately rather than rescaled from mobile.
 *
 * Usage:
 * ```tsx
 * <SurfaceFrame surface="desktop" style="carbon" windowChrome windowTitle="Telemetry"
 *               menu={["File", "Edit", "View"]} surfaces={["desktop"]} slug="telemetry">
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
  /** Initial size overrides (CSS px); still user-resizable. */
  width?: number;
  height?: number;
  /** Tablet only: flip to landscape (1112×834). */
  orientation?: "portrait" | "landscape";
  windowChrome?: boolean;
  windowTitle?: string;
  menu?: string[];
  /** Show the 8 drag handles and persist the dragged size. */
  draggable?: boolean;
  /** @deprecated fullscreen lives on <Stage fullscreen> — the button must sit
   *  outside the prototype, not inside it. */
  fullscreen?: boolean;
  /** Surfaces this prototype also exists on — renders the quick switcher. */
  surfaces?: Surface[];
  /** Slug used to build the switcher's per-surface URLs. */
  slug?: string;
  /** Persistence key for the dragged size. Defaults to windowTitle/style. */
  storageKey?: string;
  children: ReactNode;
}

const HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type HandleDir = (typeof HANDLES)[number];

const MIN: Record<Exclude<Surface, "phone">, { w: number; h: number }> = {
  desktop: { w: 640, h: 440 },
  tablet: { w: 480, h: 640 },
};

export function SurfaceFrame({
  surface: surfaceProp,
  theme = "dark",
  style,
  width,
  height,
  orientation = "portrait",
  windowChrome = false,
  windowTitle,
  menu,
  draggable = true,
  fullscreen = true,
  surfaces,
  slug,
  storageKey,
  children,
}: SurfaceFrameProps) {
  // The surface route (/prototypes/<slug>/<surface>/) wins over the prop, so
  // the same page renders as a desktop window or a tablet device.
  const routeSurface = useCurrentSurface();
  const surface: Exclude<Surface, "phone"> = routeSurface ?? surfaceProp ?? "desktop";
  const preset = SURFACE_PRESETS[surface];
  // A tablet is a device, not a window: no title bar, no menu bar.
  const chrome = surface === "desktop" && windowChrome;
  const menuBar = surface === "desktop" && menu && menu.length > 0 ? menu : undefined;
  const defaultSize = useMemo(() => {
    const flip = surface === "tablet" && orientation === "landscape";
    return {
      w: width ?? (flip ? preset.h : preset.w),
      h: height ?? (flip ? preset.w : preset.h),
    };
  }, [surface, orientation, width, height, preset.w, preset.h]);

  const key = `proto-kit-surface-size-${storageKey ?? windowTitle ?? style ?? surface}`;
  const [size, setSize] = useState(defaultSize);
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [closed, setClosed] = useState(false);
  const [tooSmall, setTooSmall] = useState(false);
  const restoreRef = useRef(defaultSize);
  const surfaceRef = useRef<HTMLDivElement>(null);

  /* restore a dragged size */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const v = JSON.parse(raw) as { w: number; h: number };
        if (v?.w > 200 && v?.h > 200) setSize({ w: Math.round(v.w), h: Math.round(v.h) });
      }
    } catch {
      /* best-effort */
    }
  }, [key]);

  /* a phone-sized browser cannot show a desktop/tablet app: say so
     instead of rendering a squashed window */
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement && maximized) {
        setSize(restoreRef.current);
        setMaximized(false);
      }
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, [maximized]);

  useEffect(() => {
    const check = () => setTooSmall(window.innerWidth <= 520);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const persist = useCallback(
    (s: { w: number; h: number }) => {
      try {
        localStorage.setItem(key, JSON.stringify(s));
      } catch {
        /* best-effort */
      }
    },
    [key]
  );

  /* ---- live resize ---- */
  const dragRef = useRef<{ dir: HandleDir; x: number; y: number; w: number; h: number } | null>(null);
  const onHandleDown = (dir: HandleDir) => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { dir, x: e.clientX, y: e.clientY, w: size.w, h: size.h };
  };
  const onHandleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const min = MIN[surface];
    let w = d.w;
    let h = d.h;
    if (d.dir.includes("e")) w = d.w + dx;
    if (d.dir.includes("s")) h = d.h + dy;
    if (d.dir.includes("w")) w = d.w - dx;
    if (d.dir.includes("n")) h = d.h - dy;
    setSize({
      w: Math.max(min.w, Math.min(2200, Math.round(w))),
      h: Math.max(min.h, Math.min(1600, Math.round(h))),
    });
  };
  const onHandleUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    dragRef.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    setSize((s) => {
      persist(s);
      return s;
    });
  };

  /* ---- window controls ---- */
  /* Maximize = REAL fullscreen: the browser chrome (tabs, address bar)
     disappears and the prototype is all that is left. Restoring brings back
     the exact size the window had before. */
  const toggleMaximize = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      setMaximized(false);
      return;
    }
    restoreRef.current = size;
    setMaximized(true);
    void surfaceRef.current?.requestFullscreen?.().catch(() => {
      // fullscreen refused (iframe without allow) — fall back to filling
      // the stage, which is still a believable "maximized" window
      setSize({
        w: Math.max(MIN[surface].w, window.innerWidth - 48),
        h: Math.max(MIN[surface].h, window.innerHeight - 48),
      });
    });
  };
  /* Window buttons: minimize on the LEFT, maximize/exit-fullscreen in the
     MIDDLE, close on the RIGHT — the layout the user asked for. */
  const minimize = { key: "min", label: minimized ? "Restore" : "Minimize", glyph: "–", onClick: () => setMinimized((m) => !m) };
  const maximize = {
    key: "max",
    label: maximized ? "Exit full screen" : "Maximize",
    glyph: maximized ? "❐" : "☐",
    onClick: toggleMaximize,
  };
  const close = { key: "close", label: "Close window", glyph: "✕", onClick: () => setClosed(true) };
  const button = (c: typeof minimize) => (
    <button
      key={c.key}
      type="button"
      className={styles.winbtn}
      data-win={c.key}
      aria-label={c.label}
      title={c.label}
      onClick={c.onClick}
    >
      <span aria-hidden="true">{c.glyph}</span>
    </button>
  );

  /* ---- wrong surface / closed states ---- */
  if (tooSmall) {
    return (
      <div className={`${styles.surface} ${styles.notice} surface`} data-surface={surface} data-theme={theme} data-style={style}>
        <div className={styles.notice__box}>
          <span className={styles.notice__icon} aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </span>
          <h2>{surface === "desktop" ? "Desktop" : "Tablet"} application prototype</h2>
          <p>
            This prototype is built for {surface === "desktop" ? "a desktop window" : "a tablet"} — it
            needs more room than a phone screen gives it. Open it on a tablet or PC, or widen this
            window.
          </p>
          <p className={styles.notice__hint}>
            This browser window is {typeof window !== "undefined" ? window.innerWidth : 0}px wide;
            the prototype needs at least 520px.
          </p>
          <a className={styles.notice__link} href={DASHBOARD_HREF}>
            Back to the dashboard
          </a>
        </div>
      </div>
    );
  }

  if (closed) {
    return (
      <div className={`${styles.surface} ${styles.closedbox} surface`} data-surface={surface} data-theme={theme} data-style={style}>
        <p>The window was closed — this is what a closed desktop app looks like.</p>
        <button className={styles.closedbox__btn} type="button" onClick={() => setClosed(false)}>
          Reopen window
        </button>
      </div>
    );
  }

  return (
    <div
      ref={surfaceRef}
      className={`${styles.surface} surface`}
      data-surface={surface}
      data-style={style}
      data-theme={theme}
      data-minimized={minimized || undefined}
      data-maximized={maximized || undefined}
      style={{ "--surface-w": `${size.w}px`, "--surface-h": `${size.h}px` } as CSSProperties}
    >
      {chrome && (
        <div className={styles.winbar}>
          {windowTitle && <span className={styles.winbar__title}>{windowTitle}</span>}
          <span className={styles.winbar__buttons}>
            {button(minimize)}
            {button(maximize)}
            {button(close)}
          </span>
        </div>
      )}

      {menuBar && !minimized && (
        <div className={styles.menubar} role="menubar" aria-label="Application menu">
          {menuBar.map((m) => (
            <span className={styles.menubar__item} role="menuitem" key={m}>
              {m}
            </span>
          ))}
        </div>
      )}

      {!minimized && <div className={styles.body}>{children}</div>}

      {draggable && !maximized && !minimized &&
        HANDLES.map((dir) => (
          <div
            key={dir}
            className={styles.handle}
            data-dir={dir}
            onPointerDown={onHandleDown(dir)}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            role="separator"
            aria-label={`Resize ${dir}`}
          />
        ))}
    </div>
  );
}

/** SurfaceScreen — the scrollable app area inside a SurfaceFrame. */
export function SurfaceScreen({ children }: { children: ReactNode }) {
  return <main className={styles.screen}>{children}</main>;
}
