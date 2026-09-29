"use client";

/**
 * halo / state — one context for the whole desktop app.
 *
 * Desktop state is not phone state with bigger numbers. Here a ROOM can be
 * open ALONGSIDE its device drawer, the drawer can drive the same device the
 * home grid shows, a command palette floats over everything, and a "softness"
 * preference re-bakes the neumorphic shadow recipe app-wide through a data
 * attribute. All of it lives here so any component can read or drive it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AUTOMATIONS,
  CURRENT_HOUR,
  DEVICES,
  ROOMS,
  TARIFF_PENCE,
  USAGE_PREV,
  USAGE_TODAY,
  kwhPrev,
  kwhToday,
  roomById,
  wattsNow,
  type Device,
  type RoomId,
} from "../data";

export type ViewId = "home" | "rooms" | "energy" | "settings";
export type Softness = "firm" | "medium" | "soft";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "home", label: "Home", hint: "Rooms at a glance and their live controls" },
  { id: "rooms", label: "Rooms", hint: "Every room with its device drawer" },
  { id: "energy", label: "Energy", hint: "Load by hour, by device, and vs yesterday" },
  { id: "settings", label: "Settings", hint: "Theme, softness, automations, shortcuts" },
];

export const SOFTNESS_OPTIONS: { id: Softness; label: string; detail: string }[] = [
  { id: "firm", label: "Firm", detail: "Tight, shallow shadows — dense data reads better" },
  { id: "medium", label: "Balanced", detail: "The house default, matching the phone family" },
  { id: "soft", label: "Soft", detail: "Deep, diffuse light — the showpiece neumorphism" },
];

export const SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "⌘K / Ctrl+K", action: "Open the command palette" },
  { keys: "Esc", action: "Close the palette, the device drawer or the selection" },
  { keys: "/", action: "Filter the room list" },
  { keys: "1 – 4", action: "Jump to Home / Rooms / Energy / Settings" },
  { keys: "D", action: "Toggle every device in the open room" },
  { keys: "A", action: "Run the away scene" },
];

export interface Metrics {
  /** Sum of every device's instantaneous draw, watts. */
  liveWatts: number;
  /** kWh used so far today across the whole home. */
  kwhToday: number;
  /** The same total for yesterday — the comparison baseline. */
  kwhPrev: number;
  /** Percentage change against yesterday (negative = better). */
  deltaPct: number;
  /** Money the current day has cost at the fixed tariff. */
  costToday: number;
  /** Devices currently powered. */
  onCount: number;
  totalCount: number;
  /** Average measured temperature across the home, °C. */
  indoorTemp: number;
  /** Outside temperature, fixed. */
  outdoorTemp: number;
  /** Live devices ordered by instantaneous draw, highest first. */
  drawOrder: Device[];
}

interface HaloState {
  view: ViewId;
  go: (v: ViewId) => void;

  devices: Device[];
  deviceById: (id: string) => Device | undefined;
  toggleDevice: (id: string) => void;
  nudgeDevice: (id: string, dir: 1 | -1) => void;
  toggleRoom: (room: RoomId) => void;
  awayScene: () => void;
  resetDevices: () => void;

  /** Room filter on the home grid — "all" or a room id. */
  homeRoom: RoomId | "all";
  setHomeRoom: (r: RoomId | "all") => void;

  /** Text filter for the room list on the Rooms view. */
  roomFilter: string;
  setRoomFilter: (s: string) => void;

  /** The room whose device drawer is open BESIDE the room list. */
  selectedRoom: RoomId | null;
  selectRoom: (id: RoomId | null) => void;
  selectedDevices: Device[];

  softness: Softness;
  setSoftness: (s: Softness) => void;

  automations: { id: string; name: string; detail: string; on: boolean }[];
  toggleAutomation: (id: string) => void;

  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;

  toast: string | null;
  notify: (msg: string) => void;

  metrics: Metrics;
  hourNow: number;
  usageToday: number[];
  usagePrev: number[];
  tariff: number;
}

const Ctx = createContext<HaloState | null>(null);

const ROOM_IDS = ROOMS.map((r) => r.id);

/** Single-letter shortcuts must never fire while the user is typing. */
const typingIn = (e: KeyboardEvent) =>
  !!(e.target as HTMLElement)?.closest("input, textarea, select");

