import "server-only";
import { getEnv } from "@/lib/env";
import { sanitizeText } from "@/lib/security";

export type ScrapedPage = {
  title: string;
  description: string;
  mainContent: string;
  wordCount: number;
  headings: { level: number; text: string }[];
};

export async function scrapeWebsite(url: string): Promise<ScrapedPage> {
  const env = getEnv();
  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
    },
    body: JSON.stringify({ url, formats: ["markdown"] }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Firecrawl failed: ${response.status}`);
  }

  const json = await response.json();
  const markdown = sanitizeText(json?.data?.markdown ?? "");
  const lines = markdown.split("\n");

  const headings: { level: number; text: string }[] = [];
  for (const line of lines) {
    const match = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (match) {
      headings.push({ level: match[1].length, text: match[2].trim() });
    }
  }

  const wordCount = markdown.split(/\s+/).filter(Boolean).length;

  return {
    title: sanitizeText((json?.data?.metadata?.title as string) ?? ""),
    description: sanitizeText((json?.data?.metadata?.description as string) ?? ""),
    mainContent: markdown,
    wordCount,
    headings,
  };
}

export type IntentSource = {
  title: string;
  url: string;
  content: string;
  score: number;
};

export async function queryIntentSources(keyword: string): Promise<IntentSource[]> {
  const env = getEnv();
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: env.TAVILY_API_KEY,
      query: `advanced B2B buyer intent, competitor research, switching intent: ${keyword}`,
      max_results: 5,
      search_depth: "advanced",
      include_answer: false,
      include_raw_content: true,
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Tavily failed: ${response.status}`);
  const json = await response.json();

  const results = Array.isArray(json.results) ? json.results : [];

  return results.slice(0, 5).map((r: any) => ({
    title: sanitizeText(r.title ?? ""),
    url: r.url ?? "",
    content: sanitizeText(r.content ?? r.raw_content ?? ""),
    score: typeof r.score === "number" ? r.score : 0,
  }));
}


