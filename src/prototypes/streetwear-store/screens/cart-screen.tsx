"use client";

/**
 * CartScreen — brutalist cart. Slab header with back-to-shop action,
 * marquee ticker, line items (swatch, stepper, remove), promo-code chip,
 * free-shipping progress, totals (inverted yellow TOTAL row), CHECKOUT
 * with an "ORDER PLACED" confirmation state, poster-style empty state.
 */

import { useState } from "react";
import { useKeyboardInput } from "../../../proto-kit";
import { getProductById, TICKER } from "../lib/data";
import { formatPrice } from "../lib/currency";
import type { Currency } from "../lib/currency";
import type { CartItem } from "../lib/types";
import { QtyStepper } from "../components/qty-stepper";
import { Cover } from "../components/cover";
import { Marquee } from "../components/marquee";
import styles from "./cart-screen.module.css";

const SHIPPING_USD = 8;
const FREE_SHIP_USD = 150;
const PROMOS: Record<string, number> = { BRUTAL10: 0.1, DROP07: 0.2 };

export function CartScreen({
  items,
  currency,
  onChangeQty,
  onRemove,
  onCheckout,
  onGoShop,
  onNotify,
}: {
  items: CartItem[];
  currency: Currency;
  onChangeQty: (productId: number, size: CartItem["size"], qty: number) => void;
  onRemove: (productId: number, size: CartItem["size"]) => void;
  onCheckout: () => void;
  onGoShop: () => void;
  onNotify: (msg: string, tone?: "ink" | "flame") => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<string | null>(null);

  const promoKb = useKeyboardInput({
    value: promoInput,
    onChange: setPromoInput,
    onEnter: applyPromo,
    enterLabel: "Apply",
  });

  const subtotal = items.reduce(
    (sum, it) => sum + (getProductById(it.productId)?.price ?? 0) * it.qty,
    0
  );
  const discount = promo ? Math.round(subtotal * PROMOS[promo] * 100) / 100 : 0;
  const net = subtotal - discount;
  const shipping = items.length === 0 || net >= FREE_SHIP_USD ? 0 : SHIPPING_USD;
  const total = net + shipping;
  const shipProgress = Math.min(100, Math.round((net / FREE_SHIP_USD) * 100));

  function handleCheckout() {
    if (items.length === 0 || confirmed) return;
    setConfirmed(true);
    window.setTimeout(() => {
      setConfirmed(false);
      setPromo(null);
      setPromoInput("");
      onCheckout();
    }, 1800);
  }

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromo(code);
      setPromoInput("");
      onNotify(`${code} APPLIED −${Math.round(PROMOS[code] * 100)}%`);
    } else {
      setPromo(null);
      onNotify("INVALID PROMOCODE", "flame");
    }
  }

  return (
    <div className={styles.root}>
      {/* ---- Slab header (no TopBar — the cart wears its own chrome) ---- */}
      <header className={styles.header}>
        <span className={styles.headerKicker}>CART</span>
        <span className={styles.headerCount}>
          {items.reduce((n, it) => n + it.qty, 0)} STK
        </span>
        <button
          type="button"
          className={styles.keepShopping}
          onClick={onGoShop}
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          KEEP SHOPPING
        </button>
      </header>

      <Marquee items={TICKER} variant="paper" />

      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyBig}>EMPTY</span>
            <span className={styles.emptyBig}>BAG.</span>
            <span className={styles.emptyDesc}>
              DROP 07 won&apos;t restock itself.
            </span>
            <button
              type="button"
              className={styles.emptyCta}
              onClick={onGoShop}
            >
              GO SHOP
            </button>
          </div>
        ) : (
          <>
            {/* ---- Free-shipping progress ---- */}
            <div className={styles.shipBox}>
              {shipping === 0 ? (
                <span className={styles.shipDone}>
                  ✓ FREE SHIPPING UNLOCKED
                </span>
              ) : (
                <>
                  <span className={styles.shipLabel}>
                    ADD {formatPrice(FREE_SHIP_USD - net, currency)} FOR FREE
                    SHIPPING
                  </span>
                  <div className={styles.shipTrack}>
                    <div
                      className={styles.shipFill}
                      style={{ width: `${shipProgress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* ---- Line items ---- */}
            <div className={styles.lines}>
              {items.map((it, i) => {
                const product = getProductById(it.productId);
                if (!product) return null;
                return (
                  <div key={`${it.productId}-${it.size}-${it.tone}`} className={styles.line}>
                    <span className={styles.lineNum}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Cover tone={it.tone} className={styles.swatch} plain />
                    <div className={styles.lineInfo}>
                      <span className={styles.lineName}>{product.name}</span>
                      <span className={styles.lineMeta}>
                        SIZE {it.size} · {formatPrice(product.price, currency)} EA
                      </span>
                      <div className={styles.lineControls}>
                        <QtyStepper
                          value={it.qty}
                          onChange={(v) => onChangeQty(it.productId, it.size, v)}
                          min={1}
                          max={9}
                          label={`${product.name} quantity`}
                        />
                      </div>
                    </div>
                    <div className={styles.lineRight}>
                      <span className={styles.lineTotal}>
                        {formatPrice(product.price * it.qty, currency)}
                      </span>
                      <button
                        type="button"
                        className={styles.remove}
                        onClick={() => {
                          onRemove(it.productId, it.size);
                          onNotify("REMOVED FROM CART", "flame");
                        }}
                        aria-label={`Remove ${product.name} size ${it.size}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="square"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ---- Promo code ---- */}
            <div className={styles.promo}>
              <input
                className={styles.promoInput}
                {...promoKb}
                type="text"
                placeholder="PROMOCODE"
                disabled={confirmed}
                aria-label="Promo code"
              />
              <button
                type="button"
                className={styles.promoBtn}
                onClick={applyPromo}
                disabled={confirmed || promoInput.trim() === ""}
              >
                APPLY
              </button>
              {promo ? (
                <button
                  type="button"
                  className={styles.promoChip}
                  onClick={() => setPromo(null)}
                  aria-label={`Remove promo ${promo}`}
                >
                  {promo} −{Math.round(PROMOS[promo] * 100)}% ×
                </button>
              ) : null}
            </div>

            {/* ---- Totals ---- */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>SUBTOTAL</span>
                <b>{formatPrice(subtotal, currency)}</b>
              </div>
              {discount > 0 ? (
                <div className={`${styles.totalRow} ${styles.totalRowSale}`}>
                  <span>PROMO {promo}</span>
                  <b>−{formatPrice(discount, currency)}</b>
                </div>
              ) : null}
              <div className={styles.totalRow}>
                <span>SHIPPING</span>
                <b>{shipping === 0 ? "FREE" : formatPrice(shipping, currency)}</b>
              </div>
              <div className={styles.totalRowInverted}>
                <span>TOTAL</span>
                <b>{formatPrice(total, currency)}</b>
              </div>
            </div>

            {/* ---- Checkout ---- */}
            <button
              type="button"
              className={`${styles.checkout} ${confirmed ? styles.checkoutDone : ""}`}
              onClick={handleCheckout}
            >
              {confirmed ? (
                <>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="square"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  ORDER PLACED
                </>
              ) : (
                <>
                  CHECKOUT
                  <span className={styles.checkoutPrice}>
                    {formatPrice(total, currency)}
                  </span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
