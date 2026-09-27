"use client";

/**
 * bits — small shared Bauhaus furniture:
 *   - SectionLabel: uppercase wide-tracked label + quarter-circle tick
 *   - DiagonalDivider: full-width bar with a clipped diagonal end
 *   - TriadRule: three solid triad squares (red / blue / yellow) as a
 *     divider ornament
 *   - IndexStrip: the bordered segmented index strip used on the
 *     Collection screen instead of a TopBar
 *   - Segment: a 2px-bordered segmented control (active = ink fill)
 */

import type { ReactNode } from "react";
import styles from "./bits.module.css";

export function SectionLabel({ children, trailing }: { children: string; trailing?: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span className={styles.labelTick} aria-hidden="true" />
      <span className={styles.labelText}>{children}</span>
      {trailing ? <span className={styles.labelTrailing}>{trailing}</span> : null}
    </div>
  );
}

export function DiagonalDivider() {
  return (
    <div className={styles.diagonal} aria-hidden="true">
      <span className={styles.diagonalBar} />
      <span className={styles.diagonalDisc} />
    </div>
  );
}

export function TriadRule() {
  return (
    <div className={styles.triadRule} aria-hidden="true">
      <span className={styles.triadRed} />
      <span className={styles.triadBlue} />
      <span className={styles.triadYellow} />
    </div>
  );
}

export function IndexStrip({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; label: string; num: string }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav className={styles.indexStrip} aria-label="Index">
      {items.map((it) => {
        const on = it.id === activeId;
        return (
          <button
            key={it.id}
            type="button"
            className={`${styles.indexCell} ${on ? styles.indexCellOn : ""}`}
            aria-current={on ? "page" : undefined}
            onClick={() => onSelect(it.id)}
          >
            <span className={styles.indexNum}>{it.num}</span>
            <span className={styles.indexLabel}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function Segment<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className={styles.segment} role="group" aria-label={label}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`${styles.segmentBtn} ${value === opt.id ? styles.segmentOn : ""}`}
          aria-pressed={value === opt.id}
          onClick={() => onChange(opt.id)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/** Square 2px-bordered icon button used as a TopBar leading/trailing slot. */
export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" className={styles.iconBtn} aria-label={label} onClick={onClick}>
      {children}
    </button>
  );
}
