import { toZonedTime } from "date-fns-tz";
import { BadgeId, Grade, Streak, Task, UserStats, badges, formatDateKey } from "./schema";

/**
 * The school runs on Melbourne time. A study day, a streak and the
 * "time of day" badges all follow it, so a bug in the server clock or a server
 * hosted overseas cannot shift when a student's day starts.
 */
export const APP_TIMEZONE = "Australia/Sydney";

/** The wall-clock date and hour in the school's timezone. */
export function zonedDayAndHour(date: Date): { dateKey: string; hour: number } {
  const zoned = toZonedTime(date, APP_TIMEZONE);
  return { dateKey: formatDateKey(zoned), hour: zoned.getHours() };
}

/** YYYY-MM-DD for `daysAway` days from `date`, in the school's timezone. */
export function zonedDateKey(date: Date, daysAway = 0): string {
  const zoned = toZonedTime(date, APP_TIMEZONE);
  zoned.setDate(zoned.getDate() + daysAway);
  return formatDateKey(zoned);
}

/** Month number (0-11) in the school's timezone. */
export function zonedMonth(date: Date): number {
  return toZonedTime(date, APP_TIMEZONE).getMonth();
}

/**
 * The daily-challenge streak, counted back from today. Today counts as soon as
 * it is finished, and a day that is still open does not break the run, so the
 * number only drops once a whole day has been missed.
 */
export function challengeStreak(dates: string[], now: Date = new Date()): number {
  const finished = new Set(dates);

  let offset = finished.has(zonedDateKey(now)) ? 0 : -1;
  let streak = 0;
  while (finished.has(zonedDateKey(now, offset))) {
    streak += 1;
    offset -= 1;
  }
  return streak;
}

/**
 * One place decides what a student has earned. The server evaluates this after
 * every action that can change progress and stores the new badges, so the
 * client never has to guess.
 */
export interface AchievementSnapshot {
  tasks: Task[];
  streak: Streak;
  stats: UserStats;
  grades: Grade[];
  /** Injectable clock, so tests can pin "now". */
  now?: Date;
}

/**
 * Completion records are stored as `ISO timestamp|subjectId|taskId` so a single
 * jsonb column carries the date, the subject and the task that was completed.
 * Entries written before this format have no subject/task, and are still read
 * for the date and the hour they happened.
 */
export interface CompletionRecord {
  timestamp: Date;
  dateKey: string;
  hour: number;
  subjectId?: string;
  taskId?: string;
}

export function parseCompletionRecord(entry: string): CompletionRecord | null {
  const [rawTimestamp, subjectId, taskId] = String(entry).split("|");
  const timestamp = new Date(rawTimestamp);
  if (Number.isNaN(timestamp.getTime())) return null;
  const { dateKey, hour } = zonedDayAndHour(timestamp);
  return {
    timestamp,
    dateKey,
    hour,
    subjectId: subjectId || undefined,
    taskId: taskId || undefined,
  };
}

export function parseCompletionRecords(entries: unknown): CompletionRecord[] {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry) => parseCompletionRecord(String(entry)))
    .filter((record): record is CompletionRecord => record !== null);
}

/** Number of tasks completed per calendar day, derived from the records. */
export function dailyCompletionCounts(entries: unknown): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const record of parseCompletionRecords(entries)) {
    counts[record.dateKey] = (counts[record.dateKey] ?? 0) + 1;
  }
  return counts;
}

/** The best single day of "completed a task in every subject". */
function bestSubjectsInOneDay(entries: unknown): number {
  const byDay = new Map<string, Set<string>>();
  for (const record of parseCompletionRecords(entries)) {
    if (!record.subjectId) continue;
    const day = byDay.get(record.dateKey) ?? new Set<string>();
    day.add(record.subjectId);
    byDay.set(record.dateKey, day);
  }
  let best = 0;
  for (const day of Array.from(byDay.values())) best = Math.max(best, day.size);
  return best;
}

function completedBeforeHour(entries: unknown, hour: number): boolean {
  return parseCompletionRecords(entries).some((record) => record.hour < hour);
}

function completedAtOrAfterHour(entries: unknown, hour: number): boolean {
  return parseCompletionRecords(entries).some((record) => record.hour >= hour);
}

export interface AchievementProgress {
  tasksCompleted: number;
  tasksTotal: number;
  currentStreak: number;
  longestStreak: number;
  bestDayCount: number;
  bestSubjectsInOneDay: number;
  studyMinutes: number;
  pomodoroSessions: number;
  averageGrade: number | null;
  bestGrade: number | null;
}

/** Raw numbers every badge is measured against. */
export function getAchievementProgress(snapshot: AchievementSnapshot): AchievementProgress {
  const { tasks, streak, stats, grades } = snapshot;
  const records = parseCompletionRecords(stats.taskCompletionTimes);
  const dailyCounts = dailyCompletionCounts(stats.taskCompletionTimes);
  const scored = grades
    .map((grade) => grade.score)
    .filter((score): score is number => typeof score === "number");

  return {
    tasksCompleted: tasks.filter((task) => task.completed).length,
    tasksTotal: tasks.length,
    currentStreak: streak?.currentStreak ?? 0,
    longestStreak: streak?.longestStreak ?? 0,
    bestDayCount: Object.values(dailyCounts).reduce((max, count) => Math.max(max, count), 0),
    bestSubjectsInOneDay: bestSubjectsInOneDay(stats.taskCompletionTimes),
    studyMinutes: stats?.totalStudyMinutes ?? 0,
    pomodoroSessions: stats?.totalPomodoroSessions ?? 0,
    averageGrade: scored.length > 0
      ? Math.round(scored.reduce((sum, score) => sum + score, 0) / scored.length)
      : null,
    bestGrade: scored.length > 0 ? Math.max(...scored) : null,
  };
}

