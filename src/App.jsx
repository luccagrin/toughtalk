import { useState, useCallback } from "react";

const SITUATIONS = [
  { id: "breakup", emoji: "💔", label: "Ruptura", desc: "Terminar una relación" },
  { id: "boss", emoji: "💼", label: "Reclamo al jefe", desc: "Hablar con tu superior" },
  { id: "apology", emoji: "🙏", label: "Disculpa", desc: "Pedir perdón de verdad" },
  { id: "family", emoji: "🏠", label: "Conflicto familiar", desc: "Con un familiar cercano" },
  { id: "friend", emoji: "👥", label: "Amistad en crisis", desc: "Con un amigo importante" },
  { id: "money", emoji: "💸", label: "Deuda o dinero", desc: "Cobrar o reclamar plata" },
  { id: "neighbor", emoji: "🏘️", label: "Conflicto de convivencia", desc: "Vecinos o compañeros" },
  { id: "ghosting", emoji: "👻", label: "Salir del silencio", desc: "Romper el ghosting" },
];

const TONE_LABELS = {
  direct: { emoji: "🎯", label: "Directo", desc: "Sin vueltas, claro y conciso" },
  soft: { emoji: "🌿", label: "Suave", desc: "Empático, cálido, cuidadoso" },
  formal: { emoji: "🏛️", label: "Formal", desc: "Profesional y respetuoso" },
};

const FREE_LIMIT = 3;
const STORAGE_KEY = "toughtalk_usage";

// 👇 REEMPLAZÁ esta URL con la de tu Cloudflare Worker
const WORKER_URL = "https://floral-fog-eeectoughtalk.lgrinspon.workers.dev";

function getUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, date: new Date().toDateString() };
    const data = JSON.parse(raw);
    if (data.date !== new Date().toDateString()) return { count: 0, date: new Date().toDateString() };
    return data;
  } catch { return { count: 0, date: new Date().toDateString() }; }
}

function saveUsage(count) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ count, date: new Date().toDateString() }));
}

function PrivacyPage({ onBack }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 14, marginBottom: "1.5rem" }}>← Volver</button>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>Política de Privacidad</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 13, marginBottom: "2rem" }}>Última actualización: enero 2025</p>
      {[
        ["¿Qué información recopilamos?", "ToughTalk no almacena en nuestros servidores el contenido de los mensajes que redactás. Tu descripción de la situación es enviada a la API de Google Gemini para generar las respuestas y no es guardada por nosotros de forma permanente. No recopilamos nombre, email ni datos de contacto de usuarios en el plan gratuito."],
        ["Uso de cookies y almacenamiento local", "Utilizamos el almacenamiento local de tu navegador (localStorage) únicamente para contar la cantidad de mensajes generados en el día, a fin de aplicar el límite del plan gratuito. Este dato nunca se envía a nuestros servidores."],
        ["Terceros", "Utilizamos la API de Google Gemini para el procesamiento de texto. La política de privacidad de Google aplica a los datos enviados para inferencia. No vendemos ni compartimos tus datos con terceros con fines comerciales."],
        ["Seguridad", "Las comunicaciones entre tu navegador y nuestros servicios se realizan mediante HTTPS."],
        ["Contacto", "Para consultas sobre privacidad: privacy@toughtalk.app"],
      ].map(([title, text]) => (
        <div key={title} style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: "0.4rem" }}>{title}</h3>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-text-secondary)", margin: 0 }}>{text}</p>
        </div>
      ))}
    </div>
  );
}

