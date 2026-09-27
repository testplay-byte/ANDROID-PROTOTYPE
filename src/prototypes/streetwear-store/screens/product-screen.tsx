"use client";

/**
 * ProductScreen — pushed detail view (no nav item).
 * Big cover + rotated sticker, oversized name, colorway picker,
 * size grid (sold-out sizes disabled), qty stepper, ADD TO CART + heart,
 * spec table, and a related-pieces strip that swaps the detail in place.
 * The back button calls history.back() (handled by the page's closeProduct).
 */

import { useMemo, useState } from "react";
import { PRODUCTS, getProductById } from "../lib/data";
import { formatPrice } from "../lib/currency";
import type { Currency } from "../lib/currency";
import { SIZES } from "../lib/types";
import type { CoverTone, Size } from "../lib/types";
import { QtyStepper } from "../components/qty-stepper";
import { Cover, HeartIcon } from "../components/cover";
import styles from "./product-screen.module.css";

const TONE_NAME: Record<CoverTone, string> = {
  primary: "ACID YELLOW",
  secondary: "FLAME RED",
  tertiary: "STEEL BLUE",
  success: "ACID GREEN",
  surface: "CONCRETE",
};

const COLORWAY_CLASS: Record<CoverTone, string> = {
  primary: styles.cwPrimary,
  secondary: styles.cwSecondary,
  tertiary: styles.cwTertiary,
  success: styles.cwSuccess,
  surface: styles.cwSurface,
};

