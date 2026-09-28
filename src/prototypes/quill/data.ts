/**
 * quill / data — deterministic demo content for the desktop notes app.
 *
 * Everything here is authored fixture data: no Math.random, no Date.now,
 * no backend. Timestamps are stored as "minutes before now" and formatted by
 * a pure function, so the Library always reads the same on every load (same
 * rule the phone prototypes follow with their seeded generators).
 *
 * A note is a LIST OF BLOCKS, not a string: the editor view renders the same
 * blocks the search view indexes, and the checklist is part of the content so
 * checking an item is real state rather than decoration.
 */

export type TagId = "design" | "research" | "engineering" | "product" | "meetings";

export interface TagDef {
  id: TagId;
  label: string;
  /** one-line explanation, shown in Settings so the tag list is not a mystery */
  hint: string;
}

export type Block =
  | { kind: "title"; text: string }
  | { kind: "para"; text: string }
  | { kind: "quote"; text: string; cite: string }
  | { kind: "check"; id: string; text: string; done: boolean }
  | { kind: "code"; lang: string; text: string };

export interface Note {
  id: string;
  /** mirror of the title block — used by the list, palette and search results */
  title: string;
  tags: TagId[];
  folder: string;
  /** minutes before "now" (a fixed number, never a live clock read) */
  updatedMins: number;
  created: string;
  pinned?: boolean;
  blocks: Block[];
}

export const TAGS: TagDef[] = [
  { id: "design", label: "Design", hint: "Type, colour, layout specs and critique." },
  { id: "research", label: "Research", hint: "Interviews, usability sessions, literature." },
  { id: "engineering", label: "Engineering", hint: "Architecture, migrations, code sketches." },
  { id: "product", label: "Product", hint: "Positioning, metrics, roadmap reasoning." },
  { id: "meetings", label: "Meetings", hint: "Decisions and action items from calls." },
];

