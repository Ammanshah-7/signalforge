import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import type { PlanTier } from "@/lib/db-types";

type SubscriptionStatus = {
  plan: PlanTier;
  status: string;
  stripe_customer_id: string | null;
} | null;

export async function upsertSubscription(params: {
  userId: string;
  customerId: string;
  subscriptionId: string;
  plan: PlanTier;
  status: string;
}) {
  const supabase = createAdminSupabase() as any;
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: params.userId,
      stripe_customer_id: params.customerId,
      stripe_subscription_id: params.subscriptionId,
      plan: params.plan,
      status: params.status,
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}

export async function getUserSubscription(userId: string): Promise<SubscriptionStatus> {
  const supabase = createAdminSupabase() as any;
  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan,status,stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return (data as SubscriptionStatus) ?? null;
}

export async function createScan(params: { userId: string; type: string; input: unknown }) {
  const supabase = createAdminSupabase() as any;
  const { data, error } = await supabase
    .from("scans")
    .insert({ user_id: params.userId, type: params.type, status: "completed", input: params.input as never })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function getMonthlyScanCount(userId: string) {
  const supabase = createAdminSupabase() as any;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { count, error } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  if (error) throw error;
  return count ?? 0;
}

export async function saveGeoReport(params: {
  scanId: string;
  geoScore: number;
  citationProbability: "low" | "medium" | "high";
  visibilitySummary: string;
  strengths: string[];
  criticalGaps: string[];
  recommendations: unknown[];
  competitorAdvantages: string[];
  quickWins: string[];
}) {
  const supabase = createAdminSupabase() as any;
  const { error } = await supabase.from("geo_reports").insert({
    scan_id: params.scanId,
    geo_score: params.geoScore,
    ai_citation_probability:
      params.citationProbability === "high" ? 85 : params.citationProbability === "medium" ? 60 : 30,
    visibility_analysis: params.visibilitySummary,
    competitor_mentions: params.competitorAdvantages,
    recommendations: {
      strengths: params.strengths,
      critical_gaps: params.criticalGaps,
      items: params.recommendations,
      quick_wins: params.quickWins,
    },
  });

  if (error) throw error;
}

export async function saveIntentSignals(
  userId: string,
  scanId: string,
  signals: Array<{
    intent_type: string;
    company_hint: string;
    lead_score: number;
    urgency_score: number;
    buying_probability: string;
    pain_points: string[];
    outreach_angle: string;
    source_url: string;
    why_this_is_a_lead: string;
  }>,
) {
  const supabase = createAdminSupabase() as any;
  const payload = signals.map((signal) => ({
    user_id: userId,
    scan_id: scanId,
    intent_type: signal.intent_type,
    company_hint: signal.company_hint,
    lead_score: signal.lead_score,
    urgency_score: signal.urgency_score,
    buying_probability: signal.buying_probability,
    pain_points: signal.pain_points,
    outreach_angle: signal.outreach_angle,
    source_url: signal.source_url,
    why_this_is_a_lead: signal.why_this_is_a_lead,
  }));

  const { error } = await supabase.from("intent_signals").insert(payload);
  if (error) throw error;
}

export async function saveOutreachCampaign(params: {
  userId: string;
  company: string;
  content: unknown;
}) {
  const supabase = createAdminSupabase() as any;
  const { error } = await supabase.from("outreach_campaigns").insert({
    user_id: params.userId,
    company: params.company,
    content: params.content,
  });
  if (error) throw error;
}


