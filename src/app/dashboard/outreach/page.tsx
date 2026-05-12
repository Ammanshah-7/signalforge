"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type OutreachResult = {
  email: { subject: string; body: string; cta: string };
  linkedin_dm: string;
  follow_up_day3: string;
  follow_up_day7: string;
  personalization_score: number;
  why_this_works: string;
};

const tones = ["Professional", "Casual", "Direct"] as const;
const tabs = ["Cold Email", "LinkedIn DM", "Follow-up Day 3", "Breakup Day 7"] as const;

const toneConfig = {
  Professional: { color: "#22d3ee", bg: "rgba(34,211,238,0.08)", border: "rgba(34,211,238,0.25)", desc: "Trusted & formal" },
  Casual: { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)", desc: "Warm & human" },
  Direct: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.25)", desc: "No fluff, just value" },
};

const tabConfig = {
  "Cold Email": { icon: "✉", desc: "First touch" },
  "LinkedIn DM": { icon: "💼", desc: "Social outreach" },
  "Follow-up Day 3": { icon: "🔁", desc: "Gentle nudge" },
  "Breakup Day 7": { icon: "👋", desc: "Final attempt" },
};

const generateSteps = [
  "Analyzing target intelligence...",
  "Crafting personalized hook...",
  "Engineering pain-point messaging...",
  "Optimizing CTA psychology...",
  "Building full sequence...",
  "Scoring personalization...",
];

