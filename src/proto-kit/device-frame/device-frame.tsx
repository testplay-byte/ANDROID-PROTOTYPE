"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { StatusBar } from "./status-bar";
import { FullscreenButton } from "./fullscreen-button";
import { useDeviceSettings, resolveDeviceSize } from "../device-settings/store";
import styles from "./device-frame.module.css";

/**
 * DeviceFrame — the phone mockup.
 *
 * Renders the bezel, status bar, fullscreen button, and a screen slot for
 * the prototype's content. The frame color/width invert by theme
 * automatically (via tokens), and adapt per design style.
 *
 * SIZE: the frame reads the user's device-size setting (Settings page →
 * presets or custom width × height) and exposes it as the CSS variables
 * `--device-w` / `--device-h` plus `data-device-size`, so every prototype
 * resizes without touching its own code. The ≤480px fullscreen override in
 * device-frame.module.css still wins on a phone browser — that is intended.
 *
 * The `theme` prop sets the initial `data-theme` on the device element for
 * SSR. A DeviceThemeProvider (client) takes over on mount to read/persist
 * the saved theme and keep `data-theme` in sync.
 *
 * The `style` prop selects the design language (see src/proto-kit/styles/).
 * It sets a `data-style` attribute that switches the token layer. Omit it
 * for the default Material 3 palette.
 *
 * The fullscreen button uses the real Fullscreen API — always available,
 * part of every prototype.
 *
 * Usage:
 * ```tsx
 * <DeviceFrame theme="dark" style="carbon">
 *   <Screen>{children}</Screen>
 * </DeviceFrame>
 * ```
 */
export interface DeviceFrameProps {
  theme?: "dark" | "light";
  /** Design language for this prototype. Default/undefined = Material 3. */
  style?: string;
  children: ReactNode;
}

export function DeviceFrame({ theme = "dark", style, children }: DeviceFrameProps) {
  const settings = useDeviceSettings();
  const { w, h, preset } = resolveDeviceSize(settings);

  // Auto-fit: a Large (932px) frame would otherwise be clipped by a short
  // window. `zoom` (not transform) so the stage still lays out around the
  // scaled frame. Never applied on phones, where the frame is fullscreen.
  const [fit, setFit] = useState(1);
  useEffect(() => {
    const compute = () => {
      if (window.innerWidth <= 480) {
        setFit(1);
        return;
      }
      const pad = 48; // .stage padding
      setFit(Math.min(1, (window.innerHeight - pad) / h, (window.innerWidth - pad) / w));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [w, h]);

  return (
    <div
      className={`${styles.device} device`}
      data-theme={theme}
      data-style={style}
      data-device-size={preset}
      style={
        {
          "--device-w": `${w}px`,
          "--device-h": `${h}px`,
          ...(fit < 1 ? { zoom: fit } : {}),
        } as CSSProperties
      }
    >
      <FullscreenButton />
      <StatusBar />
      {children}
    </div>
  );
}

/**
 * Screen — the scrollable app area below the status bar.
 * The prototype renders its views/screens inside this.
 */
export function Screen({ children }: { children: ReactNode }) {
  return <main className={styles.screen}>{children}</main>;
}
