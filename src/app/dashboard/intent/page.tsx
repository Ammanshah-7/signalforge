"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const filters = ["All", "Hot", "Switching", "Frustrated", "Hiring"] as const;

type Lead = {
  has_intent: boolean;
  intent_type:
    | "switching"
    | "evaluating"
    | "frustrated"
    | "hiring"
    | "growing"
    | "none";
  company_hint: string;
  lead_score: number;
  urgency_score: number;
  buying_probability: "low" | "medium" | "high";
  pain_points: string[];
  outreach_angle: string;
  source_url: string;
  why_this_is_a_lead: string;
};

const scanSteps = [
  "Initializing SignalGraph AI™...",
  "Scanning Reddit discussions...",
  "Analyzing LinkedIn signals...",
  "Detecting switching intent...",
  "Scoring lead quality...",
  "Generating ForgeIntel™ report...",
];

const intentConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: string }
> = {
  switching: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    icon: "⇄",
  },
  evaluating: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    icon: "◎",
  },
  frustrated: {
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    icon: "!",
  },
  hiring: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: "+",
  },
  growing: {
    color: "#22d3ee",
    bg: "rgba(34,211,238,0.08)",
    border: "rgba(34,211,238,0.2)",
    icon: "↑",
  },
  none: {
    color: "#71717a",
    bg: "rgba(113,113,122,0.08)",
    border: "rgba(113,113,122,0.2)",
    icon: "–",
  },
};

const probConfig = {
  low: { color: "#f87171", label: "Low" },
  medium: { color: "#facc15", label: "Medium" },
  high: { color: "#34d399", label: "High" },
};

function ScoreBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div
      className="relative h-1.5 w-full overflow-hidden rounded-full"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          boxShadow: `0 0 8px ${color}60`,
        }}
      />
    </div>
  );
}

function ScanAnimation({ step }: { step: number }) {
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-ping rounded-full border border-cyan-500/20" />
        <div className="absolute h-16 w-16 animate-pulse rounded-full border border-cyan-500/30" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/10">
          <span className="text-lg">🔍</span>
        </div>
      </div>

      <div className="text-center">
        <p className="animate-pulse text-sm font-medium text-cyan-400">
          {scanSteps[step % scanSteps.length]}
        </p>

        <p className="mt-1 text-xs text-zinc-600">
          Scanning 50M+ discussions in real-time
        </p>
      </div>

      <div className="w-64 space-y-1.5">
        {scanSteps.slice(0, step + 1).map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-emerald-400">✓</span>

            <span className="text-xs text-zinc-500">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  index,
}: {
  lead: Lead;
  index: number;
}) {
  const router = useRouter();

  const cfg = intentConfig[lead.intent_type] ?? intentConfig.none;

  const prob = probConfig[lead.buying_probability];

  const isHot = lead.lead_score > 70;

  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300 hover:brightness-105"
      style={{
        background: isHot
          ? "rgba(251,146,60,0.03)"
          : "rgba(255,255,255,0.02)",
        border: isHot
          ? "1px solid rgba(251,146,60,0.2)"
          : `1px solid ${cfg.border}`,
        boxShadow: isHot
          ? "0 0 30px rgba(251,146,60,0.05)"
          : "none",
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {isHot && (
            <span
              className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{
                background: "rgba(251,146,60,0.15)",
                color: "#fb923c",
                border: "1px solid rgba(251,146,60,0.3)",
              }}
            >
              🔥 HOT LEAD
            </span>
          )}

          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
            style={{
              background: cfg.bg,
              color: cfg.color,
              border: `1px solid ${cfg.border}`,
            }}
          >
            {cfg.icon} {lead.intent_type}
          </span>

          {lead.company_hint && (
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{
                background: "rgba(139,92,246,0.1)",
                color: "#a78bfa",
                border: "1px solid rgba(139,92,246,0.2)",
              }}
            >
              {lead.company_hint}
            </span>
          )}
        </div>

        <a
          href={lead.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-xs text-zinc-500 underline underline-offset-2 transition-colors hover:text-cyan-400"
        >
          Source →
        </a>
      </div>

      {/* Scores */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Lead Score</span>

            <span
              className="text-xs font-bold"
              style={{
                color:
                  lead.lead_score > 70
                    ? "#34d399"
                    : lead.lead_score > 40
                    ? "#facc15"
                    : "#f87171",
              }}
            >
              {lead.lead_score}
            </span>
          </div>

          <ScoreBar
            value={lead.lead_score}
            color={
              lead.lead_score > 70
                ? "#34d399"
                : lead.lead_score > 40
                ? "#facc15"
                : "#f87171"
            }
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Urgency</span>

            <span
              className="text-xs font-bold"
              style={{ color: "#fb923c" }}
            >
              {lead.urgency_score}
            </span>
          </div>

          <ScoreBar value={lead.urgency_score} color="#fb923c" />
        </div>
      </div>

      {/* Buying probability */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-zinc-500">
          Buying Probability:
        </span>

        <span
          className="text-xs font-semibold"
          style={{ color: prob.color }}
        >
          {prob.label}
        </span>

        <div
          className="h-1.5 w-1.5 animate-pulse rounded-full"
          style={{ backgroundColor: prob.color }}
        />
      </div>

      {/* Pain points */}
      {lead.pain_points.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {lead.pain_points.map((pain) => (
            <span
              key={pain}
              className="rounded-full px-2.5 py-0.5 text-xs"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#a1a1aa",
              }}
            >
              {pain}
            </span>
          ))}
        </div>
      )}

      {/* Outreach angle */}
      {lead.outreach_angle && (
        <div
          className="mb-4 rounded-xl p-3"
          style={{
            background: "rgba(139,92,246,0.05)",
            border: "1px solid rgba(139,92,246,0.1)",
          }}
        >
          <p className="mb-1 text-xs text-violet-400">
            Outreach Angle
          </p>

          <p className="text-sm text-zinc-300">
            {lead.outreach_angle}
          </p>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() =>
          router.push(
            `/dashboard/outreach?company=${encodeURIComponent(
              lead.company_hint || "Prospect"
            )}&pains=${encodeURIComponent(
              lead.pain_points.join("; ")
            )}&angle=${encodeURIComponent(lead.outreach_angle)}`
          )
        }
        className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] hover:opacity-90"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed, #0891b2)",
          boxShadow: "0 0 20px rgba(124,58,237,0.2)",
        }}
      >
        Generate Outreach →
      </button>
    </div>
  );
}

