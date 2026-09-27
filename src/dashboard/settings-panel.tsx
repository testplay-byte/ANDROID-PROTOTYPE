"use client";

/**
 * src/dashboard/settings-panel.tsx — the dashboard Settings page body.
 *
 * Lets the user configure the device chrome every prototype's StatusBar
 * renders (proto-kit/device-settings): cutout type (punch / pill / notch),
 * position (center / left) and pill size (compact / wide). Choices persist
 * to localStorage and apply live to the mini device preview here — and to
 * every prototype page on next mount (they read the same store).
 */

import { useState } from "react";
import {
  saveDeviceSettings,
  useDeviceSettings,
} from "../proto-kit/device-settings/store";
import type {
  CutoutPosition,
  CutoutType,
  PillSize,
  PunchSize,
} from "../proto-kit/device-settings/types";
import { ThemeToggle } from "./theme-toggle";

const CUTOUTS: { id: CutoutType; label: string; hint: string }[] = [
  { id: "punch", label: "Punch hole", hint: "Small centered camera dot — the Android default" },
  { id: "pill", label: "Pill", hint: "Dynamic-Island style rounded pill (iPhone)" },
  { id: "notch", label: "Notch", hint: "Classic tab hanging from the top edge (center only)" },
];

const POSITIONS: { id: CutoutPosition; label: string; hint: string }[] = [
  { id: "center", label: "Center", hint: "Clock far left, icons far right" },
  { id: "left", label: "Left", hint: "Cutout shifts left, the clock moves to clear it" },
];

const PILL_SIZES: { id: PillSize; label: string; hint: string }[] = [
  { id: "compact", label: "Compact", hint: "Narrower island — same height" },
  { id: "wide", label: "Wide", hint: "Full-width island (iPhone 14 Pro / 15 / 16)" },
];

const PUNCH_SIZES: { id: PunchSize; label: string; hint: string }[] = [
  { id: "normal", label: "Normal", hint: "The standard 13px camera dot" },
  { id: "large", label: "Large", hint: "A slightly bigger dot" },
];

