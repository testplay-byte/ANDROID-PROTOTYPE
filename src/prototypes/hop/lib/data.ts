/**
 * hop / lib / data — static commerce data for the Hop food-delivery prototype.
 *
 * Everything is solid-colour driven: each cuisine owns a flat colour plane
 * and a `FoodArt` recipe (layered geometric silhouettes — bowl, disc, leaf,
 * cup). Amounts are integer cents; `money()` formats them.
 */

/* ---------- cuisines ---------- */

/** The four edge-to-edge tabs. */
export type NavTab = "home" | "search" | "orders" | "account";

export type ArtShape = "pizza" | "sushi" | "salad" | "brew";

export interface Cuisine {
  id: string;
  label: string;
  /** Solid block colour for the category tile / cuisine plane. */
  color: string;
  /** Readable foreground on `color`. */
  fg: string;
  /** Flat-art palette for this cuisine's illustrations. */
  art: { base: string; accent: string; garnish: string; plate: string };
  shape: ArtShape;
}

export const CUISINES: Cuisine[] = [
  {
    id: "pizza",
    label: "Pizza",
    color: "#e8541f",
    fg: "#ffffff",
    art: { base: "#f2b53c", accent: "#c93a22", garnish: "#3f7d4e", plate: "#8f8f8f" },
    shape: "pizza",
  },
  {
    id: "sushi",
    label: "Sushi",
    color: "#00897b",
    fg: "#ffffff",
    art: { base: "#fafafa", accent: "#f4511e", garnish: "#1c1c1c", plate: "#0e3b36" },
    shape: "sushi",
  },
  {
    id: "salad",
    label: "Salad",
    color: "#4e9a2f",
    fg: "#ffffff",
    art: { base: "#6fbf4a", accent: "#3d7a26", garnish: "#f2a618", plate: "#b0b0b0" },
    shape: "salad",
  },
  {
    id: "brews",
    label: "Brews",
    color: "#b07a1e",
    fg: "#ffffff",
    art: { base: "#e8a83c", accent: "#f7f2e6", garnish: "#8a5a12", plate: "#616161" },
    shape: "brew",
  },
];

export function cuisineById(id: string): Cuisine {
  return CUISINES.find((c) => c.id === id) ?? CUISINES[0];
}

/* ---------- restaurants ---------- */

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  tagline: string;
  rating: number; // one decimal
  minutes: number; // average delivery
  fee: number; // cents
  priceLevel: 1 | 2 | 3;
  /** Show in the "back by demand" home list. */
  hot?: boolean;
}

export const RESTAURANTS: Restaurant[] = [
  { id: "forno", name: "Forno Rosso", cuisine: "pizza", tagline: "Wood-fired, 90 seconds out of the oven", rating: 4.8, minutes: 25, fee: 199, priceLevel: 2, hot: true },
  { id: "slice", name: "Slice Club", cuisine: "pizza", tagline: "Big cheap squares, late till 2am", rating: 4.4, minutes: 32, fee: 99, priceLevel: 1, hot: true },
  { id: "kio", name: "Kio Bento", cuisine: "sushi", tagline: "Nigiri sets rolled to order", rating: 4.9, minutes: 28, fee: 249, priceLevel: 3, hot: true },
  { id: "umami", name: "Umami Bar", cuisine: "sushi", tagline: "Hand rolls + the spicy stuff", rating: 4.5, minutes: 35, fee: 149, priceLevel: 2 },
  { id: "greendoor", name: "Green Door", cuisine: "salad", tagline: "Bowls built in front of you", rating: 4.6, minutes: 20, fee: 0, priceLevel: 2, hot: true },
  { id: "plot", name: "Plot Twist", cuisine: "salad", tagline: "Fermented, crunchy, a little weird", rating: 4.3, minutes: 27, fee: 199, priceLevel: 2 },
  { id: "kettle", name: "Kettle & Hop", cuisine: "brews", tagline: "Cold pints, flat prices", rating: 4.7, minutes: 18, fee: 299, priceLevel: 1, hot: true },
  { id: "nightcap", name: "Nightcap Cellar", cuisine: "brews", tagline: "Natural wine + craft cider", rating: 4.2, minutes: 40, fee: 349, priceLevel: 3 },
];

