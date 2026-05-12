"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "◈", desc: "Command center" },
  { label: "GEO Analyzer", href: "/dashboard/geo", icon: "⌖", desc: "AI visibility" },
  { label: "Buyer Intent", href: "/dashboard/intent", icon: "◎", desc: "Live signals" },
  { label: "Outreach", href: "/dashboard/outreach", icon: "➤", desc: "AI sequences" },
  { label: "Competitors", href: "/dashboard/competitors", icon: "⚔", desc: "Battle map" },
  { label: "Reports", href: "/dashboard/reports", icon: "▦", desc: "Intelligence" },
];

const bottomItems = [
  { label: "Billing", href: "/dashboard/billing", icon: "◇" },
  { label: "Settings", href: "/dashboard/settings", icon: "◌" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .sidebar-font { font-family: 'DM Sans', sans-serif; }
        .sidebar-heading { font-family: 'Syne', sans-serif; }
        .sidebar-root {
          width: 240px;
          min-height: 100vh;
          background: rgba(5,8,22,0.95);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          backdrop-filter: blur(20px);
          position: relative;
        }
        .sidebar-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6,182,212,0.03) 0%, transparent 40%);
          pointer-events: none;
        }
        .logo-mark {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #06b6d4, #3b82f6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          box-shadow: 0 0 20px rgba(6,182,212,0.25);
          flex-shrink: 0;
        }
        .nav-link {
          display: flex; align-items: center; gap: 11px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1px solid transparent;
          text-decoration: none;
          transition: all 0.18s;
          position: relative;
          overflow: hidden;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.07);
        }
        .nav-link.active {
          background: rgba(6,182,212,0.1);
          border-color: rgba(6,182,212,0.2);
        }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 2px;
          background: linear-gradient(180deg, #06b6d4, #3b82f6);
          border-radius: 2px;
        }
        .nav-icon {
          width: 28px; height: 28px;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
          transition: all 0.18s;
        }
        .nav-link .nav-icon { background: rgba(255,255,255,0.04); color: #475569; }
        .nav-link:hover .nav-icon { background: rgba(255,255,255,0.07); color: #94a3b8; }
        .nav-link.active .nav-icon { background: rgba(6,182,212,0.15); color: #22d3ee; }
        .nav-label { font-size: 13.5px; font-weight: 500; }
        .nav-link .nav-label { color: #475569; }
        .nav-link:hover .nav-label { color: #94a3b8; }
        .nav-link.active .nav-label { color: #e2e8f0; }
        .nav-desc { font-size: 10px; color: #1e293b; }
        .nav-link:hover .nav-desc { color: #334155; }
        .nav-link.active .nav-desc { color: #22d3ee; opacity: 0.6; }
        .pulse-indicator {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22d3ee;
          animation: sidebarPulse 2.5s infinite;
          margin-left: auto;
          flex-shrink: 0;
        }
        @keyframes sidebarPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        .divider { height: 1px; background: rgba(255,255,255,0.05); margin: 10px 4px; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px rgba(16,185,129,0.6); }
        .bottom-link {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 10px; text-decoration: none;
          transition: all 0.18s; font-size: 13px; color: #334155;
          border: 1px solid transparent;
        }
        .bottom-link:hover { background: rgba(255,255,255,0.04); color: #64748b; border-color: rgba(255,255,255,0.06); }
        .bottom-link.active { color: #64748b; background: rgba(255,255,255,0.03); }
        .hidden-mobile { display: none; }
        @media(min-width:1024px) { .hidden-mobile { display: flex; } }
      `}</style>

      <aside className="sidebar-root sidebar-font hidden-mobile flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-7 px-1">
          <div className="logo-mark">⚡</div>
          <div>
            <div className="sidebar-heading text-sm font-bold text-white tracking-tight leading-tight">SignalForge</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="status-dot" />
              <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 600 }}>Systems Online</span>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div style={{ fontSize: "10px", color: "#1e293b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, padding: "0 12px", marginBottom: "6px" }}>
          Intelligence
        </div>

        {/* Main Nav */}
        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map(({ label, href, icon, desc }) => {
            const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-link ${isActive ? "active" : ""}`}>
                <div className="nav-icon">{icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="nav-label">{label}</div>
                  <div className="nav-desc">{desc}</div>
                </div>
                {label === "Buyer Intent" && <div className="pulse-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="divider" />

        {/* Bottom Nav */}
        <div className="flex flex-col gap-0.5">
          {bottomItems.map(({ label, href, icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`bottom-link ${isActive ? "active" : ""}`}>
                <span style={{ fontSize: "14px", opacity: 0.6 }}>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Brand */}
        <div className="mt-4 px-1">
          <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10px", color: "#22d3ee", opacity: 0.7, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>AI Engine</div>
            <div style={{ fontSize: "11px", color: "#334155" }}>Running 24/7 · All signals live</div>
          </div>
        </div>
      </aside>
    </>
  );
}