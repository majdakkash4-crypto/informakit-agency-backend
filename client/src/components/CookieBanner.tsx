import { useState, useEffect } from "react";
import { X, Cookie, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "ik_cookie_consent";

type ConsentState = "accepted" | "essential" | null;

export function useCookieConsent() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored as ConsentState;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const essential = () => {
    localStorage.setItem(STORAGE_KEY, "essential");
    setVisible(false);
  };

  return (
    <>
      <style>{`
        .ck-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.40);z-index:99990;animation:ck-fade 0.3s ease}
        @keyframes ck-fade{from{opacity:0}to{opacity:1}}
        .ck-banner{position:fixed;bottom:0;left:0;right:0;z-index:99991;background:#0f0f0f;border-top:1px solid rgba(139,92,246,0.30);padding:20px 24px 24px;animation:ck-up 0.4s cubic-bezier(0.16,1,0.3,1)}
        @keyframes ck-up{from{transform:translateY(100%)}to{transform:translateY(0)}}
        .ck-inner{max-width:960px;margin:0 auto}
        .ck-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px}
        .ck-title{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:700;color:#fff;letter-spacing:-0.01em}
        .ck-close{background:none;border:none;cursor:pointer;color:rgba(255,255,255,0.35);padding:4px;border-radius:6px;transition:color 0.2s;display:flex;align-items:center}
        .ck-close:hover{color:#fff}
        .ck-text{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6;margin-bottom:16px}
        .ck-text a{color:#A78BFA;text-decoration:none}
        .ck-text a:hover{text-decoration:underline}
        .ck-detail{font-size:12px;color:rgba(255,255,255,0.38);line-height:1.6;margin-bottom:16px;padding:12px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.06)}
        .ck-detail h4{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.10em;color:rgba(255,255,255,0.50);margin-bottom:8px}
        .ck-detail ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px}
        .ck-detail li{display:flex;align-items:flex-start;gap:8px}
        .ck-detail li::before{content:'•';color:#8B5CF6;flex-shrink:0}
        .ck-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
        .ck-btn-primary{padding:11px 22px;border-radius:9999px;background:linear-gradient(135deg,#8B5CF6,#D946EF);border:none;color:#fff;font-size:13px;font-weight:700;cursor:pointer;transition:opacity 0.2s;white-space:nowrap}
        .ck-btn-primary:hover{opacity:0.88}
        .ck-btn-secondary{padding:11px 22px;border-radius:9999px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.70);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap}
        .ck-btn-secondary:hover{background:rgba(255,255,255,0.10);color:#fff}
        .ck-toggle{background:none;border:none;color:#A78BFA;font-size:12px;font-weight:600;cursor:pointer;padding:0;text-decoration:underline;white-space:nowrap;margin-left:auto}
        @media(max-width:640px){
          .ck-banner{padding:16px 16px 20px}
          .ck-actions{flex-direction:column;align-items:stretch}
          .ck-btn-primary,.ck-btn-secondary{text-align:center}
          .ck-toggle{margin:0;text-align:center}
        }
      `}</style>

      <div className="ck-overlay" onClick={essential} />

      <div className="ck-banner" role="dialog" aria-label="Cookie-Einstellungen">
        <div className="ck-inner">
          <div className="ck-head">
            <div className="ck-title">
              <Cookie size={16} color="#A78BFA" />
              Cookies & Datenschutz
            </div>
            <button className="ck-close" onClick={essential} aria-label="Schließen">
              <X size={16} />
            </button>
          </div>

          <p className="ck-text">
            Wir verwenden Cookies um die Website zu betreiben und — mit deiner Zustimmung — anonyme Nutzungsstatistiken zu erheben. Keine Weitergabe an Dritte. Mehr dazu in unserer{" "}
            <a href="/datenschutz">Datenschutzerklärung</a>.
          </p>

          {expanded && (
            <div className="ck-detail">
              <h4>Cookie-Kategorien</h4>
              <ul>
                <li>
                  <span>
                    <strong style={{ color: "rgba(255,255,255,0.75)" }}>Notwendig (immer aktiv)</strong> — Session-Cookie für den Admin-Bereich. Kein Tracking. Wird nach Sitzungsende gelöscht.
                  </span>
                </li>
                <li>
                  <span>
                    <strong style={{ color: "rgba(255,255,255,0.75)" }}>Analyse (optional)</strong> — Umami Analytics: datenschutzfreundliche Statistiken ohne persönliche Daten, kein Fingerprinting, keine Cross-Site-Tracking.
                  </span>
                </li>
                <li>
                  <span>
                    <strong style={{ color: "rgba(255,255,255,0.75)" }}>Google Fonts</strong> — Schriftarten werden von Google-Servern geladen. Dabei wird deine IP-Adresse übertragen. Mit „Nur Notwendige" werden Schriften lokal geladen.
                  </span>
                </li>
              </ul>
            </div>
          )}

          <div className="ck-actions">
            <button className="ck-btn-primary" onClick={accept}>
              <ShieldCheck size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Alles akzeptieren
            </button>
            <button className="ck-btn-secondary" onClick={essential}>
              Nur Notwendige
            </button>
            <button className="ck-toggle" onClick={() => setExpanded(e => !e)}>
              {expanded ? "Weniger anzeigen ▲" : "Details anzeigen ▼"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
