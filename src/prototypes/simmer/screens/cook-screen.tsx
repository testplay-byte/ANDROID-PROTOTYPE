"use client";

/* simmer / screens/cook — the home tab.
   A rounded clay header card the content scrolls behind, a "what's
   cooking" hero with the big generative dish, and a Today's picks
   row of puffy recipe cards. */

import type { CSSProperties } from "react";
import { DishArt } from "../components/dish-art";
import { MetaChip, RecipeMeta } from "../components/chips";
import { RecipeCard } from "../components/recipe-card";
import { ChefIcon, ClockIcon, FlameIcon } from "../components/icons";
import { useSimmer } from "../state/simmer-context";
import {
  HERO_RECIPE_ID,
  TODAY_PICKS,
  formatMinutes,
  recipeById,
} from "../lib/data";

function dayLabel(): string {
  return new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

function momentGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Morning simmer";
  if (h < 16) return "Midday simmer";
  if (h < 21) return "Evening simmer";
  return "Late-night snack?";
}

export function CookScreen() {
  const { openRecipe, startTimer, showToast } = useSimmer();
  const hero = recipeById(HERO_RECIPE_ID);
  const picks = TODAY_PICKS.map(recipeById).filter((r) => r !== null);

  return (
    <section className="sm-screen">
      <header className="sm-head sm-head--cook">
        <div className="sm-head-row">
          <span className="sm-brand">
            <span className="sm-brand-mark">
              <ChefIcon size={16} />
            </span>
            Simmer
          </span>
          <span className="sm-head-date tnum">{dayLabel()}</span>
        </div>
        <h1 className="sm-head-title">{momentGreeting()}</h1>
      </header>

      <div className="sm-content">
        {hero && (
          <article className="sm-hero sm-rise" style={{ "--stagger": 0 } as CSSProperties}>
            <div className="sm-hero-art">
              <DishArt recipe={hero} big />
            </div>
            <p className="sm-hero-eyebrow">What&apos;s cooking</p>
            <h2 className="sm-hero-name">{hero.name}</h2>
            <p className="sm-hero-blurb">{hero.blurb}</p>
            <div className="sm-hero-chips">
              <RecipeMeta recipe={hero} />
              <MetaChip icon={<ClockIcon size={13} />}>
                serves <span className="tnum">{hero.servings}</span>
              </MetaChip>
            </div>
            <div className="sm-hero-actions">
              <button type="button" className="sm-btn sm-btn--primary" onClick={() => openRecipe(hero.id)}>
                Open recipe
              </button>
              <button
                type="button"
                className="sm-btn"
                onClick={() => {
                  startTimer(hero.id, hero.minutes * 60);
                  showToast(`${hero.name} on the clock — ${formatMinutes(hero.minutes)}`, "pot");
                }}
              >
                <FlameIcon size={14} /> Simmer now
              </button>
            </div>
          </article>
        )}

        <div className="sm-sect" style={{ "--stagger": 1 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>Today&apos;s picks</h2>
            <span className="sm-sect-n tnum">{picks.length}</span>
          </div>
          <div className="sm-rail">
            {picks.map((r) => (
              <RecipeCard key={r.id} recipe={r} wide />
            ))}
          </div>
        </div>

        <div className="sm-sect" style={{ "--stagger": 2 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>Kitchen rhythm</h2>
          </div>
          <div className="sm-stats">
            <div className="sm-stat">
              <b className="tnum">3</b>
              <span>meals planned</span>
            </div>
            <div className="sm-stat">
              <b className="tnum">48</b>
              <span>min at the stove</span>
            </div>
            <div className="sm-stat">
              <b className="tnum">12</b>
              <span>pantry staples</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
