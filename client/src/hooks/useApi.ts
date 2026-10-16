import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Task, Note, Exam, Grade, Streak, UserStats, AvatarSettings } from "@shared/schema";

export function saveErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Please try again";
}

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await apiRequest("PATCH", `/api/tasks/${taskId}/toggle`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
    },
  });
}

export function useResetTasks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/tasks/reset", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });
}

export function useNotes() {
  return useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });
}

export function useSaveNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ subjectId, content }: { subjectId: string; content: string }) => {
      const res = await apiRequest("PUT", `/api/notes/${subjectId}`, { content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
  });
}

export function useExams() {
  return useQuery<Exam[]>({
    queryKey: ["/api/exams"],
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string; date?: string; title?: string; description?: string }) => {
      const res = await apiRequest("PUT", `/api/exams/${id}`, patch);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exams"] });
      toast({ title: "Exam updated" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Exam not updated",
        description: saveErrorMessage(error),
      });
    },
  });
}

export function useGrades() {
  return useQuery<Grade[]>({
    queryKey: ["/api/grades"],
  });
}

export function useSaveGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    // The server exposes this as PUT /api/grades; a POST here fell through to
    // the SPA catch-all, so grades were never stored.
    mutationFn: async (grade: Omit<Grade, "id" | "userId">) => {
      const res = await apiRequest("PUT", "/api/grades", grade);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grades"] });
    },
  });
}

export function useStreak() {
  return useQuery<Streak>({
    queryKey: ["/api/streak"],
  });
}

export function useUpdateStreak() {
  const queryClient = useQueryClient();
  return useMutation({
    // Server route is PUT /api/streak (there is no /api/streak/update).
    mutationFn: async () => {
      const res = await apiRequest("PUT", "/api/streak", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/streak"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useUserStats() {
  return useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });
}

export function useAddPoints() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (points: number) => {
      const res = await apiRequest("POST", "/api/stats/points", { points });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useAddStudyMinutes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ minutes, subjectId }: { minutes: number; subjectId?: string }) => {
      const res = await apiRequest("POST", "/api/stats/study-minutes", { minutes, subjectId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useRecordPomodoro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/stats/pomodoro", {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useEarnBadge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (badgeId: string) => {
      const res = await apiRequest("POST", "/api/stats/badge", { badgeId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useUpdateShowcasedBadges() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (badges: string[]) => {
      const res = await apiRequest("POST", "/api/stats/showcased-badges", { badges });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });
}

export function useAvatarSettings() {
  return useQuery<AvatarSettings>({
    queryKey: ["/api/avatar"],
  });
}

export function useSaveAvatarSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: AvatarSettings) => {
      const res = await apiRequest("PUT", "/api/avatar", settings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/avatar"] });
    },
  });
}

export interface CustomTodo {
  id: string;
  userId: string;
  date: string;
  title: string;
  completed: boolean;
}

export function useCustomTodos(date: string) {
  return useQuery<CustomTodo[]>({
    queryKey: ["/api/calendar/todos", date],
    enabled: !!date,
  });
}

export function useCreateCustomTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ date, title }: { date: string; title: string }) => {
      const res = await apiRequest("POST", "/api/calendar/todos", { date, title });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/todos", variables.date] });
      toast({ title: "To-do added" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "To-do not saved",
        description: saveErrorMessage(error),
      });
    },
  });
}

export function useToggleCustomTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      const res = await apiRequest("PATCH", `/api/calendar/todos/${id}/toggle`, {});
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/todos", variables.date] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "To-do not updated",
        description: saveErrorMessage(error),
      });
    },
  });
}

export function useDeleteCustomTodo() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      await apiRequest("DELETE", `/api/calendar/todos/${id}`, {});
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/todos", variables.date] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "To-do not deleted",
        description: saveErrorMessage(error),
      });
    },
  });
}

export interface StudyTime {
  hours: number;
}

export function useStudyTime(date: string) {
  return useQuery<StudyTime>({
    queryKey: ["/api/calendar/study-time", date],
    enabled: !!date,
  });
}

export function useSaveStudyTime() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ date, hours }: { date: string; hours: number }) => {
      const res = await apiRequest("PUT", `/api/calendar/study-time/${date}`, { hours });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/study-time", variables.date] });
      // The calendar's weekly goal bar is fed by the range summary.
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/study-time-summary"] });
      toast({ title: `Logged ${variables.hours}h on ${variables.date}` });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Study time not saved",
        description: saveErrorMessage(error),
      });
    },
  });
}

export interface StudyTimeSummary {
  totalHours: number;
  days: number;
}

// Total logged hours between two yyyy-MM-dd dates (inclusive).
export function useStudyTimeSummary(from: string, to: string) {
  return useQuery<StudyTimeSummary>({
    queryKey: ["/api/calendar/study-time-summary", from, to],
    enabled: !!from && !!to,
  });
}

export interface DayNote {
  content: string;
}

export function useDayNote(date: string) {
  return useQuery<DayNote>({
    queryKey: ["/api/calendar/day-notes", date],
    enabled: !!date,
  });
}

export function useSaveDayNote() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ date, content }: { date: string; content: string }) => {
      const res = await apiRequest("PUT", `/api/calendar/day-notes/${date}`, { content });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/day-notes", variables.date] });
      toast({ title: "Note saved" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Note not saved",
        description: saveErrorMessage(error),
      });
    },
  });
}

export interface WeeklyGoal {
  hours: number;
}

export function useWeeklyGoal() {
  return useQuery<WeeklyGoal>({
    queryKey: ["/api/calendar/weekly-goal"],
  });
}

export function useSaveWeeklyGoal() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (hours: number) => {
      const res = await apiRequest("PUT", "/api/calendar/weekly-goal", { hours });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/weekly-goal"] });
      toast({ title: "Weekly goal updated" });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Weekly goal not saved",
        description: saveErrorMessage(error),
      });
    },
  });
}

export function calculateProgress(tasks: Task[], term?: number): { completed: number; total: number; percentage: number } {
  const filtered = term ? tasks.filter((t) => t.term === term) : tasks;
  const completed = filtered.filter((t) => t.completed).length;
  const total = filtered.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function calculateWeekProgress(tasks: Task[], week: number): { completed: number; total: number; percentage: number } {
  const filtered = tasks.filter((t) => t.week === week);
  const completed = filtered.filter((t) => t.completed).length;
  const total = filtered.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}

export function calculateSubjectProgress(tasks: Task[], subjectId: string): { completed: number; total: number; percentage: number } {
  const filtered = tasks.filter((t) => t.subjectId === subjectId);
  const completed = filtered.filter((t) => t.completed).length;
  const total = filtered.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percentage };
}
