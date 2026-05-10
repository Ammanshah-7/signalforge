"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type GeoReport = {
  id: string;
  scan_id: string;
  geo_score: number;
  ai_citation_probability: string;
  created_at: string;
  scans: { input: Record<string, string> } | null;
};

type IntentSignal = {
  id: string;
  created_at: string;
  query: string;
  lead_score: number;
  urgency_score: number;
};

type OutreachCampaign = {
  id: string;
  created_at: string;
  company_name: string;
  status: string;
  email_content: Record<string, string>;
};

const tabs = ["GEO Scans", "Intent Searches", "Outreach Campaigns"] as const;

function scoreColor(score: number) {
  if (score < 40) return "text-red-400";
  if (score <= 70) return "text-amber-400";
  return "text-emerald-400";
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function exportCSV(data: Record<string, string | number>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((r) =>
    Object.values(r).map((v) => `"${v}"`).join(",")
  ).join("\n");
  const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<(typeof tabs)[number]>("GEO Scans");
  const [geoReports, setGeoReports] = useState<GeoReport[]>([]);
  const [intentSignals, setIntentSignals] = useState<IntentSignal[]>([]);
  const [outreachCampaigns, setOutreachCampaigns] = useState<OutreachCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [geoRes, intentRes, outreachRes] = await Promise.all([
        supabase.from("geo_reports").select("*, scans(input)").order("created_at", { ascending: false }),
        supabase.from("intent_signals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("outreach_campaigns").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      setGeoReports((geoRes.data as GeoReport[]) ?? []);
      setIntentSignals((intentRes.data as IntentSignal[]) ?? []);
      setOutreachCampaigns((outreachRes.data as OutreachCampaign[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        {tab === "GEO Scans" && geoReports.length > 0 && (
          <Button variant="outline" onClick={() => exportCSV(
            geoReports.map((r) => ({
              Date: formatDate(r.created_at),
              URL: r.scans?.input?.url ?? "",
              Keyword: r.scans?.input?.keyword ?? "",
              Score: r.geo_score,
              Citation: r.ai_citation_probability,
            })),
            "geo-reports.csv"
          )}>Export CSV</Button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <Button key={t} variant={tab === t ? "default" : "outline"} onClick={() => setTab(t)}>{t}</Button>
        ))}
      </div>

      {loading ? (
        <Card className="p-8 text-center text-zinc-400 text-sm">Loading reports...</Card>
      ) : (
        <>
          {tab === "GEO Scans" && (
            geoReports.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <p className="text-zinc-400">No GEO scans yet.</p>
                <Button onClick={() => router.push("/dashboard/geo")}>Run your first GEO scan</Button>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-800">
                    <tr className="text-left text-zinc-400">
                      <th className="p-3">Date</th>
                      <th className="p-3">URL</th>
                      <th className="p-3">Keyword</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">AI Citation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geoReports.map((r) => (
                      <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="p-3 text-zinc-400">{formatDate(r.created_at)}</td>
                        <td className="p-3 max-w-[180px] truncate">{r.scans?.input?.url ?? "—"}</td>
                        <td className="p-3">{r.scans?.input?.keyword ?? "—"}</td>
                        <td className={`p-3 font-semibold ${scoreColor(r.geo_score)}`}>{r.geo_score}</td>
                        <td className="p-3 capitalize">{r.ai_citation_probability}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}

          {tab === "Intent Searches" && (
            intentSignals.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <p className="text-zinc-400">No intent searches yet.</p>
                <Button onClick={() => router.push("/dashboard/intent")}>Find your first buyers</Button>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-800">
                    <tr className="text-left text-zinc-400">
                      <th className="p-3">Date</th>
                      <th className="p-3">Query</th>
                      <th className="p-3">Lead Score</th>
                      <th className="p-3">Urgency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intentSignals.map((s) => (
                      <tr key={s.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="p-3 text-zinc-400">{formatDate(s.created_at)}</td>
                        <td className="p-3 max-w-[200px] truncate">{s.query ?? "—"}</td>
                        <td className={`p-3 font-semibold ${scoreColor(s.lead_score)}`}>{s.lead_score}</td>
                        <td className="p-3">{s.urgency_score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}

          {tab === "Outreach Campaigns" && (
            outreachCampaigns.length === 0 ? (
              <Card className="p-8 text-center space-y-3">
                <p className="text-zinc-400">No outreach campaigns yet.</p>
                <Button onClick={() => router.push("/dashboard/outreach")}>Generate your first outreach</Button>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="border-b border-zinc-800">
                    <tr className="text-left text-zinc-400">
                      <th className="p-3">Date</th>
                      <th className="p-3">Company</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Subject</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outreachCampaigns.map((c) => (
                      <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="p-3 text-zinc-400">{formatDate(c.created_at)}</td>
                        <td className="p-3 font-medium">{c.company_name}</td>
                        <td className="p-3">
                          <span className={`rounded-full px-2 py-1 text-xs ${c.status === "sent" ? "bg-emerald-900/50 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                            {c.status ?? "draft"}
                          </span>
                        </td>
                        <td className="p-3 max-w-[200px] truncate text-zinc-400">
                          {c.email_content?.subject ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )
          )}
        </>
      )}
    </div>
  );
}