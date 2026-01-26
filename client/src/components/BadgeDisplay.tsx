import { Badge as BadgeData, badges as allBadges } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trophy } from "lucide-react";
import { BadgeIcon } from "./BadgeIcon";

interface BadgeDisplayProps {
  earnedBadges: string[];
  showLocked?: boolean;
  compact?: boolean;
}

export function BadgeDisplay({ earnedBadges, showLocked = false, compact = false }: BadgeDisplayProps) {
  const earned = allBadges.filter(b => earnedBadges.includes(b.id));
  const locked = allBadges.filter(b => !earnedBadges.includes(b.id));

  if (compact) {
    return (
      <div className="flex items-center gap-1" data-testid="badge-display-compact">
        <Trophy className="h-4 w-4 text-yellow-500" />
        <span className="font-medium">{earned.length}</span>
        <span className="text-muted-foreground text-sm">/ {allBadges.length}</span>
      </div>
    );
  }

  return (
    <Card data-testid="badge-display">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Trophy Case
          <Badge variant="secondary" className="ml-auto">
            {earned.length} / {allBadges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {earned.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Earned</h4>
              <div className="flex flex-wrap gap-2">
                {earned.map((badge) => (
                  <BadgeItem key={badge.id} badge={badge} earned />
                ))}
              </div>
            </div>
          )}
          
          {showLocked && locked.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Locked</h4>
              <div className="flex flex-wrap gap-2">
                {locked.map((badge) => (
                  <BadgeItem key={badge.id} badge={badge} earned={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BadgeItem({ badge, earned }: { badge: BadgeData; earned: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`relative flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all cursor-pointer ${
            earned
              ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-yellow-400"
              : "bg-muted/50 border-muted-foreground/20 opacity-50"
          }`}
          data-testid={`badge-${badge.id}`}
        >
          <BadgeIcon 
            iconName={badge.icon} 
            className={`h-6 w-6 ${earned ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"}`}
            earned={earned}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-center max-w-[200px]">
          <p className="font-semibold flex items-center justify-center gap-1">
            <BadgeIcon iconName={badge.icon} className="h-4 w-4" earned={earned} />
            {badge.name}
          </p>
          <p className="text-sm text-muted-foreground">{badge.description}</p>
          {!earned && (
            <p className="text-xs text-primary mt-1">{badge.requirement}</p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