export default function IntentPage() {
  const [productDescription, setProductDescription] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [keywords, setKeywords] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All");

  const [stepIndex, setStepIndex] = useState(0);

  const [inputFocus, setInputFocus] =
    useState<string | null>(null);

  const visible = useMemo(() => {
    if (filter === "All") return leads;

    if (filter === "Hot") {
      return leads.filter((l) => l.lead_score > 70);
    }

    return leads.filter(
      (l) =>
        l.intent_type.toLowerCase() === filter.toLowerCase()
    );
  }, [filter, leads]);

  const hotLeads = leads.filter((l) => l.lead_score > 70);

  async function handleFind() {
    setError(null);

    setLeads([]);

    setLoading(true);

    setStepIndex(0);

    const timer = setInterval(() => {
      setStepIndex((p) =>
        Math.min(p + 1, scanSteps.length - 1)
      );
    }, 900);

    try {
      const keywordList = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      const res = await fetch("/api/intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productDescription,
          idealCustomer,
          keywords: keywordList,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to find buyers");
      }

      setLeads(data.signals ?? []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to find buyers"
      );
    } finally {
      clearInterval(timer);

      setLoading(false);
    }
  }

  const inputStyle = (key: string) => ({
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${
      inputFocus === key
        ? "rgba(6,182,212,0.5)"
        : "rgba(255,255,255,0.06)"
    }`,
    boxShadow:
      inputFocus === key
        ? "0 0 0 3px rgba(6,182,212,0.1)"
        : "none",
    color: "#e4e4e7",
    outline: "none",
    transition: "all 0.2s ease",
  });

  return (
    <div className="relative space-y-6">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-10 top-20 h-80 w-80 rounded-full bg-cyan-900/8 blur-3xl" />
      </div>

      {/* Header */}
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-cyan-400">
            SignalGraph AI™
          </span>

          <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-100">
          Buyer Intent Engine
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Real-time intent detection across 50M+ discussions —
          powered by ForgeIntel™
        </p>
      </div>

      {/* Input */}
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
              Your Product
            </label>

            <textarea
              value={productDescription}
              onChange={(e) =>
                setProductDescription(e.target.value)
              }
              onFocus={() => setInputFocus("product")}
              onBlur={() => setInputFocus(null)}
              placeholder="e.g. AI buyer intent tool for B2B SaaS companies"
              rows={2}
              className="w-full resize-none rounded-xl px-4 py-2.5 text-sm"
              style={inputStyle("product")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Ideal Customer
              </label>

              <input
                value={idealCustomer}
                onChange={(e) =>
                  setIdealCustomer(e.target.value)
                }
                onFocus={() => setInputFocus("icp")}
                onBlur={() => setInputFocus(null)}
                placeholder="e.g. SaaS founders, 10-200 employees"
                className="w-full rounded-xl px-4 py-2.5 text-sm"
                style={inputStyle("icp")}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-500">
                Keywords (comma-separated)
              </label>

              <input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                onFocus={() => setInputFocus("kw")}
                onBlur={() => setInputFocus(null)}
                placeholder="e.g. buyer intent, sales intelligence"
                className="w-full rounded-xl px-4 py-2.5 text-sm"
                style={inputStyle("kw")}
              />
            </div>
          </div>

          <button
            onClick={handleFind}
            disabled={
              loading ||
              !productDescription ||
              !idealCustomer ||
              !keywords
            }
            className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background:
                "linear-gradient(135deg, #0891b2, #06b6d4)",
              boxShadow:
                !loading &&
                productDescription &&
                idealCustomer &&
                keywords
                  ? "0 0 20px rgba(6,182,212,0.3), 0 1px 0 rgba(255,255,255,0.1) inset"
                  : "none",
            }}
          >
            {loading ? "Scanning..." : "🔍 Find Buyers Now"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {loading && <ScanAnimation step={stepIndex} />}

      {/* Results */}
      {!loading && leads.length > 0 && (
        <div className="space-y-5">
          {/* Hot leads banner */}
          {hotLeads.length > 0 && (
            <div
              className="flex items-center gap-4 rounded-2xl p-4"
              style={{
                background: "rgba(251,146,60,0.06)",
                border: "1px solid rgba(251,146,60,0.2)",
              }}
            >
              <div className="text-2xl">🔥</div>

              <div className="flex-1">
                <p className="font-semibold text-orange-400">
                  {hotLeads.length} Hot Lead
                  {hotLeads.length > 1 ? "s" : ""} Detected
                </p>

                <p className="text-xs text-zinc-500">
                  High-intent signals with lead score above 70
                </p>
              </div>

              <button
                onClick={() => setFilter("Hot")}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-orange-400 transition-all hover:bg-orange-500/10"
                style={{
                  border:
                    "1px solid rgba(251,146,60,0.3)",
                }}
              >
                View Hot Leads
              </button>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-shrink-0 rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                style={{
                  background:
                    filter === f
                      ? "rgba(6,182,212,0.15)"
                      : "transparent",
                  color:
                    filter === f
                      ? "#22d3ee"
                      : "#71717a",
                  border:
                    filter === f
                      ? "1px solid rgba(6,182,212,0.2)"
                      : "1px solid transparent",
                }}
              >
                {f}

                {f === "Hot" && hotLeads.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-orange-500/20 px-1.5 py-0.5 text-xs text-orange-400">
                    {hotLeads.length}
                  </span>
                )}

                {f === "All" && (
                  <span className="ml-1.5 rounded-full bg-zinc-700 px-1.5 py-0.5 text-xs text-zinc-400">
                    {leads.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Lead cards */}
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/30 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No {filter.toLowerCase()} signals found.
              </p>

              <button
                onClick={() => setFilter("All")}
                className="mt-2 text-xs text-cyan-400 hover:underline"
              >
                Show all signals
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((lead, i) => (
                <LeadCard
                  key={`${lead.source_url}-${i}`}
                  lead={lead}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!loading && leads.length === 0 && !error && (
        <div className="rounded-2xl border border-zinc-800/40 bg-zinc-900/20 p-10 text-center">
          <div className="mb-3 text-4xl">🎯</div>

          <p className="font-medium text-zinc-300">
            Ready to find your buyers
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Fill in your product details and keywords to start
            detecting intent signals
          </p>
        </div>
      )}
    </div>
  );
}