# Wallet (HIG · iOS 26/27 Liquid Glass)

An Apple Wallet–style passes & payments prototype in the iOS 26/27
**Liquid Glass** language: floating glass tab bar and collapsing nav bar,
a fanned pass stack with tap-to-front, an Apple Pay–style glass keypad
with Face ID confirmation, and the iOS 27 Clear ↔ Tinted glass density
setting. Built on `src/proto-kit` (`style="hig"` + per-prototype glass
recipe in `wallet.css`).

**Style:** HIG (iOS system palette, SF type scale, inset-grouped lists);
the Liquid Glass material is prototype-scoped. `DeviceThemeProvider
storageKey="wallet-theme"`, initial dark.

## Screens

1. **Passes** — pass stack (5 passes: 2 cards, transit, boarding,
   loyalty), glass quick actions, recent activity per pass.
2. **Activity** — searchable transactions grouped by day with hairline
   rows and signed amounts.
3. **Pay** — contact row, big amount, round glass keypad (decimals,
   limits), Request + Pay; payments append to Activity.
4. **Settings** — Clear ↔ Tinted glass density, Dark/Light, default
   card, Express Transit / Face ID / notification switches (persisted).

## Notes for agents

See `navigation.md` in this folder — especially the deliberate
`prefers-reduced-transparency` decision and why the glass recipe lives in
the prototype instead of proto-kit.

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/wallet/
