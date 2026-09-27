"use client";

/**
 * SettingsScreen — brutalist slab header (segmented band, no TopBar),
 * theme LIGHT/DARK, drop-alert switch, currency, default size picker,
 * and a RESET DATA action. All preferences persist via page.tsx.
 */

import { useState } from "react";
import { useDeviceTheme } from "../../../proto-kit";
import type { AppTheme } from "../../../proto-kit";
import { BrutalSwitch } from "../components/brutal-switch";
import { CURRENCIES } from "../lib/currency";
import type { Currency } from "../lib/currency";
import { SIZES } from "../lib/types";
import type { Size } from "../lib/types";
import styles from "./settings-screen.module.css";

export function SettingsScreen({
  currency,
  defaultSize,
  notifications,
  favoritesCount,
  cartCount,
  onCurrency,
  onDefaultSize,
  onNotifications,
  onResetData,
  onNotify,
}: {
  currency: Currency;
  defaultSize: Size;
  notifications: boolean;
  favoritesCount: number;
  cartCount: number;
  onCurrency: (c: Currency) => void;
  onDefaultSize: (s: Size) => void;
  onNotifications: (v: boolean) => void;
  onResetData: () => void;
  onNotify: (msg: string, tone?: "ink" | "flame") => void;
}) {
  const { theme, setTheme } = useDeviceTheme();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className={styles.root}>
      {/* ---- Slab header: segmented band instead of a title bar ---- */}
      <header className={styles.header}>
        <span className={styles.headerTitle}>SETTINGS</span>
        <span className={styles.headerTag}>v1.1</span>
      </header>

      <div className={styles.content}>
        {/* ---- Store stats strip ---- */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{String(favoritesCount).padStart(2, "0")}</span>
            <span className={styles.statLabel}>SAVED</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{String(cartCount).padStart(2, "0")}</span>
            <span className={styles.statLabel}>IN CART</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{defaultSize}</span>
            <span className={styles.statLabel}>MY SIZE</span>
          </div>
        </div>

        {/* ---- Appearance ---- */}
        <span className={styles.groupLabel}>APPEARANCE</span>
        <div className={styles.group}>
          <span className={styles.groupTitle}>Theme</span>
          <div className={styles.segmented}>
            {(["light", "dark"] as AppTheme[]).map((t) => (
              <button
                key={t}
                type="button"
                className={`${styles.segmentBtn} ${theme === t ? styles.segmentBtnActive : ""}`}
                onClick={() => setTheme(t)}
                aria-pressed={theme === t}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Shopping prefs ---- */}
        <span className={styles.groupLabel}>SHOPPING</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Drop alerts</span>
              <span className={styles.rowDesc}>Ping me when a new drop goes live</span>
            </div>
            <BrutalSwitch
              on={notifications}
              onToggle={() => {
                onNotifications(!notifications);
                onNotify(notifications ? "ALERTS OFF" : "ALERTS ON");
              }}
              label="Drop alerts"
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Default size</span>
              <span className={styles.rowDesc}>Pre-selected on cards and detail</span>
            </div>
          </div>
          <div className={styles.segmented}>
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={`${styles.segmentBtn} ${defaultSize === s ? styles.segmentBtnActive : ""}`}
                onClick={() => onDefaultSize(s)}
                aria-pressed={defaultSize === s}
              >
                {s}
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Display currency</span>
              <span className={styles.rowDesc}>Prices convert instantly across the store</span>
            </div>
          </div>
          <div className={styles.segmented}>
            {CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`${styles.segmentBtn} ${currency === c ? styles.segmentBtnActive : ""}`}
                onClick={() => onCurrency(c)}
                aria-pressed={currency === c}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ---- Data ---- */}
        <span className={styles.groupLabel}>DATA</span>
        <div className={styles.group}>
          <div className={styles.row}>
            <div className={styles.rowInfo}>
              <span className={styles.rowTitle}>Reset saved + cart</span>
              <span className={styles.rowDesc}>Clears favorites, cart and preferences</span>
            </div>
            {confirmReset ? (
              <button
                type="button"
                className={styles.confirmBtn}
                onClick={() => {
                  onResetData();
                  setConfirmReset(false);
                  onNotify("DATA WIPED", "flame");
                }}
              >
                SURE?
              </button>
            ) : (
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => {
                  setConfirmReset(true);
                  window.setTimeout(() => setConfirmReset(false), 2500);
                }}
              >
                RESET
              </button>
            )}
          </div>
        </div>

        {/* ---- About ---- */}
        <span className={styles.groupLabel}>ABOUT</span>
        <div className={styles.about}>
          <span className={styles.aboutName}>DROP 07 STORE</span>
          <span className={styles.aboutMeta}>v1.1 · NEO-BRUTALISM · MOCK CATALOG</span>
          <span className={styles.aboutMeta}>0 RADIUS · 2PX INK · HARD SHADOW</span>
        </div>
      </div>
    </div>
  );
}
