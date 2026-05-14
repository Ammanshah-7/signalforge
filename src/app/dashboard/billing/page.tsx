"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Zap,
  CreditCard,
  TrendingUp,
  FileText,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  Sparkles,
  Building2,
  Rocket,
  Star,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type Plan = "starter" | "growth" | "agency";
type Subscription = { plan: string; status: string } | null;

// ── Helpers ────────────────────────────────────────────────────────────────────

async function go(path: string, payload?: Record<string, unknown>) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  if (data.url) window.location.href = data.url;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter" as Plan,
    name: "Starter",
    price: "$49",
    period: "/mo",
    description: "For solo founders and small teams.",
    icon: Rocket,
    color: "indigo",
    credits: "10,000",
    features: [
      "10,000 AI credits / mo",
      "5 signal feeds",
      "Standard analytics",
      "Email support",
      "API access",
    ],
  },
  {
    id: "growth" as Plan,
    name: "Growth",
    price: "$149",
    period: "/mo",
    description: "For scaling teams who need more power.",
    icon: TrendingUp,
    color: "cyan",
    credits: "50,000",
    popular: true,
    features: [
      "50,000 AI credits / mo",
      "Unlimited signal feeds",
      "Advanced analytics",
      "Priority support",
      "Webhooks & integrations",
      "Custom dashboards",
    ],
  },
  {
    id: "agency" as Plan,
    name: "Agency",
    price: "$399",
    period: "/mo",
    description: "Enterprise-grade for large organizations.",
    icon: Building2,
    color: "violet",
    credits: "250,000",
    features: [
      "250,000 AI credits / mo",
      "White-label ready",
      "Dedicated infrastructure",
      "SLA 99.99% uptime",
      "24/7 slack support",
      "Custom AI models",
      "Audit logs",
    ],
  },
];

const MOCK_INVOICES = [
  { id: "INV-0024", date: "May 1, 2025", amount: "$149.00", status: "Paid" },
  { id: "INV-0023", date: "Apr 1, 2025", amount: "$149.00", status: "Paid" },
  { id: "INV-0022", date: "Mar 1, 2025", amount: "$49.00", status: "Paid" },
];

// ── Components ─────────────────────────────────────────────────────────────────

function UsageMeter({
  label,
  used,
  total,
  color = "indigo",
}: {
  label: string;
  used: number;
  total: number;
  color?: string;
}) {
  const pct = Math.min((used / total) * 100, 100);
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500 to-indigo-400",
    cyan: "from-cyan-500 to-cyan-400",
    violet: "from-violet-500 to-violet-400",
    amber: "from-amber-500 to-amber-400",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-400">{label}</span>
        <span className="font-mono text-white">
          {used.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-zinc-600">{pct.toFixed(0)}% used this cycle</p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Subscription>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stripe/status")
      .then((r) => r.json())
      .then((d) => setStatus(d.subscription))
      .catch(() => setStatus(null))
      .finally(() => setStatusLoading(false));
  }, []);

  async function handlePlan(plan: Plan) {
    try {
      setError(null);
      setLoading(plan);
      await go("/api/stripe/checkout", { plan });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout error");
    } finally {
      setLoading(null);
    }
  }

  async function handlePortal() {
    try {
      setError(null);
      setLoading("portal");
      await go("/api/stripe/portal");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Portal error");
    } finally {
      setLoading(null);
    }
  }

  const currentPlan = status?.plan ?? null;

  return (
    <div className="space-y-8 text-zinc-300">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Manage your subscription, usage, and invoices.
          </p>
        </div>
        <Button
          variant="outline"
          disabled={loading !== null}
          onClick={handlePortal}
          className="group flex h-8 items-center gap-2 rounded-lg px-3 text-sm border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white"
        >
          {loading === "portal" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CreditCard className="h-3.5 w-3.5" />
          )}
          Billing portal
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>

      {/* ── CURRENT SUBSCRIPTION CARD ── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.04] to-white/[0.02] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        {/* Glow */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Star className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">
                Current plan
              </p>
              {statusLoading ? (
                <div className="mt-1 h-6 w-28 animate-pulse rounded bg-white/[0.05]" />
              ) : (
                <p className="text-xl font-bold capitalize text-white">
                  {currentPlan ?? "Free"}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {status?.status && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                {status.status}
              </span>
            )}
          </div>
        </div>

        {/* Usage meters */}
        {currentPlan && (
          <div className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <UsageMeter label="AI Credits" used={34200} total={50000} color="indigo" />
            <UsageMeter label="Signal Feeds" used={8} total={20} color="cyan" />
            <UsageMeter label="API Calls" used={89400} total={200000} color="violet" />
          </div>
        )}
      </div>

      {/* ── PRICING CARDS ── */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-white">
          {currentPlan ? "Change plan" : "Choose a plan"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isActive = currentPlan === plan.id;
            const colorClasses: Record<string, { ring: string; bg: string; icon: string; badge: string; btn: string }> = {
              indigo: {
                ring: "ring-indigo-500/30",
                bg: "from-indigo-500/10 to-indigo-500/5",
                icon: "bg-indigo-500/10 ring-indigo-500/20 text-indigo-400",
                badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
                btn: "from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.25)]",
              },
              cyan: {
                ring: "ring-cyan-500/30",
                bg: "from-cyan-500/10 to-cyan-500/5",
                icon: "bg-cyan-500/10 ring-cyan-500/20 text-cyan-400",
                badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                btn: "from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(6,182,212,0.25)]",
              },
              violet: {
                ring: "ring-violet-500/30",
                bg: "from-violet-500/10 to-violet-500/5",
                icon: "bg-violet-500/10 ring-violet-500/20 text-violet-400",
                badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
                btn: "from-violet-600 to-violet-500 hover:from-violet-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.25)]",
              },
            };
            const cc = colorClasses[plan.color];

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-br transition-all duration-300 ${
                  isActive
                    ? `border-white/[0.10] ${cc.bg} ring-1 ${cc.ring}`
                    : "border-white/[0.05] from-white/[0.03] to-transparent hover:border-white/[0.08]"
                } ${plan.popular ? "lg:scale-[1.02]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${cc.icon}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      {plan.popular && (
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cc.badge}`}>
                          <Sparkles className="h-3 w-3" />
                          Popular
                        </span>
                      )}
                      {isActive && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-white">{plan.name}</h3>
                    <p className="mt-0.5 text-xs text-zinc-500">{plan.description}</p>
                  </div>

                  <div className="mt-4 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  </div>

                  <ul className="mt-5 space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/80" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-white/[0.05] p-4">
                  <Button
                    disabled={loading !== null || isActive}
                    onClick={() => handlePlan(plan.id)}
                    className={`w-full bg-gradient-to-r font-medium text-white transition-all duration-300 disabled:opacity-50 ${
                      isActive
                        ? "cursor-default bg-none bg-white/[0.05] text-zinc-500 hover:bg-white/[0.05]"
                        : cc.btn
                    }`}
                  >
                    {loading === plan.id ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Redirecting…
                      </span>
                    ) : isActive ? (
                      "Current plan"
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── INVOICE HISTORY ── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Invoice history</h2>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Export all
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Invoice", "Date", "Amount", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-xs font-medium tracking-wide text-zinc-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv, i) => (
                <tr
                  key={inv.id}
                  className={`transition-colors hover:bg-white/[0.02] ${
                    i < MOCK_INVOICES.length - 1 ? "border-b border-white/[0.04]" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-mono text-zinc-300">{inv.id}</td>
                  <td className="px-5 py-4 text-zinc-500">{inv.date}</td>
                  <td className="px-5 py-4 text-white">{inv.amount}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}