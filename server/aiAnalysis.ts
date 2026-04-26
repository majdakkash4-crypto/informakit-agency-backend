import { invokeLLM } from "./_core/llm";
import { callDataApi } from "./_core/dataApi";
import { storagePut } from "./storage";
import {
  createReport,
  updateReportPdf,
  updateInquiryAnalysisStatus,
  updateInquiryStatus,
  getInquiryById,
} from "./db";
import type { Inquiry, InsertInquiryReport } from "../drizzle/schema";
import { notifyOwner } from "./_core/notification";

// ─── Social Media Research ─────────────────────────────────────

async function searchTwitterProfile(companyName: string) {
  try {
    const result = await callDataApi("Twitter/get_user_profile_by_username", {
      query: { username: companyName.replace(/\s+/g, "").toLowerCase() },
    });
    const userData = (result as any)?.result?.data?.user?.result;
    if (!userData) return null;

    const legacy = userData.legacy || {};
    const core = userData.core || {};
    return {
      platform: "Twitter/X",
      username: core.screen_name || companyName,
      followers: legacy.followers_count || 0,
      posts: legacy.statuses_count || 0,
      engagement: `${legacy.favourites_count || 0} Likes gesamt`,
      url: `https://x.com/${core.screen_name || companyName}`,
      description: legacy.description || "",
    };
  } catch (e) {
    console.warn("[AI Analysis] Twitter lookup failed:", e);
    return null;
  }
}

async function searchLinkedInCompany(companyName: string) {
  try {
    const result = await callDataApi("LinkedIn/get_company_details", {
      query: { username: companyName.replace(/\s+/g, "").toLowerCase() },
    });
    const data = (result as any)?.data || result;
    if (!data?.name) return null;

    return {
      platform: "LinkedIn",
      username: data.universalName || companyName,
      followers: data.followerCount || 0,
      posts: data.staffCount || 0,
      engagement: `${data.staffCountRange || "N/A"} Mitarbeiter`,
      url: data.linkedinUrl || "",
      description: data.description || "",
      industries: data.industries || [],
      specialities: data.specialities || [],
    };
  } catch (e) {
    console.warn("[AI Analysis] LinkedIn lookup failed:", e);
    return null;
  }
}

async function searchYouTube(companyName: string) {
  try {
    const result = await callDataApi("Youtube/search", {
      query: { q: companyName, hl: "de", gl: "DE" },
    });
    const contents = (result as any)?.contents || [];
    const channelResult = contents.find((c: any) => c.type === "channel");
    if (channelResult?.channel) {
      return {
        platform: "YouTube",
        username: channelResult.channel.title || companyName,
        followers: 0,
        posts: 0,
        engagement: channelResult.channel.subscriberCountText || "N/A",
        url: `https://youtube.com/channel/${channelResult.channel.channelId}`,
        description: channelResult.channel.descriptionSnippet || "",
      };
    }
    return null;
  } catch (e) {
    console.warn("[AI Analysis] YouTube lookup failed:", e);
    return null;
  }
}

// ─── LLM Analysis ──────────────────────────────────────────────

async function generateAnalysis(inquiry: Inquiry, socialProfiles: any[]) {
  const profileSummary = socialProfiles
    .filter(Boolean)
    .map(
      (p) =>
        `- ${p.platform}: @${p.username}, ${p.followers} Follower, ${p.engagement}. ${p.description || ""}`
    )
    .join("\n");

  const serviceList = (inquiry.serviceTypes as string[]).join(", ");

  const prompt = `Du bist ein erfahrener Digital-Marketing-Stratege bei einer deutschen Agentur namens InformaKit.

Ein potenzieller Kunde hat eine Anfrage gestellt. Erstelle eine umfassende Analyse und Strategieempfehlung.

## Kundeninformationen
- Name: ${inquiry.clientName}
- Unternehmen: ${inquiry.companyName || "Nicht angegeben"}
- Website: ${inquiry.companyWebsite || "Nicht angegeben"}
- Gewünschte Services: ${serviceList}
- Budget: ${inquiry.budgetRange || "Nicht angegeben"}
- Projektbeschreibung: ${inquiry.description}

## Gefundene Social-Media-Profile
${profileSummary || "Keine Profile gefunden."}

## Aufgabe
Erstelle eine detaillierte Analyse mit folgenden Abschnitten:

1. **Zusammenfassung**: Kurze Übersicht über den Kunden und seine Bedürfnisse
2. **Social-Media-Analyse**: Bewertung der aktuellen Online-Präsenz (basierend auf den gefundenen Profilen)
3. **Strategieplan**: Konkreter Maßnahmenplan für die gewünschten Services (${serviceList})
4. **Beispiel-Posts**: 3-5 konkrete Content-Beispiele passend zur Branche
5. **Key Insights**: Die wichtigsten Erkenntnisse und Chancen
6. **Empfehlungen**: Priorisierte nächste Schritte mit Zeitrahmen
7. **Wettbewerbsanalyse**: Kurze Einschätzung der Marktposition

Antworte auf Deutsch. Sei konkret und praxisnah.`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Du bist ein erfahrener Digital-Marketing-Stratege. Antworte immer auf Deutsch mit konkreten, umsetzbaren Empfehlungen." },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0]?.message?.content as string || "";
}

