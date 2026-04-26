import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import {
  ArrowLeft,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  Building2,
  Calendar,
  FileText,
  BarChart3,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Inbox,
  Archive,
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  new: { label: "Neu", color: "#8B5CF6" },
  analyzing: { label: "Analyse läuft", color: "#F59E0B" },
  analyzed: { label: "Analysiert", color: "#10B981" },
  in_progress: { label: "In Bearbeitung", color: "#3B82F6" },
  completed: { label: "Abgeschlossen", color: "#6B7280" },
  archived: { label: "Archiviert", color: "#4B5563" },
};

const SERVICE_COLORS: Record<string, string> = {
  "Social Media": "#D946EF",
  "Web Design": "#8B5CF6",
  Development: "#6366F1",
  SEO: "#10B981",
  "KI & Automation": "#F59E0B",
  Branding: "#EF4444",
  "Mobile App": "#F97316",
  Beratung: "#06B6D4",
};

export default function AdminInquiryDetail() {
  const { loading, user } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const inquiryId = parseInt(params.id || "0", 10);

  const { data, isLoading, refetch } = trpc.admin.getInquiry.useQuery(
    { id: inquiryId },
    { enabled: !!user && user.role === "admin" && inquiryId > 0 }
  );

  const updateStatusMutation = trpc.admin.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status aktualisiert");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const retriggerMutation = trpc.admin.retriggerAnalysis.useMutation({
    onSuccess: () => {
      toast.success("KI-Analyse wird erneut gestartet");
      refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user || user.role !== "admin") {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>🔒</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Kein Zugriff</h1>
          <button
            style={styles.primaryBtn}
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Anmelden
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={styles.loadingPage}>
        <Loader2 size={28} style={{ animation: "spin 1s linear infinite", color: "#8B5CF6" }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!data?.inquiry) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>❌</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 12 }}>Anfrage nicht gefunden</h1>
          <button style={styles.secondaryBtn} onClick={() => navigate("/admin")}>
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { inquiry, report } = data;
  const status = STATUS_MAP[inquiry.status] || STATUS_MAP["new"];
  const analysisData = report?.analysisData as any;

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate("/admin")}>
          <ArrowLeft size={18} /> Zurück
        </button>
        <div style={styles.headerActions}>
          <select
            style={styles.statusSelect}
            value={inquiry.status}
            onChange={(e) => updateStatusMutation.mutate({ id: inquiry.id, status: e.target.value as any })}
          >
            <option value="new">Neu</option>
            <option value="analyzing">Analyse läuft</option>
            <option value="analyzed">Analysiert</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="completed">Abgeschlossen</option>
            <option value="archived">Archiviert</option>
          </select>
          {(inquiry.analysisStatus === "failed" || inquiry.analysisStatus === "pending") && (
            <button
              style={styles.retriggerBtn}
              onClick={() => retriggerMutation.mutate({ id: inquiry.id })}
              disabled={retriggerMutation.isPending}
            >
              <RefreshCw size={14} /> KI-Analyse starten
            </button>
          )}
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Left column: Inquiry details */}
        <div style={styles.leftCol}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Anfrage-Details</h2>
              <div style={{ ...styles.statusBadge, background: `${status.color}15`, color: status.color, borderColor: `${status.color}30` }}>
                {status.label}
              </div>
            </div>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <Building2 size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                <div>
                  <div style={styles.infoLabel}>Kunde</div>
                  <div style={styles.infoValue}>{inquiry.clientName}</div>
                </div>
              </div>
              <div style={styles.infoItem}>
                <Mail size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                <div>
                  <div style={styles.infoLabel}>E-Mail</div>
                  <div style={styles.infoValue}>{inquiry.clientEmail}</div>
                </div>
              </div>
              {inquiry.clientPhone && (
                <div style={styles.infoItem}>
                  <Phone size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <div>
                    <div style={styles.infoLabel}>Telefon</div>
                    <div style={styles.infoValue}>{inquiry.clientPhone}</div>
                  </div>
                </div>
              )}
              {inquiry.companyName && (
                <div style={styles.infoItem}>
                  <Building2 size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <div>
                    <div style={styles.infoLabel}>Unternehmen</div>
                    <div style={styles.infoValue}>{inquiry.companyName}</div>
                  </div>
                </div>
              )}
              {inquiry.companyWebsite && (
                <div style={styles.infoItem}>
                  <Globe size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <div>
                    <div style={styles.infoLabel}>Website</div>
                    <a href={inquiry.companyWebsite} target="_blank" rel="noopener" style={{ ...styles.infoValue, color: "#8B5CF6", textDecoration: "none" }}>
                      {inquiry.companyWebsite} <ExternalLink size={12} style={{ display: "inline" }} />
                    </a>
                  </div>
                </div>
              )}
              <div style={styles.infoItem}>
                <Calendar size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
                <div>
                  <div style={styles.infoLabel}>Erstellt am</div>
                  <div style={styles.infoValue}>
                    {new Date(inquiry.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.sectionLabel}>Services</div>
            <div style={styles.serviceTags}>
              {(inquiry.serviceTypes as string[]).map((s) => (
                <span
                  key={s}
                  style={{
                    ...styles.serviceTag,
                    background: `${SERVICE_COLORS[s] || "#8B5CF6"}15`,
                    borderColor: `${SERVICE_COLORS[s] || "#8B5CF6"}40`,
                    color: SERVICE_COLORS[s] || "#8B5CF6",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            {inquiry.budgetRange && (
              <>
                <div style={styles.sectionLabel}>Budget</div>
                <div style={styles.budgetTag}>{inquiry.budgetRange}</div>
              </>
            )}

            <div style={styles.divider} />

            <div style={styles.sectionLabel}>Projektbeschreibung</div>
            <div style={styles.descriptionBox}>{inquiry.description}</div>

            {inquiry.attachments && (inquiry.attachments as any[]).length > 0 && (
              <>
                <div style={styles.sectionLabel}>Anhänge</div>
                <div style={styles.attachmentsList}>
                  {(inquiry.attachments as any[]).map((a: any, i: number) => (
                    <a key={i} href={a.url} target="_blank" rel="noopener" style={styles.attachmentItem}>
                      <FileText size={16} /> {a.name}
                      <Download size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right column: AI Analysis Report */}
        <div style={styles.rightCol}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                <BarChart3 size={18} style={{ color: "#8B5CF6" }} /> KI-Analyse
              </h2>
              {inquiry.analysisStatus === "running" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#F59E0B", fontSize: 13 }}>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Analyse läuft...
                </div>
              )}
              {inquiry.analysisStatus === "failed" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#EF4444", fontSize: 13 }}>
                  ❌ Analyse fehlgeschlagen
                </div>
              )}
            </div>

            {!report && inquiry.analysisStatus !== "running" && (
              <div style={styles.emptyReport}>
                <BarChart3 size={40} style={{ color: "rgba(255,255,255,0.1)" }} />
                <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 16, fontSize: 14 }}>
                  Noch kein Analyse-Report vorhanden.
                </p>
                <button
                  style={styles.retriggerBtn}
                  onClick={() => retriggerMutation.mutate({ id: inquiry.id })}
                  disabled={retriggerMutation.isPending}
                >
                  <RefreshCw size={14} /> KI-Analyse starten
                </button>
              </div>
            )}

            {report && (
              <div style={styles.reportContent}>
                {/* PDF Download */}
                {report.pdfUrl && (
                  <a href={report.pdfUrl} target="_blank" rel="noopener" style={styles.pdfDownload}>
                    <FileText size={20} />
                    <div>
                      <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>Analyse-Report (PDF)</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Klicken zum Herunterladen</div>
                    </div>
                    <Download size={18} style={{ marginLeft: "auto", color: "#8B5CF6" }} />
                  </a>
                )}

                {/* Summary */}
                {report.summary && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Zusammenfassung</h3>
                    <p style={styles.reportText}>{report.summary}</p>
                  </div>
                )}

                {/* Social Media Profiles */}
                {analysisData?.socialMediaProfiles && analysisData.socialMediaProfiles.length > 0 && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Social-Media-Profile</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {analysisData.socialMediaProfiles.map((p: any, i: number) => (
                        <div key={i} style={styles.profileCard}>
                          <div style={styles.profilePlatform}>{p.platform}</div>
                          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                            {p.username && <span style={styles.profileStat}>@{p.username}</span>}
                            {p.followers > 0 && <span style={styles.profileStat}>{p.followers.toLocaleString()} Follower</span>}
                            {p.engagement && <span style={styles.profileStat}>{p.engagement}</span>}
                          </div>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noopener" style={{ color: "#8B5CF6", fontSize: 12, textDecoration: "none", marginTop: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              Profil ansehen <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategy Plan */}
                {analysisData?.strategyPlan && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Strategieplan</h3>
                    <div style={styles.reportText}>{analysisData.strategyPlan}</div>
                  </div>
                )}

                {/* Example Posts */}
                {analysisData?.examplePosts && analysisData.examplePosts.length > 0 && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Beispiel-Posts</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {analysisData.examplePosts.map((p: any, i: number) => (
                        <div key={i} style={styles.examplePost}>
                          <div style={styles.postHeader}>
                            <span style={styles.postPlatform}>{p.platform}</span>
                            <span style={styles.postType}>{p.type}</span>
                          </div>
                          <p style={styles.postContent}>{p.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Insights */}
                {analysisData?.keyInsights && analysisData.keyInsights.length > 0 && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Key Insights</h3>
                    <ul style={styles.insightList}>
                      {analysisData.keyInsights.map((insight: string, i: number) => (
                        <li key={i} style={styles.insightItem}>
                          <CheckCircle2 size={14} style={{ color: "#10B981", flexShrink: 0, marginTop: 2 }} />
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {analysisData?.recommendations && analysisData.recommendations.length > 0 && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Empfehlungen</h3>
                    <ul style={styles.insightList}>
                      {analysisData.recommendations.map((rec: string, i: number) => (
                        <li key={i} style={styles.insightItem}>
                          <span style={{ color: "#8B5CF6", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Competitor Analysis */}
                {analysisData?.competitorAnalysis && (
                  <div style={styles.reportSection}>
                    <h3 style={styles.reportSectionTitle}>Wettbewerbsanalyse</h3>
                    <div style={styles.reportText}>{analysisData.competitorAnalysis}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#050508",
    fontFamily: "'Inter', sans-serif",
    padding: "24px 32px",
  },
  authPage: {
    minHeight: "100vh",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', sans-serif",
  },
  authCard: {
    textAlign: "center",
    padding: 48,
    borderRadius: 20,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    maxWidth: 400,
  },
  loadingPage: {
    minHeight: "100vh",
    background: "#050508",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.5)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 0",
    fontFamily: "'Inter', sans-serif",
  },
  headerActions: { display: "flex", gap: 10, alignItems: "center" },
  statusSelect: {
    padding: "10px 16px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    cursor: "pointer",
  },
  retriggerBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 10,
    background: "rgba(139,92,246,0.1)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "#8B5CF6",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'Inter', sans-serif",
  },
  primaryBtn: {
    padding: "14px 32px",
    borderRadius: 9999,
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 24px rgba(139,92,246,0.4)",
  },
  secondaryBtn: {
    padding: "14px 32px",
    borderRadius: 9999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  leftCol: {},
  rightCol: {},
  card: {
    borderRadius: 16,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: 28,
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: 0,
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 14px",
    borderRadius: 9999,
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid",
  },
  infoGrid: { display: "flex", flexDirection: "column", gap: 16 },
  infoItem: { display: "flex", alignItems: "flex-start", gap: 12 },
  infoLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "'Fira Code', monospace" },
  infoValue: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  divider: { height: 1, background: "rgba(255,255,255,0.06)", margin: "24px 0" },
  sectionLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontFamily: "'Fira Code', monospace", marginBottom: 12 },
  serviceTags: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 },
  serviceTag: { padding: "5px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 600, border: "1px solid" },
  budgetTag: { padding: "8px 16px", borderRadius: 10, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", color: "#8B5CF6", fontSize: 14, fontWeight: 600, display: "inline-block", marginBottom: 20 },
  descriptionBox: { fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, whiteSpace: "pre-wrap", padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" },
  attachmentsList: { display: "flex", flexDirection: "column", gap: 8, marginTop: 8 },
  attachmentItem: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", transition: "all 0.2s" },
  emptyReport: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 60, textAlign: "center", gap: 12 },
  reportContent: { display: "flex", flexDirection: "column", gap: 24 },
  pdfDownload: { display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)", textDecoration: "none", transition: "all 0.2s", cursor: "pointer" },
  reportSection: {},
  reportSectionTitle: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: "-0.01em" },
  reportText: { fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, whiteSpace: "pre-wrap" },
  profileCard: { padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 6 },
  profilePlatform: { fontSize: 13, fontWeight: 700, color: "#fff" },
  profileStat: { fontSize: 12, color: "rgba(255,255,255,0.45)", fontFamily: "'Fira Code', monospace" },
  examplePost: { padding: "16px 18px", borderRadius: 12, background: "rgba(139,92,246,0.05)", border: "1px solid rgba(139,92,246,0.1)" },
  postHeader: { display: "flex", gap: 10, marginBottom: 10 },
  postPlatform: { fontSize: 12, fontWeight: 700, color: "#8B5CF6", padding: "2px 8px", borderRadius: 6, background: "rgba(139,92,246,0.1)" },
  postType: { fontSize: 12, color: "rgba(255,255,255,0.35)", padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)" },
  postContent: { fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 },
  insightList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  insightItem: { display: "flex", gap: 10, fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 },
};
