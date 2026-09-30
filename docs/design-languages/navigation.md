# docs/design-languages/ — Style Guides for the 11 Design Languages

> One spec per design language supported by the proto-kit style system
> (`src/proto-kit/styles/`). Read [`../style-selection-guide.md`](../style-selection-guide.md)
> first if you need to *choose* a style for a brief; read the individual
> spec before *building* in that style.

---

## Index

| File | Style (`data-style`) | Identity | Recommended nav / top bar |
|---|---|---|---|
| [`m3`](../design-systems/material-3-expressive/navigation.md) | *(default — no attribute)* | Material 3 Expressive (Android) | floating / large |
| [`hig.md`](./hig.md) | `hig` | Apple Human Interface Guidelines | tabbar / center |
| [`carbon.md`](./carbon.md) | `carbon` | IBM Carbon Design System | labeled / inline |
| [`neumorph.md`](./neumorph.md) | `neumorph` | Neumorphism (Soft UI) | soft / large |
| [`glass.md`](./glass.md) | `glass` | Glassmorphism | glass / center |
| [`brutalism.md`](./brutalism.md) | `brutalism` | Neo-brutalism | hard / hero |
| [`clay.md`](./clay.md) | `clay` | Claymorphism | soft / hero |
| [`bauhaus.md`](./bauhaus.md) | `bauhaus` | Bauhaus geometric | hard / hero |
| [`minimal.md`](./minimal.md) | `minimal` | Minimalism / monochrome | floating / large |
| [`bento.md`](./bento.md) | `bento` | Bento grid | floating / large |
| [`flat.md`](./flat.md) | `flat` | Flat Design 2.0 | labeled / inline |

The default `m3` language is documented in [`docs/design-systems/material-3-expressive/`](../design-systems/material-3-expressive/navigation.md)
(tokens live in `src/proto-kit/tokens/tokens.css`; no `data-style` attribute needed).

---

## Every spec contains

- **Identity** — what the language looks/feels like and where it comes from
- **Use when / Avoid when** — fit guidance
- **Palette** — exact dark + light token values
- **Shape, shadow & border signature** — what makes it physically recognizable
- **Must-use tokens** — the tokens a prototype must use to read correctly
- **Recommended components** — BottomNav + TopBar variants and component do/don'ts
- **Common mistakes** — what agents typically get wrong
- **Wiring** — the exact layout.tsx / page.tsx setup

---

## How the style system works (for reference)

- `<DeviceFrame style="<id>">` sets `data-style="<id>"` on `.device`.
- Each style CSS file defines the **full token contract** (see the header of
  [`../../src/proto-kit/styles/index.css`](../../src/proto-kit/styles/index.css))
  for both themes.
- Component variants (`BottomNav`, `TopBar`) read tokens — style-agnostic.
- Tokens stay scoped to `.device`; `:root`, `<html>` and stage tokens are never
  touched by a style (see [`../theme-architecture.md`](../theme-architecture.md)).

*Last updated: multi-design-language expansion (2026-09-26) — 10 new style layers
+ specs added; M3 remains the default.*
