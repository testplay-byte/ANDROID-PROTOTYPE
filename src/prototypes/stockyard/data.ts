/**
 * stockyard / data — deterministic demo data for the fulfilment console.
 *
 * HARDCODED ON PURPOSE. No Math.random, no Date.now, no backend: the
 * tables, the bar chart and every counter must look identical on every
 * load, exactly like the phone prototypes' seeded data.
 *
 * The one piece of arithmetic worth reading is the per-location split. A
 * SKU's `onHand` is authored once; the four bin locations are derived from
 * it with FIXED ratios and the remainder lands on the last bin, so the
 * breakdown always sums back to the total. `reserved` is derived from the
 * per-location on-hand the same way, which means every mutation in the
 * app (restock, ship) can move a single location and recompute the totals
 * without the numbers ever drifting apart.
 */

/* ------------------------------------------------------------------ types */

export type Category =
  | "Fasteners"
  | "Bearings"
  | "Hydraulics"
  | "Tooling"
  | "Electrical"
  | "Packaging"
  | "Safety";

export type UnitOfMeasure = "ea" | "box" | "m" | "pair";

/** Derived from on-hand vs the reorder point — never authored by hand. */
export type StockState = "ok" | "low" | "critical" | "backorder";

export interface Location {
  code: string;
  zone: string;
}

export interface LocationStock extends Location {
  onHand: number;
  reserved: number;
}

export interface Sku {
  id: string;
  sku: string;
  name: string;
  category: Category;
  supplier: string;
  uom: UnitOfMeasure;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  reorderQty: number;
  unitCost: number;
  leadDays: number;
  locations: LocationStock[];
}

export type OrderStatus = "queued" | "picking" | "packed" | "shipped" | "hold";
export type OrderChannel = "Web" | "Trade" | "Wholesale" | "Internal";

export interface OrderLine {
  skuId: string;
  qty: number;
}

export interface Order {
  id: string;
  ref: string;
  customer: string;
  channel: OrderChannel;
  placed: string;
  due: string;
  status: OrderStatus;
  lines: OrderLine[];
}

export type MovementType = "receipt" | "pick" | "adjust" | "transfer";

export interface Movement {
  id: string;
  ref: string;
  type: MovementType;
  skuId: string;
  qty: number; // signed: +in, −out
  location: string;
  reason: string;
  when: string;
}

/* -------------------------------------------------------------- locations */

export const LOCATIONS: Location[] = [
  { code: "WH-A", zone: "Aisle A · racks 1–6" },
  { code: "WH-B", zone: "Aisle B · racks 1–6" },
  { code: "ST-C", zone: "Cold store" },
  { code: "FN-D", zone: "Finished goods" },
];

/** How a SKU's authored on-hand total is spread across the four bins. */
const ON_HAND_SPLIT = [0.45, 0.25, 0.2, 0.1];
/** How much of each bin is already promised to an open order. */
const RESERVED_RATIO = [0.42, 0.35, 0.15, 0.08];

/* -------------------------------------------------------------- catalogues */

interface SkuSeed {
  name: string;
  category: Category;
  uom: UnitOfMeasure;
  supplier: string;
  onHand: number;
  reorderPoint: number;
  reorderQty: number;
  unitCost: number;
  leadDays: number;
}