export function HaloProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("home");
  const [devices, setDevices] = useState<Device[]>(DEVICES);
  const [homeRoom, setHomeRoom] = useState<RoomId | "all">("all");
  const [roomFilter, setRoomFilter] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<RoomId | null>(null);
  const [softness, setSoftnessState] = useState<Softness>("medium");
  const [automations, setAutomations] = useState(AUTOMATIONS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* --- persistence: the shadow recipe is a device-wide preference --- */
  useEffect(() => {
    try {
      const s = localStorage.getItem("halo-softness");
      if (s === "firm" || s === "medium" || s === "soft") setSoftnessState(s);
    } catch {
      /* best-effort */
    }
  }, []);
  const setSoftness = useCallback((s: Softness) => {
    setSoftnessState(s);
    try {
      localStorage.setItem("halo-softness", s);
    } catch {
      /* best-effort */
    }
  }, []);

  /* --- hash routing (#home #rooms #energy #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "home");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#home");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    if (v !== "rooms") {
      setRoomFilter("");
      setSelectedRoom(null);
    }
    if (v !== "home") setHomeRoom("all");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  /* --- device state --- */
  const patch = useCallback(
    (id: string, fn: (d: Device) => Device) =>
      setDevices((list) => list.map((d) => (d.id === id ? fn(d) : d))),
    [],
  );

  const toggleDevice = useCallback(
    (id: string) => {
      patch(id, (d) => ({ ...d, on: !d.on }));
    },
    [patch],
  );

  const nudgeDevice = useCallback(
    (id: string, dir: 1 | -1) => {
      patch(id, (d) => {
        if (d.step <= 0) return d;
        const next = Math.min(d.max, Math.max(d.min, Number((d.value + d.step * dir).toFixed(2))));
        /* Turning a climate valve or a blind up also powers it on, so the
           number a user just moved always matches the state they can see. */
        const on = next > d.min ? true : d.on;
        return { ...d, value: next, on };
      });
    },
    [patch],
  );

  const toggleRoom = useCallback(
    (room: RoomId) => {
      setDevices((list) => {
        const inRoom = list.filter((d) => d.room === room);
        const allOn = inRoom.length > 0 && inRoom.every((d) => d.on);
        return list.map((d) => (d.room === room ? { ...d, on: !allOn } : d));
      });
      notify(`${roomById(room).name} · all devices ${devices.filter((d) => d.room === room).every((d) => d.on) ? "off" : "on"}`);
    },
    [devices, notify],
  );

  const awayScene = useCallback(() => {
    setDevices((list) =>
      list.map((d) =>
        d.kind === "lock" || d.kind === "sensor" || d.kind === "camera"
          ? d
          : { ...d, on: false },
      ),
    );
    notify("Away scene applied — locks and cameras stay armed");
  }, [notify]);

  /* --- desktop keyboard: ⌘K / Ctrl+K command palette, Esc closes, plus the
     view / room / scene shortcuts. `/` lives in the page shell beside the
     other desktop-shell shortcuts, so ⌘K and Esc are the only two here that
     the palette and the drawer need. Declared AFTER the callbacks it calls
     so the dependency list can hold the live versions — that is what keeps
     the room toggle's toast honest after a device has been switched. --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedRoom(null);
        setRoomFilter("");
        return;
      }
      if (typingIn(e)) return;
      if (/^[1-4]$/.test(e.key)) {
        go(VIEWS[Number(e.key) - 1].id);
        return;
      }
      if (e.key.toLowerCase() === "d" && selectedRoom) {
        e.preventDefault();
        toggleRoom(selectedRoom);
        return;
      }
      if (e.key.toLowerCase() === "a") {
        e.preventDefault();
        awayScene();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, selectedRoom, toggleRoom, awayScene]);

  const resetDevices = useCallback(() => {
    setDevices(DEVICES);
    setSelectedRoom(null);
    setHomeRoom("all");
    notify("All devices restored to the demo state");
  }, [notify]);

  const selectRoom = useCallback((id: RoomId | null) => {
    setSelectedRoom(id);
  }, []);

  const toggleAutomation = useCallback(
    (id: string) => {
      setAutomations((list) =>
        list.map((a) => (a.id === id ? { ...a, on: !a.on } : a)),
      );
    },
    [],
  );

  const deviceById = useCallback((id: string) => devices.find((d) => d.id === id), [devices]);

  const selectedDevices = useMemo(
    () => (selectedRoom ? devices.filter((d) => d.room === selectedRoom) : []),
    [devices, selectedRoom],
  );

  /* --- every number the four views share is derived here, once --- */
  const metrics = useMemo<Metrics>(() => {
    const liveWatts = devices.reduce((s, d) => s + wattsNow(d), 0);
    const t = devices.reduce((s, d) => s + kwhToday(d), 0);
    const p = devices.reduce((s, d) => s + kwhPrev(d), 0);
    const deltaPct = p === 0 ? 0 : ((t - p) / p) * 100;
    return {
      liveWatts,
      kwhToday: t,
      kwhPrev: p,
      deltaPct,
      costToday: (t * TARIFF_PENCE) / 100,
      onCount: devices.filter((d) => d.on).length,
      totalCount: devices.length,
      indoorTemp:
        Math.round((ROOMS.reduce((s, r) => s + r.temp, 0) / ROOMS.length) * 10) / 10,
      outdoorTemp: 9.4,
      drawOrder: [...devices].sort((a, b) => wattsNow(b) - wattsNow(a)).slice(0, 5),
    };
  }, [devices]);

  const value: HaloState = {
    view,
    go,
    devices,
    deviceById,
    toggleDevice,
    nudgeDevice,
    toggleRoom,
    awayScene,
    resetDevices,
    homeRoom,
    setHomeRoom,
    roomFilter,
    setRoomFilter,
    selectedRoom,
    selectRoom,
    selectedDevices,
    softness,
    setSoftness,
    automations,
    toggleAutomation,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    metrics,
    hourNow: CURRENT_HOUR,
    usageToday: USAGE_TODAY,
    usagePrev: USAGE_PREV,
    tariff: TARIFF_PENCE,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useHalo(): HaloState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useHalo must be used within <HaloProvider>");
  return ctx;
}

/** Re-exported so the screens never reach past the context for constants. */
export { ROOM_IDS };
