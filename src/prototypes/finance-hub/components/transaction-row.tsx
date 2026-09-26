"use client";

/**
 * TransactionRow — merchant initials block, name + category, signed amount.
 * Presentational; the Activity screen wraps it with the expandable detail.
 */

import { initialsOf } from "../lib/data";
import { formatMoney } from "../lib/format";
import type { Transaction } from "../lib/types";
import styles from "./transaction-row.module.css";

export function TransactionRow({ tx }: { tx: Transaction }) {
  const isIn = tx.amount > 0;
  return (
    <div className={styles.row}>
      <span className={styles.initials} aria-hidden="true">
        {initialsOf(tx.merchant)}
      </span>
      <div className={styles.info}>
        <span className={styles.merchant}>{tx.merchant}</span>
        <span className={styles.category}>{tx.category}</span>
      </div>
      <span className={`${styles.amount} ${isIn ? styles.amountIn : ""}`}>
        {isIn ? "+" : ""}
        {formatMoney(tx.amount)}
      </span>
    </div>
  );
}
