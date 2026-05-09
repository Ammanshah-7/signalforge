import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Handles Supabase Auth code exchange (OAuth, magic link, etc.).
 * Must match a URL in Supabase → Authentication → Redirect URLs.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const path = next.startsWith("/") ? next : `/${next}`;
      return NextResponse.redirect(`${origin}${path}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
