import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Task, Note, Exam, Grade, Streak, UserStats, AvatarSettings } from "@shared/schema";

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

export function useGrades() {
  return useQuery<Grade[]>({
    queryKey: ["/api/grades"],
  });
}

export function useSaveGrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (grade: Omit<Grade, "id" | "userId">) => {
      const res = await apiRequest("POST", "/api/grades", grade);
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
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/streak/update", {});
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
  return useMutation({
    mutationFn: async ({ date, title }: { date: string; title: string }) => {
      const res = await apiRequest("POST", "/api/calendar/todos", { date, title });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/todos", variables.date] });
    },
  });
}

export function useToggleCustomTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      const res = await apiRequest("PATCH", `/api/calendar/todos/${id}/toggle`, {});
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/todos", variables.date] });
    },
  });
}

export function useDeleteCustomTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      await apiRequest("DELETE", `/api/calendar/todos/${id}`, {});
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/todos", variables.date] });
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
  return useMutation({
    mutationFn: async ({ date, hours }: { date: string; hours: number }) => {
      const res = await apiRequest("PUT", `/api/calendar/study-time/${date}`, { hours });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/study-time", variables.date] });
    },
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
  return useMutation({
    mutationFn: async ({ date, content }: { date: string; content: string }) => {
      const res = await apiRequest("PUT", `/api/calendar/day-notes/${date}`, { content });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/day-notes", variables.date] });
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
  return useMutation({
    mutationFn: async (hours: number) => {
      const res = await apiRequest("PUT", "/api/calendar/weekly-goal", { hours });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/weekly-goal"] });
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
