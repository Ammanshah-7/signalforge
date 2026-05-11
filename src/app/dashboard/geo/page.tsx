"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

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
  critical: {
    color: "#F87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.20)",
    label: "Critical",
    dot: "#F87171",
  },
  high: {
    color: "#FB923C",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.20)",
    label: "High",
    dot: "#FB923C",
  },
  medium: {
    color: "#FACC15",
    bg: "rgba(250,204,21,0.08)",
    border: "rgba(250,204,21,0.20)",
    label: "Medium",
    dot: "#FACC15",
  },
};

const categoryMeta: Record<string, { icon: JSX.Element; label: string; color: string }> = {
  content: {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    label: "Content",
    color: "#A5A0FA",
  },
  structure: {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    label: "Structure",
    color: "#67E8F9",
  },
  schema: {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    label: "Schema",
    color: "#86EFAC",
  },
  entities: {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    label: "Entities",
    color: "#FCA5A5",
  },
  faq: {
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    label: "FAQ",
    color: "#FCD34D",
  },
};

const citationConfig = {
  low: { color: "#F87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.22)", label: "Low Probability" },
  medium: { color: "#FACC15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.22)", label: "Medium Probability" },
  high: { color: "#34D399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.22)", label: "High Probability" },
};

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const normalized = score > 1 ? score : Math.round(score * 100);
  const offset = circ - (normalized / 100) * circ;
  const color =
    normalized < 40 ? "#F87171" : normalized <= 70 ? "#FACC15" : "#34D399";
  const trackColor =
    normalized < 40
      ? "rgba(248,113,113,0.12)"
      : normalized <= 70
      ? "rgba(250,204,21,0.12)"
      : "rgba(52,211,153,0.12)";

  return (
    <div style={{ position: "relative", width: 132, height: 132, flexShrink: 0 }}>
      <svg
        width="132"
        height="132"
        viewBox="0 0 132 132"
        style={{ transform: "rotate(-90deg)", position: "absolute", inset: 0 }}
      >
        <circle cx="66" cy="66" r={r} fill="none" stroke={trackColor} strokeWidth="9" />
        <circle
          cx="66" cy="66" r={r} fill="none"
          stroke={color} strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)",
            filter: `drop-shadow(0 0 6px ${color}60)`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {normalized}
        </span>
        <span style={{ fontSize: "11px", color: "rgba(241,240,255,0.3)", marginTop: "2px" }}>
          / 100
        </span>
      </div>
    </div>
  );
}

// ─── Scan Animation ───────────────────────────────────────────────────────────

