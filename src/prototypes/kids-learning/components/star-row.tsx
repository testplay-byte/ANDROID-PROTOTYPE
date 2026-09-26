/**
 * kids-learning / components / star-row — filled/empty SVG star progress row.
 */
import styles from "./star-row.module.css";

export interface StarRowProps {
  /** How many of `total` stars are filled. */
  filled: number;
  total?: number;
  size?: number;
}

export function StarRow({ filled, total = 5, size = 20 }: StarRowProps) {
  return (
    <span
      className={styles.row}
      role="img"
      aria-label={`${filled} of ${total} stars`}
    >
      {Array.from({ length: total }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={`${styles.star} ${i < filled ? styles.starFilled : styles.starEmpty}`}
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 5.9 6.6.96-4.75 4.63 1.12 6.54L12 17.47 6.13 20.53l1.12-6.54L2.5 9.36l6.6-.96z" />
        </svg>
      ))}
    </span>
  );
}
