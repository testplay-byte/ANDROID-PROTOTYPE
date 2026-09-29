"use client";

/**
 * stockyard / state — one context for the whole desktop console.
 *
 * Desktop state is genuinely different from a phone prototype: a detail
 * panel is open ALONGSIDE the data, rows can be multi-selected, a command
 * palette floats over everything, and a density preference rescales every
 * row app-wide. All of it lives here so any component can read or drive it.
 *
 * The interesting part is the INVENTORY, which is genuinely mutable:
 *   restock(skuId, qty, location)  → bins up, totals recomputed, a
 *                                    RECEIPT movement written, today's bar
 *                                    on the movement chart grows
 *   shipOrder(orderId)             → every line is PICKED out of the bins
 *                                    (nearest first), totals recomputed, one
 *                                    movement per line, order → shipped
 *
 * Totals are always recomputed FROM the bins (`recalc`), never patched
 * independently, so the table, the drawer and the movement log can never
 * disagree about how much of something exists.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DAILY_UNITS,
  LOCATIONS,
  MOVEMENTS,
  ORDERS,
  SKUS,
  TODAY_INDEX,
  freeStock,
  stockState,
  type Category,
  type Movement,
  type Order,
  type OrderStatus,
  type Sku,
  type StockState,
} from "../data";

export type ViewId = "inventory" | "orders" | "movement" | "settings";
export type Density = "regular" | "dense";
export type SortKey = "sku" | "name" | "onHand" | "reserved" | "free" | "reorderPoint" | "unitCost";
export type StockFilter = StockState | "all";
export type MovementFilter = "all" | "receipt" | "pick" | "adjust" | "transfer";
export type OrderFilter = "all" | "open" | "shipped" | "hold";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "inventory", label: "Inventory", hint: "Stock table, category rail, detail drawer" },
  { id: "orders", label: "Orders", hint: "Queue, status chips, mark shipped" },
  { id: "movement", label: "Movement", hint: "Stock ledger and daily units" },
  { id: "settings", label: "Settings", hint: "Theme, density, alerts, shortcuts" },
];

export interface Notifications {
  lowStock: boolean;
  backorders: boolean;
  orderAlerts: boolean;
  dailyDigest: boolean;
}

const DEFAULT_NOTIFICATIONS: Notifications = {
  lowStock: true,
  backorders: true,
  orderAlerts: false,
  dailyDigest: true,
};

const NOTIFY_KEY = "stockyard-notifications-v1";
const DENSITY_KEY = "stockyard-density";

/** Recompute the headline totals from the bins so they can never drift. */
function recalc(sku: Sku): Sku {
  return {
    ...sku,
    onHand: sku.locations.reduce((a, l) => a + l.onHand, 0),
    reserved: sku.locations.reduce((a, l) => a + l.reserved, 0),
  };
}

/** Take `qty` out of the bins, nearest location first. Returns what came
 *  from each bin so the caller can write an honest movement per bin. */
function drawDown(sku: Sku, qty: number): { index: number; taken: number }[] {
  const out: { index: number; taken: number }[] = [];
  let left = qty;
  for (let i = 0; i < sku.locations.length && left > 0; i += 1) {
    const take = Math.min(sku.locations[i].onHand, left);
    if (take <= 0) continue;
    out.push({ index: i, taken: take });
    left -= take;
  }
  return out;
}

interface StockyardState {
  /* routing */
  view: ViewId;
  go: (v: ViewId) => void;
  /* preferences */
  density: Density;
  setDensity: (d: Density) => void;
  notifications: Notifications;
  setNotification: (key: keyof Notifications, on: boolean) => void;
  /* live inventory */
  skus: Sku[];
  restock: (skuId: string, qty: number, locationIndex: number) => void;
  resetData: () => void;
  /* live orders */
  orders: Order[];
  setOrderStatus: (orderId: string, status: OrderStatus) => void;
  shipOrder: (orderId: string) => void;
  /* live ledger */
  movements: Movement[];
  dailyUnits: number[];
  /* inventory table state */
  search: string;
  setSearch: (s: string) => void;
  categoryFilter: Category | "all";
  setCategoryFilter: (c: Category | "all") => void;
  stockFilter: StockFilter;
  setStockFilter: (f: StockFilter) => void;
  sort: { key: SortKey; dir: "asc" | "desc" };
  toggleSort: (key: SortKey) => void;
  selectedSku: string | null;
  selectSku: (id: string | null) => void;
  selectedIds: string[];
  toggleRow: (id: string) => void;
  clearSelection: () => void;
  /* order queue state */
  orderFilter: OrderFilter;
  setOrderFilter: (f: OrderFilter) => void;
  selectedOrder: string | null;
  selectOrder: (id: string | null) => void;
  /* movement state */
  movementFilter: MovementFilter;
  setMovementFilter: (f: MovementFilter) => void;
  /* overlays */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
  /* derived */
  visibleSkus: Sku[];
  sku: (id: string | null) => Sku | undefined;
  order: (id: string | null) => Order | undefined;
  counts: {
    skus: number;
    units: number;
    value: number;
    low: number;
    critical: number;
    backorder: number;
    openOrders: number;
    holds: number;
    unitsToday: number;
  };
}

