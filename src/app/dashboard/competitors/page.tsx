"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
type GeoResult = { geo_score: number; ai_citation_probability: "low" | "medium" | "high"; visibility_summary: string; strengths: string[]; critical_gaps: string[]; quick_wins: string[]; };
type SiteResult = { url: string; result: GeoResult | null; error: string | null; };
const industries = ["SaaS", "E-commerce", "Agency", "Consulting", "Other"] as const;
function scoreColor(score: number) { if (score < 40) return "text-red-400"; if (score <= 70) return "text-amber-400"; return "text-emerald-400"; }
function scoreBorder(score: number) { if (score < 40) return "border-red-800"; if (score <= 70) return "border-amber-800"; return "border-emerald-800"; }
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
  const [error, setError] = useState<string | null>(null);
  async function analyzeSite(url: string): Promise<SiteResult> {
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, keyword, industry }) });
      const payload = await res.json();
      if (!res.ok || !payload.success) return { url, result: null, error: payload.error ?? "Analysis failed" };
      return { url, result: payload.data, error: null };
    } catch { return { url, result: null, error: "Network error" }; }
  }
  async function handleCompare() {
    setError(null); setResults([]);
    try { new URL(myUrl); } catch { setError("Enter a valid URL for your site."); return; }
    try { new URL(competitor1); } catch { setError("Enter a valid URL for Competitor 1."); return; }
    const urls = [myUrl, competitor1, competitor2, competitor3].filter(Boolean);
    setLoading(true);
    const allResults: SiteResult[] = [];
    for (let i = 0; i < urls.length; i++) {
      setLoadingStep(`Analyzing ${i === 0 ? "your site" : `competitor ${i}`}... (${i + 1}/${urls.length})`);
      allResults.push(await analyzeSite(urls[i]));
    }
    setResults(allResults); setLoading(false); setLoadingStep("");
  }
  const winner = results.reduce<SiteResult | null>((best, r) => { if (!r.result) return best; if (!best?.result) return r; return r.result.geo_score > best.result.geo_score ? r : best; }, null);
  const myResult = results[0];
  const competitorResults = results.slice(1);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Competitor Analysis</h1>
      <Card className="space-y-3 p-4">
        <p className="text-sm text-zinc-400">Compare your AI search visibility against competitors side by side.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="text-xs text-zinc-400 mb-1 block">Your Website URL</label><Input value={myUrl} onChange={(e) => setMyUrl(e.target.value)} placeholder="https://yoursite.com" /></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Target Keyword</label><Input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. CRM for sales teams" /></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Industry</label><select value={industry} onChange={(e) => setIndustry(e.target.value as typeof industry)} className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm">{industries.map((i) => <option key={i} value={i}>{i}</option>)}</select></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Competitor 1 (required)</label><Input value={competitor1} onChange={(e) => setCompetitor1(e.target.value)} placeholder="https://competitor1.com" /></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Competitor 2 (optional)</label><Input value={competitor2} onChange={(e) => setCompetitor2(e.target.value)} placeholder="https://competitor2.com" /></div>
          <div><label className="text-xs text-zinc-400 mb-1 block">Competitor 3 (optional)</label><Input value={competitor3} onChange={(e) => setCompetitor3(e.target.value)} placeholder="https://competitor3.com" /></div>
        </div>
        <Button onClick={handleCompare} disabled={loading || !myUrl || !keyword || !competitor1}>{loading ? loadingStep : "Compare Now"}</Button>
      </Card>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${results.length}, 1fr)` }}>
            {results.map((r, i) => (
              <Card key={r.url} className={`p-4 space-y-2 border ${r.result ? scoreBorder(r.result.geo_score) : "border-zinc-800"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-zinc-400">{i === 0 ? "Your Site" : `Competitor ${i}`}</p>
                  {winner?.url === r.url && <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded-full">��� Winner</span>}
                </div>
                <p className="text-xs text-zinc-500 truncate">{r.url}</p>
                {r.result ? (<><div className={`text-4xl font-bold ${scoreColor(r.result.geo_score)}`}>{r.result.geo_score}</div><p className="text-xs text-zinc-400">AI Citation: <span className="capitalize text-zinc-200">{r.result.ai_citation_probability}</span></p><p className="text-xs text-zinc-400 line-clamp-2">{r.result.visibility_summary}</p></>) : <p className="text-xs text-red-400">{r.error}</p>}
              </Card>
            ))}
          </div>
          {myResult?.result && competitorResults.some((r) => r.result) && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="p-4 border-emerald-900/30"><h3 className="font-medium text-emerald-400 mb-3">✅ Where You Win</h3><ul className="space-y-2">{myResult.result.strengths.map((s) => <li key={s} className="text-sm text-zinc-300 flex gap-2"><span className="text-emerald-400">→</span>{s}</li>)}</ul></Card>
              <Card className="p-4 border-red-900/30"><h3 className="font-medium text-red-400 mb-3">❌ Where They Win</h3><ul className="space-y-2">{myResult.result.critical_gaps.map((g) => <li key={g} className="text-sm text-zinc-300 flex gap-2"><span className="text-red-400">→</span>{g}</li>)}</ul></Card>
            </div>
          )}
          {myResult?.result && myResult.result.quick_wins.length > 0 && (
            <Card className="p-4"><h3 className="font-medium mb-3">⚡ Quick Wins to Beat Competitors</h3><ul className="space-y-2">{myResult.result.quick_wins.map((w) => <li key={w} className="text-sm text-zinc-300 flex gap-2"><span className="text-amber-400">→</span>{w}</li>)}</ul></Card>
          )}
          {competitorResults[0]?.result && (
            <Card className="p-4 flex items-center justify-between">
              <div><p className="font-medium">Ready to outreach?</p><p className="text-sm text-zinc-400">Generate personalized outreach based on this analysis.</p></div>
              <Button onClick={() => { const params = new URLSearchParams({ company: competitor1, pains: myResult?.result?.critical_gaps.join("; ") ?? "", angle: `They outrank you in AI search for ${keyword}` }); router.push(`/dashboard/outreach?${params.toString()}`); }}>Generate Outreach</Button>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
