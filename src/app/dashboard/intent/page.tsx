"use client";

import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const filters = ["All", "Hot", "Switching", "Frustrated", "Hiring"] as const;

type Lead = {
  has_intent: boolean;
  intent_type: "switching" | "evaluating" | "frustrated" | "hiring" | "growing" | "none";
  company_hint: string;
  lead_score: number;
  urgency_score: number;
  buying_probability: "low" | "medium" | "high";
  pain_points: string[];
  outreach_angle: string;
  source_url: string;
  why_this_is_a_lead: string;
};

export default function IntentPage() {
  const [productDescription, setProductDescription] = useState("");
  const [idealCustomer, setIdealCustomer] = useState("");
  const [keywords, setKeywords] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const visible = useMemo(() => {
    if (filter === "All") return leads;
    if (filter === "Hot") return leads.filter((l) => l.lead_score > 70);
    return leads.filter((l) => l.intent_type.toLowerCase() === filter.toLowerCase());
  }, [filter, leads]);

  async function handleFind() {
    setError(null);
    setLoading(true);
    try {
      const keywordList = keywords.split(",").map((k) => k.trim()).filter(Boolean);
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDescription, idealCustomer, keywords: keywordList }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to find buyers");
      setLeads(data.signals ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to find buyers");
    } finally {
      setLoading(false);
    }
  }

  const hotLeads = leads.filter((lead) => lead.lead_score > 70);

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h1 className="text-2xl font-semibold">Buyer Intent Engine</h1>
        <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="AI email marketing tool for e-commerce" className="min-h-24 w-full rounded-xl border border-input bg-card p-3 text-sm" />
        <input value={idealCustomer} onChange={(e) => setIdealCustomer(e.target.value)} placeholder="E-commerce founders, 10-100 employees" className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm" />
        <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="email marketing, klaviyo alternative" className="h-11 w-full rounded-xl border border-input bg-card px-4 text-sm" />
        <Button onClick={handleFind} disabled={loading || !productDescription || !idealCustomer || !keywords}>{loading ? "Finding buyers..." : "Find Buyers Now"}</Button>
      </Card>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {hotLeads.length > 0 ? (
        <Card className="p-4">
          <div className="mb-2 flex items-center gap-2 text-lg font-semibold"><Flame className="h-5 w-5 text-orange-400" /> Hot Leads</div>
          <p className="text-sm text-zinc-400">{hotLeads.length} high-intent leads detected</p>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card className="p-4 text-sm text-zinc-400">No signals found. Try broader keywords.</Card>
      ) : (
        <div className="space-y-3">
          {visible.map((lead, idx) => (
            <Card key={`${lead.source_url}-${idx}`} className="space-y-2 p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs capitalize">{lead.intent_type}</span>
                <a className="text-xs text-cyan-300 underline" href={lead.source_url} target="_blank">Source</a>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-zinc-400">Lead Score: {lead.lead_score}</p>
                  <div className="mt-1 h-2 rounded bg-zinc-800"><div className="h-2 rounded bg-cyan-400" style={{ width: `${lead.lead_score}%` }} /></div>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Urgency: {lead.urgency_score}</p>
                  <div className="mt-1 h-2 rounded bg-zinc-800"><div className="h-2 rounded bg-amber-400" style={{ width: `${lead.urgency_score}%` }} /></div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">{lead.pain_points.map((pain) => <span key={pain} className="rounded-full bg-zinc-900 px-2 py-1 text-xs">{pain}</span>)}</div>
              <p className="text-sm text-zinc-300">{lead.outreach_angle}</p>
              <a
                className="inline-block rounded-2xl border border-zinc-700 px-3 py-2 text-sm"
                href={`/dashboard/outreach?company=${encodeURIComponent(lead.company_hint || "Prospect")}&pains=${encodeURIComponent(lead.pain_points.join("; "))}&angle=${encodeURIComponent(lead.outreach_angle)}`}
              >
                Generate Outreach
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

