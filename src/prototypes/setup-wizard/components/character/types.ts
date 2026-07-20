export type AnimationState = "idle" | "walking" | "jumping" | "waving";

export interface CharacterConfig {
  hairColor: string;
  eyeColor: string;
  outfitColor: string;
  accentColor: string;
  earType: "cat" | "bunny" | "fox";
}

export const DEFAULT_CHARACTER: CharacterConfig = {
  hairColor: "#7ec8e3",
  eyeColor: "#5c9ead",
  outfitColor: "#b3f35a",
  accentColor: "#ff9ecd",
  earType: "cat",
};

export const HAIR_COLORS = [
  "#7ec8e3", "#ff9ecd", "#ffb347", "#c8a2c8",
  "#a8e6cf", "#ff6b6b", "#ffd93d", "#b0c4de",
];

export const EYE_COLORS = [
  "#5c9ead", "#ab47bc", "#26a69a", "#ff7043",
  "#5c6bc0", "#ec407a", "#42a5f5", "#66bb6a",
];

export const OUTFIT_COLORS = [
  "#b3f35a", "#ff9ecd", "#80deea", "#ffab91",
  "#ce93d8", "#a5d6a7", "#fff176", "#90caf9",
];
