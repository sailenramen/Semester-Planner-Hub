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
  science: [
    { id: "sci-t1-atomic", name: "Atomic Model Project", term: 1, category: "Chemistry" },
    { id: "sci-t1-reactions", name: "Chemical Reactions Practical Report", term: 1, category: "Chemistry" },
    { id: "sci-t1-exam", name: "Semester Exam", term: 1, category: "Chemistry" },
    { id: "sci-t2-homeostasis", name: "Homeostasis Project", term: 2, category: "Biology" },
    { id: "sci-t2-exam", name: "Semester Exam", term: 2, category: "Biology" },
  ],
  math: [
    { id: "math-t1-investigation", name: "Investigation", term: 1 },
    { id: "math-t1-test", name: "Topic Test", term: 1 },
    { id: "math-t1-exam", name: "Semester Exam", term: 1 },
    { id: "math-t2-test", name: "Topic Test", term: 2 },
    { id: "math-t2-project", name: "Project", term: 2 },
  ],
  history: [
    { id: "hist-t1-inquiry", name: "Historical Inquiry Project", term: 1, category: "History" },
    { id: "hist-t1-source", name: "Source Analysis", term: 1, category: "History" },
    { id: "hist-t1-exam", name: "Semester Exam", term: 1, category: "History" },
    { id: "hist-t2-citizenship", name: "Global Citizenship Project", term: 2, category: "Politics" },
    { id: "hist-t2-test", name: "Politics Topic Test", term: 2, category: "Politics" },
    { id: "hist-t2-exam", name: "SAP Semester Exam", term: 2, category: "Politics" },
  ],
  english: [
    { id: "eng-t1-news", name: "News Article Analysis", term: 1 },
    { id: "eng-t1-content", name: "Content Test", term: 1 },
    { id: "eng-t1-campaign", name: "Campaign Presentation", term: 1 },
    { id: "eng-t1-exam-a", name: "Exam Section A", term: 1 },
    { id: "eng-t1-exam-b", name: "Exam Section B", term: 1 },
    { id: "eng-t2-animal", name: "Animal Farm Response", term: 2 },
    { id: "eng-t2-conventions", name: "Conventions Test", term: 2 },
    { id: "eng-t2-exam", name: "Semester Exam", term: 2 },
  ],
};

// Semester structure:
// Term 1: 9 weeks (Jan 25 - Mar 28)
// 2 week break
// Term 2: 8 weeks (Apr 12 - Jun 6), last week is exams
// Total: 17 weeks of content

function getSemesterDates() {
  const now = new Date();
  const year = now.getFullYear();
  
  // Term 1 starts Jan 25 (Sunday)
  const term1Start = new Date(year, 0, 25); // January 25
  const term1End = new Date(year, 2, 28); // March 28 (end of week 9)
  
  // Term 2 starts Apr 12
  const term2Start = new Date(year, 3, 12); // April 12
  const term2End = new Date(year, 5, 6); // June 6 (end of week 8/17)
  
  return { 
    term1Start, 
    term1End, 
    term2Start, 
    term2End,
    semesterStart: term1Start,
    semesterEnd: term2End
  };
}

const dates = getSemesterDates();
export const TERM1_START = dates.term1Start;
export const TERM1_END = dates.term1End;
export const TERM2_START = dates.term2Start;
export const TERM2_END = dates.term2End;
export const SEMESTER_START = dates.semesterStart;
export const SEMESTER_END = dates.semesterEnd;

export const TOTAL_WEEKS = 17; // 9 weeks Term 1 + 8 weeks Term 2

// Helper to get current week (1-17)
export function getCurrentWeek(): number {
  const now = new Date();
  
  // Check if in Term 1
  if (now >= TERM1_START && now <= TERM1_END) {
    const diffTime = now.getTime() - TERM1_START.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(Math.floor(diffDays / 7) + 1, 9);
  }
  
  // Check if in break between terms
  if (now > TERM1_END && now < TERM2_START) {
    return 9; // Still show as end of Term 1
  }
  
  // Check if in Term 2
  if (now >= TERM2_START && now <= TERM2_END) {
    const diffTime = now.getTime() - TERM2_START.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(9 + Math.floor(diffDays / 7) + 1, 17);
  }
  
  // Before Term 1 starts
  if (now < TERM1_START) {
    return 1;
  }
  
  // After Term 2 ends
  return 17;
}

