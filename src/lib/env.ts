import { z } from "zod";

const supabasePublishableKeySchema = z
  .string()
  .min(1)
  .refine((key) => key.startsWith("sb_publishable_") || key.startsWith("eyJ"), {
    message: "Must start with sb_publishable_ (or be a legacy JWT key).",
  });

const supabaseSecretKeySchema = z
  .string()
  .min(1)
  .refine((key) => key.startsWith("sb_secret_") || key.startsWith("eyJ"), {
    message: "Must start with sb_secret_ (or be a legacy JWT key).",
  });

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().describe("Public app URL, e.g. http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().describe("Supabase project URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: supabasePublishableKeySchema.describe("Supabase anon public key"),
  SUPABASE_SERVICE_ROLE_KEY: supabaseSecretKeySchema.describe("Supabase service role key (server-only)"),
  GROQ_API_KEY: z.string().min(1).describe("Groq API key"),
  ANTHROPIC_API_KEY: z.string().min(1).optional().describe("Anthropic API key (optional)"),
  OPENAI_API_KEY: z.string().min(1).optional().describe("OpenAI API key (optional)"),
  FIRECRAWL_API_KEY: z.string().min(1).describe("Firecrawl API key"),
  TAVILY_API_KEY: z.string().min(1).describe("Tavily API key"),
  STRIPE_SECRET_KEY: z.string().min(1).describe("Stripe secret key"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).describe("Stripe publishable key"),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).describe("Stripe webhook signing secret"),
  STRIPE_STARTER_PRICE_ID: z.string().min(1).describe("Stripe price ID for Starter plan"),
  STRIPE_GROWTH_PRICE_ID: z.string().min(1).describe("Stripe price ID for Growth plan"),
  STRIPE_AGENCY_PRICE_ID: z.string().min(1).describe("Stripe price ID for Agency plan"),
  RESEND_API_KEY: z.string().min(1).describe("Resend API key"),
  RESEND_FROM_EMAIL: z.string().email().describe("Default from email for Resend"),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;
  try {
    cachedEnv = envSchema.parse({
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
      TAVILY_API_KEY: process.env.TAVILY_API_KEY,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID,
      STRIPE_GROWTH_PRICE_ID: process.env.STRIPE_GROWTH_PRICE_ID,
      STRIPE_AGENCY_PRICE_ID: process.env.STRIPE_AGENCY_PRICE_ID,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      const details = err.issues
        .map((issue) => `• ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `Invalid environment configuration. Check your .env / Vercel variables:\n${details}`,
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to validate environment variables: ${message}`);
  }
  return cachedEnv;
}


