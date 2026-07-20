"use client";

/**
 * setup-wizard / screens / character-screen — step 1 (after welcome).
 *
 * Lets the user customize their anime companion character:
 * - Pick a preset character
 * - Choose art style (chibi / slim / kemonomimi)
 * - Choose ear type (if kemonomimi)
 * - Choose hair color
 * - Choose eye color
 * - Live preview of the character
 */
import type { ThemePalette } from "../lib/themes";
import type { CharacterConfig, ArtStyle, EarType } from "../components/character/types";
import { CHARACTER_PRESETS, HAIR_COLORS, EYE_COLORS } from "../components/character/types";
import { AnimeCharacter } from "../components/character/anime-character";

interface CharacterScreenProps {
  active: boolean;
  onNext: () => void;
  onBack: () => void;
  character: CharacterConfig;
  setCharacter: (c: CharacterConfig) => void;
  palette: ThemePalette;
}

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

  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      <div className="wizard-content" style={{ gap: "var(--sp-3)", overflowY: "auto" }}>
        <h1 className="wizard-title" style={{ fontWeight: 800, fontSize: "var(--fs-h1)" }}>
          Meet your companion
        </h1>
        <p className="wizard-subtitle" style={{ marginBottom: "var(--sp-2)" }}>
          Customize your anime companion. She'll be with you throughout your journey.
        </p>

        {/* Character preview */}
        <div
          className="illustration"
          key={`char-${character.artStyle}-${character.hairColor}-${character.eyeColor}-${character.earType}`}
          style={{ width: 160, height: 160, flexShrink: 0 }}
        >
          <AnimeCharacter config={character} size={160} animated={true} />
        </div>

        {/* Presets */}
        <div style={{ width: "100%", maxWidth: 300 }}>
          <p
            style={{
              fontSize: "var(--fs-label)",
              fontWeight: 800,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 var(--sp-2) 0",
            }}
          >
            Presets
          </p>
          <div
            style={{
              display: "flex",
              gap: "var(--sp-2)",
              overflowX: "auto",
              scrollbarWidth: "none",
              padding: "0 0 var(--sp-1) 0",
            }}
          >
            {CHARACTER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setCharacter(preset.config)}
                style={{
                  flex: "0 0 auto",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: "var(--sp-2)",
                  borderRadius: "var(--r-sm)",
                  background:
                    character.hairColor === preset.config.hairColor &&
                    character.artStyle === preset.config.artStyle
                      ? `${palette.primary}22`
                      : "var(--color-surface-2)",
                  border: `2px solid ${
                    character.hairColor === preset.config.hairColor &&
                    character.artStyle === preset.config.artStyle
                      ? palette.primary
                      : "transparent"
                  }`,
                  cursor: "pointer",
                  transition: "border-color 0.2s, background 0.2s",
                }}
              >
                <div style={{ width: 48, height: 48 }}>
                  <AnimeCharacter config={preset.config} size={48} animated={false} />
                </div>
                <span
                  style={{
                    fontSize: "var(--fs-label-s)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                  }}
                >
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Art style */}
        <div style={{ width: "100%", maxWidth: 300 }}>
          <p
            style={{
              fontSize: "var(--fs-label)",
              fontWeight: 800,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 var(--sp-2) 0",
            }}
          >
            Art Style
          </p>
          <div className="mode-toggle">
            {(["chibi", "slim", "kemonomimi"] as ArtStyle[]).map((style) => (
              <button
                key={style}
                type="button"
                className={`mode-btn ${character.artStyle === style ? "mode-btn--active" : ""}`}
                style={
                  character.artStyle === style
                    ? { background: palette.primary, color: palette.onPrimary, fontWeight: 800 }
                    : { fontWeight: 600 }
                }
                onClick={() => update({ artStyle: style })}
              >
                {style === "chibi" ? "Chibi" : style === "slim" ? "Slim" : "Fox Girl"}
              </button>
            ))}
          </div>
        </div>

        {/* Ear type (only for kemonomimi) */}
        {character.artStyle === "kemonomimi" && (
          <div style={{ width: "100%", maxWidth: 300, animation: "fadeInUp 0.3s var(--ease-emphasized-decel)" }}>
            <p
              style={{
                fontSize: "var(--fs-label)",
                fontWeight: 800,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 var(--sp-2) 0",
              }}
            >
              Ear Type
            </p>
            <div className="mode-toggle">
              {(["fox", "cat", "bunny"] as EarType[]).map((ear) => (
                <button
                  key={ear}
                  type="button"
                  className={`mode-btn ${character.earType === ear ? "mode-btn--active" : ""}`}
                  style={
                    character.earType === ear
                      ? { background: palette.primary, color: palette.onPrimary, fontWeight: 800 }
                      : { fontWeight: 600 }
                  }
                  onClick={() => update({ earType: ear })}
                >
                  {ear === "fox" ? "Fox" : ear === "cat" ? "Cat" : "Bunny"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hair color */}
        <div style={{ width: "100%", maxWidth: 300 }}>
          <p
            style={{
              fontSize: "var(--fs-label)",
              fontWeight: 800,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 var(--sp-2) 0",
            }}
          >
            Hair Color
          </p>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            {HAIR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => update({ hairColor: color, accentColor: color })}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: color,
                  border: character.hairColor === color ? `3px solid ${palette.primary}` : "3px solid transparent",
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.15s",
                  transform: character.hairColor === color ? "scale(1.1)" : "scale(1)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Eye color */}
        <div style={{ width: "100%", maxWidth: 300 }}>
          <p
            style={{
              fontSize: "var(--fs-label)",
              fontWeight: 800,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 var(--sp-2) 0",
            }}
          >
            Eye Color
          </p>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            {EYE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => update({ eyeColor: color })}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: color,
                  border: character.eyeColor === color ? `3px solid ${palette.primary}` : "3px solid transparent",
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.15s",
                  transform: character.eyeColor === color ? "scale(1.1)" : "scale(1)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="wizard-actions">
        <button
          type="button"
          className="wizard-btn wizard-btn--secondary"
          onClick={onBack}
          style={{ fontWeight: 800 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
