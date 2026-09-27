/**
 * simmer / lib/data — the recipe database + derivation helpers.
 *
 * Everything the app renders comes from here: 10 curated recipes with
 * scaling ingredients (qty per base serving + aisle for the shopping
 * list), method steps, and a small `art` descriptor each so the
 * Cook-screen dish illustration is generated from data (layered clay
 * circles/blobs in CSS) — zero bitmaps.
 */

export type Category = "breakfast" | "mains" | "soups" | "baking";
export type Aisle = "Produce" | "Dairy" | "Dry Goods" | "Pantry" | "Spice";

export interface Ingredient {
  name: string;
  /** Quantity for ONE base serving; the stepper scales it live. */
  qty: number;
  unit: string; // "", "g", "ml", "cloves", "tbsp", ...
  aisle: Aisle;
}

export type DishKind = "pan" | "bowl" | "tray" | "stack" | "pot";

export interface RecipeArt {
  kind: DishKind;
  /** Three saturated clay colors: base / highlight / accent. */
  c: [string, string, string];
  /** Extra blobs scattered on the dish (0–6). */
  dots: number;
}

export interface Recipe {
  id: string;
  name: string;
  blurb: string;
  category: Category;
  minutes: number;
  /** 1 = easy, 2 = medium, 3 = a project. */
  difficulty: 1 | 2 | 3;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  art: RecipeArt;
}

/* palettes ride the clay style: saturated but warm, readable in both
   themes (they sit on puffy surface tiles, never carry text) */