function ScanAnimation({ step }: { step: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
        padding: "48px 24px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Radar animation */}
      <div style={{ position: "relative", width: "72px", height: "72px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: `${i * -12}px`,
              borderRadius: "50%",
              border: "1px solid rgba(124,111,247,0.3)",
              animation: `sfRadar 2s ease-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background: "rgba(124,111,247,0.10)",
            border: "1px solid rgba(124,111,247,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C6FF7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
      </div>

      {/* Current step */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#A5A0FA",
            marginBottom: "10px",
            animation: "sfFade 0.6s ease",
          }}
        >
          {scanSteps[step % scanSteps.length]}
        </p>
        <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#7C6FF7",
                animation: `sfBounce 1s ease-in-out ${i * 0.15}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Step log */}
      <div
        style={{
          width: "100%",
          maxWidth: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "7px",
        }}
      >
        {scanSteps.slice(0, step + 1).map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "rgba(52,211,153,0.12)",
                border: "1px solid rgba(52,211,153,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round">
                <polyline points="2 6 5 9 10 3"/>
              </svg>
            </div>
            <span style={{ fontSize: "12px", color: "rgba(241,240,255,0.45)" }}>{s}</span>
          </div>
        ))}
        {step < scanSteps.length - 1 && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "rgba(124,111,247,0.10)",
                border: "1px solid rgba(124,111,247,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                animation: "sfPulse 1.5s ease-in-out infinite",
              }}
            >
              <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#7C6FF7" }} />
            </div>
            <span style={{ fontSize: "12px", color: "rgba(124,111,247,0.7)" }}>
              {scanSteps[step + 1]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
  const [focusField, setFocusField] = useState<string | null>(null);

  const score = result
    ? result.geo_score > 1
      ? result.geo_score
      : Math.round(result.geo_score * 100)
    : 0;
  const scoreLabel =
    score < 40 ? "Low Visibility" : score <= 70 ? "Moderate Visibility" : "High Visibility";
  const scoreColor =
    score < 40 ? "#F87171" : score <= 70 ? "#FACC15" : "#34D399";

  async function handleAnalyze() {
    setError(null);
    setResult(null);
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL including https://");
      return;
    }
    const usage = await fetch("/api/usage-check").then((r) => r.json());
    if (usage.exceeded) { setShowUpgrade(true); return; }
    setLoading(true);
    setStepIndex(0);
    const timer = setInterval(
      () => setStepIndex((p) => Math.min(p + 1, scanSteps.length - 1)),
      1000,
    );
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword, industry }),
      });
      const payload = (await res.json()) as AnalyzeSuccess | AnalyzeError;
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
    {
      id: "overview" as const,
      label: "Overview",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      id: "recommendations" as const,
      label: "Recommendations",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
    {
      id: "competitors" as const,
      label: "Competitors",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      ),
    },
    {
      id: "quick" as const,
      label: "Quick Wins",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
    },
  ];

  const canAnalyze = !loading && url.trim() && keyword.trim();

  return (
    <>
      <style>{`
        @keyframes sfBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes sfRadar { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
        @keyframes sfFade { 0%{opacity:0;transform:translateY(4px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes sfPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes sfSlideUp { 0%{opacity:0;transform:translateY(14px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Ambient bg */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,111,247,0.10) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "20%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "32px" }}>

        {/* ── Page Header ── */}
        <header style={{ animation: "sfSlideUp 0.5s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 10px",
                borderRadius: "999px",
                background: "rgba(124,111,247,0.10)",
                border: "1px solid rgba(124,111,247,0.22)",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#7C6FF7",
                  animation: "sfPulse 2s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#A5A0FA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                GEO Pulse™
              </span>
            </div>
            <div style={{ height: "1px", flex: 1, background: "linear-gradient(90deg, rgba(124,111,247,0.25) 0%, transparent 100%)" }} />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 600, color: "rgba(241,240,255,0.95)", letterSpacing: "-0.01em", marginBottom: "4px" }}>
            AI Visibility Analyzer
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.38)", lineHeight: 1.5 }}>
            Powered by CitationMind™ — detect how AI search engines see and cite your content
          </p>
        </header>

        {/* ── Input Panel ── */}
        <div
          style={{
            borderRadius: "16px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            padding: "22px 24px",
            animation: "sfSlideUp 0.5s ease 0.08s both",
          }}
        >
          {/* Section label */}
          <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(241,240,255,0.3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "16px" }}>
            Scan Configuration
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 180px", gap: "12px", marginBottom: "16px" }}>
            {/* URL */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(241,240,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "7px" }}>
                Website URL
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: focusField === "url" ? "#7C6FF7" : "rgba(241,240,255,0.25)",
                    transition: "color 0.2s",
                    display: "flex",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </div>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setFocusField("url")}
                  onBlur={() => setFocusField(null)}
                  placeholder="https://yoursite.com"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 34px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focusField === "url" ? "rgba(124,111,247,0.50)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focusField === "url" ? "0 0 0 3px rgba(124,111,247,0.10)" : "none",
                    color: "rgba(241,240,255,0.9)",
                    fontSize: "13px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Keyword */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(241,240,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "7px" }}>
                Target Keyword
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: focusField === "keyword" ? "#7C6FF7" : "rgba(241,240,255,0.25)",
                    transition: "color 0.2s",
                    display: "flex",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setFocusField("keyword")}
                  onBlur={() => setFocusField(null)}
                  placeholder="e.g. AI buyer intent tool"
                  style={{
                    width: "100%",
                    padding: "10px 12px 10px 34px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${focusField === "keyword" ? "rgba(124,111,247,0.50)" : "rgba(255,255,255,0.08)"}`,
                    boxShadow: focusField === "keyword" ? "0 0 0 3px rgba(124,111,247,0.10)" : "none",
                    color: "rgba(241,240,255,0.9)",
                    fontSize: "13px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* Industry */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 500, color: "rgba(241,240,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "7px" }}>
                Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as typeof industry)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(241,240,255,0.85)",
                  fontSize: "13px",
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='rgba(241,240,255,0.3)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 12px center",
                }}
              >
                {industries.map((o) => (
                  <option key={o} value={o} style={{ background: "#131320" }}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                borderRadius: "10px",
                background: canAnalyze
                  ? "linear-gradient(135deg, #6D55F5 0%, #5B44E0 100%)"
                  : "rgba(124,111,247,0.20)",
                border: canAnalyze ? "1px solid rgba(124,111,247,0.40)" : "1px solid rgba(124,111,247,0.15)",
                boxShadow: canAnalyze ? "0 0 24px rgba(109,85,245,0.35), inset 0 1px 0 rgba(255,255,255,0.12)" : "none",
                color: canAnalyze ? "#fff" : "rgba(255,255,255,0.35)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: canAnalyze ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                letterSpacing: "0.01em",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              {loading ? "Analyzing..." : "Analyze Now"}
            </button>

            {result && !loading && (
              <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: scoreColor,
                    boxShadow: `0 0 6px ${scoreColor}80`,
                  }}
                />
                <span style={{ fontSize: "12px", color: "rgba(241,240,255,0.4)" }}>
                  Last scan:{" "}
                  <span style={{ color: scoreColor, fontWeight: 500 }}>{scoreLabel}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Upgrade Banner ── */}
        {showUpgrade && (
          <div
            style={{
              borderRadius: "14px",
              background: "rgba(245,158,11,0.06)",
              border: "1px solid rgba(245,158,11,0.20)",
              padding: "18px 20px",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "16px",
              animation: "sfSlideUp 0.3s ease both",
            }}
          >
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#FCD34D", marginBottom: "4px" }}>
                Usage Limit Reached
              </p>
              <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.45)" }}>
                Upgrade your plan to run more GEO scans this month.
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
              <button
                onClick={() => router.push("/dashboard/billing")}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "#F59E0B",
                  border: "none",
                  color: "#000",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.02em",
                }}
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => setShowUpgrade(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  color: "rgba(241,240,255,0.5)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "10px",
              background: "rgba(248,113,113,0.07)",
              border: "1px solid rgba(248,113,113,0.20)",
              animation: "sfSlideUp 0.3s ease both",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: "13px", color: "#FCA5A5" }}>{error}</span>
          </div>
        )}

        {/* ── Loading ── */}
        {loading && <ScanAnimation step={stepIndex} />}

        {/* ── Results ── */}
        {result && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "sfSlideUp 0.5s ease both" }}>

            {/* Score card */}
            <div
              style={{
                borderRadius: "16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                padding: "24px",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "24px", flexWrap: "wrap" }}>
                {/* Ring + label */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <ScoreRing score={result.geo_score} />
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(241,240,255,0.3)", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "5px" }}>
                      GEO Pulse™ Score
                    </p>
                    <p style={{ fontSize: "20px", fontWeight: 700, color: scoreColor, marginBottom: "10px", letterSpacing: "-0.01em" }}>
                      {scoreLabel}
                    </p>
                    {/* Citation pill */}
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "5px 11px",
                        borderRadius: "999px",
                        background: citationConfig[result.ai_citation_probability].bg,
                        border: `1px solid ${citationConfig[result.ai_citation_probability].border}`,
                        marginBottom: "12px",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: citationConfig[result.ai_citation_probability].color,
                          animation: "sfPulse 2s ease-in-out infinite",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: citationConfig[result.ai_citation_probability].color,
                          letterSpacing: "0.03em",
                        }}
                      >
                        CitationMind™ · {citationConfig[result.ai_citation_probability].label}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.55)", lineHeight: 1.6, maxWidth: "380px" }}>
                      {result.visibility_summary}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ marginLeft: "auto", alignSelf: "center" }}>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        company: url,
                        pains: result.critical_gaps.join("; "),
                        angle: result.quick_wins[0] ?? result.visibility_summary,
                      });
                      router.push(`/dashboard/outreach?${params.toString()}`);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "11px 20px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #059669 0%, #0D9488 100%)",
                      border: "1px solid rgba(5,150,105,0.4)",
                      boxShadow: "0 0 24px rgba(5,150,105,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
                      color: "#fff",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Generate Outreach
                  </button>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                padding: "4px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "8px 12px",
                    borderRadius: "9px",
                    background: tab === t.id ? "rgba(124,111,247,0.14)" : "transparent",
                    border: tab === t.id ? "1px solid rgba(124,111,247,0.22)" : "1px solid transparent",
                    color: tab === t.id ? "#A5A0FA" : "rgba(241,240,255,0.35)",
                    fontSize: "12px",
                    fontWeight: tab === t.id ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    letterSpacing: "0.01em",
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab: Overview */}
            {tab === "overview" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {/* Strengths */}
                <div
                  style={{
                    borderRadius: "14px",
                    background: "rgba(52,211,153,0.04)",
                    border: "1px solid rgba(52,211,153,0.14)",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "8px",
                        background: "rgba(52,211,153,0.12)",
                        border: "1px solid rgba(52,211,153,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#34D399" }}>Strengths</h3>
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    {result.strengths.map((s, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                        <span style={{ color: "#34D399", flexShrink: 0, marginTop: "2px", fontSize: "12px" }}>→</span>
                        <span style={{ fontSize: "13px", color: "rgba(241,240,255,0.7)", lineHeight: 1.5 }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Critical Gaps */}
                <div
                  style={{
                    borderRadius: "14px",
                    background: "rgba(248,113,113,0.04)",
                    border: "1px solid rgba(248,113,113,0.14)",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "8px",
                        background: "rgba(248,113,113,0.12)",
                        border: "1px solid rgba(248,113,113,0.22)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: "13px", fontWeight: 600, color: "#F87171" }}>Critical Gaps</h3>
                  </div>
                  <ul style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                    {result.critical_gaps.map((s, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "9px" }}>
                        <span style={{ color: "#F87171", flexShrink: 0, marginTop: "2px", fontSize: "12px" }}>→</span>
                        <span style={{ fontSize: "13px", color: "rgba(241,240,255,0.7)", lineHeight: 1.5 }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab: Recommendations */}
            {tab === "recommendations" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {result.recommendations.map((rec, i) => {
                  const p = priorityConfig[rec.priority];
                  const cat = categoryMeta[rec.category];
                  return (
                    <div
                      key={`${rec.title}-${i}`}
                      style={{
                        borderRadius: "14px",
                        background: "rgba(255,255,255,0.02)",
                        border: `1px solid ${p.border}`,
                        padding: "18px 20px",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)")
                      }
                    >
                      {/* Header row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                        {/* Priority */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 9px",
                            borderRadius: "6px",
                            background: p.bg,
                            border: `1px solid ${p.border}`,
                          }}
                        >
                          <span
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: p.dot,
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontSize: "10px", fontWeight: 700, color: p.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            {p.label}
                          </span>
                        </div>
                        {/* Category */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 9px",
                            borderRadius: "6px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.09)",
                            color: cat?.color ?? "#A5A0FA",
                          }}
                        >
                          <span style={{ display: "flex" }}>{cat?.icon}</span>
                          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.04em", textTransform: "capitalize" }}>
                            {cat?.label ?? rec.category}
                          </span>
                        </div>
                        {/* Title */}
                        <h4 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(241,240,255,0.9)", marginLeft: "2px" }}>
                          {rec.title}
                        </h4>
                      </div>

                      {/* What to do */}
                      <p style={{ fontSize: "13px", color: "rgba(241,240,255,0.65)", lineHeight: 1.6, marginBottom: "10px" }}>
                        {rec.what_to_do}
                      </p>

                      {/* Example box */}
                      <div
                        style={{
                          padding: "10px 14px",
                          borderRadius: "9px",
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                          marginBottom: "10px",
                        }}
                      >
                        <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(241,240,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "5px" }}>
                          Example
                        </p>
                        <p style={{ fontSize: "12px", color: "rgba(241,240,255,0.55)", lineHeight: 1.5, fontFamily: "monospace" }}>
                          {rec.example}
                        </p>
                      </div>

                      {/* Impact */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
                        </svg>
                        <span style={{ fontSize: "12px", color: "#34D399", fontWeight: 500 }}>
                          {rec.expected_impact}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab: Competitors */}
            {tab === "competitors" && (
              <div
                style={{
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "8px",
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "rgba(241,240,255,0.9)" }}>
                    Competitor Advantages
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.competitor_advantages.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "rgba(245,158,11,0.04)",
                        border: "1px solid rgba(245,158,11,0.12)",
                      }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "6px",
                          background: "rgba(245,158,11,0.12)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: "13px", color: "rgba(241,240,255,0.7)", lineHeight: 1.5 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Quick Wins */}
            {tab === "quick" && (
              <div
                style={{
                  borderRadius: "14px",
                  background: "rgba(34,211,238,0.03)",
                  border: "1px solid rgba(34,211,238,0.12)",
                  padding: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "8px",
                      background: "rgba(34,211,238,0.12)",
                      border: "1px solid rgba(34,211,238,0.22)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#22D3EE" }}>Quick Wins</h3>
                    <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.35)" }}>Fix in under 1 hour</p>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.quick_wins.map((q, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        background: "rgba(34,211,238,0.04)",
                        border: "1px solid rgba(34,211,238,0.10)",
                      }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "6px",
                          background: "rgba(34,211,238,0.12)",
                          border: "1px solid rgba(34,211,238,0.20)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#22D3EE",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ fontSize: "13px", color: "rgba(241,240,255,0.7)", lineHeight: 1.5 }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}