import Stripe from "stripe";
import { getEnv } from "@/lib/env";

export function getStripe() {
  const env = getEnv();
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

export function getPriceToPlanMap() {
  const env = getEnv();
  return new Map<string, "starter" | "growth" | "agency">([
    [env.STRIPE_STARTER_PRICE_ID, "starter"],
    [env.STRIPE_GROWTH_PRICE_ID, "growth"],
    [env.STRIPE_AGENCY_PRICE_ID, "agency"],
  ]);
}

export function getPlanToPriceMap(): Record<"starter" | "growth" | "agency", string> {
  const env = getEnv();
  return {
    starter: env.STRIPE_STARTER_PRICE_ID,
    growth: env.STRIPE_GROWTH_PRICE_ID,
    agency: env.STRIPE_AGENCY_PRICE_ID,
  };
}


