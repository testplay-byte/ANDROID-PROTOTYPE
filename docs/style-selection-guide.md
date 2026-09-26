# docs/style-selection-guide.md — Choosing a Design Language for a Brief

> **Read this when a user asks for a prototype but doesn't name a style** — or names a
> vibe, mood, or reference app. This guide maps intent → design language → component
> variants. Once a style is chosen, read its spec in [`docs/design-languages/<style>.md`](./design-languages/navigation.md)
> and build per [`docs/prototype-blueprint.md`](./prototype-blueprint.md).

---

## The system in 30 seconds

A prototype = **one design language** (a `data-style` token layer) + **component variants**
(BottomNav, TopBar) + the app's own screens. Styles live in `src/proto-kit/styles/*.css`;
each defines the full token contract for both themes. Components read tokens, so any
style × variant combination works — but each style doc recommends the best pair.

```tsx
// layout.tsx — import order matters (tokens, then styles, then prototype css):
import "@/proto-kit/tokens/tokens.css";
import "@/proto-kit/styles/index.css";
import "@/prototypes/<name>/<name>.css";

// page.tsx — the shell:
<DeviceThemeProvider storageKey="<name>-theme" initialTheme="dark">
  <Stage leftPanel={...} rightPanel={...}>
    <DeviceFrame theme="dark" style="carbon">   {/* ← data-style="carbon" */}
      <Screen>{/* screens */}</Screen>
      <BottomNav variant="labeled" ... />       {/* ← variant per style doc */}
    </DeviceFrame>
  </Stage>
</DeviceThemeProvider>
```

Omitting `style` gives the default **Material 3** layer (all pre-2026 prototypes).

---

## The 11 design languages

| `style` id | Name | Personality | Signature | Nav / TopBar |
|---|---|---|---|---|
| `m3` *(default)* | Material 3 Expressive | Android-native, tonal, playful | Tonal surface tiers, pill shapes, emphasized motion | floating / large |
| `hig` | Apple HIG | iOS-native, clean, calm | True-black or grouped-gray, translucent tab bar, hairlines | tabbar / center |
| `carbon` | IBM Carbon | Enterprise, precise, flat | Gray layers, 0px radii, 1px borders, IBM blue | labeled / inline |
| `neumorph` | Neumorphism | Soft, tactile, extruded plastic | Dual soft shadows, surfaces = background | soft / large |
| `glass` | Glassmorphism | Frosty, dimensional, ambient | Translucent blur panels, luminous 1px borders | glass / center |
| `brutalism` | Neo-brutalism | Raw, loud, unapologetic | 2px borders, hard offset shadows, yellow/black | hard / hero |
| `clay` | Claymorphism | Puffy, friendly, toy-like | Triple puffy shadows, pastels, chunky radii | soft / hero |
| `bauhaus` | Bauhaus | Geometric, primary, bold | Red/blue/yellow blocks, 2px ink borders, no shadows | hard / hero |
| `minimal` | Minimalism | Quiet, monochrome, spacious | Hairlines only, ink = primary, whitespace | floating / large |
| `bento` | Bento grid | Widget-dashboard, scannable | Rounded tiles in mixed-height grids, one vivid accent | floating / large |
| `flat` | Flat Design 2.0 | Solid color blocks, zero depth | No shadows/gradients ever; contrast = depth | labeled / inline |

Full specs with exact hex values: [`docs/design-languages/`](./design-languages/navigation.md).

---

## Intent → style mapping

When the user describes a **vibe**, map it here. When in doubt between two, pick the
one whose "Avoid when" list doesn't disqualify it — and say so in the prototype's README.

| The user says… | Pick | Because |
|---|---|---|
| "Android app", "Material", "Google-like" | `m3` | The canonical Android language |
| "iOS", "iPhone", "Apple-like", "native iOS" | `hig` | iOS system look, translucent tab bar |
| "Enterprise", "corporate", "dashboard", "B2B", "banking" | `carbon` | Flat precision, data-dense |
| "Soft", "tactile", "squishy buttons", "extruded" | `neumorph` | The soft-UI signature |
| "Frosted", "blur", "translucent", "fancy weather/media" | `glass` | Blur panels need ambient color behind |
| "Bold", "loud", "raw", "streetwear", "anti-design" | `brutalism` | Thick borders, hard shadows |
| "Cute", "playful", "kids", "friendly", "puffy" | `clay` | Pastel + puffy shadows |
| "Geometric", "primary colors", "artistic", "poster-like" | `bauhaus` | The triad + geometry |
| "Clean", "monochrome", "elegant", "quiet" | `minimal` | Ink & paper only |
| "Widgets", "at-a-glance", "tiles", "home dashboard" | `bento` | The tile grid is the point |
| "Simple color blocks", "flat", "no shadows" | `flat` | Depth from color only |

**Reference-app mapping** (user names an existing app): iOS Settings/Reminders → `hig`;
Google/Android system apps → `m3`; enterprise IBM/Salesforce-style → `carbon`;
Robinhood-ish bold money apps → `brutalism` or `flat`; Duolingo-ish playful → `clay`;
widget dashboards (iOS StandBy, smart-home hubs) → `bento`; Notion/Things-style calm
productivity → `minimal`.

**App-category defaults** (user gives a category only):
finance/fintech → `carbon` or `minimal`; weather/media → `glass` or `m3`; fitness/health →
`hig`; food delivery → `flat` or `m3`; kids/education → `clay`; music → `neumorph` or
`minimal`; smart home/IoT → `bento`; commerce/streetwear → `brutalism`; galleries/museums →
`bauhaus`; notes/habits → `minimal`; chat → `flat` or `hig`.

---

## Rules for choosing (agent checklist)

1. **Explicit style request wins.** If the user names one of the 11, use exactly that.
2. **Palette preference note:** the repo rule "never indigo/blue as primary" applies to
   *custom* palettes. Three styles have brand-identity blues and are **documented
   exceptions when the user asks for that style**: `hig` (iOS system blue), `carbon`
   (IBM blue-60), `bauhaus` (blue as a secondary triad color only — its primary is red).
   Do not smuggle blue into custom palettes or other styles.
3. **Theme default per style:** follow the style doc's recommendation (e.g. neumorph
   reads best in light, glass in dark). The in-app toggle still works — tokens cover
   both themes.
4. **Respect the token contract.** Never hardcode colors/spacing in screens; if the
   style's tokens can't express something, extend the style file — not the screen CSS.
5. **Variants follow the style doc.** They're recommendations, not laws — deviate only
   with a reason recorded in the prototype's README.
6. **One style per prototype.** Mixing languages inside one app breaks its identity.
   (Style-scoped sub-elements like a bento grid inside `m3` are fine — that's layout,
   not a language swap.)
7. **When the user's brief is genuinely ambiguous**, build the prototype you think
   fits best, note 1-2 alternative styles in the prototype's `navigation.md` under
   "Open questions", and flag it in the 🟩 notification — don't block on asking.

---

## Extending the system (new style)

1. Add `src/proto-kit/styles/<id>.css` defining the **full token contract** (see the
   header of `src/proto-kit/styles/index.css`) for both themes.
2. Register it in `src/proto-kit/styles/index.css` (`@import`) + `types.ts`
   (`DeviceStyle`, `DEVICE_STYLES`, `STYLE_LABELS`).
3. Write `docs/design-languages/<id>.md` following the existing docs' structure.
4. Update this guide's tables + `docs/design-languages/navigation.md`.
5. Preferably ship a demo prototype in the new style.
