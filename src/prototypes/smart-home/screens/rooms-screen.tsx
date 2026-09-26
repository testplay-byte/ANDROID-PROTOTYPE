"use client";

/**
 * smart-home / screens / rooms-screen — room filter chips
 * (All / Living / Kitchen / Bedroom) + device rows per room with
 * toggles and the room's current temperature.
 */

import { useState } from "react";
import { TopBar } from "../../../proto-kit";
import { ROOMS, type RoomId } from "../lib/data";
import { Toggle } from "../components/toggle";
import type { DevicesApi } from "../lib/use-devices";
import styles from "./rooms-screen.module.css";

type Filter = "all" | RoomId;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "living", label: "Living" },
  { id: "kitchen", label: "Kitchen" },
  { id: "bedroom", label: "Bedroom" },
];

function DeviceGlyph({ kind }: { kind: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (kind) {
    case "light":
      return (
        <svg {...common}>
          <path d="M9 18h6M10 22h4" />
          <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2V17h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z" />
        </svg>
      );
    case "camera":
      return (
        <svg {...common}>
          <path d="M2 8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" />
          <path d="m15 10 6-3v10l-6-3" />
        </svg>
      );
    case "speaker":
      return (
        <svg {...common}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <circle cx="12" cy="14" r="4" />
          <circle cx="12" cy="6" r="1" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      );
    case "plug":
      return (
        <svg {...common}>
          <path d="M9 2v6M15 2v6" />
          <path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" />
          <path d="M12 17v5" />
        </svg>
      );
    case "thermostat":
    default:
      return (
        <svg {...common}>
          <path d="M12 2a2 2 0 0 0-2 2v9.5a4.5 4.5 0 1 0 4 0V4a2 2 0 0 0-2-2z" />
        </svg>
      );
  }
}

export function RoomsScreen({ api }: { api: DevicesApi }) {
  const { devices, toggleDevice } = api;
  const [filter, setFilter] = useState<Filter>("all");

  const visibleRooms = ROOMS.filter((r) => filter === "all" || r.id === filter);

  return (
    <div className={styles.root}>
      <TopBar variant="large" title="Rooms" subtitle="Tap a row to toggle the device" />

      <div className={styles.content}>
        {/* Filter chips */}
        <div className={styles.chips} role="tablist" aria-label="Filter by room">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`${styles.chip} ${filter === f.id ? styles.chipActive : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Device rows grouped per room */}
        {visibleRooms.map((room) => {
          const roomDevices = devices.filter((d) => d.room === room.id);
          const onCount = roomDevices.filter((d) => d.on).length;
          return (
            <section key={room.id} className={styles.roomGroup}>
              <header className={styles.roomHead}>
                <span className={styles.roomName}>{room.label}</span>
                <span className={styles.roomMeta}>
                  {room.temp.toFixed(1)}°C · {onCount}/{roomDevices.length} on
                </span>
              </header>
              <div className={styles.rows}>
                {roomDevices.map((d) => (
                  <div key={d.id} className={styles.row}>
                    <span className={`${styles.rowIcon} ${d.on ? styles.rowIconOn : ""}`}>
                      <DeviceGlyph kind={d.kind} />
                    </span>
                    <span className={styles.rowInfo}>
                      <span className={styles.rowName}>{d.name}</span>
                      <span className={styles.rowSub}>
                        {d.kind === "light" ? `Brightness ${d.brightness}%` : d.on ? "On" : "Off"}
                      </span>
                    </span>
                    <Toggle
                      checked={d.on}
                      onChange={() => toggleDevice(d.id)}
                      label={`${d.name} power`}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
