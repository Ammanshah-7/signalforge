import Link from "next/link";
import { Star } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { PricingSection } from "@/components/marketing/pricing-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DashboardMockup() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-4xl" id="demo">
      {/* Glow behind mockup */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-30" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.4) 0%, rgba(139,92,246,0.2) 50%, transparent 70%)" }} />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_32px_100px_-20px_rgba(0,0,0,0.8)]" style={{ background: "rgba(7,10,25,0.95)", backdropFilter: "blur(20px)" }}>
        {/* Browser bar */}
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3" style={{ background: "rgba(5,8,22,0.8)" }}>
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-red-500/70" />
            <span className="size-2.5 rounded-full bg-amber-500/70" />
            <span className="size-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <div className="ml-3 flex-1 rounded-md px-3 py-1 text-[11px] font-mono text-zinc-600" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            app.signalforge.ai · Live intent
          </div>
          <span className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold text-emerald-400" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
            </span>
            Scanning
          </span>
        </div>

        <div className="grid md:grid-cols-[180px_1fr]">
          {/* Sidebar */}
          <div className="hidden border-r border-white/[0.06] p-4 md:block" style={{ background: "rgba(5,8,22,0.6)" }}>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg text-xs" style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>⚡</div>
              <span className="text-[11px] font-bold text-white">SignalForge</span>
            </div>
            <div className="space-y-1 text-[11px]">
              {[
                { icon: "◈", label: "Overview", active: false },
                { icon: "◎", label: "Buyer Intent", active: true },
                { icon: "⌖", label: "GEO Analyzer", active: false },
                { icon: "➤", label: "Outreach", active: false },
                { icon: "⚔", label: "Competitors", active: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: item.active ? "rgba(6,182,212,0.1)" : "transparent", border: item.active ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent", color: item.active ? "#22d3ee" : "#475569" }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="p-5">
            {/* Top metrics */}
            <div className="grid gap-3 sm:grid-cols-3 mb-4">
              {[
                { label: "Hot Leads (24h)", value: "12", change: "+4 today", color: "#22d3ee", bars: [40,65,45,80,55,90,70] },
                { label: "GEO Pulse™", value: "74", change: "At risk vs 81", color: "#f59e0b", bars: [60,55,65,70,68,72,74] },
                { label: "Signals Found", value: "28", change: "+5 this hour", color: "#a78bfa", bars: [10,15,12,18,14,22,28] },
              ].map((m) => (
                <div key={m.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-2">{m.label}</p>
                  <p className="text-2xl font-bold tabular-nums text-white mb-1">{m.value}</p>
                  <p className="text-[11px] mb-3" style={{ color: m.color }}>{m.change}</p>
                  <div className="flex h-8 items-end gap-0.5">
                    {m.bars.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: `linear-gradient(to top, ${m.color}40, ${m.color}90)`, animation: `sfPulseBar 2.2s ease-in-out ${i * 0.1}s infinite` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Signal feed */}
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-zinc-300">Live Signal Feed</p>
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">ForgeIntel™ Active</span>
              </div>
              <div className="space-y-2">
                {[
                  { dot: "#f87171", source: "r/B2BSaaS", text: '"need a tool for intent data, budget ~$5k/mo"', badge: "High Intent" },
                  { dot: "#22d3ee", source: "LinkedIn", text: "VP Eng asking for GEO / LLM visibility vendors", badge: "Evaluating" },
                  { dot: "#a78bfa", source: "AI Search", text: "Brand mentioned in ChatGPT answer #3", badge: "Citation" },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="relative flex size-1.5 mt-1.5 flex-shrink-0">
                      <span className="absolute inline-flex size-full animate-ping rounded-full opacity-40" style={{ backgroundColor: s.dot }} />
                      <span className="relative inline-flex size-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                    </span>
                    <span className="flex-1 text-[11px] text-zinc-400">
                      <span className="font-medium text-zinc-200">{s.source}</span> — {s.text}
                    </span>
                    <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${s.dot}15`, color: s.dot, border: `1px solid ${s.dot}25` }}>{s.badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  { quote: "Found 3 hot leads in the first scan. Closed one within a week — our SDR team actually uses this daily.", name: "Alex R.", role: "Founder, DevTools startup" },
  { quote: "GEO score alone paid for Growth. We saw exactly where competitors won in AI answers and fixed it in two sprints.", name: "Jordan M.", role: "Head of Growth, Series B SaaS" },
  { quote: "The outreach drafts don't sound like mail merge. Reply rate on cold outbound went from ~2% to just under 7%.", name: "Samira K.", role: "SDR Manager, B2B agency" },
];

const faqItems = [
  { q: "How is this different from Apollo or Clay?", a: "Apollo and Clay are amazing for contact data and workflows. SignalForge focuses on intent and visibility: who is actively looking for your category right now, how you show up in AI-powered search, and turning those signals into human-sounding outreach — without building a 40-step Clay table." },
  { q: "What data sources do you use?", a: "We monitor public discussions and professional signals across Reddit, LinkedIn, and major AI search surfaces (where available), plus your own product context from your URL and ICP. We don't sell raw contact dumps — we surface timely buying context." },
  { q: "Is there a free trial?", a: "Yes. You can start free with no credit card to explore the product and run initial scans. Upgrade when you're ready for higher volume and priority support." },
  { q: "How accurate is the buyer intent scoring?", a: "Scores combine recency, discussion depth, role fit, and ICP match. No model is perfect — we show you the underlying quotes and threads so your team can qualify fast instead of guessing from job titles alone." },
  { q: "Does this work for non-SaaS businesses?", a: "If your buyers ask questions online — software or not — intent signals still matter. We tune scans using your URL and ICP, so services, agencies, and vertical B2B teams use SignalForge the same way." },
  { q: "What happens after my free trial ends?", a: "You'll keep access to your workspace but scans and premium features pause until you pick a plan. Nothing charges automatically without you connecting billing." },
];

const features = [
  { icon: "◎", title: "Buyer Intent Engine", tagline: "Stop guessing. Start knowing.", body: "Monitors 50M+ daily discussions to find companies actively searching for what you sell — scored, ranked, and ready to act on.", color: "#22d3ee", glow: "rgba(34,211,238,0.1)" },
  { icon: "⌖", title: "GEO Pulse™ Score", tagline: "Are you in ChatGPT answers?", body: "See exactly how visible you are in AI-powered search engines. Get a specific roadmap to outrank competitors in Perplexity, ChatGPT, and Claude.", color: "#a78bfa", glow: "rgba(167,139,250,0.1)" },
  { icon: "➤", title: "AI Outreach Engine", tagline: "Emails that get replies.", body: "Every intent signal becomes a personalized cold email sequence. No templates. No mail merge feel. Just conversion-engineered copy.", color: "#34d399", glow: "rgba(52,211,153,0.1)" },
  { icon: "⚔", title: "Competitor Intelligence", tagline: "Know every gap they leave open.", body: "Side-by-side GEO comparison across competitors. See where they win, where they lose, and exactly how to take their ranking.", color: "#f59e0b", glow: "rgba(245,158,11,0.1)" },
  { icon: "▦", title: "Signal Reports", tagline: "Weekly intelligence, automated.", body: "Auto-generated reports showing leads found, revenue opportunity, GEO improvement, and competitor movement — no manual effort.", color: "#f87171", glow: "rgba(248,113,113,0.1)" },
  { icon: "◈", title: "ForgeIntel™ Dashboard", tagline: "Mission control for revenue.", body: "A single command center showing your best signals, highest-intent leads, and action queue — so you always know what to do next.", color: "#7c6ff7", glow: "rgba(124,111,247,0.1)" },
];

export default function MarketingHomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <style>{`
        @keyframes sfPulseBar { 0%,100%{opacity:0.7;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.08)} }
        @keyframes sfFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .sf-float { animation: sfFloat 6s ease-in-out infinite; }
      `}</style>

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(6,182,212,0.12) 0%, transparent 60%), radial-gradient(ellipse 80% 50% at 100% 50%, rgba(139,92,246,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 0% 80%, rgba(52,211,153,0.05) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "48px 48px", maskImage: "radial-gradient(ellipse at 50% 0%, black 20%, transparent 70%)" }} />
      </div>

      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="container pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)", color: "#22d3ee" }}>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-cyan-400" />
              </span>
              ForgeIntel™ — AI Search Intelligence Platform
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.4rem] lg:leading-[1.08]" style={{ letterSpacing: "-0.02em" }}>
              Find companies ready to buy{" "}
              <span style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                before your competitors do.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-zinc-400 md:text-xl leading-relaxed">
              SignalForge monitors Reddit, LinkedIn, and AI search engines 24/7 to surface warm leads
              and generate personalized outreach automatically.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/signup"
                className={cn(buttonVariants({ variant: "default", size: "default" }), "min-h-[48px] min-w-[220px] px-8 text-base shadow-lg marketing-cta-glow")}
                style={{ boxShadow: "0 0 32px rgba(6,182,212,0.3), 0 1px 0 rgba(255,255,255,0.1) inset" }}
              >
                Start Free — No Card Needed
              </Link>
              <Link
                href="#demo"
                className={cn(buttonVariants({ variant: "outline", size: "default" }), "min-h-[48px] min-w-[180px] border-white/15 bg-transparent px-8 text-base hover:bg-white/5")}
              >
                See Live Demo →
              </Link>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-6">
              <p className="text-sm text-zinc-500">Join 200+ B2B teams already using SignalForge</p>
              <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
                <span className="ml-2 text-sm font-semibold text-zinc-300">5.0</span>
              </div>
            </div>
          </div>

          <DashboardMockup />
        </section>

        {/* Social proof */}
        <section className="border-y border-white/[0.06] py-10" style={{ background: "rgba(5,8,22,0.8)" }}>
          <div className="container">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Trusted by teams at</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-zinc-700">
              {["Northbeam Labs", "Circuit AI", "Helix Data", "Maritime SaaS Co.", "Pixelcraft", "Atlas GTM"].map((name) => (
                <span key={name} className="hover:text-zinc-500 transition-colors">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Problem → Solution */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
              Stop chasing cold lists. Start with{" "}
              <span style={{ background: "linear-gradient(135deg, #22d3ee, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>real intent.</span>
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl p-8" style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}>
                <h3 className="text-lg font-bold text-red-400 mb-6">The old way</h3>
                <ul className="space-y-4 text-zinc-400">
                  {[
                    "Spray-and-pray outbound from stale lists that never asked for you.",
                    "No idea who is in-market until your competitor shows up in the thread.",
                    "Generic templates that train prospects to ignore your domain.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">✗</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl p-8" style={{ background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.2)", boxShadow: "0 0 60px -20px rgba(34,211,238,0.15)" }}>
                <h3 className="text-lg font-bold text-cyan-400 mb-6">With SignalForge</h3>
                <ul className="space-y-4 text-zinc-300">
                  {[
                    "Real-time intent from discussions where buyers name pain and budget.",
                    "GEO visibility so you see how AI search positions you vs rivals.",
                    "One-click outreach that reads like a thoughtful human wrote it.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm leading-relaxed">
                      <span className="text-emerald-400 flex-shrink-0 mt-0.5">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 py-24 md:py-32" style={{ background: "rgba(5,8,22,0.6)" }}>
          <div className="container">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-500 mb-3">Platform Capabilities</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.02em" }}>
                Everything you need to turn noise into pipeline
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <article key={f.title} className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02]" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = f.glow; (e.currentTarget as HTMLElement).style.borderColor = `${f.color}30`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25`, color: f.color }}>{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: f.color }}>&ldquo;{f.tagline}&rdquo;</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-400 mb-3">How It Works</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.02em" }}>Three steps to your next customer</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { step: "01", title: "Connect your product", body: "Paste your URL and ICP — SignalForge learns what you sell and who cares about it.", color: "#22d3ee" },
                { step: "02", title: "We find warm buyers", body: "Real-time intent scanning across Reddit, LinkedIn, and AI search surfaces. Scored and ranked automatically.", color: "#a78bfa" },
                { step: "03", title: "Send outreach in one click", body: "AI-written sequences personalized to each signal. You approve, we deliver.", color: "#34d399" },
              ].map((s, i) => (
                <div key={s.step} className="relative rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  {i < 2 && <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 text-zinc-800 md:block">→</div>}
                  <div className="mb-4 text-3xl font-black" style={{ color: `${s.color}40`, fontVariantNumeric: "tabular-nums" }}>{s.step}</div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{s.body}</p>
                  <div className="mt-4 h-0.5 w-10 rounded-full" style={{ background: s.color }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        {/* Testimonials */}
        <section className="border-t border-white/[0.06] py-24 md:py-32">
          <div className="container">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-400 mb-3">Social Proof</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.02em" }}>Loved by lean GTM teams</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote key={t.name} className="flex flex-col rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="flex-1 text-sm text-zinc-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-6 pt-4 border-t border-white/[0.06]">
                    <cite className="not-italic text-sm font-semibold text-white">{t.name}</cite>
                    <p className="text-xs text-zinc-500 mt-0.5">{t.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] py-24 md:py-32" style={{ background: "rgba(5,8,22,0.6)" }}>
          <div className="container max-w-3xl">
            <div className="text-center mb-14">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500 mb-3">FAQ</p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={{ letterSpacing: "-0.02em" }}>Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {faqItems.map((item) => (
                <details key={item.q} className="group rounded-2xl px-5 py-1" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <summary className="cursor-pointer list-none py-4 font-medium outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4 text-zinc-200">
                      {item.q}
                      <span className="text-cyan-400 transition-transform group-open:rotate-45 flex-shrink-0">+</span>
                    </span>
                  </summary>
                  <p className="border-t border-white/[0.06] pb-4 pt-3 text-sm leading-relaxed text-zinc-400">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container py-24 md:py-32">
          <div className="mx-auto max-w-3xl rounded-[2rem] p-12 text-center md:p-16" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.08) 0%, rgba(167,139,250,0.08) 100%)", border: "1px solid rgba(34,211,238,0.2)", boxShadow: "0 0 80px -30px rgba(34,211,238,0.3)" }}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400 mb-4">Start Today</p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4" style={{ letterSpacing: "-0.02em" }}>
              Ready to find your next customer?
            </h2>
            <p className="text-zinc-400 mb-10 text-lg">No credit card. No sales call. Just sign up and run your first scan in 60 seconds.</p>
            <Link href="/signup" className={cn(buttonVariants({ variant: "default", size: "default" }), "min-h-[52px] px-12 text-base marketing-cta-glow")} style={{ boxShadow: "0 0 32px rgba(6,182,212,0.35), 0 1px 0 rgba(255,255,255,0.1) inset", fontSize: "16px" }}>
              Start Free — No Card Needed
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-14" style={{ background: "rgba(5,8,22,0.8)" }}>
        <div className="container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg text-sm" style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}>⚡</div>
              <p className="text-base font-bold text-white">SignalForge</p>
            </div>
            <p className="max-w-xs text-sm text-zinc-500 leading-relaxed">Buyer intent, GEO visibility, and outreach — in one flow built for B2B teams.</p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-500" aria-label="Footer">
            {[["#features", "Features"], ["#pricing", "Pricing"], ["/blog", "Blog"], ["/privacy", "Privacy"], ["/terms", "Terms"]].map(([href, label]) => (
              <Link key={label} href={href} className="hover:text-zinc-200 transition-colors">{label}</Link>
            ))}
          </nav>
        </div>
        <div className="container mt-10 border-t border-white/[0.06] pt-8 text-center text-sm text-zinc-600">
          Made with ❤️ for B2B founders · © {new Date().getFullYear()} SignalForge
        </div>
      </footer>
    </div>
  );
}