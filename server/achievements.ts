import { storage } from "./storage";
import {
  DbGrade,
  DbStreak,
  DbTask,
  DbUserStats,
  Grade,
  Streak,
  StudyMistake,
  Task,
  UserStats,
  getLevelFromPoints,
} from "@shared/schema";
import {
  AchievementEvents,
  newBadgesFor,
  streakMilestoneCrossed,
  zonedDateKey,
  zonedMonth,
} from "@shared/achievements";

/**
 * Server-side achievement bookkeeping.
 *
 * The client only renders what the server decided here, so a badge is earned
 * exactly once and survives a reload, a new device or a cleared browser.
 */

// jsonb columns come back as unknown, so every field is read through a guard
// rather than trusted.
function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((entry) => String(entry)) : [];
}

function asNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const result: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const parsed = typeof raw === "number" ? raw : Number(raw);
    if (Number.isFinite(parsed)) result[key] = parsed;
  }
  return result;
}

/**
 * The stored mistake pile is a jsonb column, so each entry is checked rather
 * than trusted: one malformed row must not take the study page down.
 */
function asMistakes(value: unknown): StudyMistake[] {
  if (!Array.isArray(value)) return [];

  const mistakes: StudyMistake[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const { taskId, index } = entry as { taskId?: unknown; index?: unknown };
    const parsedIndex = typeof index === "number" ? index : Number(index);
    if (typeof taskId !== "string" || !Number.isFinite(parsedIndex)) continue;
    mistakes.push({ taskId, index: parsedIndex });
  }
  return mistakes;
}

/** A stored stats row, with every jsonb field normalised. */
export function toUserStats(row: DbUserStats): UserStats {
  return {
    totalPoints: row.totalPoints ?? 0,
    totalStudyMinutes: row.totalStudyMinutes ?? 0,
    totalTasksCompleted: row.totalTasksCompleted ?? 0,
    totalPomodoroSessions: row.totalPomodoroSessions ?? 0,
    badgesEarned: asStringArray(row.badgesEarned),
    dailyTaskCompletions: asNumberRecord(row.dailyTaskCompletions),
    taskCompletionTimes: asStringArray(row.taskCompletionTimes),
    subjectStudyMinutes: asNumberRecord(row.subjectStudyMinutes),
    level: row.level ?? 1,
    lastActiveDate: row.lastActiveDate ?? null,
    showcasedBadges: asStringArray(row.showcasedBadges),
    mistakes: asMistakes(row.mistakes),
    challengeDates: asStringArray(row.challengeDates),
  };
}

export function toStreak(row: DbStreak | undefined): Streak {
  return {
    currentStreak: row?.currentStreak ?? 0,
    longestStreak: row?.longestStreak ?? 0,
    lastStudyDate: row?.lastStudyDate ?? null,
    lastActiveDate: row?.lastActiveDate ?? null,
    lastCheckDate: row?.lastCheckDate ?? null,
    streakFreezes: row?.streakFreezes ?? FREEZES_PER_MONTH,
    freezesUsedThisMonth: row?.freezesUsedThisMonth ?? 0,
    freezeDaysRemaining: row?.freezeDaysRemaining ?? FREEZES_PER_MONTH,
    lastFreezeMonth: row?.lastFreezeMonth ?? null,
  };
}

/** Streak freezes are topped back up to this many at the start of each month. */
export const FREEZES_PER_MONTH = 2;

/** Streak freezes are refilled once a month, as the streak card promises. */
export async function refreshMonthlyFreezes(userId: string): Promise<Streak> {
  const current = toStreak(await storage.getStreak(userId));
  const month = zonedMonth(new Date());
  if (current.lastFreezeMonth === month) return current;

  const saved = await storage.saveStreak(userId, {
    streakFreezes: FREEZES_PER_MONTH,
    freezeDaysRemaining: FREEZES_PER_MONTH,
    freezesUsedThisMonth: 0,
    lastFreezeMonth: month,
  });
  return toStreak(saved);
}