interface BadgeRule {
  /** Value that counts towards the badge right now. */
  current: (snapshot: AchievementSnapshot, progress: AchievementProgress) => number;
  /** Value that completes the badge. */
  target: number;
}

/**
 * A rule per badge in `badges`. Kept next to the badge definitions in spirit:
 * every badge has exactly one measurable rule and one threshold.
 */
const badgeRules: Record<BadgeId, BadgeRule> = {
  "getting-started": { current: (_s, p) => p.tasksCompleted, target: 1 },
  "week-warrior": { current: (_s, p) => p.currentStreak, target: 7 },
  "two-weeks-strong": { current: (_s, p) => p.currentStreak, target: 14 },
  "month-master": { current: (_s, p) => p.currentStreak, target: 30 },
  "century-club": { current: (_s, p) => p.currentStreak, target: 100 },
  "task-crusher": { current: (_s, p) => p.tasksCompleted, target: 50 },
  centurion: { current: (_s, p) => p.tasksCompleted, target: 100 },
  "perfect-score": { current: (_s, p) => p.bestGrade ?? 0, target: 100 },
  "honor-roll": { current: (_s, p) => p.averageGrade ?? 0, target: 90 },
  "early-bird": {
    current: (s) => (completedBeforeHour(s.stats.taskCompletionTimes, 8) ? 1 : 0),
    target: 1,
  },
  "night-owl": {
    current: (s) => (completedAtOrAfterHour(s.stats.taskCompletionTimes, 22) ? 1 : 0),
    target: 1,
  },
  "speed-demon": { current: (_s, p) => p.bestDayCount, target: 10 },
  "subject-master-math": subjectMasterRule("math"),
  "subject-master-science": subjectMasterRule("science"),
  "subject-master-history": subjectMasterRule("history"),
  "subject-master-english": subjectMasterRule("english"),
  "all-rounder": { current: (_s, p) => p.bestSubjectsInOneDay, target: 4 },
  "time-lord": { current: (_s, p) => p.studyMinutes, target: 25 * 60 },
  overachiever: {
    current: (_s, p) => (p.tasksTotal > 0 && p.tasksCompleted >= p.tasksTotal ? 1 : 0),
    target: 1,
  },
};

// "Every task in this subject" is measured in tasks, so the target depends on
// the student's timetable and `getBadgeProgress` fills it in per snapshot.
function subjectMasterRule(subjectId: string): BadgeRule {
  return {
    current: (snapshot) =>
      snapshot.tasks.filter((task) => task.subjectId === subjectId && task.completed).length,
    target: 1,
  };
}

/** Raw progress for a single badge, as a fraction ready for a progress bar. */
export interface BadgeProgress {
  id: BadgeId;
  name: string;
  earned: boolean;
  current: number;
  target: number;
  percent: number;
  /** e.g. "12 of 50 tasks" */
  requirement: string;
}

export function getBadgeProgress(snapshot: AchievementSnapshot): BadgeProgress[] {
  const progress = getAchievementProgress(snapshot);
  const earned = new Set(snapshot.stats?.badgesEarned ?? []);

  return badges.map((badge) => {
    const rule = badgeRules[badge.id];
    let current = rule.current(snapshot, progress);
    let target = rule.target;

    // Subject masters measure individual tasks, not whole subjects.
    if (badge.id.startsWith("subject-master-")) {
      const subjectId = badge.id.replace("subject-master-", "");
      target = snapshot.tasks.filter((task) => task.subjectId === subjectId).length;
      current = Math.min(current, target);
    }

    const isEarned = earned.has(badge.id);
    const percent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

    return {
      id: badge.id,
      name: badge.name,
      earned: isEarned,
      current,
      target,
      percent: isEarned ? 100 : percent,
      requirement: badge.requirement,
    };
  });
}

/** Badges the snapshot qualifies for, whether or not they are already stored. */
export function evaluateBadges(snapshot: AchievementSnapshot): BadgeId[] {
  return getBadgeProgress(snapshot)
    .filter((badge) => badge.target > 0 && badge.current >= badge.target)
    .map((badge) => badge.id);
}

/** Badges the student qualifies for that are not stored yet. */
export function newBadgesFor(snapshot: AchievementSnapshot): BadgeId[] {
  const earned = new Set(snapshot.stats?.badgesEarned ?? []);
  return evaluateBadges(snapshot).filter((id) => !earned.has(id));
}

/** Streak lengths worth celebrating. */
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100];

/** The milestone a streak just reached, e.g. 0 -> 7 returns 7. */
export function streakMilestoneCrossed(before: number, after: number): number | null {
  if (after <= before) return null;
  const crossed = STREAK_MILESTONES.filter((milestone) => before < milestone && after >= milestone);
  return crossed.length > 0 ? crossed[crossed.length - 1] : null;
}

/** Everything the client needs to play the right celebration. */
export interface AchievementEvents {
  newBadges: BadgeId[];
  levelUp: { from: number; to: number } | null;
  pointsEarned: number;
  streakMilestone: number | null;
  weekComplete: { week: number; term: number } | null;
  termComplete: number | null;
}

export function emptyAchievementEvents(): AchievementEvents {
  return {
    newBadges: [],
    levelUp: null,
    pointsEarned: 0,
    streakMilestone: null,
    weekComplete: null,
    termComplete: null,
  };
}

/** True when there is something worth showing. */
export function hasCelebration(events?: AchievementEvents | null): boolean {
  if (!events) return false;
  return (
    events.newBadges.length > 0 ||
    !!events.levelUp ||
    !!events.streakMilestone ||
    !!events.weekComplete ||
    !!events.termComplete
  );
}
