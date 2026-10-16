import { AchievementEvents } from "@shared/achievements";

/**
 * Milestone celebrations raised anywhere in the app are collected here and
 * played one at a time by <AchievementCelebrations />. Mutations only have to
 * hand over the achievements block the server sent back.
 */
export type Celebration =
  | { type: "badge"; badgeId: string }
  | { type: "level"; from: number; to: number }
  | { type: "week"; week: number; term: number }
  | { type: "term"; term: number }
  | { type: "streak"; days: number }
  | { type: "points"; points: number };

export type QueuedCelebration = Celebration & { id: number };

type Listener = (celebration: QueuedCelebration) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function subscribeToCelebrations(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function pushCelebration(celebration: Celebration): void {
  const queued: QueuedCelebration = { ...celebration, id: nextId++ };
  listeners.forEach((listener) => listener(queued));
}

/**
 * Turns a server achievements block into celebrations, most impressive first,
 * so a big moment is not hidden behind a smaller one.
 */
export function celebrateAchievements(events?: AchievementEvents | null): void {
  if (!events) return;

  for (const badgeId of events.newBadges ?? []) {
    pushCelebration({ type: "badge", badgeId });
  }
  if (events.levelUp) {
    pushCelebration({ type: "level", from: events.levelUp.from, to: events.levelUp.to });
  }
  if (events.termComplete) {
    pushCelebration({ type: "term", term: events.termComplete });
  }
  if (events.weekComplete) {
    pushCelebration({ type: "week", ...events.weekComplete });
  }
  if (events.streakMilestone) {
    pushCelebration({ type: "streak", days: events.streakMilestone });
  }
  if (events.pointsEarned) {
    pushCelebration({ type: "points", points: events.pointsEarned });
  }
}