export const RECIPES: Recipe[] = [
  {
    id: "pancakes",
    name: "Buttermilk Cloud Pancakes",
    blurb: "Stack-tall, fork-tender, maple puddles optional.",
    category: "breakfast",
    minutes: 25,
    difficulty: 1,
    servings: 2,
    ingredients: [
      { name: "Flour", qty: 100, unit: "g", aisle: "Dry Goods" },
      { name: "Buttermilk", qty: 150, unit: "ml", aisle: "Dairy" },
      { name: "Egg", qty: 0.5, unit: "", aisle: "Dairy" },
      { name: "Butter", qty: 15, unit: "g", aisle: "Dairy" },
      { name: "Maple syrup", qty: 30, unit: "ml", aisle: "Pantry" },
      { name: "Baking powder", qty: 0.25, unit: "tbsp", aisle: "Spice" },
    ],
    steps: [
      "Whisk the dry things — flour, baking powder, a good pinch of salt.",
      "Loosen the buttermilk with the egg and melted butter.",
      "Fold wet into dry until just combined; lumps are forgiven.",
      "Rest the batter 10 minutes while the pan finds its heat.",
      "Pour puckets, flip when the tops go matte and dimpled.",
      "Stack high, butter the peak, drown in maple.",
    ],
    art: { kind: "stack", c: ["#f0c987", "#fae3b8", "#d98736"], dots: 4 },
  },
  {
    id: "oats",
    name: "Maple Steel-Cut Oats",
    blurb: "Nutty, chewy, an entire bowl of warm morning.",
    category: "breakfast",
    minutes: 35,
    difficulty: 1,
    servings: 2,
    ingredients: [
      { name: "Steel-cut oats", qty: 60, unit: "g", aisle: "Dry Goods" },
      { name: "Water", qty: 300, unit: "ml", aisle: "Pantry" },
      { name: "Milk", qty: 100, unit: "ml", aisle: "Dairy" },
      { name: "Maple syrup", qty: 20, unit: "ml", aisle: "Pantry" },
      { name: "Banana", qty: 0.5, unit: "", aisle: "Produce" },
      { name: "Cinnamon", qty: 0.15, unit: "tsp", aisle: "Spice" },
    ],
    steps: [
      "Bring oats and water to a bubble, then drop to a murmur.",
      "Stir twice, sneak in the milk, let it go thick and creamy.",
      "Sweeten with maple while it's still hot enough to melt.",
      "Flop banana coins on top and dust with cinnamon.",
    ],
    art: { kind: "bowl", c: ["#e8c496", "#f7e3c2", "#b57a3a"], dots: 5 },
  },
  {
    id: "shakshuka",
    name: "Skillet Shakshuka",
    blurb: "Eggs poached in a loud red pepper sauce.",
    category: "breakfast",
    minutes: 30,
    difficulty: 2,
    servings: 2,
    ingredients: [
      { name: "Tomatoes", qty: 400, unit: "g", aisle: "Pantry" },
      { name: "Egg", qty: 2, unit: "", aisle: "Dairy" },
      { name: "Bell pepper", qty: 0.5, unit: "", aisle: "Produce" },
      { name: "Onion", qty: 0.5, unit: "", aisle: "Produce" },
      { name: "Garlic", qty: 2, unit: "cloves", aisle: "Produce" },
      { name: "Paprika", qty: 0.5, unit: "tsp", aisle: "Spice" },
    ],
    steps: [
      "Soften onion and pepper in olive oil, slow and unhurried.",
      "Add garlic and paprika; stir until the pan smells toasty.",
      "Crush in the tomatoes, simmer until the sauce drags on the spoon.",
      "Make two wells, crack an egg into each, lid on.",
      "Wait for whites to set but yolks to still wobble.",
      "Tear herbs over it and bring the whole skillet to the table.",
    ],
    art: { kind: "pan", c: ["#d6513f", "#f08c6a", "#f7d9b8"], dots: 3 },
  },
  {
    id: "chicken",
    name: "Harissa Roast Chicken",
    blurb: "Charred edges, spicy underneath, weeknight-sized.",
    category: "mains",
    minutes: 55,
    difficulty: 2,
    servings: 4,
    ingredients: [
      { name: "Chicken thighs", qty: 350, unit: "g", aisle: "Dairy" },
      { name: "Harissa paste", qty: 1.5, unit: "tbsp", aisle: "Pantry" },
      { name: "Potatoes", qty: 300, unit: "g", aisle: "Produce" },
      { name: "Lemon", qty: 0.5, unit: "", aisle: "Produce" },
      { name: "Garlic", qty: 3, unit: "cloves", aisle: "Produce" },
      { name: "Olive oil", qty: 1.5, unit: "tbsp", aisle: "Pantry" },
      { name: "Cumin", qty: 0.25, unit: "tsp", aisle: "Spice" },
    ],
    steps: [
      "Crush harissa, garlic, cumin and oil into a paste.",
      "Rub it under and over the thighs; salt generously.",
      "Toss potatoes into the roasting pan to catch every drip.",
      "Roast hot — 220°C — until the skin lacquers and chars.",
      "Squeeze lemon over the whole pan and rest five minutes.",
    ],
    art: { kind: "tray", c: ["#c2620a", "#f0a35c", "#7fd8ce"], dots: 5 },
  },
  {
    id: "pasta",
    name: "Lemon Garlic Pasta",
    blurb: "Six pantry things, twenty minutes, all of them right.",
    category: "mains",
    minutes: 20,
    difficulty: 1,
    servings: 2,
    ingredients: [
      { name: "Spaghetti", qty: 180, unit: "g", aisle: "Dry Goods" },
      { name: "Garlic", qty: 3, unit: "cloves", aisle: "Produce" },
      { name: "Lemon", qty: 1, unit: "", aisle: "Produce" },
      { name: "Butter", qty: 30, unit: "g", aisle: "Dairy" },
      { name: "Parmesan", qty: 40, unit: "g", aisle: "Dairy" },
      { name: "Chili flakes", qty: 0.15, unit: "tsp", aisle: "Spice" },
    ],
    steps: [
      "Boil the pasta two minutes short of the package says.",
      "Gently sweat sliced garlic in butter with chili flakes.",
      "Emulsify a ladle of pasta water into the garlic butter.",
      "Toss the spaghetti through, off the heat, hard and fast.",
      "Lemon zest, a glug of juice, parmesan snow. Eat now.",
    ],
    art: { kind: "pot", c: ["#f0c987", "#faf0cf", "#0e8a7d"], dots: 4 },
  },
  {
    id: "grainbowl",
    name: "Smoked Salmon Grain Bowl",
    blurb: "Crunchy, creamy, salty — a bowl with opinions.",
    category: "mains",
    minutes: 15,
    difficulty: 1,
    servings: 1,
    ingredients: [
      { name: "Quinoa", qty: 80, unit: "g", aisle: "Dry Goods" },
      { name: "Smoked salmon", qty: 90, unit: "g", aisle: "Pantry" },
      { name: "Avocado", qty: 0.5, unit: "", aisle: "Produce" },
      { name: "Cucumber", qty: 0.5, unit: "", aisle: "Produce" },
      { name: "Greek yogurt", qty: 60, unit: "g", aisle: "Dairy" },
      { name: "Dill", qty: 2, unit: "sprigs", aisle: "Produce" },
      { name: "Lemon", qty: 0.25, unit: "", aisle: "Produce" },
    ],
    steps: [
      "Fluff cooked quinoa and let it cool a little.",
      "Whip yogurt with lemon zest and a torn handful of dill.",
      "Fan salmon over the grain, dot avocado and cucumber.",
      "Sauce it, crack pepper, eat with your best fork.",
    ],
    art: { kind: "bowl", c: ["#f0a6ca", "#c96f96", "#7fd8ce"], dots: 5 },
  },
  {
    id: "fajitas",
    name: "Sheet-Pan Fajitas",
    blurb: "Sizzle from the oven, no splatter on the stove.",
    category: "mains",
    minutes: 40,
    difficulty: 2,
    servings: 3,
    ingredients: [
      { name: "Chicken breast", qty: 400, unit: "g", aisle: "Dairy" },
      { name: "Bell pepper", qty: 2, unit: "", aisle: "Produce" },
      { name: "Onion", qty: 1, unit: "", aisle: "Produce" },
      { name: "Tortillas", qty: 6, unit: "", aisle: "Dry Goods" },
      { name: "Lime", qty: 1, unit: "", aisle: "Produce" },
      { name: "Smoked paprika", qty: 0.5, unit: "tsp", aisle: "Spice" },
    ],
    steps: [
      "Slice everything into long confident strips.",
      "Toss chicken and veg with oil, paprika, cumin and salt.",
      "Spread on a sheet pan — room between pieces, no crowding.",
      "Roast until the edges blacken and the peppers collapse.",
      "Squeeze lime, scoop into warm tortillas, pass the salsa.",
    ],
    art: { kind: "tray", c: ["#0e8a7d", "#7fd8ce", "#f0c987"], dots: 6 },
  },
  {
    id: "tomato soup",
    name: "Tomato Basil Velveteen",
    blurb: "The soup that turns grilled cheese into a meal.",
    category: "soups",
    minutes: 45,
    difficulty: 1,
    servings: 4,
    ingredients: [
      { name: "Tomatoes", qty: 800, unit: "g", aisle: "Pantry" },
      { name: "Onion", qty: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", qty: 2, unit: "cloves", aisle: "Produce" },
      { name: "Cream", qty: 80, unit: "ml", aisle: "Dairy" },
      { name: "Basil", qty: 6, unit: "leaves", aisle: "Produce" },
      { name: "Sugar", qty: 0.5, unit: "tsp", aisle: "Pantry" },
    ],
    steps: [
      "Sweat onion and garlic in butter until sweet, not brown.",
      "Add tomatoes and their juice, sugar, salt, a splash of water.",
      "Simmer 25 minutes while the kitchen starts smelling right.",
      "Blend smooth, stir in cream, check for salt twice.",
      "Serve with a torn basil leaf floating on each bowl.",
    ],
    art: { kind: "pot", c: ["#d6303f", "#f08c8c", "#fae3b8"], dots: 3 },
  },
  {
    id: "lentil soup",
    name: "Lemony Red Lentil Soup",
    blurb: "One pot, pantry-only, secretly very fancy.",
    category: "soups",
    minutes: 35,
    difficulty: 1,
    servings: 4,
    ingredients: [
      { name: "Red lentils", qty: 200, unit: "g", aisle: "Dry Goods" },
      { name: "Carrot", qty: 2, unit: "", aisle: "Produce" },
      { name: "Onion", qty: 1, unit: "", aisle: "Produce" },
      { name: "Garlic", qty: 2, unit: "cloves", aisle: "Produce" },
      { name: "Cumin", qty: 1, unit: "tsp", aisle: "Spice" },
      { name: "Lemon", qty: 1, unit: "", aisle: "Produce" },
    ],
    steps: [
      "Soften carrot and onion with cumin until fragrant.",
      "Rinse lentils, add them with plenty of water and a good pinch of salt.",
      "Simmer until the lentils fall apart entirely — 20 minutes.",
      "Blend half, leave the rest rustic.",
      "Kill the heat, then drown it in lemon juice.",
    ],
    art: { kind: "pot", c: ["#c2620a", "#f0c987", "#0e8a7d"], dots: 4 },
  },
  {
    id: "focaccia",
    name: "Rosemary Focaccia Fingers",
    blurb: "Olive pools, dimpled crumb, a proper afternoon project.",
    category: "baking",
    minutes: 150,
    difficulty: 3,
    servings: 6,
    ingredients: [
      { name: "Bread flour", qty: 500, unit: "g", aisle: "Dry Goods" },
      { name: "Yeast", qty: 7, unit: "g", aisle: "Dry Goods" },
      { name: "Olive oil", qty: 60, unit: "ml", aisle: "Pantry" },
      { name: "Rosemary", qty: 3, unit: "sprigs", aisle: "Produce" },
      { name: "Flaky salt", qty: 1, unit: "tsp", aisle: "Spice" },
      { name: "Water", qty: 400, unit: "ml", aisle: "Pantry" },
    ],
    steps: [
      "Mix flour, yeast, salt and water into a shaggy, sticky mass.",
      "Stretch and fold every 20 minutes, four times, with wet hands.",
      "Let it swell — an hour warm, or overnight shy in the fridge.",
      "Drench the pan in oil, flop the dough in, dimple with knuckles.",
      "Scatter rosemary and flaky salt into every dent.",
      "Bake at 220°C until deep gold and the edges pull from the pan.",
    ],
    art: { kind: "tray", c: ["#f0c987", "#7a5b2a", "#0e8a7d"], dots: 6 },
  },
];

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "breakfast", label: "Breakfast" },
  { id: "mains", label: "Mains" },
  { id: "soups", label: "Soups" },
  { id: "baking", label: "Baking" },
];

