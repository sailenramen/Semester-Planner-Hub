import { z } from "zod";

// Subject types
export type SubjectId = "math" | "science" | "history" | "english";

export const subjects: { id: SubjectId; name: string; color: string; bgColor: string; borderColor: string }[] = [
  { id: "math", name: "Math", color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30", borderColor: "border-blue-500" },
  { id: "science", name: "Science/Biology", color: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30", borderColor: "border-green-500" },
  { id: "history", name: "History/Humanities", color: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-900/30", borderColor: "border-red-500" },
  { id: "english", name: "English", color: "text-purple-600 dark:text-purple-400", bgColor: "bg-purple-100 dark:bg-purple-900/30", borderColor: "border-purple-500" },
];

// Task schema
export const taskSchema = z.object({
  id: z.string(),
  subjectId: z.enum(["math", "science", "history", "english"]),
  week: z.number().min(1).max(16),
  fortnight: z.number().min(1).max(8),
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

// Semester dates (Feb - May 2025, 16 weeks)
export const SEMESTER_START = new Date("2025-02-03");
export const SEMESTER_END = new Date("2025-05-23");

// Helper to get current week/fortnight
export function getCurrentWeek(): number {
  const now = new Date();
  const diffTime = now.getTime() - SEMESTER_START.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return Math.min(Math.max(week, 1), 16);
}

export function getCurrentFortnight(): number {
  return Math.ceil(getCurrentWeek() / 2);
}

export function getWeekDates(week: number): { start: Date; end: Date } {
  const start = new Date(SEMESTER_START);
  start.setDate(start.getDate() + (week - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

// Sample data generator
export function generateSampleTasks(): Task[] {
  const tasks: Task[] = [];
  const subjectIds: SubjectId[] = ["math", "science", "history", "english"];
  
  const mathTopics = [
    "Linear equations review", "Quadratic equations introduction", "Graphing parabolas",
    "Factoring quadratics", "Completing the square", "Quadratic formula", 
    "Problem solving with quadratics", "Indices and surds", "Algebraic fractions",
    "Simultaneous equations", "Linear inequalities", "Probability basics",
    "Statistics and data", "Trigonometry intro", "Pythagoras theorem", "Exam revision"
  ];
  
  const scienceTopics = [
    "Cell structure", "Mitosis and meiosis", "DNA and genetics", "Heredity patterns",
    "Evolution theory", "Natural selection", "Ecosystems", "Food webs",
    "Human body systems", "Digestive system", "Circulatory system", "Respiratory system",
    "Chemical reactions", "Acids and bases", "Energy transfer", "Exam revision"
  ];
  
  const historyTopics = [
    "World War I causes", "Trench warfare", "Treaty of Versailles", "Rise of fascism",
    "Great Depression", "World War II outbreak", "Holocaust studies", "Pacific War",
    "Cold War beginnings", "Civil rights movement", "Decolonization", "Modern conflicts",
    "Australian history", "Indigenous perspectives", "Migration history", "Exam revision"
  ];
  
  const englishTopics = [
    "Novel study introduction", "Character analysis", "Theme exploration", "Literary devices",
    "Essay structure", "Persuasive writing", "Creative writing", "Poetry analysis",
    "Film study", "Media analysis", "Oral presentation prep", "Research skills",
    "Comparative essay", "Textual analysis", "Revision strategies", "Exam revision"
  ];

  const topicsBySubject: Record<SubjectId, string[]> = {
    math: mathTopics,
    science: scienceTopics,
    history: historyTopics,
    english: englishTopics,
  };

  const descriptions: Record<SubjectId, string[]> = {
    math: [
      "Practice solving equations with variables on both sides",
      "Learn the standard form and vertex form of quadratic equations",
      "Plot parabolas and identify key features (vertex, axis of symmetry)",
      "Factor expressions using various methods",
      "Master completing the square technique",
      "Apply the quadratic formula to solve equations",
      "Solve real-world problems using quadratic equations",
      "Simplify expressions with indices and surds",
      "Add, subtract, and multiply algebraic fractions",
      "Solve systems of two linear equations",
      "Graph and solve linear inequalities",
      "Calculate probabilities for compound events",
      "Analyze data using mean, median, mode, and range",
      "Learn sine, cosine, and tangent ratios",
      "Apply Pythagoras theorem to find unknown sides",
      "Complete practice exams and review key concepts",
    ],
    science: [
      "Study cell organelles and their functions",
      "Understand the stages of cell division",
      "Learn DNA structure and replication",
      "Explore Mendelian genetics and Punnett squares",
      "Study Darwin's theory of evolution",
      "Understand how natural selection drives adaptation",
      "Learn about biotic and abiotic factors in ecosystems",
      "Trace energy flow through food chains and webs",
      "Overview of major organ systems",
      "Study the process of digestion and nutrient absorption",
      "Learn about blood circulation and heart function",
      "Understand gas exchange in the lungs",
      "Balance chemical equations and identify reaction types",
      "Test pH levels and understand neutralization",
      "Study forms of energy and conservation laws",
      "Complete practice exams and review key concepts",
    ],
    history: [
      "Analyze the causes and triggers of WWI",
      "Study conditions and experiences in the trenches",
      "Examine the terms and impact of the treaty",
      "Understand the rise of Hitler and Mussolini",
      "Study the economic causes and global impact",
      "Analyze the events leading to WWII",
      "Study the persecution of Jews and other groups",
      "Learn about key battles and the atomic bomb",
      "Understand the origins of US-Soviet tensions",
      "Study key events and figures in the civil rights era",
      "Analyze the end of colonial rule in Africa and Asia",
      "Study recent global conflicts and their causes",
      "Explore key events in Australian history",
      "Learn about Indigenous Australian history and culture",
      "Study patterns of immigration to Australia",
      "Complete practice exams and review key concepts",
    ],
    english: [
      "Begin reading the set text and take notes",
      "Analyze main and supporting characters",
      "Identify and explore key themes",
      "Learn to identify metaphor, simile, symbolism etc.",
      "Practice introduction, body, conclusion structure",
      "Write persuasive texts on various topics",
      "Develop creative writing skills",
      "Analyze poems for meaning and technique",
      "Study film techniques and their effects",
      "Analyze media texts critically",
      "Prepare and practice oral presentations",
      "Learn research and referencing skills",
      "Compare two or more texts",
      "Close reading and analysis practice",
      "Review all topics and practice exam questions",
      "Complete practice exams and review key concepts",
    ],
  };

  for (const subjectId of subjectIds) {
    for (let week = 1; week <= 16; week++) {
      const fortnight = Math.ceil(week / 2);
      const { start } = getWeekDates(week);
      const topicIndex = week - 1;
      
      tasks.push({
        id: `${subjectId}-week${week}`,
        subjectId,
        week,
        fortnight,
        title: topicsBySubject[subjectId][topicIndex],
        description: descriptions[subjectId][topicIndex],
        estimatedMinutes: Math.floor(Math.random() * 30) + 30, // 30-60 mins
        completed: false,
        dueDate: start.toISOString().split('T')[0],
      });
    }
  }
  
  return tasks;
}

export function generateSampleExams(): Exam[] {
  return [
    { id: "exam-math-1", subjectId: "math", title: "Math Mid-Semester Test", date: "2025-03-21", week: 7, description: "Covers weeks 1-6: Linear and quadratic equations" },
    { id: "exam-math-2", subjectId: "math", title: "Math Final Exam", date: "2025-05-16", week: 15, description: "Comprehensive exam covering all semester topics" },
    { id: "exam-science-1", subjectId: "science", title: "Science Mid-Semester Test", date: "2025-03-19", week: 7, description: "Covers cells, genetics, and evolution" },
    { id: "exam-science-2", subjectId: "science", title: "Science Final Exam", date: "2025-05-14", week: 15, description: "Comprehensive exam covering all semester topics" },
    { id: "exam-history-1", subjectId: "history", title: "History Essay Assessment", date: "2025-03-26", week: 8, description: "Extended response on WWI and its aftermath" },
    { id: "exam-history-2", subjectId: "history", title: "History Final Exam", date: "2025-05-19", week: 16, description: "Comprehensive exam covering all semester topics" },
    { id: "exam-english-1", subjectId: "english", title: "English Oral Presentation", date: "2025-04-02", week: 9, description: "5-minute presentation on novel themes" },
    { id: "exam-english-2", subjectId: "english", title: "English Final Exam", date: "2025-05-21", week: 16, description: "Essay and textual analysis exam" },
  ];
}

// Keep User types for compatibility
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