async function generateStructuredAnalysis(inquiry: Inquiry, socialProfiles: any[], fullAnalysis: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "Du extrahierst strukturierte Daten aus einer Marketing-Analyse. Antworte ausschließlich im angeforderten JSON-Format.",
      },
      {
        role: "user",
        content: `Extrahiere aus folgender Analyse die strukturierten Daten:

${fullAnalysis}

Gib die Daten als JSON zurück mit folgender Struktur:
{
  "summary": "Kurze Zusammenfassung (2-3 Sätze)",
  "strategyPlan": "Der vollständige Strategieplan als Markdown-Text",
  "examplePosts": [{"platform": "Instagram/LinkedIn/Twitter", "content": "Post-Text", "type": "Bild/Video/Text"}],
  "keyInsights": ["Insight 1", "Insight 2", ...],
  "recommendations": ["Empfehlung 1", "Empfehlung 2", ...],
  "competitorAnalysis": "Wettbewerbsanalyse als Text"
}`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "analysis_data",
        strict: true,
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            strategyPlan: { type: "string" },
            examplePosts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  platform: { type: "string" },
                  content: { type: "string" },
                  type: { type: "string" },
                },
                required: ["platform", "content", "type"],
                additionalProperties: false,
              },
            },
            keyInsights: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            competitorAnalysis: { type: "string" },
          },
          required: ["summary", "strategyPlan", "examplePosts", "keyInsights", "recommendations", "competitorAnalysis"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  try {
    return JSON.parse(typeof content === "string" ? content : "{}");
  } catch {
    return { summary: fullAnalysis.slice(0, 300), strategyPlan: fullAnalysis, examplePosts: [], keyInsights: [], recommendations: [], competitorAnalysis: "" };
  }
}

// ─── PDF Generation (real PDF via jsPDF) ──────────────────────

