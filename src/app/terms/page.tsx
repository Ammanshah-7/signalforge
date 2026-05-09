import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of SignalForge.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container max-w-2xl py-16">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-6 text-zinc-400 leading-relaxed">
        Formal terms will be published before broad public launch. By using SignalForge you agree to
        use the product lawfully, respect third-party platform rules when sending outreach, and keep
        your account credentials secure. Subscription and billing terms match the checkout flow and
        Stripe customer portal.
      </p>
    </div>
  );
}
