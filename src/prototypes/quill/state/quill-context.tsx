"use client";

/**
 * quill / state — one context for the whole desktop notes app.
 *
 * Desktop state differs from a phone prototype in the ways that matter: a
 * selection lives BESIDE the list (the Library preview and the editor open the
 * same note), a command overlay can be open over everything, filters survive a
 * view change, and a font-size preference re-scales the editor only. All of it
 * lives here so any screen can read or drive it.
 *
 * Hash routing: #library · #note · #search · #settings, and #note/<id> when a
 * specific note is open — so every screen is deep-linkable, which is a desktop
 * expectation a phone prototype does not have.
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
  NOTES,
  matchNote,
  orderHits,
  type Note,
  type NoteHit,
  type SearchScope,
  type TagId,
} from "../data";

export type ViewId = "library" | "note" | "search" | "settings";
export type SortKey = "recent" | "title" | "length";

export const VIEWS: { id: ViewId; label: string; hint: string }[] = [
  { id: "library", label: "Library", hint: "Note list with a preview beside it" },
  { id: "note", label: "Note", hint: "Block editor with a live checklist" },
  { id: "search", label: "Search", hint: "Grouped, highlighted results" },
  { id: "settings", label: "Settings", hint: "Theme, editor size, shortcuts" },
];

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "recent", label: "Recent" },
  { id: "title", label: "Title" },
  { id: "length", label: "Length" },
];

export const FONT_SIZES: { id: EditorSize; label: string; hint: string }[] = [
  { id: "small", label: "Small", hint: "14px body — dense lists" },
  { id: "medium", label: "Medium", hint: "16px body — the default" },
  { id: "large", label: "Large", hint: "18px body — long reading" },
];

export type EditorSize = "small" | "medium" | "large";

const STORAGE = {
  checks: "quill-checks-v1",
  font: "quill-font-v1",
  sort: "quill-sort-v1",
};

interface QuillState {
  view: ViewId;
  go: (v: ViewId) => void;
  openNote: (id: string) => void;
  notes: Note[];
  activeNoteId: string;
  activeNote: Note;
  selectNote: (id: string) => void;
  newNote: () => void;
  /** checklist overrides keyed `${noteId}:${itemId}` — persisted, resettable */
  isChecked: (note: Note, itemId: string, seed: boolean) => boolean;
  toggleCheck: (note: Note, itemId: string, seed: boolean) => void;
  checkedCount: (note: Note) => number;
  search: string;
  setSearch: (s: string) => void;
  tags: TagId[];
  toggleTag: (t: TagId) => void;
  clearTags: () => void;
  pinnedOnly: boolean;
  setPinnedOnly: (v: boolean) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  filteredNotes: Note[];
  query: string;
  setQuery: (q: string) => void;
  scope: SearchScope;
  setScope: (s: SearchScope) => void;
  hits: NoteHit[];
  fontSize: EditorSize;
  setFontSize: (s: EditorSize) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: string | null;
  notify: (msg: string) => void;
  resetAll: () => void;
  counts: { total: number; pinned: number; byTag: Record<TagId, number> };
}

const Ctx = createContext<QuillState | null>(null);

const checkKey = (noteId: string, itemId: string) => `${noteId}:${itemId}`;

