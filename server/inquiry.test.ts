import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

// Mock the database and AI modules
vi.mock("./db", () => ({
  createInquiry: vi.fn().mockResolvedValue(1),
  getInquiryById: vi.fn().mockResolvedValue({
    id: 1,
    clientName: "Max Mustermann",
    clientEmail: "max@test.de",
    companyName: "Test GmbH",
    serviceTypes: ["Social Media", "Web Design"],
    description: "Test Beschreibung für Projekt",
    status: "new",
    analysisStatus: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  listInquiries: vi.fn().mockResolvedValue({
    items: [
      {
        id: 1,
        clientName: "Max Mustermann",
        clientEmail: "max@test.de",
        companyName: "Test GmbH",
        serviceTypes: ["Social Media"],
        description: "Test",
        status: "new",
        analysisStatus: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    total: 1,
  }),
  updateInquiryStatus: vi.fn().mockResolvedValue(undefined),
  getReportByInquiryId: vi.fn().mockResolvedValue(null),
}));

vi.mock("./aiAnalysis", () => ({
  runAnalysisPipeline: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test-key", url: "/manus-storage/test-key" }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@informakit.de",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@test.de",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("inquiry.submit", () => {
  it("creates a new inquiry and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiry.submit({
      clientName: "Max Mustermann",
      clientEmail: "max@test.de",
      companyName: "Test GmbH",
      serviceTypes: ["Social Media", "Web Design"],
      description: "Wir brauchen eine Social Media Strategie",
    });

    expect(result.success).toBe(true);
    expect(result.inquiryId).toBe(1);
  });

  it("rejects inquiry with missing required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiry.submit({
        clientName: "",
        clientEmail: "max@test.de",
        serviceTypes: ["Social Media"],
        description: "Test description for project",
      })
    ).rejects.toThrow();
  });

  it("rejects inquiry with invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiry.submit({
        clientName: "Max",
        clientEmail: "not-an-email",
        serviceTypes: ["Social Media"],
        description: "Test description for project",
      })
    ).rejects.toThrow();
  });

  it("rejects inquiry with empty service types", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiry.submit({
        clientName: "Max",
        clientEmail: "max@test.de",
        serviceTypes: [],
        description: "Test description for project",
      })
    ).rejects.toThrow();
  });

  it("rejects inquiry with too short description", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.inquiry.submit({
        clientName: "Max",
        clientEmail: "max@test.de",
        serviceTypes: ["SEO"],
        description: "Kurz",
      })
    ).rejects.toThrow();
  });
});

describe("admin.listInquiries", () => {
  it("returns inquiry list for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.listInquiries({});

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.items[0]?.clientName).toBe("Max Mustermann");
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.listInquiries({})).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.listInquiries({})).rejects.toThrow();
  });
});

describe("admin.getInquiry", () => {
  it("returns inquiry details for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getInquiry({ id: 1 });

    expect(result.inquiry).toBeDefined();
    expect(result.inquiry.clientName).toBe("Max Mustermann");
    expect(result.report).toBeNull();
  });

  it("rejects non-admin users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.getInquiry({ id: 1 })).rejects.toThrow();
  });
});

describe("inquiry.uploadAttachment", () => {
  it("uploads a file and returns storage info", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiry.uploadAttachment({
      fileName: "test-doc.pdf",
      fileData: Buffer.from("test content").toString("base64"),
      contentType: "application/pdf",
      fileSize: 12,
    });

    expect(result.key).toBe("test-key");
    expect(result.url).toBe("/manus-storage/test-key");
    expect(result.name).toBe("test-doc.pdf");
    expect(result.size).toBe(12);
  });
});

describe("admin.getInquiry with report", () => {
  it("returns inquiry with associated report when available", async () => {
    // Override getReportByInquiryId to return a report
    const db = await import("./db");
    (db.getReportByInquiryId as any).mockResolvedValueOnce({
      id: 1,
      inquiryId: 1,
      title: "Analyse: Test GmbH",
      summary: "Test summary",
      analysisData: { keyInsights: ["Insight 1"] },
      pdfKey: "reports/test.pdf",
      pdfUrl: "/manus-storage/reports/test.pdf",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.getInquiry({ id: 1 });

    expect(result.inquiry).toBeDefined();
    expect(result.report).toBeDefined();
    expect(result.report?.title).toBe("Analyse: Test GmbH");
    expect(result.report?.pdfUrl).toBe("/manus-storage/reports/test.pdf");
  });
});

describe("admin.updateStatus", () => {
  it("updates inquiry status for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.admin.updateStatus({ id: 1, status: "in_progress" });

    expect(result.success).toBe(true);
  });

  it("rejects invalid status values", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.admin.updateStatus({ id: 1, status: "invalid_status" as any })
    ).rejects.toThrow();
  });
});
