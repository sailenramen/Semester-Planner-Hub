import { Exam, subjects, getCurrentWeek } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Calendar } from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

interface ExamAlertProps {
  exams: Exam[];
}

export function ExamAlert({ exams }: ExamAlertProps) {
  const currentWeek = getCurrentWeek();
  const today = new Date();
  
  // Filter exams that are coming up in the next 2 weeks
  const upcomingExams = exams
    .filter((exam) => {
      const examDate = parseISO(exam.date);
      const daysUntil = differenceInDays(examDate, today);
      return daysUntil >= 0 && daysUntil <= 14;
    })
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  if (upcomingExams.length === 0) return null;

  return (
    <div className="space-y-3" data-testid="exam-alerts">
      {upcomingExams.map((exam) => {
        const subject = subjects.find((s) => s.id === exam.subjectId);
        const examDate = parseISO(exam.date);
        const daysUntil = differenceInDays(examDate, today);

        return (
          <Card
            key={exam.id}
            className={`border-l-4 ${subject?.borderColor || "border-primary"}`}
            data-testid={`exam-alert-${exam.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${subject?.color || "text-primary"}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="font-semibold">{exam.title}</h4>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        daysUntil <= 7
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {daysUntil === 0
                        ? "Today!"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : `${daysUntil} days`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(examDate, "EEEE, MMMM d, yyyy")}</span>
                  </div>
                  {exam.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {exam.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
