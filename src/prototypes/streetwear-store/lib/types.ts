/** Shared types for the streetwear-store prototype. */

export type Category = "all" | "hoodies" | "tees" | "pants" | "acc";

export type Size = "S" | "M" | "L" | "XL";

export const SIZES: Size[] = ["S", "M", "L", "XL"];

/** Which token color a product's placeholder cover uses. */
export type CoverTone = "primary" | "secondary" | "tertiary" | "success" | "surface";

export interface Product {
  id: number;
  name: string;
  /** Price in USD (base). Displayed via lib/currency.ts conversion. */
  price: number;
  category: Exclude<Category, "all">;
  /** Optional badge on the card ("NEW", "LAST PAIRS", ...). */
  tag?: string;
  tone: CoverTone;
}

/** One cart line — a product in a specific size at a specific quantity. */
export interface CartItem {
  productId: number;
  size: Size;
  qty: number;
}
