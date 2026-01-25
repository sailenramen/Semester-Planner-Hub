import { z } from "zod";

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
  const mathTerm1 = [
    { title: "Number & Algebra Review", desc: "Review of algebraic expressions and number operations" },
    { title: "Linear Equations", desc: "Solving linear equations with variables on both sides" },
    { title: "Linear Graphs", desc: "Plotting and interpreting linear graphs, gradient and y-intercept" },
    { title: "Simultaneous Equations", desc: "Solving pairs of linear equations algebraically and graphically" },
    { title: "Indices & Scientific Notation", desc: "Index laws and expressing numbers in scientific notation" },
    { title: "Pythagoras Theorem", desc: "Applying Pythagoras theorem to find unknown sides" },
    { title: "Trigonometry Basics", desc: "Introduction to sine, cosine and tangent ratios" },
    { title: "Term 1 Revision", desc: "Review of all Term 1 topics and practice problems" },
    { title: "Term 1 Test Preparation", desc: "Practice tests and exam technique" },
  ];
  
  // Math curriculum - Term 2 (weeks 10-17)
  const mathTerm2 = [
    { title: "Quadratic Expressions", desc: "Expanding and factorising quadratic expressions" },
    { title: "Quadratic Equations", desc: "Solving quadratic equations using factorisation" },
    { title: "Quadratic Formula", desc: "Using the quadratic formula and discriminant" },
    { title: "Parabolas", desc: "Graphing parabolas and identifying key features" },
    { title: "Statistics & Probability", desc: "Data analysis, mean, median, mode, and probability" },
    { title: "Measurement & Geometry", desc: "Area, volume, and geometric reasoning" },
    { title: "Term 2 Revision", desc: "Review of all Term 2 topics" },
    { title: "Semester Exam Preparation", desc: "Comprehensive revision for semester exams" },
  ];
  
  // Science curriculum - Term 1
  const scienceTerm1 = [
    { title: "Cells & Microscopy", desc: "Cell structure, organelles, and microscope use" },
    { title: "Cell Division", desc: "Mitosis, meiosis, and cell cycle" },
    { title: "DNA & Genetics", desc: "DNA structure, genes, and chromosomes" },
    { title: "Heredity", desc: "Mendelian genetics and Punnett squares" },
    { title: "Evolution", desc: "Darwin's theory and evidence for evolution" },
    { title: "Natural Selection", desc: "Mechanisms of natural selection and adaptation" },
    { title: "Classification", desc: "Taxonomy and classifying living things" },
    { title: "Term 1 Revision", desc: "Review of biology topics" },
    { title: "Term 1 Test Preparation", desc: "Practice tests and exam technique" },
  ];
  
  // Science curriculum - Term 2
  const scienceTerm2 = [
    { title: "Ecosystems", desc: "Biotic and abiotic factors, food webs" },
    { title: "Human Body Systems", desc: "Overview of major organ systems" },
    { title: "Digestion & Nutrition", desc: "Digestive system and nutrient absorption" },
    { title: "Circulation & Respiration", desc: "Heart, blood, lungs, and gas exchange" },
    { title: "Chemical Reactions", desc: "Types of reactions and balancing equations" },
    { title: "Acids & Bases", desc: "pH scale, neutralisation, and indicators" },
    { title: "Term 2 Revision", desc: "Review of all Term 2 topics" },
    { title: "Semester Exam Preparation", desc: "Comprehensive revision for semester exams" },
  ];
  
  // History curriculum - Term 1
  const historyTerm1 = [
    { title: "World War I Causes", desc: "Alliances, imperialism, nationalism, and assassination" },
    { title: "WWI Warfare", desc: "Trench warfare, technology, and key battles" },
    { title: "Gallipoli Campaign", desc: "Australian involvement and ANZAC legacy" },
    { title: "WWI Aftermath", desc: "Treaty of Versailles and post-war Europe" },
    { title: "Interwar Period", desc: "Rise of fascism and the Great Depression" },
    { title: "World War II Origins", desc: "Hitler's rise and causes of WWII" },
    { title: "WWII Key Events", desc: "Major battles and turning points" },
    { title: "Term 1 Revision", desc: "Review of WWI and WWII topics" },
    { title: "Term 1 Test Preparation", desc: "Essay practice and source analysis" },
  ];
  
  // History curriculum - Term 2
  const historyTerm2 = [
    { title: "The Holocaust", desc: "Persecution, genocide, and remembrance" },
    { title: "Pacific War", desc: "War in the Pacific and atomic bombs" },
    { title: "Cold War Beginnings", desc: "USA vs USSR and the Iron Curtain" },
    { title: "Decolonisation", desc: "End of empires and independence movements" },
    { title: "Civil Rights", desc: "Key figures and movements for equality" },
    { title: "Modern Australia", desc: "Post-war migration and multicultural Australia" },
    { title: "Term 2 Revision", desc: "Review of all Term 2 topics" },
    { title: "Semester Exam Preparation", desc: "Essay planning and source analysis practice" },
  ];
  
  // English curriculum - Term 1
  const englishTerm1 = [
    { title: "Novel Study Introduction", desc: "Begin reading set text and note-taking" },
    { title: "Character Analysis", desc: "Analysing main and supporting characters" },
    { title: "Theme Exploration", desc: "Identifying and exploring key themes" },
    { title: "Literary Techniques", desc: "Metaphor, simile, symbolism, and imagery" },
    { title: "Essay Writing", desc: "Structure, paragraphs, and thesis statements" },
    { title: "Persuasive Writing", desc: "Techniques and writing persuasive texts" },
    { title: "Creative Writing", desc: "Narrative techniques and creative responses" },
    { title: "Term 1 Revision", desc: "Review of novel and writing skills" },
    { title: "Term 1 Test Preparation", desc: "Practice essays and text responses" },
  ];
  
  // English curriculum - Term 2
  const englishTerm2 = [
    { title: "Poetry Analysis", desc: "Reading and analysing poems for meaning" },
    { title: "Film Study", desc: "Film techniques and visual literacy" },
    { title: "Comparative Analysis", desc: "Comparing texts and finding connections" },
    { title: "Media Literacy", desc: "Analysing media texts critically" },
    { title: "Oral Presentation", desc: "Preparing and delivering presentations" },
    { title: "Research Skills", desc: "Research methods and referencing" },
    { title: "Term 2 Revision", desc: "Review of all Term 2 content" },
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
