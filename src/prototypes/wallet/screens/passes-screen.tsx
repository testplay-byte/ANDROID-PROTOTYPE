"use client";

/* passes screen — the Wallet stack + quick actions + recent transactions */

import { IosNavBar, useIosCollapse } from "../components/ios";
import { PassStack } from "../components/pass-card";
import { money } from "../lib/data";
import { useWallet } from "../state/wallet-context";

export function PassesScreen({ go }: { go: (v: "activity" | "pay") => void }) {
  const { ref, collapsed } = useIosCollapse();
  const { passes, selectedId, selectPass, txns, showToast } = useWallet();
  const selIdx = Math.max(0, passes.findIndex((p) => p.id === selectedId));
  const pass = passes[selIdx];
  const recent = txns.filter((t) => t.passId === pass.id).slice(0, 4);

  return (
    <>
      <IosNavBar
        title="Wallet"
        collapsed={collapsed}
        trailing={
          <>
            <button
              className="wl-nav-btn"
              aria-label="Search activity"
              onClick={() => {
                go("activity");
                setTimeout(() => document.querySelector<HTMLInputElement>(".wl-search input")?.focus(), 350);
              }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle cx="11" cy="11" r="6.4" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M15.8 15.8 20.4 20.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <button className="wl-nav-btn" aria-label="Add pass" onClick={() => showToast("Adding passes is simulated in this prototype")}>
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
              </svg>
            </button>
          </>
        }
      />
      <div className="wl-content" ref={ref}>
        <PassStack passes={passes} selectedId={selectedId} onSelect={selectPass} />

        <div className="wl-actions">
          <button className="wl-gbtn primary" onClick={() => go("pay")}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <rect x="3" y="6.5" width="18" height="11.5" rx="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M3 10.4h18" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Pay
          </button>
          <button className="wl-gbtn" onClick={() => go("activity")}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 7.6V12l3.1 1.9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Activity
          </button>
          <button className="wl-gbtn" onClick={() => showToast(`${pass.name} · ${pass.number}`)}>
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 9.4V4.6M12 19.4v-4.8M9.4 12H4.6M19.4 12h-4.8" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
            </svg>
            Details
          </button>
        </div>

        <div className="wl-group-head">Recent activity · {pass.name}</div>
        <div className="wl-group">
          {recent.map((t, i) => (
            <div className={"wl-row" + (i < recent.length - 1 ? " sep" : "")} key={t.id}>
              <span className={`wl-disc tint-${pass.tint}`}>
                {t.merchant.slice(0, 1)}
              </span>
              <div className="wl-row__main">
                <span className="wl-row__title">{t.merchant}</span>
                <span className="wl-row__sub">{t.category} · {t.time}</span>
              </div>
              <span className={"wl-row__amt" + (t.amount > 0 ? " pos" : t.amount < 0 ? " neg" : "")}>
                {money(t.amount, { sign: true })}
              </span>
            </div>
          ))}
          {!recent.length && (
            <div className="wl-row">
              <div className="wl-row__main">
                <span className="wl-row__title" style={{ color: "var(--color-text-muted)" }}>
                  No activity on this pass yet
                </span>
              </div>
            </div>
          )}
        </div>
        <button className="wl-link" onClick={() => go("activity")}>
          See all activity
        </button>
      </div>
    </>
  );
}
