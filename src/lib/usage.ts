import type { PlanTier } from "@/lib/db-types";

export const PLAN_LIMITS: Record<PlanTier, number> = {
  starter: 10,
  growth: 100,
  agency: Number.MAX_SAFE_INTEGER,
};

export function enforceUsageLimit(plan: PlanTier, currentCount: number) {
  if (currentCount >= PLAN_LIMITS[plan]) {
    throw new Error(`Plan limit reached for ${plan}`);
  }
}