// Get which term we're in (1 or 2)
export function getCurrentTerm(): number {
  const week = getCurrentWeek();
  return week <= 9 ? 1 : 2;
}

// Get week dates for a given week number (1-17)
export function getWeekDates(week: number): { start: Date; end: Date; term: number } {
  let start: Date;
  let term: number;
  
  if (week <= 9) {
    // Term 1
    term = 1;
    start = new Date(TERM1_START);
    start.setDate(start.getDate() + (week - 1) * 7);
  } else {
    // Term 2
    term = 2;
    start = new Date(TERM2_START);
    start.setDate(start.getDate() + (week - 10) * 7);
  }
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  
  return { start, end, term };
}

// Get term label for a week
export function getTermLabel(week: number): string {
  if (week <= 9) {
    return `Term 1, Week ${week}`;
  } else {
    return `Term 2, Week ${week - 9}`;
  }
}

// Sample data generator with proper curriculum alignment
export function generateSampleTasks(): Task[] {
  const tasks: Task[] = [];
  const subjectIds: SubjectId[] = ["math", "science", "history", "english"];
  
  // Math curriculum - Term 1 (weeks 1-9)
  // Matches reading: Problem solving, exponents, units, surds, absolute value, patterns, coordinate geometry, linear equations
  const mathTerm1 = [
    { title: "Problem Solving & Real Numbers", desc: "Polya's problem solving steps and the real number system" },
    { title: "Laws of Exponents", desc: "Index laws for multiplying, dividing, and raising powers" },
    { title: "Units & Measurements", desc: "Metric conversions and compound measures" },
    { title: "Surds & Radicals", desc: "Simplifying surds and rationalising denominators" },
    { title: "Absolute Value", desc: "Solving absolute value equations and inequalities" },
    { title: "Patterns & Generalisations", desc: "Finding patterns and writing algebraic rules" },
    { title: "NAPLAN Preparation", desc: "Review of number, algebra, measurement, and statistics" },
    { title: "Coordinate Geometry", desc: "Distance, midpoint, and gradient formulas" },
    { title: "Linear Equations & Systems", desc: "Solving linear equations and simultaneous equations" },
  ];
  
  // Math curriculum - Term 2 (weeks 10-17)
  // Matches reading: Algebra review, relations/functions, quadratics, sequences, formulas, proportion
  const mathTerm2 = [
    { title: "Algebra Review", desc: "Consolidating algebraic skills and techniques" },
    { title: "Relations & Functions", desc: "Understanding domain, range, and function notation" },
    { title: "Quadratic Expressions", desc: "Expanding, factorising, and completing the square" },
    { title: "Quadratic Graphs", desc: "Graphing parabolas and key features in different forms" },
    { title: "Quadratic Equations", desc: "Solving using factorisation and the quadratic formula" },
    { title: "Sequences", desc: "Arithmetic and geometric sequences" },
    { title: "Formulas & Proportion", desc: "Rearranging formulas and direct/inverse proportion" },
    { title: "Semester Exam Preparation", desc: "Comprehensive revision for semester exams" },
  ];
  
  // Science curriculum - Term 1 (Chemistry focus)
  // Matches reading: Atomic structure, isotopes, radioactivity, chemical reactions
  const scienceTerm1 = [
    { title: "Atomic Structure", desc: "History of atomic theory and parts of the atom" },
    { title: "Isotopes & Radioactivity", desc: "Isotopes, radioactive decay, and types of radiation" },
    { title: "Half-Life & Applications", desc: "Calculating half-life and uses of radioisotopes" },
    { title: "Atomic Model Project", desc: "Consolidating atomic structure understanding" },
    { title: "Chemical Reactions", desc: "Signs of reactions and balancing equations" },
    { title: "Types of Reactions", desc: "Synthesis, decomposition, combustion, neutralisation" },
    { title: "Electrolysis", desc: "Using electricity to decompose compounds" },
    { title: "Green Chemistry", desc: "Environmental impact and sustainable chemistry" },
    { title: "Chemistry Review", desc: "Review of all chemistry topics" },
  ];
  
  // Science curriculum - Term 2 (Biology focus)
  // Matches reading: Homeostasis, endocrine system, diseases, immune system
  const scienceTerm2 = [
    { title: "Endocrine System", desc: "Hormones, glands, and chemical regulation" },
    { title: "Homeostasis", desc: "Maintaining stable internal environment" },
    { title: "Blood Glucose Regulation", desc: "Insulin, glucagon, and diabetes" },
    { title: "Infectious Diseases", desc: "Pathogens and how diseases spread" },
    { title: "The Immune System", desc: "Defence mechanisms and immune response" },
    { title: "Vaccines & Immunity", desc: "How vaccines work and herd immunity" },
    { title: "Term 2 Revision", desc: "Review of all biology topics" },
    { title: "Semester Exam Preparation", desc: "Comprehensive revision for semester exams" },
  ];
  
  // History curriculum - Term 1 (Australians at War)
  // Matches reading: WWI causes, Gallipoli, Western Front, interwar period, WWII
  const historyTerm1 = [
    { title: "WWI Causes & Outbreak", desc: "MAIN causes and the assassination of Franz Ferdinand" },
    { title: "Gallipoli & ANZAC Legend", desc: "The campaign and birth of Australian national identity" },
    { title: "Western Front", desc: "Trench warfare and Australian battles in France" },
    { title: "Interwar Period", desc: "Treaty of Versailles, Great Depression, rise of fascism" },
    { title: "WWII Outbreak", desc: "Hitler's aggression and Australia's early involvement" },
    { title: "Australian Home Front", desc: "Rationing, women's roles, and Indigenous service" },
    { title: "The Holocaust", desc: "Persecution, genocide, and human rights" },
    { title: "Source Analysis Skills", desc: "OPCL method and evaluating historical sources" },
    { title: "Legacy & Remembrance", desc: "ANZAC Day, Remembrance Day, and reflection" },
  ];
  
  // History curriculum - Term 2 (Politics/Civics)
  // Matches reading: Australian democracy, Constitution, Parliament, parties, citizenship, global
  const historyTerm2 = [
    { title: "Australian Democracy", desc: "Federation, Constitution, and division of powers" },
    { title: "Parliament & Law-Making", desc: "How Parliament works and laws are made" },
    { title: "Political Parties & Media", desc: "Parties, interest groups, and media influence" },
    { title: "Citizenship & Rights", desc: "Citizen rights, responsibilities, and values" },
    { title: "Influencing Decisions", desc: "Citizen action and global citizenship" },
    { title: "International Relationships", desc: "Australia's alliances and global engagement" },
    { title: "Contemporary Issues", desc: "Analysing current political issues" },
    { title: "Semester Exam Preparation", desc: "Review and exam preparation" },
  ];
  
  // English curriculum - Term 1 (News Article Analysis)
  // Matches reading: News analysis, rationale, message, persuasive techniques
  const englishTerm1 = [
    { title: "Introduction to News Analysis", desc: "Understanding news articles and their structure" },
    { title: "Rationale & Message", desc: "Identifying purpose and main argument in news" },
    { title: "Persuasive Techniques", desc: "Ethos, pathos, logos in news writing" },
    { title: "Visual Elements in News", desc: "Analysing headlines, images, and layout" },
    { title: "Comparing News Coverage", desc: "How different sources cover the same story" },
    { title: "News Analysis Assessment", desc: "Preparing for the news article analysis task" },
    { title: "Political Campaign Presentation", desc: "Creating and delivering persuasive presentations" },
    { title: "Presentation & Feedback", desc: "Delivering presentations and peer feedback" },
    { title: "Term 1 Review", desc: "Consolidating news analysis skills" },
  ];
  
  // English curriculum - Term 2 (1984 Novel Study)
  // Matches reading: 1984 by George Orwell - dystopia, power, control
  const englishTerm2 = [
    { title: "1984: Dystopia & Context", desc: "Introduction to Orwell and dystopian genre" },
    { title: "1984: Oceania & the Party", desc: "The setting, Party structure, and Winston" },
    { title: "1984: Propaganda & Rebellion", desc: "Two Minutes Hate, Newspeak, and Winston's rebellion" },
    { title: "1984: Love & Betrayal", desc: "Winston and Julia, O'Brien, and the Brotherhood" },
    { title: "1984: Room 101 & Ending", desc: "Winston's defeat and the novel's conclusion" },
    { title: "Themes & Techniques", desc: "Analysing Orwell's major themes and literary techniques" },
    { title: "Term 2 Revision", desc: "Review of 1984 and essay writing skills" },
    { title: "Semester Exam Preparation", desc: "Practice essays and revision strategies" },
  ];
  
  const curriculumBySubject: Record<SubjectId, { term1: typeof mathTerm1; term2: typeof mathTerm2 }> = {
    math: { term1: mathTerm1, term2: mathTerm2 },
    science: { term1: scienceTerm1, term2: scienceTerm2 },
    history: { term1: historyTerm1, term2: historyTerm2 },
    english: { term1: englishTerm1, term2: englishTerm2 },
  };

  for (const subjectId of subjectIds) {
    const curriculum = curriculumBySubject[subjectId];
    
    // Term 1 tasks (weeks 1-9)
    for (let i = 0; i < 9; i++) {
      const week = i + 1;
      const { start } = getWeekDates(week);
      const topic = curriculum.term1[i];
      
      tasks.push({
        id: `${subjectId}-week${week}`,
        subjectId,
        week,
        term: 1,
        title: topic.title,
        description: topic.desc,
        estimatedMinutes: Math.floor(Math.random() * 30) + 45,
        completed: false,
        dueDate: start.toISOString().split('T')[0],
      });
    }
    
    // Term 2 tasks (weeks 10-17)
    for (let i = 0; i < 8; i++) {
      const week = i + 10;
      const { start } = getWeekDates(week);
      const topic = curriculum.term2[i];
      
      tasks.push({
        id: `${subjectId}-week${week}`,
        subjectId,
        week,
        term: 2,
        title: topic.title,
        description: topic.desc,
        estimatedMinutes: Math.floor(Math.random() * 30) + 45,
        completed: false,
        dueDate: start.toISOString().split('T')[0],
      });
    }
  }
  
  return tasks;
}

