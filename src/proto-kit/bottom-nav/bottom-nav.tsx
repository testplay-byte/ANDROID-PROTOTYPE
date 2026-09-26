"use client";

import type { ReactNode } from "react";
import styles from "./bottom-nav.module.css";

export interface NavItem {
  /** Unique key, also used for the hash route (e.g. "home", "search"). */
  id: string;
  /** Full label — always shown on the active item, never truncated. */
  label: string;
  /** SVG icon node (22x22, stroke=currentColor). */
  icon: ReactNode;
}

export type BottomNavVariant =
  | "floating" // Floating pill (default). Active item = expanding content-sized pill.
  | "tabbar" // iOS tab bar: full-width, translucent blur, labels always visible.
  | "labeled" // Classic labeled bar: full-width, icon above label, top indicator.
  | "glass" // Floating glass pill: translucent + backdrop blur (glassmorphism/HIG).
  | "soft" // Floating soft bar: style-driven extruded shadows (neumorphism/clay).
  | "hard"; // Full-width slab: thick border, square corners, uppercase labels.

export interface BottomNavProps {
  items: NavItem[];
  /** The id of the active item. */
  activeId: string;
  /** Called when an item is clicked. */
  onSelect: (id: string) => void;
  /** Visual variant. Default "floating". See docs/design-languages/. */
  variant?: BottomNavVariant;
}

const VARIANT_CLASS: Record<BottomNavVariant, string> = {
  floating: "",
  tabbar: styles.vTabbar,
  labeled: styles.vLabeled,
  glass: styles.vGlass,
  soft: styles.vSoft,
  hard: styles.vHard,
};

/**
 * BottomNav — multi-variant bottom navigation.
 *
 * All variants read the style tokens, so they automatically adapt to the
 * active design language (data-style on .device). The parent owns the
 * active state + routing; BottomNav is presentational.
 *
 * - floating: floating pill; active item is content-sized, full label.
 * - tabbar:   full-width translucent bar, labels always visible (iOS).
 * - labeled:  full-width flat bar, icon above label, top indicator line.
 * - glass:    floating pill, translucent + backdrop blur.
 * - soft:     floating bar with the style's extruded/inset shadows.
 * - hard:     full-width slab with thick border + uppercase labels.
 */
export function BottomNav({ items, activeId, onSelect, variant = "floating" }: BottomNavProps) {
  // tabbar + labeled always show labels; other variants label the active item only.
  const alwaysShowLabels = variant === "tabbar" || variant === "labeled";

  return (
    <nav
      className={`${styles.bottomnav} ${VARIANT_CLASS[variant]}`}
      aria-label="Primary"
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const showLabel = isActive || alwaysShowLabels;
        return (
          <button
            key={item.id}
            className={`${styles.item} ${isActive ? styles.itemIsActive : ""}`}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`${styles.icon} ${isActive ? styles.iconActive : ""}`}
            >
              {item.icon}
            </span>
            <span className={`${styles.label} ${showLabel ? "" : styles.labelHidden}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
