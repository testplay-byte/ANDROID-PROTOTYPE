/** Mock catalog for DROP 07. Prices in USD. */
import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Boxy Heavy Hoodie",
    price: 118,
    category: "hoodies",
    tag: "NEW",
    tone: "primary",
  },
  {
    id: 2,
    name: "Logo Print Tee",
    price: 42,
    category: "tees",
    tone: "secondary",
  },
  {
    id: 3,
    name: "Wide Cargo Pants",
    price: 96,
    category: "pants",
    tag: "NEW",
    tone: "tertiary",
  },
  {
    id: 4,
    name: "Zip Track Jacket",
    price: 132,
    category: "hoodies",
    tone: "surface",
  },
  {
    id: 5,
    name: "Grid Overshirt",
    price: 88,
    category: "tees",
    tag: "-30%",
    tone: "success",
  },
  {
    id: 6,
    name: "Tactical Vest",
    price: 145,
    category: "hoodies",
    tone: "secondary",
  },
  {
    id: 7,
    name: "Painter Cap",
    price: 34,
    category: "acc",
    tone: "primary",
  },
  {
    id: 8,
    name: "Canvas Tote XL",
    price: 28,
    category: "acc",
    tag: "-30%",
    tone: "tertiary",
  },
  {
    id: 9,
    name: "Belt Bag Pro",
    price: 56,
    category: "acc",
    tone: "surface",
  },
  {
    id: 10,
    name: "Flare Track Pants",
    price: 104,
    category: "pants",
    tone: "success",
  },
];

export function getProductById(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
