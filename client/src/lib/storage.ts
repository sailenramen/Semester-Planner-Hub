import { 
  Task, Note, generateSampleTasks, generateSampleExams, Exam, TERM1_START, Grade,
  Streak, UserStats, BadgeId, badges, POINTS_CONFIG, getLevelFromPoints, subjects
} from "@shared/schema";

const STORAGE_KEYS = {
  TASKS: "study-planner-tasks",
  NOTES: "study-planner-notes",
  EXAMS: "study-planner-exams",
  EXAM_MODE: "study-planner-exam-mode",
  THEME: "study-planner-theme",
  SEMESTER_VERSION: "study-planner-semester-version",
  GRADES: "study-planner-grades",
  STREAK: "study-planner-streak",
  USER_STATS: "study-planner-user-stats",
};

// Check if data needs to be regenerated for a new semester
function checkSemesterVersion(): boolean {
  const storedVersion = localStorage.getItem(STORAGE_KEYS.SEMESTER_VERSION);
  // Use v2 prefix to force regeneration for new curriculum structure
  const currentVersion = "v2-" + TERM1_START.toISOString().split('T')[0];
  
  if (storedVersion !== currentVersion) {
    // Clear old data for new semester
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.setItem(STORAGE_KEYS.SEMESTER_VERSION, currentVersion);
    return true;
  }
  return false;
}

// Initialize semester version check
checkSemesterVersion();

// Task storage
export function getTasks(): Task[] {
  const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
  if (!stored) {
    const tasks = generateSampleTasks();
    saveTasks(tasks);
    return tasks;
  }
  return JSON.parse(stored);
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function toggleTaskCompletion(taskId: string): Task[] {
  const tasks = getTasks();
  const updatedTasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks(updatedTasks);
  return updatedTasks;
}

export function resetTasks(): Task[] {
  const tasks = generateSampleTasks();
  saveTasks(tasks);
  return tasks;
}

// Notes storage
export function getNotes(): Note[] {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTES);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored);
}

export function saveNote(note: Note): Note[] {
  const notes = getNotes();
  const existingIndex = notes.findIndex(
    (n) => n.subjectId === note.subjectId
  );
  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  return notes;
}

export function getSubjectNote(subjectId: string): Note | undefined {
  const notes = getNotes();
  return notes.find((n) => n.subjectId === subjectId);
}

// Exams storage
export function getExams(): Exam[] {
  const stored = localStorage.getItem(STORAGE_KEYS.EXAMS);
  if (!stored) {
    const exams = generateSampleExams();
    saveExams(exams);
    return exams;
  }
  return JSON.parse(stored);
}

export function saveExams(exams: Exam[]): void {
  localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
}

// Exam mode
export function getExamMode(): boolean {
  return localStorage.getItem(STORAGE_KEYS.EXAM_MODE) === "true";
}

export function setExamMode(enabled: boolean): void {
  localStorage.setItem(STORAGE_KEYS.EXAM_MODE, enabled.toString());
}