const SKU_SEED: SkuSeed[] = [
  // -- Fasteners
  { name: "Hex bolt M10 × 45", category: "Fasteners", uom: "ea", supplier: "Kestrel Fasteners", onHand: 486, reorderPoint: 120, reorderQty: 500, unitCost: 0.42, leadDays: 7 },
  { name: "Hex nut M10 galvanised", category: "Fasteners", uom: "ea", supplier: "Kestrel Fasteners", onHand: 168, reorderPoint: 200, reorderQty: 1000, unitCost: 0.08, leadDays: 5 },
  { name: "Socket cap screw M8 × 30", category: "Fasteners", uom: "ea", supplier: "Brannock Steel", onHand: 722, reorderPoint: 150, reorderQty: 750, unitCost: 0.55, leadDays: 7 },
  { name: "Threaded rod M12 × 1 m", category: "Fasteners", uom: "m", supplier: "Brannock Steel", onHand: 0, reorderPoint: 60, reorderQty: 300, unitCost: 3.2, leadDays: 21 },
  // -- Bearings
  { name: "Tapered roller bearing 32008", category: "Bearings", uom: "ea", supplier: "Nordwell Bearings", onHand: 214, reorderPoint: 40, reorderQty: 60, unitCost: 18.4, leadDays: 14 },
  { name: "Deep groove ball 6205-2RS", category: "Bearings", uom: "ea", supplier: "Nordwell Bearings", onHand: 44, reorderPoint: 80, reorderQty: 120, unitCost: 6.75, leadDays: 14 },
  { name: "Needle roller NK 20/20", category: "Bearings", uom: "ea", supplier: "Nordwell Bearings", onHand: 52, reorderPoint: 60, reorderQty: 90, unitCost: 9.3, leadDays: 18 },
  { name: "Pillow block UCP 205", category: "Bearings", uom: "ea", supplier: "Vantage Motion", onHand: 138, reorderPoint: 25, reorderQty: 50, unitCost: 11.6, leadDays: 21 },
  // -- Hydraulics
  { name: "Hose assembly 3/8\" × 900 mm", category: "Hydraulics", uom: "ea", supplier: "Deltafluid", onHand: 176, reorderPoint: 50, reorderQty: 80, unitCost: 14.2, leadDays: 10 },
  { name: "Straight coupling 3/8\" BSP", category: "Hydraulics", uom: "ea", supplier: "Deltafluid", onHand: 96, reorderPoint: 120, reorderQty: 250, unitCost: 2.1, leadDays: 10 },
  { name: "Gear pump 2.5 cm³", category: "Hydraulics", uom: "ea", supplier: "Halbrook Hydraulics", onHand: 7, reorderPoint: 12, reorderQty: 8, unitCost: 268, leadDays: 35 },
  { name: "Relief valve 250 bar", category: "Hydraulics", uom: "ea", supplier: "Halbrook Hydraulics", onHand: 63, reorderPoint: 20, reorderQty: 20, unitCost: 34.9, leadDays: 28 },
  // -- Tooling
  { name: "Carbide end mill 8 mm 4FL", category: "Tooling", uom: "ea", supplier: "Precision Cutting Co.", onHand: 112, reorderPoint: 30, reorderQty: 40, unitCost: 22.5, leadDays: 9 },
  { name: "Tap set M4–M10", category: "Tooling", uom: "box", supplier: "Precision Cutting Co.", onHand: 47, reorderPoint: 15, reorderQty: 20, unitCost: 31, leadDays: 12 },
  { name: "Torque wrench 40–200 Nm", category: "Tooling", uom: "ea", supplier: "Rentridge Tools", onHand: 9, reorderPoint: 10, reorderQty: 12, unitCost: 74, leadDays: 16 },
  { name: "Cutting disc 125 × 1.0", category: "Tooling", uom: "box", supplier: "Rentridge Tools", onHand: 0, reorderPoint: 100, reorderQty: 200, unitCost: 0.94, leadDays: 12 },
  // -- Electrical
  { name: "Contactor 3P 25A 24 VDC", category: "Electrical", uom: "ea", supplier: "Amperline", onHand: 121, reorderPoint: 45, reorderQty: 60, unitCost: 27.8, leadDays: 11 },
  { name: "Proximity sensor M12 PNP", category: "Electrical", uom: "ea", supplier: "Amperline", onHand: 27, reorderPoint: 60, reorderQty: 80, unitCost: 38.4, leadDays: 19 },
  { name: "Cable gland M20 nylon", category: "Electrical", uom: "box", supplier: "Amperline", onHand: 615, reorderPoint: 200, reorderQty: 500, unitCost: 0.46, leadDays: 6 },
  { name: "Panel lamp 22 mm green", category: "Electrical", uom: "ea", supplier: "Vantage Motion", onHand: 71, reorderPoint: 90, reorderQty: 150, unitCost: 1.35, leadDays: 8 },
  // -- Packaging
  { name: "Carton 400 × 300 × 250", category: "Packaging", uom: "box", supplier: "Corvale Packaging", onHand: 342, reorderPoint: 120, reorderQty: 200, unitCost: 1.28, leadDays: 5 },
  { name: "Stretch film 500 mm × 300 m", category: "Packaging", uom: "box", supplier: "Corvale Packaging", onHand: 118, reorderPoint: 40, reorderQty: 60, unitCost: 8.6, leadDays: 6 },
  { name: "Void fill paper 380 mm", category: "Packaging", uom: "box", supplier: "Corvale Packaging", onHand: 88, reorderPoint: 150, reorderQty: 200, unitCost: 4.2, leadDays: 9 },
  { name: "Pallet euro 1200 × 800", category: "Packaging", uom: "ea", supplier: "Corvale Packaging", onHand: 88, reorderPoint: 25, reorderQty: 40, unitCost: 11.9, leadDays: 7 },
  // -- Safety
  { name: "Cut-resistant glove L", category: "Safety", uom: "pair", supplier: "Safehands Co.", onHand: 764, reorderPoint: 200, reorderQty: 300, unitCost: 3.4, leadDays: 6 },
  { name: "Safety glasses EN166", category: "Safety", uom: "ea", supplier: "Safehands Co.", onHand: 58, reorderPoint: 100, reorderQty: 200, unitCost: 2.15, leadDays: 8 },
  { name: "Hi-vis vest L", category: "Safety", uom: "ea", supplier: "Safehands Co.", onHand: 36, reorderPoint: 60, reorderQty: 100, unitCost: 5.6, leadDays: 10 },
  { name: "Spill kit 20 L", category: "Safety", uom: "box", supplier: "Safehands Co.", onHand: 52, reorderPoint: 15, reorderQty: 20, unitCost: 26, leadDays: 13 },
];

