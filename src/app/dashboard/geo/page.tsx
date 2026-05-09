"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

const industries = ["SaaS", "E-commerce", "Agency", "Consulting", "Other"] as const;
const loadingSteps = ["Crawling website...", "Analyzing AI visibility...", "Generating recommendations..."];

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

  const scoreColor = useMemo(() => {
    if (!result) return "text-zinc-200";
    if (result.geo_score < 40) return "text-red-400";
    if (result.geo_score <= 70) return "text-amber-400";
    return "text-emerald-400";
  }, [result]);

  async function handleAnalyze() {
    setError(null);
    setResult(null);

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL.");
      return;
    }

    const usage = await fetch("/api/usage-check").then((r) => r.json());
    if (usage.exceeded) {
      setShowUpgrade(true);
      return;
    }

    setLoading(true);
    setStepIndex(0);
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, keyword, industry }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to analyze");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to analyze");
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h1 className="text-2xl font-semibold">GEO Analyzer</h1>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-domain.com" required />
        <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Target keyword" required />
        <select value={industry} onChange={(e) => setIndustry(e.target.value as (typeof industries)[number])} className="h-11 rounded-xl border border-input bg-card px-4 text-sm">
          {industries.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <Button onClick={handleAnalyze} disabled={loading || !url || !keyword}>{loading ? loadingSteps[stepIndex] : "Analyze Now"}</Button>
      </Card>

      {showUpgrade ? (
        <Card className="p-4">
          <h2 className="text-lg font-semibold">Usage limit reached</h2>
          <p className="text-sm text-zinc-400">Upgrade your plan to run more GEO scans this month.</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={() => router.push("/dashboard/billing")}>Upgrade plan</Button>
            <Button variant="outline" onClick={() => setShowUpgrade(false)}>Close</Button>
          </div>
        </Card>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {result ? (
        <Card className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`grid h-24 w-24 place-items-center rounded-full border border-zinc-700 text-2xl font-semibold ${scoreColor}`}>
                {result.geo_score}
              </div>
              <div>
                <p className="text-sm text-zinc-400">AI Citation Probability</p>
                <p className="capitalize">{result.ai_citation_probability}</p>
                <p className="mt-1 text-sm text-zinc-300">{result.visibility_summary}</p>
              </div>
            </div>
            <Button
              onClick={() => {
                const params = new URLSearchParams({
                  company: url,
                  pains: result.critical_gaps.join("; "),
                  angle: result.quick_wins[0] ?? result.visibility_summary,
                });
                router.push(`/dashboard/outreach?${params.toString()}`);
              }}
            >
              Generate Outreach
            </Button>
          </div>

          <div className="flex gap-2 text-sm">
            <Button variant={tab === "overview" ? "default" : "outline"} onClick={() => setTab("overview")}>Overview</Button>
            <Button variant={tab === "recommendations" ? "default" : "outline"} onClick={() => setTab("recommendations")}>Recommendations</Button>
            <Button variant={tab === "competitors" ? "default" : "outline"} onClick={() => setTab("competitors")}>Competitors</Button>
            <Button variant={tab === "quick" ? "default" : "outline"} onClick={() => setTab("quick")}>Quick Wins</Button>
          </div>

          {tab === "overview" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-3"><h3 className="mb-2 font-medium">Strengths</h3><ul className="list-disc pl-5 text-sm text-zinc-300">{result.strengths.map((s) => <li key={s}>{s}</li>)}</ul></Card>
              <Card className="p-3"><h3 className="mb-2 font-medium">Critical Gaps</h3><ul className="list-disc pl-5 text-sm text-zinc-300">{result.critical_gaps.map((s) => <li key={s}>{s}</li>)}</ul></Card>
            </div>
          ) : null}

          {tab === "recommendations" ? (
            <div className="space-y-3">
              {result.recommendations.map((r) => (
                <Card key={`${r.title}-${r.priority}`} className="p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs uppercase">{r.priority}</span>
                    <span className="rounded-full bg-zinc-900 px-2 py-1 text-xs capitalize">{r.category}</span>
                    <h4 className="font-medium">{r.title}</h4>
                  </div>
                  <p className="text-sm text-zinc-300">{r.what_to_do}</p>
                  <p className="mt-1 text-sm text-zinc-400">Example: {r.example}</p>
                  <p className="mt-1 text-sm text-emerald-300">Impact: {r.expected_impact}</p>
                </Card>
              ))}
            </div>
          ) : null}

          {tab === "competitors" ? <ul className="list-disc pl-5 text-sm text-zinc-300">{result.competitor_advantages.map((c) => <li key={c}>{c}</li>)}</ul> : null}
          {tab === "quick" ? <ul className="list-disc pl-5 text-sm text-zinc-300">{result.quick_wins.map((q) => <li key={q}>{q}</li>)}</ul> : null}
        </Card>
      ) : null}
    </div>
  );
}

