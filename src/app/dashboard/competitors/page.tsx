"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type GeoResult = {
  geo_score: number;
  ai_citation_probability: "low" | "medium" | "high";
  visibility_summary: string;
  strengths: string[];
  critical_gaps: string[];
  quick_wins: string[];
};

type SiteResult = {
  url: string;
  result: GeoResult | null;
  error: string | null;
};

const industries = ["SaaS", "E-commerce", "Agency", "Consulting", "Other"] as const;

const citationConfig = {
  low: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", label: "Low" },
  medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)", label: "Medium" },
  high: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", label: "High" },
};

const loadingMessages = [
  "Crawling AI search signals...",
  "Analyzing GEO visibility...",
  "Mapping competitor gaps...",
  "Computing battle scores...",
  "Generating attack plan...",
];

function ScoreArc({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ * 0.75;
  const offset = circ * 0.125;
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#f59e0b" : "#f87171";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.07} strokeLinecap="round"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={-offset} transform={`rotate(135 ${size/2} ${size/2})`}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07} strokeLinecap="round"
        strokeDasharray={`${progress} ${circ}`} strokeDashoffset={-offset} transform={`rotate(135 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}66)`, transition: "all 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fontSize={size * 0.22} fontWeight="700" fill="white">{score}</text>
    </svg>
  );
}

export default function CompetitorsPage() {
  const router = useRouter();
  const [myUrl, setMyUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState<(typeof industries)[number]>("SaaS");
  const [competitor1, setCompetitor1] = useState("");
  const [competitor2, setCompetitor2] = useState("");
  const [competitor3, setCompetitor3] = useState("");
  const [results, setResults] = useState<SiteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"battle" | "attack">("battle");

  async function analyzeSite(url: string): Promise<SiteResult> {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword, industry }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.success) return { url, result: null, error: payload.error ?? "Analysis failed" };
      return { url, result: payload.data, error: null };
    } catch {
      return { url, result: null, error: "Network error" };
    }
  }

  async function handleCompare() {
    setError(null);
    setResults([]);
    try { new URL(myUrl); } catch { setError("Enter a valid URL for your site."); return; }
    try { new URL(competitor1); } catch { setError("Enter a valid URL for Competitor 1."); return; }
    const urls = [myUrl, competitor1, competitor2, competitor3].filter(Boolean);
    setLoading(true);
    setLoadStep(0);
    const timer = setInterval(() => setLoadStep((p) => Math.min(p + 1, loadingMessages.length - 1)), 1200);
    const allResults: SiteResult[] = [];
    for (const url of urls) allResults.push(await analyzeSite(url));
    setResults(allResults);
    clearInterval(timer);
    setLoading(false);
  }

  const winner = results.reduce<SiteResult | null>((best, r) => {
    if (!r.result) return best;
    if (!best?.result) return r;
    return r.result.geo_score > best.result.geo_score ? r : best;
  }, null);

  const myResult = results[0];
  const competitorResults = results.slice(1);

  const inputStyle = (key: string) => ({
    width: "100%",
    background: focusField === key ? "rgba(167,139,250,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focusField === key ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.07)"}`,
    boxShadow: focusField === key ? "0 0 0 3px rgba(167,139,250,0.08)" : "none",
    borderRadius: "12px", padding: "10px 14px", color: "#e2e8f0",
    fontSize: "13px", outline: "none", transition: "all 0.2s", fontFamily: "inherit",
  });

  const canCompare = !loading && myUrl && keyword && competitor1;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes bounceDot { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
        .fade-up { animation: fadeInUp 0.4s ease forwards; }
        .spin { animation: spin 1s linear infinite; }
        .bounce-dot { width:6px;height:6px;border-radius:50%;background:#a78bfa; animation:bounceDot 1.4s infinite ease-in-out both; }
      `}</style>

      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "0", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse at 70% 30%, black 20%, transparent 70%)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, paddingBottom: "48px" }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.1em", textTransform: "uppercase" }}>Market Intelligence™</span>
            <span style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(167,139,250,0.3), transparent)" }} />
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#f1f0ff", letterSpacing: "-0.02em", marginBottom: "4px" }}>Competitor Analysis</h1>
          <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.4)" }}>Map the AI search battlefield. Find every gap your competitors leave open.</p>
        </div>

        {/* Input */}
        <div className="fade-up" style={{ animationDelay: "0.05s", borderRadius: "16px", background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", padding: "20px", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { key: "myUrl", label: "Your Website", placeholder: "https://yoursite.com", value: myUrl, set: setMyUrl },
              { key: "keyword", label: "Target Keyword", placeholder: "e.g. CRM for sales teams", value: keyword, set: setKeyword },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,240,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{f.label}</label>
                <input value={f.value} onChange={(e) => f.set(e.target.value)} onFocus={() => setFocusField(f.key)} onBlur={() => setFocusField(null)} placeholder={f.placeholder} style={inputStyle(f.key)} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,240,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value as typeof industry)} style={{ ...inputStyle("industry"), appearance: "none" as const }}>
                {industries.map((i) => <option key={i} value={i} style={{ background: "#18181b" }}>{i}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[
              { key: "c1", label: "Competitor 1 *", placeholder: "https://competitor1.com", value: competitor1, set: setCompetitor1 },
              { key: "c2", label: "Competitor 2 (optional)", placeholder: "https://competitor2.com", value: competitor2, set: setCompetitor2 },
              { key: "c3", label: "Competitor 3 (optional)", placeholder: "https://competitor3.com", value: competitor3, set: setCompetitor3 },
            ].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,240,255,0.35)", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{f.label}</label>
                <input value={f.value} onChange={(e) => f.set(e.target.value)} onFocus={() => setFocusField(f.key)} onBlur={() => setFocusField(null)} placeholder={f.placeholder} style={inputStyle(f.key)} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={handleCompare} disabled={!canCompare}
              style={{ padding: "11px 24px", borderRadius: "12px", background: canCompare ? "linear-gradient(135deg, #7c3aed, #a78bfa)" : "rgba(255,255,255,0.05)", border: "none", color: canCompare ? "#fff" : "rgba(241,240,255,0.3)", fontSize: "14px", fontWeight: 600, cursor: canCompare ? "pointer" : "not-allowed", boxShadow: canCompare ? "0 0 24px rgba(167,139,250,0.3)" : "none", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s" }}
            >
              {loading ? (
                <>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {[0,1,2].map((i) => <div key={i} className="bounce-dot" style={{ animationDelay: `${i*0.16}s` }} />)}
                  </div>
                  Analyzing {results.length + 1} of {[myUrl,competitor1,competitor2,competitor3].filter(Boolean).length}...
                </>
              ) : "⚔ Compare Now"}
            </button>
            {loading && <span style={{ fontSize: "12px", color: "#a78bfa", opacity: 0.7 }}>{loadingMessages[loadStep]}</span>}
          </div>
        </div>

        {error && (
          <div style={{ borderRadius: "10px", border: "1px solid rgba(248,113,113,0.2)", background: "rgba(248,113,113,0.05)", padding: "12px 16px", fontSize: "13px", color: "#f87171", marginBottom: "16px" }}>⚠ {error}</div>
        )}

        {results.length > 0 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Score cards */}
            <div style={{ display: "grid", gap: "12px", gridTemplateColumns: `repeat(${results.length}, 1fr)` }}>
              {results.map((r, i) => {
                const isWinner = winner?.url === r.url;
                const isYou = i === 0;
                return (
                  <div key={r.url} style={{ borderRadius: "16px", background: isWinner ? "rgba(52,211,153,0.04)" : "rgba(255,255,255,0.025)", border: `1px solid ${isWinner ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.07)"}`, backdropFilter: "blur(12px)", padding: "20px", boxShadow: isWinner ? "0 0 30px rgba(52,211,153,0.08)" : "none", transition: "all 0.3s" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", background: isYou ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.05)", color: isYou ? "#22d3ee" : "#64748b", border: isYou ? "1px solid rgba(34,211,238,0.2)" : "1px solid rgba(255,255,255,0.06)", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
                        {isYou ? "You" : `Competitor ${i}`}
                      </span>
                      {isWinner && <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "999px", background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}>👑 Winner</span>}
                    </div>
                    <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.3)", marginBottom: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.url.replace(/^https?:\/\//, "")}</p>
                    {r.result ? (
                      <>
                        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "12px" }}>
                          <ScoreArc score={r.result.geo_score} size={68} />
                          <div>
                            <p style={{ fontSize: "10px", color: "rgba(241,240,255,0.35)", marginBottom: "6px" }}>AI Citation</p>
                            <span style={{ fontSize: "12px", fontWeight: 600, padding: "2px 10px", borderRadius: "999px", background: citationConfig[r.result.ai_citation_probability].bg, color: citationConfig[r.result.ai_citation_probability].color, border: `1px solid ${citationConfig[r.result.ai_citation_probability].border}` }}>
                              {citationConfig[r.result.ai_citation_probability].label}
                            </span>
                          </div>
                        </div>
                        <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.4)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{r.result.visibility_summary}</p>
                      </>
                    ) : (
                      <div style={{ borderRadius: "10px", background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)", padding: "12px", fontSize: "12px", color: "#f87171" }}>{r.error}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Analysis tabs */}
            {myResult?.result && competitorResults.some((r) => r.result) && (
              <>
                <div style={{ display: "flex", gap: "6px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px" }}>
                  {(["battle", "attack"] as const).map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      style={{ flex: 1, padding: "8px", borderRadius: "8px", background: activeTab === t ? "rgba(167,139,250,0.12)" : "transparent", border: activeTab === t ? "1px solid rgba(167,139,250,0.2)" : "1px solid transparent", color: activeTab === t ? "#a78bfa" : "rgba(241,240,255,0.35)", fontSize: "13px", fontWeight: activeTab === t ? 600 : 400, cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" as const }}
                    >
                      {t === "battle" ? "⚔ Battle Analysis" : "🎯 Attack Plan"}
                    </button>
                  ))}
                </div>

                {activeTab === "battle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div style={{ borderRadius: "14px", background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.15)", padding: "18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✓</div>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#34d399" }}>Where You Win</h3>
                      </div>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {myResult.result!.strengths.map((s) => (
                          <li key={s} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "rgba(241,240,255,0.7)" }}>
                            <span style={{ color: "#34d399", flexShrink: 0, marginTop: "2px" }}>▹</span>{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ borderRadius: "14px", background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", padding: "18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "8px", background: "rgba(248,113,113,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>✗</div>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#f87171" }}>Where They Win</h3>
                      </div>
                      <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {myResult.result!.critical_gaps.map((g) => (
                          <li key={g} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "13px", color: "rgba(241,240,255,0.7)" }}>
                            <span style={{ color: "#f87171", flexShrink: 0, marginTop: "2px" }}>▹</span>{g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === "attack" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ borderRadius: "14px", background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.15)", padding: "18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                        <span style={{ fontSize: "16px" }}>⚡</span>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#f59e0b" }}>Quick Wins — Fix in Under 1 Hour</h3>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {myResult.result!.quick_wins.map((w, i) => (
                          <div key={w} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)", borderRadius: "10px", padding: "12px" }}>
                            <span style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b", flexShrink: 0 }}>0{i+1}</span>
                            <span style={{ fontSize: "12px", color: "rgba(241,240,255,0.7)", lineHeight: 1.5 }}>{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ borderRadius: "14px", background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.15)", padding: "18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#f1f0ff", marginBottom: "4px" }}>Turn gaps into outreach</h3>
                        <p style={{ fontSize: "12px", color: "rgba(241,240,255,0.4)" }}>Generate personalized outreach targeting competitor weaknesses.</p>
                      </div>
                      <button
                        onClick={() => {
                          const pains = myResult?.result?.critical_gaps.join("; ") ?? "";
                          const params = new URLSearchParams({ company: competitor1, pains, angle: `They outrank you in AI search for "${keyword}"` });
                          router.push("/dashboard/outreach?" + params.toString());
                        }}
                        style={{ padding: "10px 20px", borderRadius: "10px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", flexShrink: 0, boxShadow: "0 0 20px rgba(167,139,250,0.3)" }}
                      >Generate Outreach →</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!results.length && !loading && (
          <div style={{ borderRadius: "20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", padding: "60px 40px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "8px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginBottom: "20px" }}>⚔</div>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "rgba(241,240,255,0.8)", marginBottom: "8px" }}>Ready to analyze the battlefield</h3>
            <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.35)", textAlign: "center", maxWidth: "300px", lineHeight: 1.6 }}>Enter your URL, a keyword, and at least one competitor URL to start the intelligence scan.</p>
          </div>
        )}
      </div>
    </div>
  );
}