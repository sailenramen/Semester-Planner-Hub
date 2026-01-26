import { useState } from "react";
import { 
  AvatarSettings, AVATAR_COLORS, AVATAR_STYLES, AVATAR_ACCESSORIES 
} from "@shared/schema";
import { 
  Crown, Sparkles, Flame, Star, Zap, Diamond, User, Settings, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface LevelAvatarProps {
  level: number;
  settings: AvatarSettings;
  onSettingsChange?: (settings: AvatarSettings) => void;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

const accessoryIcons: Record<string, typeof Crown> = {
  crown: Crown,
  halo: Sparkles,
  flame: Flame,
  stars: Star,
  lightning: Zap,
  diamond: Diamond,
};

export function LevelAvatar({ 
  level, 
  settings, 
  onSettingsChange, 
  size = "md",
  editable = false 
}: LevelAvatarProps) {
  const [open, setOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<AvatarSettings>(settings);
  
  const colorData = AVATAR_COLORS.find(c => c.id === settings.baseColor) || AVATAR_COLORS[0];
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32"
  };
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };
  const levelBadgeSizes = {
    sm: "text-[10px] px-1",
    md: "text-xs px-1.5",
    lg: "text-sm px-2"
  };

  const getEvolutionGlow = () => {
    if (level >= 40) return "ring-4 ring-yellow-400/50 shadow-lg shadow-yellow-400/30";
    if (level >= 30) return "ring-4 ring-purple-400/50 shadow-lg shadow-purple-400/30";
    if (level >= 20) return "ring-3 ring-blue-400/40 shadow-md shadow-blue-400/20";
    if (level >= 10) return "ring-2 ring-green-400/30";
    return "";
  };

  const getEvolutionBorder = () => {
    if (level >= 40) return "border-4 border-yellow-400";
    if (level >= 30) return "border-3 border-purple-400";
    if (level >= 20) return "border-2 border-blue-400";
    if (level >= 10) return "border-2 border-green-400";
    return "border-2 border-muted";
  };

  const AccessoryIcon = settings.accessory && settings.accessory !== "none" 
    ? accessoryIcons[settings.accessory] 
    : null;

  const handleSave = () => {
    if (onSettingsChange) {
      onSettingsChange(tempSettings);
    }
    setOpen(false);
  };

  const avatarContent = (
    <div className="relative inline-block">
      <div
        className={cn(
          sizeClasses[size],
          "rounded-full flex items-center justify-center relative",
          getEvolutionGlow(),
          getEvolutionBorder(),
          settings.style === "hexagon" && "clip-hexagon",
          settings.style === "rounded" && "rounded-2xl"
        )}
        style={{
          background: `linear-gradient(135deg, ${colorData.primary}, ${colorData.secondary})`
        }}
        data-testid="level-avatar"
      >
        <User className={cn(iconSizes[size], "text-white")} />
        
        {AccessoryIcon && (
          <div className="absolute -top-1 -right-1 p-1 bg-background rounded-full shadow-md">
            <AccessoryIcon className="h-4 w-4 text-yellow-500" />
          </div>
        )}
      </div>
      
      <div 
        className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2 py-0.5 rounded-full font-bold bg-background border shadow-sm",
          levelBadgeSizes[size]
        )}
        data-testid="level-badge"
      >
        Lv.{level}
      </div>
    </div>
  );

  if (!editable) {
    return avatarContent;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="relative group cursor-pointer" data-testid="button-edit-avatar">
          {avatarContent}
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Settings className="h-6 w-6 text-white" />
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Your Avatar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <LevelAvatar level={level} settings={tempSettings} size="lg" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Color Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setTempSettings({ ...tempSettings, baseColor: color.id })}
                  className={cn(
                    "w-full h-10 rounded-lg transition-all hover-elevate",
                    tempSettings.baseColor === color.id && "ring-2 ring-offset-2 ring-primary"
                  )}
                  style={{ background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})` }}
                  data-testid={`color-${color.id}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Avatar Style</label>
            <div className="grid grid-cols-3 gap-2">
              {AVATAR_STYLES.map((style) => (
                <Button
                  key={style}
                  variant={tempSettings.style === style ? "default" : "outline"}
                  onClick={() => setTempSettings({ ...tempSettings, style })}
                  className="capitalize"
                  data-testid={`style-${style}`}
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Accessory (Unlocks with Level)</label>
            <div className="grid grid-cols-2 gap-2">
              {AVATAR_ACCESSORIES.map((acc) => {
                const isUnlocked = level >= acc.minLevel;
                const Icon = acc.id !== "none" ? accessoryIcons[acc.id] : null;
                
                return (
                  <Button
                    key={acc.id}
                    variant={tempSettings.accessory === acc.id ? "default" : "outline"}
                    onClick={() => isUnlocked && setTempSettings({ ...tempSettings, accessory: acc.id })}
                    disabled={!isUnlocked}
                    className="justify-start gap-2"
                    data-testid={`accessory-${acc.id}`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{acc.name}</span>
                    {!isUnlocked && (
                      <span className="text-xs text-muted-foreground ml-auto">Lv.{acc.minLevel}</span>
                    )}
                    {tempSettings.accessory === acc.id && isUnlocked && (
                      <Check className="h-4 w-4 ml-auto" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1" data-testid="button-save-avatar">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
