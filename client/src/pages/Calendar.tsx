import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { TaskCard } from "@/components/TaskCard";
import {
  subjects,
  TERM1_START,
  TERM2_END,
  getWeekDates,
  getCurrentWeek,
  getTermLabel,
  TOTAL_WEEKS,
} from "@shared/schema";
import {
  useTasks,
  useExams,
  useToggleTask,
  useWeeklyGoal,
  useSaveWeeklyGoal,
  useStudyTime,
  useSaveStudyTime,
  useDayNote,
  useSaveDayNote,
  calculateWeekProgress,
} from "@/hooks/useApi";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  parseISO,
  addWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
} from "date-fns";
import { Calendar as CalendarIcon, Printer, ListTodo, Target, Clock, StickyNote, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import CustomTodoList from "@/components/CustomTodoList";

const subjectColorClasses: Record<string, string> = {
  math: "bg-blue-500",
  science: "bg-green-500",
  history: "bg-red-500",
  english: "bg-purple-500",
};

export default function CalendarPage() {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: exams = [], isLoading: examsLoading } = useExams();
  const { data: weeklyGoalData, isLoading: goalLoading } = useWeeklyGoal();
  const toggleTask = useToggleTask();
  const saveWeeklyGoal = useSaveWeeklyGoal();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"semester" | "month">("semester");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [editingGoal, setEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState("");
  const [studyTimeInput, setStudyTimeInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [todoRefreshKey, setTodoRefreshKey] = useState(0);
  
  const currentWeek = getCurrentWeek();
  const weeklyGoal = weeklyGoalData?.hours ?? 10;

  const selectedDateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const { data: studyTimeData } = useStudyTime(selectedDateStr);
  const { data: dayNoteData } = useDayNote(selectedDateStr);
  const saveStudyTime = useSaveStudyTime();
  const saveDayNote = useSaveDayNote();

  useEffect(() => {
    if (selectedDate && studyTimeData) {
      setStudyTimeInput(studyTimeData.hours > 0 ? studyTimeData.hours.toString() : "");
    } else {
      setStudyTimeInput("");
    }
  }, [selectedDate, studyTimeData]);

  useEffect(() => {
    if (selectedDate && dayNoteData) {
      setNoteInput(dayNoteData.content || "");
    } else {
      setNoteInput("");
    }
  }, [selectedDate, dayNoteData]);

  const handleToggleTask = (taskId: string) => {
    toggleTask.mutate(taskId);
  };

  const handleSaveGoal = () => {
    const goalValue = parseFloat(tempGoal);
    if (!isNaN(goalValue) && goalValue > 0) {
      saveWeeklyGoal.mutate(goalValue);
    }
    setEditingGoal(false);
    setTempGoal("");
  };

  const handleSaveStudyTime = () => {
    if (selectedDate) {
      const hours = parseFloat(studyTimeInput);
      if (!isNaN(hours) && hours >= 0) {
        saveStudyTime.mutate({ date: selectedDateStr, hours });
      }
    }
  };

  const handleSaveNote = () => {
    if (selectedDate) {
      saveDayNote.mutate({ date: selectedDateStr, content: noteInput });
    }
  };

  const semesterWeeks: { week: number; start: Date; end: Date; term: number }[] = [];
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const { start, end, term } = getWeekDates(w);
    semesterWeeks.push({ week: w, start, end, term });
  }

  const getTasksForDate = (date: Date) => {
    const weekInfo = semesterWeeks.find(
      (w) => isWithinInterval(date, { start: w.start, end: w.end })
    );
    if (!weekInfo) return [];
    return tasks.filter((t) => t.week === weekInfo.week);
  };

  const getWeekForDate = (date: Date): number | null => {
    const weekInfo = semesterWeeks.find(
      (w) => isWithinInterval(date, { start: w.start, end: w.end })
    );
    return weekInfo?.week || null;
  };

  const getExamsForDate = (date: Date) => {
    return exams.filter((e) => isSameDay(parseISO(e.date), date));
  };

  const generateCalendarGrid = () => {
    const weeks: Date[][] = [];
    let current = startOfWeek(TERM1_START, { weekStartsOn: 0 });
    const end = endOfWeek(TERM2_END, { weekStartsOn: 0 });

    while (current <= end) {
      const weekEnd = endOfWeek(current, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start: current, end: weekEnd });
      weeks.push(days);
      current = addWeeks(current, 1);
    }

    return weeks;
  };

  const generateMonthGrid = () => {
    const weeks: Date[][] = [];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    let current = startOfWeek(monthStart, { weekStartsOn: 0 });
    const end = endOfWeek(monthEnd, { weekStartsOn: 0 });

    while (current <= end) {
      const weekEnd = endOfWeek(current, { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start: current, end: weekEnd });
      weeks.push(days);
      current = addWeeks(current, 1);
    }

    return weeks;
  };

  const calendarWeeks = viewMode === "semester" ? generateCalendarGrid() : generateMonthGrid();

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedExams = selectedDate ? getExamsForDate(selectedDate) : [];
  const selectedWeek = selectedDate ? getWeekForDate(selectedDate) : null;

  const handlePrint = () => {
    window.print();
  };

  const getWeeklyStudyTime = (weekNumber: number): number => {
    return 0;
  };

  const weeklyStudyTotal = getWeeklyStudyTime(currentWeek);
  const goalProgress = weeklyGoal > 0 ? Math.min((weeklyStudyTotal / weeklyGoal) * 100, 100) : 0;

  const isLoading = tasksLoading || examsLoading || goalLoading;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6" data-testid="calendar-page">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <div className="lg:col-span-3">
            <Skeleton className="h-32" />
          </div>
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const renderDayCell = (day: Date, dayIndex: number, semesterWeekInfo: { week: number; start: Date; end: Date; term: number } | undefined, isMonthView: boolean = false) => {
    const dayTasks = getTasksForDate(day);
    const dayExams = getExamsForDate(day);
    const isToday = isSameDay(day, new Date());
    const dateStr = format(day, "yyyy-MM-dd");
    
    let isInSemester = semesterWeeks.some(
      (sw) => isWithinInterval(day, { start: sw.start, end: sw.end })
    );
    
    if (isMonthView) {
      isInSemester = isSameMonth(day, currentMonth);
    }
    
    const isCurrentSemesterWeek = semesterWeekInfo?.week === currentWeek;
    const uniqueSubjects = Array.from(new Set(dayTasks.map((t) => t.subjectId)));

    return (
      <button
        key={dayIndex}
        onClick={() => setSelectedDate(day)}
        disabled={!isInSemester && !isMonthView}
        className={`
          min-h-[80px] p-1 rounded-md text-left transition-colors relative
          ${isInSemester || isMonthView ? "hover-elevate cursor-pointer" : "opacity-40 cursor-default"}
          ${isToday ? "ring-2 ring-primary bg-primary/10" : ""}
          ${!isToday && isCurrentSemesterWeek && isInSemester ? "bg-primary/5" : ""}
          ${!isToday && !isCurrentSemesterWeek ? "bg-muted/30" : ""}
          ${isMonthView && !isSameMonth(day, currentMonth) ? "opacity-30" : ""}
        `}
        data-testid={`calendar-day-${dateStr}`}
      >
        <div className="flex justify-between items-start">
          <span
            className={`text-sm ${
              isToday
                ? "font-bold text-primary bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center"
                : "text-muted-foreground"
            }`}
          >
            {format(day, "d")}
          </span>
          {dayIndex === 0 && semesterWeekInfo && !isMonthView && (
            <Badge variant="outline" className="text-[10px] px-1">
              W{semesterWeekInfo.week}
            </Badge>
          )}
        </div>

        {dayIndex === 0 && uniqueSubjects.length > 0 && !isMonthView && (
          <div className="flex flex-wrap gap-0.5 mt-1">
            {uniqueSubjects.map((subjectId) => (
              <div
                key={subjectId}
                className={`h-2 w-2 rounded-full ${subjectColorClasses[subjectId]}`}
              />
            ))}
          </div>
        )}

        {dayExams.length > 0 && (
          <div className="absolute bottom-1 right-1">
            {dayExams.map((exam) => (
              <div
                key={exam.id}
                className="text-[10px] bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 px-1 rounded truncate font-medium"
              >
                {exam.title.split(" ")[0]}
              </div>
            ))}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="calendar-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {viewMode === "semester" ? "Semester Calendar" : format(currentMonth, "MMMM yyyy")}
          </h1>
          <p className="text-muted-foreground">
            {viewMode === "semester" 
              ? `${TOTAL_WEEKS}-week overview - Term 1 (9 weeks) + Term 2 (8 weeks)`
              : "Monthly view"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {viewMode === "month" && (
            <>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                data-testid="button-prev-month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                data-testid="button-next-month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            onClick={() => setViewMode(viewMode === "semester" ? "month" : "semester")}
            data-testid="button-toggle-view"
          >
            {viewMode === "semester" ? (
              <>
                <ToggleLeft className="h-4 w-4 mr-2" />
                Month View
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4 mr-2" />
                Semester View
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handlePrint} data-testid="button-print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1" data-testid="weekly-goal-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Weekly Study Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {editingGoal ? (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tempGoal}
                  onChange={(e) => setTempGoal(e.target.value)}
                  placeholder="Hours"
                  className="h-8"
                  data-testid="input-weekly-goal"
                />
                <Button 
                  size="sm" 
                  onClick={handleSaveGoal}
                  disabled={saveWeeklyGoal.isPending}
                  data-testid="button-save-goal"
                >
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{weeklyGoal}h</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setTempGoal(weeklyGoal.toString());
                    setEditingGoal(true);
                  }}
                  data-testid="button-edit-goal"
                >
                  Edit
                </Button>
              </div>
            )}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This week</span>
                <span className="font-medium">{weeklyStudyTotal.toFixed(1)}h / {weeklyGoal}h</span>
              </div>
              <Progress value={goalProgress} className="h-2" data-testid="progress-weekly-goal" />
              <p className="text-xs text-muted-foreground text-right">
                {goalProgress.toFixed(0)}% complete
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
          <span className="text-sm font-medium">Legend:</span>
          {subjects.map((subject) => (
            <div key={subject.id} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${subjectColorClasses[subject.id]}`} />
              <span className="text-sm">{subject.name}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <div className="h-3 w-3 rounded-full bg-yellow-500 ring-2 ring-yellow-500/30" />
            <span className="text-sm">Exam</span>
          </div>
          <div className="flex items-center gap-2">
            <ListTodo className="h-3 w-3 text-primary" />
            <span className="text-sm">To-Do</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">Study Time</span>
          </div>
          <div className="flex items-center gap-2">
            <StickyNote className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm">Note</span>
          </div>
        </div>
      </div>

      <Card data-testid="calendar-grid">
        <CardContent className="p-4">
          <div className="grid grid-cols-8 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
            {viewMode === "semester" && (
              <div className="text-center text-sm font-medium text-muted-foreground py-2">
                Progress
              </div>
            )}
          </div>

          <div className="space-y-1">
            {calendarWeeks.map((week, weekIndex) => {
              const firstDayOfWeek = week[0];
              const semesterWeekInfo = semesterWeeks.find(
                (sw) => isWithinInterval(firstDayOfWeek, { start: sw.start, end: sw.end })
              );

              const weekProgress = semesterWeekInfo 
                ? calculateWeekProgress(tasks, semesterWeekInfo.week)
                : { completed: 0, total: 0, percentage: 0 };

              return (
                <div key={weekIndex} className={`grid ${viewMode === "semester" ? "grid-cols-8" : "grid-cols-7"} gap-1`}>
                  {week.map((day, dayIndex) => renderDayCell(day, dayIndex, semesterWeekInfo, viewMode === "month"))}
                  
                  {viewMode === "semester" && semesterWeekInfo && (
                    <div className="flex flex-col justify-center items-center p-1 bg-muted/20 rounded-md" data-testid={`week-progress-${semesterWeekInfo.week}`}>
                      <Progress value={weekProgress.percentage} className="h-2 w-full mb-1" />
                      <span className="text-[10px] text-muted-foreground">
                        {weekProgress.percentage}%
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {weekProgress.completed}/{weekProgress.total}
                      </span>
                    </div>
                  )}
                  {viewMode === "semester" && !semesterWeekInfo && (
                    <div className="p-1 bg-muted/10 rounded-md opacity-40" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </DialogTitle>
            <DialogDescription>
              {selectedWeek 
                ? `Week ${selectedWeek} tasks and any scheduled exams`
                : "View tasks and exams scheduled for this date"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Study Time (hours)
                </label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={studyTimeInput}
                    onChange={(e) => setStudyTimeInput(e.target.value)}
                    placeholder="0"
                    data-testid="input-study-time"
                  />
                  <Button 
                    size="sm" 
                    onClick={handleSaveStudyTime}
                    disabled={saveStudyTime.isPending}
                    data-testid="button-save-study-time"
                  >
                    {saveStudyTime.isPending ? "..." : "Log"}
                  </Button>
                </div>
              </div>
              
              {selectedDate && studyTimeData && studyTimeData.hours > 0 && (
                <div className="flex items-end">
                  <Badge variant="secondary" className="text-sm">
                    Logged: {studyTimeData.hours}h today
                  </Badge>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <StickyNote className="h-4 w-4" />
                Quick Note
              </label>
              <Textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Add a note for this day..."
                className="min-h-[80px]"
                data-testid="textarea-day-note"
              />
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSaveNote}
                disabled={saveDayNote.isPending}
                data-testid="button-save-note"
              >
                {saveDayNote.isPending ? "Saving..." : "Save Note"}
              </Button>
            </div>

            {selectedExams.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 text-yellow-600 dark:text-yellow-400">
                  Exams on this day
                </h3>
                {selectedExams.map((exam) => {
                  const subject = subjects.find((s) => s.id === exam.subjectId);
                  return (
                    <Card key={exam.id}>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${subjectColorClasses[exam.subjectId]}`} />
                          <Badge variant="outline" className="text-xs">{subject?.name}</Badge>
                        </div>
                        <h4 className="font-medium">{exam.title}</h4>
                        {exam.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {exam.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {selectedTasks.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">
                  {selectedWeek ? `Week ${selectedWeek} Tasks` : "Tasks for this week"}
                </h3>
                <div className="space-y-2">
                  {selectedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      showSubject
                    />
                  ))}
                </div>
              </div>
            )}

            {selectedDate && (
              <div className="border-t pt-4">
                <CustomTodoList 
                  key={todoRefreshKey}
                  date={selectedDate} 
                  onTodosChange={() => setTodoRefreshKey(k => k + 1)}
                />
              </div>
            )}

            {selectedTasks.length === 0 && selectedExams.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No study tasks or exams scheduled for this week
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
