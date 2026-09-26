"use client";

/**
 * Toggle — bento-style on/off switch.
 * 44px minimum touch target; the visible track is 52x30 inside it.
 */
import styles from "./toggle.module.css";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  /** Accessible name for the switch. */
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.hit} ${checked ? styles.on : ""}`}
      onClick={onChange}
    >
      <span className={styles.track}>
        <span className={styles.knob}>
          {checked ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </span>
      </span>
    </button>
  );
}
