"use client";

import { useState, useTransition } from "react";
import { runIntentAnalysisAction } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Page() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h1 className="text-xl font-semibold">Buyer Intent Analyzer</h1>
        <Input id="intent-keyword" defaultValue="best crm alternatives" placeholder="Keyword or use-case" />
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                const keyword = (document.getElementById("intent-keyword") as HTMLInputElement).value;
                setResult(await runIntentAnalysisAction({ keyword }));
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to analyze intent");
              }
            })
          }
        >
          {pending ? "Scanning..." : "Scan Signals"}
        </Button>
      </Card>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {result ? <Card className="p-4"><pre className="text-sm">{JSON.stringify(result, null, 2)}</pre></Card> : null}
    </div>
  );
}


