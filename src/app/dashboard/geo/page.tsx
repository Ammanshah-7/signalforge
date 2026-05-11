"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type GeoResult = {
  geo_score: number;
  ai_citation_probability: "low" | "medium" | "high";
  visibility_summary: string;
  strengths: string[];
  critical_gaps: string[];
  recommendations: Array<{
    priority: "critical" | "high" | "medium";
    category: "content" | "structure" | "schema" | "entities" | "faq";
    title: string;
    what_to_do: string;
    example: string;
    expected_impact: string;
  }>;
  competitor_advantages: string[];
  quick_wins: string[];
};

type AnalyzeSuccess = { success: true; data: GeoResult };
type AnalyzeError = { success?: false; error?: string };

const industries = ["SaaS", "E-commerce", "Agency", "Consulting", "Other"] as const;

const scanSteps = [
  "Initializing GEO Pulse™ engine...",
  "Crawling website structure...",
  "Analyzing semantic authority...",
  "Detecting AI citation patterns...",
  "Scanning competitor visibility...",
  "Generating ForgeIntel™ report...",
];

const priorityConfig = {
  critical: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.2)", label: "CRITICAL" },
  high: { color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)", label: "HIGH" },
  medium: { color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.2)", label: "MEDIUM" },
};

const categoryIcons: Record<string, string> = {
  content: "✦",
  structure: "⬡",
  schema: "◈",
  entities: "◎",
  faq: "?",
};

