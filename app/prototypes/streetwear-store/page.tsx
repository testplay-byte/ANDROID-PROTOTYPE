"use client";

/**
 * streetwear-store / page — the prototype entry point.
 *
 * Renders the full shell:
 *   DeviceThemeProvider (light default, scoped to .device, persisted) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame (style="brutalism") → Screen → view switch + BottomNav
 *   (variant="hard"; hidden when the product detail is open).
 *
 * Cart state (product + size + qty lines) lives here and drives the
 * badge count appended to the Cart nav label ("Cart (3)").
 *
 * Hash router:
 *   #shop / #cart / #settings → that view.
 *   #product{id} → pushed detail view. Opened with history.pushState so
 *   the browser's back button closes it (popstate re-parses the hash).
 */

import { useEffect, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
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
import type { CartItem, Size } from "../../../src/prototypes/streetwear-store/lib/types";
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

export default function Page() {
  const [view, setView] = useState<ViewId>("shop");
  const [productId, setProductId] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>("USD");

  // Cart state lives here so the nav badge + all screens share it.
  const [cart, setCart] = useState<CartItem[]>([
    { productId: 2, size: "M", qty: 1 },
    { productId: 7, size: "S", qty: 2 },
  ]);
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
  function addToCart(id: number, size: Size, qty: number) {
    setCart((items) => {
      const idx = items.findIndex(
        (it) => it.productId === id && it.size === size
      );
      if (idx >= 0) {
        const next = [...items];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...items, { productId: id, size, qty }];
    });
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
      desc: "DROP 07 catalog — category chips filter a 2-col product grid. Tap a card for detail, ADD for a quick add.",
    },
    cart: {
      name: "Cart",
      desc: "Line items with qty steppers and remove, subtotal/shipping/total rows, checkout with confirmation state.",
    },
    settings: {
      name: "Settings",
      desc: "Light/dark theme, drop-alert toggle, and a USD/EUR/GBP currency switch that re-prices the whole store.",
    },
    product: {
      name: "Product detail",
      desc: "Pushed view (no nav item) — big cover, size selector, quantity stepper, ADD TO CART. Browser back closes it.",
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
    <DeviceThemeProvider storageKey="streetwear-theme" initialTheme="light">
      <Stage
        leftPanel={
          <>
            <PanelBadge>prototype</PanelBadge>
            <PanelTitle>Streetwear Store</PanelTitle>
            <PanelDesc>
              A neo-brutalist streetwear shop. Thick borders, hard offset
              shadows, zero radius, unapologetic yellow. Shop DROP 07 with a
              2-col grid, push into product detail, manage a cart with live
              badge count, and re-price everything across three currencies.
            </PanelDesc>
            <div className="tags">
              <span className="tag">Brutalism</span>
              <span className="tag">Neo-brutal</span>
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
              <MiniBar label="Add" width="100%" color="var(--color-primary)" />
              <MiniBar label="Detail" width="85%" color="var(--color-secondary)" />
              <MiniBar label="Sizes" width="70%" color="var(--color-tertiary)" />
              <MiniBar label="Checkout" width="60%" color="var(--color-success)" />
              <MiniBar label="Currency" width="45%" color="var(--color-warn)" />
            </div>

            <PanelHead>Design</PanelHead>
            <div className="kvlist">
              <div className="kvlist__row">
                <span>Style</span>
                <b>Neo-brutalism</b>
              </div>
              <div className="kvlist__row">
                <span>Borders</span>
                <b>2px + hard shadow</b>
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
                onOpenProduct={openProduct}
                onQuickAdd={(id) => addToCart(id, "M", 1)}
              />
            )}
            {view === "cart" && (
              <CartScreen
                items={cart}
                currency={currency}
                onChangeQty={changeQty}
                onRemove={removeItem}
                onCheckout={checkout}
              />
            )}
            {view === "settings" && (
              <SettingsScreen currency={currency} onCurrency={setCurrency} />
            )}
            {view === "product" && productId !== null && (
              <ProductScreen
                productId={productId}
                currency={currency}
                onBack={closeProduct}
                onAddToCart={addToCart}
              />
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
        </DeviceFrame>
      </Stage>
    </DeviceThemeProvider>
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