async function generatePdfReport(inquiry: Inquiry, analysisData: any, fullAnalysis: string): Promise<{ key: string; url: string }> {
  // Dynamic import jsPDF (ESM)
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ─── Header ───
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("InformaKit — Analyse-Report", margin, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`${inquiry.companyName || inquiry.clientName} | ${new Date().toLocaleDateString("de-DE")}`, margin, 32);
  y = 55;

  // ─── Client Info ───
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("KUNDENINFORMATIONEN", margin, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  const infoLines = [
    `Kunde: ${inquiry.clientName}`,
    `Unternehmen: ${inquiry.companyName || "—"}`,
    `E-Mail: ${inquiry.clientEmail}`,
    `Telefon: ${inquiry.clientPhone || "—"}`,
    `Website: ${inquiry.companyWebsite || "—"}`,
    `Services: ${(inquiry.serviceTypes as string[]).join(", ")}`,
    `Budget: ${inquiry.budgetRange || "—"}`,
    `Erstellt: ${new Date().toLocaleDateString("de-DE")}`,
  ];
  for (const line of infoLines) {
    doc.text(line, margin, y);
    y += 5.5;
  }
  y += 5;

  // ─── Divider ───
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // ─── Summary ───
  if (analysisData.summary) {
    checkPageBreak(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("Zusammenfassung", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const summaryLines = doc.splitTextToSize(analysisData.summary, contentWidth);
    for (const line of summaryLines) {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 8;
  }

  // ─── Strategy Plan ───
  if (analysisData.strategyPlan) {
    checkPageBreak(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("Strategieplan", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    // Clean markdown formatting for PDF
    const cleanStrategy = analysisData.strategyPlan
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");
    const strategyLines = doc.splitTextToSize(cleanStrategy, contentWidth);
    for (const line of strategyLines) {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 8;
  }

  // ─── Example Posts ───
  if (analysisData.examplePosts && analysisData.examplePosts.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("Beispiel-Posts", margin, y);
    y += 8;

    for (const post of analysisData.examplePosts) {
      checkPageBreak(20);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(`${post.platform} (${post.type})`, margin, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const postLines = doc.splitTextToSize(post.content, contentWidth - 5);
      for (const line of postLines) {
        checkPageBreak(6);
        doc.text(line, margin + 3, y);
        y += 5.5;
      }
      y += 4;
    }
    y += 4;
  }

  // ─── Key Insights ───
  if (analysisData.keyInsights && analysisData.keyInsights.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("Key Insights", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    for (const insight of analysisData.keyInsights) {
      checkPageBreak(10);
      const insightLines = doc.splitTextToSize(`• ${insight}`, contentWidth - 5);
      for (const line of insightLines) {
        checkPageBreak(6);
        doc.text(line, margin + 3, y);
        y += 5.5;
      }
      y += 2;
    }
    y += 6;
  }

  // ─── Recommendations ───
  if (analysisData.recommendations && analysisData.recommendations.length > 0) {
    checkPageBreak(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("Empfehlungen", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    analysisData.recommendations.forEach((rec: string, i: number) => {
      checkPageBreak(10);
      const recLines = doc.splitTextToSize(`${i + 1}. ${rec}`, contentWidth - 5);
      for (const line of recLines) {
        checkPageBreak(6);
        doc.text(line, margin + 3, y);
        y += 5.5;
      }
      y += 2;
    });
    y += 6;
  }

  // ─── Competitor Analysis ───
  if (analysisData.competitorAnalysis) {
    checkPageBreak(30);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(124, 58, 237);
    doc.text("Wettbewerbsanalyse", margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const cleanCompetitor = analysisData.competitorAnalysis
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "");
    const compLines = doc.splitTextToSize(cleanCompetitor, contentWidth);
    for (const line of compLines) {
      checkPageBreak(6);
      doc.text(line, margin, y);
      y += 5.5;
    }
  }

  // ─── Footer on each page ───
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(
      `InformaKit Analyse-Report — Seite ${i}/${totalPages} — Automatisch generiert am ${new Date().toLocaleDateString("de-DE")}`,
      margin,
      pageHeight - 10
    );
  }

  // ─── Export as Buffer ───
  const pdfArrayBuffer = doc.output("arraybuffer");
  const pdfBuffer = Buffer.from(pdfArrayBuffer);

  const fileName = `reports/inquiry-${inquiry.id}-analysis.pdf`;
  const { key, url } = await storagePut(fileName, pdfBuffer, "application/pdf");
  return { key, url };
}

// ─── Main Pipeline ─────────────────────────────────────────────

export async function runAnalysisPipeline(inquiryId: number) {
  try {
    const inquiry = await getInquiryById(inquiryId);
    if (!inquiry) {
      console.error("[AI Analysis] Inquiry not found:", inquiryId);
      return;
    }

    // Update status
    await updateInquiryAnalysisStatus(inquiryId, "running");
    await updateInquiryStatus(inquiryId, "analyzing");

    // 1. Research social media profiles
    const companySearch = inquiry.companyName || inquiry.clientName;
    const [twitter, linkedin, youtube] = await Promise.allSettled([
      searchTwitterProfile(companySearch),
      searchLinkedInCompany(companySearch),
      searchYouTube(companySearch),
    ]);

    const socialProfiles = [
      twitter.status === "fulfilled" ? twitter.value : null,
      linkedin.status === "fulfilled" ? linkedin.value : null,
      youtube.status === "fulfilled" ? youtube.value : null,
    ].filter(Boolean);

    // 2. Generate LLM analysis
    const fullAnalysis = await generateAnalysis(inquiry, socialProfiles);

    // 3. Extract structured data
    const structuredData = await generateStructuredAnalysis(inquiry, socialProfiles, fullAnalysis);

    // 4. Create report in DB
    const reportData: InsertInquiryReport = {
      inquiryId,
      title: `Analyse: ${inquiry.companyName || inquiry.clientName}`,
      summary: structuredData.summary || fullAnalysis.slice(0, 500),
      analysisData: {
        socialMediaProfiles: socialProfiles.map((p: any) => ({
          platform: p.platform,
          username: p.username,
          followers: p.followers,
          posts: p.posts,
          engagement: p.engagement,
          url: p.url,
        })),
        strategyPlan: structuredData.strategyPlan,
        examplePosts: structuredData.examplePosts,
        keyInsights: structuredData.keyInsights,
        recommendations: structuredData.recommendations,
        competitorAnalysis: structuredData.competitorAnalysis,
      },
    };

    const reportId = await createReport(reportData);

    // 5. Generate and upload PDF
    const { key, url } = await generatePdfReport(inquiry, structuredData, fullAnalysis);
    await updateReportPdf(reportId, key, url);

    // 6. Update statuses
    await updateInquiryAnalysisStatus(inquiryId, "completed");
    await updateInquiryStatus(inquiryId, "analyzed");

    console.log(`[AI Analysis] Completed for inquiry ${inquiryId}, report ${reportId}`);
  } catch (error) {
    console.error("[AI Analysis] Pipeline failed for inquiry", inquiryId, error);
    try {
      await updateInquiryAnalysisStatus(inquiryId, "failed");
    } catch {}
  }
}