export function generateSampleExams(): Exam[] {
  const getExamDate = (week: number, dayOffset: number = 0): string => {
    const { start } = getWeekDates(week);
    start.setDate(start.getDate() + dayOffset);
    return start.toISOString().split('T')[0];
  };

  return [
    // Term 1 Tests (Week 9)
    { id: "exam-math-1", subjectId: "math", title: "Math Term 1 Test", date: getExamDate(9, 1), week: 9, term: 1, description: "Covers linear equations, graphs, and trigonometry basics" },
    { id: "exam-science-1", subjectId: "science", title: "Science Term 1 Test", date: getExamDate(9, 2), week: 9, term: 1, description: "Covers cells, genetics, and evolution" },
    { id: "exam-history-1", subjectId: "history", title: "History Term 1 Test", date: getExamDate(9, 3), week: 9, term: 1, description: "WWI, WWII origins and key events" },
    { id: "exam-english-1", subjectId: "english", title: "English Term 1 Test", date: getExamDate(9, 4), week: 9, term: 1, description: "Novel study and essay writing" },
    
    // Semester Exams (Week 17 - last week of Term 2)
    { id: "exam-math-2", subjectId: "math", title: "Math Semester Exam", date: getExamDate(17, 0), week: 17, term: 2, description: "Comprehensive exam covering all semester topics" },
    { id: "exam-science-2", subjectId: "science", title: "Science Semester Exam", date: getExamDate(17, 1), week: 17, term: 2, description: "Comprehensive exam covering all semester topics" },
    { id: "exam-history-2", subjectId: "history", title: "History Semester Exam", date: getExamDate(17, 2), week: 17, term: 2, description: "Comprehensive exam covering all semester topics" },
    { id: "exam-english-2", subjectId: "english", title: "English Semester Exam", date: getExamDate(17, 3), week: 17, term: 2, description: "Essay and textual analysis exam" },
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
