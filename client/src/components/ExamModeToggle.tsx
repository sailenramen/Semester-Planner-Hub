import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Calendar } from "lucide-react";

interface ExamModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  hasUpcomingExams: boolean;
}

export function ExamModeToggle({ enabled, onToggle, hasUpcomingExams }: ExamModeToggleProps) {
  return (
    <div 
      className={`flex items-center justify-between p-4 rounded-lg border ${
        enabled 
          ? "bg-orange-50 dark:bg-orange-950/20 border-orange-300 dark:border-orange-700" 
          : "bg-card"
      }`} 
      data-testid="exam-mode-toggle"
    >
      <div className="flex items-center gap-3">
        {hasUpcomingExams ? (
          <AlertTriangle className={`h-5 w-5 ${enabled ? "text-orange-500" : "text-muted-foreground"}`} />
        ) : (
          <Calendar className={`h-5 w-5 ${enabled ? "text-orange-500" : "text-muted-foreground"}`} />
        )}
        <div>
          <Label htmlFor="exam-mode" className="font-medium cursor-pointer">
            Exam Mode
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {enabled
              ? hasUpcomingExams
                ? "Prioritizing exam preparation"
                : "Exam mode active - view upcoming exam schedule"
              : hasUpcomingExams
              ? "Focus on upcoming exam preparation"
              : "Enable to prepare early for exams"}
          </p>
        </div>
      </div>
      <Switch
        id="exam-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        data-testid="switch-exam-mode"
      />
    </div>
  );
}
