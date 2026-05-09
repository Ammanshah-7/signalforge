import { NextResponse } from "next/server";
import { z } from "zod";
import { buildOutreachPrompt } from "@/lib/prompts/outreach";
import { callAI } from "@/lib/ai";
import { requireUser } from "@/lib/auth";
import { saveOutreachCampaign } from "@/lib/db";

const inputSchema = z.object({
  companyName: z.string().min(2),
  painPoints: z.string().min(3),
  outreachAngle: z.string().min(1).optional().default("general outreach"),
  productName: z.string().min(2),
  productDescription: z.string().min(1).optional().default("B2B SaaS solution"),
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
    const raw = await callAI(`Return only valid JSON.\n\n${prompt}`);
    const result = outputSchema.parse(JSON.parse(raw));

    await saveOutreachCampaign({ userId: user.id, company: body.companyName, content: result });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Outreach generation failed" }, { status: 400 });
  }
}

