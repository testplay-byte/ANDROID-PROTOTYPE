"use client";

/**
 * GroupedList — iOS inset-grouped list primitives.
 *
 * <Group>  = white rounded card on the grouped background (10px radius,
 *            10px gap to the next group).
 * <Row>    = full-bleed 44px+ row inside a group with hairline separators
 *            that start at the text, optional 29px icon disc, value slot
 *            and tertiary-gray chevron.
 * <SectionLabel> = 13px uppercase section header above a group.
 * <GroupFooter>  = 13px gray caption under a group (iOS Settings footer).
 */
import type { ReactNode } from "react";
import styles from "./grouped-list.module.css";

export function Group({ children }: { children: ReactNode }) {
  return <div className={styles.group}>{children}</div>;
}

export function Row({
  icon,
  iconClassName,
  title,
  subtitle,
  value,
  chevron,
  onClick,
  last,
}: {
  /** Leading icon disc content (svg). */
  icon?: ReactNode;
  /** Extra class for the icon disc (tint per row). */
  iconClassName?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Trailing text value (e.g. "8,940"). */
  value?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
  /** Suppress the bottom hairline (last row in a group). */
  last?: boolean;
}) {
  const interactive = Boolean(onClick);
  return (
    <div
      className={`${styles.row} ${interactive ? styles.rowTap : ""}`}
      onClick={onClick}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      {icon ? (
        <span className={`${styles.icon} ${iconClassName ?? ""}`}>{icon}</span>
      ) : null}
      <span className={styles.main}>
        <span className={styles.title}>{title}</span>
        {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
      </span>
      {value ? <span className={styles.value}>{value}</span> : null}
      {chevron ? (
        <svg className={styles.chevron} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      ) : null}
      {!last ? <span className={styles.separator} aria-hidden="true" /> : null}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className={styles.sectionLabel}>{children}</span>;
}

/** 13px gray caption under a group — the iOS Settings section footer. */
export function GroupFooter({ children }: { children: ReactNode }) {
  return <span className={styles.groupFooter}>{children}</span>;
}