export function restaurantById(id: string): Restaurant {
  return RESTAURANTS.find((r) => r.id === id) ?? RESTAURANTS[0];
}

/* ---------- menus ---------- */

export interface MenuOption {
  id: string;
  label: string;
  delta: number; // cents
}

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number; // cents
  /** Picks the flat art silhouette + cuisine colours for the thumbnail. */
  shape: ArtShape;
  /** One-line "popular" flag rendered as a solid amber chip. */
  star?: boolean;
  options?: MenuOption[];
}

const SIZES: MenuOption[] = [
  { id: "std", label: "Standard", delta: 0 },
  { id: "grand", label: "Grand", delta: 450 },
];

const TOPPINGS: MenuOption[] = [
  { id: "extra", label: "Extra cheese", delta: 190 },
  { id: "chili", label: "Chili oil", delta: 90 },
  { id: "basil", label: "Basil", delta: 60 },
];

const ROLLS: MenuOption[] = [
  { id: "six", label: "Six pc", delta: 0 },
  { id: "twelve", label: "Twelve pc", delta: 990 },
];

const SIDES: MenuOption[] = [
  { id: "avocado", label: "Avocado", delta: 180 },
  { id: "egg", label: "Soft egg", delta: 140 },
  { id: "seeds", label: "Seed crunch", delta: 90 },
];

const SIZES_COLD: MenuOption[] = [
  { id: "pint", label: "Pint", delta: 0 },
  { id: "tower", label: "Tower", delta: 690 },
];

export const MENUS: Record<string, MenuItem[]> = {
  forno: [
    { id: "marg", name: "Margherita", desc: "San Marzano, fior di latte, basil", price: 1350, shape: "pizza", star: true, options: TOPPINGS },
    { id: "diavola", name: "Diavola", desc: "Spicy salami, honey drizzle", price: 1620, shape: "pizza", options: TOPPINGS },
    { id: "quattro", name: "Quattro Bianchi", desc: "Four white cheeses, pepper", price: 1780, shape: "pizza", options: TOPPINGS },
    { id: "garlic", name: "Charred Garlic", desc: "Ember-roasted, olive oil dip", price: 590, shape: "salad" },
  ],
  slice: [
    { id: "square", name: "The Big Square", desc: "One foldable slab of pepperoni", price: 690, shape: "pizza", star: true, options: SIZES },
    { id: "white", name: "White Pie", desc: "Ricotta, black pepper, lemon", price: 820, shape: "pizza", options: SIZES },
    { id: "wings", name: "Dry-Rub Wings", desc: "Six, smoked paprika dust", price: 940, shape: "brew" },
    { id: "pop", name: "Corner Pop", desc: "Burnt-cheek crust bite, per order", price: 0, shape: "salad" },
  ],
  kio: [
    { id: "salmon", name: "Salmon Set", desc: "Six cut, aged soy, yuzu", price: 2200, shape: "sushi", star: true, options: ROLLS },
    { id: "una", name: "Unagi Glaze", desc: "Grilled eel, toasted nori", price: 2450, shape: "sushi", options: ROLLS },
    { id: "maki", name: "Cucumber Maki", desc: "Six clean green rolls", price: 1090, shape: "sushi", options: ROLLS },
    { id: "miso", name: "Miso Cup", desc: "Tofu, wakame, scallion", price: 540, shape: "salad" },
  ],
  umami: [
    { id: "spicytuna", name: "Spicy Tuna Roll", desc: "Sriracha mayo, scallion", price: 1490, shape: "sushi", star: true, options: ROLLS },
    { id: "avroroll", name: "Avo-Crab Roll", desc: "Snow crab, avocado", price: 1690, shape: "sushi", options: ROLLS },
    { id: "edamame", name: "Salted Edamame", desc: "In the pod, flaked salt", price: 520, shape: "salad" },
    { id: "tamago", name: "Tamago Press", desc: "Sweet omelette brick", price: 760, shape: "brew" },
  ],
  greendoor: [
    { id: "caesar", name: "Hotel Caesar", desc: "Romaine hearts, anchovy crumb", price: 1290, shape: "salad", star: true, options: SIDES },
    { id: "harvest", name: "Harvest Bowl", desc: "Quinoa, roasted squash, kale", price: 1450, shape: "salad", options: SIDES },
    { id: "slaw", name: "Cold Slaw", desc: "Fennel, apple, mustard seed", price: 980, shape: "salad", options: SIDES },
    { id: "lemonade", name: "Pressed Lemonade", desc: "Not from a carton", price: 560, shape: "brew" },
  ],
  plot: [
    { id: "beet", name: "Beet & Bufo", desc: "Smoked beet, burrata, hemp", price: 1520, shape: "salad", star: true, options: SIDES },
    { id: "kimchi", name: "Kimchi Grain", desc: "House ferment, brown rice", price: 1380, shape: "salad", options: SIDES },
    { id: "broth", name: "Miso Broth", desc: "Warm shot, shiitake", price: 480, shape: "brew" },
    { id: "cups", name: "Crudite Cups", desc: "Three dip, three crunch", price: 890, shape: "salad" },
  ],
  kettle: [
    { id: "lager", name: "Yard Lager", desc: "Crisp, cold, unbothered", price: 890, shape: "brew", star: true, options: SIZES_COLD },
    { id: "ipa", name: "Flat Tire IPA", desc: "Pine, grapefruit, bite", price: 1050, shape: "brew", options: SIZES_COLD },
    { id: "stout", name: "Night Shift Stout", desc: "Coffee, chocolate, sleep later", price: 1120, shape: "brew", options: SIZES_COLD },
    { id: "pretzel", name: "Soft Pretzel", desc: "Salt tears included", price: 640, shape: "salad" },
  ],
  nightcap: [
    { id: "orange", name: "Orange Wine", desc: "Skin contact, glass pour", price: 1390, shape: "brew", star: true, options: SIZES_COLD },
    { id: "cider", name: "Farm Cider", desc: "Dry, cloudy, apple-forward", price: 990, shape: "brew", options: SIZES_COLD },
    { id: "nat", name: "Pet-Nat Spritz", desc: "Fizzy, low-fi, fun", price: 1240, shape: "brew" },
    { id: "board", name: "Cheese Board", desc: "Three wedges, honeycomb", price: 1480, shape: "salad" },
  ],
};

