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

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
