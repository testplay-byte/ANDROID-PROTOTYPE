# finance-hub — navigation

## What this prototype is

An IBM Carbon-style banking app. Flat layer-gray surfaces with 1px borders
carrying all the structure (the style's `--shadow-*` tokens are `none`),
0px border-radius on everything, IBM blue #0f62fe reserved for primary
actions and active states, tabular numerals for all money, and fast
100–150ms motion with no bounce. Four tabs: Overview, Activity, Cards and
Settings.

## Screens

| Screen | View id | Description |
|--------|---------|-------------|
| Overview | `overview` | Balance card (layer-01, 0 radius, big tabular-nums figure), 12-month spending CSS bar chart (peak month in primary blue), quick actions row (Pay / Transfer / Top up), recent transactions preview with "See all" → Activity. |
| Activity | `activity` | Filter chips (ALL/IN/OUT) above the full transaction list grouped by date (Today / Yesterday / date labels with daily sums). Tapping a row expands an inline detail block: transaction ID, bordered status tag (COMPLETED / PENDING / SCHEDULED) and type. |
| Cards | `cards` | Horizontal snap-scroll deck of two credit cards: flat layer colors, 1px borders, IBM blue accent strip, masked number, holder/expiry/balance fields. Per-card freeze toggle (custom carbon switch — bordered track, primary when on; frozen cards dim + get a FROZEN tag) and a global "show number" reveal toggle. |
| Settings | `settings` | Dark/Light theme toggle, push/email/SMS notification switches (CarbonSwitch), language select, all in 0-radius bordered groups with carbon-style 11px uppercase section labels. |

## Interactions

- Quick action buttons (Pay / Transfer / Top up) with press feedback
- "See all" on the recent-transactions preview jumps to the Activity tab
- Chart bars highlight the peak month (primary blue) and tint on hover
- Filter chips ALL/IN/OUT re-group the transaction list
- Transaction row tap → inline expansion with ID / status tag / type; tap again to collapse
- Card deck: horizontal snap scroll (mouse drag or touch)
- Freeze toggle per card → dims the card, swaps the VISA tag for FROZEN
- Show numbers → reveals full card numbers across the deck
- Theme Dark/Light → scoped to the device, persisted as `finance-hub-theme`
- Notification switches and language select are stateful
- Swipe left/right (mouse drag) navigates between the four tabs

## Files

| File | What it is |
|------|------------|
| `app/prototypes/finance-hub/layout.tsx` | Tokens + carbon style layer imports, metadata |
| `app/prototypes/finance-hub/page.tsx` | Shell + hash router + swipe wiring |
| `src/prototypes/finance-hub/finance-hub.css` | Prototype globals, stage-panel styles, scrollbar hiding |
| `src/prototypes/finance-hub/lib/types.ts` | Transaction/CreditCard/MonthSpend types |
| `src/prototypes/finance-hub/lib/data.ts` | Mock transactions, cards, 12-month spending, helpers |
| `src/prototypes/finance-hub/lib/format.ts` | Money + date-group formatting |
| `src/prototypes/finance-hub/components/carbon-switch.tsx` | Custom carbon toggle switch |
| `src/prototypes/finance-hub/components/transaction-row.tsx` | Shared transaction row (initials block + amount) |
| `src/prototypes/finance-hub/screens/overview-screen.tsx` | Balance, chart, quick actions, recent (+ module.css) |
| `src/prototypes/finance-hub/screens/activity-screen.tsx` | Filtered, grouped, expandable list (+ module.css) |
| `src/prototypes/finance-hub/screens/cards-screen.tsx` | Snap-scroll deck + freeze/reveal (+ module.css) |
| `src/prototypes/finance-hub/screens/settings-screen.tsx` | Theme, notifications, language (+ module.css) |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/finance-hub/
