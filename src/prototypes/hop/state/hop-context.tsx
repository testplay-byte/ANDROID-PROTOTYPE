"use client";

/**
 * hop / state / hop-context — the single app store for Hop.
 *
 * Holds: cart (lines keyed by item+options), orders (one live order driven
 * by a 1s simulated ticker through ORDER_STAGES + past orders), favorites,
 * addresses and prefs (all persisted under `hop-prefs`), the item-detail
 * sheet target, cart-sheet visibility, and a flat toast.
 *
 * `flyToCart()` powers the "+ tap → dot flies into the cart count" motion:
 * it reads the tapped button's rect, drops a solid square at that point and
 * translates it to the tab bar's Orders slot; pure WAAPI-free CSS transform.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  INITIAL_ADDRESSES,
  ORDER_STAGES,
  STAGE_MS,
  menuFor,
  restaurantById,
  type Address,
  type MenuItem,
  type Restaurant,
} from "../lib/data";

/* ---------- types ---------- */

export interface CartLine {
  /** itemId + chosen option ids — same combo stacks, different combos split. */
  key: string;
  itemId: string;
  restaurantId: string;
  name: string;
  unitPrice: number; // base + option deltas, cents
  optionLabels: string[];
  qty: number;
}

export interface HopOrder {
  id: string;
  restaurantId: string;
  restaurantName: string;
  lines: CartLine[];
  subtotal: number;
  fee: number;
  total: number;
  /** 0..2 while live, 3 = delivered (archived into past orders). */
  stage: number;
  placedAt: number;
  live: boolean;
}

export interface HopPrefs {
  notifyOrders: boolean;
  notifyDeals: boolean;
  notifyPromos: boolean;
  defaultAddressId: string;
  paymentId: string;
  favorites: string[];
}

export interface OpenSheet {
  item: MenuItem;
  restaurant: Restaurant;
}

interface HopContextValue {
  /* cart */
  cart: CartLine[];
  cartCount: number;
  cartSubtotal: number;
  cartRestaurantId: string | null;
  addToCart: (restaurant: Restaurant, item: MenuItem, optionIds: string[]) => void;
  setQty: (key: string, qty: number) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  placeOrder: () => void;

  /* orders */
  liveOrder: HopOrder | null;
  pastOrders: HopOrder[];
  reorder: (orderId: string) => void;

  /* item sheet */
  sheet: OpenSheet | null;
  openSheet: (restaurant: Restaurant, item: MenuItem) => void;
  closeSheet: () => void;

  /* favourites / addresses / prefs */
  favorites: string[];
  toggleFavorite: (restaurantId: string) => void;
  addresses: Address[];
  prefs: HopPrefs;
  setPref: <K extends keyof HopPrefs>(key: K, value: HopPrefs[K]) => void;

  /* toast + motion */
  toast: string | null;
  showToast: (msg: string) => void;
  bump: number; // increments on every cart add — tab-bar badge pulse
}

const HopContext = createContext<HopContextValue | null>(null);

/* ---------- persistence ---------- */

const PREFS_KEY = "hop-prefs";

const DEFAULT_PREFS: HopPrefs = {
  notifyOrders: true,
  notifyDeals: true,
  notifyPromos: false,
  defaultAddressId: "home",
  paymentId: "card",
  favorites: ["kio", "greendoor"],
};

function loadPrefs(): HopPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<HopPrefs>;
    return { ...DEFAULT_PREFS, ...parsed, favorites: Array.isArray(parsed.favorites) ? parsed.favorites : DEFAULT_PREFS.favorites };
  } catch {
    return DEFAULT_PREFS;
  }
}

/* ---------- cart fly animation helper ---------- */

export function flyToCart(source: HTMLElement) {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  } catch {
    /* matchMedia unavailable */
  }
  const target = document.querySelector("[data-hop-cart-slot]") as HTMLElement | null;
  if (!target) return;
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const dot = document.createElement("span");
  dot.className = "hp-fly";
  dot.style.left = `${from.left + from.width / 2 - 7}px`;
  dot.style.top = `${from.top + from.height / 2 - 7}px`;
  document.body.appendChild(dot);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  requestAnimationFrame(() => {
    dot.style.transform = `translate(${dx}px, ${dy}px) scale(0.5)`;
    dot.style.opacity = "0";
  });
  window.setTimeout(() => dot.remove(), 320);
}

/* ---------- provider ---------- */

