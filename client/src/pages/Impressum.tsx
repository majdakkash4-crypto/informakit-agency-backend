import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
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
        .legal-section h3 { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.70); margin: 16px 0 8px; letter-spacing: 0.02em; }
        .legal-section p { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.8; margin-bottom: 8px; }
        .legal-section a { color: #A78BFA; text-decoration: none; }
        .legal-section a:hover { text-decoration: underline; }
        .legal-placeholder { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.30); border-radius: 6px; padding: 2px 8px; color: #FCA5A5; font-size: 13px; font-style: italic; }
        .legal-updated { font-size: 12px; color: rgba(255,255,255,0.25); font-family: 'Fira Code', monospace; letter-spacing: 0.05em; }
      `}</style>

      <div className="legal-wrap">
        <button className="legal-back" onClick={() => navigate("/")}>
          <ArrowLeft size={14} />
          Zurück zur Startseite
        </button>

        <div className="legal-badge">// rechtliches</div>
        <h1 className="legal-title">Impressum</h1>
        <p className="legal-subtitle">Angaben gemäß § 5 TMG</p>

        <div className="legal-divider" />

        <div className="legal-section">
          <h2>Verantwortliche Person</h2>
          <p>
            <strong style={{ color: "rgba(255,255,255,0.85)" }}>Majd Akkash</strong><br />
            <span className="legal-placeholder">[Straße Hausnummer]</span><br />
            <span className="legal-placeholder">[PLZ] [Stadt]</span><br />
            Deutschland
          </p>
        </div>

        <div className="legal-section">
          <h2>Kontakt</h2>
          <p>
            E-Mail: <a href="mailto:hallo@informakit.de">hallo@informakit.de</a><br />
            Website: <a href="https://www.informakit.de">www.informakit.de</a>
          </p>
        </div>

        <div className="legal-divider" />

        <div className="legal-section">
          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>
            Gemäß § 27a Umsatzsteuergesetz: <span className="legal-placeholder">[USt-IdNr. eintragen oder Satz entfernen wenn nicht vorhanden]</span>
          </p>
        </div>

        <div className="legal-section">
          <h2>Berufsbezeichnung</h2>
          <p>Digitale Dienstleistungen / Webentwicklung & Marketing</p>
        </div>

        <div className="legal-divider" />

        <div className="legal-section">
          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </div>

        <div className="legal-section">
          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
        </div>

        <div className="legal-section">
          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>

        <div className="legal-divider" />

        <p className="legal-updated">Stand: April 2026</p>
      </div>
    </div>
  );
}
