import "server-only";
import Groq from "groq-sdk";
import { getEnv } from "@/lib/env";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function callAI(prompt: string): Promise<string> {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) {
    throw new Error("AI prompt cannot be empty");
  }

  const groq = new Groq({ apiKey: getEnv().GROQ_API_KEY });
  const request = {
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user" as const, content: normalizedPrompt }],
    response_format: { type: "json_object" as const },
    temperature: 0.7,
    max_tokens: 1000,
  };

  try {
    const response = await groq.chat.completions.create(request);
    return response.choices[0].message.content || "";
  } catch (error: unknown) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined;

    if (status === 429) {
      await sleep(30_000);
      const retryResponse = await groq.chat.completions.create(request);
      return retryResponse.choices[0].message.content || "";
    }

    throw error;
  }
}