export function QuillProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [fontSize, setFontSizeState] = useState<EditorSize>("medium");
  const [sort, setSortState] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewId>("library");
  const [activeNoteId, setActiveNoteId] = useState<string>(NOTES[0].id);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState<TagId[]>([]);
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<SearchScope>("all");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  /* --- persistence: preferences and the checklist are real, remembered state --- */
  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE.checks);
      if (c) setChecks(JSON.parse(c) as Record<string, boolean>);
      const f = localStorage.getItem(STORAGE.font);
      if (f === "small" || f === "medium" || f === "large") setFontSizeState(f);
      const s = localStorage.getItem(STORAGE.sort);
      if (s === "recent" || s === "title" || s === "length") setSortState(s);
    } catch {
      /* a sandbox without storage just keeps the defaults */
    }
  }, []);

  const setFontSize = useCallback((s: EditorSize) => {
    setFontSizeState(s);
    try {
      localStorage.setItem(STORAGE.font, s);
    } catch {}
  }, []);

  const setSort = useCallback((s: SortKey) => {
    setSortState(s);
    try {
      localStorage.setItem(STORAGE.sort, s);
    } catch {}
  }, []);

  const persistChecks = useCallback((next: Record<string, boolean>) => {
    setChecks(next);
    try {
      localStorage.setItem(STORAGE.checks, JSON.stringify(next));
    } catch {}
  }, []);

  /* --- hash routing: #library #note/<id> #search #settings --- */
  useEffect(() => {
    const read = () => {
      const raw = window.location.hash.replace(/^#/, "");
      const [head, tail] = raw.split("/");
      const next = VIEWS.some((v) => v.id === head) ? (head as ViewId) : "library";
      setView(next);
      if (next === "note" && tail) setActiveNoteId(tail);
    };
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#library");
      } catch {
        /* sandbox may block hash writes */
      }
    }
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);

  const go = useCallback(
    (v: ViewId) => {
      setView(v);
      try {
        history.pushState(null, "", v === "note" ? `#note/${activeNoteId}` : `#${v}`);
      } catch {
        /* ignore — the in-memory view already changed */
      }
    },
    [activeNoteId]
  );

  const selectNote = useCallback((id: string) => {
    setActiveNoteId(id);
  }, []);

  const openNote = useCallback(
    (id: string) => {
      setActiveNoteId(id);
      setView("note");
      try {
        history.pushState(null, "", `#note/${id}`);
      } catch {
        /* ignore */
      }
    },
    []
  );

  /* --- desktop keyboard: ⌘K / Ctrl+K command overlay, Esc backs out --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        if (query) setQuery("");
        else if (search) setSearch("");
        else if (tags.length > 0) setTags([]);
        else if (pinnedOnly) setPinnedOnly(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [query, search, tags.length, pinnedOnly]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const isChecked = useCallback(
    (note: Note, itemId: string, seed: boolean) => checks[checkKey(note.id, itemId)] ?? seed,
    [checks]
  );

  const toggleCheck = useCallback(
    (note: Note, itemId: string, seed: boolean) => {
      const key = checkKey(note.id, itemId);
      const nextValue = !(checks[key] ?? seed);
      persistChecks({ ...checks, [key]: nextValue });
    },
    [checks, persistChecks]
  );

  /** Progress counts the LIVE checklist state, so a toggle moves the meter. */
  const checkedCount = useCallback(
    (note: Note) => {
      let done = 0;
      for (const b of note.blocks) {
        if (b.kind === "check" && isChecked(note, b.id, b.done)) done += 1;
      }
      return done;
    },
    [isChecked]
  );

  const newNote = useCallback(() => {
    const n = notes.filter((x) => x.id.startsWith("n-new-")).length + 1;
    const draft: Note = {
      id: `n-new-${n}`,
      title: "Untitled note",
      tags: ["product"],
      folder: "Inbox",
      updatedMins: 0,
      created: "Today",
      blocks: [
        { kind: "title", text: "Untitled note" },
        {
          kind: "para",
          text: "Start writing. Checklist items for actions, a code block when the note needs one, and a quote when someone else said it better.",
        },
        { kind: "check", id: `n-new-${n}-c1`, text: "Give the note a real title", done: false },
        { kind: "check", id: `n-new-${n}-c2`, text: "Pick the tags it belongs to", done: false },
      ],
    };
    setNotes([draft, ...notes]);
    openNote(draft.id);
    notify("New note created");
  }, [notes, openNote, notify]);

  const toggleTag = useCallback((t: TagId) => {
    setTags((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));
  }, []);

  const clearTags = useCallback(() => {
    setTags([]);
    setPinnedOnly(false);
  }, []);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = notes.filter((n) => {
      if (pinnedOnly && !n.pinned) return false;
      if (tags.length > 0 && !tags.every((t) => n.tags.includes(t))) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.folder.toLowerCase().includes(q) ||
        n.tags.some((t) => t.includes(q))
      );
    });
    const byTitle = (a: Note, b: Note) => a.title.localeCompare(b.title);
    return [...list].sort((a, b) => {
      switch (sort) {
        case "title":
          return byTitle(a, b);
        case "length":
          return b.blocks.length - a.blocks.length || byTitle(a, b);
        case "recent":
          return a.updatedMins - b.updatedMins || byTitle(a, b);
      }
    });
  }, [notes, search, tags, pinnedOnly, sort]);

  const hits = useMemo(() => {
    if (!query.trim()) return [];
    const list = notes.flatMap((n) => matchNote(n, query, scope));
    return orderHits(list);
  }, [notes, query, scope]);

  const counts = useMemo(() => {
    const byTag = {} as Record<TagId, number>;
    for (const n of notes) {
      for (const t of n.tags) byTag[t] = (byTag[t] ?? 0) + 1;
    }
    return { total: notes.length, pinned: notes.filter((n) => n.pinned).length, byTag };
  }, [notes]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === activeNoteId) ?? notes[0],
    [notes, activeNoteId]
  );

  const resetAll = useCallback(() => {
    setNotes(NOTES);
    setChecks({});
    setFontSizeState("medium");
    setSortState("recent");
    setSearch("");
    setTags([]);
    setPinnedOnly(false);
    setQuery("");
    setScope("all");
    try {
      localStorage.removeItem(STORAGE.checks);
      localStorage.removeItem(STORAGE.font);
      localStorage.removeItem(STORAGE.sort);
    } catch {}
    notify("Preferences and checklist reset");
  }, [notify]);

  const value: QuillState = {
    view,
    go,
    openNote,
    notes,
    activeNoteId,
    activeNote,
    selectNote,
    newNote,
    isChecked,
    toggleCheck,
    checkedCount,
    search,
    setSearch,
    tags,
    toggleTag,
    clearTags,
    pinnedOnly,
    setPinnedOnly,
    sort,
    setSort,
    filteredNotes,
    query,
    setQuery,
    scope,
    setScope,
    hits,
    fontSize,
    setFontSize,
    paletteOpen,
    setPaletteOpen,
    toast,
    notify,
    resetAll,
    counts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuill(): QuillState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuill must be used within <QuillProvider>");
  return ctx;
}
