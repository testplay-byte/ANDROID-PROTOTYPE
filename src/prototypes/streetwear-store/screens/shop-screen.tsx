"use client";

/**
 * ShopScreen — poster-composition shop home.
 * Structure: hero TopBar → marquee ticker → featured poster block →
 * category chips (incl. SAVED) → numbered grid banner → 2-col product grid.
 * Tap a card → product detail. Tap ADD → quick-add (default size).
 * Tap the heart → toggle favorite (persisted upstream in page.tsx).
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { PRODUCTS, TICKER, getProductById } from "../lib/data";
import { formatPrice } from "../lib/currency";
import type { Currency } from "../lib/currency";
import type { Category, Product } from "../lib/types";
import { Marquee } from "../components/marquee";
import { Cover, HeartIcon } from "../components/cover";
import styles from "./shop-screen.module.css";

const CHIPS: { id: Category; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "hoodies", label: "HOODIES" },
  { id: "tees", label: "TEES" },
  { id: "pants", label: "PANTS" },
  { id: "acc", label: "ACC" },
];

type FilterId = Category | "saved";

export function ShopScreen({
  currency,
  favorites,
  onToggleFavorite,
  onOpenProduct,
  onQuickAdd,
}: {
  currency: Currency;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onOpenProduct: (id: number) => void;
  onQuickAdd: (product: Product) => void;
}) {
  const [cat, setCat] = useState<FilterId>("all");

  const featured = getProductById(1)!;
  const visible =
    cat === "all"
      ? PRODUCTS
      : cat === "saved"
        ? PRODUCTS.filter((p) => favorites.includes(p.id))
        : PRODUCTS.filter((p) => p.category === cat);

  const chipLabel =
    cat === "saved"
      ? "SAVED"
      : CHIPS.find((c) => c.id === cat)?.label ?? "ALL PIECES";

  return (
    <div className={styles.root}>
      <TopBar
        variant="hero"
        title="DROP 07"
        subtitle="SS26 — NEW SEASON"
        trailing={
          <button
            type="button"
            className={styles.savedBtn}
            onClick={() => setCat(cat === "saved" ? "all" : "saved")}
            aria-pressed={cat === "saved"}
            aria-label="Show saved items"
          >
            <HeartIcon filled={cat === "saved" || favorites.length > 0} />
            <span className={styles.savedCount}>{favorites.length}</span>
          </button>
        }
      />

      <Marquee items={TICKER} variant="ink" />

      <div className={styles.content}>
        {/* ---- Featured poster block ---- */}
        <button
          type="button"
          className={styles.featured}
          onClick={() => onOpenProduct(featured.id)}
        >
          <span className={styles.featuredOverline}>01 — FEATURED PIECE</span>
          <span className={styles.featuredName}>{featured.name}</span>
          <span className={styles.featuredRow}>
            <span className={styles.featuredPrice}>
              {formatPrice(featured.price, currency)}
            </span>
            <span className={styles.featuredCta}>
              VIEW
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="square"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </span>
          <span className={styles.featuredSticker} aria-hidden="true">
            {featured.tag ?? "NEW"}
          </span>
          <span className={styles.featuredDiamond} aria-hidden="true" />
        </button>

        {/* ---- Category chips ---- */}
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
          <button
            type="button"
            className={`${styles.chip} ${styles.chipSaved} ${cat === "saved" ? styles.chipActive : ""}`}
            onClick={() => setCat("saved")}
            aria-pressed={cat === "saved"}
          >
            <HeartIcon filled={cat === "saved"} />
            SAVED{favorites.length > 0 ? ` (${favorites.length})` : ""}
          </button>
        </div>

        {/* ---- Grid section banner ---- */}
        <div className={styles.banner}>
          <span className={styles.bannerNum}>02</span>
          <span className={styles.bannerText}>{chipLabel}</span>
          <span className={styles.bannerCount}>{visible.length} STK</span>
        </div>

        {/* ---- Product grid ---- */}
        {visible.length === 0 ? (
          <div className={styles.emptySaved}>
            <span className={styles.emptySavedTitle}>NOTHING SAVED YET</span>
            <span className={styles.emptySavedDesc}>
              Tap the heart on a piece to pin it here.
            </span>
          </div>
        ) : (
          <div className={styles.grid}>
            {visible.map((p, i) => {
              const fav = favorites.includes(p.id);
              return (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  className={`${styles.card} ${p.soldOut ? styles.cardSold : ""}`}
                  onClick={() => onOpenProduct(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onOpenProduct(p.id);
                  }}
                >
                  <Cover tone={p.tone} className={styles.cover}>
                    <span className={styles.num} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <button
                      type="button"
                      className={`${styles.fav} ${fav ? styles.favOn : ""}`}
                      aria-label={fav ? `Unsave ${p.name}` : `Save ${p.name}`}
                      aria-pressed={fav}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(p.id);
                      }}
                    >
                      <HeartIcon filled={fav} />
                    </button>
                    {p.tag ? (
                      <span
                        className={`${styles.sticker} ${p.tag.startsWith("-") ? styles.stickerFlame : ""}`}
                      >
                        {p.tag}
                      </span>
                    ) : null}
                    {p.soldOut ? <span className={styles.soldBand}>SOLD OUT</span> : null}
                  </Cover>
                  <div className={styles.cardBody}>
                    <span className={styles.name}>{p.name}</span>
                    <div className={styles.cardFoot}>
                      <span
                        className={`${styles.price} ${p.tag?.startsWith("-") ? styles.priceSale : ""}`}
                      >
                        {formatPrice(p.price, currency)}
                      </span>
                      <button
                        type="button"
                        className={styles.add}
                        disabled={p.soldOut}
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAdd(p);
                        }}
                        aria-label={
                          p.soldOut ? `${p.name} sold out` : `Add ${p.name} to cart`
                        }
                      >
                        {p.soldOut ? "GONE" : "ADD"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
