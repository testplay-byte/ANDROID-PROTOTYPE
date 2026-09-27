"use client";

/* simmer / components/recipe-card — the puffy recipe tile.
   One component serves Find's grid, Cook's picks row (variant="wide")
   and Kitchen's favorites grid. Whole card pushes into the detail view;
   the heart is an independent press target (stopPropagation). */

import type { KeyboardEvent, MouseEvent } from "react";
import { DishArt } from "./dish-art";
import { RecipeMeta } from "./chips";
import { HeartIcon } from "./icons";
import { useSimmer } from "../state/simmer-context";
import type { Recipe } from "../lib/data";

export function RecipeCard({ recipe, wide = false }: { recipe: Recipe; wide?: boolean }) {
  const { isFavorite, toggleFavorite, openRecipe, showToast } = useSimmer();
  const fav = isFavorite(recipe.id);

  const push = () => openRecipe(recipe.id);
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      push();
    }
  };

  return (
    <article
      className={`sm-rc${wide ? " sm-rc--wide" : ""}`}
      onClick={push}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      aria-label={`${recipe.name} — open recipe`}
    >
      <div className="sm-rc-art">
        <DishArt recipe={recipe} />
      </div>
      <div className="sm-rc-body">
        <h3 className="sm-rc-name">{recipe.name}</h3>
        <p className="sm-rc-blurb">{recipe.blurb}</p>
        <div className="sm-rc-foot">
          <RecipeMeta recipe={recipe} />
          <MetaCount n={recipe.ingredients.length} />
        </div>
      </div>
      <button
        type="button"
        className={`sm-rc-fav${fav ? " sm-rc-fav--on" : ""}`}
        aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={fav}
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          toggleFavorite(recipe.id);
          if (!fav) showToast(`${recipe.name} loved`, "heart");
        }}
      >
        <HeartIcon size={16} filled={fav} />
      </button>
    </article>
  );
}

function MetaCount({ n }: { n: number }) {
  return (
    <span className="sm-chip sm-chip--meta">
      <span className="tnum">{n}</span> items
    </span>
  );
}
