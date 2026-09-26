"use client";

/**
 * chat-app / screens / chats-screen — chat list.
 *
 * Flat search bar (--color-surface-2) filtering the list, then clean
 * geometric rows: initials avatar in a flat saturated circle, name, last
 * message, time, and an unread count badge in solid primary teal.
 * Tapping a row pushes the chat detail view.
 */
import { useState } from "react";
import { TopBar, useKeyboardInput } from "../../../proto-kit";
import { Avatar } from "../components/avatar";
import type { Chat } from "../lib/types";
import styles from "./chats-screen.module.css";

interface ChatsScreenProps {
  active: boolean;
  chats: Chat[];
  onlineCount: number;
  onOpenChat: (id: string) => void;
}

export function ChatsScreen({
  active,
  chats,
  onlineCount,
  onOpenChat,
}: ChatsScreenProps) {
  const [query, setQuery] = useState("");
  const kb = useKeyboardInput({ value: query, onChange: setQuery, enterLabel: "Search" });

  const filtered = chats.filter(
    (c) =>
      c.name.toLowerCase().includes(query.trim().toLowerCase()) ||
      c.preview.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="chats"
      aria-label="Chats"
      aria-hidden={!active}
    >
      <TopBar variant="inline" title="Chats" subtitle={`${onlineCount} online`} />
      <div className={styles.content}>
        {/* Flat search bar */}
        <div className={styles.searchWrap}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.searchIcon}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            {...kb}
            className={styles.searchInput}
            placeholder="Search messages"
            value={query}
            aria-label="Search messages"
          />
          {query && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Chat rows */}
        <div className={styles.list}>
          {filtered.length === 0 && (
            <p className={styles.empty}>No chats match "{query}"</p>
          )}
          {filtered.map((chat) => (
            <button
              key={chat.id}
              type="button"
              className={styles.row}
              onClick={() => onOpenChat(chat.id)}
            >
              <Avatar initials={chat.initials} accent={chat.accent} />
              <span className={styles.rowMain}>
                <span className={styles.rowTop}>
                  <span className={styles.rowName}>{chat.name}</span>
                  <span
                    className={`${styles.rowTime} ${chat.unread > 0 ? styles.rowTimeUnread : ""}`}
                  >
                    {chat.previewTime}
                  </span>
                </span>
                <span className={styles.rowBottom}>
                  <span className={styles.rowPreview}>{chat.preview}</span>
                  {chat.unread > 0 && (
                    <span className={styles.badge}>{chat.unread}</span>
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
