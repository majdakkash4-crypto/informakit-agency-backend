import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Datenschutz() {
  const [, navigate] = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .legal-wrap { max-width: 760px; margin: 0 auto; padding: 60px 24px 100px; }
        .legal-back { display: inline-flex; align-items: center; gap: 8px; background: none; border: none; color: rgba(255,255,255,0.40); font-size: 13px; font-weight: 600; cursor: pointer; padding: 0; margin-bottom: 48px; letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.2s; }
        .legal-back:hover { color: #fff; }
        .legal-badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 9999px; background: rgba(139,92,246,0.10); border: 1px solid rgba(139,92,246,0.25); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #A78BFA; margin-bottom: 24px; font-family: 'Fira Code', monospace; }
        .legal-title { font-size: clamp(32px, 6vw, 52px); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 8px; }
        .legal-subtitle { font-size: 15px; color: rgba(255,255,255,0.38); margin-bottom: 48px; line-height: 1.6; }
        .legal-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 40px 0; }
        .legal-section { margin-bottom: 36px; }
        .legal-section h2 { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px; letter-spacing: -0.01em; }
        .legal-section h3 { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.70); margin: 20px 0 8px; }
        .legal-section p { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.8; margin-bottom: 10px; }
        .legal-section ul { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.8; padding-left: 20px; margin-bottom: 10px; }
        .legal-section ul li { margin-bottom: 4px; }
        .legal-section a { color: #A78BFA; text-decoration: none; }
        .legal-section a:hover { text-decoration: underline; }
        .legal-box { background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.18); border-radius: 10px; padding: 16px 20px; margin: 16px 0; }
        .legal-box p { margin: 0; font-size: 13px; }
        .legal-tag { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .tag-required { background: rgba(239,68,68,0.15); color: #FCA5A5; }
        .tag-optional { background: rgba(16,185,129,0.15); color: #6EE7B7; }
        .tag-external { background: rgba(249,115,22,0.15); color: #FCD34D; }
        .legal-rights { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
        .legal-right-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 14px 16px; }
        .legal-right-item h4 { font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.75); margin-bottom: 6px; }
        .legal-right-item p { font-size: 12px; color: rgba(255,255,255,0.40); margin: 0; line-height: 1.6; }
        .legal-updated { font-size: 12px; color: rgba(255,255,255,0.25); font-family: 'Fira Code', monospace; letter-spacing: 0.05em; }
        @media(max-width:640px) { .legal-rights { grid-template-columns: 1fr; } }
      `}</style>

      <div className="legal-wrap">
        <button className="legal-back" onClick={() => navigate("/")}>
          <ArrowLeft size={14} />
          Zurück zur Startseite
        </button>

        <div className="legal-badge">// datenschutz</div>
        <h1 className="legal-title">Datenschutzerklärung</h1>
        <p className="legal-subtitle">
          Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Diese Erklärung informiert dich über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten gemäß DSGVO.
        </p>

        <div className="legal-divider" />

        {/* 1. Verantwortlicher */}
        <div className="legal-section">
          <h2>1. Verantwortlicher</h2>
          <p>
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>Majd Akkash — InformaKit</strong><br />
            E-Mail: <a href="mailto:hallo@informakit.de">hallo@informakit.de</a><br />
            Website: <a href="https://www.informakit.de">www.informakit.de</a>
          </p>
        </div>

        <div className="legal-divider" />

        {/* 2. Cookies */}
        <div className="legal-section">
          <h2>2. Cookies & Speicherung</h2>

          <div className="legal-box">
            <span className="legal-tag tag-required">Notwendig</span>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, color: "rgba(255,255,255,0.70)" }}>Session-Cookie (Admin-Login)</h3>
            <p>Ein HTTP-only Session-Cookie wird ausschließlich für den passwortgeschützten Admin-Bereich gesetzt. Er enthält keine personenbezogenen Daten, nur einen signierten Token. Er wird nach dem Logout oder nach einem Jahr automatisch gelöscht. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
          </div>

          <div className="legal-box">
            <span className="legal-tag tag-optional">Optional</span>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, color: "rgba(255,255,255,0.70)" }}>Cookie-Einwilligung (localStorage)</h3>
            <p>Deine Cookie-Entscheidung wird im lokalen Speicher deines Browsers gespeichert. Dies ist technisch notwendig um das Banner nicht bei jedem Besuch anzuzeigen. Keine Übertragung an Server. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).</p>
          </div>

          <div className="legal-box">
            <span className="legal-tag tag-optional">Optional — nur mit Zustimmung</span>
            <h3 style={{ margin: "0 0 6px", fontSize: 14, color: "rgba(255,255,255,0.70)" }}>Umami Analytics</h3>
            <p>Falls du „Alles akzeptieren" gewählt hast, werden anonyme Seitenaufrufe erfasst. Umami ist datenschutzfreundlich: keine Cookies, kein Fingerprinting, keine persönlichen Daten, kein Cross-Site-Tracking. Die Daten werden auf unserem Server gespeichert und nicht an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.</p>
          </div>
        </div>

        <div className="legal-divider" />

        {/* 3. Kontaktformular */}
        <div className="legal-section">
          <h2>3. Projektanfragen (Kontaktformular)</h2>
          <p>
            Wenn du eine Projektanfrage über unsere Website sendest, erheben wir folgende Daten:
          </p>
          <ul>
            <li>Name (Pflichtfeld)</li>
            <li>E-Mail-Adresse (Pflichtfeld)</li>
            <li>Telefonnummer (optional)</li>
            <li>Unternehmensname und Website (optional)</li>
            <li>Instagram- / TikTok-Profil (optional)</li>
            <li>Projektbeschreibung und Budget (optional)</li>
            <li>Anhänge / Dateien (optional)</li>
          </ul>
          <p>
            Diese Daten werden ausschließlich zur Bearbeitung deiner Anfrage verwendet, in unserer gesicherten Datenbank (Supabase, EU-Server) gespeichert und nicht an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
          </p>
          <p>
            Die Daten werden gelöscht, sobald sie für die Zweckerfüllung nicht mehr benötigt werden, spätestens nach 3 Jahren.
          </p>
        </div>

        <div className="legal-divider" />

        {/* 4. Google Fonts */}
        <div className="legal-section">
          <h2>4. Google Fonts</h2>
          <div className="legal-box">
            <span className="legal-tag tag-external">Externer Dienst</span>
            <p style={{ marginTop: 8 }}>
              Diese Website lädt Schriftarten von Google-Servern (fonts.googleapis.com). Dabei wird deine IP-Adresse an Google LLC, USA übertragen. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Google ist unter dem EU-US Data Privacy Framework zertifiziert.
            </p>
            <p>
              Datenschutzerklärung Google: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>
            </p>
          </div>
        </div>

        <div className="legal-divider" />

        {/* 5. Hosting */}
        <div className="legal-section">
          <h2>5. Hosting & Infrastruktur</h2>
          <h3>Railway (Hosting)</h3>
          <p>Die Website wird auf Railway (Railway Corp., USA) gehostet. Bei jedem Aufruf werden technische Verbindungsdaten (IP-Adresse, Zeitpunkt, Browser) kurzfristig in Server-Logs gespeichert. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO. Mehr: <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer">railway.app/legal/privacy</a></p>

          <h3>Supabase (Datenbank)</h3>
          <p>Projektanfragen werden in einer PostgreSQL-Datenbank bei Supabase (EU-Region) gespeichert. Supabase ist DSGVO-konform. Mehr: <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a></p>
        </div>

        <div className="legal-divider" />

        {/* 6. Rechte */}
        <div className="legal-section">
          <h2>6. Deine Rechte (Art. 12–22 DSGVO)</h2>
          <div className="legal-rights">
            <div className="legal-right-item">
              <h4>Auskunft</h4>
              <p>Du hast das Recht zu erfahren, welche Daten wir von dir gespeichert haben (Art. 15 DSGVO).</p>
            </div>
            <div className="legal-right-item">
              <h4>Berichtigung</h4>
              <p>Du kannst die Korrektur unrichtiger Daten verlangen (Art. 16 DSGVO).</p>
            </div>
            <div className="legal-right-item">
              <h4>Löschung</h4>
              <p>Du kannst die Löschung deiner Daten verlangen, sofern keine Aufbewahrungspflicht besteht (Art. 17 DSGVO).</p>
            </div>
            <div className="legal-right-item">
              <h4>Einschränkung</h4>
              <p>Du kannst die Einschränkung der Verarbeitung verlangen (Art. 18 DSGVO).</p>
            </div>
            <div className="legal-right-item">
              <h4>Widerspruch</h4>
              <p>Du kannst der Verarbeitung deiner Daten widersprechen (Art. 21 DSGVO).</p>
            </div>
            <div className="legal-right-item">
              <h4>Beschwerde</h4>
              <p>Du hast das Recht, eine Beschwerde bei der zuständigen Aufsichtsbehörde einzureichen (Art. 77 DSGVO).</p>
            </div>
          </div>
          <p style={{ marginTop: 20 }}>
            Zur Ausübung deiner Rechte wende dich an: <a href="mailto:hallo@informakit.de">hallo@informakit.de</a>
          </p>
        </div>

        <div className="legal-section">
          <h2>7. Widerruf der Einwilligung</h2>
          <p>
            Du kannst deine Cookie-Einwilligung jederzeit widerrufen, indem du den Browser-LocalStorage löschst (Entwicklertools → Application → Local Storage → Eintrag <code style={{ background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>ik_cookie_consent</code> löschen) oder den Browser-Cache leerst. Beim nächsten Besuch erscheint das Banner erneut.
          </p>
        </div>

        <div className="legal-divider" />

        <p className="legal-updated">Stand: April 2026 — Wir behalten uns vor, diese Datenschutzerklärung bei Änderungen der Rechtslage oder unserer Dienste zu aktualisieren.</p>
      </div>
    </div>
  );
}
