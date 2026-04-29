import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Share2, Monitor, Code2, TrendingUp, Bot, Palette, Smartphone, Lightbulb } from "lucide-react";

const SERVICE_OPTIONS = [
  { id: "Social Media", label: "Social Media", icon: <Share2 size={22} /> },
  { id: "Web Design", label: "Web Design", icon: <Monitor size={22} /> },
  { id: "Development", label: "Development", icon: <Code2 size={22} /> },
  { id: "SEO", label: "SEO", icon: <TrendingUp size={22} /> },
  { id: "KI & Automation", label: "KI & Automation", icon: <Bot size={22} /> },
  { id: "Branding", label: "Branding", icon: <Palette size={22} /> },
  { id: "Mobile App", label: "Mobile App", icon: <Smartphone size={22} /> },
  { id: "Beratung", label: "Beratung", icon: <Lightbulb size={22} /> },
];

const BUDGET_OPTIONS = [
  "< 2.000 €",
  "2.000 – 5.000 €",
  "5.000 – 10.000 €",
  "10.000 – 25.000 €",
  "25.000+ €",
  "Noch unklar",
];

export default function InquiryPage() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [description, setDescription] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [attachments, setAttachments] = useState<{ key: string; url: string; name: string; size: number }[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submitMutation = trpc.inquiry.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error("Fehler beim Senden: " + err.message);
    },
  });

  const uploadMutation = trpc.inquiry.uploadAttachment.useMutation();

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} ist zu groß (max. 10 MB)`);
          continue;
        }
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1] || "");
          };
          reader.readAsDataURL(file);
        });
        const result = await uploadMutation.mutateAsync({
          fileName: file.name,
          fileData: base64,
          contentType: file.type,
          fileSize: file.size,
        });
        setAttachments((prev) => [...prev, result]);
      }
      toast.success("Datei(en) hochgeladen");
    } catch (err: any) {
      toast.error("Upload fehlgeschlagen: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!clientName || !clientEmail || selectedServices.length === 0 || !description) {
      toast.error("Bitte fülle alle Pflichtfelder aus.");
      return;
    }
    submitMutation.mutate({
      clientName,
      clientEmail,
      clientPhone: clientPhone || undefined,
      companyName: companyName || undefined,
      companyWebsite: companyWebsite || undefined,
      instagramUrl: instagramUrl || undefined,
      tiktokUrl: tiktokUrl || undefined,
      serviceTypes: selectedServices,
      budgetRange: budgetRange || undefined,
      description,
      attachments: attachments.length > 0 ? attachments : undefined,
    });
  };

  const canProceedStep1 = selectedServices.length > 0;
  const canProceedStep2 = clientName.length > 0 && clientEmail.length > 0;
  const canProceedStep3 = description.length >= 10;

  if (submitted) {
    return (
      <div style={styles.page}>
        <style>{pageStyles}</style>
        <div style={styles.successWrap}>
          <div style={styles.successIcon}>✓</div>
          <h1 style={styles.successTitle}>Anfrage gesendet!</h1>
          <p style={styles.successDesc}>
            Vielen Dank für deine Anfrage. Wir analysieren dein Projekt mit unserer KI und melden uns innerhalb von 24 Stunden bei dir.
          </p>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <style>{pageStyles}</style>

      {/* Background effects */}
      <div style={styles.bgOrb1} />
      <div style={styles.bgOrb2} />
      <div style={styles.gridBg} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoWrap} onClick={() => navigate("/")}>
          <div style={styles.logoDot} />
          <span style={styles.logoName}>informakit</span>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.content}>
        <div style={styles.titleSection}>
          <div className="anfrage-pretitle">// projekt anfragen</div>
          <h1 style={styles.title}>
            Erzähl uns von deinem <span style={styles.titleGrad}>Projekt.</span>
          </h1>
          <p style={styles.subtitle}>
            In wenigen Schritten zur individuellen Lösung — unsere KI analysiert dein Projekt automatisch.
          </p>
        </div>

        {/* Progress */}
        <div style={styles.progressWrap}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={styles.progressStep}>
              <div
                style={{
                  ...styles.progressDot,
                  ...(step >= s ? styles.progressDotActive : {}),
                }}
              >
                {step > s ? "✓" : s}
              </div>
              <span
                style={{
                  ...styles.progressLabel,
                  ...(step >= s ? styles.progressLabelActive : {}),
                }}
              >
                {s === 1 ? "Services" : s === 2 ? "Kontakt" : s === 3 ? "Projekt" : "Absenden"}
              </span>
            </div>
          ))}
          <div style={styles.progressLine}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((step - 1) / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="anfrage-step-anim" style={styles.stepWrap}>
            <h2 style={styles.stepTitle}>Welche Services brauchst du?</h2>
            <p style={styles.stepDesc}>Wähle einen oder mehrere Bereiche aus.</p>
            <div style={styles.serviceGrid}>
              {SERVICE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleService(s.id)}
                  className={`service-chip ${selectedServices.includes(s.id) ? "active" : ""}`}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
            <div style={styles.stepActions}>
              <button style={styles.backLink} onClick={() => navigate("/")}>
                ← Zurück
              </button>
              <button
                style={{
                  ...styles.nextBtn,
                  opacity: canProceedStep1 ? 1 : 0.4,
                  pointerEvents: canProceedStep1 ? "auto" : "none",
                }}
                onClick={() => setStep(2)}
              >
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="anfrage-step-anim" style={styles.stepWrap}>
            <h2 style={styles.stepTitle}>Wie können wir dich erreichen?</h2>
            <p style={styles.stepDesc}>Deine Kontaktdaten bleiben vertraulich.</p>
            <div style={styles.formGrid}>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Name *</label>
                <input
                  style={styles.input}
                  placeholder="Max Mustermann"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>E-Mail *</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="max@unternehmen.de"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Telefon</label>
                <input
                  style={styles.input}
                  type="tel"
                  placeholder="+49 123 456 789"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Unternehmen</label>
                <input
                  style={styles.input}
                  placeholder="Muster GmbH"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div style={{ ...styles.fieldWrap, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Website</label>
                <input
                  style={styles.input}
                  placeholder="https://www.muster.de"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                />
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Instagram <span style={{ opacity: 0.45, fontWeight: 400 }}>(optional)</span></label>
                <input
                  style={styles.input}
                  placeholder="https://instagram.com/deinprofil"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                />
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>TikTok <span style={{ opacity: 0.45, fontWeight: 400 }}>(optional)</span></label>
                <input
                  style={styles.input}
                  placeholder="https://tiktok.com/@deinprofil"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                />
              </div>
            </div>
            <div style={styles.stepActions}>
              <button style={styles.backLink} onClick={() => setStep(1)}>
                ← Zurück
              </button>
              <button
                style={{
                  ...styles.nextBtn,
                  opacity: canProceedStep2 ? 1 : 0.4,
                  pointerEvents: canProceedStep2 ? "auto" : "none",
                }}
                onClick={() => setStep(3)}
              >
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Project */}
        {step === 3 && (
          <div className="anfrage-step-anim" style={styles.stepWrap}>
            <h2 style={styles.stepTitle}>Beschreib dein Projekt</h2>
            <p style={styles.stepDesc}>Je mehr Details, desto besser können wir helfen.</p>
            <div style={styles.formGridSingle}>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Projektbeschreibung *</label>
                <textarea
                  style={{ ...styles.input, minHeight: 160, resize: "vertical" as const }}
                  placeholder="Erzähl uns von deinem Projekt, deinen Zielen und Herausforderungen..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Budget-Rahmen</label>
                <div style={styles.budgetGrid}>
                  {BUDGET_OPTIONS.map((b) => (
                    <button
                      key={b}
                      className={`budget-chip ${budgetRange === b ? "active" : ""}`}
                      onClick={() => setBudgetRange(budgetRange === b ? "" : b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.fieldWrap}>
                <label style={styles.label}>Dateien anhängen (optional)</label>
                <div
                  className="file-drop"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                  {uploading ? (
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>Wird hochgeladen...</span>
                  ) : (
                    <>
                      <span style={{ fontSize: 28, opacity: 0.4 }}>📎</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                        Klicke hier oder ziehe Dateien hierher (max. 10 MB)
                      </span>
                    </>
                  )}
                </div>
                {attachments.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {attachments.map((a, i) => (
                      <div key={i} style={styles.fileChip}>
                        📄 {a.name}
                        <button
                          style={styles.fileRemove}
                          onClick={() => setAttachments((prev) => prev.filter((_, j) => j !== i))}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div style={styles.stepActions}>
              <button style={styles.backLink} onClick={() => setStep(2)}>
                ← Zurück
              </button>
              <button
                style={{
                  ...styles.nextBtn,
                  opacity: canProceedStep3 ? 1 : 0.4,
                  pointerEvents: canProceedStep3 ? "auto" : "none",
                }}
                onClick={() => setStep(4)}
              >
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="anfrage-step-anim" style={styles.stepWrap}>
            <h2 style={styles.stepTitle}>Zusammenfassung</h2>
            <p style={styles.stepDesc}>Überprüfe deine Angaben und sende die Anfrage ab.</p>
            <div style={styles.reviewCard}>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Name</span>
                <span style={styles.reviewValue}>{clientName}</span>
              </div>
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>E-Mail</span>
                <span style={styles.reviewValue}>{clientEmail}</span>
              </div>
              {clientPhone && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Telefon</span>
                  <span style={styles.reviewValue}>{clientPhone}</span>
                </div>
              )}
              {companyName && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Unternehmen</span>
                  <span style={styles.reviewValue}>{companyName}</span>
                </div>
              )}
              {companyWebsite && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Website</span>
                  <span style={styles.reviewValue}>{companyWebsite}</span>
                </div>
              )}
              <div style={styles.reviewRow}>
                <span style={styles.reviewLabel}>Services</span>
                <span style={styles.reviewValue}>{selectedServices.join(", ")}</span>
              </div>
              {budgetRange && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Budget</span>
                  <span style={styles.reviewValue}>{budgetRange}</span>
                </div>
              )}
              <div style={{ ...styles.reviewRow, flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <span style={styles.reviewLabel}>Beschreibung</span>
                <span style={{ ...styles.reviewValue, whiteSpace: "pre-wrap" }}>{description}</span>
              </div>
              {attachments.length > 0 && (
                <div style={styles.reviewRow}>
                  <span style={styles.reviewLabel}>Dateien</span>
                  <span style={styles.reviewValue}>{attachments.map((a) => a.name).join(", ")}</span>
                </div>
              )}
            </div>
            <div style={styles.stepActions}>
              <button style={styles.backLink} onClick={() => setStep(3)}>
                ← Zurück
              </button>
              <button
                style={{
                  ...styles.submitBtn,
                  opacity: submitMutation.isPending ? 0.6 : 1,
                }}
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Wird gesendet..." : "Anfrage absenden →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const pageStyles = `
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes orbFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-20px) scale(1.1)}}

