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

function truncate(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, maxChars)}...`;
}

export async function POST(req: Request) {
  try {
    const body = inputSchema.parse(await req.json());
    const { user } = await requireUser();

    let websiteContent = "";
    try {
      const website = await scrapeWebsite(body.url);
      websiteContent = truncate(website.mainContent?.trim() ?? "", 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[analyze] Firecrawl scrape failed", { url: body.url, message });
    }

    let competitorContent = "";
    try {
      const competitorSearch = await queryIntentSources(`${body.keyword} best tools 2026`);
      competitorContent = truncate(
        competitorSearch
          .map((c) => {
            const compact = `Title: ${c.title}\nURL: ${c.url}\nContent: ${c.content}`.trim();
            return truncate(compact, 200);
          })
        .join("\n\n")
          .trim(),
        1000,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[analyze] Tavily query failed", { keyword: body.keyword, message });
    }

    if (!websiteContent) {
      websiteContent = [
        "Website content unavailable from scraping.",
        `Target URL: ${body.url}`,
        `Primary keyword focus: ${body.keyword}`,
      ].join("\n");
    }

    if (!competitorContent) {
      competitorContent = [
        "Competitor search content unavailable from Tavily.",
        `Market keyword: ${body.keyword}`,
      ].join("\n");
    }

    const prompt = buildGeoAnalysisPrompt({
      keyword: body.keyword,
      industry: body.industry,
      websiteContent,
      competitorContent,
    });

    if (!prompt.trim()) {
      throw new Error("Generated analysis prompt is empty");
    }

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

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[analyze] request failed", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

