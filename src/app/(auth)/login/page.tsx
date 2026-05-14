"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signInAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  EyeOff,
  Zap,
  Shield,
  Lock,
  Globe,
  ChevronRight,
  Loader2,
} from "lucide-react";

const TRUST_ITEMS = [
  { icon: Shield, label: "SOC 2 Type II Certified" },
  { icon: Lock, label: "End-to-end encrypted" },
  { icon: Globe, label: "99.99% uptime SLA" },
];

const ORBIT_NODES = [
  { angle: 0, delay: "0s" },
  { angle: 72, delay: "0.4s" },
  { angle: 144, delay: "0.8s" },
  { angle: 216, delay: "1.2s" },
  { angle: 288, delay: "1.6s" },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await signInAction(formData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign-in failed.");
      }
    });
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#06080C]">
      {/* ── LEFT PANEL – trust / branding ── */}
      <div className="relative hidden w-[52%] flex-col justify-between overflow-hidden border-r border-white/[0.04] p-12 lg:flex">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[560px] w-[560px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.18)_0%,transparent_65%)] blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.10)_0%,transparent_65%)] blur-3xl" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Zap className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            Signal<span className="text-indigo-400">Forge</span>
          </span>
        </div>

        {/* Central orbit graphic */}
        <div className="relative flex items-center justify-center">
          <div className="relative flex h-[320px] w-[320px] items-center justify-center">
            {/* Rings */}
            {[160, 120, 80].map((r, i) => (
              <div
                key={r}
                className="absolute rounded-full border border-white/[0.06]"
                style={{ width: r * 2, height: r * 2 }}
              />
            ))}
            {/* Orbiting nodes */}
            {ORBIT_NODES.map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const x = Math.cos(rad) * 120;
              const y = Math.sin(rad) * 120;
              return (
                <div
                  key={i}
                  className="absolute h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                  style={{
                    left: `calc(50% + ${x}px - 5px)`,
                    top: `calc(50% + ${y}px - 5px)`,
                    animationDelay: node.delay,
                    animationDuration: "2s",
                  }}
                />
              );
            })}
            {/* Center */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 ring-1 ring-white/10 backdrop-blur-sm">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_30px_rgba(99,102,241,0.6)]" />
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="relative space-y-6">
          <div>
            <p className="mb-2 font-mono text-xs tracking-[0.2em] text-indigo-400/70 uppercase">
              ForgeIntel™ Platform
            </p>
            <h2 className="text-3xl font-bold leading-snug text-white">
              Intelligence that
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                outpaces the market.
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Real-time signal processing for enterprise teams who cannot afford
              to miss a beat.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-col gap-2.5">
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08]">
                  <Icon className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span className="text-sm text-zinc-400">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL – form ── */}
      <div className="relative flex flex-1 items-center justify-center px-6 py-12">
        {/* Subtle right-side glow */}
        <div className="pointer-events-none absolute right-0 top-1/2 h-[400px] w-[300px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_right,rgba(99,102,241,0.07)_0%,transparent_70%)]" />

        <div className="relative w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-mono text-base font-bold text-white">
              Signal<span className="text-indigo-400">Forge</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Sign in to your ForgeIntel™ workspace
            </p>
          </div>

          {/* OAuth */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            {["Google", "GitHub"].map((provider) => (
              <button
                key={provider}
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-white"
              >
                {provider === "Google" ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ) : (
                  <svg className="h-4 w-4 fill-zinc-300" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013.01-.4c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.56 21.79 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
                  </svg>
                )}
                {provider}
              </button>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.06]" />
            <span className="text-xs text-zinc-600">or continue with email</span>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {/* Form */}
          <form action={handleSubmit} className="space-y-4">
            <div className="group relative">
              <Input
                type="email"
                name="email"
                required
                placeholder="you@company.com"
                className="h-11 border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/30 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                placeholder="Password"
                className="h-11 border-white/[0.08] bg-white/[0.03] pr-10 text-white placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/30 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-indigo-500"
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-zinc-500 hover:text-indigo-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="group relative h-11 w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-500 font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in
                  <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-600">
            No account?{" "}
            <Link
              href="/signup"
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Create one free
            </Link>
          </p>

          {/* Bottom trust */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-zinc-700">
            <Lock className="h-3 w-3" />
            <span>256-bit SSL · GDPR compliant · SOC 2 certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}