/**
 * proto-kit / styles — the multi-design-language style layer.
 *
 * A "style" is a complete design language (color, surface, radius, shadow,
 * border and frame personality) applied to the device via a `data-style`
 * attribute. Tokens stay on `.device` so theming stays scoped (see
 * docs/theme-architecture.md) — styles never touch `:root` or `<html>`.
 *
 * Every style file MUST define the full token contract for BOTH themes:
 *   .device[data-style="X"]                     → dark/default values
 *   .device[data-style="X"][data-theme="light"] → light values
 * The contract (all required tokens) is listed in styles/index.css.
 *
 * Component variants (BottomNav, TopBar) are style-agnostic: they read
 * tokens, so style × variant combinations compose freely. Each style doc in
 * docs/design-languages/ recommends the best-matching variants.
 */

export type DeviceStyle =
  | "m3" // Material 3 Expressive (default — no data-style attribute needed)
  | "hig" // Apple Human Interface Guidelines
  | "carbon" // IBM Carbon Design System
  | "neumorph" // Neumorphism (soft UI)
  | "glass" // Glassmorphism
  | "brutalism" // Neo-brutalism
  | "clay" // Claymorphism
  | "bauhaus" // Bauhaus geometric
  | "minimal" // Minimalism / monochrome
  | "bento" // Bento grid
  | "flat" // Flat design 2.0
  | "console"; // Console — the instrument language for data + charts

/** All supported style ids — used by docs, dashboard badges and validation. */
export const DEVICE_STYLES: readonly DeviceStyle[] = [
  "m3",
  "hig",
  "carbon",
  "neumorph",
  "glass",
  "brutalism",
  "clay",
  "bauhaus",
  "minimal",
  "bento",
  "flat",
  "console",
] as const;

/** Human-readable display names for the dashboard / side panels. */
export const STYLE_LABELS: Record<DeviceStyle, string> = {
  m3: "Material 3",
  hig: "HIG (Apple)",
  carbon: "IBM Carbon",
  neumorph: "Neumorphism",
  glass: "Glassmorphism",
  brutalism: "Brutalism",
  clay: "Claymorphism",
  bauhaus: "Bauhaus",
  minimal: "Minimalism",
  bento: "Bento Grid",
  flat: "Flat Design",
  console: "Console",
};