export function menuFor(restaurantId: string): MenuItem[] {
  return MENUS[restaurantId] ?? [];
}

/* ---------- orders ---------- */

export const ORDER_STAGES = ["Confirmed", "Cooking", "On the way"] as const;

/** ms each stage shows before the ticker advances the live order. */
export const STAGE_MS = 9000;

/* ---------- addresses ---------- */

export interface Address {
  id: string;
  label: string;
  line: string;
  note: string;
}

export const INITIAL_ADDRESSES: Address[] = [
  { id: "home", label: "Home", line: "42 Larkspur Ln, Apt 6", note: "Buzzer is broken, text first" },
  { id: "work", label: "Work", line: "8 Foundry St, 3rd floor", note: "Front desk holds it till five" },
  { id: "gym", label: "Gym", line: "77 Cadence Ave", note: "Ask for Coach Ren" },
];

/* ---------- promos & categories ---------- */

export interface Promo {
  id: string;
  headline: string;
  sub: string;
  color: string;
  fg: string;
}

export const PROMOS: Promo[] = [
  { id: "freefee", headline: "No delivery fee", sub: "Every Green Door bowl, all week", color: "#00897b", fg: "#ffffff" },
  { id: "brews", headline: "$5 pints", sub: "Kettle & Hop, Tue\u2013Thu until close", color: "#e8541f", fg: "#ffffff" },
  { id: "late", headline: "Late-night slice", sub: "Slice Club open till 2am, free Corner Pop", color: "#b07a1e", fg: "#ffffff" },
];

/* ---------- helpers ---------- */

export function money(cents: number): string {
  const dollars = Math.floor(Math.abs(cents) / 100);
  const rem = String(Math.abs(cents) % 100).padStart(2, "0");
  return `${cents < 0 ? "\u2212" : ""}$${dollars}.${rem}`;
}

/** Rating colour band: solid chip, no stars. */
export function ratingColor(rating: number): string {
  if (rating >= 4.7) return "#00897b";
  if (rating >= 4.4) return "#4e9a2f";
  return "#b07a1e";
}
