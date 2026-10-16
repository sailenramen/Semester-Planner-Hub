import { z } from "zod";

// User schema for authentication
export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const userRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Subject types
export type SubjectId = "math" | "science" | "history" | "english";

export const subjects: { id: SubjectId; name: string; color: string; bgColor: string; borderColor: string }[] = [
  { id: "math", name: "Math", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30", borderColor: "border-blue-500" },
  { id: "science", name: "Science/Biology", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30", borderColor: "border-green-500" },
  { id: "history", name: "History/Humanities", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30", borderColor: "border-red-500" },
  { id: "english", name: "English", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30", borderColor: "border-purple-500" },
];

// Task schema (removed fortnight)
export const taskSchema = z.object({
  id: z.string(),
  subjectId: z.enum(["math", "science", "history", "english"]),
  week: z.number().min(1).max(17),
  term: z.number().min(1).max(2),
  title: z.string(),
  description: z.string(),
  estimatedMinutes: z.number(),
  completed: z.boolean().default(false),
  dueDate: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

// Exam schema
export const examSchema = z.object({
  id: z.string(),
  subjectId: z.enum(["math", "science", "history", "english"]),
  title: z.string(),
  date: z.string(),
  week: z.number(),
  term: z.number().optional(),
  description: z.string().optional(),
});

export type Exam = z.infer<typeof examSchema>;

// Notes schema
export const noteSchema = z.object({
  id: z.string(),
  subjectId: z.enum(["math", "science", "history", "english"]),
  content: z.string(),
  updatedAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>;

// Study progress
export const progressSchema = z.object({
  subjectId: z.enum(["math", "science", "history", "english"]),
  completedTasks: z.number(),
  totalTasks: z.number(),
  weeklyProgress: z.array(z.number()),
});

export type Progress = z.infer<typeof progressSchema>;

// Grade schema for assessments
export const gradeSchema = z.object({
  subjectId: z.enum(["math", "science", "history", "english"]),
  assessmentId: z.string(),
  score: z.number().min(0).max(100).nullable(),
});

export type Grade = z.infer<typeof gradeSchema>;

// Assessment definitions by subject
export interface Assessment {
  id: string;
  name: string;
  term: number;
  category?: string; // e.g., "Chemistry", "Biology"
}

export const assessmentsBySubject: Record<string, Assessment[]> = {
  // Science is taught as Psychology this term.
  science: [
    { id: "sci-t4-sba1", name: "SBA 1: Reaction Time Practical", term: 4, category: "Psychology" },
    { id: "sci-t4-sba2", name: "SBA 2: Recall Practical", term: 4, category: "Psychology" },
    { id: "sci-t4-exam", name: "Semester 2 Examination", term: 4, category: "Psychology" },
  ],
  math: [
    { id: "math-t4-test", name: "Summative Topic Test", term: 4 },
    { id: "math-t4-project", name: "Measurement Project", term: 4 },
    { id: "math-t4-exam", name: "Semester 2 Exam", term: 4 },
  ],
  // History/Humanities is taught as Legal Studies this term.
  history: [
    { id: "hist-t4-test", name: "SBA 1: Legal Studies Topic Test", term: 4, category: "Legal Studies" },
    { id: "hist-t4-report", name: "SBA 2: Contemporary Legal Issues Report & Podcast", term: 4, category: "Legal Studies" },
    { id: "hist-t4-exam", name: "Semester 2 Exam", term: 4, category: "Legal Studies" },
  ],
  english: [
    { id: "eng-t4-test", name: "Poetry Analysis Topic Test", term: 4 },
    { id: "eng-t4-sba3", name: "SBA 3: Analytical Response to War Poetry", term: 4 },
    { id: "eng-t4-exam", name: "Semester 2 Exam", term: 4 },
  ],
};

// ===== Term 4, 2026 =====
// Term 4 runs from Tue 6 Oct 2026 to Thu 3 Dec 2026 and is 9 weeks long.
// Each teaching week starts on a Monday, so Week 1 starts Mon 5 Oct 2026.
export const TOTAL_WEEKS = 9;

/** The term students are working through in this build. */
export const CURRENT_TERM = 4;

/** Monday that Week 1 starts on (the first school day is the next day, Tue 6 Oct). */
export const TERM1_START = new Date(2026, 9, 5);
/** Last day of the term. */
export const TERM1_END = new Date(2026, 11, 3);

// Term 4 is one block of weeks, so the old Term 2 names point at the same range.
// They are kept so existing imports keep working.
export const TERM2_START = TERM1_START;
export const TERM2_END = TERM1_END;
export const SEMESTER_START = TERM1_START;
export const SEMESTER_END = TERM1_END;

/** Week 8 (23-26 Nov) is revision week. */
export const REVISION_WEEK = 8;
/** Week 9 (30 Nov - 3 Dec) is exam week. */
export const EXAM_WEEK = 9;
/** The semester exam period starts on Fri 27 Nov 2026. */
export const EXAM_PERIOD_START = new Date(2026, 10, 27);

/** Days with no school during Term 4 (YYYY-MM-DD). */
export const NON_SCHOOL_DAYS: { date: string; label: string }[] = [
  { date: "2026-11-02", label: "Curriculum Day" },
  { date: "2026-11-03", label: "Melbourne Cup Day" },
];

/** Formats a Date as YYYY-MM-DD using local time. */
export function formatDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Returns the non-school day details for a date, if it is one. */
export function getNonSchoolDay(date: Date | string): { date: string; label: string } | undefined {
  const key = typeof date === "string" ? date : formatDateKey(date);
  return NON_SCHOOL_DAYS.find((d) => d.date === key);
}

/** Short note for a week, e.g. "Revision" or "Exams". */
export function getWeekNote(week: number): string | null {
  if (week === REVISION_WEEK) return "Revision";
  if (week === EXAM_WEEK) return "Exams";
  return null;
}

// Helper to get current week (1-9)
export function getCurrentWeek(): number {
  const now = new Date();

  // Before the term starts, or after it has finished.
  if (now < TERM1_START) return 1;
  if (now > TERM1_END) return TOTAL_WEEKS;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.floor((today.getTime() - TERM1_START.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;

  return Math.min(Math.max(week, 1), TOTAL_WEEKS);
}

// Everyone is working through Term 4 for this build.
export function getCurrentTerm(): number {
  return CURRENT_TERM;
}

// Get week dates for a given week number (1-9). Weeks run Monday to Sunday.
export function getWeekDates(week: number): { start: Date; end: Date; term: number } {
  const start = new Date(TERM1_START);
  start.setDate(start.getDate() + (week - 1) * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return { start, end, term: CURRENT_TERM };
}

// Get term label for a week
export function getTermLabel(week: number): string {
  return `Term ${CURRENT_TERM}, Week ${week}`;
}

// Sample data generator with proper curriculum alignment
export function generateSampleTasks(): Task[] {
  const tasks: Task[] = [];
  const subjectIds: SubjectId[] = ["math", "science", "history", "english"];
  
  // Term 4 curriculum, one entry per teaching week (Weeks 1-9). Titles and
  // descriptions follow the Year 9 SAP Semester 2 Student Weekly Outline
  // (SWO) week by week. Science is taught as Psychology and History/Humanities
  // as Legal Studies this term.
  const mathTerm4 = [
    { title: "Sampling Technique & Bivariate Data", desc: "Chapter 9: understanding and interpreting the correlation between two sets of data" },
    { title: "Surface Area & Volume", desc: "Chapter 5: finding the surface area and volume of any 3D shape" },
    { title: "Geometric Transformation", desc: "Chapter 5: transforming 2D shapes by translation, rotation, reflection and enlargement; regular and semi-regular tessellation" },
    { title: "The Right-Angle Triangle", desc: "Chapter 7: trigonometric ratios, angles of elevation and depression, and bearings. Summative: Measurement project" },
    { title: "Properties of Circles & Circle Theorem 1", desc: "Chapter 7: arc length, sector perimeter and area, chord length and circle theorems" },
    { title: "Circle Theorem 2", desc: "Chapter 7: using circle theorems to find chord lengths; intersecting chord theorem. Summative: Topic test" },
    { title: "Revision", desc: "Revision of all Term 4 chapters before the examinations" },
    { title: "Revision Week", desc: "End of semester examinations - revision week (Mon 23 Nov - Thu 26 Nov)" },
    { title: "End of Semester Exams", desc: "Exam period (Fri 27 Nov - Thu 3 Dec)" },
  ];

  const psychologyTerm4 = [
    { title: "Intro to Psychology, Variables & Hypothesis", desc: "Branches of psychology; IV, DV, controlled and extraneous variables; hypothesis; correlation vs causation" },
    { title: "Regions of the Brain & Nervous Systems", desc: "Three brain regions and four cortical lobes; somatic and autonomic nervous systems" },
    { title: "Neurons & Neurotransmission", desc: "Neuron structure; neurotransmission; excitatory and inhibitory neurotransmitters. SBA 1: Reaction Time practical" },
    { title: "Memory, Schema & Sampling Methods", desc: "Atkinson-Shiffrin model; factors affecting recall; schema; convenience, random and stratified sampling" },
    { title: "Research Design & Ethics", desc: "Within- and between-subject designs; the seven ethical principles; historical unethical studies" },
    { title: "Biopsychosocial Model & First Nations Perspectives", desc: "Biopsychosocial model; wellbeing for Aboriginal and Torres Strait Islander peoples" },
    { title: "Memory & Biopsychosocial Assessment", desc: "Rehearsal practical and application questions. SBA 2: Rehearsal practical" },
    { title: "Revision Week", desc: "End of semester examinations - revision week (Mon 23 Nov - Thu 26 Nov)" },
    { title: "End of Semester Exams", desc: "Exam period (Fri 27 Nov - Thu 3 Dec)" },
  ];

  const legalStudiesTerm4 = [
    { title: "The Commonwealth Parliament", desc: "Constitutional monarchy, House of Representatives and Senate, specific, residual, exclusive and concurrent powers, rule of law (pp. 548-551)" },
    { title: "How Laws Are Made in Australia", desc: "Legislation, statutory authorities, common law and precedent (pp. 574-575)" },
    { title: "Principles of Australia's Legal System", desc: "Equality before the law, judicial independence, access to justice and Legal Aid (pp. 576-579). Report and podcast project launched" },
    { title: "Participants in the Legal System and Types of Legal Disputes", desc: "Roles of judges, lawyers, juries and police; criminal vs civil law; sanctions vs remedies (pp. 580-585). Topic test" },
    { title: "Court Jurisdictions and Court Hierarchy", desc: "Magistrates to the High Court, specialist courts and tribunals, appeals process (pp. 582-592). Project research week" },
    { title: "Courts and Tribunals and the Role of Courts in Making Laws", desc: "Precedent, statutory interpretation and judicial reasoning (pp. 592-596). Project drafting week" },
    { title: "Indigenous Rights and Comparative Legal Systems", desc: "Mabo v Queensland, Wik, Delgamuukw and the Waitangi Tribunal; mock trial. Report and podcast due Fri 13 Nov" },
    { title: "Revision Week", desc: "End of semester examinations - revision week (Mon 23 Nov - Thu 26 Nov)" },
    { title: "End of Semester Exams", desc: "Exam period (Fri 27 Nov - Thu 3 Dec)" },
  ];

  const englishTerm4 = [
    { title: "Close Analysis: Symbolism & Form", desc: "Analysing symbolism, structure and poetic form in war poetry" },
    { title: "Comparative Study I", desc: "Comparing power, patriotism and resistance across poems" },
    { title: "Comparative Study II", desc: "Contrasting perspectives on trauma, memory and moral responsibility" },
    { title: "Developing Analytical Skills", desc: "Thesis development, integrating quotations, structuring comparative paragraphs" },
    { title: "Exam-Style Writing & Topic Test", desc: "Timed responses to prompts. Poetry analysis topic test" },
    { title: "Drafting & Feedback", desc: "Drafting a full analytical response with teacher feedback. SBA 3" },
    { title: "Refining the Analytical Response", desc: "Completing the War Poetry analytical response. SBA 3" },
    { title: "Revision Week", desc: "Revision for the end of semester examinations" },
    { title: "End of Semester Exams", desc: "Exam period (Fri 27 Nov - Thu 3 Dec)" },
  ];

  const curriculumBySubject: Record<SubjectId, { term4: { title: string; desc: string }[] }> = {
    math: { term4: mathTerm4 },
    science: { term4: psychologyTerm4 },
    history: { term4: legalStudiesTerm4 },
    english: { term4: englishTerm4 },
  };

  for (const subjectId of subjectIds) {
    const curriculum = curriculumBySubject[subjectId];
    
    // Term 4 is a single 9-week block, so there is one task per teaching week.
    for (let week = 1; week <= TOTAL_WEEKS; week++) {
      const { start } = getWeekDates(week);
      const topic = curriculum.term4[week - 1];

      tasks.push({
        id: `${subjectId}-week${week}`,
        subjectId,
        week,
        term: CURRENT_TERM,
        title: topic.title,
        description: topic.desc,
        estimatedMinutes: Math.floor(Math.random() * 30) + 45,
        completed: false,
        dueDate: formatDateKey(start),
      });
    }
  }
  
  return tasks;
}

export function generateSampleExams(): Exam[] {
  const getExamDate = (week: number, dayOffset: number = 0): string => {
    const { start } = getWeekDates(week);
    start.setDate(start.getDate() + dayOffset);
    return formatDateKey(start);
  };

  return [
    // Semester 2 exams (Week 9). The dates are placeholders - edit them in the
    // Calendar by opening the exam day and changing the date.
    { id: "exam-math-4", subjectId: "math", title: "Maths Semester Exam", date: getExamDate(EXAM_WEEK, 0), week: EXAM_WEEK, term: CURRENT_TERM, description: "Semester 2 exam - date and time TBC" },
    { id: "exam-science-4", subjectId: "science", title: "Science Semester Exam", date: getExamDate(EXAM_WEEK, 1), week: EXAM_WEEK, term: CURRENT_TERM, description: "Semester 2 exam - date and time TBC" },
    { id: "exam-history-4", subjectId: "history", title: "Humanities Semester Exam", date: getExamDate(EXAM_WEEK, 2), week: EXAM_WEEK, term: CURRENT_TERM, description: "Semester 2 exam - date and time TBC" },
    { id: "exam-english-4", subjectId: "english", title: "English Semester Exam", date: getExamDate(EXAM_WEEK, 3), week: EXAM_WEEK, term: CURRENT_TERM, description: "Semester 2 exam - date and time TBC" },
  ];
}

// Gamification types

// Badge definitions
export type BadgeId = 
  | "getting-started" | "week-warrior" | "two-weeks-strong" | "month-master" | "century-club"
  | "task-crusher" | "centurion" | "perfect-score" | "honor-roll" | "early-bird" | "night-owl"
  | "speed-demon" | "subject-master-math" | "subject-master-science" | "subject-master-history" | "subject-master-english"
  | "all-rounder" | "time-lord" | "overachiever";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  category: "streak" | "tasks" | "grades" | "time" | "special";
}

export const badges: Badge[] = [
  { id: "getting-started", name: "Getting Started", description: "Complete your first task", icon: "Target", requirement: "Complete 1 task", category: "tasks" },
  { id: "week-warrior", name: "Week Warrior", description: "Maintain a 7 day streak", icon: "Flame", requirement: "7 day streak", category: "streak" },
  { id: "two-weeks-strong", name: "Two Weeks Strong", description: "Maintain a 14 day streak", icon: "Zap", requirement: "14 day streak", category: "streak" },
  { id: "month-master", name: "Month Master", description: "Maintain a 30 day streak", icon: "Star", requirement: "30 day streak", category: "streak" },
  { id: "century-club", name: "Century Club", description: "Reach a 100 day streak", icon: "Crown", requirement: "100 day streak", category: "streak" },
  { id: "task-crusher", name: "Task Crusher", description: "Complete 50 tasks", icon: "Zap", requirement: "50 tasks completed", category: "tasks" },
  { id: "centurion", name: "Centurion", description: "Complete 100 tasks", icon: "Trophy", requirement: "100 tasks completed", category: "tasks" },
  { id: "perfect-score", name: "Perfect Score", description: "Get 100% on any assessment", icon: "Award", requirement: "100% on assessment", category: "grades" },
  { id: "honor-roll", name: "Honor Roll", description: "Maintain 90%+ average", icon: "Scroll", requirement: "90%+ overall average", category: "grades" },
  { id: "early-bird", name: "Early Bird", description: "Complete a task before 8am", icon: "Sunrise", requirement: "Task before 8am", category: "time" },
  { id: "night-owl", name: "Night Owl", description: "Complete a task after 10pm", icon: "Moon", requirement: "Task after 10pm", category: "time" },
  { id: "speed-demon", name: "Speed Demon", description: "Complete 10 tasks in one day", icon: "Rocket", requirement: "10 tasks in a day", category: "special" },
  { id: "subject-master-math", name: "Math Master", description: "Complete all Math tasks", icon: "Calculator", requirement: "All Math tasks", category: "tasks" },
  { id: "subject-master-science", name: "Science Master", description: "Complete all Science tasks", icon: "FlaskConical", requirement: "All Science tasks", category: "tasks" },
  { id: "subject-master-history", name: "History Master", description: "Complete all History tasks", icon: "BookOpen", requirement: "All History tasks", category: "tasks" },
  { id: "subject-master-english", name: "English Master", description: "Complete all English tasks", icon: "PenTool", requirement: "All English tasks", category: "tasks" },
  { id: "all-rounder", name: "All-Rounder", description: "Complete tasks in all 4 subjects in one day", icon: "GraduationCap", requirement: "All subjects in a day", category: "special" },
  { id: "time-lord", name: "Time Lord", description: "Study for 25+ hours total", icon: "Clock", requirement: "25 hours studied", category: "time" },
  { id: "overachiever", name: "Overachiever", description: "Complete all semester tasks", icon: "Medal", requirement: "All tasks complete", category: "special" },
];

export const streakSchema = z.object({
  currentStreak: z.number().default(0),
  longestStreak: z.number().default(0),
  lastStudyDate: z.string().nullable().default(null),
  lastActiveDate: z.string().nullable().default(null),
  lastCheckDate: z.string().nullable().default(null),
  streakFreezes: z.number().default(2),
  freezesUsedThisMonth: z.number().default(0),
  freezeDaysRemaining: z.number().default(2),
  lastFreezeMonth: z.number().nullable().default(null),
});

export type Streak = z.infer<typeof streakSchema>;

export const userStatsSchema = z.object({
  totalPoints: z.number().default(0),
  totalStudyMinutes: z.number().default(0),
  totalTasksCompleted: z.number().default(0),
  totalPomodoroSessions: z.number().default(0),
  badgesEarned: z.array(z.string()).default([]),
  dailyTaskCompletions: z.record(z.string(), z.number()).default({}),
  taskCompletionTimes: z.array(z.string()).default([]),
  subjectStudyMinutes: z.record(z.string(), z.number()).default({}),
  level: z.number().default(1),
  lastActiveDate: z.string().nullable().default(null),
  showcasedBadges: z.array(z.string()).default([]),
});

export const avatarSettingsSchema = z.object({
  baseColor: z.string().default("blue"),
  accentColor: z.string().default("purple"),
  style: z.enum(["default", "rounded", "hexagon"]).default("default"),
  accessory: z.string().nullable().default(null),
});

export type AvatarSettings = z.infer<typeof avatarSettingsSchema>;

export const AVATAR_COLORS = [
  { id: "blue", primary: "#3B82F6", secondary: "#1D4ED8" },
  { id: "purple", primary: "#8B5CF6", secondary: "#6D28D9" },
  { id: "green", primary: "#10B981", secondary: "#059669" },
  { id: "orange", primary: "#F97316", secondary: "#EA580C" },
  { id: "pink", primary: "#EC4899", secondary: "#DB2777" },
  { id: "teal", primary: "#14B8A6", secondary: "#0D9488" },
  { id: "red", primary: "#EF4444", secondary: "#DC2626" },
  { id: "yellow", primary: "#EAB308", secondary: "#CA8A04" },
] as const;

export const AVATAR_STYLES = ["default", "rounded", "hexagon"] as const;

export const AVATAR_ACCESSORIES: { id: string; name: string; minLevel: number }[] = [
  { id: "none", name: "None", minLevel: 1 },
  { id: "crown", name: "Crown", minLevel: 5 },
  { id: "halo", name: "Halo", minLevel: 10 },
  { id: "flame", name: "Flame Aura", minLevel: 15 },
  { id: "stars", name: "Stars", minLevel: 20 },
  { id: "lightning", name: "Lightning", minLevel: 25 },
  { id: "diamond", name: "Diamond", minLevel: 30 },
];

export type UserStats = z.infer<typeof userStatsSchema>;

// Points configuration
export const POINTS_CONFIG = {
  TASK_COMPLETE: 10,
  TASK_WITH_QUESTIONS: 25,
  DAILY_STREAK: 5,
  POMODORO_SESSION: 15,
  GRADE_A: 100,
  GRADE_B: 75,
  GRADE_IMPROVEMENT: 50,
};

// Level thresholds
export function getLevelFromPoints(points: number): number {
  if (points < 100) return 1;
  if (points < 250) return 2;
  if (points < 500) return 3;
  if (points < 1000) return 4;
  if (points < 2000) return 5;
  if (points < 3500) return 6;
  if (points < 5500) return 7;
  if (points < 8000) return 8;
  if (points < 11000) return 9;
  if (points < 15000) return 10;
  // Every 5000 points after level 10
  return 10 + Math.floor((points - 15000) / 5000);
}

export function getPointsForNextLevel(level: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000];
  if (level < 10) return thresholds[level];
  return 15000 + (level - 10) * 5000;
}

// Database tables using Drizzle ORM
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Users table
export const usersTable = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks table
export const tasksTable = pgTable("tasks", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  subjectId: text("subject_id").notNull(),
  week: integer("week").notNull(),
  term: integer("term").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  estimatedMinutes: integer("estimated_minutes").notNull(),
  completed: boolean("completed").default(false).notNull(),
  dueDate: text("due_date").notNull(),
});

// Notes table
export const notesTable = pgTable("notes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  subjectId: text("subject_id").notNull(),
  content: text("content").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exams table
export const examsTable = pgTable("exams", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  subjectId: text("subject_id").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  week: integer("week").notNull(),
  term: integer("term"),
  description: text("description"),
});

// Grades table
export const gradesTable = pgTable("grades", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  subjectId: text("subject_id").notNull(),
  assessmentId: text("assessment_id").notNull(),
  score: integer("score"),
});

// User Stats table
export const userStatsTable = pgTable("user_stats", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id).unique(),
  totalPoints: integer("total_points").default(0).notNull(),
  totalStudyMinutes: integer("total_study_minutes").default(0).notNull(),
  totalTasksCompleted: integer("total_tasks_completed").default(0).notNull(),
  totalPomodoroSessions: integer("total_pomodoro_sessions").default(0).notNull(),
  level: integer("level").default(1).notNull(),
  badgesEarned: jsonb("badges_earned").default([]).notNull(),
  dailyTaskCompletions: jsonb("daily_task_completions").default({}).notNull(),
  taskCompletionTimes: jsonb("task_completion_times").default([]).notNull(),
  subjectStudyMinutes: jsonb("subject_study_minutes").default({}).notNull(),
  lastActiveDate: text("last_active_date"),
  showcasedBadges: jsonb("showcased_badges").default([]).notNull(),
});

// Streaks table
export const streaksTable = pgTable("streaks", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id).unique(),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastStudyDate: text("last_study_date"),
  lastActiveDate: text("last_active_date"),
  lastCheckDate: text("last_check_date"),
  streakFreezes: integer("streak_freezes").default(2).notNull(),
  freezesUsedThisMonth: integer("freezes_used_this_month").default(0).notNull(),
  freezeDaysRemaining: integer("freeze_days_remaining").default(2).notNull(),
  lastFreezeMonth: integer("last_freeze_month"),
});

// Avatar Settings table
export const avatarSettingsTable = pgTable("avatar_settings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id).unique(),
  baseColor: text("base_color").default("blue").notNull(),
  accentColor: text("accent_color").default("purple").notNull(),
  style: text("style").default("default").notNull(),
  accessory: text("accessory"),
});

// Custom Todos table
export const customTodosTable = pgTable("custom_todos", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  date: text("date").notNull(),
  title: text("title").notNull(),
  completed: boolean("completed").default(false).notNull(),
});

// Study Time table
export const studyTimeTable = pgTable("study_time", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  date: text("date").notNull(),
  hours: integer("hours").default(0).notNull(),
});

