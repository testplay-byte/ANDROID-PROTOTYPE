"use client";

/**
 * streetwear-store / page — the prototype entry point.
 *
 * Renders the full shell:
 *   KeyboardProvider → DeviceThemeProvider (light default, scoped to
 *   .device, persisted) → Stage (left/right info panels + device) →
 *   DeviceFrame (style="brutalism") → Screen → view switch + BottomNav
 *   (variant="hard"; hidden when the product detail is open) + Keyboard
 *   + toast layer.
 *
 * App state lives here and persists to localStorage under streetwear-*:
 *   cart lines (product+size+qty+tone, drives the "Cart (n)" nav badge),
 *   favorites, currency, default size, drop-alerts.
 *
 * Hash router:
 *   #shop / #cart / #settings → that view.
 *   #product{id} → pushed detail view. Opened with history.pushState so
 *   the browser's back button closes it (popstate re-parses the hash).
 */

import { useCallback, useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
  Keyboard,
  KeyboardProvider,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
} from "../../../src/proto-kit";
import { ShopScreen } from "../../../src/prototypes/streetwear-store/screens/shop-screen";
import { CartScreen } from "../../../src/prototypes/streetwear-store/screens/cart-screen";
import { SettingsScreen } from "../../../src/prototypes/streetwear-store/screens/settings-screen";
import { ProductScreen } from "../../../src/prototypes/streetwear-store/screens/product-screen";
import { Toast } from "../../../src/prototypes/streetwear-store/components/toast";
import { SIZES } from "../../../src/prototypes/streetwear-store/lib/types";
import type { Product, CartItem, Size } from "../../../src/prototypes/streetwear-store/lib/types";
import type { Currency } from "../../../src/prototypes/streetwear-store/lib/currency";

type ViewId = "shop" | "cart" | "settings" | "product";

interface HashState {
  view: ViewId;
  productId: number | null;
}

function parseHash(): HashState {
  if (typeof window === "undefined") return { view: "shop", productId: null };
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "shop" || hash === "cart" || hash === "settings") {
    return { view: hash, productId: null };
  }
  if (hash.startsWith("product")) {
    const id = parseInt(hash.replace("product", ""), 10);
    if (id) return { view: "product", productId: id };
  }
  return { view: "shop", productId: null };
}

/** Persisted localStorage state (streetwear-* keys, device-scoped). */
function useStored<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return fallback;
    try {
      const raw = window.localStorage.getItem(`streetwear-${key}`);
      return raw !== null ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  });
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          window.localStorage.setItem(`streetwear-${key}`, JSON.stringify(next));
        } catch {
          /* storage may be blocked — state still works in-session */
        }
        return next;
      });
    },
    [key]
  );
  return [value, set];
}

const DEFAULT_CART: CartItem[] = [
  { productId: 2, size: "M", qty: 1, tone: "secondary" },
  { productId: 7, size: "S", qty: 2, tone: "primary" },
];

interface ToastMsg {
  id: number;
  text: string;
  tone: "ink" | "flame";
}