/* ------------------------------------------------------------ derivations */

/** Split a total across the four bins; the remainder lands on the last one. */
function splitBins(total: number): number[] {
  const out = LOCATIONS.map((_, i) => Math.round(total * ON_HAND_SPLIT[i]));
  const drift = total - out.reduce((a, b) => a + b, 0);
  out[out.length - 1] += drift;
  return out;
}

function buildLocations(onHand: number): LocationStock[] {
  const bins = splitBins(onHand);
  return LOCATIONS.map((loc, i) => ({
    ...loc,
    onHand: bins[i],
    // A bin can never promise more than it physically holds.
    reserved: Math.min(bins[i], Math.round(bins[i] * RESERVED_RATIO[i])),
  }));
}

export const SKUS: Sku[] = SKU_SEED.map((s, i) => {
  const locations = buildLocations(s.onHand);
  return {
    id: `s-${i + 1}`,
    sku: `STK-${1000 + i * 7}`,
    name: s.name,
    category: s.category,
    supplier: s.supplier,
    uom: s.uom,
    onHand: locations.reduce((a, l) => a + l.onHand, 0),
    reserved: locations.reduce((a, l) => a + l.reserved, 0),
    reorderPoint: s.reorderPoint,
    reorderQty: s.reorderQty,
    unitCost: s.unitCost,
    leadDays: s.leadDays,
    locations,
  };
});

/* ----------------------------------------------------------------- orders */

interface OrderSeed {
  ref: string;
  customer: string;
  channel: OrderChannel;
  placed: string;
  due: string;
  status: OrderStatus;
  /** [index into SKU_SEED, quantity] */
  lines: [number, number][];
}

