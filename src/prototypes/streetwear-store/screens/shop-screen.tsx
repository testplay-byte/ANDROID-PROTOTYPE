"use client";

/**
 * ShopScreen — hero topbar "DROP 07", category chips + 2-col product grid.
 * Tap a card → product detail. Tap ADD → quick-add (size M) to cart.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { PRODUCTS } from "../lib/data";
import { formatPrice } from "../lib/currency";
import type { Currency } from "../lib/currency";
import type { Category } from "../lib/types";
import styles from "./shop-screen.module.css";

const CHIPS: { id: Category; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "hoodies", label: "HOODIES" },
  { id: "tees", label: "TEES" },
  { id: "pants", label: "PANTS" },
  { id: "acc", label: "ACC" },
];

export function ShopScreen({
  currency,
  onOpenProduct,
  onQuickAdd,
}: {
  currency: Currency;
  onOpenProduct: (id: number) => void;
  onQuickAdd: (id: number) => void;
}) {
  const [cat, setCat] = useState<Category>("all");

  const visible =
    cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  return (
    <div className={styles.root}>
      <TopBar variant="hero" title="DROP 07" subtitle="SS26 — NEW SEASON" />

      <div className={styles.content}>
        {/* Category chips */}
        <div className={styles.chips}>
          {CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`${styles.chip} ${cat === c.id ? styles.chipActive : ""}`}
              onClick={() => setCat(c.id)}
              aria-pressed={cat === c.id}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className={styles.grid}>
          {visible.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              className={styles.card}
              onClick={() => onOpenProduct(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onOpenProduct(p.id);
              }}
            >
              <div className={`${styles.cover} ${styles[p.tone]}`}>
                <span className={styles.shapeCircle} />
                <span className={styles.shapeBar} />
                <span className={styles.shapeDot} />
                {p.tag ? <span className={styles.tag}>{p.tag}</span> : null}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.price}>{formatPrice(p.price, currency)}</span>
                <button
                  type="button"
                  className={styles.add}
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(p.id);
                  }}
                >
                  ADD
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
