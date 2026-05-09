import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/db";

export async function POST() {
  const stripe = getStripe();
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscription = await getUserSubscription(user.id);
  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing customer found" }, { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`,
  });

  return NextResponse.json({ url: portal.url });
}


