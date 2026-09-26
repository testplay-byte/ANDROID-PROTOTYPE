# kids-learning — navigation

## What this prototype is

A claymorphism (puffy 3D pastel) learning game for preschoolers. Four
subjects — Letters, Numbers, Colors, Shapes — each with a 5-question
multiple-choice mini game. Correct answers squish the button and fly a
star into the progress row; wrong answers press the dough and shake.
Stars unlock badges on the trophy shelf. Every interactive surface uses
the clay style's puffy `--shadow-2` (idle) / `--shadow-inset` (pressed)
token shadows — no flat surfaces, no hard borders.

## Screens

| Screen   | View id    | Description |
|----------|------------|-------------|
| Home     | `home`     | "Hi, Mia!" hero greeting + 2-col grid of 4 subject tiles with star progress rows. Tap a tile → Play tab with that subject preselected. |
| Play     | `play`     | The mini game: question card + 3 big puffy answer buttons, star-fly animation, happy message, 5 questions per round, round summary with stars earned. |
| Awards   | `awards`   | Badge shelf: 6 circular clay badges (locked = inset + muted, unlocked = puffy + primary). Tap a badge for a name/description sheet. |
| Settings | `settings` | Kid profile row, night mode toggle (useDeviceTheme), sound effects toggle, reset-stars button with two-tap confirm. |

## Interactions

- Subject tile tap → switches to Play with the subject preselected
- Answer tap (correct) → squish animation + star flies into progress row + praise message → next question after 800ms
- Answer tap (wrong) → `--shadow-inset` pressed look + gentle shake → retry
- Round complete → summary card with stars earned + Play Again
- Subject pills on Play screen switch the game subject
- Badge tap → small bottom sheet with badge name/description/unlock progress
- Night mode toggle (light/dark, persisted via `kids-learning-theme`)
- Sound effects toggle (puffy clay switch)
- Reset stars → tap once ("Sure?") then tap again to confirm; auto-cancels after 3s
- Swipe left/right (mouse drag) navigates between tabs

## Files

| File | What it is |
|------|------------|
| `app/prototypes/kids-learning/layout.tsx` | Tokens + styles imports, metadata |
| `app/prototypes/kids-learning/page.tsx` | Shell + hash router + shared state (stars, subject) |
| `src/prototypes/kids-learning/kids-learning.css` | Prototype-wide globals + view stack |
| `src/prototypes/kids-learning/lib/types.ts` | Shared types |
| `src/prototypes/kids-learning/lib/data.ts` | Subjects, question generation, badges |
| `src/prototypes/kids-learning/components/*.tsx` | StarRow, ClaySwitch, BadgeIcon, ShapeGlyph |
| `src/prototypes/kids-learning/screens/*.tsx` | One file per screen (+ module.css) |

## Live URL

https://testplay-byte.github.io/ANDROID-PROTOTYPE/prototypes/kids-learning/
