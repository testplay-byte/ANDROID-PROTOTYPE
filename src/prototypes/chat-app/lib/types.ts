/**
 * chat-app / lib / types — shared types for the flat chat prototype.
 */

/** Token role used for an avatar's flat saturated circle color. */
export type AccentRole = "primary" | "secondary" | "tertiary" | "error" | "success" | "warn";

export interface Message {
  id: string;
  text: string;
  /** HH:MM timestamp label. */
  time: string;
  mine: boolean;
  /** Day divider label the message belongs under ("Today", "Yesterday"...). */
  day: string;
}

export interface Chat {
  id: string;
  name: string;
  initials: string;
  accent: AccentRole;
  online: boolean;
  /** Short status for the detail header when offline. */
  lastSeen?: string;
  unread: number;
  /** Preview shown in the list (kept in sync loosely — prototype data). */
  preview: string;
  previewTime: string;
  messages: Message[];
}

export type CallType = "incoming" | "outgoing" | "missed";

export interface CallEntry {
  id: string;
  name: string;
  initials: string;
  accent: AccentRole;
  type: CallType;
  /** e.g. "Today, 09:15" */
  when: string;
  /** Call duration label for answered calls. */
  duration?: string;
}