export function ProductScreen({
  productId,
  currency,
  defaultSize,
  favorites,
  onBack,
  onOpenProduct,
  onToggleFavorite,
  onAddToCart,
  onNotify,
}: {
  productId: number;
  currency: Currency;
  defaultSize: Size;
  favorites: number[];
  onBack: () => void;
  onOpenProduct: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onAddToCart: (productId: number, size: Size, qty: number, tone: CoverTone) => void;
  onNotify: (msg: string, tone?: "ink" | "flame") => void;
}) {
  const product = getProductById(productId);
  const [size, setSize] = useState<Size>(() => {
    const sold = product?.soldSizes ?? [];
    return SIZES.find((s) => s === defaultSize && !sold.includes(s)) ??
      SIZES.find((s) => !sold.includes(s)) ??
      defaultSize;
  });
  const [tone, setTone] = useState<CoverTone>(product?.tone ?? "primary");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const related = useMemo(
    () =>
      product
        ? PRODUCTS.filter(
            (p) => p.id !== product.id && p.category === product.category
          ).concat(
            PRODUCTS.filter(
              (p) => p.id !== product.id && p.category !== product.category
            )
          ).slice(0, 5)
        : [],
    [product]
  );

  // The page remounts this view per product (key={productId}), so the
  // local pickers always start fresh for the opened product.
  if (!product) return null;

  const soldOut = product.soldOut === true;
  const sizeSold = (s: Size) => soldOut || (product.soldSizes?.includes(s) ?? false);
  const fav = favorites.includes(product.id);

  function handleAdd() {
    if (soldOut) return;
    onAddToCart(product!.id, size, qty, tone);
    setAdded(true);
    onNotify(`${qty}× ${product!.name} · ${size} → CART`);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div className={styles.root}>
      {/* ---- Header slab: back + crumb + actions ---- */}
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
        <span className={styles.headerTitle}>
          {product.category.toUpperCase()} / {String(product.id).padStart(3, "0")}
        </span>
        <button
          type="button"
          className={`${styles.headFav} ${fav ? styles.headFavOn : ""}`}
          onClick={() => {
            onToggleFavorite(product.id);
            onNotify(fav ? "REMOVED FROM SAVED" : "SAVED", fav ? "flame" : "ink");
          }}
          aria-label={fav ? "Remove from saved" : "Save this piece"}
          aria-pressed={fav}
        >
          <HeartIcon filled={fav} size={18} />
        </button>
      </header>

      <div className={styles.content}>
        {/* ---- Big cover ---- */}
        <Cover tone={tone} className={styles.cover}>
          <span className={styles.coverIdx} aria-hidden="true">
            DR07/{String(product.id).padStart(3, "0")}
          </span>
          {product.tag ? (
            <span className={styles.sticker}>{product.tag}</span>
          ) : null}
          {soldOut ? <span className={styles.soldBand}>SOLD OUT</span> : null}
        </Cover>

        {/* ---- Colorway picker ---- */}
        {product.colorways.length > 1 ? (
          <div className={styles.colorways}>
            <span className={styles.colorwayLabel}>{TONE_NAME[tone]}</span>
            <div className={styles.colorwayRow}>
              {product.colorways.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`${styles.cwBtn} ${COLORWAY_CLASS[c]} ${tone === c ? styles.cwActive : ""}`}
                  onClick={() => setTone(c)}
                  aria-pressed={tone === c}
                  aria-label={TONE_NAME[c]}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* ---- Name + price ---- */}
        <h1 className={styles.name}>{product.name}</h1>
        <div className={styles.priceRow}>
          <span
            className={`${styles.price} ${product.tag?.startsWith("-") ? styles.priceSale : ""}`}
          >
            {formatPrice(product.price, currency)}
          </span>
          <span className={styles.sku}>
            SKU DR07-{String(product.id).padStart(3, "0")} · SHIPS 48H
          </span>
        </div>
        <p className={styles.desc}>{product.desc}</p>

        {/* ---- Size grid ---- */}
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>S</span>
          <span className={styles.sectionLabel}>SIZE</span>
          <span className={styles.sectionHint}>TRUE TO SIZE</span>
        </div>
        <div className={styles.sizes}>
          {SIZES.map((s) => {
            const disabled = sizeSold(s);
            return (
              <button
                key={s}
                type="button"
                className={`${styles.sizeBtn} ${size === s && !disabled ? styles.sizeBtnActive : ""}`}
                disabled={disabled}
                aria-pressed={size === s && !disabled}
                onClick={() => setSize(s)}
              >
                {s}
                {disabled ? <span className={styles.sizeX} aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>

        {/* ---- Quantity + add ---- */}
        <div className={styles.buyRow}>
          <div className={styles.qtyBlock}>
            <span className={styles.qtyLabel}>QTY</span>
            <QtyStepper value={qty} onChange={setQty} min={1} max={9} label="Quantity" />
          </div>
          <button
            type="button"
            className={`${styles.addToCart} ${added ? styles.addToCartDone : ""}`}
            onClick={handleAdd}
            disabled={soldOut}
          >
            {soldOut ? (
              "SOLD OUT"
            ) : added ? (
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
                ADDED
              </>
            ) : (
              "ADD TO CART"
            )}
          </button>
        </div>

        {/* ---- Spec table ---- */}
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>#</span>
          <span className={styles.sectionLabel}>SPECS</span>
        </div>
        <div className={styles.specs}>
          {product.specs.map((sp) => (
            <div key={sp.label} className={styles.specRow}>
              <span className={styles.specLabel}>{sp.label}</span>
              <span className={styles.specValue}>{sp.value}</span>
            </div>
          ))}
        </div>

        {/* ---- Related strip ---- */}
        <div className={styles.sectionHead}>
          <span className={styles.sectionNum}>+</span>
          <span className={styles.sectionLabel}>ALSO IN DROP 07</span>
        </div>
        <div className={styles.related}>
          {related.map((r) => (
            <button
              key={r.id}
              type="button"
              className={styles.relatedCard}
              onClick={() => onOpenProduct(r.id)}
            >
              <Cover tone={r.tone} className={styles.relatedCover} plain />
              <span className={styles.relatedName}>{r.name}</span>
              <span className={styles.relatedPrice}>{formatPrice(r.price, currency)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