const citationColors = {
  low: { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  medium: { color: "#facc15", bg: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.25)" },
  high: { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const normalized = score > 1 ? score : Math.round(score * 100);
  const offset = circ - (normalized / 100) * circ;
  const color = normalized < 40 ? "#f87171" : normalized <= 70 ? "#facc15" : "#34d399";
  const glow = normalized < 40 ? "rgba(248,113,113,0.3)" : normalized <= 70 ? "rgba(250,204,21,0.3)" : "rgba(52,211,153,0.3)";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" style={{ transform: "rotate(-90deg)", position: "absolute" }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#1c1c2e" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: `0 0 20px ${glow}` }}
        />
      </svg>
      <div className="relative flex flex-col items-center">
        <span className="text-4xl font-bold tabular-nums" style={{ color }}>{normalized}</span>
        <span className="text-xs text-zinc-500 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

function ScanAnimation({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-2 border-violet-500/30 animate-ping absolute inset-0" />
        <div className="h-20 w-20 rounded-full border-2 border-violet-500/50 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">⚡</span>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-sm font-medium text-violet-400 animate-pulse">{scanSteps[step % scanSteps.length]}</p>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-violet-500"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
      </div>
      <div className="w-64 space-y-2">
        {scanSteps.slice(0, step + 1).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-emerald-400 text-xs">✓</span>
            <span className="text-xs text-zinc-400">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GeoPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [industry, setIndustry] = useState<(typeof industries)[number]>("SaaS");
  const [result, setResult] = useState<GeoResult | null>(null);
  const [tab, setTab] = useState<"overview" | "recommendations" | "competitors" | "quick">("overview");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [inputFocus, setInputFocus] = useState<string | null>(null);

  const score = result ? (result.geo_score > 1 ? result.geo_score : Math.round(result.geo_score * 100)) : 0;
  const scoreLabel = score < 40 ? "Low Visibility" : score <= 70 ? "Moderate Visibility" : "High Visibility";
  const scoreColor = score < 40 ? "#f87171" : score <= 70 ? "#facc15" : "#34d399";

  async function handleAnalyze() {
    setError(null);
    setResult(null);
    try { new URL(url); } catch { setError("Please enter a valid URL."); return; }
    const usage = await fetch("/api/usage-check").then((r) => r.json());
    if (usage.exceeded) { setShowUpgrade(true); return; }
    setLoading(true);
    setStepIndex(0);
    const timer = setInterval(() => setStepIndex((p) => Math.min(p + 1, scanSteps.length - 1)), 1000);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword, industry }),
      });
      const payload = await res.json() as AnalyzeSuccess | AnalyzeError;
      if (!res.ok || (payload as AnalyzeSuccess).success !== true) {
        throw new Error((payload as AnalyzeError)?.error ?? "Failed to analyze");
      }
      setResult((payload as AnalyzeSuccess).data);
      setTab("overview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "recommendations", label: "Recommendations" },
    { id: "competitors", label: "Competitors" },
    { id: "quick", label: "Quick Wins" },
  ] as const;

  return (
    <div className="relative space-y-6">
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)} }`}</style>

      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-violet-900/8 blur-3xl" />
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium tracking-widest text-violet-400 uppercase">GEO Pulse™</span>
          <span className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">AI Visibility Analyzer</h1>
        <p className="text-sm text-zinc-500 mt-1">Powered by CitationMind™ — detect how AI search engines see your content</p>
      </div>

      {/* Input Panel */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-sm">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { key: "url", label: "Website URL", placeholder: "https://yoursite.com", value: url, set: setUrl, type: "url" },
            { key: "keyword", label: "Target Keyword", placeholder: "e.g. AI buyer intent tool", value: keyword, set: setKeyword, type: "text" },
          ].map((field) => (
            <div key={field.key} className="sm:col-span-1">
              <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">{field.label}</label>
              <div className="relative">
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  onFocus={() => setInputFocus(field.key)}
                  onBlur={() => setInputFocus(null)}
                  placeholder={field.placeholder}
                  className="w-full rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${inputFocus === field.key ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.06)"}`,
                    boxShadow: inputFocus === field.key ? "0 0 0 3px rgba(139,92,246,0.1)" : "none",
                  }}
                />
              </div>
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-zinc-500 mb-1.5 block uppercase tracking-wider">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as typeof industry)}
              className="w-full rounded-xl px-4 py-2.5 text-sm text-zinc-200 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {industries.map((o) => <option key={o} value={o} style={{ background: "#18181b" }}>{o}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleAnalyze}
            disabled={loading || !url || !keyword}
            className="relative overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: loading || !url || !keyword ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg, #7c3aed, #6d28d9)",
              boxShadow: !loading && url && keyword ? "0 0 20px rgba(139,92,246,0.4), 0 1px 0 rgba(255,255,255,0.1) inset" : "none",
              color: "#fff",
            }}
          >
            {loading ? "Analyzing..." : "⚡ Analyze Now"}
          </button>
          {result && (
            <span className="text-xs text-zinc-500">
              Last scan: <span style={{ color: scoreColor }}>{scoreLabel}</span>
            </span>
          )}
        </div>
      </div>

      {/* Upgrade prompt */}
      {showUpgrade && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <h3 className="font-semibold text-amber-400">Usage Limit Reached</h3>
          <p className="text-sm text-zinc-400 mt-1">Upgrade your plan to run more GEO scans this month.</p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => router.push("/dashboard/billing")} className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black">Upgrade Plan</button>
            <button onClick={() => setShowUpgrade(false)} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-400">Dismiss</button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      {/* Loading animation */}
      {loading && <ScanAnimation step={stepIndex} />}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Score header */}
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex items-center gap-5">
                <ScoreRing score={result.geo_score} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">GEO Pulse™ Score</p>
                  <p className="text-xl font-bold" style={{ color: scoreColor }}>{scoreLabel}</p>
                  <div
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize"
                    style={citationColors[result.ai_citation_probability]}
                  >
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: citationColors[result.ai_citation_probability].color }} />
                    CitationMind™: {result.ai_citation_probability} probability
                  </div>
                  <p className="mt-2 text-sm text-zinc-400 max-w-md">{result.visibility_summary}</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <button
                  onClick={() => {
                    const params = new URLSearchParams({
                      company: url,
                      pains: result.critical_gaps.join("; "),
                      angle: result.quick_wins[0] ?? result.visibility_summary,
                    });
                    router.push(`/dashboard/outreach?${params.toString()}`);
                  }}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #059669, #0d9488)", boxShadow: "0 0 20px rgba(5,150,105,0.3)" }}
                >
                  Generate Outreach →
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 rounded-lg py-2 text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? "rgba(139,92,246,0.15)" : "transparent",
                  color: tab === t.id ? "#a78bfa" : "#71717a",
                  border: tab === t.id ? "1px solid rgba(139,92,246,0.2)" : "1px solid transparent",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "overview" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-5">
                <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <span>✦</span> Strengths
                </h3>
                <ul className="space-y-2">
                  {result.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-5">
                <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <span>⚠</span> Critical Gaps
                </h3>
                <ul className="space-y-2">
                  {result.critical_gaps.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="text-red-400 mt-0.5 flex-shrink-0">→</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "recommendations" && (
            <div className="space-y-3">
              {result.recommendations.map((r, i) => {
                const p = priorityConfig[r.priority];
                return (
                  <div
                    key={`${r.title}-${i}`}
                    className="rounded-2xl p-5 transition-all hover:brightness-110"
                    style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${p.border}` }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold uppercase"
                        style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}
                      >
                        {p.label}
                      </div>
                      <div
                        className="flex-shrink-0 rounded-lg px-2 py-0.5 text-xs font-medium capitalize"
                        style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}
                      >
                        {categoryIcons[r.category]} {r.category}
                      </div>
                      <h4 className="font-semibold text-zinc-100">{r.title}</h4>
                    </div>
                    <p className="mt-3 text-sm text-zinc-300">{r.what_to_do}</p>
                    <div className="mt-2 rounded-lg bg-zinc-800/40 px-3 py-2">
                      <p className="text-xs text-zinc-500 mb-0.5">Example</p>
                      <p className="text-xs text-zinc-400">{r.example}</p>
                    </div>
                    <p className="mt-2 text-xs text-emerald-400">↑ {r.expected_impact}</p>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "competitors" && (
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5">
              <h3 className="font-semibold text-zinc-100 mb-4">Competitor Advantages</h3>
              <ul className="space-y-3">
                {result.competitor_advantages.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl border border-zinc-800/40 bg-zinc-800/20 p-3 text-sm text-zinc-300">
                    <span className="text-amber-400 flex-shrink-0 mt-0.5">⚡</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "quick" && (
            <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-5">
              <h3 className="font-semibold text-cyan-400 mb-4">⚡ Quick Wins — Fix in Under 1 Hour</h3>
              <ul className="space-y-3">
                {result.quick_wins.map((q, i) => (
                  <li key={i} className="flex items-start gap-3 rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-3 text-sm text-zinc-300">
                    <span className="flex-shrink-0 h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}