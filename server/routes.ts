import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { registerQuestionGenerationRoutes } from "./questionGeneration";
import { generateSampleTasks, generateSampleExams } from "@shared/schema";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const PgStore = connectPgSimple(session);

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      store: new PgStore({
        pool,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "study-planner-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );

  registerQuestionGenerationRoutes(app);

  // ================== AUTH ROUTES ==================
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ name, email, password: hashedPassword });

      const sampleTasks = generateSampleTasks();
      const tasksToCreate = sampleTasks.map(task => ({
        subjectId: task.subjectId,
        week: task.week,
        term: task.term,
        title: task.title,
        description: task.description,
        estimatedMinutes: task.estimatedMinutes,
        completed: false,
        dueDate: task.dueDate,
      }));
      await storage.createTasks(user.id, tasksToCreate);

      const sampleExams = generateSampleExams();
      const examsToCreate = sampleExams.map(exam => ({
        subjectId: exam.subjectId,
        title: exam.title,
        date: exam.date,
        week: exam.week,
        term: exam.term ?? null,
        description: exam.description ?? null,
      }));
      await storage.createExams(user.id, examsToCreate);

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      req.session.userId = user.id;

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get me error:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });

  // ================== TASKS ROUTES ==================
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.getTasksByUserId(req.session.userId!);
      res.json(tasks);
    } catch (error) {
      console.error("Get tasks error:", error);
      res.status(500).json({ error: "Failed to get tasks" });
    }
  });

  app.patch("/api/tasks/:id/toggle", requireAuth, async (req, res) => {
    try {
      const task = await storage.toggleTask(req.session.userId!, req.params.id as string);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      console.error("Toggle task error:", error);
      res.status(500).json({ error: "Failed to toggle task" });
    }
  });

  app.post("/api/tasks/reset", requireAuth, async (req, res) => {
    try {
      const tasks = await storage.resetTasks(req.session.userId!);
      res.json(tasks);
    } catch (error) {
      console.error("Reset tasks error:", error);
      res.status(500).json({ error: "Failed to reset tasks" });
    }
  });

  // ================== NOTES ROUTES ==================
  app.get("/api/notes", requireAuth, async (req, res) => {
    try {
      const notes = await storage.getNotesByUserId(req.session.userId!);
      res.json(notes);
    } catch (error) {
      console.error("Get notes error:", error);
      res.status(500).json({ error: "Failed to get notes" });
    }
  });

  app.put("/api/notes/:subjectId", requireAuth, async (req, res) => {
    try {
      const { content } = req.body;
      if (content === undefined) {
        return res.status(400).json({ error: "Content is required" });
      }
      const note = await storage.saveNote(req.session.userId!, req.params.subjectId as string, content);
      res.json(note);
    } catch (error) {
      console.error("Save note error:", error);
      res.status(500).json({ error: "Failed to save note" });
    }
  });

  // ================== EXAMS ROUTES ==================
  app.get("/api/exams", requireAuth, async (req, res) => {
    try {
      const exams = await storage.getExamsByUserId(req.session.userId!);
      res.json(exams);
    } catch (error) {
      console.error("Get exams error:", error);
      res.status(500).json({ error: "Failed to get exams" });
    }
  });

  // ================== GRADES ROUTES ==================
  app.get("/api/grades", requireAuth, async (req, res) => {
    try {
      const grades = await storage.getGradesByUserId(req.session.userId!);
      res.json(grades);
    } catch (error) {
      console.error("Get grades error:", error);
      res.status(500).json({ error: "Failed to get grades" });
    }
  });

  app.put("/api/grades", requireAuth, async (req, res) => {
    try {
      const { subjectId, assessmentId, score } = req.body;
      if (!subjectId || !assessmentId) {
        return res.status(400).json({ error: "Subject ID and assessment ID are required" });
      }
      const grade = await storage.saveGrade(req.session.userId!, subjectId, assessmentId, score);
      res.json(grade);
    } catch (error) {
      console.error("Save grade error:", error);
      res.status(500).json({ error: "Failed to save grade" });
    }
  });

  // ================== STATS ROUTES ==================
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.session.userId!);
      res.json(stats || {
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
        showcasedBadges: [],
      });
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ error: "Failed to get stats" });
    }
  });

  app.put("/api/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.saveUserStats(req.session.userId!, req.body);
      res.json(stats);
    } catch (error) {
      console.error("Save stats error:", error);
      res.status(500).json({ error: "Failed to save stats" });
    }
  });

  app.post("/api/stats/points", requireAuth, async (req, res) => {
    try {
      const { points } = req.body;
      const stats = await storage.addPoints(req.session.userId!, points);
      res.json(stats);
    } catch (error) {
      console.error("Add points error:", error);
      res.status(500).json({ error: "Failed to add points" });
    }
  });

  app.post("/api/stats/study-minutes", requireAuth, async (req, res) => {
    try {
      const { minutes, subjectId } = req.body;
      const currentStats = await storage.getUserStats(req.session.userId!);
      const updatedStats = {
        ...currentStats,
        totalStudyMinutes: (currentStats?.totalStudyMinutes || 0) + minutes,
        subjectStudyMinutes: {
          ...(currentStats?.subjectStudyMinutes || {}),
          ...(subjectId ? { [subjectId]: ((currentStats?.subjectStudyMinutes as Record<string, number>)?.[subjectId] || 0) + minutes } : {}),
        },
      };
      const stats = await storage.saveUserStats(req.session.userId!, updatedStats);
      res.json(stats);
    } catch (error) {
      console.error("Add study minutes error:", error);
      res.status(500).json({ error: "Failed to add study minutes" });
    }
  });

  app.post("/api/stats/pomodoro", requireAuth, async (req, res) => {
    try {
      const currentStats = await storage.getUserStats(req.session.userId!);
      const updatedStats = {
        ...currentStats,
        totalPomodoroSessions: (currentStats?.totalPomodoroSessions || 0) + 1,
        totalPoints: (currentStats?.totalPoints || 0) + 15,
      };
      const stats = await storage.saveUserStats(req.session.userId!, updatedStats);
      res.json(stats);
    } catch (error) {
      console.error("Record pomodoro error:", error);
      res.status(500).json({ error: "Failed to record pomodoro" });
    }
  });

  app.post("/api/stats/badge", requireAuth, async (req, res) => {
    try {
      const { badgeId } = req.body;
      const currentStats = await storage.getUserStats(req.session.userId!);
      const badgesEarned = currentStats?.badgesEarned || [];
      if (!badgesEarned.includes(badgeId)) {
        badgesEarned.push(badgeId);
      }
      const stats = await storage.saveUserStats(req.session.userId!, { badgesEarned });
      res.json(stats);
    } catch (error) {
      console.error("Earn badge error:", error);
      res.status(500).json({ error: "Failed to earn badge" });
    }
  });

  app.post("/api/stats/showcased-badges", requireAuth, async (req, res) => {
    try {
      const { badges } = req.body;
      const stats = await storage.saveUserStats(req.session.userId!, { 
        showcasedBadges: badges.slice(0, 4) 
      });
      res.json(stats);
    } catch (error) {
      console.error("Update showcased badges error:", error);
      res.status(500).json({ error: "Failed to update showcased badges" });
    }
  });

  // ================== STREAK ROUTES ==================
  app.get("/api/streak", requireAuth, async (req, res) => {
    try {
      const streak = await storage.getStreak(req.session.userId!);
      res.json(streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        lastActiveDate: null,
        lastCheckDate: null,
        streakFreezes: 2,
        freezesUsedThisMonth: 0,
        freezeDaysRemaining: 2,
        lastFreezeMonth: null,
      });
    } catch (error) {
      console.error("Get streak error:", error);
      res.status(500).json({ error: "Failed to get streak" });
    }
  });

  app.put("/api/streak", requireAuth, async (req, res) => {
    try {
      const streak = await storage.saveStreak(req.session.userId!, req.body);
      res.json(streak);
    } catch (error) {
      console.error("Save streak error:", error);
      res.status(500).json({ error: "Failed to save streak" });
    }
  });

  // ================== AVATAR ROUTES ==================
  app.get("/api/avatar", requireAuth, async (req, res) => {
    try {
      const avatar = await storage.getAvatarSettings(req.session.userId!);
      res.json(avatar || {
        baseColor: "blue",
        accentColor: "purple",
        style: "default",
        accessory: null,
      });
    } catch (error) {
      console.error("Get avatar error:", error);
      res.status(500).json({ error: "Failed to get avatar settings" });
    }
  });

  app.put("/api/avatar", requireAuth, async (req, res) => {
    try {
      const avatar = await storage.saveAvatarSettings(req.session.userId!, req.body);
      res.json(avatar);
    } catch (error) {
      console.error("Save avatar error:", error);
      res.status(500).json({ error: "Failed to save avatar settings" });
    }
  });

  // ================== CALENDAR TODOS ROUTES ==================
  app.get("/api/calendar/todos", requireAuth, async (req, res) => {
    try {
      const todos = await storage.getCustomTodos(req.session.userId!);
      res.json(todos);
    } catch (error) {
      console.error("Get todos error:", error);
      res.status(500).json({ error: "Failed to get todos" });
    }
  });

  app.get("/api/calendar/todos/:date", requireAuth, async (req, res) => {
    try {
      const todos = await storage.getCustomTodos(req.session.userId!);
      const filteredTodos = todos.filter(t => t.date === req.params.date);
      res.json(filteredTodos);
    } catch (error) {
      console.error("Get todos by date error:", error);
      res.status(500).json({ error: "Failed to get todos" });
    }
  });

  app.post("/api/calendar/todos", requireAuth, async (req, res) => {
    try {
      const { date, title } = req.body;
      if (!date || !title) {
        return res.status(400).json({ error: "Date and title are required" });
      }
      const todo = await storage.addCustomTodo(req.session.userId!, date, title);
      res.status(201).json(todo);
    } catch (error) {
      console.error("Add todo error:", error);
      res.status(500).json({ error: "Failed to add todo" });
    }
  });

  app.patch("/api/calendar/todos/:id/toggle", requireAuth, async (req, res) => {
    try {
      const todo = await storage.toggleCustomTodo(req.session.userId!, req.params.id as string);
      if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json(todo);
    } catch (error) {
      console.error("Toggle todo error:", error);
      res.status(500).json({ error: "Failed to toggle todo" });
    }
  });

  app.delete("/api/calendar/todos/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteCustomTodo(req.session.userId!, req.params.id as string);
      res.json({ message: "Todo deleted" });
    } catch (error) {
      console.error("Delete todo error:", error);
      res.status(500).json({ error: "Failed to delete todo" });
    }
  });

  // ================== STUDY TIME ROUTES ==================
  app.get("/api/calendar/study-time/:date", requireAuth, async (req, res) => {
    try {
      const studyTime = await storage.getStudyTime(req.session.userId!, req.params.date as string);
      res.json(studyTime || { hours: 0 });
    } catch (error) {
      console.error("Get study time error:", error);
      res.status(500).json({ error: "Failed to get study time" });
    }
  });

  app.put("/api/calendar/study-time/:date", requireAuth, async (req, res) => {
    try {
      const { hours } = req.body;
      if (hours === undefined) {
        return res.status(400).json({ error: "Hours is required" });
      }
      const studyTime = await storage.saveStudyTime(req.session.userId!, req.params.date as string, hours);
      res.json(studyTime);
    } catch (error) {
      console.error("Save study time error:", error);
      res.status(500).json({ error: "Failed to save study time" });
    }
  });

  // ================== DAY NOTES ROUTES ==================
  app.get("/api/calendar/day-notes/:date", requireAuth, async (req, res) => {
    try {
      const note = await storage.getDayNote(req.session.userId!, req.params.date as string);
      res.json(note || { content: "" });
    } catch (error) {
      console.error("Get day note error:", error);
      res.status(500).json({ error: "Failed to get day note" });
    }
  });

  app.put("/api/calendar/day-notes/:date", requireAuth, async (req, res) => {
    try {
      const { content } = req.body;
      if (content === undefined) {
        return res.status(400).json({ error: "Content is required" });
      }
      const note = await storage.saveDayNote(req.session.userId!, req.params.date as string, content);
      res.json(note);
    } catch (error) {
      console.error("Save day note error:", error);
      res.status(500).json({ error: "Failed to save day note" });
    }
  });

  // ================== WEEKLY GOAL ROUTES ==================
  app.get("/api/calendar/weekly-goal", requireAuth, async (req, res) => {
    try {
      const goal = await storage.getWeeklyGoal(req.session.userId!);
      res.json(goal || { hours: 10 });
    } catch (error) {
      console.error("Get weekly goal error:", error);
      res.status(500).json({ error: "Failed to get weekly goal" });
    }
  });

  app.put("/api/calendar/weekly-goal", requireAuth, async (req, res) => {
    try {
      const { hours } = req.body;
      if (hours === undefined) {
        return res.status(400).json({ error: "Hours is required" });
      }
      const goal = await storage.saveWeeklyGoal(req.session.userId!, hours);
      res.json(goal);
    } catch (error) {
      console.error("Save weekly goal error:", error);
      res.status(500).json({ error: "Failed to save weekly goal" });
    }
  });

  return httpServer;
}