.anfrage-pretitle{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:9999px;background:rgba(139,92,246,0.10);border:1px solid rgba(139,92,246,0.25);backdrop-filter:blur(10px);margin-bottom:24px;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#fff;font-family:'Fira Code',monospace;animation:fadeUp 0.5s ease-out both}
.anfrage-pretitle::before{content:'';width:5px;height:5px;border-radius:50%;background:#8B5CF6;box-shadow:0 0 8px rgba(139,92,246,0.8)}

.anfrage-step-anim{animation:fadeUp 0.4s ease-out both}

.service-chip{display:flex;flex-direction:column;align-items:center;gap:10px;padding:24px 16px;border-radius:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.6);font-size:14px;font-weight:600;font-family:'Inter',sans-serif}
.service-chip:hover{background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.3);color:#fff}
.service-chip.active{background:rgba(139,92,246,0.15);border-color:rgba(139,92,246,0.5);color:#fff;box-shadow:0 0 20px rgba(139,92,246,0.2)}

.budget-chip{padding:10px 18px;border-radius:9999px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.5);font-size:13px;font-weight:600;font-family:'Inter',sans-serif}
.budget-chip:hover{background:rgba(139,92,246,0.08);border-color:rgba(139,92,246,0.3);color:#fff}
.budget-chip.active{background:rgba(139,92,246,0.15);border-color:rgba(139,92,246,0.5);color:#fff}

.file-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:32px;border-radius:12px;border:2px dashed rgba(255,255,255,0.1);cursor:pointer;transition:all 0.2s;min-height:100px}
.file-drop:hover{border-color:rgba(139,92,246,0.4);background:rgba(139,92,246,0.05)}
`;

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#000",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },
  bgOrb1: {
    position: "fixed",
    top: "20%",
    left: "-10%",
    width: 500,
    height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  bgOrb2: {
    position: "fixed",
    bottom: "10%",
    right: "-10%",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 70%)",
    filter: "blur(80px)",
    pointerEvents: "none",
    zIndex: 0,
  },
  gridBg: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    backgroundSize: "60px 60px",
    backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
  },
  header: {
    position: "relative",
    zIndex: 10,
    padding: "22px 30px",
    display: "flex",
    alignItems: "center",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
  },
  logoDot: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    boxShadow: "0 0 16px rgba(139,92,246,0.6)",
  },
  logoName: {
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    letterSpacing: "-0.2px",
  },
  content: {
    position: "relative",
    zIndex: 5,
    maxWidth: 720,
    margin: "0 auto",
    padding: "40px 24px 120px",
  },
  titleSection: {
    textAlign: "center" as const,
    marginBottom: 48,
  },
  title: {
    fontSize: "clamp(28px, 5vw, 44px)",
    fontWeight: 900,
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
    margin: 0,
  },
  titleGrad: {
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.4)",
    marginTop: 16,
    lineHeight: 1.6,
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    marginBottom: 48,
    position: "relative" as const,
  },
  progressStep: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 8,
    zIndex: 2,
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.3)",
    fontFamily: "'Fira Code', monospace",
    transition: "all 0.3s",
  },
  progressDotActive: {
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    borderColor: "transparent",
    color: "#fff",
    boxShadow: "0 0 16px rgba(139,92,246,0.4)",
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.2)",
    fontFamily: "'Fira Code', monospace",
    transition: "color 0.3s",
  },
  progressLabelActive: {
    color: "rgba(255,255,255,0.6)",
  },
  progressLine: {
    position: "absolute" as const,
    top: 18,
    left: "15%",
    right: "15%",
    height: 2,
    background: "rgba(255,255,255,0.06)",
    zIndex: 1,
    borderRadius: 1,
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #8B5CF6, #D946EF)",
    borderRadius: 1,
    transition: "width 0.4s ease",
  },
  stepWrap: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 8,
    letterSpacing: "-0.02em",
  },
  stepDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 32,
  },
  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 32,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginBottom: 32,
  },
  formGridSingle: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 24,
    marginBottom: 32,
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.45)",
    fontFamily: "'Fira Code', monospace",
  },
  input: {
    padding: "14px 16px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: 15,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
    width: "100%",
    boxSizing: "border-box" as const,
  },
  budgetGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
  },
  fileChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 14px",
    borderRadius: 9999,
    background: "rgba(139,92,246,0.1)",
    border: "1px solid rgba(139,92,246,0.3)",
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: 500,
  },
  fileRemove: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.4)",
    fontSize: 16,
    cursor: "pointer",
    padding: 0,
    lineHeight: 1,
  },
  stepActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
  },
  backLink: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 0",
    transition: "color 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  nextBtn: {
    padding: "14px 32px",
    borderRadius: 9999,
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 24px rgba(139,92,246,0.4)",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  submitBtn: {
    padding: "16px 36px",
    borderRadius: 9999,
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    color: "#fff",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 32px rgba(139,92,246,0.5)",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  reviewCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  reviewRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "rgba(255,255,255,0.35)",
    fontFamily: "'Fira Code', monospace",
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: 500,
    color: "rgba(255,255,255,0.8)",
    textAlign: "right" as const,
  },
  successWrap: {
    position: "relative" as const,
    zIndex: 5,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    textAlign: "center" as const,
    padding: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 36,
    color: "#fff",
    marginBottom: 32,
    boxShadow: "0 0 40px rgba(139,92,246,0.4)",
  },
  successTitle: {
    fontSize: 36,
    fontWeight: 900,
    fontStyle: "italic",
    color: "#fff",
    marginBottom: 16,
    letterSpacing: "-0.03em",
  },
  successDesc: {
    fontSize: 16,
    color: "rgba(255,255,255,0.5)",
    maxWidth: 500,
    lineHeight: 1.7,
    marginBottom: 40,
  },
  backBtn: {
    padding: "14px 32px",
    borderRadius: 9999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
};
