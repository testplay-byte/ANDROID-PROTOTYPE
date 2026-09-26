"use client";

/**
 * CartScreen — line items with qty steppers + remove, totals
 * (total row inverted: primary bg), CHECKOUT with confirmation state.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { getProductById } from "../lib/data";
import { formatPrice } from "../lib/currency";
import type { Currency } from "../lib/currency";
import type { CartItem } from "../lib/types";
import { QtyStepper } from "../components/qty-stepper";
import styles from "./cart-screen.module.css";

const SHIPPING_USD = 8;

export function CartScreen({
  items,
  currency,
  onChangeQty,
  onRemove,
  onCheckout,
}: {
  items: CartItem[];
  currency: Currency;
  onChangeQty: (productId: number, size: CartItem["size"], qty: number) => void;
  onRemove: (productId: number, size: CartItem["size"]) => void;
  onCheckout: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  const subtotal = items.reduce(
    (sum, it) => sum + (getProductById(it.productId)?.price ?? 0) * it.qty,
    0
  );
  const shipping = items.length > 0 ? SHIPPING_USD : 0;
  const total = subtotal + shipping;

  function handleCheckout() {
    if (items.length === 0 || confirmed) return;
    setConfirmed(true);
    window.setTimeout(() => {
      setConfirmed(false);
      onCheckout();
    }, 1800);
  }

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="CART" subtitle={`${items.length} ITEM${items.length === 1 ? "" : "S"}`} />

      <div className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg
              width="42"
              height="42"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            >
              <path d="M6 7h12l1.5 13h-15z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
            <span className={styles.emptyTitle}>YOUR CART IS EMPTY</span>
            <span className={styles.emptyDesc}>Go grab something from DROP 07.</span>
          </div>
        ) : (
          <>
            {/* Line items */}
            <div className={styles.lines}>
              {items.map((it) => {
                const product = getProductById(it.productId);
                if (!product) return null;
                return (
                  <div key={`${it.productId}-${it.size}`} className={styles.line}>
                    <div className={`${styles.swatch} ${styles[product.tone]}`}>
                      <span className={styles.swatchShape} />
                    </div>
                    <div className={styles.lineInfo}>
                      <span className={styles.lineName}>{product.name}</span>
                      <span className={styles.lineMeta}>SIZE {it.size} · {formatPrice(product.price, currency)}</span>
                      <div className={styles.lineControls}>
                        <QtyStepper
                          value={it.qty}
                          onChange={(v) => onChangeQty(it.productId, it.size, v)}
                          min={1}
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
                        onClick={() => onRemove(it.productId, it.size)}
                        aria-label={`Remove ${product.name} size ${it.size}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="square"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                        REMOVE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>SUBTOTAL</span>
                <b>{formatPrice(subtotal, currency)}</b>
              </div>
              <div className={styles.totalRow}>
                <span>SHIPPING</span>
                <b>{formatPrice(shipping, currency)}</b>
              </div>
              <div className={styles.totalRowInverted}>
                <span>TOTAL</span>
                <b>{formatPrice(total, currency)}</b>
              </div>
            </div>

            {/* Checkout */}
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
                "CHECKOUT"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
