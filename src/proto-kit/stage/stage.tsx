"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { SurfaceSwitcher } from "../surface/surface-switcher";
import type { Surface } from "../surface/types";
import { DASHBOARD_HREF } from "../base-path";
import styles from "./stage.module.css";

export interface StageProps {
  /** Left info panel content (prototype name, description, tags). */
  leftPanel?: ReactNode;
  /** The DeviceFrame or SurfaceFrame (the prototype window). */
  children: ReactNode;
  /** Right info panel content (screen info, design notes). */
  rightPanel?: ReactNode;
  /**
   * Surfaces this prototype exists on. When more than one is given, the
   * stage renders the bottom-right quick switcher — OUTSIDE the prototype,
   * beside the Dashboard link, so the app's own UI is never polluted with
   * preview chrome.
   */
  surfaces?: Surface[];
  /** The surface being viewed right now (for the switcher's active state). */
  currentSurface?: Surface;
  /** Slug used to build per-surface URLs. */
  slug?: string;
  /** Show the fullscreen button (bottom-left, next to the Dashboard link). */
  fullscreen?: boolean;
}

const PANEL_W = 230;
const GAP = 24;

/**
 * Stage — the desktop layout: [left panel] [prototype] [right panel].
 *
 * The stage is the PREVIEW ENVIRONMENT, not part of the prototype: the
 * Dashboard link (top-left), the fullscreen button (bottom-left) and the
 * surface switcher (bottom-right) all live here, never inside the app.
 *
 * Two behaviours worth knowing:
 *  - **the panels yield to a wide window.** Drag the desktop window bigger
 *    than the space the panels leave and they collapse, so the window gets
 *    the whole stage instead of being squeezed.
 *  - fullscreen uses the real Fullscreen API, so the browser chrome
 *    disappears and the prototype is all that is left.
 */
export function Stage({
  leftPanel,
  children,
  rightPanel,
  surfaces,
  currentSurface,
  slug,
  fullscreen = false,
}: StageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [compact, setCompact] = useState(false);
  const [isFull, setIsFull] = useState(false);

  /* Collapse the info panels once the window is too wide to sit beside
     them — the prototype keeps the space, the panels step aside. */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const check = () => {
      const child = el.querySelector(".device, .surface") as HTMLElement | null;
      if (!child) return;
      // The window shrinks to the stage, so measuring its box alone always
      // "fits". Take the LARGER of (a) the width the window requests from its
      // size variable and (b) the box it actually occupies — (b) covers the
      // widths CSS decides on its own (maximised, fullscreen, mobile).
      const cs = getComputedStyle(child);
      const declared = ["--surface-w", "--device-w"]
        .map((v) => parseFloat(cs.getPropertyValue(v)))
        .find((n) => Number.isFinite(n) && n > 0);
      const box = child.getBoundingClientRect().width;
      const w = Math.max(declared ?? 0, box);
      const needed =
        w +
        (leftPanel ? PANEL_W + GAP : 0) +
        (rightPanel ? PANEL_W + GAP : 0) +
        GAP * 2; // the stage's own left + right padding
      // clientWidth excludes the vertical scrollbar, so the comparison is real
      setCompact(needed > document.documentElement.clientWidth);
    };
    check();
    window.addEventListener("resize", check);
    const ro = new ResizeObserver(check);
    ro.observe(el);
    // The STAGE never changes size when the window is dragged, so observing
    // it alone meant the panels only reacted to a browser resize or a reload.
    // Observe the prototype window too.
    const child = el.querySelector(".device, .surface");
    if (child) ro.observe(child);
    // …and the surface frame mutates its own size variable on every drag
    // frame, which fires no resize event at all; poll it cheaply while the
    // pointer is down on a resize handle.
    const onPointer = () => check();
    window.addEventListener("pointerup", onPointer);
    // Backstop: some environments (embedded previews, docked devtools,
    // programmatic viewport changes) change the layout WITHOUT firing a
    // resize event or a ResizeObserver callback — the panels then only
    // updated after a refresh. A 400ms poll costs a few arithmetic
    // operations and makes the state impossible to leave stale.
    const poll = window.setInterval(check, 400);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("pointerup", onPointer);
      window.clearInterval(poll);
      ro.disconnect();
    };
  }, [leftPanel, rightPanel]);

  useEffect(() => {
    const onChange = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.().catch(() => {});
  };

  const showSwitcher = !!(surfaces && surfaces.length > 1 && slug && currentSurface);

  return (
    <div
      className={styles.stage}
      ref={stageRef}
      data-compact={compact || undefined}
      data-fullscreen={isFull || undefined}
    >
      <a className={styles.backlink} href={DASHBOARD_HREF} aria-label="Back to dashboard">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className={styles.backlink__label}>Dashboard</span>
      </a>

      {leftPanel && !compact && (
        <aside className={styles.sidepanel} aria-label="Prototype info">
          {leftPanel}
        </aside>
      )}
      {children}
      {rightPanel && !compact && (
        <aside className={styles.sidepanel} aria-label="Screen info">
          {rightPanel}
        </aside>
      )}

      {fullscreen && (
        <button
          className={`${styles.previewpill} ${styles.stagebtn}`}
          type="button"
          onClick={toggleFullscreen}
          aria-label={isFull ? "Exit fullscreen" : "Fullscreen"}
          title={isFull ? "Exit fullscreen" : "Fullscreen"}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isFull ? (
              <path d="M9 3v6H3M15 21v-6h6M3.5 9A9 9 0 0 1 9 3.5M20.5 15A9 9 0 0 1 15 20.5" />
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
            )}
          </svg>
          <span className={styles.backlink__label}>{isFull ? "Exit full screen" : "Full screen"}</span>
        </button>
      )}

      {showSwitcher && (
        <div className={`${styles.previewpill} ${styles.stageswitch}`}>
          <SurfaceSwitcher surfaces={surfaces!} current={currentSurface!} slug={slug!} />
        </div>
      )}
    </div>
  );
}

/* ---- side-panel helpers (used by every prototype's Stage panels) ---- */
export function PanelBadge({ children }: { children: ReactNode }) {
  return <span className={styles.sidebadge}>{children}</span>;
}
export function PanelTitle({ children }: { children: ReactNode }) {
  return <h2 className={styles.sidetitle}>{children}</h2>;
}
export function PanelDesc({ children }: { children: ReactNode }) {
  return <p className={styles.sidedesc}>{children}</p>;
}
export function PanelHead({ children }: { children: ReactNode }) {
  return <div className={styles.sidehead}>{children}</div>;
}
