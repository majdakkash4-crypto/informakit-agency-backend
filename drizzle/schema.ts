import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", [
  "new",
  "analyzing",
  "analyzed",
  "in_progress",
  "completed",
  "archived",
]);
export const analysisStatusEnum = pgEnum("analysis_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 64 }),
  companyName: varchar("companyName", { length: 255 }),
  companyWebsite: varchar("companyWebsite", { length: 512 }),
  serviceTypes: jsonb("serviceTypes").$type<string[]>().notNull(),
  budgetRange: varchar("budgetRange", { length: 64 }),
  description: text("description").notNull(),
  attachments: jsonb("attachments").$type<
    { key: string; url: string; name: string; size: number }[]
  >(),
  status: inquiryStatusEnum("status").default("new").notNull(),
  analysisStatus: analysisStatusEnum("analysisStatus").default("pending").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

export const inquiryReports = pgTable("inquiry_reports", {
  id: serial("id").primaryKey(),
  inquiryId: integer("inquiryId").notNull(),
  title: varchar("title", { length: 512 }).notNull(),
  summary: text("summary"),
  analysisData: jsonb("analysisData").$type<{
    socialMediaProfiles?: {
      platform: string;
      username?: string;
      followers?: number;
      posts?: number;
      engagement?: string;
      url?: string;
    }[];
    strategyPlan?: string;
    examplePosts?: { platform: string; content: string; type: string }[];
    keyInsights?: string[];
    recommendations?: string[];
    competitorAnalysis?: string;
  }>(),
  pdfKey: varchar("pdfKey", { length: 512 }),
  pdfUrl: varchar("pdfUrl", { length: 512 }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export type InquiryReport = typeof inquiryReports.$inferSelect;
export type InsertInquiryReport = typeof inquiryReports.$inferInsert;
