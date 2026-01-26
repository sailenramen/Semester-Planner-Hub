import { Badge as BadgeData, badges as allBadges } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { BadgeIcon } from "./BadgeIcon";

interface BadgeUnlockModalProps {
  badgeId: string | null;
  open: boolean;
  onClose: () => void;
}

export function BadgeUnlockModal({ badgeId, open, onClose }: BadgeUnlockModalProps) {
  const badge = badgeId ? allBadges.find(b => b.id === badgeId) : null;

  if (!badge) return null;

  return (
    <>
      <Confetti active={open} />
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="sm:max-w-md text-center" data-testid="badge-unlock-modal">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              Badge Unlocked!
            </DialogTitle>
            <DialogDescription className="text-center">
              Congratulations on your achievement!
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center animate-bounce">
                <BadgeIcon iconName={badge.icon} className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -inset-2 rounded-full border-4 border-yellow-400/50 animate-pulse" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
            <p className="text-muted-foreground mb-4">{badge.description}</p>
            
            <div className="bg-muted rounded-lg px-4 py-2 text-sm">
              {badge.requirement}
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full" data-testid="button-close-badge">
            Awesome!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
