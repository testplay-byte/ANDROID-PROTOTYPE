# chat-app — navigation

## What this prototype is

A Flat Design 2.0 messenger: solid teal/coral color blocks, generous
padding, clean geometric rows, and ZERO box-shadows anywhere — depth
comes purely from `--color-surface-*` contrast. Includes a chat list with
search, a pushed conversation view wired to the proto-kit on-screen
keyboard (with typing indicator + 1s canned auto-replies), a calls list
with a "Calling..." overlay, and flat settings.

## Screens

| Screen      | View id     | Description |
|-------------|-------------|-------------|
| Chats       | `chats`     | Inline top bar ("Chats · N online"), flat search bar, chat rows (initials avatar in a flat saturated circle, name, last message, time, teal unread badge). Tap opens chat detail. |
| Chat Detail | `chat{id}`  | Pushed view (slides from right; browser back closes). Header with back button + name + online status; teal (mine) / surface (theirs) bubbles with timestamps; day dividers; typing indicator; input bar using the custom on-screen keyboard; send appends the message and a canned auto-reply arrives after 1s. |
| Calls       | `calls`     | Rows with direction icons in flat colored circles (arrow-down-left / arrow-up-right / x), call duration, and a per-row call button that shows a brief "Calling..." overlay. |
| Settings    | `settings`  | Flat profile row, theme toggle (useDeviceTheme), notifications toggle, read receipts toggle. |

## Interactions

- Search input filters the chat list (uses the custom keyboard)
- Chat row tap → pushes detail (clears unread badge); browser back / back button / swipe right closes
- Message input → custom on-screen keyboard; Enter or send button delivers; input bar lifts above the keyboard
- Auto-reply: typing indicator for 1s, then a canned reply per chat (cycled)
- Call button → "Calling {name}..." overlay; auto-dismisses after 2s or tap End
- Theme toggle (light/dark, persisted via `chat-app-theme`), notifications + read receipts toggles
- Swipe left/right (mouse drag) navigates between tabs

## Files

| File | What it is |
|------|------------|
| `app/prototypes/chat-app/layout.tsx` | Tokens + styles imports, metadata |
| `app/prototypes/chat-app/page.tsx` | Shell + hash router + thread state + auto-replies + Keyboard |
| `src/prototypes/chat-app/chat-app.css` | Prototype-wide globals + view stack (detail slide) |
| `src/prototypes/chat-app/lib/types.ts` | Shared types |
| `src/prototypes/chat-app/lib/data.ts` | Chats, messages, calls, canned replies |
| `src/prototypes/chat-app/components/*.tsx` | Avatar, FlatSwitch |
| `src/prototypes/chat-app/screens/*.tsx` | One file per screen (+ module.css) |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/chat-app/
