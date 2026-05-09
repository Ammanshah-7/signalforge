export const INTENT_ANALYSIS_PROMPT_TEMPLATE = `
You are a B2B sales intelligence expert. Detect buyer intent from this online discussion.

Product being sold: {productDescription}
Ideal customer: {idealCustomer}

Discussion:
Title: {title}
Source: {source}
Content: {content}

Return ONLY valid JSON:
{
  "has_intent": true | false,
  "intent_type": "switching" | "evaluating" | "frustrated" | "hiring" | "growing" | "none",
  "company_hint": "",
  "lead_score": <0-100>,
  "urgency_score": <0-100>,
  "buying_probability": "low" | "medium" | "high",
  "pain_points": [""],
  "outreach_angle": "",
  "source_url": "{sourceUrl}",
  "why_this_is_a_lead": "<1 sentence explanation>"
}
`;
export const INTENT_ANALYSIS_PROMPT = INTENT_ANALYSIS_PROMPT_TEMPLATE;

export function buildIntentPrompt(input: {
  productDescription: string;
  idealCustomer: string;
  title: string;
  source: string;
  content: string;
  sourceUrl: string;
}) {
  return INTENT_ANALYSIS_PROMPT_TEMPLATE.replace("{productDescription}", input.productDescription)
    .replace("{idealCustomer}", input.idealCustomer)
    .replace("{title}", input.title)
    .replace("{source}", input.source)
    .replace("{content}", input.content)
    .replace("{sourceUrl}", input.sourceUrl);
}