const ORDER_SEED: OrderSeed[] = [
  { ref: "SO-4418", customer: "Halbrook Hydraulics", channel: "Trade", placed: "Sep 26", due: "Sep 29", status: "picking", lines: [[8, 12], [9, 40], [10, 2]] },
  { ref: "SO-4419", customer: "Northgate Fabrication", channel: "Trade", placed: "Sep 26", due: "Sep 29", status: "queued", lines: [[0, 240], [2, 180]] },
  { ref: "SO-4420", customer: "Verdan Retail DC", channel: "Wholesale", placed: "Sep 26", due: "Sep 30", status: "packed", lines: [[16, 24], [17, 30]] },
  { ref: "SO-4421", customer: "Aster Workshop", channel: "Web", placed: "Sep 27", due: "Sep 29", status: "queued", lines: [[13, 6], [14, 3]] },
  { ref: "SO-4422", customer: "Kestrel Rail", channel: "Internal", placed: "Sep 27", due: "Oct 01", status: "hold", lines: [[4, 20], [5, 60]] },
  { ref: "SO-4423", customer: "Marrow & Sons", channel: "Web", placed: "Sep 27", due: "Sep 30", status: "picking", lines: [[20, 120], [22, 30]] },
  { ref: "SO-4424", customer: "Deltafluid Service", channel: "Trade", placed: "Sep 28", due: "Oct 01", status: "packed", lines: [[9, 45], [10, 4]] },
  { ref: "SO-4425", customer: "Corvale Packaging", channel: "Wholesale", placed: "Sep 28", due: "Oct 02", status: "queued", lines: [[22, 40], [23, 25]] },
  { ref: "SO-4426", customer: "Pallas Assembly", channel: "Trade", placed: "Sep 28", due: "Oct 02", status: "shipped", lines: [[1, 500], [19, 300]] },
  { ref: "SO-4427", customer: "Ridgeway MRO", channel: "Web", placed: "Sep 28", due: "Oct 03", status: "queued", lines: [[24, 60], [26, 40], [27, 20]] },
  { ref: "SO-4428", customer: "Vantage Motion", channel: "Trade", placed: "Sep 28", due: "Oct 03", status: "picking", lines: [[7, 16], [18, 24]] },
  { ref: "SO-4429", customer: "Safehands Depot", channel: "Wholesale", placed: "Sep 29", due: "Oct 04", status: "queued", lines: [[25, 200], [26, 80]] },
];

export const ORDERS: Order[] = ORDER_SEED.map((o, i) => ({
  id: `o-${i + 1}`,
  ref: o.ref,
  customer: o.customer,
  channel: o.channel,
  placed: o.placed,
  due: o.due,
  status: o.status,
  lines: o.lines.map(([skuIndex, qty]) => ({ skuId: `s-${skuIndex + 1}`, qty })),
}));

/* --------------------------------------------------------------- movement */

/** [type, skuIndex, signed qty, location index, reason, when] */
const MOVEMENT_SEED: [MovementType, number, number, number, string, string][] = [
  ["receipt", 1, 1000, 0, "PO-8841 received", "07:12"],
  ["pick", 0, 240, 0, "Allocated to SO-4419", "07:48"],
  ["pick", 2, 180, 0, "Allocated to SO-4419", "07:51"],
  ["transfer", 24, 120, 3, "Replenish WH-A from FG", "08:20"],
  ["adjust", 15, -6, 1, "Cycle count variance", "08:34"],
  ["receipt", 18, 500, 0, "PO-8844 received", "09:02"],
  ["pick", 8, 12, 0, "Allocated to SO-4418", "09:15"],
  ["pick", 9, 40, 0, "Allocated to SO-4418", "09:16"],
  ["transfer", 6, 30, 2, "Bearing pulled to cold store", "09:40"],
  ["receipt", 12, 40, 0, "PO-8847 received", "10:05"],
  ["adjust", 26, -3, 0, "Damaged in handling", "10:22"],
  ["pick", 16, 24, 0, "Allocated to SO-4420", "10:40"],
  ["pick", 17, 30, 0, "Allocated to SO-4420", "10:41"],
  ["receipt", 24, 300, 0, "PO-8850 received", "11:10"],
  ["transfer", 20, 60, 1, "Consolidate cartons at pick face", "11:26"],
  ["pick", 20, 120, 0, "Allocated to SO-4423", "11:44"],
  ["adjust", 10, -1, 2, "Seal damaged on arrival", "12:03"],
  ["receipt", 21, 60, 0, "PO-8852 received", "12:30"],
  ["pick", 13, 6, 0, "Allocated to SO-4421", "13:02"],
  ["pick", 14, 3, 0, "Allocated to SO-4421", "13:03"],
  ["transfer", 4, 12, 3, "Bearings staged for despatch", "13:28"],
  ["receipt", 26, 200, 0, "PO-8855 received", "13:55"],
  ["pick", 9, 45, 0, "Allocated to SO-4424", "14:12"],
  ["pick", 10, 4, 0, "Allocated to SO-4424", "14:13"],
  ["adjust", 3, 0, 0, "Quarantined — supplier claim", "14:40"],
  ["receipt", 22, 200, 0, "PO-8857 received", "15:05"],
  ["pick", 7, 16, 0, "Allocated to SO-4428", "15:20"],
  ["pick", 18, 24, 0, "Allocated to SO-4428", "15:21"],
  ["transfer", 25, 80, 1, "PPE top-up to packing", "15:47"],
  ["adjust", 27, -4, 0, "Cycle count variance", "16:02"],
  ["receipt", 12, 20, 0, "PO-8859 received", "16:18"],
  ["pick", 22, 40, 0, "Allocated to SO-4425", "16:35"],
  ["pick", 23, 25, 0, "Allocated to SO-4425", "16:36"],
  ["adjust", 19, -2, 0, "Damaged in handling", "16:50"],
  ["transfer", 6, 18, 0, "Return from cold store", "17:06"],
  ["receipt", 0, 500, 0, "PO-8861 received", "17:24"],
];

