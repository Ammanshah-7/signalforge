import { NextResponse } from "next/server";
import { z } from "zod";
import { buildGeoAnalysisPrompt } from "@/lib/prompts/geo-analysis";
import { callAI } from "@/lib/ai";
import { scrapeWebsite, queryIntentSources } from "@/lib/ingestion";
import { requireUser } from "@/lib/auth";
import { createScan, saveGeoReport } from "@/lib/db";

const inputSchema = z.object({
  url: z.string().url(),
  keyword: z.string().min(2),
  industry: z.enum(["SaaS", "E-commerce", "Agency", "Consulting", "Other"]),
});

const outputSchema = z.object({
  geo_score: z.number().min(0).max(100),
  ai_citation_probability: z.enum(["low", "medium", "high"]),
  visibility_summary: z.string(),
  strengths: z.array(z.string()),
  critical_gaps: z.array(z.string()),
  recommendations: z.array(
    z.object({
      priority: z.enum(["critical", "high", "medium"]),
      category: z.enum(["content", "structure", "schema", "entities", "faq"]),
      title: z.string(),
      what_to_do: z.string(),
      example: z.string(),
      expected_impact: z.string(),
    }),
  ),
  competitor_advantages: z.array(z.string()),
  quick_wins: z.array(z.string()),
});

export async function POST(req: Request) {
  try {
    const body = inputSchema.parse(await req.json());
    const { user } = await requireUser();

    const website = await scrapeWebsite(body.url);
    const competitorSearch = await queryIntentSources(`${body.keyword} best tools 2026`);
    const competitorContent = competitorSearch
      .map((c) => `Title: ${c.title}\nURL: ${c.url}\nContent: ${c.content}`)
      .join("\n\n");

    const prompt = buildGeoAnalysisPrompt({
      keyword: body.keyword,
      industry: body.industry,
      websiteContent: website.mainContent,
      competitorContent,
    });

    const raw = await callAI(`Return only valid JSON.\n\n${prompt}`);
    const result = outputSchema.parse(JSON.parse(raw));

    const scanId = await createScan({
      userId: user.id,
      type: "geo",
      input: body,
    });

    await saveGeoReport({
      scanId,
      geoScore: result.geo_score,
      citationProbability: result.ai_citation_probability,
      visibilitySummary: result.visibility_summary,
      strengths: result.strengths,
      criticalGaps: result.critical_gaps,
      recommendations: result.recommendations,
      competitorAdvantages: result.competitor_advantages,
      quickWins: result.quick_wins,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analysis failed" }, { status: 400 });
  }
}