export default function Page() {
  const [view, setView] = useState<ViewId>("shop");
  const [productId, setProductId] = useState<number | null>(null);

  const [currency, setCurrency] = useStored<Currency>("currency", "USD");
  const [defaultSize, setDefaultSize] = useStored<Size>("size", "M");
  const [notifications, setNotifications] = useStored<boolean>("alerts", true);
  const [favorites, setFavorites] = useStored<number[]>("favorites", [5]);
  const [cart, setCart] = useStored<CartItem[]>("cart", DEFAULT_CART);

  const [toast, setToast] = useState<ToastMsg | null>(null);
  const notify = useCallback((text: string, tone: "ink" | "flame" = "ink") => {
    setToast({ id: Date.now(), text, tone });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const cartCount = cart.reduce((n, it) => n + it.qty, 0);

  // ── Hash routing ─────────────────────────────────────────────────────
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#shop");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
    } else {
      const { view: v, productId: id } = parseHash();
      setView(v);
      setProductId(id);
    }
  }, []);

  useEffect(() => {
    function onPop() {
      const { view: v, productId: id } = parseHash();
      setView(v);
      setProductId(id);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function handleNav(id: string) {
    if (id === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    setView(id as ViewId);
    setProductId(null);
  }

  // Open product detail — pushState so the browser back button closes it.
  function openProduct(id: number) {
    try {
      history.pushState({ view: "product", id }, "", `#product${id}`);
    } catch {
      /* sandbox may block — fall through to state update only */
    }
    setView("product");
    setProductId(id);
  }

  // Back button on the detail screen → history.back() → popstate fires.
  function closeProduct() {
    history.back();
  }

  // ── Cart operations ──────────────────────────────────────────────────
  function addToCart(id: number, size: Size, qty: number, tone: CartItem["tone"]) {
    setCart((items) => {
      const idx = items.findIndex(
        (it) => it.productId === id && it.size === size && it.tone === tone
      );
      if (idx >= 0) {
        const next = [...items];
        next[idx] = { ...next[idx], qty: Math.min(9, next[idx].qty + qty) };
        return next;
      }
      return [...items, { productId: id, size, qty, tone }];
    });
  }

  // Quick-add from a shop card: default size (or first available), first colorway.
  function quickAdd(product: Product) {
    if (product.soldOut) return;
    const sold = product.soldSizes ?? [];
    const size =
      SIZES.find((s) => s === defaultSize && !sold.includes(s)) ??
      SIZES.find((s) => !sold.includes(s));
    if (!size) return;
    addToCart(product.id, size, 1, product.colorways[0]);
    notify(`+1 ${product.name.toUpperCase()} · ${size} → CART`);
  }

  function changeQty(id: number, size: Size, qty: number) {
    setCart((items) =>
      items.map((it) =>
        it.productId === id && it.size === size ? { ...it, qty } : it
      )
    );
  }

  function removeItem(id: number, size: Size) {
    setCart((items) =>
      items.filter((it) => !(it.productId === id && it.size === size))
    );
  }

  function checkout() {
    setCart([]);
    notify("ORDER PLACED — GG", "flame");
  }

  function toggleFavorite(id: number) {
    setFavorites((favs) =>
      favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]
    );
  }

  function resetData() {
    setCart([]);
    setFavorites([]);
    setCurrency("USD");
    setDefaultSize("M");
    setNotifications(true);
  }

  // ── Swipe gestures (proto-kit) ───────────────────────────────────────
  const SWIPE_ORDER: ViewId[] = ["shop", "cart", "settings"];

  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (view === "product") return;
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) handleNav(SWIPE_ORDER[idx + 1]);
    },
    onSwipeRight: () => {
      if (view === "product") {
        closeProduct();
        return;
      }
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) handleNav(SWIPE_ORDER[idx - 1]);
    },
  });

  const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
    shop: {
      name: "Shop",
      desc: "DROP 07 poster home — marquee ticker, featured block, category + SAVED chips filtering a numbered 2-col grid. Card heart = favorite (persisted), ADD = quick-add, tap = detail.",
    },
    cart: {
      name: "Cart",
      desc: "Slab header with live count, free-shipping progress bar, qty steppers, promo codes (BRUTAL10 / DROP07), subtotal/discount/total rows, checkout with ORDER PLACED state.",
    },
    settings: {
      name: "Settings",
      desc: "Store stats strip, light/dark theme, drop alerts, default size, USD/EUR/GBP currency and a two-tap data reset. Everything persists to localStorage.",
    },
    product: {
      name: "Product detail",
      desc: "Pushed view (no nav item) — big cover, colorway picker, size grid with sold-out strikes, qty + ADD TO CART, spec table, related strip. Browser back closes it.",
    },
  };

  const info = SCREEN_INFO[view];

  const NAV_ITEMS = [
    {
      id: "shop",
      label: "Shop",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <path d="M6 8h12l1.5 13h-15z" />
          <path d="M9 11V6a3 3 0 0 1 6 0v5" />
        </svg>
      ),
    },
    {
      id: "cart",
      label: `Cart (${cartCount})`,
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21.5 8H6" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
          <rect x="4" y="4" width="16" height="16" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2" />
        </svg>
      ),
    },
  ];

  return (
    <KeyboardProvider>
      <DeviceThemeProvider storageKey="streetwear-theme" initialTheme="light">
        <Stage
          leftPanel={
            <>
              <PanelBadge>prototype</PanelBadge>
              <PanelTitle>Streetwear Store</PanelTitle>
              <PanelDesc>
                A neo-brutalist streetwear shop. Thick borders, hard offset
                shadows, zero radius, unapologetic yellow. Marquee ticker,
                featured poster block, numbered grid with favorites, product
                detail with colorways and sold-out sizes, cart with promo codes
                and free-shipping progress — all persisted.
              </PanelDesc>
              <div className="tags">
                <span className="tag">Brutalism</span>
                <span className="tag">Neo-brutal</span>
                <span className="tag">Shop</span>
                <span className="tag">Cart</span>
                <span className="tag">4 views</span>
              </div>
            </>
          }
          rightPanel={
            <>
              <PanelHead>Screen info</PanelHead>
              <div className="screeninfo">
                <span className="screeninfo__name">{info.name}</span>
                <span className="screeninfo__desc">{info.desc}</span>
              </div>

              <PanelHead>Interactions</PanelHead>
              <div className="mini-bars">
                <MiniBar label="Add" width="100%" color="#f0513d" />
                <MiniBar label="Detail" width="90%" color="#ffd23f" />
                <MiniBar label="Saved" width="75%" color="#141210" />
                <MiniBar label="Promo" width="60%" color="#3d6a7f" />
                <MiniBar label="Currency" width="45%" color="#5ad161" />
              </div>

              <PanelHead>Design</PanelHead>
              <div className="kvlist">
                <div className="kvlist__row">
                  <span>Style</span>
                  <b>Neo-brutalism</b>
                </div>
                <div className="kvlist__row">
                  <span>Borders</span>
                  <b>2-3px + hard shadow</b>
                </div>
                <div className="kvlist__row">
                  <span>Radius</span>
                  <b>0px</b>
                </div>
                <div className="kvlist__row">
                  <span>Primary</span>
                  <b>#ffd23f</b>
                </div>
              </div>
            </>
          }
        >
          <DeviceFrame theme="light" style="brutalism">
            <Screen>
              {view === "shop" && (
                <ShopScreen
                  currency={currency}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  onOpenProduct={openProduct}
                  onQuickAdd={quickAdd}
                />
              )}
              {view === "cart" && (
                <CartScreen
                  items={cart}
                  currency={currency}
                  onChangeQty={changeQty}
                  onRemove={removeItem}
                  onCheckout={checkout}
                  onGoShop={() => handleNav("shop")}
                  onNotify={notify}
                />
              )}
              {view === "settings" && (
                <SettingsScreen
                  currency={currency}
                  defaultSize={defaultSize}
                  notifications={notifications}
                  favoritesCount={favorites.length}
                  cartCount={cartCount}
                  onCurrency={setCurrency}
                  onDefaultSize={setDefaultSize}
                  onNotifications={setNotifications}
                  onResetData={resetData}
                  onNotify={notify}
                />
              )}
              {view === "product" && productId !== null && (
                <ProductScreen
                  key={productId}
                  productId={productId}
                  currency={currency}
                  defaultSize={defaultSize}
                  favorites={favorites}
                  onBack={closeProduct}
                  onOpenProduct={openProduct}
                  onToggleFavorite={toggleFavorite}
                  onAddToCart={addToCart}
                  onNotify={notify}
                />
              )}

              {/* Toast layer — anchored inside the screen above the nav. */}
              {toast && (
                <Toast key={toast.id} message={toast.text} tone={toast.tone} onDone={dismissToast} />
              )}
            </Screen>

            {/* Bottom nav — hidden when product detail is open. */}
            {view !== "product" && (
              <BottomNav
                items={NAV_ITEMS}
                activeId={view}
                onSelect={handleNav}
                variant="hard"
              />
            )}

            {/* Custom on-screen keyboard (replaces native soft keyboard) */}
            <Keyboard />
          </DeviceFrame>
        </Stage>
      </DeviceThemeProvider>
    </KeyboardProvider>
  );
}

/** A single mini-bar row in the right info panel. */
function MiniBar({
  label,
  width,
  color,
}: {
  label: string;
  width: string;
  color: string;
}) {
  return (
    <div className="mini-bar-row">
      <span className="mini-bar-label">{label}</span>
      <div className="mini-bar-track">
        <div className="mini-bar-fill" style={{ width, background: color }} />
      </div>
      <span className="mini-bar-num">•</span>
    </div>
  );
}
