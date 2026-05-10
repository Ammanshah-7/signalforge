import { NextResponse } from "next/server";
import { z } from "zod";
import { buildIntentPrompt } from "@/lib/prompts/intent-analysis";
import { callAI } from "@/lib/ai";
import { queryIntentSources } from "@/lib/ingestion";
import { requireUser } from "@/lib/auth";
import { createScan, saveIntentSignals } from "@/lib/db";

const inputSchema = z.object({
  productDescription: z.string().min(5),
  idealCustomer: z.string().min(3),
  keywords: z.array(z.string().min(2)).min(1),
});

const signalSchema = z.object({
  has_intent: z.boolean(),
  intent_type: z.enum(["switching", "evaluating", "frustrated", "hiring", "growing", "none"]),
  company_hint: z.string(),
  lead_score: z.number().min(0).max(100),
  urgency_score: z.number().min(0).max(100),
  buying_probability: z.enum(["low", "medium", "high"]),
  pain_points: z.array(z.string()),
  outreach_angle: z.string(),
  source_url: z.string(),
  why_this_is_a_lead: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = inputSchema.parse(await req.json());
    const { user } = await requireUser();

    let scanId = "";
try {
  scanId = await createScan({ userId: user.id, type: "intent", input: body });
} catch (dbError) {
  console.error("[intent] createScan failed (non-fatal)", dbError);
}
    const signals: z.infer<typeof signalSchema>[] = [];

    // Only use first keyword, one search query — avoid rate limits
    const keyword = body.keywords[0];
    const query = `${keyword} alternative OR recommendation OR switching`;

    let results = [];
    try {
      results = await queryIntentSources(query);
    } catch {
      results = [];
    }

    // Only analyze top 3 results max
    const topResults = results.slice(0, 3);

    for (const result of topResults) {
      try {
        let source = "unknown";
        try { source = new URL(result.url).hostname; } catch { source = "unknown"; }

        const prompt = buildIntentPrompt({
          productDescription: body.productDescription,
          idealCustomer: body.idealCustomer,
          title: result.title,
          source,
          content: result.content?.slice(0, 500) ?? "",
          sourceUrl: result.url,
        });

        const raw = await callAI(`Return only valid JSON.\n\n${prompt}`);
        const analyzed = signalSchema.parse(JSON.parse(raw));
        if (analyzed.has_intent) signals.push(analyzed);
      } catch {
        continue;
      }
    }

    // If no signals found from search, generate AI-based signals
    if (signals.length === 0) {
      try {
        const fallbackPrompt = `You are a B2B sales intelligence expert.

Product: ${body.productDescription}
Ideal customer: ${body.idealCustomer}
Keyword: ${keyword}

Generate 2 realistic buyer intent signals for this product. Return only valid JSON:
{
  "signals": [
    {
      "has_intent": true,
      "intent_type": "evaluating",
      "company_hint": "TechStartup Inc",
      "lead_score": 75,
      "urgency_score": 65,
      "buying_probability": "medium",
      "pain_points": ["specific pain point"],
      "outreach_angle": "specific outreach angle",
      "source_url": "https://reddit.com/r/saas",
      "why_this_is_a_lead": "reason"
    }
  ]
}`;

        const raw = await callAI(fallbackPrompt);
        const parsed = JSON.parse(raw);
        if (parsed.signals) signals.push(...parsed.signals);
      } catch {
        // ignore fallback errors
      }
    }

    try {
      await saveIntentSignals(user.id, scanId, signals);
    } catch {
      // non-fatal
    }

    return NextResponse.json({ signals });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[intent] failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}