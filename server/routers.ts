import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createInquiry,
  getInquiryById,
  listInquiries,
  updateInquiryStatus,
  getReportByInquiryId,
  upsertUser,
} from "./db";
import { storagePut } from "./storage";
import { runAnalysisPipeline } from "./aiAnalysis";
import { notifyOwner } from "./_core/notification";
import { sdk } from "./_core/sdk";
import { ENV } from "./_core/env";

const SERVICE_TYPES = [
  "Branding",
  "Web Design",
  "Development",
  "SEO",
  "Social Media",
  "KI & Automation",
  "Mobile App",
  "Beratung",
] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (input.email !== ENV.adminEmail || input.password !== ENV.adminPassword) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Ungültige Zugangsdaten" });
        }
        await upsertUser({
          openId: input.email,
          name: "Admin",
          email: input.email,
          loginMethod: "password",
          role: "admin",
          lastSignedIn: new Date(),
        });
        const sessionToken = await sdk.createSessionToken(input.email, {
          name: "Admin",
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        return { success: true } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Public Inquiry Submission ─────────────────────────────
  inquiry: router({
    submit: publicProcedure
      .input(
        z.object({
          clientName: z.string().min(1).max(255),
          clientEmail: z.string().email().max(320),
          clientPhone: z.string().max(64).optional(),
          companyName: z.string().max(255).optional(),
          companyWebsite: z.string().max(512).optional(),
          instagramUrl: z.string().max(255).optional(),
          tiktokUrl: z.string().max(255).optional(),
          serviceTypes: z.array(z.string()).min(1),
          budgetRange: z.string().max(64).optional(),
          description: z.string().min(10).max(5000),
          attachments: z
            .array(
              z.object({
                key: z.string(),
                url: z.string(),
                name: z.string(),
                size: z.number(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const inquiryId = await createInquiry({
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone || null,
          companyName: input.companyName || null,
          companyWebsite: input.companyWebsite || null,
          instagramUrl: input.instagramUrl || null,
          tiktokUrl: input.tiktokUrl || null,
          serviceTypes: input.serviceTypes,
          budgetRange: input.budgetRange || null,
          description: input.description,
          attachments: input.attachments || null,
          status: "new",
          analysisStatus: "pending",
        });

        // Notify owner
        notifyOwner({
          title: `Neue Anfrage: ${input.clientName}`,
          content: `Neue Projektanfrage von ${input.clientName} (${input.companyName || "Kein Unternehmen"}).\nServices: ${input.serviceTypes.join(", ")}\nBudget: ${input.budgetRange || "Nicht angegeben"}\n\nBeschreibung: ${input.description.slice(0, 300)}`,
        }).catch((e) => console.warn("[Notification] Failed:", e));

        // Trigger AI analysis in background (don't await)
        runAnalysisPipeline(inquiryId).catch((e) =>
          console.error("[AI Analysis] Background pipeline error:", e)
        );

        return { success: true, inquiryId };
      }),

    // Upload attachment
    uploadAttachment: publicProcedure
      .input(
        z.object({
          fileName: z.string(),
          fileData: z.string(), // base64
          contentType: z.string(),
          fileSize: z.number(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.fileData, "base64");
        const key = `attachments/${Date.now()}-${input.fileName}`;
        const { key: storageKey, url } = await storagePut(key, buffer, input.contentType);
        return { key: storageKey, url, name: input.fileName, size: input.fileSize };
      }),
  }),

  // ─── Admin Dashboard ───────────────────────────────────────
  admin: router({
    listInquiries: adminProcedure
      .input(
        z.object({
          status: z.string().optional(),
          serviceType: z.string().optional(),
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        }).optional()
      )
      .query(async ({ input }) => {
        const opts: any = { ...(input || {}) };
        if (opts.dateFrom) opts.dateFrom = new Date(opts.dateFrom);
        if (opts.dateTo) opts.dateTo = new Date(opts.dateTo);
        return listInquiries(opts);
      }),

    getInquiry: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const inquiry = await getInquiryById(input.id);
        if (!inquiry) throw new Error("Anfrage nicht gefunden");

        const report = await getReportByInquiryId(input.id);
        return { inquiry, report };
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["new", "analyzing", "analyzed", "in_progress", "completed", "archived"]),
        })
      )
      .mutation(async ({ input }) => {
        await updateInquiryStatus(input.id, input.status);
        return { success: true };
      }),

    retriggerAnalysis: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        runAnalysisPipeline(input.id).catch((e) =>
          console.error("[AI Analysis] Re-trigger error:", e)
        );
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
