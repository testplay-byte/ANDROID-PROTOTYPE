"use client";

/**
 * CardsScreen — horizontal snap-scroll of two credit cards (flat layer
 * colors, 1px borders, IBM blue accent strip, masked number) with a per-card
 * freeze toggle (CarbonSwitch) and a global "show number" reveal toggle.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { CARDS } from "../lib/data";
import { formatMoney } from "../lib/format";
import { CarbonSwitch } from "../components/carbon-switch";
import styles from "./cards-screen.module.css";

export function CardsScreen() {
  const [frozen, setFrozen] = useState<Record<string, boolean>>({});
  const [showNumber, setShowNumber] = useState(false);

  function toggleFrozen(id: string) {
    setFrozen((f) => ({ ...f, [id]: !f[id] }));
  }

  return (
    <div className={styles.root}>
      <TopBar variant="inline" title="Cards" subtitle={`${CARDS.length} active`} />

      <div className={styles.content}>
        {/* Show number reveal toggle */}
        <button
          type="button"
          className={`${styles.reveal} ${showNumber ? styles.revealOn : ""}`}
          onClick={() => setShowNumber((v) => !v)}
          aria-pressed={showNumber}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            {showNumber ? (
              <>
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                <circle cx="12" cy="12" r="2.5" />
              </>
            ) : (
              <>
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                <path d="M4 4l16 16" />
              </>
            )}
          </svg>
          {showNumber ? "Hide numbers" : "Show numbers"}
        </button>

        {/* Snap-scroll card deck */}
        <div className={styles.deck}>
          {CARDS.map((card) => {
            const isFrozen = !!frozen[card.id];
            const displayNumber = showNumber
              ? card.number
              : `\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ${card.number.slice(-4)}`;
            return (
              <article
                key={card.id}
                className={`${styles.card} ${isFrozen ? styles.cardFrozen : ""}`}
              >
                <span className={styles.accentStrip} aria-hidden="true" />
                <div className={styles.cardTop}>
                  <span className={styles.cardLabel}>{card.label}</span>
                  {isFrozen ? (
                    <span className={styles.frozenTag}>FROZEN</span>
                  ) : (
                    <span className={styles.networkTag}>VISA</span>
                  )}
                </div>
                <span className={styles.cardNumber}>{displayNumber}</span>
                <div className={styles.cardBottom}>
                  <div className={styles.cardField}>
                    <span className={styles.fieldLabel}>Holder</span>
                    <span className={styles.fieldValue}>{card.holder}</span>
                  </div>
                  <div className={styles.cardField}>
                    <span className={styles.fieldLabel}>Expires</span>
                    <span className={styles.fieldValue}>{card.expiry}</span>
                  </div>
                  <div className={styles.cardField}>
                    <span className={styles.fieldLabel}>Balance</span>
                    <span className={styles.fieldValue}>{formatMoney(card.balance)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Per-card freeze controls */}
        {CARDS.map((card) => (
          <div key={card.id} className={styles.freezeRow}>
            <div className={styles.freezeInfo}>
              <span className={styles.freezeTitle}>Freeze — {card.label}</span>
              <span className={styles.freezeDesc}>
                {frozen[card.id]
                  ? "Card is frozen. New charges will be declined."
                  : "Instantly block all new charges."}
              </span>
            </div>
            <CarbonSwitch
              on={!!frozen[card.id]}
              onToggle={() => toggleFrozen(card.id)}
              label={`Freeze ${card.label}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
