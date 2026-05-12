"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type SettingsRow = {
  user_id: string;
  display_name?: string;
  product_name?: string;
  product_description?: string;
  icp?: string;
  website_url?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [icp, setIcp] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase.from("settings").select("*").eq("user_id", user.id).single();
      const s = data as SettingsRow | null;
      if (s) {
        setDisplayName(s.display_name ?? "");
        setProductName(s.product_name ?? "");
        setProductDescription(s.product_description ?? "");
        setIcp(s.icp ?? "");
        setWebsiteUrl(s.website_url ?? "");
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await (supabase.from("settings") as any).upsert({ user_id: user.id, display_name: displayName, product_name: productName, product_description: productDescription, icp, website_url: websiteUrl });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const navItems = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "product", label: "Product", icon: "⚡" },
    { id: "billing", label: "Billing", icon: "💳" },
    { id: "danger", label: "Account", icon: "🔐" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #050816 0%, #07111f 50%, #0b1020 100%)" }}>
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-cyan-400/50" style={{ animation: `bounce 1.4s ${i*0.16}s infinite` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050816 0%, #07111f 50%, #0b1020 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .page-font { font-family: 'DM Sans', sans-serif; }
        .heading-font { font-family: 'Syne', sans-serif; }
        .glass { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
        .glass-dark { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.06); }
        .grid-bg { background-image: linear-gradient(rgba(6,182,212,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.025) 1px, transparent 1px); background-size: 48px 48px; }
        .input-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; color: #e2e8f0; font-size: 14px; width: 100%; outline: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .input-field::placeholder { color: rgba(148,163,184,0.4); }
        .input-field:focus { border-color: rgba(6,182,212,0.45); background: rgba(6,182,212,0.04); box-shadow: 0 0 0 3px rgba(6,182,212,0.07); }
        .textarea-field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; color: #e2e8f0; font-size: 14px; width: 100%; outline: none; transition: all 0.2s; min-height: 88px; resize: none; font-family: 'DM Sans', sans-serif; }
        .textarea-field:focus { border-color: rgba(6,182,212,0.45); background: rgba(6,182,212,0.04); }
        .btn-save { background: linear-gradient(135deg, #06b6d4, #3b82f6); border: none; border-radius: 12px; padding: 12px 24px; color: white; font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(6,182,212,0.25); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-ghost { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 11px 20px; color: #94a3b8; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.08); color: #e2e8f0; }
        .btn-danger { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.3); border-radius: 12px; padding: 11px 20px; color: #f87171; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-danger:hover { background: rgba(239,68,68,0.2); }
        .btn-danger-confirm { background: linear-gradient(135deg, #dc2626, #b91c1c); border: none; border-radius: 12px; padding: 11px 20px; color: white; cursor: pointer; font-size: 13px; font-weight: 600; font-family: 'DM Sans', sans-serif; }
        .nav-item { border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s; font-size: 14px; border: 1px solid transparent; }
        .nav-active { background: rgba(6,182,212,0.1); border-color: rgba(6,182,212,0.25); color: #22d3ee; }
        .nav-inactive { color: #64748b; }
        .nav-inactive:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeInUp 0.35s ease forwards; }
        .avatar-ring { background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6); padding: 2px; border-radius: 50%; }
        .plan-badge { background: linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2)); border: 1px solid rgba(139,92,246,0.3); border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 600; color: #a78bfa; }
      `}</style>

      <div className="page-font grid-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="mb-8 fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-xs">⚙</div>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Workspace Settings</span>
            </div>
            <h1 className="heading-font text-3xl font-bold text-white mb-1">Settings</h1>
            <p className="text-slate-400 text-sm">Manage your account, product context, and workspace preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

            {/* Sidebar Nav */}
            <div className="fade-in">
              <div className="glass rounded-2xl p-3 space-y-1 lg:sticky lg:top-6">
                {navItems.map(({ id, label, icon }) => (
                  <div key={id} className={`nav-item ${activeSection === id ? "nav-active" : "nav-inactive"}`} onClick={() => setActiveSection(id)}>
                    <span>{icon}</span>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-5 fade-in">

              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="glass rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="heading-font text-lg font-semibold text-white">Profile</h2>
                  </div>

                  <div className="flex items-center gap-5 py-4 border-y border-white/5">
                    <div className="avatar-ring">
                      <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-white">
                        {email.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-base">{displayName || email.split("@")[0]}</p>
                      <p className="text-sm text-slate-400">{email}</p>
                      <div className="plan-badge mt-1.5 inline-block">Pro Plan</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Display Name</label>
                    <input className="input-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Email Address</label>
                    <input className="input-field" value={email} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
                    <p className="text-xs text-slate-600 mt-1.5">Email address is managed by your auth provider.</p>
                  </div>

                  <button className="btn-save flex items-center gap-2" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>Saving...</>
                    ) : saved ? (
                      <><span>✓</span> Saved</>
                    ) : "Save Changes"}
                  </button>
                </div>
              )}

              {/* Product Section */}
              {activeSection === "product" && (
                <div className="glass rounded-2xl p-6 space-y-5">
                  <div>
                    <h2 className="heading-font text-lg font-semibold text-white mb-1">Product Context</h2>
                    <p className="text-sm text-slate-500">This context personalizes your GEO analysis, outreach generation, and AI insights.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Product Name</label>
                      <input className="input-field" value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="e.g. SignalForge" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Website URL</label>
                      <input className="input-field" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://yoursite.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Product Description</label>
                    <textarea className="textarea-field" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="One-line description of what your product does and for whom." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wide mb-2 block">Ideal Customer Profile (ICP)</label>
                    <textarea className="textarea-field" value={icp} onChange={(e) => setIcp(e.target.value)} placeholder="e.g. B2B SaaS founders with 1-20 employees struggling with outbound lead generation." />
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="btn-save flex items-center gap-2" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : saved ? "✓ Saved" : "Save Context"}
                    </button>
                    {saved && <span className="text-emerald-400 text-sm">Changes saved successfully</span>}
                  </div>
                </div>
              )}

              {/* Billing Section */}
              {activeSection === "billing" && (
                <div className="space-y-4">
                  <div className="glass rounded-2xl p-6">
                    <h2 className="heading-font text-lg font-semibold text-white mb-4">Current Plan</h2>
                    <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))", border: "1px solid rgba(139,92,246,0.2)" }}>
                      <div>
                        <div className="heading-font text-base font-bold text-white">Pro Plan</div>
                        <div className="text-sm text-slate-400 mt-0.5">Unlimited GEO scans · 500 intent signals/mo · AI outreach</div>
                      </div>
                      <div className="text-right">
                        <div className="heading-font text-xl font-bold text-white">$49<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                        <div className="text-xs text-emerald-400 mt-0.5">Active</div>
                      </div>
                    </div>
                  </div>
                  <div className="glass rounded-2xl p-6">
                    <h2 className="heading-font text-base font-semibold text-white mb-4">Manage Subscription</h2>
                    <p className="text-sm text-slate-400 mb-4">Update payment method, view invoices, or cancel your subscription.</p>
                    <button className="btn-ghost" onClick={() => router.push("/dashboard/billing")}>Open Billing Portal →</button>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {activeSection === "danger" && (
                <div className="space-y-4">
                  <div className="glass rounded-2xl p-6">
                    <h2 className="heading-font text-base font-semibold text-white mb-4">Session</h2>
                    <p className="text-sm text-slate-400 mb-4">Sign out of your SignalForge account on this device.</p>
                    {signOutConfirm ? (
                      <div className="space-y-3">
                        <p className="text-sm text-red-400 font-medium">Are you sure you want to sign out?</p>
                        <div className="flex gap-3">
                          <button onClick={handleSignOut} className="btn-danger-confirm">Yes, sign me out</button>
                          <button className="btn-ghost" onClick={() => setSignOutConfirm(false)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button className="btn-danger" onClick={() => setSignOutConfirm(true)}>Sign Out</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}