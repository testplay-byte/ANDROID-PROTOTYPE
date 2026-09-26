/** Formatting helpers — all money uses tabular-nums in CSS. */

/** Format a signed USD amount: -42.5 → "−$42.50", 1250 → "$1,250.00". */
export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(2);
  const grouped = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${amount < 0 ? "\u2212" : ""}$${grouped}`;
}

/** Group label for a transaction date, relative to "today" (2026-09-26). */
export function dateGroupLabel(iso: string): string {
  const today = "2026-09-26";
  const yesterday = "2026-09-25";
  if (iso === today) return "Today";
  if (iso === yesterday) return "Yesterday";
  const [y, m, d] = iso.split("-").map((s) => parseInt(s, 10));
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const label = `${months[(m ?? 1) - 1]} ${d ?? ""}`;
  return y !== 2026 ? `${label}, ${y}` : label;
}
