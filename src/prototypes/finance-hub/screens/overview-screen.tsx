"use client";

/**
 * OverviewScreen — balance card, 12-month spending bar chart,
 * quick actions (Pay / Transfer / Top up), recent transactions preview.
 */

import { TopBar } from "../../../proto-kit";
import {
  MONTHLY_SPENDING,
  TOTAL_BALANCE,
  TRANSACTIONS,
  maxMonthlySpend,
  peakMonthIndex,
} from "../lib/data";
import { formatMoney } from "../lib/format";
import { TransactionRow } from "../components/transaction-row";
import styles from "./overview-screen.module.css";

export function OverviewScreen({
  onSeeAllActivity,
}: {
  onSeeAllActivity: () => void;
}) {
  const max = maxMonthlySpend(MONTHLY_SPENDING);
  const peak = peakMonthIndex(MONTHLY_SPENDING);
  const recent = TRANSACTIONS.slice(0, 3);

  return (
    <div className={styles.root}>
      <TopBar variant="inline" title="Overview" subtitle="Q3" />

      <div className={styles.content}>
        {/* Balance card */}
        <section className={styles.balanceCard}>
          <span className={styles.balanceLabel}>Total balance</span>
          <span className={styles.balanceValue}>{formatMoney(TOTAL_BALANCE)}</span>
          <span className={styles.balanceDelta}>+2.4% vs last month</span>
        </section>

        {/* Spending chart */}
        <section className={styles.chartCard}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Spending — last 12 months</h2>
            <span className={styles.cardMeta}>
              {formatMoney(MONTHLY_SPENDING[peak].value)} peak
            </span>
          </div>
          <div className={styles.chart}>
            {MONTHLY_SPENDING.map((m, i) => (
              <div key={i} className={styles.chartCol}>
                <div
                  className={`${styles.bar} ${i === peak ? styles.barPeak : ""}`}
                  style={{ height: `${Math.round((m.value / max) * 100)}%` }}
                  title={`${m.month}: ${formatMoney(m.value)}`}
                />
                <span className={styles.barLabel}>{m.month}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Quick actions */}
        <div className={styles.quickActions}>
          <button type="button" className={styles.quickBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <rect x="4" y="8" width="16" height="12" />
              <path d="M8 8V6a4 4 0 0 1 8 0v2" />
            </svg>
            Pay
          </button>
          <button type="button" className={styles.quickBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M4 7h13M13 3l4 4-4 4M20 17H7M11 13l-4 4 4 4" />
            </svg>
            Transfer
          </button>
          <button type="button" className={styles.quickBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Top up
          </button>
        </div>

        {/* Recent transactions */}
        <section className={styles.txCard}>
          <div className={styles.cardHead}>
            <h2 className={styles.cardTitle}>Recent</h2>
            <button type="button" className={styles.seeAll} onClick={onSeeAllActivity}>
              See all
            </button>
          </div>
          {recent.map((tx, i) => (
            <div
              key={tx.id}
              className={i < recent.length - 1 ? styles.rowDivider : undefined}
            >
              <TransactionRow tx={tx} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
