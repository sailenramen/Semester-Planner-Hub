import { Task, subjects } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  showSubject?: boolean;
}

export function TaskCard({ task, onToggle, showSubject = false }: TaskCardProps) {
  const subject = subjects.find((s) => s.id === task.subjectId);

  return (
    <Card 
      className={`transition-all ${task.completed ? "opacity-60" : ""}`}
      data-testid={`task-card-${task.id}`}
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
              <label
                htmlFor={task.id}
                className={`font-medium cursor-pointer ${
                  task.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {task.title}
              </label>
              {showSubject && subject && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${subject.bgColor} ${subject.color}`}
                >
                  {subject.name}
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
