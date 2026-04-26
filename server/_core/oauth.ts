import type { Express } from "express";

// Manus OAuth removed — login is handled via tRPC auth.login mutation.
export function registerOAuthRoutes(_app: Express) {}
