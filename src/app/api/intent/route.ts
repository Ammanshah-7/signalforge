import { NextResponse } from "next/server";
import { z } from "zod";
import { buildIntentPrompt } from "@/lib/prompts/intent-analysis";
import { callAI } from "@/lib/ai";
import { queryIntentSources } from "@/lib/ingestion";
import { requireUser } from "@/lib/auth";
import { createScan, saveIntentSignals } from "@/lib/db";

const inputSchema = z.object({
  productDescription: z.string().min(10),
  idealCustomer: z.string().min(5),
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

const phrases = [
  "alternative",
  "best {keyword} tool 2026",
  "switching from {keyword}",
  "{keyword} recommendation Reddit",
];

export async function POST(req: Request) {
  try {
    const body = inputSchema.parse(await req.json());
    const { user } = await requireUser();

    const scanId = await createScan({ userId: user.id, type: "intent", input: body });
    const signals: z.infer<typeof signalSchema>[] = [];

    for (const keyword of body.keywords) {
      for (const phrase of phrases) {
        const query = phrase.replace(/\{keyword\}/g, keyword);
        const results = await queryIntentSources(query);

        for (const result of results) {
          let source = "unknown";
          try {
            source = new URL(result.url).hostname;
          } catch {
            source = "unknown";
          }
          const prompt = buildIntentPrompt({
            productDescription: body.productDescription,
            idealCustomer: body.idealCustomer,
            title: result.title,
            source,
            content: result.content,
            sourceUrl: result.url,
          });

          const raw = await callAI(`Return only valid JSON.\n\n${prompt}`);
          const analyzed = signalSchema.parse(JSON.parse(raw));

          if (analyzed.has_intent) {
            signals.push(analyzed);
          }
        }
      }
    }

    await saveIntentSignals(user.id, scanId, signals);
    return NextResponse.json({ signals });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Intent analysis failed" }, { status: 400 });
  }
}

