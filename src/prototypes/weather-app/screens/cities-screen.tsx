"use client";

/**
 * Cities screen — glass list of saved cities with current temps.
 *
 * Tapping a city row makes it the active city (shared page state —
 * Today + Forecast follow it). The add-city row appends a new
 * prototype city (React state; not persisted). The add button gives
 * immediate visual feedback (check flash / shake on duplicate) even
 * though nothing is stored.
 */

import { useRef, useState } from "react";
import { TopBar } from "../../../proto-kit";
import {
  formatTemp,
  type CityWeather,
  type Unit,
} from "../lib/weather";
import {
  ConditionIcon,
  MapPinIcon,
  SearchIcon,
  PlusIcon,
  CheckIcon,
  ChevronRightIcon,
} from "../components/icons";
import styles from "./cities-screen.module.css";

export interface CitiesScreenProps {
  cities: CityWeather[];
  activeCityId: string;
  unit: Unit;
  onSelectCity: (id: string) => void;
  /** Returns false when the city is already in the list. */
  onAddCity: (name: string) => boolean;
}

type AddState = "idle" | "added" | "duplicate";

export function CitiesScreen({
  cities,
  activeCityId,
  unit,
  onSelectCity,
  onAddCity,
}: CitiesScreenProps) {
  const [draft, setDraft] = useState("");
  const [addState, setAddState] = useState<AddState>("idle");
  const flashTimer = useRef<number | null>(null);

  function handleAdd() {
    const name = draft.trim();
    if (!name) {
      // Empty input — nudge the row so the button still answers.
      setAddState("duplicate");
      if (flashTimer.current) window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setAddState("idle"), 700);
      return;
    }
    const ok = onAddCity(name);
    if (ok) {
      setDraft("");
      setAddState("added");
    } else {
      setAddState("duplicate");
    }
    if (flashTimer.current) window.clearTimeout(flashTimer.current);
    flashTimer.current = window.setTimeout(() => setAddState("idle"), 900);
  }

  return (
    <div className={styles.root}>
      <TopBar
        variant="center"
        title="Cities"
        leading={<MapPinIcon size={18} />}
      />

      <div className={styles.content}>
        <div className={styles.list}>
          {cities.map((c, i) => {
            const isActive = c.id === activeCityId;
            return (
              <button
                type="button"
                key={c.id}
                className={`${styles.row} ${isActive ? styles.rowActive : ""} stagger`}
                style={{ ["--stagger-i" as string]: i } as React.CSSProperties}
                onClick={() => onSelectCity(c.id)}
                aria-label={`Set ${c.name} as active city`}
                aria-pressed={isActive}
              >
                <span className={styles.icon}>
                  <ConditionIcon condition={c.condition} size={24} />
                </span>
                <span className={styles.rowText}>
                  <span className={styles.rowName}>{c.name}</span>
                  <span className={styles.rowCountry}>{c.country}</span>
                </span>
                <span className={styles.rowTemp}>
                  {formatTemp(c.tempC, unit)}
                </span>
                {isActive ? (
                  <span className={styles.activeDot} aria-hidden="true" />
                ) : (
                  <span className={styles.chevron}>
                    <ChevronRightIcon size={16} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Add-city row */}
        <div
          className={`${styles.addRow} ${addState === "duplicate" ? styles.addRowShake : ""} stagger`}
          style={{ ["--stagger-i" as string]: cities.length } as React.CSSProperties}
        >
          <span className={styles.addRowIcon}>
            {addState === "added" ? <CheckIcon size={18} /> : <SearchIcon size={18} />}
          </span>
          <input
            className={styles.input}
            type="text"
            placeholder="Add a city…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            aria-label="City name"
          />
          <button
            type="button"
            className={`${styles.addBtn} ${addState === "added" ? styles.addBtnAdded : ""}`}
            onClick={handleAdd}
            aria-label="Add city"
          >
            {addState === "added" ? <CheckIcon size={20} /> : <PlusIcon size={20} />}
          </button>
        </div>
        <p className={styles.addNote} aria-live="polite">
          {addState === "added"
            ? "City added — it is now the active city (demo data, not persisted)."
            : addState === "duplicate"
              ? "Already in your list."
              : "Added cities use demo data and reset on reload."}
        </p>
      </div>
    </div>
  );
}
