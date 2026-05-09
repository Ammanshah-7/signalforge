"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    monthly: 49,
    blurb: "10 scans, GEO scoring, basic outreach, email support",
    features: [
      "10 scans / month",
      "GEO scoring",
      "Basic outreach",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    monthly: 199,
    blurb: "100 scans, full intent detection, competitor analysis, priority support",
    features: [
      "100 scans / month",
      "Full intent detection",
      "Competitor analysis",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Agency",
    monthly: 799,
    blurb: "Unlimited, white-label reports, API access, dedicated support",
    features: [
      "Unlimited scans",
      "White-label reports",
      "API access",
      "Dedicated support",
    ],
    highlight: false,
  },
];

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Simple pricing that scales with you
          </h2>
          <p className="mt-4 text-zinc-400">
            Start free. Upgrade when you&apos;re ready. Annual billing saves 20%.
          </p>
          <div
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-card/80 p-1.5 pl-4 text-sm"
            role="group"
            aria-label="Billing period"
          >
            <span className={cn(!annual && "font-medium text-foreground")}>Monthly</span>
            <button
              type="button"
              onClick={() => setAnnual((a) => !a)}
              className={cn(
                "relative h-9 w-16 rounded-full transition-colors",
                annual ? "bg-primary" : "bg-zinc-700",
              )}
              aria-pressed={annual}
              aria-label={annual ? "Switch to monthly billing" : "Switch to annual billing (20% off)"}
            >
              <span
                className={cn(
                  "absolute top-1 size-7 rounded-full bg-white shadow transition-transform",
                  annual ? "left-8" : "left-1",
                )}
              />
            </button>
            <span className={cn(annual && "font-medium text-foreground")}>
              Annual <span className="text-primary">−20%</span>
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => {
            const price = annual ? Math.round(p.monthly * 0.8) : p.monthly;
            return (
              <div
                key={p.name}
                className={cn(
                  "relative flex flex-col rounded-3xl border bg-card/50 p-8 shadow-glass backdrop-blur-sm",
                  p.highlight
                    ? "border-primary/50 ring-2 ring-primary/30 lg:scale-[1.02]"
                    : "border-white/[0.08]",
                )}
              >
                {p.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </span>
                ) : null}
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="mt-2 min-h-[3rem] text-sm text-zinc-400">{p.blurb}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">${price}</span>
                  <span className="text-zinc-500">/mo</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">
                  {annual ? "Billed annually" : "Billed monthly"}
                </p>
                <ul className="mt-8 flex flex-1 flex-col gap-3 text-sm text-zinc-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ variant: p.highlight ? "default" : "outline", size: "default" }),
                    "mt-8 w-full",
                    p.highlight && "marketing-cta-glow shadow-lg shadow-primary/20",
                  )}
                >
                  Start Free Trial
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
