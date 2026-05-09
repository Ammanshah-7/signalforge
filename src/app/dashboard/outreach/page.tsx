"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);

  const currentContent = useMemo(() => {
    if (!result) return "";
    if (tab === "Cold Email") return `Subject: ${result.email.subject}\n\n${result.email.body}\n\nCTA: ${result.email.cta}`;
    if (tab === "LinkedIn DM") return result.linkedin_dm;
    if (tab === "Follow-up Day 3") return result.follow_up_day3;
    return result.follow_up_day7;
  }, [result, tab]);

  async function generate(selectedTone: (typeof tones)[number]) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, painPoints, outreachAngle, productName, productDescription, tone: selectedTone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate outreach");
      setResult(data);
      setTone(selectedTone);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate outreach");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h1 className="text-2xl font-semibold">Outreach Generator</h1>
        <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
        <Input value={painPoints} onChange={(e) => setPainPoints(e.target.value)} placeholder="Their pain points" />
        <Input value={outreachAngle} onChange={(e) => setOutreachAngle(e.target.value)} placeholder="Outreach angle" />
        <Input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Your product name" />
        <Input value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="One-line product description" />
        <select value={tone} onChange={(e) => setTone(e.target.value as (typeof tones)[number])} className="h-11 rounded-xl border border-input bg-card px-4 text-sm">
          {tones.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="flex gap-2">
          <Button onClick={() => generate(tone)} disabled={loading || !companyName || !painPoints || !outreachAngle || !productName || !productDescription}>{loading ? "Generating..." : "Generate"}</Button>
          <Button variant="outline" onClick={() => generate(tone === "Professional" ? "Casual" : tone === "Casual" ? "Direct" : "Professional")} disabled={loading || !result}>Regenerate</Button>
          <Button variant={sent ? "default" : "outline"} onClick={() => setSent((v) => !v)}>{sent ? "Marked as Sent" : "Mark as Sent"}</Button>
        </div>
      </Card>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {result ? (
        <Card className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-xs">Personalization {result.personalization_score}</span>
              <span title={result.why_this_works} className="cursor-help text-xs text-zinc-400 underline">Why this works</span>
            </div>
            <span className="text-xs text-zinc-400">Chars: {currentContent.length}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t}</Button>)}
          </div>
          <pre className="whitespace-pre-wrap rounded-xl border border-zinc-700 bg-zinc-950/50 p-3 text-sm">{currentContent}</pre>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(currentContent)}>Copy</Button>
        </Card>
      ) : null}
    </div>
  );
}

