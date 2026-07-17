"use client";

/**
 * proto-kit / device-frame / fullscreen-button — real Fullscreen API toggle.
 *
 * Calls `device.requestFullscreen()` / `document.exitFullscreen()` on the
 * nearest `.device` ancestor. Syncs the icon when fullscreen state changes
 * (also fires on Esc key, tab switch, etc.).
 *
 * Lives inside <DeviceFrame> so every prototype gets it automatically.
 * Positioned top-right of the device, always visible.
 */
import { useEffect, useState } from "react";
import styles from "./device-frame.module.css";

export function FullscreenButton() {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    function sync() {
      setIsFs(!!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement));
    }
    sync();
    document.addEventListener("fullscreenchange", sync);
    document.addEventListener("webkitfullscreenchange", sync);
    return () => {
      document.removeEventListener("fullscreenchange", sync);
      document.removeEventListener("webkitfullscreenchange", sync);
    };
  }, []);

  function toggle() {
    const device = document.querySelector(".device") as HTMLElement | null;
    if (!device) return;
    const currentlyFs = !!(document.fullscreenElement || (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement);
    if (currentlyFs) {
      if (document.exitFullscreen) document.exitFullscreen();
    } else {
      const req = device.requestFullscreen || (device as unknown as { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen;
      if (req) req.call(device);
    }
  }

  return (
    <button
      type="button"
      className={styles.fsToggle}
      aria-label={isFs ? "Exit fullscreen" : "Enter fullscreen"}
      onClick={toggle}
    >
      {isFs ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 3v4a2 2 0 0 1-2 2H3M15 3v4a2 2 0 0 0 2 2h4M9 21v-4a2 2 0 0 0-2-2H3M15 21v-4a2 2 0 0 1 2-2h4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" />
        </svg>
      )}
    </button>
  );
}