export const NOTES: Note[] = [
  {
    id: "n-typography",
    title: "Type scale for the reading app",
    tags: ["design", "engineering"],
    folder: "Design system",
    updatedMins: 12,
    created: "18 Aug",
    pinned: true,
    blocks: [
      { kind: "title", text: "Type scale for the reading app" },
      {
        kind: "para",
        text: "Six steps is enough for a reading surface. Anything below body is metadata; anything above title1 is reserved for the library cover and nothing else. The gap between body and footnote is where most apps get it wrong — 15px callouts with 13px footnotes read as noise on a 5.7-inch screen.",
      },
      {
        kind: "para",
        text: "Line length is the other half of the scale. At 17px with a 1.45 ratio, 38–44 characters per line is the comfortable band for prose; code and checklists can run wider because they are scanned, not read.",
      },
      {
        kind: "check", id: "n-typography-c1", done: true,
        text: "Lock the six steps and export them as tokens",
      },
      {
        kind: "check", id: "n-typography-c2", done: true,
        text: "Test the body/footnote gap on a 320pt-wide device",
      },
      {
        kind: "check", id: "n-typography-c3", done: false,
        text: "Get sign-off from the content team on the quote style",
      },
      {
        kind: "code", lang: "ts",
        text: "export const scale = {\n  title1: 28, title2: 22, headline: 17,\n  body: 17, callout: 16, subhead: 15,\n  footnote: 13, caption: 12,\n} as const;",
      },
      { kind: "check", id: "n-typography-c4", done: false, text: "Publish the specimen page" },
    ],
  },
  {
    id: "n-interviews",
    title: "Interview notes — Kai, 08 Aug",
    tags: ["research", "meetings"],
    folder: "Research",
    updatedMins: 95,
    created: "08 Aug",
    blocks: [
      { kind: "title", text: "Interview notes — Kai, 08 Aug" },
      {
        kind: "para",
        text: "Kai keeps three apps open: a mail client, a notes app and a chat thread with two collaborators. She describes the notes app as \"where things go to be forgotten\", which is the most useful sentence from the session. The behaviour she wants is recall, not capture.",
      },
      {
        kind: "quote",
        text: "I do not want to write faster. I want to find the thing I already wrote, without opening four apps to look for it.",
        cite: "Kai, minute 14",
      },
      {
        kind: "para",
        text: "Two objections when I showed the tag filter: she thought tags would rot, and she wanted search to rank by recency first. Both are fair — the fix is a search view with a visible query, not a hidden index.",
      },
      { kind: "check", id: "n-interviews-c1", done: true, text: "Add a search view with grouped results" },
      { kind: "check", id: "n-interviews-c2", done: false, text: "Re-test the tag filter with three participants" },
    ],
  },
  {
    id: "n-offsite",
    title: "Offsite decisions — 14 Aug",
    tags: ["meetings", "product"],
    folder: "Meetings",
    updatedMins: 260,
    created: "14 Aug",
    blocks: [
      { kind: "title", text: "Offsite decisions — 14 Aug" },
      {
        kind: "para",
        text: "Decided in the room, not inferred afterwards: the library stays a list, the editor stays a single column, and search gets its own view. Anyone reading the changelog in six months should be able to tell which of those were opinions and which were constraints.",
      },
      {
        kind: "quote",
        text: "A desktop app is a window with a sidebar. If it needs a bottom bar, it is a phone app in a wide frame.",
        cite: "Design review, 11:20",
      },
      { kind: "check", id: "n-offsite-c1", done: true, text: "Write the decisions down in this file" },
      { kind: "check", id: "n-offsite-c2", done: true, text: "Ship the three-column library behind a flag" },
      { kind: "check", id: "n-offsite-c3", done: false, text: "Tell support the keyboard map changed" },
    ],
  },
  {
    id: "n-search-ranking",
    title: "Search ranking experiment",
    tags: ["engineering", "product"],
    folder: "Engineering",
    updatedMins: 1500,
    created: "02 Aug",
    blocks: [
      { kind: "title", text: "Search ranking experiment" },
      {
        kind: "para",
        text: "Ranking is a scored match, not a filter. Title hits weigh 3, checklist items 2, body text 1, and a recency tiebreak keeps the newest note first when scores are equal. Grouping the hits by where they landed — title, text, checklist, code — is what makes a result readable instead of a wall of identical rows.",
      },
      {
        kind: "code", lang: "ts",
        text: "const score =\n  (title ? 3 : 0) + (check ? 2 : 0) + (body ? 1 : 0);\nresults.sort((a, b) =>\n  b.score - a.score || a.updatedMins - b.updatedMins);",
      },
      {
        kind: "para",
        text: "The highlight matters as much as the score. Wrapping the matched span in a mark element — and nothing else — keeps the row readable; a coloured row background competes with the match itself.",
      },
      { kind: "check", id: "n-search-ranking-c1", done: true, text: "Implement the scorer" },
      { kind: "check", id: "n-search-ranking-c2", done: false, text: "Measure zero-result queries" },
    ],
  },
  {
    id: "n-onboarding",
    title: "Onboarding funnel drop-off",
    tags: ["research", "product"],
    folder: "Research",
    updatedMins: 2900,
    created: "29 Jul",
    blocks: [
      { kind: "title", text: "Onboarding funnel drop-off" },
      {
        kind: "para",
        text: "Sixty-one percent of installs never reach a second session. The drop is not the permission prompt — it is the empty library. An empty state that explains nothing gets closed; an empty state that shows one finished example gets used.",
      },
      {
        kind: "quote",
        text: "The first note is the product. Everything before it is setup.",
        cite: "Review with the growth team",
      },
      { kind: "check", id: "n-onboarding-c1", done: true, text: "Ship a seeded example note on first run" },
      { kind: "check", id: "n-onboarding-c2", done: false, text: "A/B the empty-state copy" },
    ],
  },
  {
    id: "n-token-migration",
    title: "Token migration plan",
    tags: ["engineering", "design"],
    folder: "Engineering",
    updatedMins: 4300,
    created: "21 Jul",
    blocks: [
      { kind: "title", text: "Token migration plan" },
      {
        kind: "para",
        text: "Four steps, in order, no parallel work: name the tokens, alias the old names to the new ones, migrate component by component, then delete the aliases. Skipping the alias step is what turns a two-week migration into a two-month one.",
      },
      {
        kind: "code", lang: "css",
        text: ".card {\n  background: var(--color-surface-1);\n  border: var(--border-w) solid var(--color-outline-variant);\n  border-radius: var(--r-md);\n}",
      },
      { kind: "check", id: "n-token-migration-c1", done: true, text: "Alias the legacy names" },
      { kind: "check", id: "n-token-migration-c2", done: false, text: "Migrate the settings screens" },
      { kind: "check", id: "n-token-migration-c3", done: false, text: "Delete the aliases in v4" },
    ],
  },
  {
    id: "n-reading",
    title: "Reading: The Mom Test",
    tags: ["research"],
    folder: "Reading",
    updatedMins: 7200,
    created: "11 Jul",
    blocks: [
      { kind: "title", text: "Reading: The Mom Test" },
      {
        kind: "para",
        text: "The book is one rule repeated: never ask whether someone would use your thing, ask what they did last time the problem happened. Past behaviour is data; future intentions are polite noise.",
      },
      {
        kind: "quote",
        text: "Talk to your customers about their lives, not about your product.",
        cite: "chapter 3",
      },
      { kind: "check", id: "n-reading-c1", done: true, text: "Rewrite the interview script around past behaviour" },
      { kind: "check", id: "n-reading-c2", done: false, text: "Run two pilot sessions before the offsite" },
    ],
  },
  {
    id: "n-voice",
    title: "Product voice guidelines",
    tags: ["design", "product"],
    folder: "Design system",
    updatedMins: 10080,
    created: "02 Jul",
    blocks: [
      { kind: "title", text: "Product voice guidelines" },
      {
        kind: "para",
        text: "Plain, not blunt. Say what happened, then say what to do, then stop. No exclamation marks, no second person in error states, and never blame the reader for the thing the software did.",
      },
      {
        kind: "para",
        text: "The error-state rule is the one that keeps getting broken: the subject is the action, not the person. \"The file could not be saved\" is right; \"you saved the file badly\" is not.",
      },
      { kind: "check", id: "n-voice-c1", done: true, text: "Rewrite the top twenty error strings" },
      { kind: "check", id: "n-voice-c2", done: false, text: "Add the rules to the contribution guide" },
    ],
  },
];

