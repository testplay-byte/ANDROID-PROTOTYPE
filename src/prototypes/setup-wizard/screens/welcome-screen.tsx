"use client";
/**
 * setup-wizard / screens / welcome-screen — step 0.
 *
 * Welcomes the user with an animated cat illustration and decorative
 * background orbs. A single "Get Started" CTA advances to the theme screen.
 */
import type { ThemePalette } from "../lib/themes";
import { Cat } from "../components/cat";

interface WelcomeScreenProps {
  active: boolean;
  onNext: () => void;
  palette: ThemePalette;
}

export function WelcomeScreen({ active, onNext, palette }: WelcomeScreenProps) {
  return (
    <div className={`wizard-step ${active ? "wizard-step--active" : ""}`}>
      {/* Decorative blurred background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div
          className="bg-orb"
          style={{
            width: 180, height: 180, top: "10%", left: "5%",
            background: palette.primary,
            animationDelay: "0s",
          }}
        />
        <div
          className="bg-orb"
          style={{
            width: 140, height: 140, bottom: "15%", right: "8%",
            background: palette.primary,
            animationDelay: "2s",
          }}
        />
      </div>

      <div className="wizard-content" style={{ position: "relative", zIndex: 1 }}>
        {/* Cat illustration */}
        <div className="illustration" key={active ? "on" : "off"}>
          <Cat size={200} />
        </div>

        {/* Title */}
        <h1 className="wizard-title" style={{ fontWeight: 800 }}>
          Welcome to Anime App!
        </h1>

        {/* Subtitle */}
        <p className="wizard-subtitle">
          Let's set up your anime library in just a few steps. Your furry companion will guide you along the way.
        </p>
      </div>

      <div className="wizard-actions">
        {/* Single CTA — no back button on first screen */}
        <button
          type="button"
          className="wizard-btn wizard-btn--primary"
          onClick={onNext}
          style={{
            background: palette.primary,
            color: palette.onPrimary,
            fontWeight: 800,
          }}
        >
          Get Started
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