// Theme
export function getTheme(): "light" | "dark" {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === "dark") return "dark";
  if (stored === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function setTheme(theme: "light" | "dark"): void {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Initialize theme on load
export function initializeTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}

// Progress calculations
export function calculateProgress(tasks: Task[], term?: number): { completed: number; total: number; percentage: number } {
  const filtered = term
    ? tasks.filter((t) => t.term === term)
    : tasks;
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

// Grades storage
export function getGrades(): Grade[] {
  const stored = localStorage.getItem(STORAGE_KEYS.GRADES);
  if (!stored) {
    return [];
  }
  return JSON.parse(stored);
}

export function saveGrade(grade: Grade): Grade[] {
  const grades = getGrades();
  const existingIndex = grades.findIndex(
    (g) => g.subjectId === grade.subjectId && g.assessmentId === grade.assessmentId
  );
  if (existingIndex >= 0) {
    grades[existingIndex] = grade;
  } else {
    grades.push(grade);
  }
  localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  return grades;
}

export function getSubjectGrades(subjectId: string): Grade[] {
  const grades = getGrades();
  return grades.filter((g) => g.subjectId === subjectId);
}

export function calculateSubjectAverage(subjectId: string): { average: number | null; entered: number; total: number } {
  const grades = getSubjectGrades(subjectId);
  const enteredGrades = grades.filter((g) => g.score !== null);
  
  if (enteredGrades.length === 0) {
    return { average: null, entered: 0, total: 0 };
  }
  
  const sum = enteredGrades.reduce((acc, g) => acc + (g.score || 0), 0);
  const average = Math.round(sum / enteredGrades.length);
  
  return { average, entered: enteredGrades.length, total: grades.length };
}

// Streak storage
export function getStreak(): Streak {
  const stored = localStorage.getItem(STORAGE_KEYS.STREAK);
  if (!stored) {
    const defaultStreak: Streak = {
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      lastActiveDate: null,
      lastCheckDate: null,
      streakFreezes: 2,
      freezesUsedThisMonth: 0,
      freezeDaysRemaining: 2,
      lastFreezeMonth: null,
    };
    saveStreak(defaultStreak);
    return defaultStreak;
  }
  return JSON.parse(stored);
}

export function saveStreak(streak: Streak): void {
  localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
}

function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

function isYesterday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getDateString(date) === getDateString(yesterday);
}

function isToday(dateStr: string): boolean {
  return dateStr === getDateString(new Date());
}

export function updateStreak(): { streak: Streak; newBadges: BadgeId[] } {
  const streak = getStreak();
  const today = getDateString(new Date());
  const currentMonth = new Date().getMonth();
  const newBadges: BadgeId[] = [];
  
  // Reset monthly freezes if new month
  if (streak.lastFreezeMonth !== currentMonth) {
    streak.streakFreezes = 2;
    streak.freezesUsedThisMonth = 0;
    streak.lastFreezeMonth = currentMonth;
  }
  
  // Check if already studied today
  if (streak.lastStudyDate === today) {
    return { streak, newBadges };
  }
  
  // Check streak continuation
  if (streak.lastStudyDate) {
    if (isYesterday(streak.lastStudyDate)) {
      // Studied yesterday, continue streak
      streak.currentStreak += 1;
    } else if (!isToday(streak.lastStudyDate)) {
      // Missed a day - check for streak freeze
      const daysSinceLastStudy = Math.floor(
        (new Date(today).getTime() - new Date(streak.lastStudyDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastStudy <= 2 && streak.streakFreezes > 0) {
        // Use streak freeze
        streak.streakFreezes -= 1;
        streak.freezesUsedThisMonth += 1;
        streak.currentStreak += 1;
      } else {
        // Lost streak
        streak.currentStreak = 1;
      }
    }
  } else {
    streak.currentStreak = 1;
  }
  
  streak.lastStudyDate = today;
  
  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  
  // Check streak badges
  const stats = getUserStats();
  if (streak.currentStreak >= 7 && !stats.badgesEarned.includes("week-warrior")) {
    newBadges.push("week-warrior");
  }
  if (streak.currentStreak >= 14 && !stats.badgesEarned.includes("two-weeks-strong")) {
    newBadges.push("two-weeks-strong");
  }
  if (streak.currentStreak >= 30 && !stats.badgesEarned.includes("month-master")) {
    newBadges.push("month-master");
  }
  if (streak.currentStreak >= 100 && !stats.badgesEarned.includes("century-club")) {
    newBadges.push("century-club");
  }
  
  saveStreak(streak);
  return { streak, newBadges };
}

// User stats storage
export function getUserStats(): UserStats {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_STATS);
  if (!stored) {
    const defaultStats: UserStats = {
      totalPoints: 0,
      totalStudyMinutes: 0,
      totalTasksCompleted: 0,
      totalPomodoroSessions: 0,
      badgesEarned: [],
      dailyTaskCompletions: {},
      taskCompletionTimes: [],
      subjectStudyMinutes: {},
      level: 1,
      lastActiveDate: null,
    };
    saveUserStats(defaultStats);
    return defaultStats;
  }
  return JSON.parse(stored);
}

export function saveUserStats(stats: UserStats): void {
  localStorage.setItem(STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
}

export function addPoints(points: number): UserStats {
  const stats = getUserStats();
  stats.totalPoints += points;
  stats.level = getLevelFromPoints(stats.totalPoints);
  saveUserStats(stats);
  return stats;
}

export function addStudyMinutes(minutes: number, subjectId?: string): UserStats {
  const stats = getUserStats();
  stats.totalStudyMinutes += minutes;
  
  if (subjectId) {
    stats.subjectStudyMinutes[subjectId] = (stats.subjectStudyMinutes[subjectId] || 0) + minutes;
  }
  
  saveUserStats(stats);
  return stats;
}

export function recordPomodoroSession(): { stats: UserStats; newBadges: BadgeId[] } {
  const stats = getUserStats();
  const newBadges: BadgeId[] = [];
  
  stats.totalPomodoroSessions += 1;
  stats.totalPoints += POINTS_CONFIG.POMODORO_SESSION;
  stats.level = getLevelFromPoints(stats.totalPoints);
  
  // Check time lord badge (25 hours = 1500 minutes)
  if (stats.totalStudyMinutes >= 1500 && !stats.badgesEarned.includes("time-lord")) {
    newBadges.push("time-lord");
  }
  
  saveUserStats(stats);
  return { stats, newBadges };
}

export function earnBadge(badgeId: BadgeId): { stats: UserStats; isNew: boolean } {
  const stats = getUserStats();
  
  if (stats.badgesEarned.includes(badgeId)) {
    return { stats, isNew: false };
  }
  
  stats.badgesEarned.push(badgeId);
  saveUserStats(stats);
  return { stats, isNew: true };
}

export function checkDailyStreak(): { streak: Streak; newBadges: BadgeId[] } {
  const streak = getStreak();
  const today = getDateString(new Date());
  const newBadges: BadgeId[] = [];
  
  // If already checked today, return current state
  if (streak.lastCheckDate === today) {
    return { streak, newBadges };
  }
  
  // Calculate days since last activity
  const lastActive = streak.lastActiveDate;
  if (lastActive) {
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      // Missed days - use freeze or reset streak
      const missedDays = daysDiff - 1;
      
      if (streak.freezeDaysRemaining >= missedDays) {
        // Use freeze days
        streak.freezeDaysRemaining -= missedDays;
      } else {
        // Not enough freezes - reset streak
        streak.currentStreak = 0;
      }
    }
  }
  
  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  
  // Check for streak badges
  const stats = getUserStats();
  if (streak.currentStreak >= 7 && !stats.badgesEarned.includes("week-warrior")) {
    newBadges.push("week-warrior");
    earnBadge("week-warrior");
  }
  if (streak.currentStreak >= 14 && !stats.badgesEarned.includes("two-weeks-strong")) {
    newBadges.push("two-weeks-strong");
    earnBadge("two-weeks-strong");
  }
  if (streak.currentStreak >= 30 && !stats.badgesEarned.includes("month-master")) {
    newBadges.push("month-master");
    earnBadge("month-master");
  }
  if (streak.currentStreak >= 100 && !stats.badgesEarned.includes("century-club")) {
    newBadges.push("century-club");
    earnBadge("century-club");
  }
  
  streak.lastCheckDate = today;
  saveStreak(streak);
  
  return { streak, newBadges };
}

export interface TaskCompletionResult {
  stats: UserStats;
  streak: Streak;
  newBadges: BadgeId[];
  pointsEarned: number;
  levelUp: boolean;
}

export function recordTaskCompletion(taskId: string, withQuestions: boolean = false, wasAlreadyCompleted: boolean = false): TaskCompletionResult {
  // Prevent double-awarding if task was already completed
  if (wasAlreadyCompleted) {
    return { stats: getUserStats(), streak: getStreak(), newBadges: [], pointsEarned: 0, levelUp: false };
  }
  
  const tasks = getTasks();
  const task = tasks.find(t => t.id === taskId);
  const stats = getUserStats();
  const prevLevel = stats.level;
  const newBadges: BadgeId[] = [];
  
  const today = getDateString(new Date());
  const hour = new Date().getHours();
  
  // Calculate points
  let pointsEarned = withQuestions ? POINTS_CONFIG.TASK_WITH_QUESTIONS : POINTS_CONFIG.TASK_COMPLETE;
  
  // Update stats
  stats.totalTasksCompleted += 1;
  stats.totalPoints += pointsEarned;
  stats.taskCompletionTimes.push(new Date().toISOString());
  
  // Track daily completions
  stats.dailyTaskCompletions[today] = (stats.dailyTaskCompletions[today] || 0) + 1;
  stats.lastActiveDate = today;
  
  // Update level
  stats.level = getLevelFromPoints(stats.totalPoints);
  const levelUp = stats.level > prevLevel;
  
  // Update streak and get streak badges
  const { streak, newBadges: streakBadges } = updateStreak();
  newBadges.push(...streakBadges);
  
  // Add streak bonus points
  if (streak.currentStreak > 0) {
    pointsEarned += POINTS_CONFIG.DAILY_STREAK;
    stats.totalPoints += POINTS_CONFIG.DAILY_STREAK;
    stats.level = getLevelFromPoints(stats.totalPoints);
  }
  
  // Check badges
  
  // Getting Started - first task
  if (stats.totalTasksCompleted === 1 && !stats.badgesEarned.includes("getting-started")) {
    newBadges.push("getting-started");
  }
  
  // Task Crusher - 50 tasks
  if (stats.totalTasksCompleted >= 50 && !stats.badgesEarned.includes("task-crusher")) {
    newBadges.push("task-crusher");
  }
  
  // Centurion - 100 tasks
  if (stats.totalTasksCompleted >= 100 && !stats.badgesEarned.includes("centurion")) {
    newBadges.push("centurion");
  }
  
  // Early Bird - before 8am
  if (hour < 8 && !stats.badgesEarned.includes("early-bird")) {
    newBadges.push("early-bird");
  }
  
  // Night Owl - after 10pm
  if (hour >= 22 && !stats.badgesEarned.includes("night-owl")) {
    newBadges.push("night-owl");
  }
  
  // Speed Demon - 10 tasks in one day
  if (stats.dailyTaskCompletions[today] >= 10 && !stats.badgesEarned.includes("speed-demon")) {
    newBadges.push("speed-demon");
  }
  
  // All-Rounder - all 4 subjects in one day
  const todaysTasks = tasks.filter(t => {
    const completionTime = stats.taskCompletionTimes.find(time => 
      time.startsWith(today) && t.completed
    );
    return completionTime !== undefined;
  });
  const subjectsToday = new Set(todaysTasks.map(t => t.subjectId));
  if (subjectsToday.size >= 4 && !stats.badgesEarned.includes("all-rounder")) {
    newBadges.push("all-rounder");
  }
  
  // Subject Master badges
  const subjectIds = ["math", "science", "history", "english"] as const;
  for (const subjectId of subjectIds) {
    const subjectTasks = tasks.filter(t => t.subjectId === subjectId);
    const allComplete = subjectTasks.every(t => t.completed);
    const badgeId = `subject-master-${subjectId}` as BadgeId;
    if (allComplete && !stats.badgesEarned.includes(badgeId)) {
      newBadges.push(badgeId);
    }
  }
  
  // Overachiever - all tasks complete
  const allComplete = tasks.every(t => t.completed);
  if (allComplete && !stats.badgesEarned.includes("overachiever")) {
    newBadges.push("overachiever");
  }
  
  // Add new badges to earned list
  for (const badge of newBadges) {
    if (!stats.badgesEarned.includes(badge)) {
      stats.badgesEarned.push(badge);
    }
  }
  
  saveUserStats(stats);
  
  return { stats, streak, newBadges, pointsEarned, levelUp };
}

export function checkGradeBadges(score: number): BadgeId[] {
  const stats = getUserStats();
  const newBadges: BadgeId[] = [];
  
  // Perfect Score
  if (score === 100 && !stats.badgesEarned.includes("perfect-score")) {
    newBadges.push("perfect-score");
    earnBadge("perfect-score");
  }
  
  // Honor Roll - check overall average
  const allGrades = getGrades().filter(g => g.score !== null);
  if (allGrades.length > 0) {
    const avg = allGrades.reduce((sum, g) => sum + (g.score || 0), 0) / allGrades.length;
    if (avg >= 90 && !stats.badgesEarned.includes("honor-roll")) {
      newBadges.push("honor-roll");
      earnBadge("honor-roll");
    }
  }
  
  return newBadges;
}

export function getOverallAverage(): number | null {
  const grades = getGrades().filter(g => g.score !== null);
  if (grades.length === 0) return null;
  return Math.round(grades.reduce((sum, g) => sum + (g.score || 0), 0) / grades.length);
}

export function getMostProductiveDay(): string | null {
  const stats = getUserStats();
  const days: Record<number, number> = {};
  
  stats.taskCompletionTimes.forEach(time => {
    const day = new Date(time).getDay();
    days[day] = (days[day] || 0) + 1;
  });
  
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let maxDay = -1;
  let maxCount = 0;
  
  for (const [day, count] of Object.entries(days)) {
    if (count > maxCount) {
      maxCount = count;
      maxDay = parseInt(day);
    }
  }
  
  return maxDay >= 0 ? dayNames[maxDay] : null;
}
