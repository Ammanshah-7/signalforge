"use server";

import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { runStructuredAI } from "@/lib/ai";
import { geoOutputSchema, intentOutputSchema, outreachOutputSchema } from "@/lib/ai-schemas";
import { GEO_ANALYSIS_PROMPT } from "@/lib/prompts/geo-analysis";
import { INTENT_ANALYSIS_PROMPT } from "@/lib/prompts/intent-analysis";
import { OUTREACH_PROMPT } from "@/lib/prompts/outreach";
import { scrapeWebsite, queryIntentSources } from "@/lib/ingestion";
import { assertRateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/security";
import { createScan, getUserSubscription } from "@/lib/db";
import { enforceUsageLimit } from "@/lib/usage";
import { sendScanCompleteEmail } from "@/lib/resend";
import { createServerSupabase } from "@/lib/supabase/server";

const geoInput = z.object({
  website: z.string().url(),
  keyword: z.string().min(2).max(120),
  industry: z.string().min(2).max(120),
});
const intentInput = z.object({ keyword: z.string().min(2).max(120) });
const outreachInput = z.object({
  company: z.string().min(2).max(120),
  painPoint: z.string().min(2).max(280),
  opportunity: z.string().min(2).max(280),
});

async function enforceScanPolicy(userId: string) {
  const subscription = await getUserSubscription(userId);
  const plan = subscription?.plan ?? "starter";
  const currentCount = 0;
  enforceUsageLimit(plan, currentCount);
}

export async function runGeoAnalysisAction(input: z.infer<typeof geoInput>) {
  const parsed = geoInput.parse(input);
  const { user } = await requireUser();

  assertRateLimit(`geo:${user.id}`, 30, 60_000);
  await enforceScanPolicy(user.id);

  const content = await scrapeWebsite(parsed.website);

  const result = await runStructuredAI({
    systemPrompt: GEO_ANALYSIS_PROMPT,
    userPrompt: JSON.stringify({ ...parsed, content }),
    schema: geoOutputSchema,
  });

  const scanId = await createScan({ userId: user.id, type: "geo", input: parsed });

  const supabase = createServerSupabase();
  const {
    data: { user: refreshedUser },
  } = await supabase.auth.getUser();
  if (refreshedUser?.email) {
    const reportUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/geo?scan=${encodeURIComponent(
      scanId,
    )}`;
    await sendScanCompleteEmail(refreshedUser.email, reportUrl, result.score);
  }
  return result;
}

export async function runIntentAnalysisAction(input: z.infer<typeof intentInput>) {
  const parsed = intentInput.parse(input);
  const { user } = await requireUser();

  assertRateLimit(`intent:${user.id}`, 40, 60_000);
  await enforceScanPolicy(user.id);

  const sources = await queryIntentSources(parsed.keyword);
  const result = await runStructuredAI({
    systemPrompt: INTENT_ANALYSIS_PROMPT,
    userPrompt: JSON.stringify({ keyword: parsed.keyword, sources }),
    schema: intentOutputSchema,
  });

  await createScan({ userId: user.id, type: "intent", input: parsed });
  return result;
}

export async function runOutreachGeneratorAction(input: z.infer<typeof outreachInput>) {
  const parsed = outreachInput.parse(input);
  const { user } = await requireUser();

  assertRateLimit(`outreach:${user.id}`, 60, 60_000);

  const result = await runStructuredAI({
    systemPrompt: OUTREACH_PROMPT,
    userPrompt: JSON.stringify({
      company: sanitizeText(parsed.company),
      painPoint: sanitizeText(parsed.painPoint),
      opportunity: sanitizeText(parsed.opportunity),
    }),
    schema: outreachOutputSchema,
  });

  return result;
}


