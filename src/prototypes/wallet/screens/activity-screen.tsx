"use client";

/* activity screen — searchable, grouped transactions across all passes */

import { useMemo, useState } from "react";
import { IosNavBar, useIosCollapse } from "../components/ios";
import { PASS_BY_ID, dayLabel, money } from "../lib/data";
import type { Txn } from "../lib/data";
import { useWallet } from "../state/wallet-context";

function Row({ t }: { t: Txn }) {
  const pass = PASS_BY_ID[t.passId];
  return (
    <div className="wl-row sep">
      <span className={`wl-disc tint-${pass?.tint ?? "indigo"}`}>
        {t.merchant.slice(0, 1)}
      </span>
      <div className="wl-row__main">
        <span className="wl-row__title">{t.merchant}</span>
        <span className="wl-row__sub">
          {t.category} · {pass?.name ?? "Pass"} · {t.time}
        </span>
      </div>
      <span className={"wl-row__amt" + (t.amount > 0 ? " pos" : t.amount < 0 ? " neg" : "")}>
        {money(t.amount, { sign: true })}
      </span>
    </div>
  );
}

export function ActivityScreen() {
  const { ref, collapsed } = useIosCollapse();
  const { txns, showToast } = useWallet();
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const hits = txns.filter(
      (t) =>
        !q ||
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (PASS_BY_ID[t.passId]?.name.toLowerCase().includes(q) ?? false)
    );
    const byDay = new Map<string, Txn[]>();
    for (const t of hits) {
      const list = byDay.get(t.date) ?? [];
      list.push(t);
      byDay.set(t.date, list);
    }
    return [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [txns, query]);

  return (
    <>
      <IosNavBar
        title="Activity"
        collapsed={collapsed}
        trailing={
          <button
            className="wl-nav-btn"
            aria-label="Filter options"
            onClick={() => showToast("Filters are simulated in this prototype")}
          >
            <span aria-hidden="true" style={{ letterSpacing: 1.5, fontWeight: 700 }}>•••</span>
          </button>
        }
      />
      <div className="wl-content" ref={ref}>
        <div className="wl-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M15.8 15.8 20.4 20.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            placeholder="Search merchants, cards…"
            aria-label="Search transactions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {groups.map(([date, list]) => (
          <div key={date}>
            <div className="wl-group-head">{dayLabel(date)}</div>
            <div className="wl-group">
              {list.map((t) => (
                <Row key={t.id} t={t} />
              ))}
            </div>
          </div>
        ))}

        {!groups.length && (
          <div className="wl-group">
            <div className="wl-row">
              <div className="wl-row__main">
                <span className="wl-row__title" style={{ color: "var(--color-text-muted)" }}>
                  No transactions match “{query}”
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="wl-footnote">
          All transactions are simulated for demonstration. Balances are not real.
        </div>
      </div>
    </>
  );
}