/** Minutes → a stable, human label. Pure: same input, same output, always. */
export function relativeTime(mins: number): string {
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 1440) return `${Math.round(mins / 60)} h ago`;
  if (mins < 10080) return `${Math.round(mins / 1440)} d ago`;
  return `${Math.round(mins / 10080)} w ago`;
}

export function titleOf(note: Note): string {
  const first = note.blocks[0];
  return first && first.kind === "title" ? first.text : note.title;
}

/** Every word in a note, including checklist items and code — used by the
 *  word count in the editor footer and the length sort in the Library. */
export function noteText(note: Note): string {
  return note.blocks
    .map((b) => {
      if (b.kind === "code") return b.text;
      if (b.kind === "quote") return `${b.text} ${b.cite}`;
      return b.text;
    })
    .join(" ");
}

export function wordCount(note: Note): number {
  const text = noteText(note).trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

/** First two paragraphs, clipped — the Library preview body. */
export function previewOf(note: Note): string {
  return note.blocks
    .filter((b): b is Extract<Block, { kind: "para" }> => b.kind === "para")
    .slice(0, 2)
    .map((b) => b.text)
    .join(" ");
}

export function checklistProgress(note: Note): { done: number; total: number } {
  const items = note.blocks.filter((b): b is Extract<Block, { kind: "check" }> => b.kind === "check");
  return { done: items.filter((b) => b.done).length, total: items.length };
}

export function tagLabel(id: TagId): string {
  return TAGS.find((t) => t.id === id)?.label ?? id;
}

/* ------------------------------------------------------------------ *
 * Search — the scorer, the grouping and the hit list.
 * ------------------------------------------------------------------ */

export type MatchKind = "title" | "text" | "check" | "code";
export type SearchScope = "all" | MatchKind;

export const SCOPES: { id: SearchScope; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "text", label: "Text" },
  { id: "check", label: "Checklist" },
  { id: "code", label: "Code" },
];

export const SCOPE_LABEL: Record<MatchKind, string> = {
  title: "Title",
  text: "Note",
  check: "Checklist",
  code: "Code",
};

export interface NoteHit {
  note: Note;
  kind: MatchKind;
  score: number;
}

const KIND_WEIGHT: Record<MatchKind, number> = { title: 3, check: 2, text: 1, code: 1 };

/** Every block of a note that contains the query, scored by where it matched. */
export function matchNote(note: Note, q: string, scope: SearchScope): NoteHit[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const hits: NoteHit[] = [];
  const push = (kind: MatchKind, haystack: string) => {
    if (scope !== "all" && scope !== kind) return;
    if (!haystack.toLowerCase().includes(term)) return;
    hits.push({ note, kind, score: KIND_WEIGHT[kind] });
  };
  for (const b of note.blocks) {
    if (b.kind === "title") push("title", b.text);
    else if (b.kind === "para") push("text", b.text);
    else if (b.kind === "quote") push("text", `${b.text} ${b.cite}`);
    else if (b.kind === "check") push("check", b.text);
    else push("code", b.text);
  }
  return hits;
}

/** Up to three representative blocks per note, in document order — the rows the
 *  Search view shows. Title hits are already represented by the note header. */
export function hitLines(note: Note, q: string, scope: SearchScope): { kind: MatchKind; text: string }[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const lines: { kind: MatchKind; text: string }[] = [];
  for (const b of note.blocks) {
    if (b.kind === "title") continue;
    const kind: MatchKind =
      b.kind === "para" || b.kind === "quote" ? "text" : b.kind === "check" ? "check" : "code";
    if (scope !== "all" && scope !== kind) continue;
    const hay = b.kind === "quote" ? `${b.text} — ${b.cite}` : b.text;
    if (!hay.toLowerCase().includes(term)) continue;
    lines.push({ kind, text: hay });
    if (lines.length >= 3) break;
  }
  return lines;
}

export function groupByKind(hits: NoteHit[]): { kind: MatchKind; hits: NoteHit[] }[] {
  const order: MatchKind[] = ["title", "check", "text", "code"];
  return order
    .map((kind) => ({ kind, hits: hits.filter((h) => h.kind === kind) }))
    .filter((g) => g.hits.length > 0);
}

/** Flat, ordered result list — one entry per note, for the keyboard cursor. */
export function orderHits(hits: NoteHit[]): NoteHit[] {
  return [...hits].sort((a, b) => b.score - a.score || a.note.updatedMins - b.note.updatedMins);
}
