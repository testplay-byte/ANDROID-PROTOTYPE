/* data — mock passes, transactions & contacts for the Wallet prototype.
   Static curated data (no RNG needed); amounts are USD cents to avoid
   float drift. Pass art is rendered from the `art` token by pass-card.tsx. */

export type PassKind = "card" | "transit" | "boarding" | "loyalty";

export interface Pass {
  id: string;
  kind: PassKind;
  name: string; // card label on the art
  holder: string;
  /** gradient endpoints for the pass art (CSS colors) */
  art: { from: string; via: string; to: string; ink: string };
  balance?: number; // cents, for payment cards
  number: string; // masked display form, e.g. "•••• 4821"
  /** iOS system tint used for the icon disc + accents */
  tint: "blue" | "green" | "orange" | "indigo" | "teal";
}

export interface Txn {
  id: string;
  passId: string;
  merchant: string;
  category: string;
  /** negative = charge, positive = payment/refund (cents) */
  amount: number;
  /** ISO date; grouping is by day label */
  date: string; // "2026-09-27"
  time: string; // "14:32"
}

export interface Contact {
  id: string;
  name: string;
  handle: string;
}

export const PASSES: Pass[] = [
  {
    id: "aurora",
    kind: "card",
    name: "Aurora Titanium",
    holder: "K Rowe",
    art: { from: "#e8eaf0", via: "#c7ccd8", to: "#9aa3b5", ink: "#3a4152" },
    balance: 8420_65,
    number: "•••• 4821",
    tint: "indigo",
  },
  {
    id: "azure",
    kind: "card",
    name: "Azure Rewards",
    holder: "K Rowe",
    art: { from: "#2c6fd8", via: "#1f4fb0", to: "#15357e", ink: "#eaf2ff" },
    balance: 3127_10,
    number: "•••• 7734",
    tint: "blue",
  },
  {
    id: "metro",
    kind: "transit",
    name: "Metro Transit",
    holder: "Express Transit",
    art: { from: "#2fb46a", via: "#1d8a4e", to: "#0f5c33", ink: "#eafff3" },
    balance: 24_50,
    number: "Card 08 41",
    tint: "green",
  },
  {
    id: "summit",
    kind: "boarding",
    name: "Summit Air · SFO → HND",
    holder: "Rowe / Gate 12",
    art: { from: "#5e5ce6", via: "#4038b8", to: "#292378", ink: "#eeecff" },
    number: "Seat 14A",
    tint: "indigo",
  },
  {
    id: "cafegrind",
    kind: "loyalty",
    name: "Café Grind Rewards",
    holder: "Member since 2024",
    art: { from: "#ff9f0a", via: "#e07800", to: "#a34e00", ink: "#fff4e5" },
    number: "★ 7 stamps",
    tint: "orange",
  },
];

export const PASS_BY_ID: Record<string, Pass> = Object.fromEntries(
  PASSES.map((p) => [p.id, p])
);

const D = (day: number) => `2026-09-${String(27 - day).padStart(2, "0")}`;

export const TXNS: Txn[] = [
  { id: "t01", passId: "cafegrind", merchant: "Café Grind", category: "Coffee", amount: -540, date: D(0), time: "08:12" },
  { id: "t02", passId: "metro", merchant: "Metro Transit", category: "Transit", amount: -275, date: D(0), time: "07:58" },
  { id: "t03", passId: "azure", merchant: "Bayside Market", category: "Groceries", amount: -6218, date: D(0), time: "18:47" },
  { id: "t04", passId: "aurora", merchant: "Nimbus Stream", category: "Subscription", amount: -1199, date: D(1), time: "21:03" },
  { id: "t05", passId: "aurora", merchant: "Refund · Vertex Store", category: "Refund", amount: 4999, date: D(1), time: "15:22" },
  { id: "t06", passId: "metro", merchant: "Metro Transit", category: "Transit", amount: -275, date: D(1), time: "08:31" },
  { id: "t07", passId: "azure", merchant: "Orbit Fuel", category: "Gas", amount: -5204, date: D(2), time: "17:40" },
  { id: "t08", passId: "aurora", merchant: "Skyline Deli", category: "Dining", amount: -1875, date: D(2), time: "12:15" },
  { id: "t09", passId: "aurora", merchant: "Salary · Studio K", category: "Payment", amount: 250000, date: D(3), time: "09:00" },
  { id: "t10", passId: "azure", merchant: "Pixel Arcade", category: "Entertainment", amount: -1500, date: D(3), time: "20:12" },
  { id: "t11", passId: "aurora", merchant: "Harbor Books", category: "Shopping", amount: -3299, date: D(4), time: "14:05" },
  { id: "t12", passId: "metro", merchant: "Metro Transit", category: "Transit", amount: -275, date: D(4), time: "08:26" },
  { id: "t13", passId: "azure", merchant: "Lumen Utilities", category: "Bills", amount: -8420, date: D(5), time: "10:00" },
  { id: "t14", passId: "aurora", merchant: "Trailhead Coffee", category: "Coffee", amount: -465, date: D(5), time: "09:18" },
  { id: "t15", passId: "cafegrind", merchant: "Café Grind", category: "Reward", amount: 0, date: D(6), time: "16:44" },
  { id: "t16", passId: "aurora", merchant: "Vertex Store", category: "Electronics", amount: -12900, date: D(6), time: "19:31" },
];

export const CONTACTS: Contact[] = [
  { id: "c1", name: "Mara Voss", handle: "@maravoss" },
  { id: "c2", name: "Dev Anand", handle: "+1 415 •• •• 22" },
  { id: "c3", name: "Lena Ortiz", handle: "@lenortiz" },
  { id: "c4", name: "Theo Park", handle: "@theopark" },
];

export function money(cents: number, opts?: { sign?: boolean }): string {
  const abs = Math.abs(cents) / 100;
  const s = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (opts?.sign) return (cents < 0 ? "−$" : cents > 0 ? "+$" : "$") + s;
  return "$" + s;
}

export function dayLabel(iso: string): string {
  if (iso === D(0)) return "Today";
  if (iso === D(1)) return "Yesterday";
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dt = new Date(y, m - 1, d);
  return `${days[dt.getDay()]}, ${months[m - 1]} ${d}`;
}
