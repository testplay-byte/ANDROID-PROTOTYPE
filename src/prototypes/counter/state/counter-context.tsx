"use client";

/**
 * counter / state — one context for the whole desktop booking app.
 *
 * Desktop state is not phone state: a booking can be open ALONGSIDE the
 * schedule, a table of bookings can be multi-selected while a bulk status
 * change runs, a ⌘K palette floats over everything, and preferences like
 * "colour blocks" and "week start" change the whole window at once. All of it
 * lives here so any component can read or drive it.
 *
 * Determinism: nothing in here reads the clock. "Today" is TODAY from data.ts.
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
  ACTIVE_STATUSES,
  BOOKINGS,
  SERVICES,
  WEEK_MON_FIRST,
  bookingEnd,
  overlaps,
  serviceById,
  type Booking,
  type BookingStatus,
  type Service,
} from "../data";

export type ViewId = "calendar" | "bookings" | "services" | "settings";
export type SortKey = "customer" | "service" | "staff" | "day" | "start" | "price" | "status";
export type WeekStart = "mon" | "sun";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "calendar", label: "Schedule", hint: "Week grid, slot picking and the booking form" },
  { id: "bookings", label: "Bookings", hint: "Sortable multi-select table with a detail panel" },
  { id: "services", label: "Services", hint: "Durations and prices that drive the booking form" },
  { id: "settings", label: "Settings", hint: "Theme, colour blocks, week start, shortcuts" },
];

/** Preferences persisted to localStorage under this key. */
export const PREFS_KEY = "counter-prefs-v1";

export interface Prefs {
  /** the flat style's optional tinted colour blocks */
  blocks: boolean;
  weekStart: WeekStart;
}

export const DEFAULT_PREFS: Prefs = { blocks: true, weekStart: "mon" };

/** What the booking form holds while it is being filled in. */
export interface Draft {
  customer: string;
  serviceId: string;
  staffId: string;
  day: string;
  time: string; // "HH:MM"
}

export interface DraftConflict {
  /** id of the booking that already occupies the slot */
  id: string;
  label: string;
  who: string;
}

interface CounterState {
  view: ViewId;
  go: (v: ViewId) => void;

  bookings: Booking[];
  services: Service[];
  /** Edit a service in place — duration/price feed straight back into the
   *  booking form and the schedule block heights. */
  updateService: (id: string, patch: Partial<Service>) => void;
  resetServices: () => void;

  /* ---- selection ---- */
  selectedId: string | null;
  select: (id: string | null) => void;
  checked: string[];
  toggleChecked: (id: string) => void;
  setCheckedAll: (ids: string[]) => void;
  clearChecked: () => void;

  /* ---- table ---- */
  search: string;
  setSearch: (s: string) => void;
  statusFilter: BookingStatus | "all";
  setStatusFilter: (s: BookingStatus | "all") => void;
  staffFilter: string;
  setStaffFilter: (s: string) => void;
  sort: { key: SortKey; dir: "asc" | "desc" };
  toggleSort: (key: SortKey) => void;
  visibleBookings: Booking[];

  /* ---- status transitions ---- */
  setStatus: (ids: string[], status: BookingStatus) => void;

  /* ---- booking form ---- */
  draft: Draft;
  setDraft: (patch: Partial<Draft>) => void;
  conflict: DraftConflict | null;
  submitDraft: () => void;
  draftFocus: number;
  focusDraft: () => void;

  /* ---- preferences ---- */
  prefs: Prefs;
  setPrefs: (patch: Partial<Prefs>) => void;
  resetPrefs: () => void;

  /* ---- chrome ---- */
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
  counts: Record<BookingStatus | "all", number>;
}

const Ctx = createContext<CounterState | null>(null);

const DEFAULT_DRAFT: Draft = {
  customer: "",
  serviceId: "sv-cut",
  staffId: "s-ana",
  day: WEEK_MON_FIRST[0],
  time: "09:00",
};

