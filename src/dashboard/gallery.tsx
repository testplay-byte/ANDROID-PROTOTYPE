"use client";

/**
 * Dashboard gallery — data-driven prototype showcase with design-language
 * filtering and TWO view modes.
 *
 * - "Detailed" (default): the rich 3-column cards (left info / phone
 *   silhouette with a mini home-screen thumb / right mini-bars).
 * - "Grid": clean symmetric grid — mini image + name only.
 * - Filter chips: symmetric grid layout (4 per row on desktop = the style
 *   list wraps to 3 rows), equal widths, keyboard accessible.
 * - The chosen view persists in localStorage ("gallery-view").
 *
 * To add a prototype: append one entry to PROTOTYPES in app/page.tsx and
 * (optionally) a matching mini thumb in src/dashboard/thumbs.tsx. Nothing else.
 *
 * Uses the approved warm-cream dashboard classes from dashboard.css
 * (.showcase, .show, .phone, .tag, .chiprow, .gridview). Do not restyle to
 * indigo/blue — see docs/preferences.md.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { DeviceStyle } from "@/proto-kit/styles/types";
import { STYLE_LABELS } from "@/proto-kit/styles/types";
import { getThumb } from "./thumbs";

export interface GalleryScreen {
  name: string;
  /** Relative interaction richness (0-100) for the mini bars. */
  interactions: number;
}

export interface GalleryItem {
  name: string;
  url: string;
  status: "reference" | "review" | "approved" | "in-progress";
  desc: string;
  style: DeviceStyle;
  tags: string[];
  /** Silhouette palette (inline styles) — match the prototype's default theme. */
  palette: {
    bg: string; // screen background
    surface: string; // card / block tone
    surfaceAlt: string; // secondary block tone
    accent: string; // primary accent
    text: string; // text on bg
  };
  screens: GalleryScreen[];
}

type ViewMode = "detailed" | "grid";

/** Grid-view raster sizing: minimum cell width and the grid gap (px).
 *  Exposed sheet edges expand by SHEET_EDGE_PX only, so two DIFFERENT
 *  families show GRID_GAP - 2*SHEET_EDGE_PX of page background between
 *  them, while same-family neighbours expand half the gap and merge
 *  seamlessly (see .gcell::before in dashboard.css). */
const GRID_GAP = 24;
const CELL_MIN = 180;
const SHEET_EDGE_PX = 4;

const STYLE_ORDER: DeviceStyle[] = [
  "m3", "hig", "carbon", "neumorph", "glass", "brutalism", "clay", "bauhaus", "minimal", "bento", "flat",
];

const VIEW_KEY = "gallery-view";