const Ctx = createContext<StockyardState | null>(null);

/* New movements get a stable synthetic ref + time. No Date.now: the
   prototype must render identically on every load, so "now" is a fixed
   clock reading and a running sequence number. */
let seq = 9000;
const stampClock = () => `${String(7 + (seq % 12)).padStart(2, "0")}:${String(seq % 60).padStart(2, "0")}`;

export function StockyardProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("inventory");
  const [density, setDensityState] = useState<Density>("regular");
  const [notifications, setNotifications] = useState<Notifications>(DEFAULT_NOTIFICATIONS);

  const [skus, setSkus] = useState<Sku[]>(SKUS);
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const [movements, setMovements] = useState<Movement[]>(MOVEMENTS);
  const [dailyUnits, setDailyUnits] = useState<number[]>(DAILY_UNITS);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "sku",
    dir: "asc",
  });
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [orderFilter, setOrderFilter] = useState<OrderFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const [movementFilter, setMovementFilter] = useState<MovementFilter>("all");

  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* --- preferences: density + alert switches are app-wide and remembered */
  useEffect(() => {
    try {
      const d = localStorage.getItem(DENSITY_KEY);
      if (d === "dense" || d === "regular") setDensityState(d);
      const raw = localStorage.getItem(NOTIFY_KEY);
      if (raw) setNotifications({ ...DEFAULT_NOTIFICATIONS, ...(JSON.parse(raw) as Partial<Notifications>) });
    } catch {
      /* best-effort */
    }
  }, []);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem(DENSITY_KEY, d);
    } catch {
      /* ignore */
    }
  }, []);

  const setNotification = useCallback((key: keyof Notifications, on: boolean) => {
    setNotifications((n) => {
      const next = { ...n, [key]: on };
      try {
        localStorage.setItem(NOTIFY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  /* --- hash routing (#inventory #orders #movement #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "inventory");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#inventory");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    setSelectedSku(null);
    setSelectedOrder(null);
    setSelectedIds([]);
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K palette, Esc unwinds everything --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedSku(null);
        setSelectedOrder(null);
        setSelectedIds([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  /* ------------------------------------------------------------ mutations */

  const restock = useCallback(
    (skuId: string, qty: number, locationIndex: number) => {
      if (qty <= 0) return;
      const next = seq + 1;
      seq = next;
      const ref = `MV-${next}`;
      setSkus((list) =>
        list.map((s) => {
          if (s.id !== skuId) return s;
          const locations = s.locations.map((l, i) =>
            i === locationIndex ? { ...l, onHand: l.onHand + qty } : l
          );
          return recalc({ ...s, locations });
        })
      );
      setMovements((list) => [
        {
          id: `m-new-${next}`,
          ref,
          type: "receipt",
          skuId,
          qty,
          location: LOCATIONS[locationIndex]?.code ?? "WH-A",
          reason: "Received into yard",
          when: stampClock(),
        },
        ...list,
      ]);
      setDailyUnits((d) => d.map((v, i) => (i === TODAY_INDEX ? v + qty : v)));
    },
    []
  );

  const setOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const shipOrder = useCallback(
    (orderId: string) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status === "shipped") return;

      /* Draw every line out of the bins, writing one movement per bin it
         actually touched. A working copy is threaded through the lines so
         that two lines naming the SAME SKU draw from what is left, not from
         the original figures. Reservations release with the goods. */
      const working = new Map<string, Sku>(skus.map((s) => [s.id, s]));
      const drawn = new Map<string, { index: number; taken: number }[]>();
      const lines = order.lines.map((line) => {
        const sku = working.get(line.skuId);
        if (!sku) return { ...line, moves: [] as { index: number; taken: number }[] };
        const moves = drawDown(sku, line.qty);
        drawn.set(line.skuId, moves);
        working.set(
          line.skuId,
          recalc({
            ...sku,
            locations: sku.locations.map((l, i) => {
              const taken = moves.find((m) => m.index === i)?.taken ?? 0;
              if (!taken) return l;
              return { ...l, onHand: l.onHand - taken, reserved: Math.max(0, l.reserved - taken) };
            }),
          })
        );
        return { ...line, moves };
      });

      setSkus((list) =>
        list.map((s) => {
          const moves = drawn.get(s.id);
          if (!moves) return s;
          const locations = s.locations.map((l, i) => {
            const taken = moves.find((m) => m.index === i)?.taken ?? 0;
            if (!taken) return l;
            return { ...l, onHand: l.onHand - taken, reserved: Math.max(0, l.reserved - taken) };
          });
          return recalc({ ...s, locations });
        })
      );

      const clock = stampClock();
      const entries: Movement[] = [];
      let out = 0;
      for (const line of lines) {
        for (const move of line.moves) {
          const sku = skus.find((s) => s.id === line.skuId);
          out += move.taken;
          seq += 1;
          entries.push({
            id: `m-new-${orderId}-${seq}`,
            ref: `MV-${seq}`,
            type: "pick",
            skuId: line.skuId,
            qty: -move.taken,
            location: sku?.locations[move.index]?.code ?? "WH-A",
            reason: `Despatched on ${order.ref}`,
            when: clock,
          });
        }
      }
      setMovements((list) => [...entries.reverse(), ...list]);
      setDailyUnits((d) => d.map((v, i) => (i === TODAY_INDEX ? Math.max(0, v - out) : v)));
      setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, status: "shipped" } : o)));
    },
    [orders, skus]
  );

  const resetData = useCallback(() => {
    setSkus(SKUS);
    setOrders(ORDERS);
    setMovements(MOVEMENTS);
    setDailyUnits(DAILY_UNITS);
    setSelectedIds([]);
    setSelectedSku(null);
    setSelectedOrder(null);
    notify("Yard reset to the seeded figures");
  }, [notify]);

  /* -------------------------------------------------------------- derived */

  const toggleSort = useCallback((key: SortKey) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "sku" || key === "name" ? "asc" : "desc" }
    );
  }, []);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }, []);
  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const visibleSkus = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = skus.filter(
      (s) =>
        (categoryFilter === "all" || s.category === categoryFilter) &&
        (stockFilter === "all" || stockState(s) === stockFilter) &&
        (!q ||
          s.sku.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.supplier.toLowerCase().includes(q))
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      switch (sort.key) {
        case "sku":
          return a.sku.localeCompare(b.sku) * dir;
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "onHand":
          return (a.onHand - b.onHand) * dir;
        case "reserved":
          return (a.reserved - b.reserved) * dir;
        case "free":
          return (freeStock(a) - freeStock(b)) * dir;
        case "reorderPoint":
          return (a.reorderPoint - b.reorderPoint) * dir;
        case "unitCost":
          return (a.unitCost - b.unitCost) * dir;
      }
    });
  }, [skus, search, categoryFilter, stockFilter, sort]);

  const counts = useMemo(() => {
    const value = skus.reduce((a, s) => a + s.onHand * s.unitCost, 0);
    return {
      skus: skus.length,
      units: skus.reduce((a, s) => a + s.onHand, 0),
      value,
      low: skus.filter((s) => stockState(s) === "low").length,
      critical: skus.filter((s) => stockState(s) === "critical").length,
      backorder: skus.filter((s) => stockState(s) === "backorder").length,
      openOrders: orders.filter((o) => o.status !== "shipped").length,
      holds: orders.filter((o) => o.status === "hold").length,
      unitsToday: dailyUnits[TODAY_INDEX],
    };
  }, [skus, orders, dailyUnits]);

  const value: StockyardState = {
    view,
    go,
    density,
    setDensity,
    notifications,
    setNotification,
    skus,
    restock,
    resetData,
    orders,
    setOrderStatus,
    shipOrder,
    movements,
    dailyUnits,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    sort,
    toggleSort,
    selectedSku,
    selectSku: setSelectedSku,
    selectedIds,
    toggleRow,
    clearSelection,
    orderFilter,
    setOrderFilter,
    selectedOrder,
    selectOrder: setSelectedOrder,
    movementFilter,
    setMovementFilter,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    visibleSkus,
    sku: (id) => (id ? skus.find((s) => s.id === id) : undefined),
    order: (id) => (id ? orders.find((o) => o.id === id) : undefined),
    counts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStockyard(): StockyardState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStockyard must be used within <StockyardProvider>");
  return ctx;
}

export { freeStock };