export const MOVEMENTS: Movement[] = MOVEMENT_SEED.map((m, i) => ({
  id: `m-${i + 1}`,
  ref: `MV-${4100 + i}`,
  type: m[0],
  skuId: `s-${m[1] + 1}`,
  qty: m[2],
  location: LOCATIONS[m[3]].code,
  reason: m[4],
  when: m[5],
}));

/* ----------------------------------------------------------------- series */

/** Units moved per day, oldest first. 14 days ending "today". */
export const DAILY_LABELS = ["Sep 16", "Sep 17", "Sep 18", "Sep 19", "Sep 20", "Sep 21", "Sep 22", "Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29"];

export const DAILY_UNITS = [412, 388, 501, 344, 296, 178, 463, 590, 517, 624, 548, 671, 712, 483];

/** Index of the day new movements are written to. */
export const TODAY_INDEX = DAILY_UNITS.length - 1;

/* ---------------------------------------------------------------- helpers */

export const CATEGORIES: Category[] = [
  "Fasteners",
  "Bearings",
  "Hydraulics",
  "Tooling",
  "Electrical",
  "Packaging",
  "Safety",
];

export const ORDER_STATUSES: OrderStatus[] = ["queued", "picking", "packed", "shipped", "hold"];

export const MOVEMENT_TYPES: MovementType[] = ["receipt", "pick", "adjust", "transfer"];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  queued: "Queued",
  picking: "Picking",
  packed: "Packed",
  shipped: "Shipped",
  hold: "On hold",
};

export const MOVEMENT_TYPE_LABEL: Record<MovementType, string> = {
  receipt: "Receipt",
  pick: "Pick",
  adjust: "Adjust",
  transfer: "Transfer",
};

export const STOCK_STATE_LABEL: Record<StockState, string> = {
  ok: "In stock",
  low: "Low",
  critical: "Critical",
  backorder: "Backorder",
};

export const UOM_LABEL: Record<UnitOfMeasure, string> = {
  ea: "each",
  box: "box",
  m: "metre",
  pair: "pair",
};

/** Stock state is DERIVED, never stored — one rule, used everywhere. */
export function stockState(sku: Sku): StockState {
  if (sku.onHand <= 0) return "backorder";
  if (sku.onHand <= sku.reorderPoint * 0.6) return "critical";
  if (sku.onHand <= sku.reorderPoint) return "low";
  return "ok";
}

export const freeStock = (sku: Sku) => Math.max(0, sku.onHand - sku.reserved);
export const stockValue = (sku: Sku) => sku.onHand * sku.unitCost;
export const shortfall = (sku: Sku) => Math.max(0, sku.reorderPoint - sku.onHand);

export const money = (n: number) =>
  n >= 1000 ? `$${Math.round(n).toLocaleString("en-US")}` : `$${n.toFixed(2)}`;

export const skuById = (id: string) => SKUS.find((s) => s.id === id);
export const orderById = (id: string) => ORDERS.find((o) => o.id === id);
