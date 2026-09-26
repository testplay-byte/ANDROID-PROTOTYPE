# Glassmorphism Research — doing frosted glass WELL on mobile

> Research document backing the `glass` design language (`src/proto-kit/styles/glass.css`,
> `docs/design-languages/glass.md`) and the weather-app rebuild.
> Written 2026-09-26. All contrast numbers in this doc were computed with the WCAG 2.x
> relative-luminance formula against the actual token values in this repo.

---

## 0. TL;DR — why OUR weather app reads "low quality"

Audited against the research below, the current implementation has five concrete defects
(section 7 has the fixes, prioritized):

1. **Uniform recipe everywhere.** The hero chip, every hour card, every detail tile, every
   list row, the add-row, settings cards, and even 40px icon bubbles all use the *identical*
   `surface + blur(18px) saturate(1.3) + 1px border + inset highlight` stack. Real material
   systems differentiate a *navigation layer* from a *content layer* and tier the treatment
   (Apple: "avoid glass on glass", one material with variants —
   https://css-tricks.com/getting-clarity-on-apples-liquid-glass/). A single repeated recipe
   reads as a sticker sheet, not as glass.
2. **Gray-on-gray dark theme.** `rgba(255,255,255,0.09…0.24)` over `#131a2e` spans only
   ~9 luminance points (computed: `#282f41` → `#4c5160`). Panels barely separate from the
   background, and the *higher* tiers *reduce* text contrast (muted `#b6bfd4` drops to
   **4.29:1** on surface-5; subtle `#8a94ad` to **2.61:1** — both fail WCAG AA).
3. **saturate(1.3) is too weak.** Quality recipes run **saturate(140–180%)**
   (https://github.com/2233admin/design-pipeline/blob/main/skill/references/iart-motion-skills/upstream/web-animation-skills/skills/glassmorphism/references/glass-recipes.md).
   At 1.3 the blurred blobs behind panels desaturate into gray mud — the single biggest
   "cheap" tell.
4. **Contrast fails over the blob hotspots.** Computed worst case: `--color-text-muted`
   over surface-2 above the amber blob's hot core ≈ **2.91:1** (needs 4.5). Muted and
   subtle text also fail on the plain surface ladder (4.29 / 4.40 worst cases).
5. **Missing ingredients.** No bottom inner shade (only the top highlight), no specular
   edge ring, no noise/grain (blob gradients will band on dark backgrounds), no
   `--shadow-1/2` drop shadow on most panels (they float nowhere), no
   `prefers-reduced-transparency` / `@supports` fallback, and the `--glass-highlight` token
   is defined but never used by any screen.

---

## 1. Why glassmorphism usually looks cheap — failure modes

Each failure mode below is one we can name, detect, and fix. Sources: NN/g,
https://www.nngroup.com/articles/glassmorphism/; Microsoft, https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic;
Apple, https://developer.apple.com/design/human-interface-guidelines/materials; CSS-Tricks,
https://css-tricks.com/getting-clarity-on-apples-liquid-glass/; recipes,
https://github.com/2233admin/design-pipeline/blob/main/skill/references/iart-motion-skills/upstream/web-animation-skills/skills/glassmorphism/references/glass-recipes.md.

| # | Failure mode | Why it fails visually |
|---|--------------|----------------------|
| 1 | **Blur without saturate** (`backdrop-filter: blur(20px)` alone) | Gaussian blur averages colors *and* lowers chroma; the panel shows a desaturated gray smear instead of vivid frosted color. Apple's materials and every quality recipe pair blur with a saturation boost (Acrylic's "luminosity" blend; community standard `saturate(160%)`). |
| 2 | **Muddy background / nothing to refract** | Glass is a lens; over a flat `#131a2e` field the blur output ≈ the input, so panels read as flat translucent-gray rectangles. NN/g: glass stands out "over gradients or complex backgrounds, which accentuate depth" (https://www.nngroup.com/articles/glassmorphism/). Our own `glass.md` already says this — the weather app has blobs, but they're too dim in the dark theme to register through 0.09–0.24 white. |
| 3 | **Low-contrast text on unpredictable backdrops** | A glass panel's effective background is *whatever is behind it* — contrast varies across the panel and across scroll position. NN/g: text "ends up too light or too dark, or sits over backgrounds that are too busy" (https://www.nngroup.com/articles/glassmorphism/). Microsoft explicitly warns accent-colored text on acrylic fails minimum contrast at 14px (https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic). |
| 4 | **Gray-on-gray tiers** | If the alpha ladder spans too narrow a band over a dark bg (our 0.09→0.24 case), surfaces can't be told apart — the UI loses hierarchy and looks like one blurry slab. Dark-mode systems step *luminance*, not just alpha (Aura surface system, https://lobehub.com; Practical UI dark-mode rule: shadows are nearly invisible on dark backgrounds, use lighter borders/luminance to separate). |
| 5 | **Too many competing translucent layers** | Every translucent surface multiplies noise behind the layer above. Microsoft: "Avoid layering multiple acrylic surfaces: multiple layers of background acrylic can create distracting optical illusions" and "don't place multiple acrylic panes next to each other because this results in an undesirable visible seam" (https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic). Apple: "avoid using glass on glass" (https://css-tricks.com/getting-clarity-on-apples-liquid-glass/). |
| 6 | **Missing edge treatment** | Without a 1px luminous border + top inner highlight + bottom inner shade, a translucent panel has no "thickness" — it looks like a PNG with opacity, not a material. NN/g: strokes/gradients "fake thickness" and "mimic light reflecting on glass" (https://www.nngroup.com/articles/glassmorphism/). The four-ingredient recipe: blur, translucency, **edge highlight**, **layered shadow** (glass-recipes.md). |
| 7 | **No shadow / no float** | Glass sheets still sit in air. If the only shadow is an inset highlight, panels look printed onto the background. A layered ambient drop shadow (e.g. `0 8px 32px rgba(0,0,0,0.25)`) is ingredient four. |
| 8 | **Weak/absent ambient color** | Dribbble-era glass works because the backdrop is a *designed environment* (visionOS shows the user's real room; Apple Weather shows a sky gradient). Pastel 40–60% blobs on near-black don't survive a saturate+blur pass; you need vivid, large, high-chroma color fields. Prototypr: glass "lives or dies by its background." |
| 9 | **Uniform opacity ladder / uniform blur** | Same treatment on nav, cards, chips, and modals destroys the depth cue the material exists to provide. Blur should scale with importance/occlusion (Fluent uses different blur strengths for acrylic variants; glass-recipes.md: "light frost" 8–12px for chrome, "heavy frost" 24–40px for modals). |
| 10 | **Gradient banding on the ambient layer** | Large blurred radial gradients on dark backgrounds band visibly. Fix: grain overlay at opacity ≤ 0.06, `mix-blend-mode: overlay` (glass-recipes.md), or an SVG `feTurbulence` noise texture. |
| 11 | **Glass everywhere** | "Use sparingly, only to create an illusion of depth" (NN/g). Liquid Glass is for the *navigation layer* (toolbars, tab bars, floating controls), not content cards (https://developer.apple.com/videos/play/wwdc2025/219/). A screen that is 100% translucent has no hierarchy left. |
| 12 | **No fallback / no accessibility path** | Users disable transparency (OS setting), battery saver disables blur (Windows), old browsers lack `backdrop-filter`. Microsoft falls back to solid color in all these cases (https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic). CSS: `@media (prefers-reduced-transparency: reduce)` + `@supports not (backdrop-filter: …)` → opaque surfaces (https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive). Without a fallback, "users … will see a fully invisible surface." |

---

## 2. The physics of believable glass → concrete CSS

Real frosted glass does five things. Each maps to a CSS layer.

### 2.1 Refraction + frost → `backdrop-filter: blur() saturate()`

- Frost = blur of the *backdrop*, not the element. `backdrop-filter: blur(Npx) saturate(S%)`.
- **Blur radius:** 12–20px for cards/rows; 24–40px for modal overlays and anything that can
  appear over arbitrary content (NN/g: "more blur is better… Microsoft's high-blur Acrylic
  is the model"; their example: 25px keeps background edges distinguishable, 100px blends
  everything — https://www.nngroup.com/articles/glassmorphism/). Under ~8px the backdrop
  stays readable-through and the panel stops feeling like glass.
- **Saturation boost: 140–180%.** This is non-negotiable — blur lowers chroma, saturate
  restores it (glass-recipes.md: `saturate(160%)`; common range 150–200%). Our current
  `saturate(1.3)` is below the floor.
- Full recipe used throughout section 6:

```css
backdrop-filter: blur(18px) saturate(160%);
-webkit-backdrop-filter: blur(18px) saturate(160%);
```

### 2.2 Luminosity adaptation → tint the panel toward the text color

Apple's "regular" material "blurs and adjusts the luminosity of background content to
maintain legibility of text and other foreground elements"
(https://developer.apple.com/design/human-interface-guidelines/materials). visionOS glass
"shifts between darker/more opaque and lighter/more translucent depending on the background
behind it." CSS approximation:

- On **dark environments**, tint the glass fill slightly cool-blue and keep alpha low
  (0.10–0.18) so the vivid backdrop shows; ensure text is near-white (`#f4f6fb`).
- On **light environments**, use near-opaque white frost (alpha 0.62–0.92) — light glass
  must be *more* opaque than dark glass because dark text on a mid-luminance backdrop
  fails both ends.
- Microsoft's trick for guaranteed legibility is an **exclusion-blend layer** between the
  blur and the tint (their published recipe: background → blur → **exclusion blend** →
  color/tint overlay → noise — https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic).
  CSS can't do exclusion on the *backdrop* directly; the practical equivalent is a slightly
  higher panel alpha under any text that must clear 4.5:1.

### 2.3 Edge treatment → border + dual inset + specular ring

The edge is what makes a flat shape read as a pane with thickness. Three parts:

```css
.glass {
  border: 1px solid rgba(255, 255, 255, 0.25);           /* hairline luminous edge   */
  box-shadow:
    inset 0  1px 0 rgba(255, 255, 255, 0.35),            /* top light-catch          */
    inset 0 -1px 0 rgba(0,   0,   0,   0.12),            /* bottom shade = thickness */
    0 8px 32px rgba(0, 0, 0, 0.25);                      /* ambient float            */
}
```

Values from glass-recipes.md (base card: `rgba(255,255,255,0.12)` fill, border
`rgba(255,255,255,0.25)`, exactly this three-shadow stack) and NN/g's "low-opacity or
gradient stroke to fake thickness."

**Specular rim (hero elements only)** — a 1px masked gradient ring, bright top-left,
falling to bottom-right:

```css
.glass--rim::before {
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0.25));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;   /* shows only the 1px ring */
  pointer-events: none;
}
```

### 2.4 Noise/grain → kill banding

```css
.ambient::after {              /* overlay on the blob layer, behind all panels */
  content: "";
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.04;               /* ≤ 0.06, or it reads as dirt */
  mix-blend-mode: overlay;
  pointer-events: none;
}
```

(glass-recipes.md: inline `feTurbulence` SVG noise, `opacity: 0.04`,
`mix-blend-mode: overlay`, "keep opacity at or below 0.06".)

### 2.5 Background movement → drift, cheaply

Animate only `transform`/`opacity` on the blob layer (never re-blurring). Our
`weather-app.css` already does this correctly (`blob-drift` on `translate/scale`, 18–26s,
`prefers-reduced-motion` respected). Keep it. Note performance: `backdrop-filter` is
GPU-expensive — Microsoft disables acrylic in Battery Saver mode for exactly this reason;
don't put backdrop-blur on full-screen surfaces, only on panels
(https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic;
https://www.joshwcomeau.com/css/backdrop-filter/).

---

## 3. Color strategy

### 3.1 The ambient environment (what's *behind* the glass)

- **visionOS principle:** glass is designed for a *controlled, vivid environment* — the
  material assumes there is something worth seeing through it, and Apple's own demos put
  saturated color fields behind windows (https://developer.apple.com/design/human-interface-guidelines/materials).
  Design the backdrop as a scene, not a texture.
- **Luminance band that works behind dark glass:** backdrop regions should sit roughly in
  the **L* 25–60** range (mid-dark to mid). Too dark (<L*20) → failure mode 2 (nothing to
  refract); too bright behind *light* text (>L*65 hot spots) → failure mode 3. Computed
  proof from our own app: with muted text on surface-2, contrast falls to **2.91:1** over a
  `#6b5320` amber hotspot vs **6.62:1** over the plain `#131a2e` base.
- **Practical rules for our ambient blobs:**
  - Blob core brightness cap: keep each blob's *center* ≲ 45% white-mix in dark theme
    (currently `color-mix(... 62%/52%/42%, transparent)` — the violet at 62% is fine, the
    amber is the problem because it lands behind scrolling text).
  - Position: hot blob cores off the text column — corners and edges only; keep the
    horizontal band where list/muted text scrolls at base luminance.
  - Size: blobs 2–3× panel width, `filter: blur(80px)` or larger, so panels sample an
    *even field* (sharp blob edges show through blur as smeared structure — visible, good;
    hard color steps, bad).
  - Hue: 2–3 hues max, analogous or split-complementary (our violet/cyan/amber triad is
    fine, but amber should de-emphasize: 42% → ~30% mix, or shift to warm coral
    `#ff9d7a` at 30%).
- **Dark environment base:** deep, *saturated* navy — `#0d1424` (proposed) rather than
  `#131a2e`. More headroom between base and panels = more separation. The repo rule
  "deep but SOFT blue-slate, never near-black" holds; `#0d1424` is still clearly blue.
- **Light environment base:** `#eef2fb` (proposed) — a tinted daylight base instead of
  near-white `#f4f7fd`; light glass over a near-white base shows nothing through, so the
  tint gives the blur something to do while staying bright enough for dark text.

### 3.2 Text ON glass — the contract

Test every text token against **both extremes** of its backdrop: the plain base AND the
brightest blob hotspot behind the panel (NN/g recommends sampling gradient colors with a
contrast tool, https://www.nngroup.com/articles/glassmorphism/). Current computed state:

| Token | Context | Current | Needs | Verdict |
|---|---|---|---|---|
| `--color-text` `#f4f6fb` on S1 dark | 12.35:1 | 4.5 | pass |
| `--color-text-muted` `#b6bfd4` on S5 dark | **4.29:1** | 4.5 | FAIL |
| `--color-text-subtle` `#8a94ad` on S1 dark | **4.40:1** | 4.5 | FAIL |
| `--color-text-muted` on S2 over amber hotspot | **2.91:1** | 4.5 | FAIL |
| `--color-text` on S2 over amber hotspot | 4.96:1 | 4.5 | pass (barely) |
| `--color-text-subtle` `#6f7889` on S1 light | **4.37:1** | 4.5 | FAIL |
| border vs surface (dark, 1px glass-border) | 2.80:1 | 3.0 (WCAG 1.4.11 non-text) | marginal FAIL |

Techniques that guarantee the contract (in order of preference):

1. **Stronger panel opacity under text** — body/secondary copy sits on surface-2+
   (never the faintest tier). Our `glass.md` says this; the app violates it (tiles and
   settings cards use surface-1).
2. **Bump the muted/subtle token values** (see section 7 — proposed `#c3ccdf` /
   `#9daac7` dark, `#414c63` / `#5d6880` light; all ≥ 4.5:1 across the ladder, verified
   by computation).
3. **Constrain the backdrop** under text regions (section 3.1 rules).
4. **Text shadow as last resort:** `text-shadow: 0 1px 8px rgba(5, 8, 20, 0.5)` on the
   dark theme helps at the margins but does not fix a 2.9:1 backdrop — never use it
   instead of 1–3.
5. **Accent text:** avoid colored text on glass entirely (Microsoft's explicit warning);
   our violet-on-glass labels are acceptable at ≥ 17px semibold but should never go below
   that (https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic).

Accessibility path: honor `prefers-reduced-transparency: reduce` and
`prefers-contrast: more` by swapping glass surfaces to opaque equivalents — the same
strategy as visionOS "Increase Contrast" (windows become darker/more opaque,
https://developer.apple.com/design/human-interface-guidelines/materials) and Windows
Transparency effects (https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic).
Recipe:

```css
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .device[data-style="glass"] [class*="glass"],
  .tile, .hourCard, .row {          /* every glass surface */
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--color-surface-solid, #232a3a);   /* opaque twin of surface-1 */
  }
}
@supports not (backdrop-filter: blur(1px)) {
  .tile, .hourCard, .row { background: #232a3a; }      /* opaque fallback */
}
```

---

## 4. Layering & hierarchy

- **How many translucent layers:** at most **two visible glass tiers on screen at once**
  (content panels + one nav/floating layer), per Microsoft's "avoid layering multiple
  acrylic surfaces" and Apple's "avoid glass on glass"
  (URLs in section 1). Our weather app currently has: ambient → tiles → (hour cards) →
  chips → nav, all translucent — 4+ competing layers.
- **Navigation layer vs content layer** (Apple WWDC25 "Meet Liquid Glass,"
  https://developer.apple.com/videos/play/wwdc2025/219/): glass belongs on the
  *navigation/floating layer* (tab bar, top bar, chips, FABs). Content cards may use
  *light* glass, but the strongest glass treatment (highest alpha + shadow + rim) goes on
  the floating layer, not on content. This inversion alone reads as "designed."
- **Opacity ladder:** make tiers *far enough apart to be distinguishable* — each step
  ≥ 0.04 alpha (currently steps of 0.03–0.04 at the bottom: 0.09/0.12/0.16 — the S1→S2
  delta of 0.03 is invisible). Proposed ladder (dark): **0.10 / 0.14 / 0.18 / 0.23 / 0.30**
  (delta 0.04–0.07); light: **0.62 / 0.70 / 0.78 / 0.86 / 0.92**.
- **Blur ladder:** chrome (chips, nav): 12–14px; cards/rows: 18px; overlays/modals:
  28–40px (glass-recipes.md tiers; NN/g's high-blur-for-transient-surfaces rule).
- **Z-order:** ambient blobs (z 0, blurred, grain on top) → content panels (z 1) →
  floating glass (nav/top bar, z 2, strongest alpha + `--shadow-2`) → scrims/modals (z 3,
  blur 28px+).
- **When to go opaque:** scrolling text-heavy sections over blob hotspots, the settings
  group cards (form-heavy UI — Orizon advises avoiding glass in form-heavy flows,
  https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux),
  and any surface where contrast can't be guaranteed → use surface-4/5 with reduced
  translucency or a solid `--color-surface-solid` twin.

---

## 5. Reference implementations (distilled)

### 5.1 Apple — visionOS glass & Liquid Glass (iOS 26)

Source: https://developer.apple.com/design/human-interface-guidelines/materials,
https://developer.apple.com/videos/play/wwdc2025/219/,
https://css-tricks.com/getting-clarity-on-apples-liquid-glass/

- The **regular** material "blurs and adjusts the luminosity of background content to
  maintain legibility" — the panel, not the text, absorbs the adaptation.
- visionOS **glass adapts**: darker/more opaque over light backgrounds, lighter/more
  translucent over dark. A *single* static alpha cannot do this job; you compensate by
  constraining the environment (section 3.1).
- Liquid Glass is composed of three layers: **highlight** (light casting/movement),
  **shadow** (depth/separation), **illumination** (the material's flexible optical
  properties). Naive CSS blur fails because Apple's material **lenses** (warps/bends the
  background) rather than scattering it — CSS can't reproduce lensing, so we compensate
  with the edge + saturation + noise stack.
- Two variants: **regular** (adaptive, most surfaces) and **clear** (more see-through,
  for media controls over content). Tinting is allowed but content on tinted glass must
  still clear contrast.
- Glass is for the **navigation layer**; content belongs on opaque or lightly-translucent
  surfaces. Apple raised opacity mid-beta "in several key areas" precisely because
  legibility suffered (NN/g's critique, https://www.nngroup.com/articles/liquid-glass-usability).
- Accessibility: Increase Contrast → windows get darker and more opaque; Reduce
  Transparency → solid.

### 5.2 Microsoft — Fluent Acrylic

Source: https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic,
https://fluent2.microsoft.design/material

- **Published recipe stack (in order):** background → **blur** → **exclusion blend**
  (guarantees contrast/legibility) → **color/tint overlay** → **noise texture**.
- Two blend types: *background* acrylic (over desktop/wallpaper — for transient surfaces:
  menus, flyouts, light-dismiss panes) and *in-app* acrylic (supporting UI that overlaps
  scrolling content). Vertical panes that help section content → **opaque**, not acrylic.
- Don'ts: no multiple acrylic layers; no edge-to-edge acrylic panes (visible seam); no
  acrylic on large background surfaces; **no accent-colored text on acrylic** (fails
  contrast at default 14px).
- Fallbacks: solid color when Transparency effects off, Battery Saver, low-end device,
  High Contrast mode.
- Fluent 2 positions acrylic for **transient, light-dismiss surfaces** — the same
  nav-layer-over-content split as Apple.

### 5.3 NN/g usability guidance

Source: https://www.nngroup.com/articles/glassmorphism/

- Contrast must hold across *every* area the translucent element can overlap; use a
  contrast-sampling tool on gradients (they recommend WillowTree's Contrast plugin).
- "More blur is better" for surfaces that can appear over arbitrary content; if you
  control the background, keep the background simple/single-color behind text panels.
- Offer transparency/contrast controls; otherwise meet WCAG 2.2.
- Use sparingly, for depth only; prefer established systems over hand-rolled glass.
- Their worked example: white fill at **30% opacity with 25px blur** keeps background
  edges somewhat distinguishable; 100px blur blends everything (useful for *hiding*
  busy backdrops, e.g. photo overlays).

### 5.4 Community/engineering recipes (the working consensus)

Sources: https://github.com/2233admin/design-pipeline/blob/main/skill/references/iart-motion-skills/upstream/web-animation-skills/skills/glassmorphism/references/glass-recipes.md,
https://www.joshwcomeau.com/css/backdrop-filter/,
https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive

- Four ingredients: **blur (frost), translucency, edge highlight, layered shadow** — plus
  `saturate()`.
- Base card: fill `rgba(255,255,255,0.12)`, `blur(16px) saturate(160%)`, border
  `rgba(255,255,255,0.25)`, shadows `0 8px 32px rgba(0,0,0,0.25)` + `inset 0 1px 0
  rgba(255,255,255,0.35)` + `inset 0 -1px 0 rgba(0,0,0,0.12)`.
- Fill alpha stays in a narrow band: "never fully opaque, never fully clear"
  (dark-glass variant: `rgba(0,0,0,0.3)` fill with a softer white top highlight).
- Tier tuning: light frost (UI chrome) blur 8–12px @ alpha 0.08–0.14; heavy frost
  (modal/login) blur 24–40px @ alpha 0.10–0.18.
- Grain overlay ≤ 0.06 opacity; specular ring via masked gradient; `-webkit-` prefix
  always; opaque fallback always.

---

## 6. Recipe cards (using OUR token names)

All recipes assume the ambient layer from `weather-app.css` behind them and the *proposed*
token values from section 7. Each recipe is a complete copy-ready block.

### 6.1 Hero glass card (hero temp block, "current conditions" panel)

```css
.glass-hero {
  position: relative;
  background: var(--color-surface-2);                    /* 0.14 dark / 0.70 light */
  backdrop-filter: blur(var(--glass-blur)) saturate(1.6);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.6);
  border: var(--border-w) solid var(--glass-border);
  border-radius: var(--r-xl, 24px);
  box-shadow:
    var(--shadow-inset),                                  /* top highlight + bottom shade */
    var(--shadow-2);                                      /* 0 16px 48px float */
  overflow: hidden;
}
.glass-hero::before {                                     /* specular rim, hero-only */
  content: "";
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(135deg,
    var(--glass-highlight), rgba(255, 255, 255, 0) 40%,
    rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0.25));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
.glass-hero__body { padding: var(--sp-5) var(--sp-4); }   /* text sits on the panel, never raw on blobs */
```

### 6.2 Nav bar glass (floating pill — the strongest glass on screen)

```css
.glass-nav {
  position: absolute;
  left: var(--sp-4);
  right: var(--sp-4);
  bottom: calc(var(--sp-4) + 6px);
  display: flex;
  justify-content: space-around;
  padding: 10px var(--sp-3);
  border-radius: var(--r-pill);
  background: var(--color-surface-4);                     /* 0.23 dark / 0.86 light */
  backdrop-filter: blur(24px) saturate(1.6);              /* heavier blur than content */
  -webkit-backdrop-filter: blur(24px) saturate(1.6);
  border: var(--border-w) solid var(--glass-border);
  box-shadow:
    var(--shadow-inset),
    var(--shadow-2);                                      /* it floats above everything */
  z-index: 2;
}
.glass-nav__item[aria-current="true"] {
  background: var(--color-primary-container);
  border-radius: var(--r-pill);
  color: var(--color-on-primary-container);
}
```

### 6.3 List row glass (cities / forecast rows)

```css
.glass-row {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  min-height: 56px;
  padding: var(--sp-3) var(--sp-4);
  border-radius: var(--r-lg);
  background: var(--color-surface-2);                     /* NOT surface-1: text must clear 4.5:1 */
  backdrop-filter: blur(var(--glass-blur)) saturate(1.6);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.6);
  border: var(--border-w) solid var(--glass-border);
  box-shadow: var(--shadow-inset);
  transition: background var(--dur-2) var(--ease-standard);
}
.glass-row:hover   { background: var(--color-surface-3); }
.glass-row:active  { transform: scale(0.98); }
.glass-row[aria-current="true"] {
  background: var(--color-surface-3);
  border-color: color-mix(in srgb, var(--color-primary) 55%, var(--glass-border));
}
/* secondary text inside rows uses --color-text-muted (never --color-text-subtle) */
```

### 6.4 Full-screen ambient background (behind everything)

```css
.ambient {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(120% 90% at 20% 0%,  color-mix(in srgb, var(--color-primary)   34%, transparent), transparent 70%),
    radial-gradient(110% 80% at 95% 35%, color-mix(in srgb, var(--color-tertiary)  30%, transparent), transparent 70%),
    radial-gradient(130% 90% at 15% 100%, color-mix(in srgb, var(--color-warn)     22%, transparent), transparent 72%),
    var(--color-bg);
}
/* grain kills banding on the dark theme */
.ambient::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
}
@media (prefers-reduced-motion: reduce) { .ambient__blob { animation: none !important; } }
```

(Note the shift from discrete 430–470px blobs to three full-bleed radial gradients painted
on the base — even fields for the blur to sample, no hard blob edges, and the amber is
de-emphasized to 22% so it can never create a 2.9:1 hotspot under text.)

---

## 7. Concrete action list for OUR codebase

### P0 — tokens (`src/proto-kit/styles/glass.css`)

All proposed values verified by computed WCAG ratios (section 3.2 method). Dark theme:

```css
--color-bg: #0d1424;                          /* deeper saturated navy: more panel separation */
--color-surface-1: rgba(235, 240, 252, 0.10); /* cool-tinted glass, not pure white   */
--color-surface-2: rgba(235, 240, 252, 0.14); /* ladder steps 0.04–0.07, distinguishable */
--color-surface-3: rgba(235, 240, 252, 0.18);
--color-surface-4: rgba(235, 240, 252, 0.23);
--color-surface-5: rgba(235, 240, 252, 0.30);
--color-text: #f4f6fb;                        /* 13.3:1 on S1 */
--color-text-muted: #c3ccdf;                  /* was #b6bfd4 (4.29 FAIL on S5) → 8.9–4.6:1 */
--color-text-subtle: #9daac7;                 /* was #8a94ad (4.40 FAIL on S1) → 6.2–3.2:1; use on S1–S3 only */
--shadow-1: 0 8px 24px rgba(4, 8, 20, 0.38);
--shadow-2: 0 16px 48px rgba(4, 8, 20, 0.46);
--shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.30),
                inset 0 -1px 0 rgba(0, 0, 0, 0.18);      /* NEW: bottom shade = thickness */
--glass-blur: 20px;
--glass-border: rgba(255, 255, 255, 0.28);   /* was 0.22 — 2.80:1 vs surface, marginal */
--glass-highlight: rgba(255, 255, 255, 0.45);
--color-surface-solid: #232a3a;              /* NEW: opaque twin for fallbacks */
```

Light theme:

```css
--color-bg: #eef2fb;                          /* tinted daylight base — blur has something to sample */
--color-surface-1: rgba(255, 255, 255, 0.62); /* wider ladder: 0.62 → 0.92 */
--color-surface-2: rgba(255, 255, 255, 0.70);
--color-surface-3: rgba(255, 255, 255, 0.78);
--color-surface-4: rgba(255, 255, 255, 0.86);
--color-surface-5: rgba(255, 255, 255, 0.92);
--color-text: #10182b;
--color-text-muted: #414c63;                  /* was #4a5468 → 8.3:1 (up from 7.5) */
--color-text-subtle: #5d6880;                 /* was #6f7889 (4.37 FAIL) → 5.4:1 */
--shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.9),
                inset 0 -1px 0 rgba(20, 27, 45, 0.06);
--glass-blur: 20px;
--glass-border: rgba(255, 255, 255, 0.8);
--glass-highlight: rgba(255, 255, 255, 0.95);
--color-surface-solid: #f7f9fe;
```

Verified ratios: dark text 6.8–13.3:1, muted 4.6–8.9:1, subtle ≥4.7:1 on S1–S3; light text
16.9–17.5:1, muted 8.3–8.5:1, subtle 5.4:1 — all pass AA across the full ladder.

### P0 — weather-app screens (contrast + de-mud)

1. **`saturate(1.3)` → `saturate(1.6)`** in every `backdrop-filter` (6 files).
2. **Replace the ambient blobs** with the full-bleed radial-gradient + grain version
   (recipe 6.4) — fixes the 2.91:1 amber hotspot and future banding. Delete
   `color-mix(... 62% ...)` violet core; cap any kept blob cores at ≤ 40% mix.
3. **Promote text-bearing surfaces:** detail tiles and settings cards surface-1 →
   surface-2; rows stay surface-2; muted text never below surface-2; `--color-text-subtle`
   restricted to S1–S3 contexts and never on body copy.
4. **Add the fallback block** (`prefers-reduced-transparency` + `@supports not
   (backdrop-filter)`) to `weather-app.css`, targeting all glass classes →
   `var(--color-surface-solid)`.

### P1 — restore hierarchy (the "designed" look)

5. **Tier the blur:** nav 24px, cards/rows `var(--glass-blur)` (20px), small chips 14px.
6. **Use `--shadow-1` on cards/rows and `--shadow-2` on nav + hero** — currently only
   `--shadow-inset` is applied anywhere, so nothing floats.
7. **Nav pill gets the strongest glass** (surface-4 + shadow-2 + rim), content cards get
   lighter glass — the Apple navigation-layer/content-layer split (section 4).
8. **Specular rim on the hero card and active elements only** (recipe 6.1) — one
   `.glass--rim` utility in `weather-app.css`; do not apply app-wide.
9. **Drop the 1px glass border on icon bubbles** (40px circles in settings) — border at
   that scale reads as noise; use surface-3 fill + inset only.

### P2 — polish

10. Add `prefers-contrast: more` handling alongside reduced-transparency.
11. Keep blob drift animation (already transform-only, reduced-motion safe) but retime to
    24–36s so motion reads as ambient, not busy.
12. Update `docs/design-languages/glass.md` palette tables + "Must-use" to the new token
    values and the nav-layer/content-layer rule, so the design-language doc and the code
    stop drifting.

---

## Source list

- NN/g — Glassmorphism: Definition and Best Practices — https://www.nngroup.com/articles/glassmorphism/
- Microsoft Learn — Acrylic material — https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic
- Fluent 2 Design System — Material — https://fluent2.microsoft.design/material
- Apple HIG — Materials — https://developer.apple.com/design/human-interface-guidelines/materials
- Apple WWDC25 — Meet Liquid Glass — https://developer.apple.com/videos/play/wwdc2025/219/
- CSS-Tricks — Getting Clarity on Apple's Liquid Glass — https://css-tricks.com/getting-clarity-on-apples-liquid-glass/
- Glass recipes reference (blur/saturate/border/inset/noise values) — https://github.com/2233admin/design-pipeline/blob/main/skill/references/iart-motion-skills/upstream/web-animation-skills/skills/glassmorphism/references/glass-recipes.md
- Josh Comeau — Next-level frosted glass with backdrop-filter — https://www.joshwcomeau.com/css/backdrop-filter/
- Axess Lab — Glassmorphism Meets Accessibility — https://axesslab.com/glassmorphism-meets-accessibility-can-frosted-glass-be-inclusive
- Orizon — Glassmorphism in 2026 — https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux
- NN/g — Liquid Glass usability critique (iOS 26) — https://www.nngroup.com/articles/liquid-glass-usability