function TermsPage({ onBack }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 14, marginBottom: "1.5rem" }}>← Volver</button>
      <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--color-text-primary)", marginBottom: "0.5rem" }}>Términos y Condiciones</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 13, marginBottom: "2rem", fontStyle: "italic" }}>Al usar ToughTalk aceptás estos términos en su totalidad.</p>
      {[
        ["1. Naturaleza del servicio", "ToughTalk es una herramienta de asistencia en la redacción de mensajes interpersonales. No es un servicio de asesoramiento legal, psicológico, de pareja ni de ningún tipo profesional."],
        ["2. Responsabilidad del usuario", "Vos sos el único responsable del contenido final del mensaje que decidás enviar. ToughTalk solo te asiste en la redacción; la decisión y sus consecuencias son exclusivamente tuyas."],
        ["3. Limitación de responsabilidad", "ToughTalk no será responsable por daños derivados del uso de los mensajes generados. La responsabilidad máxima estará limitada al monto pagado en los últimos 30 días."],
        ["4. Uso aceptable", "Queda prohibido usar ToughTalk para redactar mensajes de acoso, amenazas, discriminación o cualquier conducta que cause daño a terceros."],
        ["5. Modelo freemium", "El plan gratuito permite hasta 3 sets de mensajes por día calendario. El plan premium, cuando esté disponible, será informado antes de cualquier cobro. No realizamos cobros automáticos sin consentimiento expreso."],
        ["6. Ley aplicable", "Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia se resolverá ante los tribunales de la Ciudad Autónoma de Buenos Aires."],
        ["7. Contacto", "legal@toughtalk.app"],
      ].map(([title, text]) => (
        <div key={title} style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: "0.4rem" }}>{title}</h3>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-text-secondary)", margin: 0 }}>{text}</p>
        </div>
      ))}
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }}
      style={{ background: copied ? "var(--color-background-success)" : "var(--color-background-secondary)", border: "1px solid var(--color-border-secondary)", borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: copied ? "var(--color-text-success)" : "var(--color-text-secondary)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}
    >
      {copied ? "✓ Copiado" : "📋 Copiar"}
    </button>
  );
}

function MessageCard({ tone, text, isLoading }) {
  const info = TONE_LABELS[tone];
  return (
    <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-tertiary)", borderRadius: 16, padding: "1.25rem 1.5rem", marginBottom: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>{info.emoji}</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text-primary)" }}>{info.label}</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{info.desc}</div>
          </div>
        </div>
        {!isLoading && text && <CopyButton text={text} />}
      </div>
      {isLoading ? (
        <div style={{ display: "flex", gap: 6, padding: "1rem 0" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-text-secondary)", animation: `bounce 1.2s infinite ${i * 0.2}s`, opacity: 0.5 }} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--color-text-primary)", margin: 0, whiteSpace: "pre-wrap" }}>{text}</p>
      )}
    </div>
  );
}

