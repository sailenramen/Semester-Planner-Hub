import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/TaskCard";
import { ProgressRing } from "@/components/ProgressRing";
import { ExamAlert } from "@/components/ExamAlert";
import { ExamModeToggle } from "@/components/ExamModeToggle";
import { SubjectProgressChart } from "@/components/SubjectProgressChart";
import {
  Task,
  Exam,
  subjects,
  getCurrentWeek,
  getCurrentTerm,
  getWeekDates,
  getTermLabel,
  TOTAL_WEEKS,
} from "@shared/schema";
import {
  getTasks,
  toggleTaskCompletion,
  getExams,
  getExamMode,
  setExamMode,
  calculateProgress,
  calculateWeekProgress,
} from "@/lib/storage";
import { format, parseISO, differenceInDays } from "date-fns";
import { Calendar, TrendingUp, BookOpen, RefreshCw, Clock, AlertTriangle, Target } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [examMode, setExamModeState] = useState(false);

  const currentWeek = getCurrentWeek();
  const currentTerm = getCurrentTerm();
  const { start: weekStart, end: weekEnd } = getWeekDates(currentWeek);
  const termLabel = getTermLabel(currentWeek);
  const today = new Date();

  useEffect(() => {
    setTasks(getTasks());
    setExams(getExams());
    setExamModeState(getExamMode());
  }, []);

  const handleToggleTask = (taskId: string) => {
    const updated = toggleTaskCompletion(taskId);
    setTasks(updated);
  };

  const handleExamModeToggle = (enabled: boolean) => {
    setExamModeState(enabled);
    setExamMode(enabled);
  };

  // This week's tasks - tasks for current week
  const thisWeeksTasks = tasks.filter((t) => t.week === currentWeek);
  
  // Weekly progress
  const weekProgress = calculateWeekProgress(tasks, currentWeek);
  
  // Term progress
  const termProgress = calculateProgress(tasks, currentTerm);
  
  // Total progress
  const totalProgress = calculateProgress(tasks);

  // Upcoming exams (next 2 weeks)
  const upcomingExams = exams
    .filter((exam) => {
      const examDate = parseISO(exam.date);
      const daysUntil = differenceInDays(examDate, today);
      return daysUntil >= 0 && daysUntil <= 14;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const hasUpcomingExams = upcomingExams.length > 0;

  // Next upcoming exam for countdown
  const nextExam = upcomingExams[0];
  const daysUntilNextExam = nextExam
    ? differenceInDays(parseISO(nextExam.date), today)
    : null;

  // Get tasks grouped by subject for current week
  const tasksBySubject = subjects.map((subject) => ({
    subject,
    tasks: thisWeeksTasks.filter((t) => t.subjectId === subject.id),
  }));

  // Exam mode adjusted tasks - prioritize exam-related subjects
  const examModeSubjects = examMode && hasUpcomingExams
    ? upcomingExams.map((e) => e.subjectId)
    : [];

  const prioritizedTasksBySubject = examMode && examModeSubjects.length > 0
    ? [
        // Exam subjects first
        ...tasksBySubject.filter((ts) => examModeSubjects.includes(ts.subject.id)),
        // Then other subjects
        ...tasksBySubject.filter((ts) => !examModeSubjects.includes(ts.subject.id)),
      ]
    : tasksBySubject;

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="dashboard-page">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Study Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and stay on top of your studies
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Calendar className="h-4 w-4 mr-1" />
            {termLabel}
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            Week {currentWeek} of {TOTAL_WEEKS}
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
          </Badge>
        </div>
      </div>

      {/* Exam Mode Section */}
      <div className="space-y-4">
        <ExamModeToggle
          enabled={examMode}
          onToggle={handleExamModeToggle}
          hasUpcomingExams={hasUpcomingExams}
        />

        {/* Exam Countdown Card */}
        {examMode && nextExam && (
          <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20" data-testid="exam-countdown">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {daysUntilNextExam}
                  </div>
                  <div>
                    <p className="font-semibold text-orange-700 dark:text-orange-400">
                      {daysUntilNextExam === 0
                        ? "Exam Today!"
                        : daysUntilNextExam === 1
                        ? "Exam Tomorrow!"
                        : `${daysUntilNextExam} days until exam`}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-300">
                      {nextExam.title} - {format(parseISO(nextExam.date), "EEEE, MMM d")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700 dark:text-orange-400">
                    Focus on intensive review
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Intensive Review Period Panel */}
        {examMode && hasUpcomingExams && (
          <Card className="border-dashed border-2 border-orange-300 dark:border-orange-700" data-testid="intensive-review-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <Clock className="h-4 w-4" />
                Intensive Review Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Recommended study adjustments for the next {daysUntilNextExam && daysUntilNextExam <= 7 ? daysUntilNextExam : 14} days:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcomingExams.slice(0, 2).map((exam) => {
                  const subject = subjects.find((s) => s.id === exam.subjectId);
                  const examDays = differenceInDays(parseISO(exam.date), today);
                  return (
                    <div
                      key={exam.id}
                      className={`p-3 rounded-lg ${subject?.bgColor} border ${subject?.borderColor}`}
                    >
                      <p className={`font-medium text-sm ${subject?.color}`}>
                        {subject?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {examDays <= 3
                          ? "Final review & practice exams"
                          : examDays <= 7
                          ? "Focus on weak areas & key concepts"
                          : "Review notes & complete practice questions"}
                      </p>
                      <p className="text-xs mt-2 font-medium">
                        {examDays <= 3 ? "2-3 hours/day" : examDays <= 7 ? "1-2 hours/day" : "45-60 min/day"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exam Schedule Panel - shows when exam mode is on but no upcoming exams in 2 weeks */}
        {examMode && !hasUpcomingExams && exams.length > 0 && (
          <Card className="border-orange-200 dark:border-orange-800" data-testid="exam-schedule-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <Calendar className="h-4 w-4" />
                Upcoming Exam Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                No exams within the next 2 weeks. Here's your exam schedule:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exams
                  .filter((exam) => differenceInDays(parseISO(exam.date), today) > 0)
                  .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
                  .slice(0, 4)
                  .map((exam) => {
                    const subject = subjects.find((s) => s.id === exam.subjectId);
                    const examDays = differenceInDays(parseISO(exam.date), today);
                    return (
                      <div
                        key={exam.id}
                        className={`p-2 rounded-lg ${subject?.bgColor} border ${subject?.borderColor}`}
                      >
                        <p className={`font-medium text-sm ${subject?.color}`}>
                          {exam.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(parseISO(exam.date), "MMM d, yyyy")} ({examDays} days away)
                        </p>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Exam Alerts */}
      <ExamAlert exams={exams} />

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card data-testid="card-weekly-progress">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Week {currentWeek} Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{weekProgress.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {weekProgress.completed} of {weekProgress.total} tasks
                </p>
              </div>
              <ProgressRing percentage={weekProgress.percentage} size={70} />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-term-progress">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Term {currentTerm} Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{termProgress.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {termProgress.completed} of {termProgress.total} tasks
                </p>
              </div>
              <ProgressRing 
                percentage={termProgress.percentage} 
                size={70} 
                color="hsl(var(--chart-2))" 
              />
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-semester-progress">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Semester Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalProgress.percentage}%</p>
                <p className="text-sm text-muted-foreground">
                  {totalProgress.completed} of {totalProgress.total} tasks
                </p>
              </div>
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* This Week's Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {examMode && hasUpcomingExams ? "Priority Study Tasks" : "This Week's Tasks"}
              </h2>
              {examMode && hasUpcomingExams && (
                <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3" />
                  Exam subjects prioritized for intensive review
                </p>
              )}
            </div>
            <Button variant="ghost" size="sm" data-testid="button-refresh-tasks" onClick={() => setTasks(getTasks())}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          {prioritizedTasksBySubject.map(({ subject, tasks: subjectTasks }) => {
            const isExamSubject = examModeSubjects.includes(subject.id);
            
            return (
              <div key={subject.id} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${subject.bgColor} ${subject.borderColor} border-2`} />
                  <h3 className={`font-medium ${subject.color}`}>{subject.name}</h3>
                  <span className="text-xs text-muted-foreground">
                    ({subjectTasks.filter((t) => t.completed).length}/{subjectTasks.length} done)
                  </span>
                  {examMode && isExamSubject && (
                    <Badge variant="outline" className="text-xs border-orange-500 text-orange-600 dark:text-orange-400">
                      Exam Focus
                    </Badge>
                  )}
                </div>
                {subjectTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                  />
                ))}
              </div>
            );
          })}

          {thisWeeksTasks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No tasks scheduled for this week. You're all caught up!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Progress Chart */}
        <div>
          <SubjectProgressChart tasks={tasks} />
        </div>
      </div>
    </div>
  );
}
