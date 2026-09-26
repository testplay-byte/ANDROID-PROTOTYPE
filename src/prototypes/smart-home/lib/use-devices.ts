"use client";

/**
 * smart-home / lib / use-devices — device state hook.
 * Called once from page.tsx so Home + Rooms share the same state
 * (the "N devices on" status line stays consistent across tabs).
 */

import { useState } from "react";
import { INITIAL_DEVICES, type HomeDevice } from "./data";

export interface DevicesApi {
  devices: HomeDevice[];
  devicesOn: number;
  toggleDevice: (id: string) => void;
  setBrightness: (id: string, brightness: number) => void;
  nudgeTarget: (id: string, delta: number) => void;
}

export function useDevices(): DevicesApi {
  const [devices, setDevices] = useState<HomeDevice[]>(INITIAL_DEVICES);

  function toggleDevice(id: string) {
    setDevices((ds) =>
      ds.map((d) => (d.id === id ? { ...d, on: !d.on } : d)),
    );
  }

  function setBrightness(id: string, brightness: number) {
    setDevices((ds) =>
      ds.map((d) => (d.id === id ? { ...d, brightness } : d)),
    );
  }

  function nudgeTarget(id: string, delta: number) {
    setDevices((ds) =>
      ds.map((d) =>
        d.id === id
          ? { ...d, target: Math.round(Math.min(28, Math.max(15, d.target + delta)) * 2) / 2 }
          : d,
      ),
    );
  }

  const devicesOn = devices.filter((d) => d.on).length;

  return { devices, devicesOn, toggleDevice, setBrightness, nudgeTarget };
}
