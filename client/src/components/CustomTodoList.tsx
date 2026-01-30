import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { subjects, SubjectId } from "@shared/schema";
import {
  useCustomTodos,
  useCreateCustomTodo,
  useToggleCustomTodo,
  useDeleteCustomTodo,
  CustomTodo,
} from "@/hooks/useApi";
import {
  Plus,
  Clock,
  Trash2,
  ListTodo,
} from "lucide-react";
import { format } from "date-fns";

interface CustomTodoListProps {
  date: Date;
  onTodosChange?: () => void;
}

const priorityConfig = {
  high: { color: "bg-red-500", text: "High", badge: "destructive" as const },
  medium: { color: "bg-yellow-500", text: "Med", badge: "secondary" as const },
  low: { color: "bg-green-500", text: "Low", badge: "outline" as const },
};

const subjectColors: Record<string, string> = {
  math: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  science: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  history: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
  english: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  general: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700",
};

export default function CustomTodoList({ date, onTodosChange }: CustomTodoListProps) {
  const dateStr = format(date, "yyyy-MM-dd");
  
  const { data: todos = [], isLoading } = useCustomTodos(dateStr);
  const createTodo = useCreateCustomTodo();
  const toggleTodo = useToggleCustomTodo();
  const deleteTodo = useDeleteCustomTodo();
  
  const [isAdding, setIsAdding] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  
  const [newTodoText, setNewTodoText] = useState("");

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;

    createTodo.mutate(
      { date: dateStr, title: newTodoText.trim() },
      {
        onSuccess: () => {
          setNewTodoText("");
          setIsAdding(false);
          onTodosChange?.();
        },
      }
    );
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo.mutate(
      { id, date: dateStr },
      {
        onSuccess: () => {
          onTodosChange?.();
        },
      }
    );
  };

  const handleDeleteTodo = (id: string) => {
    deleteTodo.mutate(
      { id, date: dateStr },
      {
        onSuccess: () => {
          onTodosChange?.();
        },
      }
    );
  };

  const filteredTodos = todos.filter(todo => {
    if (!showCompleted && todo.completed) return false;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const completionPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Custom To-Dos</h3>
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Custom To-Dos</h3>
          {todos.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {completedCount}/{todos.length} done ({completionPercent}%)
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
            className="text-xs"
          >
            {showCompleted ? "Hide completed" : "Show completed"}
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
            data-testid="button-add-todo"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add To-Do
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3 border" data-testid="add-todo-form">
          <Input
            placeholder="What do you need to do?"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTodo();
              if (e.key === "Escape") setIsAdding(false);
            }}
            autoFocus
            data-testid="input-todo-title"
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddTodo} 
              disabled={createTodo.isPending}
              data-testid="button-save-todo"
            >
              {createTodo.isPending ? "Adding..." : "Add To-Do"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <ListTodo className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No custom to-dos for this day</p>
            <p className="text-xs">Click "Add To-Do" to create one</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                todo.completed
                  ? "bg-muted/30 opacity-60"
                  : "bg-card hover-elevate"
              }`}
              data-testid={`todo-item-${todo.id}`}
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggleTodo(todo.id)}
                className="mt-1"
                data-testid={`checkbox-todo-${todo.id}`}
              />
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${todo.completed ? "line-through" : ""}`}>
                  {todo.title}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDeleteTodo(todo.id)}
                data-testid={`button-delete-todo-${todo.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function getTodosForDate(date: Date): any[] {
  return [];
}

export function getOverdueTodos(): any[] {
  return [];
}
