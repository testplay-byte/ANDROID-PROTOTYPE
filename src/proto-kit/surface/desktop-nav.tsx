"use client";

import type { ReactNode } from "react";
import styles from "./desktop-nav.module.css";

/**
 * Desktop navigation — the three desktop patterns, none of which exist on
 * mobile. A phone prototype never uses these; that separation is the point
 * (see ROADMAP.md → "mobile and desktop are separate systems").
 *
 *   DesktopRail    — icon-only 68px rail (Linear, Notion-style). Max
 *                    vertical density; labels live in the tooltip + aria.
 *   DesktopSidebar — icon + label, 232px, supports section headings
 *                    (Xcode, Settings-style). The default for data apps.
 *   DesktopTopBar  — title + optional search slot + actions, above content.
 *
 * All three are token-driven: colors, radius and borders come from the
 * design-language token layer, so the same markup reads correctly in
 * brutalism, glass or carbon.
 */

export interface DesktopNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** small count/status bubble on the right */
  badge?: string | number;
  /** section heading — rendered as a label, not a button */
  kind?: "item" | "section";
}

interface NavProps {
  items: DesktopNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

function renderItems(items: DesktopNavItem[], activeId: string, onSelect: (id: string) => void, cls: string) {
  return items.map((item) =>
    item.kind === "section" ? (
      <span className={styles.section} key={item.id}>
        {item.label}
      </span>
    ) : (
      <button
        key={item.id}
        type="button"
        className={`${cls} ${activeId === item.id ? styles.isActive : ""}`}
        aria-current={activeId === item.id ? "page" : undefined}
        onClick={() => onSelect(item.id)}
        title={item.label}
      >
        <span className={styles.icon} aria-hidden="true">
          {item.icon}
        </span>
        <span className={styles.label}>{item.label}</span>
        {item.badge !== undefined && <span className={styles.badge}>{item.badge}</span>}
      </button>
    )
  );
}

/** Icon-only rail — the densest desktop navigation. */
export function DesktopRail({ items, activeId, onSelect }: NavProps) {
  return (
    <nav className={styles.rail} aria-label="Primary">
      {renderItems(items, activeId, onSelect, styles.railBtn)}
    </nav>
  );
}

/** Icon + label sidebar with optional section headings. */
export function DesktopSidebar({ items, activeId, onSelect }: NavProps) {
  return (
    <nav className={styles.sidebar} aria-label="Primary">
      {renderItems(items, activeId, onSelect, styles.sideBtn)}
    </nav>
  );
}

export interface DesktopTopBarProps {
  title: string;
  subtitle?: string;
  /** search input or filters — the desktop-only "command surface" slot */
  tools?: ReactNode;
  /** right-hand actions (buttons, avatar, status) */
  actions?: ReactNode;
}

/** Top bar above the content area: title + tools + actions. */
export function DesktopTopBar({ title, subtitle, tools, actions }: DesktopTopBarProps) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbar__title}>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {tools && <div className={styles.topbar__tools}>{tools}</div>}
      {actions && <div className={styles.topbar__actions}>{actions}</div>}
    </header>
  );
}
