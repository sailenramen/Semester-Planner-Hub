import { useState } from "react";
import { badges as allBadges } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeIcon } from "./BadgeIcon";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Award, Star, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeShowcaseProps {
  earnedBadges: string[];
  showcasedBadges: string[];
  onShowcaseChange?: (badges: string[]) => void;
}

const MAX_SHOWCASED = 4;

export function BadgeShowcase({
  earnedBadges,
  showcasedBadges,
  onShowcaseChange
}: BadgeShowcaseProps) {
  const [open, setOpen] = useState(false);
  // The draft starts from what is saved and is rebuilt each time the editor
  // opens, so cancelling really cancels and reopening never shows a stale pick.
  const [draft, setDraft] = useState<string[]>(showcasedBadges);

  const displayBadges = showcasedBadges.length > 0
    ? showcasedBadges
    : earnedBadges.slice(0, MAX_SHOWCASED);

  const openEditor = (next: boolean) => {
    if (next) setDraft(showcasedBadges);
    setOpen(next);
  };

  const toggleBadge = (badgeId: string) => {
    setDraft((current) =>
      current.includes(badgeId)
        ? current.filter((id) => id !== badgeId)
        : current.length < MAX_SHOWCASED
          ? [...current, badgeId]
          : current,
    );
  };

  const handleSave = () => {
    onShowcaseChange?.(draft);
    setOpen(false);
  };

  const editorContent = (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Choose Badges to Showcase</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        Select up to {MAX_SHOWCASED} badges to display on your profile ({draft.length}/{MAX_SHOWCASED})
      </p>

      <div className="grid grid-cols-4 gap-3 py-4">
        {earnedBadges.map((badgeId) => {
          const badge = allBadges.find(b => b.id === badgeId);
          if (!badge) return null;
          const isSelected = draft.includes(badgeId);

          return (
            <Tooltip key={badgeId}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleBadge(badgeId)}
                  className={cn(
                    "relative w-14 h-14 rounded-lg border-2 flex items-center justify-center transition-all hover-elevate",
                    isSelected
                      ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400"
                      : "bg-muted/50 border-muted-foreground/20"
                  )}
                  data-testid={`showcase-badge-${badgeId}`}
                >
                  <BadgeIcon
                    iconName={badge.icon}
                    className={cn(
                      "h-7 w-7",
                      isSelected ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"
                    )}
                  />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-medium">{badge.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1" data-testid="button-save-showcase">
          Save Showcase
        </Button>
      </div>
    </DialogContent>
  );

  return (
    <Card data-testid="badge-showcase">
      <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          Badge Showcase
        </CardTitle>
        {onShowcaseChange && earnedBadges.length > 0 && (
          <Dialog open={open} onOpenChange={openEditor}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="button-edit-showcase">
                Edit
              </Button>
            </DialogTrigger>
            {editorContent}
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {displayBadges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Award className="h-12 w-12 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">
              Complete tasks to earn badges!
            </p>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            {displayBadges.map((badgeId, index) => {
              const badge = allBadges.find(b => b.id === badgeId);
              if (!badge) return null;

              return (
                <Tooltip key={badgeId}>
                  <TooltipTrigger asChild>
                    <div
                      className="relative flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border-2 border-yellow-400 shadow-lg animate-milestone-pop"
                      style={{ animationDelay: `${index * 0.07}s` }}
                      data-testid={`showcase-${badgeId}`}
                    >
                      <BadgeIcon
                        iconName={badge.icon}
                        className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}

            {displayBadges.length < MAX_SHOWCASED && earnedBadges.length > displayBadges.length && onShowcaseChange && (
              // Opens the same editor as the header's Edit button.
              <button
                onClick={() => openEditor(true)}
                className="flex items-center justify-center w-16 h-16 rounded-xl border-2 border-dashed border-muted-foreground/30 text-muted-foreground/50 hover:border-muted-foreground/50 hover:text-muted-foreground transition-colors"
                data-testid="button-add-badge"
                aria-label="Add a badge to your showcase"
              >
                <Plus className="h-6 w-6" />
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
