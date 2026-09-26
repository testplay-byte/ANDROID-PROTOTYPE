"use client";

/**
 * kids-learning / screens / play-screen — the mini learning game.
 *
 * A question card ("Which one is the letter B?") with 3 big puffy answer
 * buttons. Correct → button squishes, a star flies into the progress row,
 * a happy message appears, next question after 800ms. Wrong → pressed
 * dough look (--shadow-inset) + gentle shake, then retry.
 *
 * 5 questions per round, then a round summary with the stars earned.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { TopBar } from "../../../proto-kit";
import { SUBJECTS, SUBJECT_BY_ID, generateQuestions, PRAISE_WORDS } from "../lib/data";
import type { Question, SubjectId } from "../lib/types";
import { StarRow } from "../components/star-row";
import { ShapeGlyph } from "../components/shape-glyph";
import styles from "./play-screen.module.css";

interface PlayScreenProps {
  active: boolean;
  subject: SubjectId;
  /** Switch the active subject (page owns the shared subject state). */
  onSelectSubject: (subject: SubjectId) => void;
  /** Called once when a round finishes, with the stars earned (0–5). */
  onRoundEnd: (subject: SubjectId, stars: number) => void;
}

type Phase = "ask" | "reveal" | "summary";

export function PlayScreen({ active, subject, onSelectSubject, onRoundEnd }: PlayScreenProps) {
  const [round, setRound] = useState(0);
  const questions = useMemo(
    () => generateQuestions(subject),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subject, round],
  );

  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("ask");
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [roundStars, setRoundStars] = useState(0);
  const [praise, setPraise] = useState("");
  const [flyKey, setFlyKey] = useState(0);

  // Pending timers (next-question + wrong-shake) — cleared on reset/unmount.
  const timersRef = useRef<number[]>([]);
  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Reset the round whenever the subject (or a new round) changes.
  useEffect(() => {
    setQIndex(0);
    setPhase("ask");
    setPickedId(null);
    setWrongId(null);
    setRoundStars(0);
    setPraise("");
  }, [subject, round]);

  function clearTimers() {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current = [];
  }

  function handleAnswer(question: Question, answerId: string) {
    if (phase !== "ask" || wrongId !== null) return;

    if (answerId === question.correctId) {
      const stars = roundStars + 1;
      clearTimers();
      setPickedId(answerId);
      setRoundStars(stars);
      setPraise(PRAISE_WORDS[Math.floor(Math.random() * PRAISE_WORDS.length)]);
      setFlyKey((k) => k + 1);
      setPhase("reveal");
      timersRef.current.push(
        window.setTimeout(() => {
          if (qIndex + 1 >= questions.length) {
            onRoundEnd(subject, stars);
            setPhase("summary");
          } else {
            setQIndex((i) => i + 1);
            setPickedId(null);
            setPraise("");
            setPhase("ask");
          }
        }, 800),
      );
    } else {
      setWrongId(answerId);
      timersRef.current.push(
        window.setTimeout(() => setWrongId(null), 600),
      );
    }
  }

  function playAgain() {
    clearTimers();
    setRound((r) => r + 1);
  }

  const subjectInfo = SUBJECT_BY_ID[subject];
  const question: Question | undefined = questions[qIndex];

  return (
    <section
      className={`view ${active ? "view--active" : ""}`}
      data-view="play"
      aria-label="Play"
      aria-hidden={!active}
    >
      <TopBar
        variant="hero"
        title="PLAY TIME"
        subtitle={subjectInfo.name.toUpperCase()}
      />
      <div className={styles.content}>
        {/* Subject switcher */}
        <div className={styles.subjectRow} role="tablist" aria-label="Subjects">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.subjectPill} ${s.id === subject ? styles.subjectPillActive : ""}`}
              onClick={() => {
                clearTimers();
                onSelectSubject(s.id);
              }}
              aria-pressed={s.id === subject}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Progress row */}
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>
            Question {Math.min(qIndex + 1, questions.length)} of {questions.length}
          </span>
          <StarRow filled={roundStars} total={5} size={18} />
        </div>

        {phase === "summary" ? (
          <div className={styles.summaryCard}>
            <StarRow filled={roundStars} total={5} size={34} />
            <p className={styles.summaryTitle}>
              {roundStars >= 4 ? "Super duper!" : roundStars >= 2 ? "Nice work!" : "Good try!"}
            </p>
            <p className={styles.summaryDesc}>
              You earned {roundStars} {roundStars === 1 ? "star" : "stars"} in{" "}
              {subjectInfo.name}!
            </p>
            <button type="button" className={styles.bigButton} onClick={playAgain}>
              Play Again
            </button>
          </div>
        ) : question ? (
          <div className={styles.gameArea}>
            {/* Question card */}
            <div className={styles.questionCard}>
              <p className={styles.prompt}>{question.prompt}</p>
              {/* Flying star (retriggered via key on each correct answer) */}
              {phase === "reveal" && (
                <svg
                  key={flyKey}
                  className={styles.flyStar}
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2.5l2.9 5.9 6.6.96-4.75 4.63 1.12 6.54L12 17.47 6.13 20.53l1.12-6.54L2.5 9.36l6.6-.96z"
                    fill="var(--color-warn)"
                  />
                </svg>
              )}
            </div>

            {/* Answers */}
            <div className={styles.answers}>
              {question.answers.map((a) => {
                const isCorrect = a.id === question.correctId;
                const isPicked = a.id === pickedId;
                const isWrong = a.id === wrongId;
                const cls = [
                  styles.answer,
                  isPicked && isCorrect ? styles.answerCorrect : "",
                  isWrong ? styles.answerWrong : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={a.id}
                    type="button"
                    className={cls}
                    onClick={() => handleAnswer(question, a.id)}
                  >
                    {a.label !== undefined && <span className={styles.answerLabel}>{a.label}</span>}
                    {a.color && (
                      <span
                        className={styles.answerBlob}
                        style={{ background: a.color }}
                        aria-hidden="true"
                      />
                    )}
                    {a.shape && <ShapeGlyph kind={a.shape} size={52} />}
                  </button>
                );
              })}
            </div>

            {/* Happy message */}
            <p
              className={`${styles.praise} ${phase === "reveal" ? styles.praiseShow : ""}`}
              role="status"
            >
              {phase === "reveal" ? praise : ""}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
