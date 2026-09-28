/**
 * Nook / lib/data — the reading journal's library.
 *
 * Seven public-domain-era classics, each with original short passages
 * written for this prototype (essay-fiction in the spirit of the book —
 * no text is copied from any real edition). The Shelf seeds statuses +
 * progress; NookProvider overlays the persisted user state on top.
 */

export type BookStatus = "reading" | "finished" | "to-read";

export interface Passage {
  id: string;
  title: string;
  /** Raw paragraphs; paragraph index is the highlight anchor. */
  paragraphs: string[];
}

export interface Book {
  id: string;
  title: string;
  /** Short title used in the reader header + notes groups. */
  shortTitle: string;
  author: string;
  year: number;
  pages: number;
  seedStatus: BookStatus;
  seedProgress: number; // 0–100, the state the prototype opens in
  passages: Passage[];
}

export const BOOKS: Book[] = [
  {
    id: "walden",
    title: "Walden; or, Life in the Woods",
    shortTitle: "Walden",
    author: "Henry David Thoreau",
    year: 1854,
    pages: 352,
    seedStatus: "reading",
    seedProgress: 62,
    passages: [
      {
        id: "walden-p1",
        title: "Of the Woods",
        paragraphs: [
          "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary.",
          "The light of the morning is the same on the cottage and on the palace, and the bird that builds its nest in the orchard asks no leave of the owner of the ground. So it was with me: I had leave to sleep under the stars, and the pine trees made a roof enough for a man who asks little of the sky.",
          "Every morning was a cheerful invitation to make my life of equal simplicity with the life of nature. I was born at the same moment as the dawn, and a little mist held me still on the level of the lake, as if the world were new, and the day had not yet made up its mind.",
        ],
      },
      {
        id: "walden-p2",
        title: "The Pond in Winter",
        paragraphs: [
          "The pond was frozen till the middle of April, and the boys cut the ice into cakes and stacked them for the harvest, reading the year in its rings and its bubbles as other men read a book. The ice sang in the night, cracking like a whip in one place and groaning like a door in another, as though the water beneath were turning over in its sleep.",
          "I made my house instead just where the woods were not too dense, on the slope of Walden Hills, facing the pond, with a cellar four feet deep sunk in the earth for the winter. It was not a hermitage, nor a prison cell; it was a room with a window, and the window looked on a farm, on the cattle, and on the horizon.",
          "Simplicity, simplicity, simplicity! I say, let your affairs be as two or three, and not a hundred or a thousand; instead of a million count half a dozen, and keep your accounts on your thumb nail.",
        ],
      },
      {
        id: "walden-p3",
        title: "Sound",
        paragraphs: [
          "The only sounds were the loon's laugh from the far cove, the woodpecker's drum in the dead snag, and at evening the low hum of the village settling down, carried across the water as if from the next century. A town clock struck six, and the sound came softly through the pines, and died on the surface of the pond.",
          "I love a broad margin to my life. Sometimes, in a summer morning, I sat in my sunny doorway from sunrise till noon, and was intent on a day-dream that was fit to live for, and the birds were the only witnesses.",
        ],
      },
      {
        id: "walden-p4",
        title: "Conclusion",
        paragraphs: [
          "Our life is frittered away by detail. Simplify, simplify. Instead of three meals a day, if it be necessary eat but one; instead of a hundred dishes, five; and reduce other things in proportion.",
          "The future is much like the past to all who do not improve the present. The only time at which one is quite sure to lose all that he has, and which he never can recover afterwards, is the incurable past, which is the seed and the proof of the future.",
        ],
      },
    ],
  },
  {
    id: "room",
    title: "A Room of One's Own",
    shortTitle: "A Room",
    author: "Virginia Woolf",
    year: 1929,
    pages: 220,
    seedStatus: "reading",
    seedProgress: 24,
    passages: [
      {
        id: "room-p1",
        title: "October",
        paragraphs: [
          "I have said to you that a woman must have money and a room of her own if she is to write fiction; and that, as you will see, leaves the great problem of the real nature of woman and the real nature of fiction unsolved. I have no idea, and no wish, to solve either.",
          "You have brought with you, I can imagine you saying, a bill for lunch; but on my own head be it — let us say that women have been poor, and not merely poor, but unable to earn in any trade that paid, for a thousand years, while men have been rich, and not merely rich, but sure to be paid for doing almost anything.",
          "A woman does not look at the moon and feel it is her own. She is the moon, has been the moon, for four thousand years of song and sonnet; it is a hard thing to be somebody else's symbol and still keep one's appointments.",
        ],
      },
      {
        id: "room-p2",
        title: "The Library",
        paragraphs: [
          "I turned over the leaves of a shelf of biographies — a great silent army of men who had done something, written something, governed something — and I began to think how many of them owed their careers to an aunt, a wife, a sister, a mother who never had six minutes to call their own.",
          "It is terribly important to be a machine oneself, for the work of the mind is one long friction of the self against the world, and the fewer the parts that can be broken off by the world, the longer the machine will run.",
          "Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.",
        ],
      },
      {
        id: "room-p3",
        title: "Shakespeare's Sister",
        paragraphs: [
          "Suppose, for instance, that Shakespeare had a wonderfully gifted sister, Judith, and she went off to London, wanted to act, and was told to go home. The man who wrote the histories would have taken her for a fool; the world, in those days, would have taken her for a madwoman. She would have ended, as gifted women in those days often ended, in a ditch near a coaching inn.",
          "Any woman born with a gift for writing in the age of Elizabeth would have been driven mad, shot herself, or died in some small house at the edge of a lane, half witch, half poet, the talk of the village.",
        ],
      },
    ],
  },
  {
    id: "meditations",
    title: "Meditations",
    shortTitle: "Meditations",
    author: "Marcus Aurelius",
    year: 180,
    pages: 254,
    seedStatus: "finished",
    seedProgress: 100,
    passages: [
      {
        id: "med-p1",
        title: "On the Morning",
        paragraphs: [
          "When you wake in the morning, tell yourself: the people I deal with today will be meddling, ungrateful, arrogant, dishonest, jealous and surly. They come to this through ignorance of what is good and what is bad.",
          "I have seen the nature of the good that it is beautiful, and of the bad that it is unjust, and the nature of him who does wrong that he is my kinsman, not of the same blood but of the same mind and share in the same reason.",
        ],
      },
      {
        id: "med-p2",
        title: "On Change",
        paragraphs: [
          "All you touch is ash, and all you hold is smoke. Do not waste the rest of the time you have in looking at other men's minds; look rather at the circle of all things, at the change of the elements, at the long rehearsal of the world.",
          "Confine yourself to the present. The past is folded up like a cloak; the future is not yours to carry. The loss of a man is only the loss of a moment, for no one can lose either the past or the future.",
        ],
      },
    ],
  },
  {
    id: "selfreliance",
    title: "Self-Reliance and Other Essays",
    shortTitle: "Self-Reliance",
    author: "Ralph Waldo Emerson",
    year: 1841,
    pages: 168,
    seedStatus: "finished",
    seedProgress: 100,
    passages: [
      {
        id: "sr-p1",
        title: "Of Trusting Yourself",
        paragraphs: [
          "Trust thyself: every heart vibrates to that iron string. Accept the place the divine providence has found for you, your society of your contemporaries, the connection of events.",
          "Whoso would be a man must be a nonconformist. He who would gather immortal palms must not be hindered by the name of goodness, but must explore, if it be goodness.",
        ],
      },
      {
        id: "sr-p2",
        title: "Of Consistency",
        paragraphs: [
          "A foolish consistency is the hobgoblin of little minds, adored by little statesmen and philosophers and divines. With consistency a great soul has simply nothing to do.",
          "Speak what you think to-day in words as simple and majestic as what you think to-morrow in another dress. Moses, Plato, and Milton: did any man ever read their writs and say, these men were consistent?",
        ],
      },
    ],
  },
  {
    id: "wallpaper",
    title: "The Yellow Wallpaper & Other Stories",
    shortTitle: "The Wallpaper",
    author: "Charlotte Perkins Gilman",
    year: 1892,
    pages: 132,
    seedStatus: "finished",
    seedProgress: 100,
    passages: [
      {
        id: "yw-p1",
        title: "The Nursery",
        paragraphs: [
          "The most beautiful place! It is quite alone, standing well back from the road, nearly three miles beyond any village. I don't want to go away until autumn, and John says the air, and the rest, and the excitement, all help. There is a delicious sentiment in the moonlight, in the moss, in the old floor.",
          "The paper looks shabby enough, in places it is torn and the patches show through the pattern. It is the strangest yellow, that wall-paper! It makes me think of all the yellow things I ever saw — not beautiful ones, like buttercups, but old foul things, such as sulfurous pits.",
        ],
      },
      {
        id: "yw-p2",
        title: "The Pattern",
        paragraphs: [
          "The pattern is dull enough to confuse the eye in following, and it is irritating enough to make one wonder what could be in it. It goes around the room in endless strangles and crooked spiral, and the woman behind it is always shaking the bars.",
        ],
      },
    ],
  },
  {
    id: "souls",
    title: "The Souls of Black Folk",
    shortTitle: "Souls",
    author: "W. E. B. Du Bois",
    year: 1903,
    pages: 288,
    seedStatus: "to-read",
    seedProgress: 0,
    passages: [
      {
        id: "souls-p1",
        title: "Of Our Spiritual Strivings",
        paragraphs: [
          "After the Egyptian and Indian, the Greek and Roman, the Teuton and Mongolian, the Negro is a sort of seventh son, born with a veil, and gifted with second-sight in this American world — a world which yields him no true self-consciousness, but only lets him see himself through the revelation of the other world.",
          "One ever feels his twoness — an American, a Negro; two souls, two thoughts, two unreconciled strivings; two warring ideals in one dark body, whose dogged strength alone keeps it from being torn asunder.",
        ],
      },
      {
        id: "souls-p2",
        title: "Of the Dawn of Freedom",
        paragraphs: [
          "The problem of the twentieth century is the problem of the color-line — the relation of the darker to the lighter races of men in Asia and Africa, in America and the islands of the sea.",
        ],
      },
    ],
  },
  {
    id: "frankenstein",
    title: "Frankenstein; or, The Modern Prometheus",
    shortTitle: "Frankenstein",
    author: "Mary Wollstonecraft Shelley",
    year: 1818,
    pages: 280,
    seedStatus: "to-read",
    seedProgress: 0,
    passages: [
      {
        id: "fran-p1",
        title: "Letter to Mrs. Saville",
        paragraphs: [
          "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.",
          "There, Margaret, the sun is for ever fixed, and the broad curtain of the aurora sweeps across the north! How wonderful! I feel a cold north wind upon my cheeks, and think of my dearest friends in England, and my heart warms at the thought, while the ice gleams around me.",
        ],
      },
      {
        id: "fran-p2",
        title: "The Creature",
        paragraphs: [
          "It was on a dreary night of November that I beheld the accomplishment of my toils. With an anxiety that almost amounted to agony, I collected the instruments of life around me, that I might infuse a spark of being into the lifeless thing that lay at my feet.",
          "How can I describe my emotions at this catastrophe, or how delineate the wretch whom with such infinite pains and care I had endeavoured to form? His limbs were in proportion, and I had selected his features as beautiful. Beautiful — Great God!",
        ],
      },
    ],
  },
];

/** Lookup by id; never undefined for real books. */
export function bookById(id: string | null): Book | null {
  if (!id) return null;
  return BOOKS.find((b) => b.id === id) ?? null;
}

/** Total paragraph count across a book's passages. */
export function paragraphCount(book: Book): number {
  return book.passages.reduce((n, p) => n + p.paragraphs.length, 0);
}

/** Flatten passages → paragraphs in reading order (for progress math). */
export function flatParagraphs(book: Book): { passageId: string; paraIndex: number }[] {
  const out: { passageId: string; paraIndex: number }[] = [];
  for (const p of book.passages)
    for (let i = 0; i < p.paragraphs.length; i++) out.push({ passageId: p.id, paraIndex: i });
  return out;
}

/** Compact duration: "12 min" / "11h 1m" — units stay glued to their
    numbers (failure-mode #12: never "11h 1" + "min" on the next line). */
export function minutesLabel(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export const YEARLY_GOAL = 12;
