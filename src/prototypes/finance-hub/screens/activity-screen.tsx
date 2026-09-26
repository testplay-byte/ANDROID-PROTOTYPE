"use client";

/**
 * ActivityScreen — filter chips (ALL/IN/OUT), full transaction list
 * grouped by date. Tapping a row expands an inline detail block
 * (transaction id, status tag, direction).
 */

import { useMemo, useState } from "react";
import { TopBar } from "../../../proto-kit";
import { TRANSACTIONS } from "../lib/data";
import { dateGroupLabel, formatMoney } from "../lib/format";
import type { ActivityFilter } from "../lib/types";
import { TransactionRow } from "../components/transaction-row";
import styles from "./activity-screen.module.css";

const FILTERS: { id: ActivityFilter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "in", label: "IN" },
  { id: "out", label: "OUT" },
];

export function ActivityScreen() {
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const groups = useMemo(() => {
    const filtered = TRANSACTIONS.filter((tx) => {
      if (filter === "in") return tx.amount > 0;
      if (filter === "out") return tx.amount < 0;
      return true;
    });
    const byDate = new Map<string, typeof filtered>();
    for (const tx of filtered) {
      const list = byDate.get(tx.date) ?? [];
      list.push(tx);
      byDate.set(tx.date, list);
    }
    return [...byDate.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([date, txs]) => ({ date, txs }));
  }, [filter]);

  return (
    <div className={styles.root}>
      <TopBar variant="inline" title="Activity" subtitle="All accounts" />

      <div className={styles.content}>
        {/* Filter chips */}
        <div className={styles.chips}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${styles.chip} ${filter === f.id ? styles.chipActive : ""}`}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grouped list */}
        {groups.map((group) => (
          <section key={group.date} className={styles.group}>
            <div className={styles.dateRow}>
              <span className={styles.dateLabel}>{dateGroupLabel(group.date)}</span>
              <span className={styles.dateSum}>
                {formatMoney(group.txs.reduce((s, t) => s + t.amount, 0))}
              </span>
            </div>
            {group.txs.map((tx) => {
              const expanded = expandedId === tx.id;
              return (
                <div key={tx.id} className={styles.itemWrap}>
                  <button
                    type="button"
                    className={`${styles.rowBtn} ${expanded ? styles.rowBtnOpen : ""}`}
                    onClick={() => setExpandedId(expanded ? null : tx.id)}
                    aria-expanded={expanded}
                  >
                    <TransactionRow tx={tx} />
                  </button>
                  {expanded && (
                    <div className={styles.detail}>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>ID</span>
                        <span className={styles.detailValue}>{tx.id}</span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Status</span>
                        <span
                          className={`${styles.statusTag} ${
                            tx.status === "completed"
                              ? styles.statusCompleted
                              : tx.status === "pending"
                                ? styles.statusPending
                                : styles.statusScheduled
                          }`}
                        >
                          {tx.status.toUpperCase()}
                        </span>
                      </div>
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Type</span>
                        <span className={styles.detailValue}>
                          {tx.amount > 0 ? "Credit" : "Debit"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
