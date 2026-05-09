import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog",
  description: "Product updates, GTM playbooks, and intent signal tips from the SignalForge team.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="container max-w-2xl py-16">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-8 text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-4 text-zinc-400">
        We&apos;re writing playbooks on buyer intent, GEO, and outbound — check back soon for the first
        posts.
      </p>
    </div>
  );
}
