"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: "◈", desc: "Command center" },
  { label: "GEO Analyzer", href: "/dashboard/geo", icon: "⌖", desc: "AI visibility" },
  { label: "Buyer Intent", href: "/dashboard/intent", icon: "◎", desc: "Live signals", live: true },
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
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <>
      <style>{`
        .sidebar-root {
          width: 240px;
          min-height: 100vh;
          background: rgba(5,8,22,0.97);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          padding: 20px 14px;
          backdrop-filter: blur(20px);
          position: relative;
          flex-shrink: 0;
        }
        .sidebar-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(6,182,212,0.03) 0%, transparent 40%);
          pointer-events: none;
        }
        .sidebar-root::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0; right: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(6,182,212,0.2) 30%, rgba(167,139,250,0.15) 70%, transparent);
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
        .nav-link:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.07); }
        .nav-link.active { background: rgba(6,182,212,0.08); border-color: rgba(6,182,212,0.18); box-shadow: 0 0 20px rgba(6,182,212,0.06); }
        .nav-link.active::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 2px;
          background: linear-gradient(180deg, #06b6d4, #3b82f6);
          border-radius: 2px;
          box-shadow: 0 0 6px rgba(6,182,212,0.6);
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
        .nav-link.active .nav-icon { background: rgba(6,182,212,0.15); color: #22d3ee; box-shadow: 0 0 10px rgba(6,182,212,0.2); }
        .nav-label { font-size: 13.5px; font-weight: 500; transition: color 0.18s; }
        .nav-link .nav-label { color: #475569; }
        .nav-link:hover .nav-label { color: #94a3b8; }
        .nav-link.active .nav-label { color: #e2e8f0; }
        .nav-desc { font-size: 10px; transition: color 0.18s; }
        .nav-link .nav-desc { color: #1e293b; }
        .nav-link:hover .nav-desc { color: #334155; }
        .nav-link.active .nav-desc { color: #22d3ee; opacity: 0.6; }
        .pulse-indicator { width: 6px; height: 6px; border-radius: 50%; background: #22d3ee; animation: sidebarPulse 2.5s infinite; margin-left: auto; flex-shrink: 0; }
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
        .logout-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 8px 12px; border-radius: 10px;
          background: transparent; border: 1px solid transparent;
          cursor: pointer; width: 100%; text-align: left;
          font-size: 13px; color: #334155;
          transition: all 0.18s;
        }
        .logout-btn:hover { background: rgba(248,113,113,0.06); color: #f87171; border-color: rgba(248,113,113,0.15); }
        .sidebar-show { display: none; }
        @media(min-width:1024px) { .sidebar-show { display: flex; } }
      `}</style>

      <aside className="sidebar-root sidebar-show flex-col">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px", padding: "0 4px" }}>
          <div className="logo-mark">⚡</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", letterSpacing: "-0.01em", lineHeight: 1 }}>SignalForge</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
              <div className="status-dot" />
              <span style={{ fontSize: "10px", color: "#10b981", fontWeight: 600 }}>Systems Online</span>
            </div>
          </div>
        </div>

        {/* Section label */}
        <div style={{ fontSize: "10px", color: "#1e293b", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, padding: "0 12px", marginBottom: "6px" }}>Intelligence</div>

        {/* Main nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
          {navItems.map(({ label, href, icon, desc, live }) => {
            const isActive = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`nav-link ${isActive ? "active" : ""}`}>
                <div className="nav-icon">{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nav-label">{label}</div>
                  <div className="nav-desc">{desc}</div>
                </div>
                {live && <div className="pulse-indicator" />}
              </Link>
            );
          })}
        </nav>

        <div className="divider" />

        {/* Bottom nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {bottomItems.map(({ label, href, icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`bottom-link ${isActive ? "active" : ""}`}>
                <span style={{ fontSize: "14px", opacity: 0.6 }}>{icon}</span>
                <span>{label}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="logout-btn">
            <span style={{ fontSize: "14px", opacity: 0.5 }}>⊗</span>
            <span>Sign Out</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "12px", padding: "0 4px" }}>
          <div style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.12)", borderRadius: "10px", padding: "10px 12px" }}>
            <div style={{ fontSize: "10px", color: "#22d3ee", opacity: 0.7, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "2px" }}>ForgeIntel™</div>
            <div style={{ fontSize: "11px", color: "#334155" }}>Running 24/7 · All signals live</div>
          </div>
        </div>
      </aside>
    </>
  );
}