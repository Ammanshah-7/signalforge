"use client";

import { useState, useEffect } from "react";
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

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function exportCSV(data: Record<string, string | number>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((r) => Object.values(r).map((v) => `"${v}"`).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${rows}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 70 ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : score >= 40 ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
    : "text-red-400 bg-red-500/10 border-red-500/20";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${color}`}>{score}</span>;
}

function CitationBadge({ value }: { value: string }) {
  const config = { high: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", medium: "text-amber-400 bg-amber-500/10 border-amber-500/20", low: "text-red-400 bg-red-500/10 border-red-500/20" };
  const key = (value ?? "low") as keyof typeof config;
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs capitalize font-medium ${config[key] ?? config.low}`}>{value}</span>;
}

export default function ReportsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<(typeof tabs)[number]>("GEO Scans");
  const [geoReports, setGeoReports] = useState<GeoReport[]>([]);
  const [intentSignals, setIntentSignals] = useState<IntentSignal[]>([]);
  const [outreachCampaigns, setOutreachCampaigns] = useState<OutreachCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const tabCounts = { "GEO Scans": geoReports.length, "Intent Searches": intentSignals.length, "Outreach Campaigns": outreachCampaigns.length };

  const filteredGeo = geoReports.filter(r => !search || (r.scans?.input?.url ?? "").toLowerCase().includes(search.toLowerCase()) || (r.scans?.input?.keyword ?? "").toLowerCase().includes(search.toLowerCase()));
  const filteredIntent = intentSignals.filter(s => !search || (s.query ?? "").toLowerCase().includes(search.toLowerCase()));
  const filteredOutreach = outreachCampaigns.filter(c => !search || c.company_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050816 0%, #07111f 50%, #0b1020 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .page-font { font-family: 'DM Sans', sans-serif; }
        .heading-font { font-family: 'Syne', sans-serif; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .grid-bg { background-image: linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px); background-size: 48px 48px; }
        .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        .table-row:last-child { border-bottom: none; }
        .input-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 14px 9px 36px; color: #e2e8f0; font-size: 14px; outline: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; width: 100%; }
        .input-field:focus { border-color: rgba(6,182,212,0.4); }
        .btn-export { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 16px; color: #94a3b8; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-export:hover { background: rgba(255,255,255,0.09); color: #e2e8f0; }
        .btn-cta { background: linear-gradient(135deg, #06b6d4, #3b82f6); border: none; border-radius: 10px; padding: 10px 20px; color: white; font-weight: 600; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(6,182,212,0.25); }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeInUp 0.35s ease forwards; }
        .shimmer { background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div className="page-font grid-bg min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8 fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs">📊</div>
              <span className="text-xs font-medium text-blue-400/70 uppercase tracking-widest">Intelligence Reports</span>
            </div>
            <h1 className="heading-font text-3xl font-bold text-white mb-1">Reports</h1>
            <p className="text-slate-400 text-sm">Your complete history of GEO scans, buyer signals, and outreach campaigns.</p>
          </div>

          {/* Stats Row */}
          {!loading && (
            <div className="grid grid-cols-3 gap-4 mb-6 fade-in">
              {tabs.map((t, i) => {
                const count = tabCounts[t];
                const icons = ["🔭", "🎯", "✉"];
                const colors = ["text-cyan-400", "text-violet-400", "text-emerald-400"];
                const bgs = ["bg-cyan-500/10 border-cyan-500/15", "bg-violet-500/10 border-violet-500/15", "bg-emerald-500/10 border-emerald-500/15"];
                return (
                  <button key={t} onClick={() => setTab(t)}
                    className={`glass rounded-xl p-4 text-left transition-all duration-200 border ${tab === t ? bgs[i] : "hover:bg-white/[0.04]"}`}>
                    <div className="text-lg mb-1">{icons[i]}</div>
                    <div className={`heading-font text-2xl font-bold mb-0.5 ${colors[i]}`}>{count}</div>
                    <div className="text-xs text-slate-500">{t}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-3 mb-5 flex-wrap fade-in">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
              <input className="input-field" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports..." />
            </div>
            <div className="flex gap-2 ml-auto">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${tab === t ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-400" : "bg-white/[0.03] border-white/[0.08] text-slate-500 hover:text-slate-300"}`}>
                  {t}
                  <span className="ml-1.5 opacity-60">{tabCounts[t]}</span>
                </button>
              ))}
            </div>
            {tab === "GEO Scans" && geoReports.length > 0 && (
              <button className="btn-export" onClick={() => exportCSV(geoReports.map(r => ({ Date: formatDate(r.created_at), URL: r.scans?.input?.url ?? "", Keyword: r.scans?.input?.keyword ?? "", Score: r.geo_score, Citation: r.ai_citation_probability })), "geo-reports.csv")}>
                ↓ Export CSV
              </button>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <div className="glass rounded-2xl p-6 space-y-3 fade-in">
              {[100, 85, 92, 78, 95].map((w, i) => (
                <div key={i} className={`h-10 rounded-lg shimmer`} style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <div className="fade-in">

              {tab === "GEO Scans" && (
                filteredGeo.length === 0 ? (
                  <EmptyState icon="🔭" title="No GEO scans yet" sub="Analyze your AI search visibility to start building your report history." action="Run First GEO Scan" onAction={() => router.push("/dashboard/geo")} />
                ) : (
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] text-xs text-slate-500 uppercase tracking-wide px-5 py-3 border-b border-white/5">
                      <span>Date</span><span>URL</span><span>Keyword</span><span>Score</span><span>AI Citation</span>
                    </div>
                    {filteredGeo.map((r) => (
                      <div key={r.id} className="table-row grid grid-cols-[1.5fr_2fr_1.5fr_1fr_1fr] items-center px-5 py-3.5">
                        <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>
                        <span className="text-sm text-slate-300 truncate pr-3">{r.scans?.input?.url ?? "—"}</span>
                        <span className="text-sm text-slate-400 truncate pr-3">{r.scans?.input?.keyword ?? "—"}</span>
                        <ScorePill score={r.geo_score} />
                        <CitationBadge value={r.ai_citation_probability} />
                      </div>
                    ))}
                  </div>
                )
              )}

              {tab === "Intent Searches" && (
                filteredIntent.length === 0 ? (
                  <EmptyState icon="🎯" title="No intent searches yet" sub="Discover high-intent buyers searching for solutions like yours." action="Find Buyers" onAction={() => router.push("/dashboard/intent")} />
                ) : (
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] text-xs text-slate-500 uppercase tracking-wide px-5 py-3 border-b border-white/5">
                      <span>Date</span><span>Query</span><span>Lead Score</span><span>Urgency</span>
                    </div>
                    {filteredIntent.map((s) => (
                      <div key={s.id} className="table-row grid grid-cols-[1.5fr_3fr_1fr_1fr] items-center px-5 py-3.5">
                        <span className="text-xs text-slate-500">{formatDate(s.created_at)}</span>
                        <span className="text-sm text-slate-300 truncate pr-3">{s.query ?? "—"}</span>
                        <ScorePill score={s.lead_score} />
                        <ScorePill score={s.urgency_score} />
                      </div>
                    ))}
                  </div>
                )
              )}

              {tab === "Outreach Campaigns" && (
                filteredOutreach.length === 0 ? (
                  <EmptyState icon="✉" title="No campaigns yet" sub="Generate AI-powered outreach sequences that convert." action="Generate Outreach" onAction={() => router.push("/dashboard/outreach")} />
                ) : (
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[1.5fr_2fr_1fr_3fr] text-xs text-slate-500 uppercase tracking-wide px-5 py-3 border-b border-white/5">
                      <span>Date</span><span>Company</span><span>Status</span><span>Subject</span>
                    </div>
                    {filteredOutreach.map((c) => (
                      <div key={c.id} className="table-row grid grid-cols-[1.5fr_2fr_1fr_3fr] items-center px-5 py-3.5">
                        <span className="text-xs text-slate-500">{formatDate(c.created_at)}</span>
                        <span className="text-sm font-medium text-slate-200">{c.company_name}</span>
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c.status === "sent" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-white/5 border-white/10 text-slate-500"}`}>
                          {c.status ?? "draft"}
                        </span>
                        <span className="text-sm text-slate-400 truncate">{c.email_content?.subject ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, sub, action, onAction }: { icon: string; title: string; sub: string; action: string; onAction: () => void }) {
  return (
    <div className="glass rounded-2xl p-16 flex flex-col items-center justify-center text-center fade-in">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center text-3xl mb-5">{icon}</div>
      <h3 className="heading-font text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">{sub}</p>
      <button onClick={onAction} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/20">
        {action}
      </button>
    </div>
  );
}