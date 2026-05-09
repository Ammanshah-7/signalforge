export const GEO_ANALYSIS_PROMPT_TEMPLATE = `
You are a GEO (Generative Engine Optimization) expert. Analyze this website for AI search visibility.

Target keyword: {keyword}
Industry: {industry}

Website content:
{websiteContent}

Top competitors ranking for this keyword:
{competitorContent}

Return ONLY a valid JSON object:
{
  "geo_score": ,
  "ai_citation_probability": "low" | "medium" | "high",
  "visibility_summary": "<2 sentences: current state + biggest opportunity>",
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

