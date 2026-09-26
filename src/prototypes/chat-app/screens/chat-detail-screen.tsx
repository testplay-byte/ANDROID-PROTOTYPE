"use client";

/**
 * chat-app / screens / chat-detail-screen — pushed conversation view.
 *
 * Header with back button + name + online status; message bubbles
 * (mine = solid primary teal, theirs = --color-surface-2) with timestamps
 * and day dividers; typing indicator while the auto-reply is pending;
 * input bar wired to the proto-kit custom keyboard.
 *
 * The back button calls onBack() → history.back() → popstate closes it.
 */
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useKeyboard, useKeyboardInput } from "../../../proto-kit";
import { Avatar } from "../components/avatar";
import type { Chat } from "../lib/types";
import styles from "./chat-detail-screen.module.css";

interface ChatDetailScreenProps {
  active: boolean;
  chat: Chat | null;
  /** True while the canned auto-reply is pending (shows the indicator). */
  typing: boolean;
  onSend: (text: string) => void;
  onBack: () => void;
}

export function ChatDetailScreen({
  active,
  chat,
  typing,
  onSend,
  onBack,
}: ChatDetailScreenProps) {
  const [draft, setDraft] = useState("");
  const { target } = useKeyboard();
  const kbActive = target !== null;

  const kb = useKeyboardInput({
    value: draft,
    onChange: setDraft,
    onEnter: send,
    enterLabel: "Send",
  });

  const listRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message / typing indicator.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat?.messages.length, typing, chat?.id]);

  // Clear the draft when switching conversations.
  useEffect(() => {
    setDraft("");
  }, [chat?.id]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  // Group messages under day dividers.
  const rendered: ReactNode[] = [];
  let lastDay: string | null = null;
  if (chat) {
    chat.messages.forEach((m) => {
      if (m.day !== lastDay) {
        lastDay = m.day;
        rendered.push(
          <div key={`day-${m.day}`} className={styles.dayDivider}>
            <span className={styles.dayChip}>{m.day}</span>
          </div>,
        );
      }
      rendered.push(
        <div
          key={m.id}
          className={`${styles.msgRow} ${m.mine ? styles.msgRowMine : ""}`}
        >
          <div
            className={`${styles.bubble} ${m.mine ? styles.bubbleMine : styles.bubbleTheirs}`}
          >
            <p className={styles.msgText}>{m.text}</p>
            <span
              className={`${styles.msgTime} ${m.mine ? styles.msgTimeMine : ""}`}
            >
              {m.time}
            </span>
          </div>
        </div>,
      );
    });
    if (typing) {
      rendered.push(
        <div key="typing" className={styles.msgRow}>
          <div className={`${styles.bubble} ${styles.bubbleTheirs} ${styles.typingBubble}`}>
            <span className={styles.dot} />
            <span className={`${styles.dot} ${styles.dot2}`} />
            <span className={`${styles.dot} ${styles.dot3}`} />
          </div>
        </div>,
      );
    }
  }

  return (
    <section
      className={`view ${styles.root} ${active ? "view--active" : ""}`}
      data-view="detail"
      aria-label="Chat"
      aria-hidden={!active}
    >
      {/* Header */}
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backButton}
          onClick={onBack}
          aria-label="Back to chats"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        {chat && (
          <>
            <Avatar initials={chat.initials} accent={chat.accent} size={38} />
            <span className={styles.headerInfo}>
              <span className={styles.headerName}>{chat.name}</span>
              <span
                className={`${styles.headerStatus} ${chat.online ? styles.headerStatusOnline : ""}`}
              >
                {chat.online ? "online" : chat.lastSeen ?? "offline"}
              </span>
            </span>
          </>
        )}
      </header>

      {/* Messages */}
      <div ref={listRef} className={styles.list}>
        {!chat && <p className={styles.placeholder}>Select a conversation</p>}
        {chat && rendered}
      </div>

      {/* Input bar — lifts above the on-screen keyboard while it's open */}
      <div className={`${styles.inputBar} ${kbActive ? styles.inputBarKb : ""}`}>
        <input
          {...kb}
          className={styles.input}
          placeholder="Type a message"
          value={draft}
          aria-label="Type a message"
        />
        <button
          type="button"
          className={styles.sendButton}
          onClick={send}
          aria-label="Send message"
          disabled={!draft.trim()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4z" />
          </svg>
        </button>
      </div>
    </section>
  );
}
