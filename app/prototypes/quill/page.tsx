"use client";

/**
 * quill / page — "Quill" desktop notes & knowledge app.
 *
 * Shell (copy of the meridian desktop shell, HIG instead of M3):
 *   DeviceThemeProvider (quill-theme, scoped to the SURFACE) → QuillProvider →
 *   Stage (side panels) → SurfaceFrame (surface="desktop", style="hig",
 *   windowChrome, menu bar) with:
 *     · DesktopSidebar — sectioned navigation (desktop, not a bottom bar)
 *     · DesktopTopBar  — title + ⌘K command slot + actions
 *     · the active view, plus the CommandPalette (⌘K) and a toast
 *
 * What makes it a desktop app and not a wide phone:
 *   navigation is a sidebar, the library opens a detail pane BESIDE the list,
 *   the editor has a metadata rail beside the text, ⌘K jumps between views and
 *   notes, "/" focuses search, 1–4 switch views, and Settings is a two-column
 *   form with a section list. No status bar, no bottom nav — those are
 *   phone-only and never appear on a desktop surface.
 */

import { useEffect } from "react";
import {
  DeviceThemeProvider,
  PanelBadge,
  PanelDesc,
  PanelHead,
  PanelTitle,
  Stage,
  SurfaceFrame,
  SurfaceScreen,
  DesktopSidebar,
  DesktopTopBar,
  useDeviceTheme,
  type DesktopNavItem,
} from "../../../src/proto-kit";
import { QuillProvider, VIEWS, useQuill, type ViewId } from "../../../src/prototypes/quill/state/quill-context";
import { CommandPalette } from "../../../src/prototypes/quill/components/command-palette";
import {
  LibraryIcon,
  MoonIcon,
  NoteIcon,
  PlusIcon,
  SearchIcon,
  SlidersIcon,
  SunIcon,
} from "../../../src/prototypes/quill/components/icons";
import { LibraryScreen } from "../../../src/prototypes/quill/screens/library";
import { NoteScreen } from "../../../src/prototypes/quill/screens/note";
import { SearchScreen } from "../../../src/prototypes/quill/screens/search";
import { SettingsScreen } from "../../../src/prototypes/quill/screens/settings";

const SCREEN_INFO: Record<string, { name: string; desc: string }> = {
  library: {
    name: "Library",
    desc: "The three-column window: sidebar, note list, and a preview pane that opens BESIDE the list. Search field, tag chips, pinned toggle and a three-way sort all filter the same list; ↑ ↓ preview, Enter opens.",
  },
  note: {
    name: "Note",
    desc: "The block editor beside its metadata rail. Title, paragraphs, a quote, a code block and a checklist whose checkboxes really toggle — the progress meter and the word count follow.",
  },
  search: {
    name: "Search",
    desc: "Grouped results by where the match landed (Title / Checklist / Note / Code) with the matched span highlighted. ↑ ↓ walk the notes, Enter opens one in the editor.",
  },
  settings: {
    name: "Settings",
    desc: "Two-column desktop form: a section list on the left, its controls on the right. Theme scopes to the window; font size re-scales the editor for real; plus the keyboard reference.",
  },
};

function Shell() {
  const { view, go, setPaletteOpen, toast, notify, newNote, counts } = useQuill();
  const { theme, toggleTheme } = useDeviceTheme();

  /* "/" focuses the library search and 1–4 jump between views — desktop
     shortcuts, not mobile gestures. Both are ignored while typing. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "/") {
        e.preventDefault();
        go("library");
        window.setTimeout(
          () => document.querySelector<HTMLInputElement>("#ql-library-search")?.focus(),
          60
        );
      }
      if (/^[1-4]$/.test(e.key)) {
        go(VIEWS[Number(e.key) - 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const navItems: DesktopNavItem[] = [
    { id: "section-notes", label: "Notes", icon: <></>, kind: "section" },
    { id: "library", label: "Library", icon: <LibraryIcon />, badge: counts.total },
    { id: "note", label: "Open note", icon: <NoteIcon /> },
    { id: "search", label: "Search", icon: <SearchIcon /> },
    { id: "section-app", label: "Application", icon: <></>, kind: "section" },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  const current = SCREEN_INFO[view];

  return (
    <Stage
      leftPanel={
        <>
          <PanelBadge>desktop</PanelBadge>
          <PanelTitle>Quill</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            <span className="tag">HIG</span>
            <span className="tag">Desktop</span>
            <span className="tag">1280×800</span>
            <span className="tag">⌘K palette</span>
          </div>
          <PanelHead>
            <span className="sidepanel__note">
              A notes app built the desktop way: sidebar, detail pane beside the list, command
              palette, keyboard map.
            </span>
          </PanelHead>
        </>
      }
      rightPanel={
        <>
          <PanelBadge>screen</PanelBadge>
          <PanelTitle>{current.name}</PanelTitle>
          <PanelDesc>{current.desc}</PanelDesc>
          <div className="tags">
            {VIEWS.map((v) => (
              <span className="tag" key={v.id}>
                {v.label}
              </span>
            ))}
          </div>
        </>
      }
    >
      <SurfaceFrame
        surface="desktop"
        style="hig"
        theme="light"
        windowChrome
        windowTitle="Quill — Notes"
        menu={["File", "Edit", "View", "Note", "Window", "Help"]}
      >
        <DesktopSidebar
          items={navItems}
          activeId={view}
          onSelect={(id) => go(id as ViewId)}
        />
        <div className="ql-main">
          <DesktopTopBar
            title={current.name}
            subtitle="Quill · notes & knowledge"
            tools={
              <button
                className="ql-searchbtn"
                type="button"
                onClick={() => setPaletteOpen(true)}
              >
                <SearchIcon size={15} />
                <span>Search or jump to…</span>
                <kbd>⌘K</kbd>
              </button>
            }
            actions={
              <>
                <button
                  className="ql-btn ql-btn--filled"
                  type="button"
                  onClick={newNote}
                >
                  <PlusIcon size={15} /> New note
                </button>
                <button
                  className="ql-iconbtn"
                  type="button"
                  aria-label={theme === "dark" ? "Switch to light" : "Switch to dark"}
                  title={theme === "dark" ? "Switch to light" : "Switch to dark"}
                  onClick={() => {
                    toggleTheme();
                    notify(theme === "dark" ? "Light appearance" : "Dark appearance");
                  }}
                >
                  {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
                </button>
                <span className="ql-avatar" aria-hidden="true">
                  RK
                </span>
              </>
            }
          />
          <SurfaceScreen>
            {view === "library" && <LibraryScreen />}
            {view === "note" && <NoteScreen />}
            {view === "search" && <SearchScreen />}
            {view === "settings" && <SettingsScreen />}
          </SurfaceScreen>
          <CommandPalette />
          {toast && (
            <div className="ql-toast" role="status">
              {toast}
            </div>
          )}
        </div>
      </SurfaceFrame>
    </Stage>
  );
}

export default function Page() {
  return (
    <DeviceThemeProvider storageKey="quill-theme" initialTheme="light">
      <QuillProvider>
        <Shell />
      </QuillProvider>
    </DeviceThemeProvider>
  );
}
