"use client";

/**
 * Dashboard gallery — data-driven prototype showcase with design-language
 * filtering. Replaces the old hand-written per-prototype <article> cards.
 *
 * To add a prototype: append one entry to PROTOTYPES in app/page.tsx
 * (name, style, tagline, screens, silhouette palette). Nothing else.
 *
 * Uses the approved warm-cream dashboard classes from dashboard.css
 * (.showcase, .show, .phone, .tag, .mini-bar-*). Do not restyle to
 * indigo/blue — see docs/preferences.md.
 */

import { useMemo, useState } from "react";
import type { DeviceStyle } from "@/proto-kit/styles/types";
import { STYLE_LABELS } from "@/proto-kit/styles/types";

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

const STYLE_ORDER: DeviceStyle[] = [
  "m3", "hig", "carbon", "neumorph", "glass", "brutalism", "clay", "bauhaus", "minimal", "bento", "flat",
];

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
      {STYLE_LABELS[style]}
      <span className="chip__count">{count}</span>
    </button>
  );
}

function Silhouette({ item }: { item: GalleryItem }) {
  const p = item.palette;
  const bar = (w?: string): React.CSSProperties => ({
    height: 7,
    borderRadius: 3,
    background: p.surfaceAlt,
    width: w,
  });
  return (
    <a className="phone" href={item.url} aria-label={`Open ${item.name} prototype`}
       style={{ borderColor: p.text, background: p.surface }}>
      <span className="phone__screen" style={{ background: p.bg }}>
        <span className="phone__statusbar" style={{ color: p.text }}>
          <span>9:41</span>
          <span className="phone__punchhole" style={{ background: p.text }} />
          <span>87%</span>
        </span>
        <span style={{ height: 12, borderRadius: 4, background: p.accent, opacity: 0.9 }} />
        <span style={bar("70%")} />
        <span style={bar()} />
        <span style={{ ...bar("50%"), opacity: 0.7 }} />
        <span className="phone__card" style={{ background: p.surface }}>
          <span className="phone__pill" style={{ background: p.accent }} />
          <span style={bar("70%")} />
          <span style={bar("50%")} />
        </span>
        <span className="phone__nav" style={{ borderTopColor: p.surfaceAlt }}>
          <span style={{ background: p.accent }} />
          <span style={{ background: p.surfaceAlt }} />
          <span style={{ background: p.surfaceAlt }} />
          <span style={{ background: p.surfaceAlt }} />
        </span>
      </span>
    </a>
  );
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<DeviceStyle | "all">("all");

  const counts = useMemo(() => {
    const map = new Map<DeviceStyle, number>();
    for (const it of items) map.set(it.style, (map.get(it.style) ?? 0) + 1);
    return map;
  }, [items]);

  const presentStyles = STYLE_ORDER.filter((s) => counts.has(s));
  const visible = filter === "all" ? items : items.filter((it) => it.style === filter);

  return (
    <>
      {/* Design-language filter row */}
      <div className="chiprow" role="group" aria-label="Filter prototypes by design language">
        <button
          className={`chip${filter === "all" ? " chip--active" : ""}`}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          All styles<span className="chip__count">{items.length}</span>
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

      {visible.length === 0 ? (
        <div className="empty">No prototypes in this style yet — send a brief.</div>
      ) : null}
    </>
  );
}
