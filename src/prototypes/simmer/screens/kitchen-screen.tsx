"use client";

/* simmer / screens/kitchen — the drawer at the back of the house.
   Favorites grid (persisted), the one interactive clock (chunky clay
   dial: start/pause/reset, ring drains as the countdown runs), pantry
   toggles, and the Dark/Light segmented switch (persisted by proto-kit
   DeviceThemeProvider as `simmer-theme`). */

import type { CSSProperties } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import { RecipeCard } from "../components/recipe-card";
import {
  CheckIcon,
  CloseIcon,
  HeartIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  PotIcon,
  ResetIcon,
  SunIcon,
} from "../components/icons";
import { useSimmer } from "../state/simmer-context";
import { PANTRY_ITEMS, recipeById } from "../lib/data";

function clock(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

export function KitchenScreen() {
  const { theme, setTheme } = useDeviceTheme();
  const {
    favorites,
    pantry,
    togglePantry,
    timer,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    stopTimer,
  } = useSimmer();

  const favRecipes = favorites.map(recipeById).filter((r) => r !== null);
  const timerRecipe = timer.recipeId ? recipeById(timer.recipeId) : null;
  const frac = timer.total > 0 ? timer.left / timer.total : 0;
  const CIRC = 2 * Math.PI * 56; // dial ring radius, in the svg's units

  /* quick presets feed the dial */
  const PRESETS = [
    { label: "Soft egg", s: 4 * 60 },
    { label: "Pasta", s: 8 * 60 },
    { label: "Potato", s: 20 * 60 },
    { label: "Focaccia", s: 25 * 60 },
  ];

  return (
    <section className="sm-screen">
      <header className="sm-head">
        <div className="sm-head-row">
          <span className="sm-head-kicker">Your shelf</span>
        </div>
        <h1 className="sm-head-title">Kitchen</h1>
      </header>

      <div className="sm-content">
        {/* the clay dial */}
        <div className="sm-dial-wrap sm-rise" style={{ "--stagger": 0 } as CSSProperties}>
          <div className="sm-sect-head sm-sect-head--tight">
            <h2>
              <span className="sm-sect-ico">
                <PotIcon size={15} />
              </span>
              Clay dial
            </h2>
            {timerRecipe && (
              <span className="sm-sect-n">{timerRecipe.name}</span>
            )}
          </div>

          <div className="sm-dial-row">
            <div
              className={`sm-dial${timer.running ? " sm-dial--run" : ""}${timer.left === 0 && timer.total > 0 ? " sm-dial--over" : ""}`}
              role="timer"
              aria-label={`Timer ${clock(timer.left)} remaining`}
            >
              <svg className="sm-dial-ring" viewBox="0 0 132 132" aria-hidden={true}>
                <circle className="sm-dial-track" cx="66" cy="66" r="56" />
                <circle
                  className="sm-dial-prog"
                  cx="66"
                  cy="66"
                  r="56"
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC * (1 - frac)}
                />
              </svg>
              <div className="sm-dial-face">
                <span className="sm-dial-time tnum">
                  {timer.total > 0 ? clock(timer.left) : "0:00"}
                </span>
                <span className="sm-dial-sub">
                  {timer.running ? "simmering" : timer.left === 0 && timer.total > 0 ? "ready!" : timer.total > 0 ? "paused" : "set it"}
                </span>
              </div>
            </div>

            <div className="sm-dial-side">
              <div className="sm-dial-btns">
                {timer.total === 0 ? null : timer.running ? (
                  <button type="button" className="sm-dbtn sm-dbtn--primary" onClick={pauseTimer} aria-label="Pause timer">
                    <PauseIcon size={17} />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sm-dbtn sm-dbtn--primary"
                    onClick={timer.left === 0 ? resetTimer : resumeTimer}
                    aria-label={timer.left === 0 ? "Reset timer" : "Resume timer"}
                  >
                    {timer.left === 0 ? <ResetIcon size={17} /> : <PlayIcon size={17} />}
                  </button>
                )}
                <button
                  type="button"
                  className="sm-dbtn"
                  onClick={resetTimer}
                  disabled={timer.total === 0}
                  aria-label="Reset timer"
                >
                  <ResetIcon size={15} />
                </button>
                <button
                  type="button"
                  className="sm-dbtn"
                  onClick={stopTimer}
                  disabled={timer.total === 0}
                  aria-label="Clear timer"
                >
                  <CloseIcon size={15} />
                </button>
              </div>
              <div className="sm-presets">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="sm-preset"
                    onClick={() => startTimer("preset", p.s)}
                    aria-label={`Start ${p.label} timer`}
                  >
                    <b className="tnum">{clock(p.s)}</b>
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* favorites */}
        <div className="sm-sect sm-rise" style={{ "--stagger": 1 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>
              <span className="sm-sect-ico sm-sect-ico--pink">
                <HeartIcon size={14} filled />
              </span>
              Loved recipes
            </h2>
            <span className="sm-sect-n tnum">{favRecipes.length}</span>
          </div>
          {favRecipes.length === 0 ? (
            <div className="sm-empty">
              <p>Nothing loved yet — tap the heart on any recipe card in Find or on a method screen.</p>
            </div>
          ) : (
            <div className="sm-grid">
              {favRecipes.map((r, i) => (
                <div key={r.id} className="sm-rise" style={{ "--stagger": 2 + Math.min(i, 5) } as CSSProperties}>
                  <RecipeCard recipe={r} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* pantry */}
        <div className="sm-sect sm-rise" style={{ "--stagger": 3 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>Pantry check</h2>
            <span className="sm-sect-n tnum">
              {pantry.length}/{PANTRY_ITEMS.length}
            </span>
          </div>
          <p className="sm-list-note">Tap what&apos;s on your shelf — the grid fills with clay pucks.</p>
          <div className="sm-pantry">
            {PANTRY_ITEMS.map((item) => {
              const on = pantry.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  className={`sm-puck${on ? " sm-puck--on" : ""}`}
                  onClick={() => togglePantry(item)}
                  aria-pressed={on}
                >
                  <span className="sm-puck-dot">{on && <CheckIcon size={10} />}</span>
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* theme */}
        <div className="sm-sect sm-rise" style={{ "--stagger": 4 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>Appearance</h2>
          </div>
          <div className="sm-seg" role="group" aria-label="Theme">
            <button
              type="button"
              className={`sm-seg-btn${theme === "light" ? " sm-seg-btn--on" : ""}`}
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
            >
              <SunIcon size={15} /> Light
            </button>
            <button
              type="button"
              className={`sm-seg-btn${theme === "dark" ? " sm-seg-btn--on" : ""}`}
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
            >
              <MoonIcon size={15} /> Dark
            </button>
          </div>
          <p className="sm-list-note">
            Currently molding the kitchen in <b>{theme === "dark" ? "night clay" : "day clay"}</b> — only the
            device changes; the page around it never does.
          </p>
        </div>
      </div>
    </section>
  );
}
