"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ plan: string; status: string } | null>(null);

  useEffect(() => {
    fetch("/api/stripe/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.subscription))
      .catch(() => setStatus(null));
  }, []);

  return (
    <div className="space-y-4 text-zinc-300">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="text-sm text-zinc-400">Manage subscription plan and billing portal.</p>
      {status ? <p className="text-sm text-zinc-400">Current plan: {status.plan} Â· Status: {status.status}</p> : null}
      <div className="flex flex-wrap gap-3">
        {(["starter", "growth", "agency"] as const).map((plan) => (
          <Button
            key={plan}
            disabled={loading !== null}
            onClick={async () => {
              try {
                setError(null);
                setLoading(plan);
                await go("/api/stripe/checkout", { plan });
              } catch (e) {
                setError(e instanceof Error ? e.message : "Checkout error");
              } finally {
                setLoading(null);
              }
            }}
          >
            {loading === plan ? "Opening..." : `Choose ${plan}`}
          </Button>
        ))}
        <Button
          variant="outline"
          disabled={loading !== null}
          onClick={async () => {
            try {
              setError(null);
              setLoading("portal");
              await go("/api/stripe/portal");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Portal error");
            } finally {
              setLoading(null);
            }
          }}
        >
          {loading === "portal" ? "Opening..." : "Open billing portal"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}


