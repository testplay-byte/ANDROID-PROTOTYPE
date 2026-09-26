"use client";

/**
 * smart-home / screens / home-screen — the signature BENTO GRID.
 *
 * 2-column CSS grid, mixed-height rounded tiles (--r-lg, surface-1,
 * shadow-1, 12px felt gutters):
 *   - thermostat (spans 2 rows): circular dial + +/- steppers
 *   - lights: brightness slider + toggle
 *   - security camera (dark tile): LIVE badge + CSS-gradient noise
 *   - energy: mini 7-bar chart
 *   - speaker: now playing + play/pause
 *   - door lock: locked/unlocked tile (wide, spans 2 columns)
 */

import { TopBar } from "../../../proto-kit";
import { ROOMS, type HomeDevice } from "../lib/data";
import { Toggle } from "../components/toggle";
import type { DevicesApi } from "../lib/use-devices";
import styles from "./home-screen.module.css";

const THERMOSTAT_ID = "thermostat";
const LIGHT_ID = "light-lamp";
const SPEAKER_ID = "speaker";
const LOCK_ID = "lock";
const CAMERA_ID = "camera";

const NOW_PLAYING = { track: "Solar", artist: "Ambient Works" };

export function HomeScreen({ api }: { api: DevicesApi }) {
  const { devices, devicesOn, toggleDevice, setBrightness, nudgeTarget } = api;

  const thermostat = devices.find((d) => d.id === THERMOSTAT_ID);
  const light = devices.find((d) => d.id === LIGHT_ID);
  const camera = devices.find((d) => d.id === CAMERA_ID);
  const speaker = devices.find((d) => d.id === SPEAKER_ID);
  const lock = devices.find((d) => d.id === LOCK_ID);
  const livingTemp = ROOMS[0].temp;

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="My Home" subtitle={`${devicesOn} devices on · 3 rooms active`} />

      <div className={styles.content}>
        <div className={styles.grid}>
          {/* ── Thermostat — big tile, spans 2 rows ─────────────────── */}
          <section className={`${styles.tile} ${styles.thermostat}`} aria-label="Thermostat">
            <header className={styles.tileHead}>
              <ThermostatIcon />
              <span className={styles.tileTitle}>Thermostat</span>
            </header>
            <div className={styles.dial} role="status">
              <span className={styles.dialTemp}>
                {thermostat?.target.toFixed(1) ?? "21.0"}
                <span className={styles.dialUnit}>°</span>
              </span>
              <span className={styles.dialMeta}>
                now {livingTemp.toFixed(1)}°
              </span>
            </div>
            <div className={styles.steppers}>
              <button
                type="button"
                className={styles.stepBtn}
                aria-label="Decrease target temperature"
                onClick={() => nudgeTarget(THERMOSTAT_ID, -0.5)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.stepBtn} ${styles.stepBtnPrimary}`}
                aria-label="Increase target temperature"
                onClick={() => nudgeTarget(THERMOSTAT_ID, 0.5)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </section>

          {/* ── Lights — slider + toggle ────────────────────────────── */}
          <section className={styles.tile} aria-label="Lights">
            <header className={styles.tileHead}>
              <BulbIcon />
              <span className={styles.tileTitle}>Lights</span>
              <div className={styles.headAction}>
                <Toggle
                  checked={!!light?.on}
                  onChange={() => toggleDevice(LIGHT_ID)}
                  label="Floor lamp power"
                />
              </div>
            </header>
            <div className={styles.tileBody}>
              <span className={styles.bigValue}>{light?.brightness ?? 0}%</span>
              <span className={styles.tileMeta}>Floor lamp brightness</span>
              <input
                type="range"
                min={0}
                max={100}
                value={light?.brightness ?? 0}
                aria-label="Floor lamp brightness"
                className={styles.slider}
                disabled={!light?.on}
                onChange={(e) => setBrightness(LIGHT_ID, Number(e.target.value))}
              />
            </div>
          </section>

          {/* ── Security camera — dark tile ─────────────────────────── */}
          <section
            className={`${styles.tile} ${styles.camera} ${camera?.on ? "" : styles.cameraOff}`}
            aria-label="Security camera"
          >
            <div className={styles.camNoise} aria-hidden="true" />
            <header className={`${styles.tileHead} ${styles.camHead}`}>
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} aria-hidden="true" />
                LIVE
              </span>
              <span className={`${styles.tileTitle} ${styles.camTitle}`}>Front door</span>
            </header>
            <button
              type="button"
              className={styles.camAction}
              onClick={() => toggleDevice(CAMERA_ID)}
            >
              {camera?.on ? "Stream on — tap to stop" : "Stream off — tap to start"}
            </button>
          </section>

          {/* ── Energy — mini 7-bar chart ───────────────────────────── */}
          <section className={styles.tile} aria-label="Energy today">
            <header className={styles.tileHead}>
              <BoltIcon />
              <span className={styles.tileTitle}>Energy</span>
            </header>
            <div className={styles.tileBody}>
              <span className={styles.bigValue}>18.9</span>
              <span className={styles.tileMeta}>kWh today</span>
              <div className={styles.miniChart} aria-hidden="true">
                {[38, 52, 30, 64, 46, 100, 72].map((h, i) => (
                  <span
                    key={i}
                    className={`${styles.miniBar} ${i === 5 ? styles.miniBarPeak : ""}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ── Speaker — now playing + play/pause ──────────────────── */}
          <section className={styles.tile} aria-label="Speaker">
            <header className={styles.tileHead}>
              <SpeakerIcon />
              <span className={styles.tileTitle}>Speaker</span>
            </header>
            <div className={styles.tileBody}>
              <span className={styles.trackName}>{NOW_PLAYING.track}</span>
              <span className={styles.tileMeta}>{NOW_PLAYING.artist}</span>
              <div className={styles.speakerRow}>
                <div className={styles.eq} aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className={`${styles.eqBar} ${speaker?.on ? styles.eqOn : ""}`}
                      style={{ animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${speaker?.on ? styles.iconBtnPrimary : ""}`}
                  aria-label={speaker?.on ? "Pause speaker" : "Play speaker"}
                  onClick={() => toggleDevice(SPEAKER_ID)}
                >
                  {speaker?.on ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6,4 20,12 6,20" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ── Door lock — wide tile ───────────────────────────────── */}
          <button
            type="button"
            className={`${styles.tile} ${styles.lock} ${styles.tileTap} ${lock?.on ? "" : styles.lockOpen}`}
            onClick={() => toggleDevice(LOCK_ID)}
            aria-pressed={lock?.on}
            aria-label={lock?.on ? "Lock the front door" : "Unlock the front door"}
          >
            <span className={styles.lockIcon}>
              {lock?.on ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 7.9-.9" />
                </svg>
              )}
            </span>
            <span className={styles.lockText}>
              <span className={styles.tileTitle}>Front door</span>
              <span className={styles.tileMeta}>{lock?.on ? "Locked" : "Unlocked"}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Inline icons ---- */

function ThermostatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 0-2 2v9.5a4.5 4.5 0 1 0 4 0V4a2 2 0 0 0-2-2z" />
    </svg>
  );
}

function BulbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="14" r="4" />
      <circle cx="12" cy="6" r="1" />
    </svg>
  );
}
