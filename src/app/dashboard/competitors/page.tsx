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
  low: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Low" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Medium" },
  high: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "High" },
};

function ScoreArc({ score, size = 80 }: { score: number; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ * 0.75;
  const offset = circ * 0.125;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.07} strokeLinecap="round"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeDashoffset={-offset} transform={`rotate(135 ${size/2} ${size/2})`}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={size*0.07} strokeLinecap="round"
        strokeDasharray={`${progress} ${circ}`} strokeDashoffset={-offset} transform={`rotate(135 ${size/2} ${size/2})`}
        style={{ filter: `drop-shadow(0 0 6px ${color}66)`, transition: "all 1s ease" }}/>
      <text x={size/2} y={size/2 + 4} textAnchor="middle" fontSize={size * 0.22} fontWeight="700" fill="white" fontFamily="Syne, sans-serif">{score}</text>
    </svg>
  );
}

const loadingMessages = [
  "Crawling search signals...",
  "Analyzing AI visibility...",
  "Mapping competitor gaps...",
  "Computing GEO scores...",
];

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
  const [loadingStep, setLoadingStep] = useState("");
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
    const allResults: SiteResult[] = [];
    for (let i = 0; i < urls.length; i++) {
      setLoadingStep(`Analyzing ${i + 1} of ${urls.length}`);
      setLoadingMsgIdx(i % loadingMessages.length);
      allResults.push(await analyzeSite(urls[i]));
    }
    setResults(allResults);
    setLoading(false);
    setLoadingStep("");
  }

  const winner = results.reduce<SiteResult | null>((best, r) => {
    if (!r.result) return best;
    if (!best?.result) return r;
    return r.result.geo_score > best.result.geo_score ? r : best;
  }, null);

  const myResult = results[0];
  const competitorResults = results.slice(1);
  const isMyWinner = winner?.url === myUrl;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050816 0%, #07111f 50%, #0b1020 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .page-font { font-family: 'DM Sans', sans-serif; }
        .heading-font { font-family: 'Syne', sans-serif; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-hover:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); }
        .input-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 11px 16px; color: #e2e8f0; font-size: 14px; width: 100%; outline: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .input-field::placeholder { color: rgba(148,163,184,0.4); }
        .input-field:focus { border-color: rgba(6,182,212,0.5); background: rgba(6,182,212,0.04); box-shadow: 0 0 0 3px rgba(6,182,212,0.08); }
        .select-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 11px 16px; color: #e2e8f0; font-size: 14px; width: 100%; outline: none; appearance: none; font-family: 'DM Sans', sans-serif; }
        .btn-primary { background: linear-gradient(135deg, #06b6d4, #3b82f6); border: none; border-radius: 12px; padding: 13px 28px; color: white; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.25s; font-family: 'DM Sans', sans-serif; }
        .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(6,182,212,0.3); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .grid-bg { background-image: linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px); background-size: 48px 48px; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeInUp 0.4s ease forwards; }
        .fade-delay-1 { animation: fadeInUp 0.4s 0.05s ease both; }
        .fade-delay-2 { animation: fadeInUp 0.4s 0.1s ease both; }
        .fade-delay-3 { animation: fadeInUp 0.4s 0.15s ease both; }
        .winner-glow { box-shadow: 0 0 0 1px rgba(16,185,129,0.3), 0 0 30px rgba(16,185,129,0.08); }
        .scan-ring { border: 2px solid rgba(6,182,212,0.3); border-radius: 50%; animation: scanPulse 2s infinite; }
        @keyframes scanPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.05);opacity:0.6} }
        .loading-dot { width:8px; height:8px; border-radius:50%; background:#22d3ee; animation: bounceDot 1.4s infinite ease-in-out both; }
        @keyframes bounceDot { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
      `}</style>

      <div className="page-font grid-bg min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8 fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs">⚔</div>
              <span className="text-xs font-medium text-violet-400/70 uppercase tracking-widest">Competitive Intelligence</span>
            </div>
            <h1 className="heading-font text-3xl font-bold text-white mb-1">Competitor Analysis</h1>
            <p className="text-slate-400 text-sm">Map the AI search battlefield. Find every gap your competitors leave open.</p>
          </div>

          {/* Input Form */}
          <div className="glass rounded-2xl p-6 mb-6 fade-delay-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Your Website</label>
                <input className="input-field" value={myUrl} onChange={(e) => setMyUrl(e.target.value)} placeholder="https://yoursite.com" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Target Keyword</label>
                <input className="input-field" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. CRM for sales teams" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Industry</label>
                <select className="select-field" value={industry} onChange={(e) => setIndustry(e.target.value as typeof industry)}>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Competitor 1 <span className="text-red-400">*</span></label>
                <input className="input-field" value={competitor1} onChange={(e) => setCompetitor1(e.target.value)} placeholder="https://competitor1.com" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Competitor 2 <span className="text-slate-600">optional</span></label>
                <input className="input-field" value={competitor2} onChange={(e) => setCompetitor2(e.target.value)} placeholder="https://competitor2.com" />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Competitor 3 <span className="text-slate-600">optional</span></label>
                <input className="input-field" value={competitor3} onChange={(e) => setCompetitor3(e.target.value)} placeholder="https://competitor3.com" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="btn-primary flex items-center gap-2" onClick={handleCompare} disabled={loading || !myUrl || !keyword || !competitor1}>
                {loading ? (
                  <>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => <div key={i} className="loading-dot" style={{ animationDelay: `${i*0.16}s` }}/>)}
                    </div>
                    {loadingStep}
                  </>
                ) : "⚔ Compare Now"}
              </button>
              {loading && <span className="text-xs text-cyan-400/70">{loadingMessages[loadingMsgIdx]}</span>}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-5 py-4 text-sm text-red-400 mb-6 fade-in">
              {error}
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-6 fade-in">

              {/* Score Cards */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${results.length}, 1fr)` }}>
                {results.map((r, i) => {
                  const isWinner = winner?.url === r.url;
                  const isYou = i === 0;
                  return (
                    <div key={r.url} className={`glass rounded-2xl p-5 transition-all duration-300 ${isWinner ? "winner-glow border-emerald-500/25" : ""}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${isYou ? "bg-cyan-500/15 text-cyan-400" : "bg-white/5 text-slate-500"}`}>
                            {isYou ? "You" : `Competitor ${i}`}
                          </span>
                        </div>
                        {isWinner && <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-400 px-2 py-1 rounded-full">👑 Winner</span>}
                      </div>
                      <p className="text-xs text-slate-600 truncate mb-4">{r.url.replace(/^https?:\/\//, "")}</p>

                      {r.result ? (
                        <>
                          <div className="flex items-center gap-4 mb-4">
                            <ScoreArc score={r.result.geo_score} size={72} />
                            <div>
                              <div className="text-xs text-slate-500 mb-1">GEO Score</div>
                              <div className="text-xs text-slate-400">AI Citation</div>
                              <div className={`text-sm font-semibold mt-0.5 ${citationConfig[r.result.ai_citation_probability].color}`}>
                                {citationConfig[r.result.ai_citation_probability].label}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{r.result.visibility_summary}</p>
                        </>
                      ) : (
                        <div className="text-xs text-red-400 bg-red-500/8 rounded-lg p-3">{r.error}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Battle Analysis */}
              {myResult?.result && competitorResults.some(r => r.result) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/15 flex items-center justify-center text-xs">✓</div>
                      <h3 className="heading-font text-sm font-semibold text-emerald-400">Where You Win</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {myResult.result.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <span className="text-emerald-400 mt-0.5 flex-shrink-0">▹</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center text-xs">✗</div>
                      <h3 className="heading-font text-sm font-semibold text-red-400">Where They Win</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {myResult.result.critical_gaps.map((g) => (
                        <li key={g} className="flex items-start gap-2.5 text-sm text-slate-300">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">▹</span>
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Quick Wins */}
              {myResult?.result?.quick_wins && myResult.result.quick_wins.length > 0 && (
                <div className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/15 flex items-center justify-center text-xs">⚡</div>
                    <h3 className="heading-font text-sm font-semibold text-amber-400">Quick Wins to Overtake Competitors</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myResult.result.quick_wins.map((w, i) => (
                      <div key={w} className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
                        <span className="text-amber-500 text-xs font-bold mt-0.5 flex-shrink-0">0{i+1}</span>
                        <span className="text-sm text-slate-300 leading-relaxed">{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Outreach CTA */}
              {competitorResults[0]?.result && (
                <div className="glass rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="heading-font text-base font-semibold text-white mb-1">Ready to capitalize on these gaps?</h3>
                    <p className="text-sm text-slate-400">Generate personalized outreach targeting competitor weaknesses.</p>
                  </div>
                  <button
                    onClick={() => {
                      const pains = myResult?.result?.critical_gaps.join("; ") ?? "";
                      const params = new URLSearchParams({ company: competitor1, pains, angle: `They outrank you in AI search for "${keyword}"` });
                      router.push("/dashboard/outreach?" + params.toString());
                    }}
                    className="btn-primary flex-shrink-0 ml-4"
                  >
                    Generate Outreach →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}