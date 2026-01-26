import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Flame, Snowflake } from "lucide-react";
import { getStreak } from "@/lib/storage";
import { Streak } from "@shared/schema";

interface StreakTrackerProps {
  streak?: Streak;
  compact?: boolean;
}

export function StreakTracker({ streak: propStreak, compact = false }: StreakTrackerProps) {
  const [streak, setStreak] = useState<Streak | null>(propStreak || null);

  useEffect(() => {
    if (!propStreak) {
      setStreak(getStreak());
    } else {
      setStreak(propStreak);
    }
  }, [propStreak]);

  if (!streak) return null;

  const getFlameSize = (count: number): string => {
    if (count >= 100) return "h-10 w-10";
    if (count >= 30) return "h-8 w-8";
    if (count >= 14) return "h-7 w-7";
    if (count >= 7) return "h-6 w-6";
    return "h-5 w-5";
  };

  const getFlameColor = (count: number): string => {
    if (count >= 100) return "text-purple-500";
    if (count >= 30) return "text-orange-500";
    if (count >= 14) return "text-orange-400";
    if (count >= 7) return "text-yellow-500";
    if (count >= 1) return "text-yellow-400";
    return "text-muted-foreground";
  };

  if (compact) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex items-center gap-1 cursor-pointer" 
            data-testid="streak-compact"
          >
            <Flame className={`${getFlameSize(streak.currentStreak)} ${getFlameColor(streak.currentStreak)}`} />
            <span className="font-bold text-lg">{streak.currentStreak}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{streak.currentStreak} day streak!</p>
            <p className="text-muted-foreground">Longest: {streak.longestStreak} days</p>
            <p className="text-muted-foreground flex items-center gap-1">
              <Snowflake className="h-3 w-3" /> {streak.streakFreezes} freezes left
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Card data-testid="streak-tracker">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Flame 
                className={`${getFlameSize(streak.currentStreak)} ${getFlameColor(streak.currentStreak)} transition-all`} 
              />
              {streak.currentStreak >= 7 && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{streak.currentStreak}</span>
                <span className="text-muted-foreground">day streak</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Best: {streak.longestStreak} days
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="flex items-center gap-1" data-testid="streak-freezes">
                  <Snowflake className="h-3 w-3 text-blue-400" />
                  {streak.streakFreezes}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Streak freezes protect your streak if you miss a day</p>
                <p className="text-muted-foreground text-xs">Resets to 2 each month</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
