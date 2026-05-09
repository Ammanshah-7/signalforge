import { z } from "zod";

const htmlTagRegex = /<[^>]+>/g;

export function sanitizeText(input: string) {
  return input.replace(htmlTagRegex, "").slice(0, 8000);
}

export const safeIdSchema = z.string().uuid();


