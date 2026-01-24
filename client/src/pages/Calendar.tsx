import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { TaskCard } from "@/components/TaskCard";
import {
  Task,
  Exam,
  subjects,
  TERM1_START,
  TERM2_END,
  getWeekDates,
  getCurrentWeek,
  getTermLabel,
  TOTAL_WEEKS,
} from "@shared/schema";
import { getTasks, toggleTaskCompletion, getExams } from "@/lib/storage";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  parseISO,
  addWeeks,
} from "date-fns";
import { Calendar as CalendarIcon, Printer } from "lucide-react";

const subjectColorClasses: Record<string, string> = {
  math: "bg-blue-500",
  science: "bg-green-500",
  history: "bg-red-500",
  english: "bg-purple-500",
};

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const currentWeek = getCurrentWeek();

  useEffect(() => {
    setTasks(getTasks());
    setExams(getExams());
  }, []);

  const handleToggleTask = (taskId: string) => {
    const updated = toggleTaskCompletion(taskId);
    setTasks(updated);
  };

  // Generate all weeks of the semester
  const semesterWeeks: { week: number; start: Date; end: Date; term: number }[] = [];
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    const { start, end, term } = getWeekDates(w);
    semesterWeeks.push({ week: w, start, end, term });
  }

  // Get tasks for a specific date - returns tasks for the week that contains this date
  const getTasksForDate = (date: Date) => {
    const weekInfo = semesterWeeks.find(
      (w) => isWithinInterval(date, { start: w.start, end: w.end })
    );
    if (!weekInfo) return [];
    
    // Return all tasks for this week (showing them on any day of the week)
    return tasks.filter((t) => t.week === weekInfo.week);
  };

  // Get the week number for a date
  const getWeekForDate = (date: Date): number | null => {
    const weekInfo = semesterWeeks.find(
      (w) => isWithinInterval(date, { start: w.start, end: w.end })
    );
    return weekInfo?.week || null;
  };

  // Get exams for a specific date
  const getExamsForDate = (date: Date) => {
    return exams.filter((e) => isSameDay(parseISO(e.date), date));
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const weeks: Date[][] = [];
    let current = startOfWeek(TERM1_START, { weekStartsOn: 1 });
    const end = endOfWeek(TERM2_END, { weekStartsOn: 1 });

    while (current <= end) {
      const weekEnd = endOfWeek(current, { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: current, end: weekEnd });
      weeks.push(days);
      current = addWeeks(current, 1);
    }

    return weeks;
  };

  const calendarWeeks = generateCalendarGrid();

  // Selected date tasks/exams
  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : [];
  const selectedExams = selectedDate ? getExamsForDate(selectedDate) : [];
  const selectedWeek = selectedDate ? getWeekForDate(selectedDate) : null;

  // Handle print/export
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="calendar-page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Semester Calendar</h1>
          <p className="text-muted-foreground">
            {TOTAL_WEEKS}-week overview - Term 1 (9 weeks) + Term 2 (8 weeks)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint} data-testid="button-print">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border">
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
      </div>

      {/* Calendar Grid */}
      <Card data-testid="calendar-grid">
        <CardContent className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Weeks */}
          <div className="space-y-1">
            {calendarWeeks.map((week, weekIndex) => {
              // Find the semester week number
              const firstDayOfWeek = week[0];
              const semesterWeekInfo = semesterWeeks.find(
                (sw) => isWithinInterval(firstDayOfWeek, { start: sw.start, end: sw.end })
              );

              return (
                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                  {week.map((day, dayIndex) => {
                    const dayTasks = getTasksForDate(day);
                    const dayExams = getExamsForDate(day);
                    const isToday = isSameDay(day, new Date());
                    const isInSemester = semesterWeeks.some(
                      (sw) => isWithinInterval(day, { start: sw.start, end: sw.end })
                    );
                    const isCurrentSemesterWeek =
                      semesterWeekInfo?.week === currentWeek;

                    // Get unique subjects for this day (week's tasks)
                    const uniqueSubjects = Array.from(
                      new Set(dayTasks.map((t) => t.subjectId))
                    );

                    return (
                      <button
                        key={dayIndex}
                        onClick={() => setSelectedDate(day)}
                        disabled={!isInSemester}
                        className={`
                          min-h-[80px] p-1 rounded-md text-left transition-colors relative
                          ${isInSemester ? "hover-elevate cursor-pointer" : "opacity-40 cursor-default"}
                          ${isToday ? "ring-2 ring-primary" : ""}
                          ${isCurrentSemesterWeek && isInSemester ? "bg-primary/5" : "bg-muted/30"}
                        `}
                        data-testid={`calendar-day-${format(day, "yyyy-MM-dd")}`}
                      >
                        <div className="flex justify-between items-start">
                          <span
                            className={`text-sm ${
                              isToday
                                ? "font-bold text-primary"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(day, "d")}
                          </span>
                          {dayIndex === 0 && semesterWeekInfo && (
                            <Badge variant="outline" className="text-[10px] px-1">
                              W{semesterWeekInfo.week}
                            </Badge>
                          )}
                        </div>

                        {/* Task indicators - show on Monday of each week */}
                        {dayIndex === 0 && uniqueSubjects.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1">
                            {uniqueSubjects.map((subjectId) => (
                              <div
                                key={subjectId}
                                className={`h-2 w-2 rounded-full ${subjectColorClasses[subjectId]}`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Exam indicators */}
                        {dayExams.length > 0 && (
                          <div className="absolute bottom-1 left-1 right-1">
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
                  })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Date Details Dialog */}
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
            {selectedExams.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 text-yellow-600 dark:text-yellow-400">
                  Exams on this day
                </h3>
                {selectedExams.map((exam) => {
                  const subject = subjects.find((s) => s.id === exam.subjectId);
                  return (
                    <Card
                      key={exam.id}
                      className={`border-l-4 ${subject?.borderColor}`}
                    >
                      <CardContent className="p-3">
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

            {selectedTasks.length === 0 && selectedExams.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No tasks or exams scheduled for this week
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
