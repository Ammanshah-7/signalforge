"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const links = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[hsl(223_35%_6%/0.88)] backdrop-blur-xl supports-[backdrop-filter]:bg-[hsl(223_35%_6%/0.72)]">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight text-foreground"
          onClick={() => setOpen(false)}
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Zap className="size-4 fill-primary/30" aria-hidden />
          </span>
          SignalForge
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-400 transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "default" }))}>
            Sign In
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ variant: "default", size: "default" }),
              "marketing-cta-glow shadow-lg shadow-primary/25",
            )}
          >
            Start Free Trial
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-300 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={cn(
          "border-t border-white/[0.06] md:hidden",
          open ? "block" : "hidden",
        )}
        role="dialog"
        aria-label="Mobile navigation"
      >
        <div className="container flex flex-col gap-1 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-3 text-sm text-zinc-300 hover:bg-white/5 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.06] pt-4">
            <Link
              href="/login"
              className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full")}
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className={cn(
                buttonVariants({ variant: "default", size: "default" }),
                "marketing-cta-glow w-full shadow-lg shadow-primary/25",
              )}
              onClick={() => setOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
