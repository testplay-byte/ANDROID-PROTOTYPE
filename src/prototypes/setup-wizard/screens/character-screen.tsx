"use client";

import type { ThemePalette } from "../lib/themes";
import type { CharacterConfig, AnimationState } from "../components/character/types";
import { HAIR_COLORS, EYE_COLORS, OUTFIT_COLORS } from "../components/character/types";
import { AnimeCharacter } from "../components/character/anime-character";

interface CharacterScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  character: CharacterConfig;
  setCharacter: (c: CharacterConfig) => void;
  palette: ThemePalette;
}

const ANIMATIONS: { id: AnimationState; label: string; icon: string }[] = [
  { id: "idle", label: "Idle", icon: "🧍" },
  { id: "walking", label: "Walk", icon: "🚶" },
  { id: "jumping", label: "Jump", icon: "🤸" },
  { id: "waving", label: "Wave", icon: "👋" },
];

const EAR_TYPES: { id: "cat" | "bunny" | "fox"; label: string }[] = [
  { id: "cat", label: "Cat" },
  { id: "bunny", label: "Bunny" },
  { id: "fox", label: "Fox" },
];

export function CharacterScreen({
  active,
  onNext,
  onBack,
  character,
  setCharacter,
  palette,
}: CharacterScreenProps) {
  const update = (patch: Partial<CharacterConfig>) => {
    setCharacter({ ...character, ...patch });
  };

  // Track selected animation for preview
  const animKey = `anim-${active}`;

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content" style={{ gap: "var(--sp-3)", overflowY: "auto", paddingBottom: "var(--sp-2)" }}>
        <h1 className="wizard-title" style={{ fontWeight: 800, fontSize: "var(--fs-h1)" }}>
          Your companion
        </h1>
        <p className="wizard-subtitle" style={{ marginBottom: "var(--sp-1)" }}>
          Customize your anime companion. She'll be by your side throughout the app.
        </p>

        {/* Character preview */}
        <div
          key={animKey}
          style={{
            width: 180,
            height: 180,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            flexShrink: 0,
            animation: "float 4s ease-in-out infinite",
          }}
        >
          <AnimeCharacter config={character} size={180} animation="idle" />
        </div>

        {/* Animation preview selector */}
        <div style={{ width: "100%", maxWidth: 300 }}>
          <p style={sectionLabelStyle}>Animation Preview</p>
          <div style={{ display: "flex", gap: "var(--sp-2)", justifyContent: "center", flexWrap: "wrap" }}>
            {ANIMATIONS.map((anim) => (
              <AnimationPreviewButton
                key={anim.id}
                label={anim.label}
                config={character}
                animation={anim.id}
                palette={palette}
              />
            ))}
          </div>
        </div>

        {/* Ear type */}
        <div style={{ width: "100%", maxWidth: 300 }}>
          <p style={sectionLabelStyle}>Ear Type</p>
          <div className="mode-toggle">
            {EAR_TYPES.map((ear) => (
              <button
                key={ear.id}
                type="button"
                className={`mode-btn ${character.earType === ear.id ? "mode-btn--active" : ""}`}
                style={character.earType === ear.id
                  ? { background: palette.primary, color: palette.onPrimary, fontWeight: 800 }
                  : { fontWeight: 600 }}
                onClick={() => update({ earType: ear.id })}
              >
                {ear.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hair color */}
        <ColorPicker
          label="Hair Color"
          colors={HAIR_COLORS}
          selected={character.hairColor}
          onSelect={(c) => update({ hairColor: c })}
          palette={palette}
        />

        {/* Eye color */}
        <ColorPicker
          label="Eye Color"
          colors={EYE_COLORS}
          selected={character.eyeColor}
          onSelect={(c) => update({ eyeColor: c })}
          palette={palette}
        />

        {/* Outfit color */}
        <ColorPicker
          label="Outfit Color"
          colors={OUTFIT_COLORS}
          selected={character.outfitColor}
          onSelect={(c) => update({ outfitColor: c })}
          palette={palette}
        />
      </div>

      <div className="wizard-actions">
        <button
          type="button"
          className="wizard-btn wizard-btn--secondary"
          onClick={onBack}
          style={{ fontWeight: 800 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{ background: palette.primary, color: palette.onPrimary, fontWeight: 800 }}
        >
          Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: "var(--fs-label)",
  fontWeight: 800,
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  margin: "0 0 var(--sp-2) 0",
};

function ColorPicker({
  label,
  colors,
  selected,
  onSelect,
  palette,
}: {
  label: string;
  colors: string[];
  selected: string;
  onSelect: (c: string) => void;
  palette: ThemePalette;
}) {
  return (
    <div style={{ width: "100%", maxWidth: 300 }}>
      <p style={sectionLabelStyle}>{label}</p>
      <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onSelect(color)}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: color,
              border: selected === color ? `3px solid ${palette.primary}` : "3px solid transparent",
              cursor: "pointer",
              transition: "border-color 0.2s, transform 0.15s",
              transform: selected === color ? "scale(1.1)" : "scale(1)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AnimationPreviewButton({
  label,
  config,
  animation,
  palette,
}: {
  label: string;
  config: CharacterConfig;
  animation: AnimationState;
  palette: ThemePalette;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "var(--r-sm)",
          background: "var(--color-surface-2)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <AnimeCharacter config={config} size={56} animation={animation} />
      </div>
      <span
        style={{
          fontSize: "var(--fs-label-s)",
          fontWeight: 700,
          color: "var(--color-text-muted)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
