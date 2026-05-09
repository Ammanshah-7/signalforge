"use client";

import { useState, useTransition } from "react";
import { runGeoAnalysisAction } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h1 className="text-xl font-semibold">GEO Analyzer</h1>
        <Input id="geo-website" placeholder="Website URL" defaultValue="https://example.com" />
        <Input id="geo-keyword" placeholder="Target keyword" defaultValue="buyer intent software" />
        <Input id="geo-industry" placeholder="Industry" defaultValue="SaaS" />
        <Button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(null);
                const website = (document.getElementById("geo-website") as HTMLInputElement).value;
                const keyword = (document.getElementById("geo-keyword") as HTMLInputElement).value;
                const industry = (document.getElementById("geo-industry") as HTMLInputElement).value;
                setResult(await runGeoAnalysisAction({ website, keyword, industry }));
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to run GEO analysis");
              }
            })
          }
        >
          {pending ? "Analyzing..." : "Run GEO Analysis"}
        </Button>
      </Card>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {result ? <Card className="p-4"><pre className="text-sm">{JSON.stringify(result, null, 2)}</pre></Card> : null}
    </div>
  );
}


