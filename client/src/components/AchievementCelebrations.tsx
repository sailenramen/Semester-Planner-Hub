import { useEffect, useRef, useState } from "react";
import { badges as allBadges, getPointsForNextLevel } from "@shared/schema";
import { BadgeIcon } from "./BadgeIcon";
import { Confetti } from "./Confetti";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useSyncAchievements, useUserStats } from "@/hooks/useApi";
import { QueuedCelebration, subscribeToCelebrations } from "@/lib/celebrations";
import { CalendarCheck, Flame, GraduationCap, Sparkles, Star, Trophy, Zap } from "lucide-react";

/** How long each celebration stays on screen. */
const MODAL_DURATION = 7000;
const POINTS_DURATION = 1800;

/**
 * Plays the milestone celebrations the server reported: badges, level ups,
 * completed weeks and terms, streak records and the points from a task. Queued
 * so several at once are shown one after another instead of overlapping.
 */
export function AchievementCelebrations() {
  const { user } = useAuth();
  const syncAchievements = useSyncAchievements();
  const { data: stats } = useUserStats();
  const [queue, setQueue] = useState<QueuedCelebration[]>([]);
  const syncedFor = useRef<string | null>(null);

  // Signing in re-decides the trophy case, so badges earned before the rules
  // were last changed are still granted (and celebrated) on the next visit.
  useEffect(() => {
    if (!user || syncedFor.current === user.id) return;
    syncedFor.current = user.id;
    syncAchievements.mutate();
  }, [user, syncAchievements]);

  useEffect(() => subscribeToCelebrations((celebration) => {
    setQueue((current) => [...current, celebration]);
  }), []);

  const current = queue[0] ?? null;
  const dismiss = () => setQueue((current) => current.slice(1));

  useEffect(() => {
    if (!current) return;
    const duration = current.type === "points" ? POINTS_DURATION : MODAL_DURATION;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  if (current.type === "points") {
    const gained = current.points > 0;
    return (
      <div className="pointer-events-none fixed left-1/2 top-4 z-[70] -translate-x-1/2">
        <div
          className={`animate-text-pop flex items-center gap-2 rounded-full border px-4 py-2 shadow-lg ${
            gained
              ? "border-yellow-400/60 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
              : "border-muted-foreground/30 bg-muted text-muted-foreground"
          }`}
          data-testid="points-celebration"
        >
          <Zap className="h-4 w-4" />
          <span className="font-semibold">
            {gained ? "+" : ""}
            {current.points} points
          </span>
        </div>
      </div>
    );
  }

  return (
    <CelebrationOverlay celebration={current} onDismiss={dismiss} stats={stats} />
  );
}

interface OverlayProps {
  celebration: QueuedCelebration;
  onDismiss: () => void;
  stats?: { totalPoints: number; level: number };
}

function CelebrationOverlay({ celebration, onDismiss, stats }: OverlayProps) {
  const content = celebrationContent(celebration, stats);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm animate-overlay-in"
      role="dialog"
      aria-live="polite"
      aria-label={content.title}
      data-testid="celebration-overlay"
      onClick={onDismiss}
    >
      <Confetti active variant="burst" count={46} duration={2100} />
      <Confetti active variant="rain" count={40} duration={4200} />

      <div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl border bg-card p-6 text-center shadow-2xl animate-card-in"
        data-testid={`celebration-${celebration.type}`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Sweeping highlight across the card */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -inset-y-8 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine dark:via-white/10" />
        </div>

        <div className="relative mx-auto mb-5 flex h-32 w-32 items-center justify-center">
          {/* Two rings pulse outward behind the emblem */}
          <span className={`absolute inset-0 rounded-full ${content.ringColor} animate-ring-burst`} />
          <span
            className={`absolute inset-0 rounded-full ${content.ringColor} animate-ring-burst`}
            style={{ animationDelay: "0.7s" }}
          />
          {/* A slow sweep of light around the emblem, under the disc. */}
          <span
            className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(250,204,21,0.85)_60deg,transparent_140deg)] animate-spin-slow opacity-80"
            aria-hidden="true"
          />
          <div
            className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${content.gradient} shadow-lg animate-glow-pulse`}
          >
            {content.emblem}
          </div>
          {content.sparkles}
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground animate-text-pop">
          {content.kicker}
        </p>
        <h2 className={`mt-1 text-2xl font-bold ${content.titleColor} animate-text-pop`}>
          {content.title}
        </h2>
        {content.description && (
          <p className="mt-2 text-sm text-muted-foreground">{content.description}</p>
        )}
        {content.extra}

        <Button onClick={onDismiss} className="mt-6 w-full" data-testid="button-dismiss-celebration">
          {content.button}
        </Button>
      </div>
    </div>
  );
}

interface CelebrationContent {
  kicker: string;
  title: string;
  description?: string;
  button: string;
  gradient: string;
  ringColor: string;
  titleColor: string;
  emblem: React.ReactNode;
  sparkles?: React.ReactNode;
  extra?: React.ReactNode;
}

function celebrationContent(
  celebration: QueuedCelebration,
  stats?: { totalPoints: number; level: number },
): CelebrationContent {
  const sparkles = (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {[
        { left: "8%", top: "70%", delay: "0s" },
        { left: "24%", top: "84%", delay: "0.5s" },
        { left: "72%", top: "82%", delay: "0.9s" },
        { left: "88%", top: "66%", delay: "1.3s" },
      ].map((spot) => (
        <Sparkles
          key={spot.left}
          className="absolute h-4 w-4 text-yellow-400 animate-float-up"
          style={{ left: spot.left, top: spot.top, animationDelay: spot.delay }}
        />
      ))}
    </span>
  );

  switch (celebration.type) {
    case "badge": {
      const badge = allBadges.find((entry) => entry.id === celebration.badgeId);
      return {
        kicker: "Badge unlocked",
        title: badge?.name ?? "New badge",
        description: badge?.description,
        button: "Awesome!",
        gradient: "from-yellow-300 to-orange-400",
        ringColor: "border-2 border-yellow-400/60",
        titleColor: "text-yellow-600 dark:text-yellow-400",
        emblem: <BadgeIcon iconName={badge?.icon ?? "Trophy"} className="h-12 w-12 text-white" />,
        sparkles,
        extra: badge ? (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
              {badge.requirement}
            </span>
          </div>
        ) : null,
      };
    }
    case "level": {
      const nextLevelPoints = getPointsForNextLevel(celebration.to);
      const currentLevelPoints = getPointsForNextLevel(celebration.to - 1);
      const totalPoints = stats?.totalPoints ?? 0;
      const percent = nextLevelPoints > currentLevelPoints
        ? Math.min(100, Math.round(((totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100))
        : 100;
      return {
        kicker: "Level up",
        title: `Level ${celebration.to}`,
        description: "Your study streak and tasks are paying off.",
        button: "Keep going",
        gradient: "from-violet-400 to-indigo-500",
        ringColor: "border-2 border-violet-400/60",
        titleColor: "text-violet-600 dark:text-violet-400",
        emblem: <Star className="h-12 w-12 text-white" />,
        sparkles,
        extra: (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{totalPoints.toLocaleString()} points</span>
              <span>{Math.max(0, nextLevelPoints - totalPoints)} to Level {celebration.to + 1}</span>
            </div>
            <Progress value={percent} className="h-2" />
          </div>
        ),
      };
    }
    case "term":
      return {
        kicker: "Milestone",
        title: `Term ${celebration.term} complete!`,
        description: "Every task for the term is done. Take a bow.",
        button: "Finish",
        gradient: "from-emerald-400 to-teal-500",
        ringColor: "border-2 border-emerald-400/60",
        titleColor: "text-emerald-600 dark:text-emerald-400",
        emblem: <GraduationCap className="h-12 w-12 text-white" />,
        sparkles,
      };
    case "week":
      return {
        kicker: "Milestone",
        title: `Week ${celebration.week} complete!`,
        description: `All of Week ${celebration.week}'s tasks are ticked off.`,
        button: "Nice",
        gradient: "from-sky-400 to-blue-500",
        ringColor: "border-2 border-sky-400/60",
        titleColor: "text-sky-600 dark:text-sky-400",
        emblem: <CalendarCheck className="h-12 w-12 text-white" />,
        sparkles,
      };
    case "streak":
    default:
      return {
        kicker: "Streak record",
        title: `${celebration.type === "streak" ? celebration.days : 0} day streak!`,
        description: "Consistency is what moves the grades.",
        button: "Onwards",
        gradient: "from-orange-400 to-red-500",
        ringColor: "border-2 border-orange-400/60",
        titleColor: "text-orange-600 dark:text-orange-400",
        emblem: <Flame className="h-12 w-12 text-white" />,
        sparkles,
      };
  }
}
