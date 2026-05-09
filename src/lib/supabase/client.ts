/**
 * Supabase browser client — URL configuration (production)
 *
 * In Supabase Dashboard → Authentication → URL Configuration, set:
 *
 * Site URL:
 *   https://YOUR_DOMAIN
 *
 * Redirect URLs (Additional Redirect URLs allow list), include at least:
 *   https://YOUR_DOMAIN/auth/callback
 *   https://YOUR_DOMAIN/dashboard
 *
 * Notes:
 * - Replace YOUR_DOMAIN with your Vercel production hostname (no trailing slash).
 * - `/auth/callback` is required for OAuth / PKCE and some email-link flows with SSR.
 * - This app’s email confirmation uses `emailRedirectTo` → `/dashboard` (see auth-actions).
 * - Password reset emails redirect to `/login`; add `https://YOUR_DOMAIN/login` if Supabase rejects redirects.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db-types";
import { getEnv } from "@/lib/env";

export function createClient() {
  try {
    const env = getEnv();
    return createBrowserClient<Database>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown environment error";
    throw new Error(`Supabase browser client initialization failed: ${message}`);
  }
}
