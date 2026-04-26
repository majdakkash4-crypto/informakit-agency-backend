import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertUser,
  users,
  inquiries,
  InsertInquiry,
  Inquiry,
  inquiryReports,
  InsertInquiryReport,
  InquiryReport,
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  }
  if (!values.lastSignedIn) {
    values.lastSignedIn = new Date();
  }
  if (Object.keys(updateSet).length === 0) {
    updateSet.lastSignedIn = new Date();
  }

  await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({ target: users.openId, set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

// ─── Inquiry helpers ───────────────────────────────────────────

export async function createInquiry(data: InsertInquiry): Promise<number> {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiries).values(data).returning({ id: inquiries.id });
  return result[0].id;
}

export async function getInquiryById(id: number): Promise<Inquiry | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db.select().from(inquiries).where(eq(inquiries.id, id)).limit(1);
  return rows[0];
}

export async function listInquiries(
  opts: {
    status?: string;
    serviceType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ items: Inquiry[]; total: number }> {
  const db = getDb();
  if (!db) return { items: [], total: 0 };

  const limit = opts.limit ?? 50;
  const offset = opts.offset ?? 0;

  let where = sql`1=1`;
  if (opts.status) {
    where = sql`${where} AND ${inquiries.status} = ${opts.status}`;
  }
  if (opts.serviceType) {
    where = sql`${where} AND ${inquiries.serviceTypes}::jsonb @> ${JSON.stringify([opts.serviceType])}::jsonb`;
  }
  if (opts.dateFrom) {
    where = sql`${where} AND ${inquiries.createdAt} >= ${opts.dateFrom}`;
  }
  if (opts.dateTo) {
    where = sql`${where} AND ${inquiries.createdAt} <= ${opts.dateTo}`;
  }

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(inquiries)
      .where(where)
      .orderBy(desc(inquiries.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`COUNT(*)` }).from(inquiries).where(where),
  ]);

  return { items, total: Number((countResult[0] as any)?.count ?? 0) };
}

export async function updateInquiryStatus(id: number, status: Inquiry["status"]) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

export async function updateInquiryAnalysisStatus(
  id: number,
  analysisStatus: Inquiry["analysisStatus"]
) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiries).set({ analysisStatus }).where(eq(inquiries.id, id));
}

// ─── Report helpers ────────────────────────────────────────────

export async function createReport(data: InsertInquiryReport): Promise<number> {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(inquiryReports).values(data).returning({ id: inquiryReports.id });
  return result[0].id;
}

export async function getReportByInquiryId(inquiryId: number): Promise<InquiryReport | undefined> {
  const db = getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(inquiryReports)
    .where(eq(inquiryReports.inquiryId, inquiryId))
    .limit(1);
  return rows[0];
}

export async function updateReportPdf(id: number, pdfKey: string, pdfUrl: string) {
  const db = getDb();
  if (!db) throw new Error("Database not available");
  await db.update(inquiryReports).set({ pdfKey, pdfUrl }).where(eq(inquiryReports.id, id));
}
