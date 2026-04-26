import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DashboardLayoutSkeleton } from "@/components/DashboardLayoutSkeleton";
import {
  Inbox,
  Search,
  Filter,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  BarChart3,
  FileText,
  RefreshCw,
  LogOut,
  Home,
  Loader2,
} from "lucide-react";

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: "Neu", color: "#8B5CF6", icon: Inbox },
  analyzing: { label: "Analyse läuft", color: "#F59E0B", icon: Loader2 },
  analyzed: { label: "Analysiert", color: "#10B981", icon: CheckCircle2 },
  in_progress: { label: "In Bearbeitung", color: "#3B82F6", icon: Clock },
  completed: { label: "Abgeschlossen", color: "#6B7280", icon: CheckCircle2 },
  archived: { label: "Archiviert", color: "#4B5563", icon: Archive },
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

export default function AdminDashboard() {
  const { loading, user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [serviceFilter, setServiceFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data, isLoading, refetch } = trpc.admin.listInquiries.useQuery(
    {
      status: statusFilter || undefined,
      serviceType: serviceFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      limit: 100,
    },
    { enabled: !!user && user.role === "admin" }
  );

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    if (!searchQuery) return data.items;
    const q = searchQuery.toLowerCase();
    return data.items.filter(
      (item) =>
        item.clientName.toLowerCase().includes(q) ||
        (item.companyName && item.companyName.toLowerCase().includes(q)) ||
        item.clientEmail.toLowerCase().includes(q)
    );
  }, [data?.items, searchQuery]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <div style={styles.authIcon}>🔒</div>
          <h1 style={styles.authTitle}>Admin-Zugang</h1>
          <p style={styles.authDesc}>Melde dich an, um auf das Dashboard zuzugreifen.</p>
          <button style={styles.authBtn} onClick={() => (window.location.href = getLoginUrl())}>
            Anmelden
          </button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div style={styles.authPage}>
        <div style={styles.authCard}>
          <div style={styles.authIcon}>⛔</div>
          <h1 style={styles.authTitle}>Kein Zugriff</h1>
          <p style={styles.authDesc}>Du hast keine Admin-Berechtigung für dieses Dashboard.</p>
          <button style={styles.authBtn} onClick={() => navigate("/")}>
            Zurück zur Startseite
          </button>
        </div>
      </div>
    );
  }

  const statusCounts = data?.items?.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div style={styles.dashPage}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoWrap} onClick={() => navigate("/")}>
            <div style={styles.logoDot} />
            <span style={styles.logoName}>informakit</span>
          </div>
          <span style={styles.adminBadge}>Admin</span>
        </div>

        <nav style={styles.sidebarNav}>
          <button style={{ ...styles.navItem, ...styles.navItemActive }}>
            <Inbox size={18} /> Anfragen
          </button>
          <button style={styles.navItem} onClick={() => navigate("/")}>
            <Home size={18} /> Website
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>{user.name?.charAt(0)?.toUpperCase() || "A"}</div>
            <div style={styles.userMeta}>
              <span style={styles.userName}>{user.name}</span>
              <span style={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={styles.mainContent}>
        {/* Top bar */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.pageTitle}>Anfragen</h1>
            <p style={styles.pageDesc}>{data?.total || 0} Anfragen insgesamt</p>
          </div>
          <button style={styles.refreshBtn} onClick={() => refetch()}>
            <RefreshCw size={16} /> Aktualisieren
          </button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: "Neu", count: statusCounts["new"] || 0, color: "#8B5CF6", icon: Inbox },
            { label: "In Analyse", count: statusCounts["analyzing"] || 0, color: "#F59E0B", icon: BarChart3 },
            { label: "Analysiert", count: statusCounts["analyzed"] || 0, color: "#10B981", icon: CheckCircle2 },
            { label: "In Bearbeitung", count: statusCounts["in_progress"] || 0, color: "#3B82F6", icon: Clock },
          ].map((stat) => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: `${stat.color}20`, color: stat.color }}>
                <stat.icon size={18} />
              </div>
              <div>
                <div style={styles.statNum}>{stat.count}</div>
                <div style={styles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filtersRow}>
          <div style={styles.searchWrap}>
            <Search size={16} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              style={styles.searchInput}
              placeholder="Suche nach Name, Firma oder E-Mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={styles.filterGroup}>
            <Filter size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
            <select
              style={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Alle Status</option>
              <option value="new">Neu</option>
              <option value="analyzing">Analyse läuft</option>
              <option value="analyzed">Analysiert</option>
              <option value="in_progress">In Bearbeitung</option>
              <option value="completed">Abgeschlossen</option>
              <option value="archived">Archiviert</option>
            </select>
            <input
              type="date"
              style={styles.filterSelect}
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="Von"
            />
            <input
              type="date"
              style={styles.filterSelect}
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="Bis"
            />
            <select
              style={styles.filterSelect}
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
            >
              <option value="">Alle Services</option>
              <option value="Social Media">Social Media</option>
              <option value="Web Design">Web Design</option>
              <option value="Development">Development</option>
              <option value="SEO">SEO</option>
              <option value="KI & Automation">KI & Automation</option>
              <option value="Branding">Branding</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Beratung">Beratung</option>
            </select>
          </div>
        </div>

        {/* Inquiry list */}
        <div style={styles.listWrap}>
          {isLoading ? (
            <div style={styles.loadingState}>
              <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#8B5CF6" }} />
              <span>Lade Anfragen...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={styles.emptyState}>
              <Inbox size={40} style={{ color: "rgba(255,255,255,0.15)" }} />
              <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 16 }}>Keine Anfragen gefunden</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const status = STATUS_MAP[item.status] || STATUS_MAP["new"];
              const StatusIcon = status.icon;
              return (
                <div
                  key={item.id}
                  style={styles.inquiryCard}
                  onClick={() => navigate(`/admin/inquiry/${item.id}`)}
                  className="inquiry-card-hover"
                >
                  <div style={styles.cardLeft}>
                    <div style={{ ...styles.statusDot, background: status.color }} />
                    <div>
                      <div style={styles.cardName}>{item.clientName}</div>
                      <div style={styles.cardCompany}>{item.companyName || "—"}</div>
                    </div>
                  </div>
                  <div style={styles.cardCenter}>
                    <div style={styles.serviceTags}>
                      {(item.serviceTypes as string[]).slice(0, 3).map((s) => (
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
                      {(item.serviceTypes as string[]).length > 3 && (
                        <span style={styles.moreTag}>+{(item.serviceTypes as string[]).length - 3}</span>
                      )}
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <div style={{ ...styles.statusBadge, background: `${status.color}15`, color: status.color, borderColor: `${status.color}30` }}>
                      <StatusIcon size={12} />
                      {status.label}
                    </div>
                    <div style={styles.cardDate}>
                      {new Date(item.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                    <ChevronRight size={16} style={{ color: "rgba(255,255,255,0.2)" }} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        .inquiry-card-hover:hover { background: rgba(255,255,255,0.04) !important; border-color: rgba(139,92,246,0.2) !important; }
        @media (max-width: 900px) {
          .admin-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
  authIcon: { fontSize: 48, marginBottom: 24 },
  authTitle: { fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 12 },
  authDesc: { fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 32, lineHeight: 1.6 },
  authBtn: {
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
  dashPage: {
    display: "flex",
    minHeight: "100vh",
    background: "#050508",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: 260,
    borderRight: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(10,10,15,0.95)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "20px 20px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 9, cursor: "pointer" },
  logoDot: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    boxShadow: "0 0 12px rgba(139,92,246,0.5)",
  },
  logoName: { fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "-0.2px" },
  adminBadge: {
    padding: "4px 10px",
    borderRadius: 9999,
    background: "rgba(139,92,246,0.15)",
    border: "1px solid rgba(139,92,246,0.3)",
    fontSize: 11,
    fontWeight: 600,
    color: "#8B5CF6",
    fontFamily: "'Fira Code', monospace",
    letterSpacing: "0.05em",
  },
  sidebarNav: { padding: "12px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4 },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 10,
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.45)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
  },
  navItemActive: {
    background: "rgba(139,92,246,0.1)",
    color: "#fff",
    borderLeft: "none",
  },
  sidebarFooter: {
    padding: "16px 16px",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #8B5CF6, #D946EF)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
  },
  userMeta: { display: "flex", flexDirection: "column" },
  userName: { fontSize: 13, fontWeight: 600, color: "#fff" },
  userEmail: { fontSize: 11, color: "rgba(255,255,255,0.35)" },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.3)",
    cursor: "pointer",
    padding: 8,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mainContent: { flex: 1, padding: "24px 32px", overflowY: "auto" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },
  pageTitle: { fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: 0 },
  pageDesc: { fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 },
  refreshBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "'Inter', sans-serif",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 28,
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 20px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statNum: { fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "'Fira Code', monospace" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: 500, marginTop: 2 },
  filtersRow: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 16px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    flex: 1,
    minWidth: 200,
  },
  searchInput: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    width: "100%",
    fontFamily: "'Inter', sans-serif",
  },
  filterGroup: { display: "flex", alignItems: "center", gap: 8 },
  filterSelect: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    cursor: "pointer",
  },
  listWrap: { display: "flex", flexDirection: "column", gap: 8 },
  inquiryCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    cursor: "pointer",
    transition: "all 0.2s",
    gap: 16,
  },
  cardLeft: { display: "flex", alignItems: "center", gap: 14, minWidth: 180 },
  statusDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  cardName: { fontSize: 14, fontWeight: 600, color: "#fff" },
  cardCompany: { fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  cardCenter: { flex: 1, display: "flex", alignItems: "center" },
  serviceTags: { display: "flex", gap: 6, flexWrap: "wrap" },
  serviceTag: {
    padding: "4px 10px",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
    border: "1px solid",
    whiteSpace: "nowrap",
  },
  moreTag: {
    padding: "4px 8px",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.04)",
  },
  cardRight: { display: "flex", alignItems: "center", gap: 14, flexShrink: 0 },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 9999,
    fontSize: 11,
    fontWeight: 600,
    border: "1px solid",
    whiteSpace: "nowrap",
  },
  cardDate: { fontSize: 12, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", fontFamily: "'Fira Code', monospace" },
  loadingState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 60,
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 80,
  },
};
