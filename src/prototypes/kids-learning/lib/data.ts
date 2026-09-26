/**
 * kids-learning / lib / data — subjects, question generation and badges.
 *
 * All UI chrome colors come from tokens. The only literal colors here are
 * the CONTENT of the "Colors" subject (crayon swatches) — they are the
 * material being taught, not styling.
 */
import type {
  AnswerOption,
  Badge,
  Question,
  ShapeKind,
  Subject,
  SubjectId,
} from "./types";

export const KID_NAME = "Mia";

export const SUBJECTS: Subject[] = [
  { id: "letters", name: "Letters", tagline: "A B C", accent: "primary" },
  { id: "numbers", name: "Numbers", tagline: "1 2 3", accent: "tertiary" },
  { id: "colors", name: "Colors", tagline: "Red Blue", accent: "secondary" },
  { id: "shapes", name: "Shapes", tagline: "Circle", accent: "warn" },
];

export const SUBJECT_BY_ID: Record<SubjectId, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<SubjectId, Subject>;

/** Max stars a subject tile can show / a round can earn. */
export const STARS_PER_ROUND = 5;

// ---------------------------------------------------------------------------
// Question pools
// ---------------------------------------------------------------------------

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

/** Crayon swatches — content data, not UI chrome. */
const COLORS: { name: string; value: string }[] = [
  { name: "Red", value: "#e35d6a" },
  { name: "Blue", value: "#5b8def" },
  { name: "Yellow", value: "#f2c14e" },
  { name: "Green", value: "#58c08a" },
  { name: "Purple", value: "#9b7ede" },
  { name: "Orange", value: "#f28c4e" },
];

const SHAPES: { name: string; kind: ShapeKind }[] = [
  { name: "Circle", kind: "circle" },
  { name: "Square", kind: "square" },
  { name: "Triangle", kind: "triangle" },
  { name: "Star", kind: "star" },
  { name: "Heart", kind: "heart" },
  { name: "Diamond", kind: "diamond" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Target {
  key: string;
  prompt: string;
  option: AnswerOption;
  distractors: AnswerOption[];
}

function buildTargets(subject: SubjectId): Target[] {
  if (subject === "letters") {
    return LETTERS.map((L) => ({
      key: `letter-${L}`,
      prompt: `Which one is the letter ${L}?`,
      option: { id: `letter-${L}`, label: L },
      distractors: LETTERS.filter((x) => x !== L).map(
        (x) => ({ id: `letter-${x}`, label: x }) as AnswerOption,
      ),
    }));
  }
  if (subject === "numbers") {
    return NUMBERS.map((N) => ({
      key: `number-${N}`,
      prompt: `Which one is the number ${N}?`,
      option: { id: `number-${N}`, label: N },
      distractors: NUMBERS.filter((x) => x !== N).map(
        (x) => ({ id: `number-${x}`, label: x }) as AnswerOption,
      ),
    }));
  }
  if (subject === "colors") {
    return COLORS.map((c) => ({
      key: `color-${c.name.toLowerCase()}`,
      prompt: `Which one is ${c.name}?`,
      option: { id: `color-${c.name.toLowerCase()}`, color: c.value },
      distractors: COLORS.filter((x) => x.name !== c.name).map(
        (x) =>
          ({ id: `color-${x.name.toLowerCase()}`, color: x.value }) as AnswerOption,
      ),
    }));
  }
  return SHAPES.map((s) => ({
    key: `shape-${s.kind}`,
    prompt: `Which one is the ${s.name.toLowerCase()}?`,
    option: { id: `shape-${s.kind}`, shape: s.kind },
    distractors: SHAPES.filter((x) => x.kind !== s.kind).map(
      (x) => ({ id: `shape-${x.kind}`, shape: x.kind }) as AnswerOption,
    ),
  }));
}

/** Generate `count` kid-friendly multiple-choice questions for a subject. */
export function generateQuestions(
  subject: SubjectId,
  count = STARS_PER_ROUND,
): Question[] {
  const targets = shuffle(buildTargets(subject)).slice(0, count);
  return targets.map((t) => {
    const others = shuffle(t.distractors).slice(0, 2);
    const answers = shuffle([t.option, ...others]);
    return {
      id: t.key,
      prompt: t.prompt,
      kind: subject,
      answers,
      correctId: t.option.id,
    };
  });
}

// ---------------------------------------------------------------------------
// Badges (award shelf)
// ---------------------------------------------------------------------------

export const BADGES: Badge[] = [
  {
    id: "first-steps",
    name: "First Steps",
    desc: "Earn your very first star. Every learner starts somewhere!",
    threshold: 1,
    icon: "rocket",
  },
  {
    id: "book-worm",
    name: "Book Worm",
    desc: "Earn 3 stars. You love to learn — keep it up!",
    threshold: 3,
    icon: "book",
  },
  {
    id: "rainbow",
    name: "Rainbow Star",
    desc: "Earn 5 stars. Halfway up the rainbow!",
    threshold: 5,
    icon: "palette",
  },
  {
    id: "super-star",
    name: "Super Star",
    desc: "Earn 8 stars. You are shining bright!",
    threshold: 8,
    icon: "star",
  },
  {
    id: "champion",
    name: "Champion",
    desc: "Earn 12 stars. A true learning champion!",
    threshold: 12,
    icon: "trophy",
  },
  {
    id: "crown",
    name: "Learning Royalty",
    desc: "Earn 18 stars. The crown is yours, Mia!",
    threshold: 18,
    icon: "crown",
  },
];

export const PRAISE_WORDS = [
  "Great job!",
  "You did it!",
  "Wow, amazing!",
  "Super smart!",
  "Perfect!",
];
