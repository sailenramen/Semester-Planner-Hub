import { 
  Target, Flame, Zap, Star, Crown, Trophy, Award, Scroll, 
  Sunrise, Moon, Rocket, Calculator, FlaskConical, BookOpen, 
  PenTool, GraduationCap, Clock, Medal, Lock, LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Target,
  Flame,
  Zap,
  Star,
  Crown,
  Trophy,
  Award,
  Scroll,
  Sunrise,
  Moon,
  Rocket,
  Calculator,
  FlaskConical,
  BookOpen,
  PenTool,
  GraduationCap,
  Clock,
  Medal,
};

interface BadgeIconProps {
  iconName: string;
  className?: string;
  earned?: boolean;
}

export function BadgeIcon({ iconName, className = "h-6 w-6", earned = true }: BadgeIconProps) {
  if (!earned) {
    return <Lock className={className} />;
  }
  
  const Icon = iconMap[iconName] || Target;
  return <Icon className={className} />;
}
