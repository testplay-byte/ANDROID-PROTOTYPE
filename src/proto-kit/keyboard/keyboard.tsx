"use client";

/**
 * proto-kit / keyboard / keyboard — on-screen QWERTY keyboard.
 *
 * Replaces the native soft keyboard. Slides up from the bottom of the device
 * when an input is focused. 5-row layout:
 *   1. Numbers (1-0)
 *   2. QWERTYUIOP
 *   3. ASDFGHJKL
 *   4. Shift + ZXCVBNM + Backspace
 *   5. Space (wide) + Enter
 *
 * No emoji, no autocorrect bar — just the essential keys.
 *
 * Key press uses onMouseDown + preventDefault to keep the input focused
 * while typing (prevents blur on tap).
 *
 * Shift toggles uppercase/lowercase. Tapping a letter after shift returns
 * to lowercase (like mobile keyboards).
 */

import { useState, useCallback } from "react";
import { useKeyboard } from "./keyboard-context";
import styles from "./keyboard.module.css";

const ROW1 = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const ROW2 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const ROW3 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const ROW4 = ["z", "x", "c", "v", "b", "n", "m"];

export function Keyboard() {
  const { target, press, backspace, enter, deactivate } = useKeyboard();
  const [shifted, setShifted] = useState(false);

  const active = target !== null;

  const handleKey = useCallback(
    (key: string) => {
      press(shifted ? key.toUpperCase() : key);
      // After typing a letter with shift on, turn shift off (like mobile).
      if (shifted) setShifted(false);
    },
    [press, shifted],
  );

  const handleShift = useCallback(() => {
    setShifted((s) => !s);
  }, []);

  const handleBackspace = useCallback(() => {
    backspace();
  }, [backspace]);

  const handleEnter = useCallback(() => {
    enter();
  }, [enter]);

  const handleClose = useCallback(() => {
    deactivate();
  }, [deactivate]);

  // Prevent default on mousedown so the focused input doesn't blur.
  const preventBlur = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const transform = (k: string) => (shifted ? k.toUpperCase() : k);

  return (
    <div
      className={`${styles.keyboard} ${active ? styles.keyboardIsActive : ""}`}
      aria-hidden={!active}
    >
      {/* Close / dismiss bar */}
      <div
        className={styles.dismissBar}
        onMouseDown={preventBlur}
        onClick={handleClose}
      >
        <span className={styles.dismissHandle} />
      </div>

      <div className={styles.keypad}>
        {/* Row 1: Numbers */}
        <div className={styles.row}>
          {ROW1.map((k) => (
            <Key
              key={k}
              label={k}
              onMouseDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
        </div>

        {/* Row 2: QWERTYUIOP */}
        <div className={styles.row}>
          {ROW2.map((k) => (
            <Key
              key={k}
              label={transform(k)}
              onMouseDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
        </div>

        {/* Row 3: ASDFGHJKL (slightly indented) */}
        <div className={`${styles.row} ${styles.rowIndented}`}>
          {ROW3.map((k) => (
            <Key
              key={k}
              label={transform(k)}
              onMouseDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
        </div>

        {/* Row 4: Shift + ZXCVBNM + Backspace */}
        <div className={styles.row}>
          <Key
            label="⇧"
            wide
            active={shifted}
            onMouseDown={preventBlur}
            onClick={handleShift}
          />
          {ROW4.map((k) => (
            <Key
              key={k}
              label={transform(k)}
              onMouseDown={preventBlur}
              onClick={() => handleKey(k)}
            />
          ))}
          <Key
            label="⌫"
            wide
            onMouseDown={preventBlur}
            onClick={handleBackspace}
          />
        </div>

        {/* Row 5: Space (wide) + Enter */}
        <div className={styles.row}>
          <Key
            label={target?.enterLabel ?? "Return"}
            wide
            accent
            onMouseDown={preventBlur}
            onClick={handleEnter}
          />
          <Key
            label="space"
            extraWide
            onMouseDown={preventBlur}
            onClick={() => handleKey(" ")}
          />
          <Key
            label="⏎"
            wide
            accent
            onMouseDown={preventBlur}
            onClick={handleEnter}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key component
// ---------------------------------------------------------------------------

interface KeyProps {
  label: string;
  wide?: boolean;
  extraWide?: boolean;
  active?: boolean;
  accent?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onClick: () => void;
}

function Key({
  label,
  wide,
  extraWide,
  active,
  accent,
  onMouseDown,
  onClick,
}: KeyProps) {
  const cls = [
    styles.key,
    wide ? styles.keyWide : "",
    extraWide ? styles.keyExtraWide : "",
    active ? styles.keyIsActive : "",
    accent ? styles.keyAccent : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={cls}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
