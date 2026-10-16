import { StudyMistake, Task, getCurrentWeek } from "@shared/schema";
import { getStudyContent, PracticeQuestion, FlashcardQuestion } from "./studyContent";

/**
 * Choosing the daily five.
 *
 * The questions themselves live in the study content library, which the client
 * already has, so the day's set is derived here rather than sent from the
 * server. The date seed makes it the same five for the whole day, and the same
 * five again after a reload.
 */

/** One question in the challenge, with enough context to render and mark it. */
export interface ChallengeQuestion {
  /** Stable identity, used to keep the two sources from overlapping. */
  key: string;
  taskId: string;
  index: number;
  subjectId: string;
  question: string;
  answer: string;
  options: string[];
}

export const DAILY_CHALLENGE_SIZE = 5;

/** How many of the five come from the mistake pile when it has enough. */
const MISTAKE_QUOTA = 3;

/**
 * The study page builds its question list as practice questions followed by
 * flashcards, so an index stored with a mistake means the same question here.
 */
function allQuestionsFor(task: Task): (PracticeQuestion | FlashcardQuestion)[] {
  const content = getStudyContent(task.subjectId, task.title, task.week);
  return [...(content.practiceQuestions ?? []), ...(content.flashcards ?? [])];
}

/**
 * Only multiple-choice questions are drawn, so the result can be marked without
 * asking the student to grade their own answer.
 */
function questionsFor(task: Task, cache: Map<string, ChallengeQuestion[]>): ChallengeQuestion[] {
  const cached = cache.get(task.id);
  if (cached) return cached;

  const questions = allQuestionsFor(task)
    .map((question, index) => {
      if (!question.options?.length) return null;
      const entry: ChallengeQuestion = {
        key: `${task.id}:${index}`,
        taskId: task.id,
        index,
        subjectId: task.subjectId,
        question: question.question,
        answer: question.answer,
        options: question.options,
      };
      return entry;
    })
    .filter((entry): entry is ChallengeQuestion => entry !== null);

  cache.set(task.id, questions);
  return questions;
}

export interface ChallengePool {
  /** Questions the student got wrong before, most recently met first. */
  mistakes: ChallengeQuestion[];
  /** Questions from the week being studied right now. */
  topics: ChallengeQuestion[];
}

/**
 * Everything the day can draw on: the mistake pile first, then the current
 * week's topics. The two lists never overlap, so the same question cannot use
 * up two slots.
 */
export function buildChallengePool(tasks: Task[], mistakes: StudyMistake[]): ChallengePool {
  const cache = new Map<string, ChallengeQuestion[]>();
  const byId = new Map(tasks.map((task) => [task.id, task]));

  const fromMistakes: ChallengeQuestion[] = [];
  const taken = new Set<string>();
  for (const mistake of mistakes) {
    const task = byId.get(mistake.taskId);
    if (!task) continue;
    const question = questionsFor(task, cache).find((entry) => entry.index === mistake.index);
    if (!question || taken.has(question.key)) continue;
    taken.add(question.key);
    fromMistakes.push(question);
  }

  const week = getCurrentWeek();
  const fromTopics: ChallengeQuestion[] = [];
  for (const task of tasks.filter((entry) => entry.week === week)) {
    for (const question of questionsFor(task, cache)) {
      if (taken.has(question.key)) continue;
      taken.add(question.key);
      fromTopics.push(question);
    }
  }

  return { mistakes: fromMistakes, topics: fromTopics };
}

/** A deterministic permutation of 0..count-1, so a given seed always agrees. */
function seededOrder(count: number, seed: string): number[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // mulberry32, seeded from the hash above.
  let state = hash >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const order = Array.from({ length: count }, (_, index) => index);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function takeSeeded(source: ChallengeQuestion[], count: number, seed: string): ChallengeQuestion[] {
  const wanted = Math.max(0, Math.min(count, source.length));
  return seededOrder(source.length, seed).slice(0, wanted).map((index) => source[index]);
}

/**
 * The day's questions: as much of the mistake pile as fits, topped up from the
 * week's topics, then shuffled so the mistakes are not always first. A day with
 * an empty pile still yields a full quiz from the current week.
 */
export function pickDailyChallenge(
  pool: ChallengePool,
  dateKey: string,
  size = DAILY_CHALLENGE_SIZE,
): ChallengeQuestion[] {
  const chosen = [
    ...takeSeeded(pool.mistakes, MISTAKE_QUOTA, `${dateKey}-mistakes`),
    ...takeSeeded(pool.topics, size - Math.min(MISTAKE_QUOTA, pool.mistakes.length), `${dateKey}-topics`),
  ].slice(0, size);

  return seededOrder(chosen.length, `${dateKey}-order`).map((index) => chosen[index]);
}

/** Marks an answer the same way the study page does. */
export function isCorrectAnswer(selected: string, answer: string): boolean {
  return selected.trim().toLowerCase() === answer.trim().toLowerCase();
}