export function SettingsPanel() {
  const settings = useDeviceSettings();
  const [saved, setSaved] = useState(false);

  function update(next: Partial<typeof settings>) {
    saveDeviceSettings(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  return (
    <>
      <header className="topnav">
        <div className="topnav__inner">
          <a className="brand" href="../" aria-label="ANDROID-PROTOTYPE home">
            <span className="brand__logo" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="2" width="12" height="20" rx="3" />
                <path d="M11 18h2" />
                <path d="M9 6h6" />
              </svg>
            </span>
            <span className="brand__text">
              <span className="brand__name">ANDROID-PROTOTYPE</span>
              <span className="brand__sub">device settings</span>
            </span>
          </a>
          <nav className="navpill" aria-label="Site">
            <a className="navbtn" href="../" aria-label="Back to prototypes">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span className="lbl">Back</span>
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="wrap settings">
        <section className="settings__head">
          <h1 className="settings__title">Device settings</h1>
          <p className="settings__sub">
            Configure the phone chrome used by <b>every prototype</b>: the camera
            cutout, its position, and the clock. Changes save instantly and apply
            when you open any prototype.
          </p>
        </section>

        <div className="settings__grid">
          {/* ---- Preview ---- */}
          <section className="settings__preview" aria-label="Live preview">
            <div
              className={`sp-device sp-device--${settings.cutout}`}
              data-cutout={settings.cutout}
              data-cutout-pos={settings.position}
              data-pill-size={settings.pillSize}
            >
              <div className="sp-statusbar">
                <span className="sp-time">9:41</span>
                <span className="sp-icons" aria-hidden="true">
                  <svg width="14" height="10" viewBox="0 0 15 11" fill="currentColor">
                    <path d="M7.5 0.5C4.6 0.5 1.9 1.6 0 3.3l1.2 1.2A8.8 8.8 0 0 1 7.5 2c2.3 0 4.4.8 6 2.2L14.7 3A11.5 11.5 0 0 0 7.5.5z" opacity="0.3" />
                    <path d="M7.5 3.8c-1.8 0-3.4.7-4.6 1.8l1.2 1.2A4.7 4.7 0 0 1 7.5 5.3c1.2 0 2.3.4 3.2 1.2l1.2-1.2A6.5 6.5 0 0 0 7.5 3.8z" />
                    <path d="M7.5 7.2c-.8 0-1.5.3-2 .8L7.5 11l2-2.5c-.5-.5-1.2-.8-2-.8z" />
                  </svg>
                  <svg width="15" height="10" viewBox="0 0 16 11" fill="currentColor">
                    <rect x="0" y="8" width="3" height="3" rx="0.5" />
                    <rect x="4.5" y="6" width="3" height="5" rx="0.5" />
                    <rect x="9" y="3.5" width="3" height="7.5" rx="0.5" opacity="0.3" />
                    <rect x="13.5" y="1" width="3" height="10" rx="0.5" opacity="0.3" />
                  </svg>
                  <span className="sp-batt">87%</span>
                </span>
                <span className={`sp-cutout sp-cutout--${settings.cutout} ${settings.position === "left" ? "sp-cutout--left" : ""} ${settings.cutout === "pill" && settings.position === "center" && settings.pillSize === "compact" ? "sp-cutout--compact" : ""} ${settings.cutout === "punch" && settings.punchSize === "large" ? "sp-cutout--large" : ""}`} aria-hidden="true" />
              </div>
              <div className="sp-screen">
                <div className="sp-appbar">Wallet</div>
                <div className="sp-card" />
                <div className="sp-card sp-card--short" />
                <div className="sp-nav">
                  <span className="sp-nav__dot sp-nav__dot--on" />
                  <span className="sp-nav__dot" />
                  <span className="sp-nav__dot" />
                </div>
              </div>
            </div>
            <p className="settings__hint">
              Live preview — this is how the top of every prototype will look.
              {saved && <b className="settings__saved"> Saved</b>}
            </p>
          </section>

          {/* ---- Controls ---- */}
          <section className="settings__controls">
            <fieldset className="settings__group">
              <legend>Camera cutout</legend>
              {CUTOUTS.map((c) => {
                const blocked = c.id === "notch" && settings.position === "left";
                return (
                <label key={c.id} className={`settings__opt ${settings.cutout === c.id ? "on" : ""} ${blocked ? "settings__opt--blocked" : ""}`}>
                  <input
                    type="radio"
                    name="cutout"
                    disabled={blocked}
                    checked={settings.cutout === c.id}
                    onChange={() => update({ cutout: c.id })}
                  />
                  <span className="settings__opt-dot" aria-hidden="true" />
                  <span className="settings__opt-text">
                    <span className="settings__opt-label">{c.label}</span>
                    <span className="settings__opt-hint">{blocked ? "Not available with the left position" : c.hint}</span>
                  </span>
                </label>
                );
              })}
            </fieldset>

            <fieldset className="settings__group">
              <legend>Position</legend>
              {POSITIONS.map((p) => (
                <label key={p.id} className={`settings__opt ${settings.position === p.id ? "on" : ""}`}>
                  <input
                    type="radio"
                    name="position"
                    checked={settings.position === p.id}
                    onChange={() => update({ position: p.id })}
                  />
                  <span className="settings__opt-dot" aria-hidden="true" />
                  <span className="settings__opt-text">
                    <span className="settings__opt-label">{p.label}</span>
                    <span className="settings__opt-hint">{p.hint}</span>
                  </span>
                </label>
              ))}
            </fieldset>

            {/* One size group at a time — pill size for the (center) pill,
                punch size for the punch hole; nothing for notch / left pill. */}
            {settings.cutout === "pill" && settings.position === "center" && (
              <fieldset className="settings__group">
                <legend>Pill size</legend>
                {PILL_SIZES.map((s) => (
                  <label key={s.id} className={`settings__opt ${settings.pillSize === s.id ? "on" : ""}`}>
                    <input
                      type="radio"
                      name="pillsize"
                      checked={settings.pillSize === s.id}
                      onChange={() => update({ pillSize: s.id })}
                    />
                    <span className="settings__opt-dot" aria-hidden="true" />
                    <span className="settings__opt-text">
                      <span className="settings__opt-label">{s.label}</span>
                      <span className="settings__opt-hint">{s.hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            )}

            {settings.cutout === "punch" && (
              <fieldset className="settings__group">
                <legend>Punch hole size</legend>
                {PUNCH_SIZES.map((s) => (
                  <label key={s.id} className={`settings__opt ${settings.punchSize === s.id ? "on" : ""}`}>
                    <input
                      type="radio"
                      name="punchsize"
                      checked={settings.punchSize === s.id}
                      onChange={() => update({ punchSize: s.id })}
                    />
                    <span className="settings__opt-dot" aria-hidden="true" />
                    <span className="settings__opt-text">
                      <span className="settings__opt-label">{s.label}</span>
                      <span className="settings__opt-hint">{s.hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
