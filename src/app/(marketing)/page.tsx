import Link from "next/link";
import { Star } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { PricingSection } from "@/components/marketing/pricing-section";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function DashboardMockup() {
  return (
    <div
      className="marketing-dashboard-float relative mx-auto mt-12 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/[0.08] bg-[hsl(224_32%_8%)] shadow-[0_24px_80px_-20px_rgba(0,0,0,.65)]"
      id="demo"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[hsl(223_35%_7%)] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-red-500/80" />
          <span className="size-2.5 rounded-full bg-amber-500/80" />
          <span className="size-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-zinc-500">app.signalforge.ai · Live intent</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          Scanning
        </span>
      </div>
      <div className="grid gap-0 md:grid-cols-[9rem_1fr]">
        <div className="hidden border-r border-white/[0.06] bg-[hsl(223_35%_7%)] p-3 md:block">
          <div className="space-y-2 text-[10px] text-zinc-500">
            <div className="rounded-md bg-white/5 px-2 py-2 text-primary">Intent</div>
            <div className="px-2 py-1">GEO</div>
            <div className="px-2 py-1">Outreach</div>
            <div className="px-2 py-1">Reports</div>
          </div>
        </div>
        <div className="p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-card/80 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Hot leads (24h)
              </p>
              <p className="mt-2 text-3xl font-semibold tabular-nums text-foreground">12</p>
              <p className="mt-1 text-xs text-emerald-400">+4 vs yesterday</p>
              <div className="mt-4 flex h-10 items-end gap-1" aria-hidden>
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/90"
                    style={{
                      height: `${h}%`,
                      animation: `sf-pulse-bar 2.2s ease-in-out ${i * 0.12}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-card/80 p-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                GEO visibility
              </p>
              <div className="mt-2 flex items-end justify-between gap-2">
                <p className="text-3xl font-semibold tabular-nums text-foreground">72</p>
                <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] text-amber-400">
                  At risk
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full w-[72%] rounded-full bg-gradient-to-r from-primary to-cyan-300 marketing-dashboard-shimmer"
                  style={{ minHeight: "100%" }}
                />
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">Competitor avg: 81</p>
            </div>
          </div>
          <div className="mt-3 rounded-xl border border-white/[0.06] bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-300">Latest signals</p>
              <span className="text-[10px] text-zinc-500">Live</span>
            </div>
            <ul className="mt-3 space-y-2.5 text-left text-[11px]">
              <li className="flex gap-2 rounded-lg bg-white/[0.03] px-2 py-2">
                <span className="shrink-0 text-primary">●</span>
                <span className="text-zinc-400">
                  <span className="font-medium text-zinc-200">r/B2BSaaS</span> — “need a tool for
                  intent data, budget ~$5k/mo”
                </span>
              </li>
              <li className="flex gap-2 rounded-lg bg-white/[0.03] px-2 py-2">
                <span className="shrink-0 text-cyan-400">●</span>
                <span className="text-zinc-400">
                  <span className="font-medium text-zinc-200">LinkedIn</span> — VP Eng asking for
                  GEO / LLM visibility vendors
                </span>
              </li>
              <li className="flex gap-2 rounded-lg bg-white/[0.03] px-2 py-2">
                <span className="shrink-0 text-violet-400">●</span>
                <span className="text-zinc-400">
                  <span className="font-medium text-zinc-200">AI search</span> — brand mentioned in
                  ChatGPT answer #3
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Found 3 hot leads in the first scan. Closed one within a week — our SDR team actually uses this daily.",
    name: "Alex R.",
    role: "Founder, DevTools startup",
  },
  {
    quote:
      "GEO score alone paid for Growth. We saw exactly where competitors won in AI answers and fixed it in two sprints.",
    name: "Jordan M.",
    role: "Head of Growth, Series B SaaS",
  },
  {
    quote:
      "The outreach drafts don’t sound like mail merge. Reply rate on cold outbound went from ~2% to just under 7%.",
    name: "Samira K.",
    role: "SDR Manager, B2B agency",
  },
];

const faqItems = [
  {
    q: "How is this different from Apollo or Clay?",
    a: "Apollo and Clay are amazing for contact data and workflows. SignalForge focuses on intent and visibility: who is actively looking for your category right now, how you show up in AI-powered search, and turning those signals into human-sounding outreach — without building a 40-step Clay table.",
  },
  {
    q: "What data sources do you use?",
    a: "We monitor public discussions and professional signals across Reddit, LinkedIn, and major AI search surfaces (where available), plus your own product context from your URL and ICP. We don’t sell raw contact dumps — we surface timely buying context.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. You can start free with no credit card to explore the product and run initial scans. Upgrade when you’re ready for higher volume and priority support.",
  },
  {
    q: "How accurate is the buyer intent scoring?",
    a: "Scores combine recency, discussion depth, role fit, and ICP match. No model is perfect — we show you the underlying quotes and threads so your team can qualify fast instead of guessing from job titles alone.",
  },
  {
    q: "Does this work for non-SaaS businesses?",
    a: "If your buyers ask questions online — software or not — intent signals still matter. We tune scans using your URL and ICP, so services, agencies, and vertical B2B teams use SignalForge the same way.",
  },
  {
    q: "What happens after my free trial ends?",
    a: "You’ll keep access to your workspace but scans and premium features pause until you pick a plan. Nothing charges automatically without you connecting billing.",
  },
];

export default function MarketingHomePage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(56,189,248,0.14),transparent),radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(139,92,246,0.08),transparent),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(34,197,94,0.06),transparent)]" />
      </div>

      <MarketingNav />

      <main>
        {/* Hero */}
        <section className="container pt-10 pb-16 md:pt-16 md:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Find companies ready to buy — before your competitors do.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-zinc-400 md:text-xl">
              SignalForge monitors Reddit, LinkedIn, and AI search engines 24/7 to surface warm leads
              and generate personalized outreach automatically.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ variant: "default", size: "default" }),
                  "min-h-[44px] min-w-[200px] px-8 text-base marketing-cta-glow shadow-lg shadow-primary/25",
                )}
              >
                Start Free — No Card Needed
              </Link>
              <Link
                href="#demo"
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "min-h-[44px] min-w-[200px] border-white/15 bg-transparent px-8 text-base hover:bg-white/5",
                )}
              >
                See a Live Demo
              </Link>
            </div>
            <div className="mt-10 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
              <p className="text-sm text-zinc-500">
                Join 200+ B2B teams already using SignalForge
              </p>
              <div className="flex items-center gap-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden
                  />
                ))}
                <span className="ml-2 text-sm font-medium text-zinc-400">5.0</span>
              </div>
            </div>
          </div>
          <DashboardMockup />
        </section>

        {/* Social proof */}
        <section className="border-y border-white/[0.06] bg-[hsl(223_35%_5%)] py-10">
          <div className="container">
            <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-500">
              Trusted by teams at:
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-semibold text-zinc-600">
              {["Northbeam Labs", "Circuit AI", "Helix Data", "Maritime SaaS Co.", "Pixelcraft", "Atlas GTM"].map(
                (name) => (
                  <span key={name}>{name}</span>
                ),
              )}
            </div>
            <div
              className="mt-8 flex justify-center gap-10 opacity-25 grayscale"
              aria-hidden
            >
              {/* Tiny static SVGs: native lazy decode keeps homepage JS small (not LCP). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/globe.svg" alt="" width={28} height={28} loading="lazy" decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/window.svg" alt="" width={28} height={28} loading="lazy" decoding="async" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/file.svg" alt="" width={28} height={28} loading="lazy" decoding="async" />
            </div>
          </div>
        </section>

        {/* Problem → Solution */}
        <section className="container py-20 md:py-28">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
              Stop chasing cold lists. Start with real intent.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 md:gap-8">
              <div className="rounded-3xl border border-red-500/20 bg-[hsl(224_32%_8%)] p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                <h3 className="text-lg font-semibold text-red-300/90">The old way</h3>
                <ul className="mt-6 space-y-4 text-zinc-400">
                  <li className="flex gap-3">
                    <span aria-hidden>❌</span>
                    Spray-and-pray outbound from stale lists that never asked for you.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden>❌</span>
                    No idea who is in-market until your competitor shows up in the thread.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden>❌</span>
                    Generic templates that train prospects to ignore your domain.
                  </li>
                </ul>
              </div>
              <div className="rounded-3xl border border-primary/35 bg-[hsl(224_32%_9%)] p-8 shadow-[0_0_60px_-20px_hsl(191_100%_58%_/_0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                <h3 className="text-lg font-semibold text-primary">With SignalForge</h3>
                <ul className="mt-6 space-y-4 text-zinc-300">
                  <li className="flex gap-3">
                    <span aria-hidden>✅</span>
                    Real-time intent from discussions where buyers name pain and budget.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden>✅</span>
                    GEO visibility so you see how AI search positions you vs rivals.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden>✅</span>
                    One-click outreach that reads like a thoughtful human wrote it.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-24 py-20 md:py-28">
          <div className="container">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you need to turn noise into pipeline
            </h2>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              <article className="flex flex-col rounded-3xl border border-white/[0.08] bg-card/40 p-8 backdrop-blur-sm lg:min-h-[320px]">
                <h3 className="text-xl font-semibold">Buyer Intent Engine</h3>
                <p className="mt-2 text-lg font-medium text-primary">&quot;Stop guessing. Start knowing.&quot;</p>
                <p className="mt-4 flex-1 text-zinc-400">
                  Monitors 50M+ daily discussions to find companies actively searching for what you sell.
                </p>
              </article>
              <article className="flex flex-col rounded-3xl border border-white/[0.08] bg-card/40 p-8 backdrop-blur-sm lg:min-h-[320px]">
                <h3 className="text-xl font-semibold">GEO Visibility Score</h3>
                <p className="mt-2 text-lg font-medium text-primary">
                  &quot;Your competitors are in ChatGPT answers. Are you?&quot;
                </p>
                <p className="mt-4 flex-1 text-zinc-400">
                  See exactly how visible you are in AI-powered search and get a roadmap to dominate it.
                </p>
              </article>
              <article className="flex flex-col rounded-3xl border border-white/[0.08] bg-card/40 p-8 backdrop-blur-sm lg:min-h-[320px]">
                <h3 className="text-xl font-semibold">AI Outreach Generator</h3>
                <p className="mt-2 text-lg font-medium text-primary">
                  &quot;Emails that get replies, not unsubscribes.&quot;
                </p>
                <p className="mt-4 flex-1 text-zinc-400">
                  Turns every intent signal into a personalized cold email that sounds human — because
                  the AI was trained to.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-t border-white/[0.06] bg-[hsl(223_35%_5%)] py-20 md:py-28"
        >
          <div className="container">
            <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
              How it works
            </h2>
            <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Connect your product",
                  body: "Paste your URL and ICP — we learn what you sell and who cares.",
                },
                {
                  step: "2",
                  title: "SignalForge finds buyers",
                  body: "Real-time intent scanning across Reddit, LinkedIn, and AI search surfaces.",
                },
                {
                  step: "3",
                  title: "Send outreach in one click",
                  body: "AI-written drafts you approve — personalized to each signal.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="relative rounded-2xl border border-white/[0.08] bg-card/50 p-6 text-center md:text-left"
                >
                  <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
                    {s.step}
                  </span>
                  <h3 className="mt-4 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        {/* Testimonials */}
        <section className="border-t border-white/[0.06] py-20 md:py-28">
          <div className="container">
            <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
              Loved by lean GTM teams
            </h2>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <blockquote
                  key={t.name}
                  className="flex flex-col rounded-3xl border border-white/[0.08] bg-card/40 p-8"
                >
                  <p className="flex-1 text-zinc-300">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-6 border-t border-white/[0.06] pt-4 text-sm">
                    <cite className="not-italic font-medium text-foreground">{t.name}</cite>
                    <p className="text-zinc-500">{t.role}</p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-white/[0.06] bg-[hsl(223_35%_5%)] py-20 md:py-28">
          <div className="container max-w-3xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-12 space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/[0.08] bg-card/40 px-5 py-1 backdrop-blur-sm"
                >
                  <summary className="cursor-pointer list-none py-4 font-medium outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.q}
                      <span className="text-primary transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="border-t border-white/[0.06] pb-4 pt-3 text-sm leading-relaxed text-zinc-400">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container py-20 md:py-28">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-violet-500/10 px-8 py-16 text-center shadow-[0_0_80px_-30px_hsl(191_100%_58%_/_0.4)] md:px-16">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Ready to find your next customer today?
            </h2>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "mt-10 inline-flex min-h-[48px] px-10 text-base marketing-cta-glow shadow-lg shadow-primary/30",
              )}
            >
              Start Free — No Card Needed
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="container flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-lg font-semibold">SignalForge</p>
            <p className="mt-2 max-w-xs text-sm text-zinc-500">
              Buyer intent, GEO visibility, and outreach — in one flow built for B2B teams.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-zinc-400" aria-label="Footer">
            <Link href="#features" className="hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
        <div className="container mt-10 border-t border-white/[0.06] pt-8 text-center text-sm text-zinc-500">
          Made with ❤️ for B2B founders
        </div>
      </footer>
    </div>
  );
}