export default function OutreachPage() {
  const params = useSearchParams();
  const [companyName, setCompanyName] = useState(params.get("company") ?? "");
  const [painPoints, setPainPoints] = useState(params.get("pains") ?? "");
  const [outreachAngle, setOutreachAngle] = useState(params.get("angle") ?? "");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [tone, setTone] = useState<(typeof tones)[number]>("Professional");
  const [result, setResult] = useState<OutreachResult | null>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Cold Email");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);

  const currentContent = useMemo(() => {
    if (!result) return "";
    if (tab === "Cold Email") return `Subject: ${result.email.subject}\n\n${result.email.body}\n\nCTA: ${result.email.cta}`;
    if (tab === "LinkedIn DM") return result.linkedin_dm;
    if (tab === "Follow-up Day 3") return result.follow_up_day3;
    return result.follow_up_day7;
  }, [result, tab]);

  async function generate(selectedTone: typeof tones[number]) {
    setLoading(true);
    setError(null);
    setLoadStep(0);
    const timer = setInterval(() => setLoadStep((p) => Math.min(p + 1, generateSteps.length - 1)), 800);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, painPoints, outreachAngle, productName, productDescription, tone: selectedTone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate");
      setResult(data);
      setTone(selectedTone);
      setTab("Cold Email");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate outreach");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const scoreColor = result
    ? result.personalization_score >= 80 ? "#34d399"
    : result.personalization_score >= 60 ? "#facc15" : "#f87171"
    : "#71717a";

  const scoreLabel = result
    ? result.personalization_score >= 80 ? "Highly Personalized"
    : result.personalization_score >= 60 ? "Moderately Tailored" : "Generic — Regenerate"
    : "";

  const inputStyle = (key: string) => ({
    width: "100%",
    background: focusField === key ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focusField === key ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.07)"}`,
    boxShadow: focusField === key ? "0 0 0 3px rgba(34,211,238,0.08)" : "none",
    borderRadius: "12px",
    padding: "10px 14px",
    color: "#e2e8f0",
    fontSize: "13px",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  });

  const canGenerate = !loading && companyName && painPoints && outreachAngle && productName && productDescription;

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.85)} }
        @keyframes scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        .fade-up { animation: fadeInUp 0.45s ease forwards; }
        .shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%); background-size:200% 100%; animation:shimmer 1.8s infinite; }
        .spin { animation: spin 1s linear infinite; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "0", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "0", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse at 60% 40%, black 20%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, padding: "0 0 48px" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#22d3ee", letterSpacing: "0.1em", textTransform: "uppercase" }}>Outreach Engine™</span>
            <span style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(34,211,238,0.3), transparent)" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "10px", color: "#34d399", fontWeight: 600 }}>
              <span className="pulse" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#34d399", display: "inline-block" }} />
              AI Active
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f0ff", letterSpacing: "-0.02em", marginBottom: "4px" }}>AI Outreach Generator</h1>
          <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.4)" }}>Signal-driven sequences engineered for conversion — not templates.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "16px", alignItems: "start" }}>

          {/* Left Panel */}
          <div className="fade-up" style={{ animationDelay: "0.05s", display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Input form */}
            <div style={{ borderRadius: "16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", padding: "20px" }}>
              <h2 style={{ fontSize: "12px", fontWeight: 700, color: "rgba(241,240,255,0.5)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "16px" }}>Target Intelligence</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { key: "company", label: "Company Name", placeholder: "Acme Corp", value: companyName, set: setCompanyName },
                  { key: "pain", label: "Their Pain Points", placeholder: "e.g. losing leads to competitors in AI search", value: painPoints, set: setPainPoints },
                  { key: "angle", label: "Outreach Angle", placeholder: "e.g. they ranked #3 last month", value: outreachAngle, set: setOutreachAngle },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,240,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{f.label}</label>
                    <input
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      onFocus={() => setFocusField(f.key)}
                      onBlur={() => setFocusField(null)}
                      placeholder={f.placeholder}
                      style={inputStyle(f.key)}
                    />
                  </div>
                ))}

                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "4px 0" }} />

                {[
                  { key: "product", label: "Your Product Name", placeholder: "SignalForge", value: productName, set: setProductName },
                  { key: "desc", label: "One-line Description", placeholder: "What it does and for whom", value: productDescription, set: setProductDescription },
                ].map((f) => (
                  <div key={f.key}>
                    <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,240,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{f.label}</label>
                    <input
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      onFocus={() => setFocusField(f.key)}
                      onBlur={() => setFocusField(null)}
                      placeholder={f.placeholder}
                      style={inputStyle(f.key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tone selector */}
            <div style={{ borderRadius: "16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", padding: "18px" }}>
              <h2 style={{ fontSize: "12px", fontWeight: 700, color: "rgba(241,240,255,0.5)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "12px" }}>Tone</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {tones.map((t) => {
                  const cfg = toneConfig[t];
                  const active = tone === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "10px",
                        background: active ? cfg.bg : "rgba(255,255,255,0.02)",
                        border: `1px solid ${active ? cfg.border : "rgba(255,255,255,0.06)"}`,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "13px", fontWeight: 500, color: active ? cfg.color : "rgba(241,240,255,0.5)" }}>{t}</span>
                      <span style={{ fontSize: "11px", color: "rgba(241,240,255,0.25)" }}>{cfg.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate button */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => generate(tone)}
                disabled={!canGenerate}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  background: canGenerate ? "linear-gradient(135deg, #0891b2, #7c3aed)" : "rgba(255,255,255,0.05)",
                  border: "none",
                  color: canGenerate ? "#fff" : "rgba(241,240,255,0.3)",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: canGenerate ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: canGenerate ? "0 0 24px rgba(8,145,178,0.3), 0 1px 0 rgba(255,255,255,0.1) inset" : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {loading ? (
                  <>
                    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Crafting sequence...
                  </>
                ) : "✦ Generate Sequence"}
              </button>

              {result && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => generate(tone)}
                    disabled={loading}
                    style={{ flex: 1, padding: "10px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,240,255,0.5)", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}
                  >↻ Regenerate</button>
                  <button
                    onClick={() => setSent((v) => !v)}
                    style={{ flex: 1, padding: "10px", borderRadius: "10px", background: sent ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${sent ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.08)"}`, color: sent ? "#34d399" : "rgba(241,240,255,0.5)", fontSize: "13px", cursor: "pointer", transition: "all 0.2s", fontWeight: sent ? 600 : 400 }}
                  >{sent ? "✓ Sent" : "Mark Sent"}</button>
                </div>
              )}
            </div>

            {error && (
              <div style={{ borderRadius: "10px", border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.05)", padding: "12px 14px", fontSize: "13px", color: "#f87171" }}>
                ⚠ {error}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* Empty state */}
            {!result && !loading && (
              <div className="fade-up" style={{ animationDelay: "0.1s", borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", padding: "60px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "480px" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>✉</div>
                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "rgba(241,240,255,0.8)", marginBottom: "8px" }}>Ready to forge outreach</h3>
                <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.35)", textAlign: "center", maxWidth: "280px", lineHeight: 1.6, marginBottom: "24px" }}>Fill in the target intelligence on the left and generate a full multi-touch sequence.</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Cold Email", "LinkedIn DM", "Follow-ups"].map((t) => (
                    <span key={t} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "999px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(241,240,255,0.35)" }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="fade-up" style={{ borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(34,211,238,0.1)", padding: "32px", minHeight: "480px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
                  <svg className="spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="rgba(34,211,238,0.2)" strokeWidth="3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                  <span style={{ fontSize: "13px", color: "#22d3ee", fontWeight: 500 }}>{generateSteps[loadStep]}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  {generateSteps.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: i <= loadStep ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${i <= loadStep ? "rgba(34,211,238,0.4)" : "rgba(255,255,255,0.08)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {i < loadStep && <span style={{ fontSize: "8px", color: "#22d3ee" }}>✓</span>}
                        {i === loadStep && <span className="pulse" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22d3ee", display: "block" }} />}
                      </div>
                      <span style={{ fontSize: "12px", color: i <= loadStep ? "rgba(241,240,255,0.6)" : "rgba(241,240,255,0.2)" }}>{step}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[85, 60, 75, 50, 90].map((w, i) => (
                    <div key={i} className="shimmer" style={{ height: "12px", borderRadius: "6px", width: `${w}%` }} />
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            {result && !loading && (
              <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

                {/* Score banner */}
                <div style={{ borderRadius: "16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Score ring */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <svg width="60" height="60" viewBox="0 0 60 60">
                        <circle cx="30" cy="30" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                        <circle cx="30" cy="30" r="24" fill="none" stroke={scoreColor} strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${(result.personalization_score / 100) * 150.8} 150.8`}
                          strokeDashoffset="37.7"
                          transform="rotate(-90 30 30)"
                          style={{ filter: `drop-shadow(0 0 6px ${scoreColor}80)`, transition: "stroke-dasharray 1s ease" }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: scoreColor }}>{result.personalization_score}</span>
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: "10px", color: "rgba(241,240,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "4px" }}>Personalization Score</p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: scoreColor, marginBottom: "2px" }}>{scoreLabel}</p>
                      <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.3)" }}>Tone: {tone}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setWhyOpen(!whyOpen)}
                    style={{ padding: "8px 14px", borderRadius: "10px", background: whyOpen ? "rgba(34,211,238,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${whyOpen ? "rgba(34,211,238,0.2)" : "rgba(255,255,255,0.08)"}`, color: whyOpen ? "#22d3ee" : "rgba(241,240,255,0.4)", fontSize: "12px", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" as const }}
                  >
                    Why this works {whyOpen ? "▲" : "▼"}
                  </button>
                </div>

                {/* Why this works */}
                {whyOpen && (
                  <div className="fade-up" style={{ borderRadius: "12px", background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.12)", borderLeft: "3px solid rgba(34,211,238,0.4)", padding: "14px 16px" }}>
                    <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.7)", lineHeight: 1.65 }}>{result.why_this_works}</p>
                  </div>
                )}

                {/* Tab switcher */}
                <div style={{ display: "flex", gap: "6px", borderRadius: "14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "5px" }}>
                  {tabs.map((t) => {
                    const active = tab === t;
                    const cfg = tabConfig[t];
                    return (
                      <button key={t} onClick={() => setTab(t)}
                        style={{ flex: 1, padding: "9px 8px", borderRadius: "10px", background: active ? "rgba(34,211,238,0.12)" : "transparent", border: active ? "1px solid rgba(34,211,238,0.2)" : "1px solid transparent", color: active ? "#22d3ee" : "rgba(241,240,255,0.35)", fontSize: "12px", fontWeight: active ? 600 : 400, cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "2px" }}
                      >
                        <span>{cfg.icon}</span>
                        <span style={{ fontSize: "10px" }}>{t.split(" ").slice(0, 2).join(" ")}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Message output */}
                <div style={{ borderRadius: "16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(241,240,255,0.8)" }}>{tab}</span>
                      <span style={{ fontSize: "11px", color: "rgba(241,240,255,0.3)", background: "rgba(255,255,255,0.05)", borderRadius: "999px", padding: "2px 8px" }}>{currentContent.length} chars</span>
                      {sent && <span style={{ fontSize: "10px", color: "#34d399", background: "rgba(52,211,153,0.1)", borderRadius: "999px", padding: "2px 8px", border: "1px solid rgba(52,211,153,0.2)" }}>✓ Sent</span>}
                    </div>
                    <button
                      onClick={handleCopy}
                      style={{ padding: "6px 14px", borderRadius: "8px", background: copied ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`, color: copied ? "#34d399" : "rgba(241,240,255,0.4)", fontSize: "12px", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </button>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px", minHeight: "200px", fontSize: "13px", color: "rgba(241,240,255,0.75)", lineHeight: 1.7, whiteSpace: "pre-wrap" as const, fontFamily: "inherit" }}>
                    {currentContent}
                  </div>
                </div>

                {/* Quick preview of other tabs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {tabs.filter((t) => t !== tab).map((t) => {
                    const cfg = tabConfig[t];
                    const preview = t === "Cold Email"
                      ? `Subject: ${result.email.subject}\n\n${result.email.body}`
                      : t === "LinkedIn DM" ? result.linkedin_dm
                      : t === "Follow-up Day 3" ? result.follow_up_day3
                      : result.follow_up_day7;
                    return (
                      <button key={t} onClick={() => setTab(t)}
                        style={{ padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                      >
                        <div style={{ fontSize: "11px", color: "rgba(241,240,255,0.35)", marginBottom: "5px" }}>{cfg.icon} {t}</div>
                        <div style={{ fontSize: "11px", color: "rgba(241,240,255,0.45)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{preview.slice(0, 80)}…</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}