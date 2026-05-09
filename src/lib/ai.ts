import "server-only";
import Groq from "groq-sdk";
import { getEnv } from "@/lib/env";

export async function callAI(prompt: string): Promise<string> {
  const normalizedPrompt = prompt.trim();
  if (!normalizedPrompt) {
    throw new Error("AI prompt cannot be empty");
  }

  const groq = new Groq({ apiKey: getEnv().GROQ_API_KEY });
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: normalizedPrompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
    max_tokens: 2000,
  });
  return response.choices[0].message.content || "";
}


