"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Mail, ArrowLeft, Loader2, CheckCircle2, Shield } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await forgotPasswordAction(formData);
        setSent(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
      }
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06080C] px-4 py-12">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.10)_0%,transparent_65%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.4) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative w-full max-w-[420px]">
        {/* Glass card */}
        <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] shadow-[0_0_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl">
          {/* Scan line effect */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

          <div className="p-8">
            {/* Logo */}
            <div className="mb-8 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-[0_0_16px_rgba(99,102,241,0.4)]">
                <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-mono text-sm font-bold tracking-tight text-white">
                Signal<span className="text-indigo-400">Forge</span>
              </span>
            </div>

            {/* ── SUCCESS STATE ── */}
            {sent ? (
              <div className="flex flex-col items-center py-4 text-center">
                <div className="relative mb-5">
                  <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/30">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                  </div>
                </div>
                <h1 className="text-xl font-bold text-white">Check your inbox</h1>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  We sent a reset link to{" "}
                  <span className="font-medium text-indigo-300">{email}</span>.
                  <br />
                  It expires in 15 minutes.
                </p>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 text-left">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                    <div>
                      <p className="text-xs font-medium text-white">Didn't get it?</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        Check your spam folder or{" "}
                        <button
                          type="button"
                          onClick={() => setSent(false)}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors underline"
                        >
                          try again
                        </button>
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="mt-6 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </div>
            ) : (
              /* ── REQUEST STATE ── */
              <>
                {/* Icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>

                <h1 className="text-xl font-bold text-white">Reset your password</h1>
                <p className="mt-1.5 text-sm text-zinc-500">
                  Enter your email and we'll send a secure reset link.
                </p>

                <form action={handleSubmit} className="mt-6 space-y-4">
                  <Input
                    type="email"
                    name="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-white/[0.08] bg-white/[0.03] text-white placeholder:text-zinc-600 transition-all duration-200 focus:border-indigo-500/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-indigo-500/30 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.08)]"
                  />

                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 w-full bg-gradient-to-r from-indigo-600 to-indigo-500 font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-60"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending link…
                      </span>
                    ) : (
                      "Send reset link"
                    )}
                  </Button>
                </form>

                <Link
                  href="/login"
                  className="mt-5 flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom copy */}
        <p className="mt-6 text-center text-xs text-zinc-700">
          Protected by ForgeIntel™ · 256-bit SSL encryption
        </p>
      </div>
    </div>
  );
}