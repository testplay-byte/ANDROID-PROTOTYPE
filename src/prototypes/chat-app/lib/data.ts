/**
 * chat-app / lib / data — realistic mock chats, messages, calls, replies.
 */
import type { CallEntry, Chat } from "./types";

export const CURRENT_USER = "Alex";

export const INITIAL_CHATS: Chat[] = [
  {
    id: "maya",
    name: "Maya Chen",
    initials: "MC",
    accent: "primary",
    online: true,
    unread: 2,
    preview: "Are we still on for lunch?",
    previewTime: "09:41",
    messages: [
      { id: "m1", text: "Morning! Did you see the design review notes?", time: "09:02", mine: false, day: "Yesterday" },
      { id: "m2", text: "Yes — I left a few comments on the flat style tokens", time: "09:05", mine: true, day: "Yesterday" },
      { id: "m3", text: "Perfect. I'll fold them in before standup", time: "09:10", mine: false, day: "Yesterday" },
      { id: "m4", text: "Hey, are we still on for lunch today?", time: "09:38", mine: false, day: "Today" },
      { id: "m5", text: "Absolutely. That ramen place at 12:30?", time: "09:41", mine: true, day: "Today" },
      { id: "m6", text: "Are we still on for lunch?", time: "09:41", mine: false, day: "Today" },
    ],
  },
  {
    id: "diego",
    name: "Diego Ruiz",
    initials: "DR",
    accent: "secondary",
    online: true,
    unread: 0,
    preview: "Shipping the update tonight",
    previewTime: "08:57",
    messages: [
      { id: "d1", text: "The build passed all checks", time: "08:40", mine: false, day: "Today" },
      { id: "d2", text: "Nice work! Any regressions?", time: "08:45", mine: true, day: "Today" },
      { id: "d3", text: "None. Shipping the update tonight", time: "08:57", mine: false, day: "Today" },
    ],
  },
  {
    id: "priya",
    name: "Priya Sharma",
    initials: "PS",
    accent: "tertiary",
    online: false,
    lastSeen: "last seen 30 min ago",
    unread: 1,
    preview: "Sent you the itinerary",
    previewTime: "Yesterday",
    messages: [
      { id: "p1", text: "Tickets are booked!", time: "17:20", mine: false, day: "Yesterday" },
      { id: "p2", text: "Amazing. How much was it?", time: "17:31", mine: true, day: "Yesterday" },
      { id: "p3", text: "Sent you the itinerary", time: "21:04", mine: false, day: "Yesterday" },
    ],
  },
  {
    id: "team",
    name: "Design Team",
    initials: "DT",
    accent: "success",
    online: true,
    unread: 0,
    preview: "Sam: teal looks so much better",
    previewTime: "Yesterday",
    messages: [
      { id: "t1", text: "New palette vote: teal vs coral", time: "14:10", mine: false, day: "Yesterday" },
      { id: "t2", text: "Teal, no contest", time: "14:12", mine: true, day: "Yesterday" },
      { id: "t3", text: "Sam: teal looks so much better", time: "14:15", mine: false, day: "Yesterday" },
    ],
  },
  {
    id: "omar",
    name: "Omar Haddad",
    initials: "OH",
    accent: "error",
    online: false,
    lastSeen: "last seen 2 hours ago",
    unread: 0,
    preview: "Thanks for the files!",
    previewTime: "Tuesday",
    messages: [
      { id: "o1", text: "Could you resend the spec?", time: "10:02", mine: false, day: "Tuesday" },
      { id: "o2", text: "Just sent it", time: "10:06", mine: true, day: "Tuesday" },
      { id: "o3", text: "Thanks for the files!", time: "10:09", mine: false, day: "Tuesday" },
    ],
  },
  {
    id: "lena",
    name: "Lena Fischer",
    initials: "LF",
    accent: "warn",
    online: false,
    lastSeen: "last seen yesterday",
    unread: 0,
    preview: "Coffee on Friday then",
    previewTime: "Monday",
    messages: [
      { id: "l1", text: "Long time! Coffee this week?", time: "12:30", mine: false, day: "Monday" },
      { id: "l2", text: "Friday works for me", time: "12:44", mine: true, day: "Monday" },
      { id: "l3", text: "Coffee on Friday then", time: "12:45", mine: false, day: "Monday" },
    ],
  },
];

/** Count of chats whose contact is currently online (for the top bar). */
export function countOnline(chats: Chat[]): number {
  return chats.filter((c) => c.online).length;
}

/** Canned auto-replies cycled per chat after the user sends a message. */
export const CANNED_REPLIES: string[] = [
  "Haha, totally agree",
  "Sounds good to me!",
  "Let me check and get back to you",
  "Just saw this — one sec",
  "Perfect, thanks!",
  "Can we talk about it later today?",
  "That works. See you then!",
  "Sending it over now",
];

export const CALLS: CallEntry[] = [
  {
    id: "c1",
    name: "Maya Chen",
    initials: "MC",
    accent: "primary",
    type: "incoming",
    when: "Today, 08:12",
    duration: "12 min",
  },
  {
    id: "c2",
    name: "Diego Ruiz",
    initials: "DR",
    accent: "secondary",
    type: "outgoing",
    when: "Today, 07:45",
    duration: "3 min",
  },
  {
    id: "c3",
    name: "Mom",
    initials: "M",
    accent: "tertiary",
    type: "missed",
    when: "Yesterday, 21:30",
  },
  {
    id: "c4",
    name: "Priya Sharma",
    initials: "PS",
    accent: "success",
    type: "outgoing",
    when: "Yesterday, 16:20",
    duration: "27 min",
  },
  {
    id: "c5",
    name: "Unknown",
    initials: "?",
    accent: "error",
    type: "missed",
    when: "Yesterday, 11:05",
  },
  {
    id: "c6",
    name: "Omar Haddad",
    initials: "OH",
    accent: "warn",
    type: "incoming",
    when: "Tuesday, 19:12",
    duration: "8 min",
  },
];