// Day Notes table
export const dayNotesTable = pgTable("day_notes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id),
  date: text("date").notNull(),
  content: text("content").notNull(),
});

// Weekly Goal table
export const weeklyGoalTable = pgTable("weekly_goals", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => usersTable.id).unique(),
  hours: integer("hours").default(10).notNull(),
});

// Insert schemas
export const insertUserDbSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true });
export const insertNoteDbSchema = createInsertSchema(notesTable).omit({ id: true, updatedAt: true });
export const insertExamDbSchema = createInsertSchema(examsTable).omit({ id: true });
export const insertGradeDbSchema = createInsertSchema(gradesTable).omit({ id: true });

// Infer types from tables
export type DbUser = typeof usersTable.$inferSelect;
export type DbTask = typeof tasksTable.$inferSelect;
export type DbNote = typeof notesTable.$inferSelect;
export type DbExam = typeof examsTable.$inferSelect;
export type DbGrade = typeof gradesTable.$inferSelect;
export type DbUserStats = typeof userStatsTable.$inferSelect;
export type DbStreak = typeof streaksTable.$inferSelect;
export type DbAvatarSettings = typeof avatarSettingsTable.$inferSelect;
export type DbCustomTodo = typeof customTodosTable.$inferSelect;
export type DbStudyTime = typeof studyTimeTable.$inferSelect;
export type DbDayNote = typeof dayNotesTable.$inferSelect;
export type DbWeeklyGoal = typeof weeklyGoalTable.$inferSelect;
