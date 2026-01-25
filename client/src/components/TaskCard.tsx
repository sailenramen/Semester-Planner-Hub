import { Task, subjects } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, BookOpen } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onStudy?: (task: Task) => void;
  showSubject?: boolean;
}

export function TaskCard({ task, onToggle, onStudy, showSubject = false }: TaskCardProps) {
  const subject = subjects.find((s) => s.id === task.subjectId);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('input[type="checkbox"]') || target.closest('label')) {
      return;
    }
    if (onStudy) {
      onStudy(task);
    }
  };

  return (
    <Card 
      className={`transition-all ${task.completed ? "opacity-60" : ""} ${onStudy ? "cursor-pointer hover-elevate" : ""}`}
      data-testid={`task-card-${task.id}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id={task.id}
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
            className="mt-1"
            data-testid={`checkbox-task-${task.id}`}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`font-medium ${onStudy ? "hover:text-primary" : ""} ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </span>
              {showSubject && subject && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${subject.bgColor} ${subject.color}`}
                >
                  {subject.name}
                </span>
              )}
              {onStudy && (
                <span className="text-xs text-primary flex items-center gap-1 ml-auto">
                  <BookOpen className="h-3 w-3" />
                  Study
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.estimatedMinutes} min
              </span>
              <span>Week {task.week}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
