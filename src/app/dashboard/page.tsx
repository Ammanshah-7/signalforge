"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const metrics = [
  {
    label: "GEO Pulse™",
    value: 74,
    unit: "%",
    change: "+12%",
    up: true,
    desc: "AI search visibility index",
    stroke: "#8b5cf6",
    track: "#2d1b69",
    glow: "rgba(139,92,246,0.15)",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    href: "/dashboard/geo",
  },
  {
    label: "Intent Signals",
    value: 28,
    unit: "",
    change: "+5 today",
    up: true,
    desc: "Active buyer signals",
    stroke: "#06b6d4",
    track: "#0c3044",
    glow: "rgba(6,182,212,0.15)",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    href: "/dashboard/intent",
  },
  {
    label: "Competitor Gap",
    value: 62,
    unit: "%",
    change: "-3% vs you",
    up: false,
    desc: "Competitor visibility score",
    stroke: "#f59e0b",
    track: "#3d2500",
    glow: "rgba(245,158,11,0.15)",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    href: "/dashboard/competitors",
  },
  {
    label: "Outreach Sent",
    value: 12,
    unit: "",
    change: "+3 this week",
    up: true,
    desc: "AI campaigns generated",
    stroke: "#10b981",
    track: "#022c22",
    glow: "rgba(16,185,129,0.15)",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    href: "/dashboard/outreach",
  },
];

const feed = [
  { dot: "#f87171", text: "High-intent signal on Reddit r/SaaS — 'need Apollo alternative'", time: "2m ago" },
  { dot: "#a78bfa", text: "GEO Pulse™ score improved +4 pts after content update", time: "18m ago" },
  { dot: "#f59e0b", text: "Competitor ranked #1 in ChatGPT for 'CRM for sales teams'", time: "1h ago" },
  { dot: "#34d399", text: "Outreach campaign generated for Pipedrive — 90% personalization", time: "2h ago" },
  { dot: "#f87171", text: "Switching signal: 'moving away from HubSpot' on LinkedIn", time: "3h ago" },
  { dot: "#22d3ee", text: "CitationMind™ detected brand mention in Perplexity answer", time: "5h ago" },
];

const actions = [
  { label: "Run GEO Scan", desc: "Analyze AI search visibility", href: "/dashboard/geo", color: "#8b5cf6" },
  { label: "Find Buyers", desc: "Detect real-time intent signals", href: "/dashboard/intent", color: "#06b6d4" },
  { label: "Generate Outreach", desc: "AI-written cold emails", href: "/dashboard/outreach", color: "#10b981" },
  { label: "Compare Competitors", desc: "Side-by-side GEO scores", href: "/dashboard/competitors", color: "#f59e0b" },
];

function useCounter(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const start = useRef<number | null>(null);
  useEffect(() => {
    setVal(0);
    start.current = null;
    const tick = (ts: number) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration]);
  return val;
}

function Ring({ value, stroke, track }: { value: number; stroke: string; track: string }) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setDash(circ - (value / 100) * circ), 200);
    return () => clearTimeout(t);
  }, [value, circ]);
  return (
    <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
      <circle cx="40" cy="40" r={r} fill="none" stroke={track} strokeWidth="7" />
      <circle
        cx="40" cy="40" r={r} fill="none"
        stroke={stroke} strokeWidth="7"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
    </svg>
  );
}

