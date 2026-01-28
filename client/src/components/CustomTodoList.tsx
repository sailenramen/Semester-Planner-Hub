import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subjects, SubjectId } from "@shared/schema";
import {
  Plus,
  Clock,
  Trash2,
  Edit2,
  Check,
  X,
  AlertCircle,
  ListTodo,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { format, isBefore, startOfDay } from "date-fns";

export interface CustomTodo {
  id: string;
  title: string;
  subjectId: SubjectId | "general";
  timeEstimate: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
  date: string;
  createdAt: string;
  isOverdue?: boolean;
}

interface CustomTodoListProps {
  date: Date;
  onTodosChange?: (todos: CustomTodo[]) => void;
}

const STORAGE_KEY = "study-planner-custom-todos";

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

export function getAllTodos(): CustomTodo[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function getTodosForDate(date: Date): CustomTodo[] {
  const dateStr = format(date, "yyyy-MM-dd");
  const allTodos = getAllTodos();
  return allTodos.filter(todo => todo.date === dateStr);
}

export function getOverdueTodos(): CustomTodo[] {
  const today = startOfDay(new Date());
  const allTodos = getAllTodos();
  return allTodos.filter(todo => {
    const todoDate = new Date(todo.date);
    return !todo.completed && isBefore(todoDate, today);
  });
}

function saveTodos(todos: CustomTodo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export default function CustomTodoList({ date, onTodosChange }: CustomTodoListProps) {
  const [todos, setTodos] = useState<CustomTodo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(true);
  const [filter, setFilter] = useState<"all" | "custom">("all");
  
  const [newTodo, setNewTodo] = useState({
    title: "",
    subjectId: "general" as SubjectId | "general",
    timeEstimate: 30,
    priority: "medium" as "high" | "medium" | "low",
  });

  const dateStr = format(date, "yyyy-MM-dd");

  useEffect(() => {
    loadTodos();
  }, [dateStr]);

  const loadTodos = () => {
    const allTodos = getAllTodos();
    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    const dateTodos = allTodos.filter(todo => todo.date === dateStr);
    
    const overdueTodos = allTodos
      .filter(todo => !todo.completed && todo.date < todayStr && todo.date !== dateStr)
      .map(todo => ({ ...todo, isOverdue: true }));
    
    if (dateStr === todayStr) {
      setTodos([...overdueTodos, ...dateTodos]);
    } else {
      setTodos(dateTodos);
    }
  };

  const handleAddTodo = () => {
    if (!newTodo.title.trim()) return;

    const todo: CustomTodo = {
      id: `todo-${Date.now()}`,
      title: newTodo.title.trim(),
      subjectId: newTodo.subjectId,
      timeEstimate: newTodo.timeEstimate,
      priority: newTodo.priority,
      completed: false,
      date: dateStr,
      createdAt: new Date().toISOString(),
    };

    const allTodos = getAllTodos();
    const updatedTodos = [...allTodos, todo];
    saveTodos(updatedTodos);
    
    setNewTodo({ title: "", subjectId: "general", timeEstimate: 30, priority: "medium" });
    setIsAdding(false);
    loadTodos();
    onTodosChange?.(getTodosForDate(date));
  };

  const handleToggleTodo = (id: string) => {
    const allTodos = getAllTodos();
    const updatedTodos = allTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
    loadTodos();
    onTodosChange?.(getTodosForDate(date));
  };

  const handleDeleteTodo = (id: string) => {
    const allTodos = getAllTodos();
    const updatedTodos = allTodos.filter(todo => todo.id !== id);
    saveTodos(updatedTodos);
    loadTodos();
    onTodosChange?.(getTodosForDate(date));
  };

  const handleUpdateTodo = (id: string, updates: Partial<CustomTodo>) => {
    const allTodos = getAllTodos();
    const updatedTodos = allTodos.map(todo =>
      todo.id === id ? { ...todo, ...updates } : todo
    );
    saveTodos(updatedTodos);
    setEditingId(null);
    loadTodos();
    onTodosChange?.(getTodosForDate(date));
  };

  const filteredTodos = todos.filter(todo => {
    if (!showCompleted && todo.completed) return false;
    return true;
  });

  const completedCount = todos.filter(t => t.completed).length;
  const totalTime = filteredTodos.reduce((sum, t) => sum + t.timeEstimate, 0);
  const completionPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

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

      {totalTime > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Total estimated time: {totalTime} minutes</span>
        </div>
      )}

      {isAdding && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3 border" data-testid="add-todo-form">
          <Input
            placeholder="What do you need to do?"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            autoFocus
            data-testid="input-todo-title"
          />
          
          <div className="grid grid-cols-3 gap-2">
            <Select
              value={newTodo.subjectId}
              onValueChange={(v) => setNewTodo({ ...newTodo, subjectId: v as SubjectId | "general" })}
            >
              <SelectTrigger data-testid="select-subject">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={String(newTodo.timeEstimate)}
              onValueChange={(v) => setNewTodo({ ...newTodo, timeEstimate: parseInt(v) })}
            >
              <SelectTrigger data-testid="select-time">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newTodo.priority}
              onValueChange={(v) => setNewTodo({ ...newTodo, priority: v as "high" | "medium" | "low" })}
            >
              <SelectTrigger data-testid="select-priority">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleAddTodo} data-testid="button-save-todo">
              Add To-Do
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
                  : todo.isOverdue
                  ? "bg-destructive/10 border-destructive/30"
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
                {editingId === todo.id ? (
                  <div className="space-y-2">
                    <Input
                      defaultValue={todo.title}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateTodo(todo.id, { title: e.currentTarget.value });
                        } else if (e.key === "Escape") {
                          setEditingId(null);
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`font-medium ${todo.completed ? "line-through" : ""}`}>
                        {todo.title}
                      </p>
                      {todo.isOverdue && (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`text-xs ${subjectColors[todo.subjectId]}`}
                      >
                        {todo.subjectId === "general"
                          ? "General"
                          : subjects.find((s) => s.id === todo.subjectId)?.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {todo.timeEstimate} min
                      </span>
                      <div className={`h-2 w-2 rounded-full ${priorityConfig[todo.priority].color}`} />
                      <span className="text-xs text-muted-foreground">
                        {priorityConfig[todo.priority].text}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {!editingId && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingId(todo.id)}
                    data-testid={`button-edit-todo-${todo.id}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