function StyleChip({
  style,
  count,
  active,
  onClick,
}: {
  style: DeviceStyle;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`chip${active ? " chip--active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="chip__label">{STYLE_LABELS[style]}</span>
      <span className="chip__count">{count}</span>
    </button>
  );
}

/** Phone silhouette — decorative mini mockup. The screen content is the
 *  prototype's custom thumb (real home-screen preview) or a generic fallback.
 *  With link=false the phone renders as a <span> (the wrapping cell owns the
 *  link) — required inside the grid view's nowrap lead. */
function Silhouette({ item, mini = false, link = true }: { item: GalleryItem; mini?: boolean; link?: boolean }) {
  const p = item.palette;
  const bar = (w?: string): React.CSSProperties => ({
    height: 7,
    borderRadius: 3,
    background: p.surfaceAlt,
    width: w,
  });
  const thumb = getThumb(item.name, p);
  const phoneClass = `phone${mini ? " phone--mini" : ""}`;
  const screen = (
    <span className="phone__screen" style={{ background: p.bg }}>
      <span className="phone__statusbar" style={{ color: p.text }}>
        <span>9:41</span>
        <span className="phone__punchhole" style={{ background: p.text }} />
        <span>87%</span>
      </span>
      <span className="phone__thumb" style={{ color: p.text }}>
        {thumb ?? (
          <>
            <span style={{ height: 12, borderRadius: 4, background: p.accent, opacity: 0.9 }} />
            <span style={bar("70%")} />
            <span style={bar()} />
            <span className="phone__card" style={{ background: p.surface }}>
              <span className="phone__pill" style={{ background: p.accent }} />
              <span style={bar("70%")} />
              <span style={bar("50%")} />
            </span>
          </>
        )}
      </span>
      <span className="phone__nav" style={{ borderTopColor: p.surfaceAlt }}>
        <span style={{ background: p.accent }} />
        <span style={{ background: p.surfaceAlt }} />
        <span style={{ background: p.surfaceAlt }} />
        <span style={{ background: p.surfaceAlt }} />
      </span>
    </span>
  );
  if (!link) {
    return <span className={phoneClass} style={{ borderColor: p.text, background: p.surface }}>{screen}</span>;
  }
  return (
    <a className={phoneClass} href={item.url} aria-label={`Open ${item.name} prototype`}
       style={{ borderColor: p.text, background: p.surface }}>
      {screen}
    </a>
  );
}

function ViewToggle({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="viewtoggle" role="group" aria-label="Gallery view mode">
      <button
        className={`viewtoggle__btn${mode === "grid" ? " viewtoggle__btn--active" : ""}`}
        onClick={() => onChange("grid")}
        aria-pressed={mode === "grid"}
        title="Grid view — name + mini image"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="viewtoggle__lbl">Grid</span>
      </button>
      <button
        className={`viewtoggle__btn${mode === "detailed" ? " viewtoggle__btn--active" : ""}`}
        onClick={() => onChange("detailed")}
        aria-pressed={mode === "detailed"}
        title="Detailed view — full cards"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="6" rx="1" />
          <rect x="3" y="14" width="18" height="6" rx="1" />
        </svg>
        <span className="viewtoggle__lbl">Detailed</span>
      </button>
    </div>
  );
}

/* ---- Grid-view raster placement -------------------------------------- */

interface GridCell {
  item: GalleryItem;
  style: DeviceStyle;
  count: number;
  /** 0-based raster position */
  row: number;
  col: number;
  first: boolean;
  /** same-family neighbours — drive the merged background's borders/radii */
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

/**
 * Flow every family through ONE shared cols-wide raster, in STYLE_ORDER:
 *  - a family's first card takes the first free cell (rows scan left-to-right);
 *  - later cards continue rightward while the row lasts;
 *  - on wrap the family continues DIRECTLY BELOW its last card — a split
 *    family stays in one column, so its background reads as one tall band
 *    (2 items) or an inverted-L (3+ items: band + leftward continuation),
 *    never two disconnected boxes. If the cell below is taken, fall back to
 *    the next row's rightmost free cell and keep flowing leftward;
 *  - later families backfill the cells a wrap left open (global first-free),
 *    so the sheet packs tightly with no holes.
 */
function placeCells(groups: { style: DeviceStyle; items: GalleryItem[] }[], cols: number): GridCell[] {
  const occ = new Map<string, DeviceStyle>();
  const k = (r: number, c: number) => `${r}:${c}`;
  const firstFree = () => {
    for (let r = 0; ; r++) for (let c = 0; c < cols; c++) if (!occ.has(k(r, c))) return { r, c };
  };
  const rightmostFreeFrom = (r: number) => {
    for (let rr = r; ; rr++) for (let c = cols - 1; c >= 0; c--) if (!occ.has(k(rr, c))) return { r: rr, c };
  };
  const cells: GridCell[] = [];
  for (const g of groups) {
    let prev: { r: number; c: number } | null = null;
    let wrapLeft = false;
    g.items.forEach((item, i) => {
      let pos: { r: number; c: number };
      if (i === 0) {
        pos = firstFree();
      } else if (!wrapLeft && prev!.c + 1 < cols && !occ.has(k(prev!.r, prev!.c + 1))) {
        pos = { r: prev!.r, c: prev!.c + 1 };
      } else if (prev!.c >= 0 && !occ.has(k(prev!.r + 1, prev!.c))) {
        // wrap: continue straight down — the band stays connected
        pos = { r: prev!.r + 1, c: prev!.c };
        wrapLeft = true;
      } else if (wrapLeft && prev!.c - 1 >= 0 && !occ.has(k(prev!.r, prev!.c - 1))) {
        pos = { r: prev!.r, c: prev!.c - 1 };
      } else {
        pos = rightmostFreeFrom(prev!.r + 1);
        wrapLeft = true;
      }
      occ.set(k(pos.r, pos.c), g.style);
      cells.push({ item, style: g.style, count: g.items.length, row: pos.r, col: pos.c, first: i === 0, up: false, down: false, left: false, right: false });
      prev = pos;
    });
  }
  for (const cell of cells) {
    cell.up = occ.get(k(cell.row - 1, cell.col)) === cell.style;
    cell.down = occ.get(k(cell.row + 1, cell.col)) === cell.style;
    cell.left = occ.get(k(cell.row, cell.col - 1)) === cell.style;
    cell.right = occ.get(k(cell.row, cell.col + 1)) === cell.style;
  }
  return cells;
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<DeviceStyle | "all">("all");
  const [mode, setMode] = useState<ViewMode>("detailed");

  // Restore the persisted view preference (client only). A #grid / #detailed
  // hash on the page URL overrides it (deep-linkable view state).
  useEffect(() => {
    try {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash === "grid" || hash === "detailed") {
        setMode(hash);
        return;
      }
      const saved = window.localStorage.getItem(VIEW_KEY);
      if (saved === "grid" || saved === "detailed") setMode(saved);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_KEY, mode);
    } catch {}
  }, [mode]);

  const counts = useMemo(() => {
    const map = new Map<DeviceStyle, number>();
    for (const it of items) map.set(it.style, (map.get(it.style) ?? 0) + 1);
    return map;
  }, [items]);

  // Grid-view raster width: content-aware, not a fixed desktop number — as
  // many columns as fit at the cell minimum (mini thumbs are 120px wide),
  // capped at 5 so sheets never get cramped. Measured via ResizeObserver so
  // the grid reacts to its actual container.
  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const el = gridRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setCols(Math.max(1, Math.min(5, Math.floor((w + GRID_GAP) / (CELL_MIN + GRID_GAP)))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode]);

  const presentStyles = STYLE_ORDER.filter((s) => counts.has(s));
  const visible = filter === "all" ? items : items.filter((it) => it.style === filter);

  return (
    <>
      {/* Toolbar: result count + view mode toggle */}
      <div className="gallerybar">
        <span className="gallerybar__count">
          {visible.length} {visible.length === 1 ? "prototype" : "prototypes"}
          {filter !== "all" ? ` · ${STYLE_LABELS[filter as DeviceStyle]}` : ""}
        </span>
        <ViewToggle mode={mode} onChange={setMode} />
      </div>

      {/* Design-language filter chips — symmetric grid */}
      <div className="chiprow" role="group" aria-label="Filter prototypes by design language">
        <button
          className={`chip${filter === "all" ? " chip--active" : ""}`}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          <span className="chip__label">All styles</span>
          <span className="chip__count">{items.length}</span>
        </button>
        {presentStyles.map((s) => (
          <StyleChip
            key={s}
            style={s}
            count={counts.get(s) ?? 0}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
      </div>

      {mode === "grid" ? (
        /* ---- Grid view: one shared raster ---------------------------------
           All families flow through the SAME column grid (see placeCells):
           no row is left half-empty, and a family that wraps keeps ONE
           background — painted per cell by .gcell::before (expanded by half
           the gap, rounded only on corners without a same-family neighbour),
           so it renders as a tall band or an L-shaped sheet. The family
           header rides on the first cell of its group. */
        <div className="gridview" ref={gridRef} style={{ "--cols": cols } as React.CSSProperties}>
          {placeCells(
            presentStyles
              .filter((s) => filter === "all" || filter === s)
              .map((s) => ({ style: s, items: visible.filter((it) => it.style === s) }))
              .filter((g) => g.items.length > 0),
            cols
          ).map((cell) => (
            <a
              key={cell.item.name}
              className="gcell"
              data-style={cell.style}
              data-first={cell.first || undefined}
              href={cell.item.url}
              aria-label={`Open ${cell.item.name} prototype`}
              style={{
                gridRow: cell.row + 1,
                gridColumn: cell.col + 1,
                ["--r-tl"]: !cell.up && !cell.left ? "16px" : "0px",
                ["--r-tr"]: !cell.up && !cell.right ? "16px" : "0px",
                ["--r-br"]: !cell.down && !cell.right ? "16px" : "0px",
                ["--r-bl"]: !cell.down && !cell.left ? "16px" : "0px",
                ["--bw-top"]: cell.up ? "0px" : "1px",
                ["--bw-right"]: cell.right ? "0px" : "1px",
                ["--bw-bottom"]: cell.down ? "0px" : "1px",
                ["--bw-left"]: cell.left ? "0px" : "1px",
                // sheet expansion per side: half the gap toward a same-family
                // neighbour (seamless merge), a sliver toward anything else
                // (visible spacing between different families)
                ["--ex-t"]: cell.up ? `${GRID_GAP / -2}px` : `-${SHEET_EDGE_PX}px`,
                ["--ex-r"]: cell.right ? `${GRID_GAP / -2}px` : `-${SHEET_EDGE_PX}px`,
                ["--ex-b"]: cell.down ? `${GRID_GAP / -2}px` : `-${SHEET_EDGE_PX}px`,
                ["--ex-l"]: cell.left ? `${GRID_GAP / -2}px` : `-${SHEET_EDGE_PX}px`,
              } as React.CSSProperties}
            >
              {cell.first && (
                <span className="ghead">
                  <span className="ghead__dot" aria-hidden="true" />
                  <h3 className="ghead__title">{STYLE_LABELS[cell.style]}</h3>
                  <span className="ghead__count">{cell.count}</span>
                </span>
              )}
              <span className="gcell__shot">
                <Silhouette item={cell.item} mini link={false} />
              </span>
              <span className="gcell__name">{cell.item.name}</span>
            </a>
          ))}
        </div>
      ) : (
        /* ---- Detailed view: rich cards ---- */
        <div className="showcase">
          {visible.map((item) => (
            <article className="show" key={item.name} data-style={item.style}>
              <div className="show__info show__info--left">
                <span className="tag tag--status">{item.status}</span>
                <h3 className="show__name">{item.name}</h3>
                <p className="show__desc">{item.desc}</p>
                <div className="tags">
                  <span className="tag tag--style">{STYLE_LABELS[item.style]}</span>
                  {item.tags.map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </div>
              </div>

              <Silhouette item={item} />

              <div className="show__info show__info--right">
                <div className="mini-bars">
                  {item.screens.map((s) => (
                    <div className="mini-bar-row" key={s.name}>
                      <span className="mini-bar-label">{s.name}</span>
                      <div className="mini-bar-track">
                        <div
                          className="mini-bar-fill"
                          style={{ width: `${Math.max(12, Math.min(100, s.interactions))}%`, background: "var(--chart-1)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="kv">
                  <div className="kv__row">
                    <b>{item.screens.length}</b>&nbsp;{item.screens.length === 1 ? "screen" : "screens"}
                  </div>
                  <div className="kv__row">
                    <b>{STYLE_LABELS[item.style]}</b>&nbsp;style
                  </div>
                </div>
                <a className="openlink" href={item.url}>
                  Open prototype
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty">No prototypes in this style yet — send a brief.</div>
      ) : null}
    </>
  );
}