export const AISLES: Aisle[] = ["Produce", "Dairy", "Dry Goods", "Pantry", "Spice"];

export const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = {
  1: "Easy",
  2: "Medium",
  3: "Project",
};

/** Recipes the Cook screen features today. */
export const TODAY_PICKS = ["shakshuka", "pasta", "tomato soup", "focaccia"];

/** What's-cooking hero for the Cook screen. */
export const HERO_RECIPE_ID = "chicken";

export const PANTRY_ITEMS = [
  "Olive oil",
  "Flour",
  "Eggs",
  "Lemons",
  "Garlic",
  "Onions",
  "Butter",
  "Lentils",
  "Pasta",
  "Tomatoes",
  "Maple syrup",
  "Yogurt",
];

export function recipeById(id: string): Recipe | null {
  return RECIPES.find((r) => r.id === id) ?? null;
}

export function formatQty(q: number, unit: string): string {
  let n: string;
  if (unit === "g" || unit === "ml") n = String(Math.round(q));
  else if (q >= 1) n = Number.isInteger(q) ? String(q) : String(Math.round(q * 2) / 2);
  else if (Math.abs(q - 0.75) < 0.01) n = "¾";
  else if (Math.abs(q - 0.5) < 0.01) n = "½";
  else if (Math.abs(q - 0.25) < 0.01) n = "¼";
  else n = String(Math.round(q * 20) / 20);
  return unit ? `${n} ${unit}` : n;
}

