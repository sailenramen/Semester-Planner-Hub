import { Task, Note, generateSampleTasks, generateSampleExams, Exam, TERM1_START, Grade } from "@shared/schema";

const STORAGE_KEYS = {
  TASKS: "study-planner-tasks",
  NOTES: "study-planner-notes",
  EXAMS: "study-planner-exams",
  EXAM_MODE: "study-planner-exam-mode",
  THEME: "study-planner-theme",
  SEMESTER_VERSION: "study-planner-semester-version",
  GRADES: "study-planner-grades",
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
