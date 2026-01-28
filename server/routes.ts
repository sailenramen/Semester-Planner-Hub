import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerQuestionGenerationRoutes } from "./questionGeneration";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register question generation routes for AI-powered study questions
  registerQuestionGenerationRoutes(app);

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}
