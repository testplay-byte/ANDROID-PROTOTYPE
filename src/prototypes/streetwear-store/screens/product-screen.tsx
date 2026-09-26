"use client";

/**
 * ProductScreen — pushed detail view (no nav item).
 * Big placeholder cover, size selector, quantity stepper, ADD TO CART.
 * The back button calls history.back() (handled by the page's closeDetail).
 */

import { useState } from "react";
import { getProductById } from "../lib/data";
import { formatPrice } from "../lib/currency";
import type { Currency } from "../lib/currency";
import { SIZES } from "../lib/types";
import type { Size } from "../lib/types";
import { QtyStepper } from "../components/qty-stepper";
import styles from "./product-screen.module.css";

export function ProductScreen({
  productId,
  currency,
  onBack,
  onAddToCart,
}: {
  productId: number;
  currency: Currency;
  onBack: () => void;
  onAddToCart: (productId: number, size: Size, qty: number) => void;
}) {
  const product = getProductById(productId);
  const [size, setSize] = useState<Size>("M");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  function handleAdd() {
    onAddToCart(product!.id, size, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className={styles.root}>
      {/* Header with back */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.back}
          onClick={onBack}
          aria-label="Back to shop"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <span className={styles.headerTitle}>PRODUCT</span>
      </header>

      <div className={styles.content}>
        {/* Big placeholder cover with geometric shapes */}
        <div className={`${styles.cover} ${styles[product.tone]}`}>
          <span className={styles.shapeCircleBig} />
          <span className={styles.shapeCircleSmall} />
          <span className={styles.shapeStripe} />
          <span className={styles.shapeSquare} />
          {product.tag ? <span className={styles.tag}>{product.tag}</span> : null}
        </div>

        {/* Name + price */}
        <div className={styles.titleRow}>
          <h1 className={styles.name}>{product.name}</h1>
          <span className={styles.price}>{formatPrice(product.price, currency)}</span>
        </div>
        <p className={styles.sku}>SKU: DR07-{String(product.id).padStart(3, "0")} · SHIPS IN 48H</p>

        {/* Size selector */}
        <span className={styles.sectionLabel}>SIZE</span>
        <div className={styles.sizes}>
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={`${styles.sizeBtn} ${size === s ? styles.sizeBtnActive : ""}`}
              onClick={() => setSize(s)}
              aria-pressed={size === s}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <span className={styles.sectionLabel}>QUANTITY</span>
        <div className={styles.qtyRow}>
          <QtyStepper value={qty} onChange={setQty} min={1} label="Quantity" />
        </div>

        {/* ADD TO CART */}
        <button
          type="button"
          className={`${styles.addToCart} ${added ? styles.addToCartDone : ""}`}
          onClick={handleAdd}
        >
          {added ? (
            <>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="square"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              ADDED TO CART
            </>
          ) : (
            "ADD TO CART"
          )}
        </button>
      </div>
    </div>
  );
}
