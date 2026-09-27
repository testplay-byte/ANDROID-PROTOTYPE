"use client";

/**
 * QtyStepper — square bordered minus / count / plus stepper.
 * Brutalist: 0 radius, thick border, hard shadow, press = translate down.
 */

import styles from "./qty-stepper.module.css";

export function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
      <span className={styles.value}>{value}</span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="square"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}
