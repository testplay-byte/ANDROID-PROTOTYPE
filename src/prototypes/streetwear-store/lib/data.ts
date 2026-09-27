/** Mock catalog for DROP 07. Prices in USD. */
import type { Product } from "./types";

/** Marquee items for the ticker strip (shop + cart headers). */
export const TICKER: string[] = [
  "NEW DROP",
  "FREE SHIPPING OVER $150",
  "NO RESTOCKS",
  "SS26 — DROP 07",
  "MEMBERS GET FIRST ACCESS",
];

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Boxy Heavy Hoodie",
    price: 118,
    category: "hoodies",
    tag: "NEW",
    tone: "primary",
    colorways: ["primary", "surface", "secondary"],
    desc: "480 GSM loopback fleece, cut boxy and meant to hold its shape. Screen-printed logo on the back yoke.",
    specs: [
      { label: "FABRIC", value: "480 GSM COTTON" },
      { label: "FIT", value: "BOXY — SIZE DOWN" },
      { label: "CARE", value: "COLD WASH, LINE DRY" },
    ],
  },
  {
    id: 2,
    name: "Logo Print Tee",
    price: 42,
    category: "tees",
    tone: "secondary",
    colorways: ["secondary", "primary", "surface"],
    desc: "Heavyweight 240 GSM tee with a chest patch print and drop shoulder. The one you wear every day.",
    specs: [
      { label: "FABRIC", value: "240 GSM COTTON" },
      { label: "FIT", value: "RELAXED" },
      { label: "CARE", value: "MACHINE WASH" },
    ],
  },
  {
    id: 3,
    name: "Wide Cargo Pants",
    price: 96,
    category: "pants",
    tag: "NEW",
    tone: "tertiary",
    colorways: ["tertiary", "surface"],
    desc: "Six-pocket ripstop cargo with an adjustable hem strap and a seat that sits exactly where it should.",
    specs: [
      { label: "FABRIC", value: "RIPSTOP NYLON" },
      { label: "FIT", value: "WIDE — TAPERED HEM" },
      { label: "POCKETS", value: "6 WORK POCKETS" },
    ],
    soldSizes: ["S"],
  },
  {
    id: 4,
    name: "Zip Track Jacket",
    price: 132,
    category: "hoodies",
    tone: "surface",
    colorways: ["surface", "tertiary"],
    desc: "Twill track jacket with contrast piping and a stand collar. Zip it to the chin, obviously.",
    specs: [
      { label: "FABRIC", value: "COTTON TWILL" },
      { label: "FIT", value: "ATHLETIC" },
      { label: "HARDWARE", value: "YKK TWO-WAY ZIP" },
    ],
  },
  {
    id: 5,
    name: "Grid Overshirt",
    price: 88,
    category: "tees",
    tag: "-30%",
    tone: "success",
    colorways: ["success", "surface"],
    desc: "Woven-grid overshirt that works as a light jacket. Two chest pockets, corozo buttons, zero excuses.",
    specs: [
      { label: "FABRIC", value: "GRID WEAVE" },
      { label: "FIT", value: "REGULAR — LAYER READY" },
      { label: "DETAIL", value: "COROZO BUTTONS" },
    ],
  },
  {
    id: 6,
    name: "Tactical Vest",
    price: 145,
    category: "hoodies",
    tag: "LAST UNITS",
    tone: "secondary",
    colorways: ["secondary"],
    desc: "Nine-pocket utility vest in Cordura. Once it is gone, it is gone — there is no next run.",
    specs: [
      { label: "FABRIC", value: "500D CORDURA" },
      { label: "FIT", value: "OVER EVERYTHING" },
      { label: "POCKETS", value: "9 FUNCTIONAL" },
    ],
    soldSizes: ["S", "M"],
  },
  {
    id: 7,
    name: "Painter Cap",
    price: 34,
    category: "acc",
    tone: "primary",
    colorways: ["primary", "secondary", "tertiary"],
    desc: "Five-panel painter cap with a wire brim and metal clasp. Reversible, as tradition demands.",
    specs: [
      { label: "FABRIC", value: "COTTON CANVAS" },
      { label: "SIZE", value: "ADJUSTABLE CLASP" },
      { label: "BRIM", value: "WIRED / REVERSIBLE" },
    ],
  },
  {
    id: 8,
    name: "Canvas Tote XL",
    price: 28,
    category: "acc",
    tag: "-30%",
    tone: "tertiary",
    colorways: ["tertiary", "primary"],
    desc: "18 oz canvas tote, big enough for a vinyl crate and smaller enough to pretend it is just groceries.",
    specs: [
      { label: "FABRIC", value: "18 OZ CANVAS" },
      { label: "CAPACITY", value: "20 L" },
      { label: "PRINT", value: "SCREEN-PRINTED LOGO" },
    ],
  },
  {
    id: 9,
    name: "Belt Bag Pro",
    price: 56,
    category: "acc",
    tone: "surface",
    colorways: ["surface", "secondary"],
    desc: "Hip bag with a quick-release buckle and a bottle-opener pull tab. Hands: finally free.",
    specs: [
      { label: "FABRIC", value: "COATED RIPSTOP" },
      { label: "STRAP", value: "QUICK-RELEASE" },
      { label: "EXTRA", value: "BOTTLE OPENER PULL" },
    ],
  },
  {
    id: 10,
    name: "Flare Track Pants",
    price: 104,
    category: "pants",
    soldOut: true,
    tone: "success",
    colorways: ["success"],
    desc: "Side-zip flare track pants. DROP 07 sold through in 36 hours — join the waitlist for 08.",
    specs: [
      { label: "FABRIC", value: "TECH JERSEY" },
      { label: "FIT", value: "FLARE — SIDE ZIP" },
      { label: "STATUS", value: "SOLD OUT" },
    ],
  },
];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
