import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ProgressRing } from "@/components/ProgressRing";
import {
  Task,
  subjects,
  SubjectId,
  getCurrentWeek,
  getTermLabel,
} from "@shared/schema";
import {
  getTasks,
  toggleTaskCompletion,
  getSubjectNote,
  saveNote,
  calculateSubjectProgress,
} from "@/lib/storage";
import { Clock, FileText, BookOpen, ChevronDown, ChevronUp, Save } from "lucide-react";

const subjectColorMap: Record<string, string> = {
  math: "hsl(217, 91%, 60%)",
  science: "hsl(142, 71%, 45%)",
  history: "hsl(0, 84%, 60%)",
  english: "hsl(270, 70%, 60%)",
};

export default function Subject() {
  const params = useParams<{ id: string }>();
  const subjectId = params.id as SubjectId;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [note, setNote] = useState<string>("");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());
  const [noteSaved, setNoteSaved] = useState(false);

  const subject = subjects.find((s) => s.id === subjectId);
  const currentWeek = getCurrentWeek();

  useEffect(() => {
    const allTasks = getTasks();
    setTasks(allTasks.filter((t) => t.subjectId === subjectId));
    
    const existingNote = getSubjectNote(subjectId);
    if (existingNote) {
      setNote(existingNote.content);
    } else {
      setNote("");
    }
    
    // Auto-expand current week
    setExpandedWeeks(new Set([currentWeek]));
  }, [subjectId, currentWeek]);

  const handleToggleTask = (taskId: string) => {
    const updated = toggleTaskCompletion(taskId);
    setTasks(updated.filter((t) => t.subjectId === subjectId));
  };

  const handleSaveNote = () => {
    saveNote({
      id: `note-${subjectId}`,
      subjectId,
      content: note,
      updatedAt: new Date().toISOString(),
    });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const toggleWeekExpanded = (week: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(week)) {
      newExpanded.delete(week);
    } else {
      newExpanded.add(week);
    }
    setExpandedWeeks(newExpanded);
  };

  if (!subject) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Subject not found</p>
      </div>
    );
  }

  const progress = calculateSubjectProgress(tasks.length ? tasks : [], subjectId);
  
  // Group tasks by term then week
  const tasksByTerm: Record<number, Task[]> = {
    1: tasks.filter((t) => t.term === 1),
    2: tasks.filter((t) => t.term === 2),
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid={`subject-page-${subjectId}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-12 w-12 rounded-lg flex items-center justify-center ${subject.bgColor}`}
          >
            <BookOpen className={`h-6 w-6 ${subject.color}`} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{subject.name}</h1>
            <p className="text-muted-foreground">
              Weekly study plan and progress tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-xl font-bold">
              {progress.completed}/{progress.total} tasks
            </p>
          </div>
          <ProgressRing
            percentage={progress.percentage}
            size={60}
            color={subjectColorMap[subjectId]}
          />
        </div>
      </div>

      {/* Tabs for Tasks and Notes */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList data-testid="subject-tabs">
          <TabsTrigger value="tasks" data-testid="tab-tasks">
            <FileText className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">
            <BookOpen className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          {/* Term 1 Section */}
          {[1, 2].map((term) => {
            const termTasks = tasksByTerm[term];
            const termCompleted = termTasks.filter((t) => t.completed).length;
            const termPercentage =
              termTasks.length > 0
                ? Math.round((termCompleted / termTasks.length) * 100)
                : 0;

            // Get unique weeks for this term
            const weeks = Array.from(new Set(termTasks.map((t) => t.week))).sort((a, b) => a - b);

            return (
              <Card key={term} data-testid={`term-${term}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">Term {term}</CardTitle>
                      <Badge variant="outline">
                        {termCompleted}/{termTasks.length} done
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {term === 1 ? "9 weeks" : "8 weeks"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {termPercentage}%
                      </span>
                      <Progress value={termPercentage} className="w-24 h-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {weeks.map((week) => {
                    const weekTasks = termTasks.filter((t) => t.week === week);
                    const isExpanded = expandedWeeks.has(week);
                    const isCurrentWeek = week === currentWeek;
                    const weekCompleted = weekTasks.filter((t) => t.completed).length;
                    const weekLabel = getTermLabel(week);

                    return (
                      <div
                        key={week}
                        className={`border rounded-lg ${
                          isCurrentWeek ? `${subject.borderColor} border-2` : ""
                        }`}
                        data-testid={`week-${week}`}
                      >
                        <button
                          onClick={() => toggleWeekExpanded(week)}
                          className="w-full p-3 flex items-center justify-between hover-elevate rounded-lg"
                          data-testid={`button-toggle-week-${week}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{weekLabel}</span>
                            {isCurrentWeek && (
                              <Badge variant="secondary" className="text-xs">
                                Current
                              </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              ({weekCompleted}/{weekTasks.length})
                            </span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-3 pb-3 space-y-3">
                            {weekTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-3 rounded-lg bg-muted/50 ${
                                  task.completed ? "opacity-60" : ""
                                }`}
                                data-testid={`task-${task.id}`}
                              >
                                <div className="flex items-start gap-3">
                                  <Checkbox
                                    id={task.id}
                                    checked={task.completed}
                                    onCheckedChange={() => handleToggleTask(task.id)}
                                    className="mt-1"
                                    data-testid={`checkbox-${task.id}`}
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={task.id}
                                      className={`font-medium cursor-pointer block ${
                                        task.completed
                                          ? "line-through text-muted-foreground"
                                          : ""
                                      }`}
                                    >
                                      {task.title}
                                    </label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {task.description}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {task.estimatedMinutes} min
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Study Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={`Add your notes for ${subject.name} here...`}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[300px] resize-y"
                data-testid="textarea-notes"
              />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Notes are saved locally in your browser
                </p>
                <Button onClick={handleSaveNote} data-testid="button-save-notes">
                  <Save className="h-4 w-4 mr-2" />
                  {noteSaved ? "Saved!" : "Save Notes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