export function formatMinutes(m: number): string {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h}h ${rest}m` : `${h}h`;
}

/* ---------- weekly plan + shopping list ---------- */

export const PLAN_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
export type PlanDay = (typeof PLAN_DAYS)[number];
export const PLAN_SLOTS = ["midday", "evening"] as const;
export type PlanSlot = (typeof PLAN_SLOTS)[number];

/** plan[day][slot] = recipeId | null */
export type WeekPlan = Record<PlanDay, Record<PlanSlot, string | null>>;

export const DEFAULT_PLAN: WeekPlan = {
  Mon: { midday: "lentil soup", evening: "pasta" },
  Tue: { midday: "grainbowl", evening: "tomato soup" },
  Wed: { midday: null, evening: "chicken" },
  Thu: { midday: "oats", evening: "fajitas" },
  Fri: { midday: null, evening: "shakshuka" },
};

export function planEntries(plan: WeekPlan): { day: PlanDay; slot: PlanSlot; recipe: Recipe | null }[] {
  const out: { day: PlanDay; slot: PlanSlot; recipe: Recipe | null }[] = [];
  for (const day of PLAN_DAYS) {
    for (const slot of PLAN_SLOTS) {
      out.push({ day, slot, recipe: recipeById(plan[day][slot] ?? "") });
    }
  }
  return out;
}

export interface ListLine {
  key: string; // `${aisle}::${ingredient}`
  aisle: Aisle;
  name: string;
  qty: number;
  unit: string;
}

/** Shopping list auto-derived from the whole week, grouped by aisle. */
export function shoppingList(plan: WeekPlan): Record<Aisle, ListLine[]> {
  const acc = new Map<string, ListLine>();
  for (const { recipe } of planEntries(plan)) {
    if (!recipe) continue;
    for (const ing of recipe.ingredients) {
      const key = `${ing.aisle}::${ing.name}::${ing.unit}`;
      const prev = acc.get(key);
      const need = ing.qty * recipe.servings;
      if (prev) prev.qty += need;
      else acc.set(key, { key, aisle: ing.aisle, name: ing.name, qty: need, unit: ing.unit });
    }
  }
  const grouped = {} as Record<Aisle, ListLine[]>;
  for (const a of AISLES) grouped[a] = [];
  for (const line of acc.values()) grouped[line.aisle].push(line);
  for (const a of AISLES) grouped[a].sort((x, y) => x.name.localeCompare(y.name));
  return grouped;
}
