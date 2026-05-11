"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// ─── Data ────────────────────────────────────────────────────────────────────

const metrics = [
  {
    label: "GEO Pulse™",
    value: 74,
    unit: "%",
    change: "+12%",
    up: true,
    desc: "AI search visibility index",
    color: "#7C6FF7",
    colorLight: "rgba(124,111,247,0.10)",
    colorBorder: "rgba(124,111,247,0.25)",
    trackColor: "rgba(124,111,247,0.15)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
      </svg>
    ),
    href: "/dashboard/geo",
  },
  {
    label: "Intent Signals",
    value: 28,
    unit: "",
    change: "+5 today",
    up: true,
    desc: "Active buyer signals",
    color: "#22D3EE",
    colorLight: "rgba(34,211,238,0.10)",
    colorBorder: "rgba(34,211,238,0.25)",
    trackColor: "rgba(34,211,238,0.15)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    href: "/dashboard/intent",
  },
  {
    label: "Competitor Gap",
    value: 62,
    unit: "%",
    change: "−3% vs you",
    up: false,
    desc: "Competitor visibility score",
    color: "#F59E0B",
    colorLight: "rgba(245,158,11,0.10)",
    colorBorder: "rgba(245,158,11,0.25)",
    trackColor: "rgba(245,158,11,0.15)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/>
      </svg>
    ),
    href: "/dashboard/competitors",
  },
  {
    label: "Outreach Sent",
    value: 12,
    unit: "",
    change: "+3 this week",
    up: true,
    desc: "AI campaigns generated",
    color: "#34D399",
    colorLight: "rgba(52,211,153,0.10)",
    colorBorder: "rgba(52,211,153,0.25)",
    trackColor: "rgba(52,211,153,0.15)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
    href: "/dashboard/outreach",
  },
];

const feed = [
  {
    color: "#F87171",
    category: "Intent",
    text: "High-intent signal on Reddit r/SaaS — 'need Apollo alternative'",
    time: "2m ago",
    priority: "high",
  },
  {
    color: "#7C6FF7",
    category: "GEO",
    text: "GEO Pulse™ score improved +4 pts after content update",
    time: "18m ago",
    priority: "medium",
  },
  {
    color: "#F59E0B",
    category: "Competitor",
    text: "Competitor ranked #1 in ChatGPT for 'CRM for sales teams'",
    time: "1h ago",
    priority: "high",
  },
  {
    color: "#34D399",
    category: "Outreach",
    text: "Outreach campaign generated for Pipedrive — 90% personalization",
    time: "2h ago",
    priority: "low",
  },
  {
    color: "#F87171",
    category: "Intent",
    text: "Switching signal: 'moving away from HubSpot' on LinkedIn",
    time: "3h ago",
    priority: "high",
  },
  {
    color: "#22D3EE",
    category: "Citation",
    text: "CitationMind™ detected brand mention in Perplexity answer",
    time: "5h ago",
    priority: "medium",
  },
];

