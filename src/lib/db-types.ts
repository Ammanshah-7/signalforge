export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: { id: string; email: string; created_at: string | null };
        Insert: { id?: string; email: string; created_at?: string | null };
        Update: Partial<{ id: string; email: string; created_at: string | null }>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: "starter" | "growth" | "agency";
          status: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan?: "starter" | "growth" | "agency";
          status?: string;
          created_at?: string | null;
        };
        Update: Partial<{
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan: "starter" | "growth" | "agency";
          status: string;
        }>;
      };
      scans: {
        Row: { id: string; user_id: string; type: string; status: string; input: Json; output: Json | null; created_at: string | null };
        Insert: { id?: string; user_id: string; type: string; status?: string; input: Json; output?: Json | null; created_at?: string | null };
        Update: Partial<{ type: string; status: string; input: Json; output: Json | null }>;
      };
      geo_reports: {
        Row: { id: string; scan_id: string; geo_score: number | null; visibility_analysis: string | null; competitor_mentions: Json | null; ai_citation_probability: number | null; recommendations: Json | null; created_at: string | null };
        Insert: { id?: string; scan_id: string; geo_score?: number | null; visibility_analysis?: string | null; competitor_mentions?: Json | null; ai_citation_probability?: number | null; recommendations?: Json | null; created_at?: string | null };
        Update: Partial<{ geo_score: number | null; visibility_analysis: string | null; competitor_mentions: Json | null; ai_citation_probability: number | null; recommendations: Json | null }>;
      };
      intent_reports: {
        Row: { id: string; scan_id: string; lead_quality_score: number | null; urgency_score: number | null; buying_probability: number | null; outreach_angle: string | null; signals: Json | null; created_at: string | null };
        Insert: { id?: string; scan_id: string; lead_quality_score?: number | null; urgency_score?: number | null; buying_probability?: number | null; outreach_angle?: string | null; signals?: Json | null; created_at?: string | null };
        Update: Partial<{ lead_quality_score: number | null; urgency_score: number | null; buying_probability: number | null; outreach_angle: string | null; signals: Json | null }>;
      };
    };
  };
};

export type PlanTier = "starter" | "growth" | "agency";


