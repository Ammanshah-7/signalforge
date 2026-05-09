export const GEO_ANALYSIS_PROMPT_TEMPLATE = `
Analyze AI-search visibility for this website.

Target keyword: {keyword}
Industry: {industry}

Website content:
{websiteContent}

Competitor snippets:
{competitorContent}

Return ONLY valid JSON with this exact shape:
{
  "geo_score": ,
  "ai_citation_probability": "low" | "medium" | "high",
  "visibility_summary": "<max 2 sentences>",
  "strengths": ["", ...],
  "critical_gaps": ["", ...],
  "recommendations": [
    {
      "priority": "critical" | "high" | "medium",
      "category": "content" | "structure" | "schema" | "entities" | "faq",
      "title": "",
      "what_to_do": "",
      "example": "",
      "expected_impact": ""
    }
  ],
  "competitor_advantages": [""],
  "quick_wins": [""]
}
`;
export const GEO_ANALYSIS_PROMPT = GEO_ANALYSIS_PROMPT_TEMPLATE;

export function buildGeoAnalysisPrompt(input: {
  keyword: string;
  industry: string;
  websiteContent: string;
  competitorContent: string;
}) {
  return GEO_ANALYSIS_PROMPT_TEMPLATE.replace("{keyword}", input.keyword)
    .replace("{industry}", input.industry)
    .replace("{websiteContent}", input.websiteContent)
    .replace("{competitorContent}", input.competitorContent);
}

