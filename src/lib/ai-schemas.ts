import { z } from "zod";

export const geoOutputSchema = z.object({
  score: z.number().min(0).max(100),
  visibilityAnalysis: z.string(),
  competitorMentions: z.array(z.string()),
  citationProbability: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
});

export const intentOutputSchema = z.object({
  leadQualityScore: z.number().min(0).max(100),
  urgencyScore: z.number().min(0).max(100),
  buyingProbability: z.number().min(0).max(100),
  outreachAngle: z.string(),
  signals: z.array(
    z.object({
      source: z.string(),
      signalType: z.enum(["purchase", "switching", "hiring", "growth", "frustration"]),
      quote: z.string(),
      company: z.string(),
      urgency: z.number().min(0).max(100),
    }),
  ),
});

export const outreachOutputSchema = z.object({
  coldEmail: z.string(),
  linkedInDm: z.string(),
  followUp: z.string(),
});


