"use client";

/**
 * chat-app / page — the prototype entry point.
 *
 * Renders the full shell:
 *   DeviceThemeProvider (theme, scoped to .device, flat style) →
 *   KeyboardProvider (custom on-screen keyboard) →
 *   Stage (left/right info panels + device) →
 *   DeviceFrame → Screen → (all views always mounted; visibility via
 *   .view--active; chat detail slides in from the right) + BottomNav
 *   (labeled variant, hidden when the detail view is open) + <Keyboard />.
 *
 * Hash router:
 *   #chats / #calls / #settings → that view.
 *   #chat{id} → pushed detail view (pushState, so browser back closes it).
 *
 * Chat messages live in page state so threads persist when closing the
 * detail view. Sending a message shows a typing indicator, then appends
 * a canned auto-reply after 1s.
 */
import { useEffect, useRef, useState } from "react";
import {
  DeviceThemeProvider,
  DeviceFrame,
  Screen,
  Stage,
  BottomNav,
  PanelBadge,
  PanelTitle,
  PanelDesc,
  PanelHead,
  useSwipeSimulation,
  KeyboardProvider,
  Keyboard,
} from "../../../src/proto-kit";
import { ChatsScreen } from "../../../src/prototypes/chat-app/screens/chats-screen";
import { ChatDetailScreen } from "../../../src/prototypes/chat-app/screens/chat-detail-screen";
import { CallsScreen } from "../../../src/prototypes/chat-app/screens/calls-screen";
import { SettingsScreen } from "../../../src/prototypes/chat-app/screens/settings-screen";
import {
  CALLS,
  CANNED_REPLIES,
  INITIAL_CHATS,
  countOnline,
} from "../../../src/prototypes/chat-app/lib/data";
import type { Chat } from "../../../src/prototypes/chat-app/lib/types";

type ViewId = "chats" | "calls" | "settings" | "detail";

