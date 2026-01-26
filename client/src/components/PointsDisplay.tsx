import { UserStats, getPointsForNextLevel } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Zap } from "lucide-react";

interface PointsDisplayProps {
  stats: UserStats;
  compact?: boolean;
}

export function PointsDisplay({ stats, compact = false }: PointsDisplayProps) {
  const currentLevelPoints = getPointsForNextLevel(stats.level - 1);
  const nextLevelPoints = getPointsForNextLevel(stats.level);
  const progressPoints = stats.totalPoints - currentLevelPoints;
  const levelRange = nextLevelPoints - currentLevelPoints;
  const progressPercent = Math.min((progressPoints / levelRange) * 100, 100);

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer" data-testid="points-compact">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-bold text-sm">Lv.{stats.level}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">{stats.totalPoints.toLocaleString()}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">Level {stats.level}</p>
            <p className="text-muted-foreground">{stats.totalPoints.toLocaleString()} total points</p>
            <p className="text-muted-foreground">
              {nextLevelPoints - stats.totalPoints} to next level
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Card data-testid="points-display">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-lg">
              {stats.level}
            </div>
            <div>
              <h3 className="font-semibold">Level {stats.level}</h3>
              <p className="text-sm text-muted-foreground">
                {stats.totalPoints.toLocaleString()} total points
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-500">
              <Zap className="h-5 w-5" />
              <span className="font-bold">{progressPoints}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              / {levelRange} to Lv.{stats.level + 1}
            </p>
          </div>
        </div>
        
        <Progress value={progressPercent} className="h-2" data-testid="level-progress" />
      </CardContent>
    </Card>
  );
}