export function CounterProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("calendar");
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [services, setServices] = useState<Service[]>(SERVICES);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [staffFilter, setStaffFilter] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "start",
    dir: "asc",
  });

  const [draft, setDraftState] = useState<Draft>(DEFAULT_DRAFT);
  const [conflict, setConflict] = useState<DraftConflict | null>(null);
  const [draftFocus, setDraftFocus] = useState(0);

  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* --- preferences hydrate (SSR-safe: read only after mount) --- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFS_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Prefs>;
        setPrefsState({
          blocks: typeof p.blocks === "boolean" ? p.blocks : DEFAULT_PREFS.blocks,
          weekStart: p.weekStart === "sun" ? "sun" : "mon",
        });
      }
    } catch {
      /* best effort */
    }
  }, []);

  const setPrefs = useCallback((patch: Partial<Prefs>) => {
    setPrefsState((p) => {
      const next = { ...p, ...patch };
      try {
        localStorage.setItem(PREFS_KEY, JSON.stringify(next));
      } catch {
        /* best effort */
      }
      return next;
    });
  }, []);

  const resetPrefs = useCallback(() => {
    setPrefsState(DEFAULT_PREFS);
    try {
      localStorage.removeItem(PREFS_KEY);
    } catch {
      /* best effort */
    }
  }, []);

  /* --- hash routing (#calendar #bookings #services #settings) --- */
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.replace(/^#/, "") as ViewId;
      setView(VIEWS.some((v) => v.id === h) ? h : "calendar");
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#calendar");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("popstate", read);
    window.addEventListener("hashchange", read);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener("hashchange", read);
    };
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2400);
  }, []);

  const go = useCallback((v: ViewId) => {
    setView(v);
    /* every navigation starts clean — a stale detail panel from another view
       is worse than losing it, and the palette re-selects after calling go */
    setSelectedId(null);
    setChecked([]);
    setSearch("");
    setStatusFilter("all");
    setStaffFilter("all");
    try {
      history.pushState(null, "", `#${v}`);
    } catch {
      /* ignore */
    }
  }, []);

  /* --- desktop keyboard: ⌘K / Ctrl+K, Esc --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setSelectedId(null);
        setChecked([]);
        setConflict(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleSort = useCallback((key: SortKey) => {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "customer" || key === "service" || key === "staff" ? "asc" : "desc" }
    );
  }, []);

  /* --- services are editable; the schedule + form read the live list --- */
  const updateService = useCallback(
    (id: string, patch: Partial<Service>) => {
      setServices((list) =>
        list.map((s) => (s.id === id ? { ...s, ...patch } : s))
      );
    },
    []
  );

  const resetServices = useCallback(() => {
    setServices(SERVICES);
    notify("Service list restored");
  }, [notify]);

  const setStatus = useCallback(
    (ids: string[], status: BookingStatus) => {
      if (ids.length === 0) return;
      setBookings((list) => list.map((b) => (ids.includes(b.id) ? { ...b, status } : b)));
      notify(
        ids.length === 1
          ? `Booking moved to ${status}`
          : `${ids.length} bookings moved to ${status}`
      );
    },
    [notify]
  );

  /* --- the booking form ------------------------------------------------- */
  const setDraft = useCallback((patch: Partial<Draft>) => {
    setDraftState((d) => ({ ...d, ...patch }));
  }, []);

  const focusDraft = useCallback(() => {
    setView("calendar");
    setDraftFocus((n) => n + 1);
    try {
      history.pushState(null, "", "#calendar");
    } catch {
      /* ignore */
    }
  }, []);

  const submitDraft = useCallback(() => {
    const name = draft.customer.trim();
    if (!name) {
      setConflict({ id: "", label: "A name is required", who: "" });
      return;
    }
    const svc = services.find((s) => s.id === draft.serviceId) ?? services[0];
    const [h, m] = draft.time.split(":").map((n) => parseInt(n, 10));
    const start = (h || 0) * 60 + (m || 0);
    const end = start + svc.duration;

    const clash = bookings.find((b) => {
      if (!ACTIVE_STATUSES.includes(b.status)) return false;
      return overlaps(
        { day: draft.day, staffId: draft.staffId, start, end },
        { day: b.day, staffId: b.staffId, start: b.start, end: bookingEnd(b) }
      );
    });
    if (clash) {
      setConflict({
        id: clash.id,
        label: `${draft.time} is taken`,
        who: `${clash.customer} — ${serviceById(clash.serviceId)?.name ?? "service"} until the slot ends`,
      });
      setSelectedId(clash.id);
      return;
    }

    const id = `b-new-${bookings.length + 1}`;
    setBookings((list) => [
      ...list,
      {
        id,
        serviceId: svc.id,
        staffId: draft.staffId,
        customer: name,
        day: draft.day,
        start,
        status: "confirmed",
        note: "",
      },
    ]);
    setConflict(null);
    setSelectedId(id);
    setDraftState((d) => ({ ...d, customer: "" }));
    notify(`${name} booked — ${svc.name}, ${svc.duration} min`);
  }, [bookings, draft, notify, services]);

  /* --- derived table rows ------------------------------------------------ */
  const visibleBookings = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = bookings.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (staffFilter !== "all" && b.staffId !== staffFilter) return false;
      if (!q) return true;
      const svc = services.find((s) => s.id === b.serviceId);
      return (
        b.customer.toLowerCase().includes(q) ||
        (svc?.name.toLowerCase().includes(q) ?? false) ||
        b.day.includes(q) ||
        b.status.includes(q)
      );
    });
    const dir = sort.dir === "asc" ? 1 : -1;
    const name = (id: string) => services.find((s) => s.id === id)?.name ?? "";
    return [...list].sort((a, b) => {
      if (a.day !== b.day) return a.day < b.day ? -1 : 1; // days always ascend
      switch (sort.key) {
        case "customer":
          return a.customer.localeCompare(b.customer) * dir;
        case "service":
          return name(a.serviceId).localeCompare(name(b.serviceId)) * dir;
        case "staff":
          return a.staffId.localeCompare(b.staffId) * dir;
        case "start":
          return (a.start - b.start) * dir;
        case "price": {
          const pa = services.find((s) => s.id === a.serviceId)?.price ?? 0;
          const pb = services.find((s) => s.id === b.serviceId)?.price ?? 0;
          return (pa - pb) * dir;
        }
        case "status":
          return a.status.localeCompare(b.status) * dir;
        default:
          return 0;
      }
    });
  }, [bookings, search, services, sort, staffFilter, statusFilter]);

  const counts = useMemo(() => {
    const out = {
      all: bookings.length,
      pending: 0,
      confirmed: 0,
      "checked-in": 0,
      completed: 0,
      "no-show": 0,
      cancelled: 0,
    } as Record<BookingStatus | "all", number>;
    for (const b of bookings) out[b.status] += 1;
    return out;
  }, [bookings]);

  const value: CounterState = {
    view,
    go,
    bookings,
    services,
    updateService,
    resetServices,
    selectedId,
    select: setSelectedId,
    checked,
    toggleChecked: (id) =>
      setChecked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    setCheckedAll: (ids) => setChecked(ids),
    clearChecked: () => setChecked([]),
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    staffFilter,
    setStaffFilter,
    sort,
    toggleSort,
    visibleBookings,
    setStatus,
    draft,
    setDraft,
    conflict,
    submitDraft,
    draftFocus,
    focusDraft,
    prefs,
    setPrefs,
    resetPrefs,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    counts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCounter(): CounterState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCounter must be used within <CounterProvider>");
  return ctx;
}
