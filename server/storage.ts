import { eq, and } from "drizzle-orm";
import { db } from "./db";
import {
  usersTable,
  tasksTable,
  notesTable,
  examsTable,
  gradesTable,
  userStatsTable,
  streaksTable,
  avatarSettingsTable,
  customTodosTable,
  studyTimeTable,
  dayNotesTable,
  weeklyGoalTable,
  generateSampleTasks,
  generateSampleExams,
  type DbUser,
  type DbTask,
  type DbNote,
  type DbExam,
  type DbGrade,
  type DbUserStats,
  type DbStreak,
  type DbAvatarSettings,
  type DbCustomTodo,
  type DbStudyTime,
  type DbDayNote,
  type DbWeeklyGoal,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  createUser(user: { name: string; email: string; password: string }): Promise<DbUser>;
  getUserById(id: string): Promise<DbUser | undefined>;
  getUserByEmail(email: string): Promise<DbUser | undefined>;
  updateUser(id: string, data: Partial<DbUser>): Promise<DbUser | undefined>;

  // Tasks
  getTasksByUserId(userId: string): Promise<DbTask[]>;
  createTasks(userId: string, tasks: Omit<DbTask, "id" | "userId">[]): Promise<DbTask[]>;
  toggleTask(userId: string, taskId: string): Promise<DbTask | undefined>;
  resetTasks(userId: string): Promise<DbTask[]>;

  // Notes
  getNotesByUserId(userId: string): Promise<DbNote[]>;
  getSubjectNote(userId: string, subjectId: string): Promise<DbNote | undefined>;
  saveNote(userId: string, subjectId: string, content: string): Promise<DbNote>;

  // Exams
  getExamsByUserId(userId: string): Promise<DbExam[]>;
  createExams(userId: string, exams: Omit<DbExam, "id" | "userId">[]): Promise<DbExam[]>;
  saveExams(userId: string, exams: Omit<DbExam, "id" | "userId">[]): Promise<DbExam[]>;

  // Grades
  getGradesByUserId(userId: string): Promise<DbGrade[]>;
  saveGrade(userId: string, subjectId: string, assessmentId: string, score: number | null): Promise<DbGrade>;

  // User Stats
  getUserStats(userId: string): Promise<DbUserStats | undefined>;
  saveUserStats(userId: string, stats: Partial<DbUserStats>): Promise<DbUserStats>;
  addPoints(userId: string, points: number): Promise<DbUserStats>;

  // Streaks
  getStreak(userId: string): Promise<DbStreak | undefined>;
  saveStreak(userId: string, streak: Partial<DbStreak>): Promise<DbStreak>;

  // Avatar Settings
  getAvatarSettings(userId: string): Promise<DbAvatarSettings | undefined>;
  saveAvatarSettings(userId: string, settings: Partial<DbAvatarSettings>): Promise<DbAvatarSettings>;

  // Custom Todos
  getCustomTodos(userId: string): Promise<DbCustomTodo[]>;
  addCustomTodo(userId: string, date: string, title: string): Promise<DbCustomTodo>;
  toggleCustomTodo(userId: string, todoId: string): Promise<DbCustomTodo | undefined>;
  deleteCustomTodo(userId: string, todoId: string): Promise<boolean>;

  // Study Time
  getStudyTime(userId: string, date: string): Promise<DbStudyTime | undefined>;
  saveStudyTime(userId: string, date: string, hours: number): Promise<DbStudyTime>;

  // Day Notes
  getDayNote(userId: string, date: string): Promise<DbDayNote | undefined>;
  saveDayNote(userId: string, date: string, content: string): Promise<DbDayNote>;

  // Weekly Goal
  getWeeklyGoal(userId: string): Promise<DbWeeklyGoal | undefined>;
  saveWeeklyGoal(userId: string, hours: number): Promise<DbWeeklyGoal>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async createUser(user: { name: string; email: string; password: string }): Promise<DbUser> {
    const [newUser] = await db.insert(usersTable).values(user).returning();
    return newUser;
  }

  async getUserById(id: string): Promise<DbUser | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<DbUser | undefined> {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return user;
  }

  async updateUser(id: string, data: Partial<DbUser>): Promise<DbUser | undefined> {
    const [updated] = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning();
    return updated;
  }

  // Tasks
  async getTasksByUserId(userId: string): Promise<DbTask[]> {
    return db.select().from(tasksTable).where(eq(tasksTable.userId, userId));
  }

  async createTasks(userId: string, tasks: Omit<DbTask, "id" | "userId">[]): Promise<DbTask[]> {
    if (tasks.length === 0) return [];
    const tasksWithUserId = tasks.map(task => ({
      ...task,
      userId,
      id: randomUUID(),
    }));
    return db.insert(tasksTable).values(tasksWithUserId).returning();
  }

  async toggleTask(userId: string, taskId: string): Promise<DbTask | undefined> {
    const [task] = await db.select().from(tasksTable).where(
      and(eq(tasksTable.id, taskId), eq(tasksTable.userId, userId))
    );
    if (!task) return undefined;
    
    const [updated] = await db.update(tasksTable)
      .set({ completed: !task.completed })
      .where(eq(tasksTable.id, taskId))
      .returning();
    return updated;
  }

  async resetTasks(userId: string): Promise<DbTask[]> {
    await db.delete(tasksTable).where(eq(tasksTable.userId, userId));
    const sampleTasks = generateSampleTasks();
    const tasksToInsert = sampleTasks.map(task => ({
      id: `${userId}-${task.id}`,
      userId,
      subjectId: task.subjectId,
      week: task.week,
      term: task.term,
      title: task.title,
      description: task.description,
      estimatedMinutes: task.estimatedMinutes,
      completed: false,
      dueDate: task.dueDate,
    }));
    return db.insert(tasksTable).values(tasksToInsert).returning();
  }

  // Notes
  async getNotesByUserId(userId: string): Promise<DbNote[]> {
    return db.select().from(notesTable).where(eq(notesTable.userId, userId));
  }

  async getSubjectNote(userId: string, subjectId: string): Promise<DbNote | undefined> {
    const [note] = await db.select().from(notesTable).where(
      and(eq(notesTable.userId, userId), eq(notesTable.subjectId, subjectId))
    );
    return note;
  }

  async saveNote(userId: string, subjectId: string, content: string): Promise<DbNote> {
    const existing = await this.getSubjectNote(userId, subjectId);
    if (existing) {
      const [updated] = await db.update(notesTable)
        .set({ content, updatedAt: new Date() })
        .where(eq(notesTable.id, existing.id))
        .returning();
      return updated;
    }
    const [newNote] = await db.insert(notesTable)
      .values({ userId, subjectId, content })
      .returning();
    return newNote;
  }

  // Exams
  async getExamsByUserId(userId: string): Promise<DbExam[]> {
    return db.select().from(examsTable).where(eq(examsTable.userId, userId));
  }

  async createExams(userId: string, exams: Omit<DbExam, "id" | "userId">[]): Promise<DbExam[]> {
    if (exams.length === 0) return [];
    const examsWithUserId = exams.map(exam => ({
      ...exam,
      userId,
      id: randomUUID(),
    }));
    return db.insert(examsTable).values(examsWithUserId).returning();
  }

  async saveExams(userId: string, exams: Omit<DbExam, "id" | "userId">[]): Promise<DbExam[]> {
    await db.delete(examsTable).where(eq(examsTable.userId, userId));
    return this.createExams(userId, exams);
  }

  // Grades
  async getGradesByUserId(userId: string): Promise<DbGrade[]> {
    return db.select().from(gradesTable).where(eq(gradesTable.userId, userId));
  }

  async saveGrade(userId: string, subjectId: string, assessmentId: string, score: number | null): Promise<DbGrade> {
    const [existing] = await db.select().from(gradesTable).where(
      and(
        eq(gradesTable.userId, userId),
        eq(gradesTable.subjectId, subjectId),
        eq(gradesTable.assessmentId, assessmentId)
      )
    );
    if (existing) {
      const [updated] = await db.update(gradesTable)
        .set({ score })
        .where(eq(gradesTable.id, existing.id))
        .returning();
      return updated;
    }
    const [newGrade] = await db.insert(gradesTable)
      .values({ userId, subjectId, assessmentId, score })
      .returning();
    return newGrade;
  }

  // User Stats
  async getUserStats(userId: string): Promise<DbUserStats | undefined> {
    const [stats] = await db.select().from(userStatsTable).where(eq(userStatsTable.userId, userId));
    return stats;
  }

  async saveUserStats(userId: string, stats: Partial<DbUserStats>): Promise<DbUserStats> {
    const existing = await this.getUserStats(userId);
    if (existing) {
      const [updated] = await db.update(userStatsTable)
        .set(stats)
        .where(eq(userStatsTable.userId, userId))
        .returning();
      return updated;
    }
    const [newStats] = await db.insert(userStatsTable)
      .values({ userId, ...stats })
      .returning();
    return newStats;
  }

  async addPoints(userId: string, points: number): Promise<DbUserStats> {
    const existing = await this.getUserStats(userId);
    const currentPoints = existing?.totalPoints ?? 0;
    return this.saveUserStats(userId, { totalPoints: currentPoints + points });
  }

  // Streaks
  async getStreak(userId: string): Promise<DbStreak | undefined> {
    const [streak] = await db.select().from(streaksTable).where(eq(streaksTable.userId, userId));
    return streak;
  }

  async saveStreak(userId: string, streak: Partial<DbStreak>): Promise<DbStreak> {
    const existing = await this.getStreak(userId);
    if (existing) {
      const [updated] = await db.update(streaksTable)
        .set(streak)
        .where(eq(streaksTable.userId, userId))
        .returning();
      return updated;
    }
    const [newStreak] = await db.insert(streaksTable)
      .values({ userId, ...streak })
      .returning();
    return newStreak;
  }

  // Avatar Settings
  async getAvatarSettings(userId: string): Promise<DbAvatarSettings | undefined> {
    const [settings] = await db.select().from(avatarSettingsTable).where(eq(avatarSettingsTable.userId, userId));
    return settings;
  }

  async saveAvatarSettings(userId: string, settings: Partial<DbAvatarSettings>): Promise<DbAvatarSettings> {
    const existing = await this.getAvatarSettings(userId);
    if (existing) {
      const [updated] = await db.update(avatarSettingsTable)
        .set(settings)
        .where(eq(avatarSettingsTable.userId, userId))
        .returning();
      return updated;
    }
    const [newSettings] = await db.insert(avatarSettingsTable)
      .values({ userId, ...settings })
      .returning();
    return newSettings;
  }

  // Custom Todos
  async getCustomTodos(userId: string): Promise<DbCustomTodo[]> {
    return db.select().from(customTodosTable).where(eq(customTodosTable.userId, userId));
  }

  async addCustomTodo(userId: string, date: string, title: string): Promise<DbCustomTodo> {
    const [newTodo] = await db.insert(customTodosTable)
      .values({ userId, date, title, completed: false })
      .returning();
    return newTodo;
  }

  async toggleCustomTodo(userId: string, todoId: string): Promise<DbCustomTodo | undefined> {
    const [todo] = await db.select().from(customTodosTable).where(
      and(eq(customTodosTable.id, todoId), eq(customTodosTable.userId, userId))
    );
    if (!todo) return undefined;
    
    const [updated] = await db.update(customTodosTable)
      .set({ completed: !todo.completed })
      .where(eq(customTodosTable.id, todoId))
      .returning();
    return updated;
  }

  async deleteCustomTodo(userId: string, todoId: string): Promise<boolean> {
    const result = await db.delete(customTodosTable).where(
      and(eq(customTodosTable.id, todoId), eq(customTodosTable.userId, userId))
    );
    return true;
  }

  // Study Time
  async getStudyTime(userId: string, date: string): Promise<DbStudyTime | undefined> {
    const [studyTime] = await db.select().from(studyTimeTable).where(
      and(eq(studyTimeTable.userId, userId), eq(studyTimeTable.date, date))
    );
    return studyTime;
  }

  async saveStudyTime(userId: string, date: string, hours: number): Promise<DbStudyTime> {
    const existing = await this.getStudyTime(userId, date);
    if (existing) {
      const [updated] = await db.update(studyTimeTable)
        .set({ hours })
        .where(eq(studyTimeTable.id, existing.id))
        .returning();
      return updated;
    }
    const [newStudyTime] = await db.insert(studyTimeTable)
      .values({ userId, date, hours })
      .returning();
    return newStudyTime;
  }

  // Day Notes
  async getDayNote(userId: string, date: string): Promise<DbDayNote | undefined> {
    const [note] = await db.select().from(dayNotesTable).where(
      and(eq(dayNotesTable.userId, userId), eq(dayNotesTable.date, date))
    );
    return note;
  }

  async saveDayNote(userId: string, date: string, content: string): Promise<DbDayNote> {
    const existing = await this.getDayNote(userId, date);
    if (existing) {
      const [updated] = await db.update(dayNotesTable)
        .set({ content })
        .where(eq(dayNotesTable.id, existing.id))
        .returning();
      return updated;
    }
    const [newNote] = await db.insert(dayNotesTable)
      .values({ userId, date, content })
      .returning();
    return newNote;
  }

  // Weekly Goal
  async getWeeklyGoal(userId: string): Promise<DbWeeklyGoal | undefined> {
    const [goal] = await db.select().from(weeklyGoalTable).where(eq(weeklyGoalTable.userId, userId));
    return goal;
  }

  async saveWeeklyGoal(userId: string, hours: number): Promise<DbWeeklyGoal> {
    const existing = await this.getWeeklyGoal(userId);
    if (existing) {
      const [updated] = await db.update(weeklyGoalTable)
        .set({ hours })
        .where(eq(weeklyGoalTable.userId, userId))
        .returning();
      return updated;
    }
    const [newGoal] = await db.insert(weeklyGoalTable)
      .values({ userId, hours })
      .returning();
    return newGoal;
  }
}

export const storage = new DatabaseStorage();