const actions = [
  {
    label: "Run GEO Scan",
    desc: "Analyze AI search visibility",
    href: "/dashboard/geo",
    color: "#7C6FF7",
    colorBg: "rgba(124,111,247,0.10)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    label: "Find Buyers",
    desc: "Detect real-time intent signals",
    href: "/dashboard/intent",
    color: "#22D3EE",
    colorBg: "rgba(34,211,238,0.10)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    label: "Generate Outreach",
    desc: "AI-written cold emails",
    href: "/dashboard/outreach",
    color: "#34D399",
    colorBg: "rgba(52,211,153,0.10)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
  },
  {
    label: "Compare Competitors",
    desc: "Side-by-side GEO scores",
    href: "/dashboard/competitors",
    color: "#F59E0B",
    colorBg: "rgba(245,158,11,0.10)",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

const systems = [
  { name: "GEO Pulse™", status: "Active", uptime: "99.9%" },
  { name: "CitationMind™", status: "Active", uptime: "99.7%" },
  { name: "SignalGraph AI™", status: "Active", uptime: "100%" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCounter(target: number, duration = 1400, delay = 0) {
  const [val, setVal] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setVal(0);
    startRef.current = null;

    const timeout = setTimeout(() => {
      const tick = (ts: number) => {
        if (!startRef.current) startRef.current = ts;
        const p = Math.min((ts - startRef.current) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(e * target));
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return val;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SparkRing({
  value,
  color,
  trackColor,
  size = 56,
}: {
  value: number;
  color: string;
  trackColor: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const t = setTimeout(() => {
      setOffset(circ - (value / 100) * circ);
    }, 300);
    return () => clearTimeout(t);
  }, [value, circ]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth="5"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          filter: `drop-shadow(0 0 4px ${color}80)`,
        }}
      />
    </svg>
  );
}

function MetricCard({
  m,
  index,
  visible,
}: {
  m: (typeof metrics)[0];
  index: number;
  visible: boolean;
}) {
  const router = useRouter();
  const count = useCounter(m.value, 1300, index * 120);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => router.push(m.href)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        borderColor: hovered ? m.colorBorder : "rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? `0 0 0 1px ${m.colorBorder}, 0 8px 32px ${m.colorLight}, inset 0 1px 0 rgba(255,255,255,0.05)`
          : "inset 0 1px 0 rgba(255,255,255,0.04)",
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, ${m.colorLight} 100%)`
          : "rgba(255,255,255,0.03)",
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "20px",
        textAlign: "left",
        cursor: "pointer",
        transition: `opacity 0.55s ease ${index * 80}ms, transform 0.55s cubic-bezier(0.34,1.56,0.64,1) ${index * 80}ms, border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease`,
        width: "100%",
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "4px 9px 4px 7px",
            borderRadius: "999px",
            background: m.colorLight,
            border: `1px solid ${m.colorBorder}`,
            color: m.color,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex" }}>{m.icon}</span>
          {m.label}
        </div>
        <SparkRing value={m.value} color={m.color} trackColor={m.trackColor} size={48} />
      </div>

      {/* Value */}
      <div style={{ marginBottom: "4px", display: "flex", alignItems: "baseline", gap: "3px" }}>
        <span
          style={{
            fontSize: "38px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#F1F0FF",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {count}
        </span>
        {m.unit && (
          <span style={{ fontSize: "18px", fontWeight: 500, color: "rgba(241,240,255,0.45)" }}>
            {m.unit}
          </span>
        )}
      </div>

      {/* Desc */}
      <p style={{ fontSize: "12px", color: "rgba(241,240,255,0.4)", marginBottom: "14px", lineHeight: 1.4 }}>
        {m.desc}
      </p>

      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "3px 8px",
          borderRadius: "6px",
          background: m.up ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.12)",
          color: m.up ? "#34D399" : "#F87171",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.02em",
        }}
      >
        <span style={{ fontSize: "10px" }}>{m.up ? "▲" : "▼"}</span>
        {m.change}
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* ── Global ambient background ── */}
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
            top: "-200px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,111,247,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "800px",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, rgba(124,111,247,0.08) 50%, transparent 100%)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "0 0 32px",
        }}
      >
        {/* ── Header ── */}
        <header
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "rgba(241,240,255,0.35)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              {greeting}
            </p>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 600,
                color: "rgba(241,240,255,0.95)",
                letterSpacing: "-0.01em",
              }}
            >
              Welcome back,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #A5A0FA 0%, #67E8F9 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textTransform: "capitalize",
                }}
              >
                {name}
              </span>
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Active status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.20)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#34D399",
                  boxShadow: "0 0 0 3px rgba(52,211,153,0.25)",
                  animation: "sfPulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#34D399",
                  letterSpacing: "0.04em",
                }}
              >
                SignalForge Active
              </span>
            </div>

            {/* Today's date */}
            <div
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "11px",
                color: "rgba(241,240,255,0.4)",
                fontWeight: 500,
                letterSpacing: "0.03em",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* ── Metric Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "12px",
          }}
        >
          {metrics.map((m, i) => (
            <MetricCard key={m.label} m={m} index={i} visible={mounted} />
          ))}
        </div>

        {/* ── Bottom Grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "12px",
            alignItems: "start",
          }}
        >
          {/* Signal Feed */}
          <div
            style={{
              borderRadius: "16px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              padding: "20px",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s ease 360ms, transform 0.5s ease 360ms",
            }}
          >
            {/* Feed header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(241,240,255,0.9)",
                    marginBottom: "2px",
                  }}
                >
                  Signal Feed
                </h2>
                <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.35)" }}>
                  Real-time intelligence updates
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "rgba(124,111,247,0.10)",
                  border: "1px solid rgba(124,111,247,0.25)",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#7C6FF7",
                    animation: "sfPulse 1.5s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#A5A0FA",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  Live
                </span>
              </div>
            </div>

            {/* Feed items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {feed.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 10px",
                    borderRadius: "10px",
                    cursor: "default",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateX(0)" : "translateX(-12px)",
                    transition: `opacity 0.4s ease ${460 + i * 55}ms, transform 0.4s ease ${460 + i * 55}ms, background 0.15s`,
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.background = "transparent")
                  }
                >
                  {/* Priority dot */}
                  <div style={{ paddingTop: "4px", flexShrink: 0 }}>
                    <span
                      style={{
                        display: "block",
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: item.color,
                        boxShadow: `0 0 6px ${item.color}80`,
                      }}
                    />
                  </div>

                  {/* Category tag + text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" }}>
                      <span
                        style={{
                          fontSize: "9px",
                          fontWeight: 700,
                          letterSpacing: "0.07em",
                          textTransform: "uppercase",
                          color: item.color,
                          padding: "1px 5px",
                          borderRadius: "4px",
                          background: `${item.color}18`,
                          border: `1px solid ${item.color}30`,
                        }}
                      >
                        {item.category}
                      </span>
                      {item.priority === "high" && (
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "#F87171",
                            padding: "1px 5px",
                            borderRadius: "4px",
                            background: "rgba(248,113,113,0.10)",
                          }}
                        >
                          High
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "rgba(241,240,255,0.7)",
                        lineHeight: 1.5,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "rgba(241,240,255,0.25)",
                      flexShrink: 0,
                      paddingTop: "14px",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Quick Actions */}
            <div
              style={{
                borderRadius: "16px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(12px)",
                padding: "20px",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.5s ease 440ms, transform 0.5s ease 440ms",
              }}
            >
              <div style={{ marginBottom: "14px" }}>
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "rgba(241,240,255,0.9)",
                    marginBottom: "2px",
                  }}
                >
                  Quick Actions
                </h2>
                <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.35)" }}>
                  Launch intelligence workflows
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {actions.map((a, i) => (
                  <button
                    key={a.label}
                    onClick={() => router.push(a.href)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "11px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all 0.2s ease",
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? "translateX(0)" : "translateX(10px)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = `${a.colorBg}`;
                      el.style.borderColor = `${a.color}35`;
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.background = "rgba(255,255,255,0.03)";
                      el.style.borderColor = "rgba(255,255,255,0.07)";
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        background: a.colorBg,
                        border: `1px solid ${a.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: a.color,
                        flexShrink: 0,
                      }}
                    >
                      {a.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 500,
                          color: "rgba(241,240,255,0.85)",
                          marginBottom: "1px",
                        }}
                      >
                        {a.label}
                      </p>
                      <p style={{ fontSize: "11px", color: "rgba(241,240,255,0.35)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {a.desc}
                      </p>
                    </div>
                    <span style={{ color: "rgba(241,240,255,0.25)", fontSize: "14px", flexShrink: 0 }}>
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ForgeIntel™ System Status */}
            <div
              style={{
                borderRadius: "16px",
                background: "rgba(124,111,247,0.04)",
                border: "1px solid rgba(124,111,247,0.15)",
                backdropFilter: "blur(12px)",
                padding: "16px 20px",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "opacity 0.5s ease 520ms, transform 0.5s ease 520ms",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#A5A0FA",
                      animation: "sfPulse 2s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#A5A0FA",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    ForgeIntel™ Status
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#34D399",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  All Systems Go
                </span>
              </div>

              {/* Systems */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {systems.map((sys, i) => (
                  <div
                    key={sys.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "#34D399",
                          boxShadow: "0 0 5px rgba(52,211,153,0.6)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          color: "rgba(241,240,255,0.55)",
                        }}
                      >
                        {sys.name}
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "rgba(241,240,255,0.3)",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {sys.uptime}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 600,
                          color: "#34D399",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          background: "rgba(52,211,153,0.10)",
                          letterSpacing: "0.03em",
                        }}
                      >
                        Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Uptime bar */}
              <div style={{ marginTop: "12px" }}>
                <div
                  style={{
                    height: "3px",
                    borderRadius: "999px",
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: "99.9%",
                      background: "linear-gradient(90deg, #7C6FF7 0%, #34D399 100%)",
                      borderRadius: "999px",
                      transition: "width 1.5s ease 600ms",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "rgba(241,240,255,0.25)" }}>
                    Overall uptime
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 600,
                      color: "#34D399",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    99.9%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes sfPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}