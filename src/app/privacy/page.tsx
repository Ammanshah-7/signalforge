import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SignalForge collects, uses, and protects your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl py-16">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
      <p className="mt-6 text-zinc-400 leading-relaxed">
        This policy will be updated for public launch. We process account and usage data to run the
        product, rely on trusted infrastructure providers, and do not sell your contact lists. For
        questions, reach out through your workspace or the contact channel listed on your order
        documentation.
      </p>
    </div>
  );
}
