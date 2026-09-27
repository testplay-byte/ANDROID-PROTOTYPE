"use client";

/* error screen — connection-failure state
   (exact port of the reference screens/error.js) */

import { resetCache } from "../lib/engine";
import { useWeather } from "../state/weather-context";

export function ErrorScreen() {
  const { prefs, showToast, go, refreshWeather } = useWeather();

  function retry() {
    if (prefs.simError) {
      showToast('Still offline — turn off "Simulate connection error" in Settings');
      return;
    }
    /* let the shared refresh flow run: it resets the cache, marks fresh
       data and returns to home (the error view is transient, not hashed) */
    resetCache();
    refreshWeather();
    go("home");
  }

  return (
    <div className="error-wrap">
      <div className="error-card glass rim">
        <span className="e-cloud">
          <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <g transform="translate(0 -1.5)">
              <path d="M9 15.2h8.2a3.2 3.2 0 0 0 .2-6.4 4.4 4.4 0 0 0-8.4-1A3.2 3.2 0 0 0 9 15.2Z" fill="url(#gCloudDim)" opacity=".9" />
            </g>
            <path d="M4 4l16 16" stroke="#ffb4b4" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </span>
        <h2>Couldn't load weather</h2>
        <p>The forecast service didn't respond. Check the simulated connection in Settings, then try again.</p>
        <button className="btn-pill" onClick={retry}>
          Try again
        </button>
        <button className="btn-ghost" onClick={() => go("settings")}>
          Open Settings
        </button>
      </div>
    </div>
  );
}
