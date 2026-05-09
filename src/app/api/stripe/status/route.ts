import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/db";

export async function GET() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getUserSubscription(user.id);
  return NextResponse.json({ subscription: subscription ?? { plan: "starter", status: "inactive" } });
}


