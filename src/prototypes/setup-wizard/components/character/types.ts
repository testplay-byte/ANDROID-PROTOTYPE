/**
 * setup-wizard / components / character / types — character configuration types.
 *
 * The character system supports:
 * - 3 art styles: chibi (cute/round), slim (tall/elegant), kemonomimi (fox/cat girl)
 * - Customizable hair color, style, eye color, expression, outfit color
 * - Reusable across the wizard and future app screens
 */

export type ArtStyle = "chibi" | "slim" | "kemonomimi";
export type HairStyle = "twin_tails" | "long_flow" | "short_bob" | "ponytail";
export type EarType = "none" | "cat" | "fox" | "bunny";
export type Expression = "happy" | "waving" | "excited" | "calm" | "wink";
export type OutfitStyle = "dress" | "hoodie" | "uniform" | "casual";

export interface CharacterConfig {
  artStyle: ArtStyle;
  hairColor: string;
  hairStyle: HairStyle;
  eyeColor: string;
  skinColor: string;
  earType: EarType;
  expression: Expression;
  outfitColor: string;
  outfitStyle: OutfitStyle;
  /** Accent color (cheeks, accessories) */
  accentColor: string;
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  artStyle: "kemonomimi",
  hairColor: "#ff9ecd",
  hairStyle: "long_flow",
  eyeColor: "#4fc3f7",
  skinColor: "#ffe0d0",
  earType: "fox",
  expression: "happy",
  outfitColor: "#b3f35a",
  outfitStyle: "hoodie",
  accentColor: "#ff9ecd",
};

export interface PresetCharacter {
  name: string;
  config: CharacterConfig;
}

export const CHARACTER_PRESETS: PresetCharacter[] = [
  {
    name: "Luna",
    config: {
      artStyle: "kemonomimi",
      hairColor: "#ff9ecd",
      hairStyle: "long_flow",
      eyeColor: "#4fc3f7",
      skinColor: "#ffe0d0",
      earType: "fox",
      expression: "happy",
      outfitColor: "#b3f35a",
      outfitStyle: "hoodie",
      accentColor: "#ff9ecd",
    },
  },
  {
    name: "Sakura",
    config: {
      artStyle: "chibi",
      hairColor: "#ffb3d9",
      hairStyle: "twin_tails",
      eyeColor: "#ab47bc",
      skinColor: "#fff0e8",
      earType: "cat",
      expression: "excited",
      outfitColor: "#ffab91",
      outfitStyle: "dress",
      accentColor: "#ffb3d9",
    },
  },
  {
    name: "Yuki",
    config: {
      artStyle: "slim",
      hairColor: "#90caf9",
      hairStyle: "long_flow",
      eyeColor: "#26a69a",
      skinColor: "#ffe0d0",
      earType: "bunny",
      expression: "calm",
      outfitColor: "#80deea",
      outfitStyle: "uniform",
      accentColor: "#90caf9",
    },
  },
  {
    name: "Miko",
    config: {
      artStyle: "kemonomimi",
      hairColor: "#ffab40",
      hairStyle: "ponytail",
      eyeColor: "#ff7043",
      skinColor: "#fff0e8",
      earType: "fox",
      expression: "wink",
      outfitColor: "#ffcc80",
      outfitStyle: "casual",
      accentColor: "#ffab40",
    },
  },
];

export const HAIR_COLORS = [
  "#ff9ecd", "#ffb3d9", "#90caf9", "#ffab40",
  "#ab47bc", "#26a69a", "#ef5350", "#fff0e8",
];

export const EYE_COLORS = [
  "#4fc3f7", "#ab47bc", "#26a69a", "#ff7043",
  "#5c6bc0", "#ec407a", "#42a5f5", "#66bb6a",
];
