"use client";

/* simmer / screens/detail — the pushed recipe view.
   Its own sticky clay header with a puffy back button (not the tab
   header — chrome variety). Body: big dish, serving stepper that
   rescales every quantity live, ingredients list, method steps as
   numbered clay blobs — tapping a blob presses it in (persisted),
   and the progress pill tracks how far through the method you are. */

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { DishArt } from "../components/dish-art";
import { MetaChip, RecipeMeta } from "../components/chips";
import { BackIcon, CheckIcon, HeartIcon, MinusIcon, PlusIcon } from "../components/icons";
import { useSimmer } from "../state/simmer-context";
import { formatMinutes, formatQty, recipeById } from "../lib/data";

export function DetailScreen() {
  const {
    openRecipeId,
    openRecipe,
    favorites,
    toggleFavorite,
    doneSteps,
    toggleStep,
    startTimer,
    timer,
    showToast,
  } = useSimmer();

  const recipe = openRecipeId ? recipeById(openRecipeId) : null;
  const base = recipe?.servings ?? 2;
  const [servings, setServings] = useState(base);
  const viewKey = openRecipeId ?? "none";

  /* reset the stepper whenever a different recipe is pushed */
  const [lastKey, setLastKey] = useState(viewKey);
  if (lastKey !== viewKey) {
    setLastKey(viewKey);
    if (recipe) setServings(recipe.servings);
  }

  const done = (openRecipeId && doneSteps[openRecipeId]) || [];
  const total = recipe?.steps.length ?? 0;
  const progress = useMemo(
    () => (total ? Math.round((done.filter((d) => d < total).length / total) * 100) : 0),
    [done, total],
  );

  if (!recipe) return null;
  const fav = favorites.includes(recipe.id);

  return (
    <section className="sm-screen sm-detail" key={viewKey}>
      <header className="sm-dhead">
        <button
          type="button"
          className="sm-dback"
          onClick={() => openRecipe(null)}
          aria-label="Back"
        >
          <BackIcon size={18} />
        </button>
        <h1 className="sm-dhead-title">{recipe.name}</h1>
        <button
          type="button"
          className={`sm-dfav${fav ? " sm-dfav--on" : ""}`}
          onClick={() => {
            toggleFavorite(recipe.id);
            if (!fav) showToast(`${recipe.name} loved`, "heart");
          }}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={fav}
        >
          <HeartIcon size={16} filled={fav} />
        </button>
      </header>

      <div className="sm-content sm-content--detail">
        <div className="sm-dhero sm-rise" style={{ "--stagger": 0 } as CSSProperties}>
          <div className="sm-dhero-art">
            <DishArt recipe={recipe} big />
          </div>
          <div className="sm-dhero-chips">
            <RecipeMeta recipe={recipe} />
            <MetaChip>{recipe.category}</MetaChip>
          </div>
        </div>

        {/* servings stepper */}
        <div className="sm-stepper-wrap sm-rise" style={{ "--stagger": 1 } as CSSProperties}>
          <span className="sm-stepper-label">Servings</span>
          <div className="sm-stepper">
            <button
              type="button"
              className="sm-step-btn"
              onClick={() => setServings((s) => Math.max(1, s - 1))}
              disabled={servings <= 1}
              aria-label="Fewer servings"
            >
              <MinusIcon size={14} />
            </button>
            <span className="sm-step-num tnum">{servings}</span>
            <button
              type="button"
              className="sm-step-btn"
              onClick={() => setServings((s) => Math.min(12, s + 1))}
              disabled={servings >= 12}
              aria-label="More servings"
            >
              <PlusIcon size={14} />
            </button>
          </div>
        </div>

        {/* ingredients — quantities rescale live */}
        <div className="sm-sect sm-rise" style={{ "--stagger": 2 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>Ingredients</h2>
            <span className="sm-sect-n tnum">{recipe.ingredients.length}</span>
          </div>
          <ul className="sm-ingr">
            {recipe.ingredients.map((ing) => (
              <li key={ing.name} className="sm-ingr-row">
                <span className="sm-ingr-name">{ing.name}</span>
                <span className="sm-ingr-dashes" aria-hidden />
                <span className="sm-ingr-qty tnum">
                  {formatQty((ing.qty / base) * servings, ing.unit)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* method — numbered clay blobs, press to mark done */}
        <div className="sm-sect sm-rise" style={{ "--stagger": 3 } as CSSProperties}>
          <div className="sm-sect-head">
            <h2>Method</h2>
            <span className={`sm-prog${progress === 100 ? " sm-prog--on" : ""}`}>
              {progress === 100 && <CheckIcon size={11} />}
              <span className="tnum">
                {done.filter((d) => d < total).length}/{total}
              </span>
            </span>
          </div>
          <ol className="sm-steps">
            {recipe.steps.map((text, i) => {
              const isDone = done.includes(i);
              return (
                <li key={i}>
                  <button
                    type="button"
                    className={`sm-step${isDone ? " sm-step--done" : ""}`}
                    onClick={() => toggleStep(recipe.id, i)}
                    aria-pressed={isDone}
                  >
                    <span className="sm-step-blob tnum">{isDone ? <CheckIcon size={13} /> : i + 1}</span>
                    <span className="sm-step-text">{text}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        {/* timer hook-in */}
        <button
          type="button"
          className="sm-btn sm-btn--primary sm-dtimer sm-rise"
          style={{ "--stagger": 4 } as CSSProperties}
          onClick={() => {
            startTimer(recipe.id, recipe.minutes * 60);
            showToast(`Clay dial set for ${formatMinutes(recipe.minutes)}`, "pot");
            openRecipe(null);
          }}
          disabled={timer.recipeId === recipe.id && timer.running}
        >
          {timer.recipeId === recipe.id && timer.running
            ? "On the clock — check Kitchen"
            : "Put it on the clay dial"}
        </button>
      </div>
    </section>
  );
}
