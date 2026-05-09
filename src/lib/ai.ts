import "server-only";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { getEnv } from "@/lib/env";

type Provider = "claude" | "openai";

async function withTimeout<T>(promise: Promise<T>, ms: number) {
  let timeout: NodeJS.Timeout;
  const timed = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => reject(new Error("AI timeout")), ms);
  });
  const result = await Promise.race([promise, timed]);
  clearTimeout(timeout!);
  return result as T;
}

async function withRetry<T>(fn: () => Promise<T>, retries = 3) {
  let lastError: unknown;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const delay = 250 * 2 ** i;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

async function runWithProvider(provider: Provider, system: string, user: string) {
  const env = getEnv();
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  if (provider === "claude") {
    const completion = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      temperature: 0.2,
      system,
      messages: [{ role: "user", content: user }],
    });

    const textBlock = completion.content.find((b) => b.type === "text");
    return textBlock?.type === "text" ? textBlock.text : "{}";
  }

  if (provider === "openai") {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    return completion.choices[0]?.message?.content ?? "{}";
  }
  throw new Error("Unsupported provider");
}

export async function runStructuredAI<T extends z.ZodTypeAny>(args: {
  systemPrompt: string;
  userPrompt: string;
  schema: T;
}) {
  const providers: Provider[] = ["claude", "openai"];

  let lastError: unknown;
  for (const provider of providers) {
    try {
      const raw = await withRetry(
        () => withTimeout(runWithProvider(provider, args.systemPrompt, args.userPrompt), 30_000),
        3,
      );
      const parsed = JSON.parse(raw);
      const result = args.schema.parse(parsed);
      // lightweight server-side logging for observability
      console.info("[AI] provider_used=%s", provider);
      return result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("All AI providers failed");
}