function MetricCard({ m, index }: { m: typeof metrics[0]; index: number }) {
  const router = useRouter();
  const count = useCounter(m.value, 1200 + index * 150);
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => router.push(m.href)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        boxShadow: hover ? `0 0 40px ${m.glow}, 0 1px 0 rgba(255,255,255,0.05) inset` : "0 1px 0 rgba(255,255,255,0.03) inset",
        borderColor: hover ? m.stroke + "40" : "#27272a",
        transform: hover ? "translateY(-2px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        cursor: "pointer",
      }}
      className="relative overflow-hidden rounded-2xl border bg-zinc-900/80 p-5 backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${m.glow} 0%, transparent 70%)`, opacity: hover ? 1 : 0 }}
      />
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium tracking-wider text-zinc-500 uppercase">{m.label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-4xl font-bold tabular-nums text-zinc-100">{count}</span>
            <span className="text-lg font-medium text-zinc-400">{m.unit}</span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">{m.desc}</p>
          <div className={`mt-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${m.badge}`}>
            <span>{m.up ? "↑" : "↓"}</span>
            <span>{m.change}</span>
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          <div className="relative">
            <Ring value={m.value} stroke={m.stroke} track={m.track} />
            <div className="absolute inset-0 flex items-center justify-center" style={{ transform: "rotate(90deg)" }}>
              <span className="text-xs font-bold" style={{ color: m.stroke }}>{m.value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email ?? "");
    });
  }, []);

  const name = email.split("@")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="relative space-y-8">
      {/* Background ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 right-0 h-[500px] w-[500px] rounded-full bg-violet-900/10 blur-3xl" />
        <div className="absolute bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-900/8 blur-3xl" />
      </div>

      {/* Header */}
      <div
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s ease",
        }}
        className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p className="text-sm text-zinc-500">{greeting}</p>
          <h1 className="text-2xl font-semibold">
            <span className="text-zinc-100">Welcome back, </span>
            <span
              style={{ background: "linear-gradient(135deg, #a78bfa, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              className="capitalize"
            >{name}</span>
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 sm:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-xs font-medium text-emerald-400">SignalForge Active</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.5s ease ${i * 80}ms`,
            }}
          >
            <MetricCard m={m} index={i} />
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Activity Feed */}
        <div
          className="lg:col-span-2 rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-5 backdrop-blur-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 400ms",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-100">Signal Feed</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Real-time intelligence updates</p>
            </div>
            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">Live</span>
          </div>
          <div className="space-y-1">
            {feed.map((item, i) => (
              <div
                key={i}
                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-zinc-800/40"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(-10px)",
                  transition: `all 0.4s ease ${500 + i * 60}ms`,
                }}
              >
                <div className="mt-1.5 flex-shrink-0">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" style={{ backgroundColor: item.dot }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: item.dot }} />
                  </span>
                </div>
                <p className="flex-1 text-sm text-zinc-300 leading-snug">{item.text}</p>
                <span className="flex-shrink-0 text-xs text-zinc-600 group-hover:text-zinc-500 transition-colors">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-5 backdrop-blur-sm"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease 480ms",
          }}
        >
          <div className="mb-4">
            <h2 className="font-semibold text-zinc-100">Quick Actions</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Launch intelligence workflows</p>
          </div>
          <div className="space-y-2">
            {actions.map((a, i) => (
              <button
                key={a.label}
                onClick={() => router.push(a.href)}
                className="group w-full rounded-xl border border-zinc-800 bg-zinc-800/30 p-3 text-left transition-all hover:border-zinc-700 hover:bg-zinc-800/60"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateX(0)" : "translateX(10px)",
                  transition: `all 0.4s ease ${560 + i * 60}ms`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-110"
                    style={{ backgroundColor: a.color + "20", color: a.color }}
                  >
                    {a.label.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{a.label}</p>
                    <p className="text-xs text-zinc-500 truncate">{a.desc}</p>
                  </div>
                  <span className="ml-auto text-zinc-600 transition-all group-hover:text-zinc-400 group-hover:translate-x-0.5">→</span>
                </div>
              </button>
            ))}
          </div>

          {/* ForgeIntel™ status */}
          <div className="mt-4 rounded-xl border border-violet-500/10 bg-violet-500/5 p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-medium text-violet-400">ForgeIntel™ Status</span>
            </div>
            <div className="space-y-1.5">
              {["GEO Pulse™", "CitationMind™", "SignalGraph AI™"].map((sys) => (
                <div key={sys} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">{sys}</span>
                  <span className="text-xs text-emerald-400">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}