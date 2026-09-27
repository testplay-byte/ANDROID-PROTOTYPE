# wallet — navigation

## What this prototype is

**"Wallet"** — an Apple Wallet–style passes & payments app built in the
**iOS 26/27 "Liquid Glass"** language on top of the repo's `hig` design
system. Base tokens come from `src/proto-kit/styles/hig.css` (iOS system
palette, SF type scale, inset-grouped lists, hairlines); the glass material
itself — floating translucent bars, luminous hairline edges, the iOS 27
Clear ↔ Tinted density setting — is implemented per-prototype in
`src/prototypes/wallet/wallet.css` under `.wl` (see "Non-obvious decisions").

Five mock passes (two cards, transit, boarding pass, loyalty) sit in a
fanned stack; payments go through an Apple Pay–style glass keypad with a
Face ID confirmation and land in the Activity feed.

## Screens

| Screen | View id | Contents |
|--------|---------|----------|
| Passes | `#passes` | Large-title glass nav bar (search → Activity with focus, add-pass toast); fanned pass stack (tap a peeking pass to spring it to the front); glass quick actions (Pay / Activity / Details); "Recent activity · <pass>" inset-group list with per-pass transactions; "See all activity" link. |
| Activity | `#activity` | Search field (filters by merchant, category or pass name, live), transactions grouped by day (Today / Yesterday / weekday labels) with hairline separators, tinted initial discs, signed tabular amounts, empty state, simulated-data footnote. |
| Pay | `#pay` | Inline-only nav bar; contact row (4 avatars, radio selection); big amount readout ($ int + dim cents); round glass keypad (decimal-capable, max 2 frac digits, 7-digit cap, del key); Request (toast) + Pay (system blue) buttons; Face ID–style processing spinner (~950 ms) → toast + the payment **appends to the Activity feed** on the selected pass. |
| Settings | `#settings` | iOS grouped lists: Liquid Glass density segmented (Clear ↔ Tinted, persisted), device Appearance segmented (Dark/Light via `useDeviceTheme`), Default Card row (→ Passes), Express Transit / Face ID / Transactions / Offers switches, About row (toast), footnotes. |

## Interactions

- **Pass stack** — tap any peeking pass → it springs to the front
  (`translateY`/`scale` reorder, 450ms iOS sheet curve); the quick actions,
  Details toast and Recent-activity section follow the selected pass.
- **Pay flow** — keypad builds the amount live; Pay disabled at $0;
  processing state disables the keypad; success toast names contact, amount
  and card; the txn appears at the top of Activity (session-only, not
  persisted).
- **Activity search** — instant filtering, day groups re-render, quoted
  empty state.
- **Glass density** — Clear ↔ Tinted retints every glass surface live
  (`data-glass` on `.wl` drives the `--glass-*` tokens); persisted.
- **Theme** — Dark/Light flips the device scope (`.device[data-theme]`);
  glass, tints and frame all re-scope; persisted as `wallet-theme`.
- **Nav bar collapse** — scroll content past 40px → large title collapses,
  glass inline bar + status-bar backdrop fade in (`useIosCollapse`).
- **Swipe** — horizontal drag navigates the four tabs (`useSwipeSimulation`).
- All prefs persist in `localStorage` under `wallet-prefs-v1`.

## Files

| File | What it is |
|------|------------|
| `app/prototypes/wallet/layout.tsx` | Imports tokens.css + styles/index.css + `wallet.css`; metadata. |
| `app/prototypes/wallet/page.tsx` | Client shell: DeviceThemeProvider (`wallet-theme`, initial dark) → WalletProvider → Stage panels → DeviceFrame (`style="hig"`) → `.wl` app root (screens, floating glass tab bar, toast); hash router + swipe wiring; side-panel MiniBar/kvlist helpers. |
| `src/prototypes/wallet/wallet.css` | The Liquid Glass layer: `--ios-*` type/motion tokens, `--glass-*` material tokens per density × theme, glass navbar/tabbar/keys/buttons, inset-grouped lists, pass art, pay screen, toast, a11y fallbacks, stage-panel helpers. |
| `src/prototypes/wallet/lib/data.ts` | 5 mock passes (gradient art tokens, cents balances), 16 transactions pinned around 2026-09-27, 4 contacts, `money()` / `dayLabel()` formatters. |
| `src/prototypes/wallet/state/wallet-context.tsx` | Central provider: prefs (persisted), selected pass, session txns (`addTxn` prepends), pay-to contact, toast. |
| `src/prototypes/wallet/components/ios.tsx` | `IosNavBar` (large-title → glass inline collapse), `IosSwitch` (51×31), `IosSegmented`, `useIosCollapse` — re-skinned for Liquid Glass (same pattern as fitness-tracker's; copied per the no-cross-prototype-import rule). |
| `src/prototypes/wallet/components/pass-card.tsx` | `PassArt` (gradient + sheen + grain + glyph per kind) and `PassStack` (fanned stack, tap-to-front). |
| `src/prototypes/wallet/screens/*.tsx` | `passes-screen.tsx`, `activity-screen.tsx`, `pay-screen.tsx`, `settings-screen.tsx`. |

## Non-obvious decisions (for future agents)

- **Liquid Glass lives in the prototype, not in proto-kit.** The `glass`
  style in `src/proto-kit/styles/` is the *glassmorphism* design language
  (generic frosted panels). This prototype needs Apple's specific iOS 26/27
  material over the *hig* token layer, so the recipe (blur 28px + saturate
  1.8, luminous hairline, inset highlight, density variants) is scoped under
  `.wl` in `wallet.css`. Do not move it into proto-kit without checking the
  glass-style prototypes.
- **`prefers-reduced-transparency` is deliberately NOT honored** (only
  `prefers-contrast: more` solidifies the glass). This machine reports
  reduced transparency by default (Windows transparency effects off), which
  would render the entire design language invisible to the reviewer — the
  same deliberate call weather-app made for its glass rebuild (see its
  navigation.md). Keep the comment above the fallback when editing.
- **Dark glass is lighter than the surface** (`rgba(70,70,76,.5)` over
  `#000`/`#1c1c1e`) — that inversion is the iOS 27 change; don't "fix" it
  back to a darker scrim.
- **`IosNavBar` sits at `top: 36px`** (proto-kit status bar height) and
  paints a glass backdrop strip up behind the status bar when collapsed, so
  scrolled content never peeks under the clock.
- **Amounts are integer cents** everywhere (`data.ts` comment); `money()`
  uses U+2212 minus for negatives to match iOS typography.
- **TXNS dates are pinned to 2026-09-27** (`D(day)` helper) so the
  Today/Yesterday labels match the curated data; payments made in-session
  use the real clock date and simply group as their own day.
- **The pay-to contact + selected pass are shared app state** (context), so
  the Pay screen's "to X / with Y" line, the Passes screen selection and the
  Settings "Default Card" row all stay in sync.
- **Side-panel "Pass" mini-bar shows the active pass name** (first word) —
  it tracks `selectedId` live.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/wallet/