/**
 * Records study activity for today and advances the streak: same day is a
 * no-op, the next day extends it, one missed day is covered by a streak freeze
 * if the student has one, and anything longer restarts the streak. Days are the
 * student's school days, not the server's.
 */
export async function touchStreak(userId: string): Promise<Streak> {
  const now = new Date();
  const today = zonedDateKey(now);
  const yesterday = zonedDateKey(now, -1);
  const twoDaysAgo = zonedDateKey(now, -2);

  let streak = await refreshMonthlyFreezes(userId);
  if (streak.lastStudyDate === today) return streak;

  let currentStreak = 1;
  let freezes = streak.streakFreezes;
  let freezesUsed = streak.freezesUsedThisMonth;

  if (streak.lastStudyDate === yesterday) {
    currentStreak = streak.currentStreak + 1;
  } else if (streak.lastStudyDate === twoDaysAgo && freezes > 0) {
    currentStreak = streak.currentStreak + 1;
    freezes -= 1;
    freezesUsed += 1;
  }

  const saved = await storage.saveStreak(userId, {
    currentStreak,
    longestStreak: Math.max(streak.longestStreak, currentStreak),
    lastStudyDate: today,
    lastActiveDate: today,
    lastCheckDate: today,
    streakFreezes: freezes,
    freezeDaysRemaining: freezes,
    freezesUsedThisMonth: freezesUsed,
  });
  return toStreak(saved);
}

export interface SyncResult {
  stats: UserStats;
  streak: Streak;
  newBadges: string[];
  levelUp: { from: number; to: number } | null;
}

/**
 * Re-decides the whole trophy case from stored progress and saves anything new.
 * Called after every action that can move a badge, so the browser never has to
 * replicate the badge rules.
 */
export async function syncAchievements(userId: string): Promise<SyncResult> {
  const [statsRow, tasks, streakRow, grades] = await Promise.all([
    storage.getUserStats(userId),
    storage.getTasksByUserId(userId),
    storage.getStreak(userId),
    storage.getGradesByUserId(userId),
  ]);

  const stats = statsRow ? toUserStats(statsRow) : defaultUserStats();
  const streak = toStreak(streakRow);

  const newBadges = newBadgesFor({
    tasks: asTasks(tasks),
    streak,
    stats,
    grades: asGrades(grades),
  });
  const level = getLevelFromPoints(stats.totalPoints);
  const levelUp = level > stats.level ? { from: stats.level, to: level } : null;

  const saved = await storage.saveUserStats(userId, {
    totalTasksCompleted: tasks.filter((task) => task.completed).length,
    badgesEarned: [...stats.badgesEarned, ...newBadges],
    level,
  });

  return { stats: toUserStats(saved), streak, newBadges, levelUp };
}

/**
 * Subject ids are stored as text (the app's subject union is enforced upstairs
 * when rows are written), so the evaluator's narrower types need no extra work.
 */
function asTasks(rows: DbTask[]): Task[] {
  return rows as unknown as Task[];
}

function asGrades(rows: DbGrade[]): Grade[] {
  return rows as unknown as Grade[];
}

/** Defaults for an account that has no stats row yet. */
export function defaultUserStats(): UserStats {
  return {
    totalPoints: 0,
    totalStudyMinutes: 0,
    totalTasksCompleted: 0,
    totalPomodoroSessions: 0,
    badgesEarned: [],
    dailyTaskCompletions: {},
    taskCompletionTimes: [],
    subjectStudyMinutes: {},
    level: 1,
    lastActiveDate: null,
    showcasedBadges: [],
    mistakes: [],
    challengeDates: [],
  };
}

/** The events block every mutating response carries so the UI can celebrate. */
export function achievementEvents(result: SyncResult, extras: Partial<AchievementEvents> = {}): AchievementEvents {
  return {
    newBadges: result.newBadges as AchievementEvents["newBadges"],
    levelUp: result.levelUp,
    pointsEarned: 0,
    streakMilestone: null,
    weekComplete: null,
    termComplete: null,
    ...extras,
  };
}

export { streakMilestoneCrossed };