function AdBanner() {
  return (
    <div style={{ background: "var(--color-background-secondary)", border: "1px dashed var(--color-border-secondary)", borderRadius: 12, padding: "1rem", textAlign: "center", margin: "1.5rem 0", minHeight: 90, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Publicidad</span>
      <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>Espacio reservado para Google AdSense</span>
    </div>
  );
}

export default function ToughTalk() {
  const [page, setPage] = useState("home");
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState(null);
  const [description, setDescription] = useState("");
  const [results, setResults] = useState({ direct: "", soft: "", formal: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState(() => getUsage());
  const [showUpgrade, setShowUpgrade] = useState(false);

  const remaining = FREE_LIMIT - usage.count;
  const isLimitReached = usage.count >= FREE_LIMIT;

  const handleGenerate = useCallback(async () => {
    if (isLimitReached) { setShowUpgrade(true); return; }
    if (!description.trim() || description.trim().length < 15) {
      setError("Contanos un poco más — necesitamos al menos 15 caracteres para ayudarte bien 😊");
      return;
    }
    setError("");
    setLoading(true);
    setStep(3);
    setResults({ direct: "", soft: "", formal: "" });

    const newCount = usage.count + 1;
    saveUsage(newCount);
    setUsage({ count: newCount, date: new Date().toDateString() });

    const situationLabel = SITUATIONS.find(s => s.id === situation)?.label || situation;

    const prompt = `Sos un experto en comunicación interpersonal empática y asertiva. Un usuario necesita ayuda para redactar un mensaje sobre la siguiente situación.

Tipo de situación: ${situationLabel}
Descripción del usuario: ${description}

Generá EXACTAMENTE 3 versiones del mensaje, cada una con un tono diferente. Los mensajes deben ser naturales, en español rioplatense argentino (tuteo), listos para enviar tal cual por WhatsApp o similar.

Respondé SOLO con este JSON (sin markdown, sin explicaciones, sin bloques de código):
{
  "direct": "versión directa y sin vueltas, clara y concisa (máx 120 palabras)",
  "soft": "versión suave y empática, cálida y cuidadosa (máx 120 palabras)",
  "formal": "versión formal y respetuosa, apropiada para situaciones profesionales (máx 120 palabras)"
}

Reglas:
- Usar "vos" y conjugaciones rioplatenses
- Mensajes concretos y listos para enviar
- Cada versión genuinamente diferente en tono y estilo`;

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const text = data.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResults({ direct: parsed.direct || "", soft: parsed.soft || "", formal: parsed.formal || "" });
    } catch (err) {
      setError("Hubo un problema al generar los mensajes. Revisá tu conexión e intentá de nuevo.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  }, [situation, description, isLimitReached, usage]);

  const resetApp = () => { setStep(1); setSituation(null); setDescription(""); setResults({ direct: "", soft: "", formal: "" }); setShowUpgrade(false); setError(""); };

  if (page === "privacy") return <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "var(--color-background-tertiary)" }}><PrivacyPage onBack={() => setPage("home")} /></div>;
  if (page === "terms") return <div style={{ fontFamily: "system-ui, sans-serif", minHeight: "100vh", background: "var(--color-background-tertiary)" }}><TermsPage onBack={() => setPage("home")} /></div>;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", minHeight: "100vh", background: "var(--color-background-tertiary)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&display=swap');
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .sit-card { transition: all 0.15s; cursor: pointer; }
        .sit-card:hover { transform: translateY(-2px); border-color: var(--color-border-primary) !important; }
        .sit-card.selected { border-color: #7c3aed !important; background: #f5f3ff !important; }
        .gen-btn { transition: all 0.2s; }
        .gen-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(124,58,237,0.3); }
        .result-card { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <header style={{ background: "var(--color-background-primary)", borderBottom: "1px solid var(--color-border-tertiary)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={resetApp}>
          <span style={{ fontSize: 22 }}>💬</span>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.1rem, 3vw, 1.4rem)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>ToughTalk</span>
        </div>
        {!isLimitReached ? (
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)", background: "var(--color-background-secondary)", padding: "4px 12px", borderRadius: 20, border: "1px solid var(--color-border-tertiary)" }}>{remaining} gratis hoy</span>
        ) : (
          <span style={{ fontSize: 13, color: "#7c3aed", background: "#f5f3ff", padding: "4px 12px", borderRadius: 20, border: "1px solid #c4b5fd", cursor: "pointer" }} onClick={() => setShowUpgrade(true)}>✨ Upgrade</span>
        )}
      </header>

      <div style={{ padding: "0 1.5rem" }}><AdBanner /></div>

      <main style={{ flex: 1, maxWidth: 720, width: "100%", margin: "0 auto", padding: "1rem 1.5rem 2rem" }}>

        {showUpgrade && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div style={{ background: "var(--color-background-primary)", borderRadius: 20, padding: "2rem", maxWidth: 400, width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: "1rem" }}>✨</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", marginBottom: "0.5rem" }}>Límite diario alcanzado</h2>
              <p style={{ color: "var(--color-text-secondary)", fontSize: 15, lineHeight: 1.6, marginBottom: "1.5rem" }}>Usaste tus 3 mensajes gratuitos de hoy. Volvé mañana o accedé al plan premium.</p>
              <div style={{ background: "var(--color-background-secondary)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem", textAlign: "left" }}>
                {["✅ Mensajes ilimitados", "✅ Tonos adicionales", "✅ Historial de mensajes", "✅ Sin publicidad"].map(f => (
                  <div key={f} style={{ fontSize: 14, color: "var(--color-text-secondary)", padding: "2px 0" }}>{f}</div>
                ))}
              </div>
              <button style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: "0.75rem" }}>
                Próximamente — Anotarme
              </button>
              <button onClick={() => setShowUpgrade(false)} style={{ background: "none", border: "none", color: "var(--color-text-secondary)", fontSize: 14, cursor: "pointer" }}>Volver</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ textAlign: "center", padding: "1.5rem 0 2rem" }}>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.2, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
                Decí lo difícil,<br />con las palabras justas.
              </h1>
              <p style={{ fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)", color: "var(--color-text-secondary)", lineHeight: 1.6, maxWidth: 500, margin: "0 auto" }}>
                Contanos qué pasó y te ayudamos a encontrar las palabras. Discreto, rápido, sin juicios.
              </p>
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: "1rem" }}>¿Qué situación querés manejar?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
              {SITUATIONS.map(s => (
                <div key={s.id} className={`sit-card${situation === s.id ? " selected" : ""}`} onClick={() => { setSituation(s.id); setStep(2); }}
                  style={{ background: "var(--color-background-primary)", border: `1px solid ${situation === s.id ? "#7c3aed" : "var(--color-border-tertiary)"}`, borderRadius: 14, padding: "1rem", display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontSize: 24 }}>{s.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{s.label}</span>
                  <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 14, marginBottom: "1.5rem" }}>← Cambiar situación</button>
            <div style={{ background: "var(--color-background-primary)", border: "1px solid var(--color-border-tertiary)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
                <span style={{ fontSize: 22 }}>{SITUATIONS.find(s => s.id === situation)?.emoji}</span>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{SITUATIONS.find(s => s.id === situation)?.label}</span>
              </div>
              <label style={{ display: "block", fontSize: 14, color: "var(--color-text-secondary)", marginBottom: "0.5rem" }}>Contanos con tus palabras qué pasó y qué querés decir:</label>
              <textarea
                value={description}
                onChange={e => { setDescription(e.target.value); setError(""); }}
                placeholder="Ejemplo: Mi jefe me prometió un aumento hace 3 meses y nunca lo concretó. Quiero hablarle sin parecer agresivo pero necesito que me tome en serio..."
                style={{ width: "100%", minHeight: 140, padding: "0.875rem", fontSize: 15, lineHeight: 1.6, border: "1px solid var(--color-border-secondary)", borderRadius: 10, background: "var(--color-background-secondary)", color: "var(--color-text-primary)", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit", outline: "none" }}
              />
              {error && <p style={{ fontSize: 13, color: "var(--color-text-danger)", marginTop: "0.4rem" }}>{error}</p>}
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: "0.4rem" }}>{description.length} caracteres</div>
            </div>

            {isLimitReached ? (
              <div style={{ background: "#f5f3ff", border: "1px solid #c4b5fd", borderRadius: 12, padding: "1rem 1.25rem", textAlign: "center" }}>
                <p style={{ color: "#7c3aed", fontSize: 15, margin: "0 0 0.75rem" }}>Alcanzaste el límite de 3 mensajes gratuitos por hoy 🌙</p>
                <button onClick={() => setShowUpgrade(true)} style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Ver opciones premium</button>
              </div>
            ) : (
              <>
                <button className="gen-btn" onClick={handleGenerate} disabled={!description.trim() || description.trim().length < 15}
                  style={{ width: "100%", padding: "16px", background: description.trim().length >= 15 ? "#7c3aed" : "var(--color-background-secondary)", color: description.trim().length >= 15 ? "#fff" : "var(--color-text-secondary)", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: description.trim().length >= 15 ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                  ✨ Generar mis 3 mensajes
                </button>
                <p style={{ textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)", marginTop: "0.75rem" }}>Te quedan {remaining} mensaje{remaining !== 1 ? "s" : ""} gratis hoy</p>
              </>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{SITUATIONS.find(s => s.id === situation)?.emoji}</span>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", margin: 0 }}>Tus mensajes</h2>
                </div>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{SITUATIONS.find(s => s.id === situation)?.label} · 3 versiones listas</p>
              </div>
              <button onClick={resetApp} style={{ background: "var(--color-background-secondary)", border: "1px solid var(--color-border-secondary)", borderRadius: 10, padding: "8px 14px", fontSize: 13, cursor: "pointer", color: "var(--color-text-secondary)" }}>Nuevo mensaje</button>
            </div>

            {Object.keys(TONE_LABELS).map((tone, i) => (
              <div key={tone} className="result-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <MessageCard tone={tone} text={results[tone]} isLoading={loading} />
              </div>
            ))}

            {!loading && results.direct && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--color-background-secondary)", borderRadius: 12, textAlign: "center" }}>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 0.75rem" }}>¿Ninguna te convence? Intentá con más detalle.</p>
                <button onClick={() => setStep(2)} style={{ background: "none", border: "1px solid var(--color-border-secondary)", borderRadius: 8, padding: "8px 20px", fontSize: 14, cursor: "pointer", color: "var(--color-text-secondary)" }}>← Editar descripción</button>
              </div>
            )}
            <AdBanner />
          </div>
        )}
      </main>

      <footer style={{ background: "var(--color-background-primary)", borderTop: "1px solid var(--color-border-tertiary)", padding: "1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: "0 0 0.75rem" }}>
          💬 <strong style={{ color: "var(--color-text-primary)" }}>ToughTalk</strong> — Asistente de mensajes difíciles · No somos asesores legales ni psicológicos.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setPage("privacy")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 13, textDecoration: "underline" }}>Política de Privacidad</button>
          <button onClick={() => setPage("terms")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: 13, textDecoration: "underline" }}>Términos y Condiciones</button>
          <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>contact@toughtalk.app</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: "0.75rem", opacity: 0.6 }}>© 2025 ToughTalk · Generado con IA · El usuario es responsable del mensaje que envía.</p>
      </footer>
    </div>
  );
}
