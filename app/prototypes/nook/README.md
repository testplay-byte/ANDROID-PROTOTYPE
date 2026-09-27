# Nook

A typographic reading journal in the **Minimalism** design language — the
design is the type scale and the whitespace. Monochrome ink, 1px hairlines,
serif long-form reader with scroll-driven progress, tap-to-mark passages,
per-book notes with jump-to, a hairline goal ring, and a text-only bottom
tab row (no pills, no large titles).

- Live: https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/nook/
- Tabs: `#shelf` `#read` `#notes` `#you`
- Route shell: `app/prototypes/nook/page.tsx`
- State: `src/prototypes/nook/state/nook-context.tsx` (prefs/progress/notes
  persisted under `nook-*` localStorage keys)
- Style spec: `docs/design-languages/minimal.md`
- Navigation map + decisions: [navigation.md](./navigation.md)
