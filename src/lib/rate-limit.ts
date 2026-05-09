import "server-only";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function assertRateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= max) {
    throw new Error("Rate limit exceeded");
  }

  current.count += 1;
}