const NAV_ITEMS = [
  {
    id: "chats",
    label: "Chats",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: "calls",
    label: "Calls",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SCREEN_INFO: Record<ViewId, { name: string; desc: string }> = {
  chats: {
    name: "Chats",
    desc: "Flat search bar + chat list rows (initials avatar, last message, time, teal unread badge). Tap to open the conversation.",
  },
  calls: {
    name: "Calls",
    desc: "Incoming / outgoing / missed call rows with direction icons in flat colored circles. Tap the call button for a 'Calling...' overlay.",
  },
  settings: {
    name: "Settings",
    desc: "Flat settings: profile row, theme toggle, notifications and read receipts. Zero shadows — depth from surface tones only.",
  },
  detail: {
    name: "Chat Detail",
    desc: "Pushed conversation: back header + online status, teal/surface bubbles with timestamps, day dividers, typing indicator, on-screen keyboard input with 1s canned auto-reply.",
  },
};

// ---------------------------------------------------------------------------
// Hash parsing
// ---------------------------------------------------------------------------

interface HashState {
  view: ViewId;
  chatId: string | null;
}

function parseHash(): HashState {
  if (typeof window === "undefined") return { view: "chats", chatId: null };
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash || hash === "chats") return { view: "chats", chatId: null };
  if (hash === "calls" || hash === "settings") {
    return { view: hash, chatId: null };
  }
  if (hash.startsWith("chat")) {
    const id = hash.replace("chat", "");
    if (id) return { view: "detail", chatId: id };
  }
  return { view: "chats", chatId: null };
}

function nowLabel(): string {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Page() {
  const [view, setView] = useState<ViewId>("chats");
  const [chatId, setChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [typingChatId, setTypingChatId] = useState<string | null>(null);
  const replyIndexRef = useRef<Record<string, number>>({});

  // Read hash on mount.
  useEffect(() => {
    if (window.location.hash === "") {
      try {
        history.replaceState(null, "", "#chats");
      } catch {
        /* sandbox may block hash writes — ignore */
      }
      setView("chats");
      setChatId(null);
    } else {
      const s = parseHash();
      setView(s.view);
      setChatId(s.chatId);
    }
  }, []);

  // Listen for back/forward.
  useEffect(() => {
    function onPop() {
      const s = parseHash();
      setView(s.view);
      setChatId(s.chatId);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Bottom nav click.
  function handleNav(id: string) {
    if (id === view) return;
    try {
      history.pushState(null, "", `#${id}`);
    } catch {
      /* ignore */
    }
    setView(id as ViewId);
    setChatId(null);
  }

  // Open chat detail — pushState so the browser's back button closes it.
  function openChat(id: string) {
    try {
      history.pushState({ view: "detail", id }, "", `#chat${id}`);
    } catch {
      /* sandbox may block — fall through to state update only */
    }
    setView("detail");
    setChatId(id);
    // Opening a chat clears its unread badge.
    setChats((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    );
  }

  // Back button on the detail screen → history.back() → popstate fires.
  function closeDetail() {
    history.back();
  }

  // Send a message: append it, show the typing indicator, then append a
  // canned auto-reply after 1s.
  function handleSend(text: string) {
    if (!chatId) return;
    const id = chatId;
    setChats((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `sent-${Date.now()}`,
                  text,
                  time: nowLabel(),
                  mine: true,
                  day: "Today",
                },
              ],
            }
          : c,
      ),
    );
    setTypingChatId(id);
    window.setTimeout(() => {
      const idx = replyIndexRef.current[id] ?? 0;
      replyIndexRef.current[id] = idx + 1;
      setChats((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                preview: CANNED_REPLIES[idx % CANNED_REPLIES.length],
                previewTime: nowLabel(),
                messages: [
                  ...c.messages,
                  {
                    id: `reply-${Date.now()}`,
                    text: CANNED_REPLIES[idx % CANNED_REPLIES.length],
                    time: nowLabel(),
                    mine: false,
                    day: "Today",
                  },
                ],
              }
            : c,
        ),
      );
      setTypingChatId((t) => (t === id ? null : t));
    }, 1000);
  }

  // ─────────────────────────────────────────────────────────────────────
  // Swipe gestures (proto-kit). On the detail view, swipe right = back.
  // ─────────────────────────────────────────────────────────────────────
  const SWIPE_ORDER: ViewId[] = ["chats", "calls", "settings"];

  useSwipeSimulation({
    enabled: true,
    onSwipeLeft: () => {
      if (view === "detail") return;
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx >= 0 && idx < SWIPE_ORDER.length - 1) {
        handleNav(SWIPE_ORDER[idx + 1]);
      }
    },
    onSwipeRight: () => {
      if (view === "detail") {
        closeDetail();
        return;
      }
      const idx = SWIPE_ORDER.indexOf(view);
      if (idx > 0) {
        handleNav(SWIPE_ORDER[idx - 1]);
      }
    },
  });

  const info = SCREEN_INFO[view];
  const activeChat = chats.find((c) => c.id === chatId) ?? null;
  const navActiveId = view === "detail" ? "" : view;

  return (
    <DeviceThemeProvider storageKey="chat-app-theme" initialTheme="light">
      <KeyboardProvider>
        <Stage
          leftPanel={
            <>
              <PanelBadge>prototype</PanelBadge>
              <PanelTitle>Chat App</PanelTitle>
              <PanelDesc>
                A Flat Design 2.0 messenger with chats, calls, settings and a
                pushed conversation view. Message input uses the custom
                on-screen keyboard; auto-replies arrive after one second.
                Zero shadows — depth comes from surface tones and the bold
                teal accent.
              </PanelDesc>
              <div className="tags">
                <span className="tag">Flat 2.0</span>
                <span className="tag">Messenger</span>
                <span className="tag">Keyboard</span>
              </div>
            </>
          }
          rightPanel={
            <>
              <PanelHead>Screen info</PanelHead>
              <div className="screeninfo">
                <span className="screeninfo__name">{info.name}</span>
                <span className="screeninfo__desc">{info.desc}</span>
              </div>

              <PanelHead>Threads</PanelHead>
              <div className="kvlist">
                {chats.slice(0, 5).map((c) => (
                  <div className="kvlist__row" key={c.id}>
                    <span>{c.name}</span>
                    <b>{c.unread > 0 ? `${c.unread} new` : "read"}</b>
                  </div>
                ))}
              </div>

              <PanelHead>Design</PanelHead>
              <div className="kvlist">
                <div className="kvlist__row">
                  <span>Style</span>
                  <b>Flat 2.0</b>
                </div>
                <div className="kvlist__row">
                  <span>Shadows</span>
                  <b>None</b>
                </div>
                <div className="kvlist__row">
                  <span>Primary</span>
                  <b>Teal</b>
                </div>
                <div className="kvlist__row">
                  <span>Secondary</span>
                  <b>Coral</b>
                </div>
              </div>
            </>
          }
        >
          <DeviceFrame theme="light" style="flat">
            <Screen>
              <ChatsScreen
                active={view === "chats"}
                chats={chats}
                onlineCount={countOnline(chats)}
                onOpenChat={openChat}
              />
              <CallsScreen active={view === "calls"} calls={CALLS} />
              <SettingsScreen active={view === "settings"} />

              {/* Chat detail (pushed view) — slides in from the right. */}
              <ChatDetailScreen
                active={view === "detail"}
                chat={activeChat}
                typing={typingChatId === chatId && view === "detail"}
                onSend={handleSend}
                onBack={closeDetail}
              />
            </Screen>

            {/* Bottom nav — hidden when the detail view is open. */}
            {view !== "detail" && (
              <BottomNav
                items={NAV_ITEMS}
                activeId={navActiveId}
                onSelect={handleNav}
                variant="labeled"
              />
            )}

            {/* Custom on-screen keyboard (replaces native soft keyboard) */}
            <Keyboard />
          </DeviceFrame>
        </Stage>
      </KeyboardProvider>
    </DeviceThemeProvider>
  );
}
