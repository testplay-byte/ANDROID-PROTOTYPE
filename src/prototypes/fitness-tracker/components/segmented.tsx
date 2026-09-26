"use client";

/**
 * Segmented — iOS segmented control (Light/Dark, km/mi, …).
 * White pill on surface-3 track; selected segment gets a raised white look.
 */
import styles from "./segmented.module.css";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  /** Accessible name. */
  label: string;
}) {
  return (
    <div className={styles.track} role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="tab"
          aria-selected={value === o.id}
          className={`${styles.segment} ${value === o.id ? styles.segmentActive : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