export function HopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [sheet, setSheet] = useState<OpenSheet | null>(null);
  const [orders, setOrders] = useState<HopOrder[]>([]);
  const [prefs, setPrefs] = useState<HopPrefs>(loadPrefs);
  const [addresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [toast, setToast] = useState<string | null>(null);
  const [bump, setBump] = useState(0);
  const toastTimer = useRef<number | undefined>(undefined);
  const orderSeq = useRef(1);

  /* persist prefs */
  useEffect(() => {
    try {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* private mode */
    }
  }, [prefs]);

  /* simulated order ticker — advance the live order every STAGE_MS */
  useEffect(() => {
    const live = orders.find((o) => o.live);
    if (!live) return;
    const id = window.setInterval(() => {
      setOrders((prev) =>
        prev.map((o) => {
          if (!o.live) return o;
          const elapsed = Date.now() - o.placedAt;
          const stage = Math.min(Math.floor(elapsed / STAGE_MS), ORDER_STAGES.length - 1);
          return { ...o, stage };
        })
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, [orders]);

  /* promote a fully-tracked order to past once it reaches "on the way" end */
  useEffect(() => {
    const done = orders.find((o) => o.live && Date.now() - o.placedAt >= STAGE_MS * (ORDER_STAGES.length - 1) + 4000);
    if (!done) return;
    setOrders((prev) => prev.map((o) => (o.id === done.id ? { ...o, live: false } : o)));
    showToast(`${done.restaurantName} arrived. Enjoy.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  const addToCart = useCallback(
    (restaurant: Restaurant, item: MenuItem, optionIds: string[]) => {
      const opts = (item.options ?? []).filter((o) => optionIds.includes(o.id));
      const unitPrice = item.price + opts.reduce((s, o) => s + o.delta, 0);
      const key = `${item.id}|${opts.map((o) => o.id).sort().join(",")}`;
      setCart((prev) => {
        const hit = prev.find((l) => l.key === key);
        if (hit) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
        return [
          ...prev,
          {
            key,
            itemId: item.id,
            restaurantId: restaurant.id,
            name: item.name,
            unitPrice,
            optionLabels: opts.map((o) => o.label),
            qty: 1,
          },
        ];
      });
      setBump((b) => b + 1);
    },
    []
  );

  const setQty = useCallback((key: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.key !== key) : prev.map((l) => (l.key === key ? { ...l, qty } : l))
    );
  }, []);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((n, l) => n + l.qty * l.unitPrice, 0), [cart]);
  const cartRestaurantId = cart.length > 0 ? cart[0].restaurantId : null;

  const placeOrder = useCallback(() => {
    if (cart.length === 0 || !cartRestaurantId) return;
    const restaurant = restaurantById(cartRestaurantId);
    const fee = cartSubtotal >= 2500 ? 0 : restaurant.fee;
    const order: HopOrder = {
      id: `hop-${Date.now()}-${orderSeq.current++}`,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      lines: cart,
      subtotal: cartSubtotal,
      fee,
      total: cartSubtotal + fee,
      stage: 0,
      placedAt: Date.now(),
      live: true,
    };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setCartOpen(false);
    showToast(`Order placed at ${restaurant.name}.`);
  }, [cart, cartRestaurantId, cartSubtotal, showToast]);

  const reorder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      setCart(order.lines.map((l) => ({ ...l })));
      setCartOpen(true);
      showToast(`${order.restaurantName} back in the cart.`);
    },
    [orders, showToast]
  );

  const openSheet = useCallback((restaurant: Restaurant, item: MenuItem) => setSheet({ restaurant, item }), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const toggleFavorite = useCallback(
    (restaurantId: string) => {
      setPrefs((p) => {
        const has = p.favorites.includes(restaurantId);
        return { ...p, favorites: has ? p.favorites.filter((f) => f !== restaurantId) : [...p.favorites, restaurantId] };
      });
    },
    []
  );

  const setPref = useCallback(<K extends keyof HopPrefs>(key: K, value: HopPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  }, []);

  const liveOrder = orders.find((o) => o.live) ?? null;
  const pastOrders = orders.filter((o) => !o.live);

  const value: HopContextValue = {
    cart,
    cartCount,
    cartSubtotal,
    cartRestaurantId,
    addToCart,
    setQty,
    cartOpen,
    setCartOpen,
    placeOrder,
    liveOrder,
    pastOrders,
    reorder,
    sheet,
    openSheet,
    closeSheet,
    favorites: prefs.favorites,
    toggleFavorite,
    addresses,
    prefs,
    setPref,
    toast,
    showToast,
    bump,
  };

  return <HopContext.Provider value={value}>{children}</HopContext.Provider>;
}

export function useHop(): HopContextValue {
  const ctx = useContext(HopContext);
  if (!ctx) throw new Error("useHop must be used within <HopProvider>");
  return ctx;
}

/** Menu lookup for reorder-time name re-resolution. */
export function itemFromLine(restaurantId: string, itemId: string): MenuItem | undefined {
  return menuFor(restaurantId).find((m) => m.id === itemId);
}
