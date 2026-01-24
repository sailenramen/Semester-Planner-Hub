import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface ExamModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  hasUpcomingExams: boolean;
}

export function ExamModeToggle({ enabled, onToggle, hasUpcomingExams }: ExamModeToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-card border" data-testid="exam-mode-toggle">
      <div className="flex items-center gap-3">
        <AlertTriangle className={`h-5 w-5 ${enabled ? "text-orange-500" : "text-muted-foreground"}`} />
        <div>
          <Label htmlFor="exam-mode" className="font-medium cursor-pointer">
            Exam Mode
          </Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hasUpcomingExams
              ? "Focus on upcoming exam preparation"
              : "No exams in the next 2 weeks"}
          </p>
        </div>
      </div>
      <Switch
        id="exam-mode"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={!hasUpcomingExams}
        data-testid="switch-exam-mode"
      />
    </div>
  );
}
