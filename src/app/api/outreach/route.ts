import { NextResponse } from "next/server";
import { z } from "zod";
import { buildOutreachPrompt } from "@/lib/prompts/outreach";
import { callAI } from "@/lib/ai";
import { requireUser } from "@/lib/auth";
import { saveOutreachCampaign } from "@/lib/db";

const inputSchema = z.object({
  companyName: z.string().min(1),
  painPoints: z.string().min(1),
  outreachAngle: z.string().optional().default("general outreach"),
  productName: z.string().min(1),
  productDescription: z.string().optional().default("B2B SaaS solution"),
  tone: z.enum(["Professional", "Casual", "Direct"]).optional().default("Professional"),
});

const outputSchema = z.object({
  email: z.object({
    subject: z.string(),
    body: z.string(),
    cta: z.string(),
  }),
  linkedin_dm: z.string(),
  follow_up_day3: z.string(),
  follow_up_day7: z.string(),
  personalization_score: z.number().min(0).max(100),
  why_this_works: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = inputSchema.parse(await req.json());
    const { user } = await requireUser();

    const prompt = buildOutreachPrompt(body);

    const raw = await callAI(`Return only valid JSON with these exact fields: email (object with subject, body, cta), linkedin_dm, follow_up_day3, follow_up_day7, personalization_score (number 0-100), why_this_works.\n\n${prompt}`);

    let result;
    try {
      result = outputSchema.parse(JSON.parse(raw));
    } catch {
      // If schema validation fails, build result from raw
      const parsed = JSON.parse(raw);
      result = {
        email: parsed.email ?? { subject: "Following up", body: raw, cta: "Let's connect" },
        linkedin_dm: parsed.linkedin_dm ?? "Hi, saw you might benefit from our tool.",
        follow_up_day3: parsed.follow_up_day3 ?? "Just following up on my previous message.",
        follow_up_day7: parsed.follow_up_day7 ?? "I'll leave it here. Feel free to reach out anytime.",
        personalization_score: parsed.personalization_score ?? 70,
        why_this_works: parsed.why_this_works ?? "Personalized to their specific pain points.",
      };
    }

    try {
      await saveOutreachCampaign({ userId: user.id, company: body.companyName, content: result });
    } catch (dbError) {
      console.error("[outreach] DB save failed (non-fatal)", dbError);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[outreach] failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}