import { NextResponse } from "next/server";
import { z } from "zod";
import { getPlanToPriceMap, getStripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";

const schema = z.object({ plan: z.enum(["starter", "growth", "agency"]) });

export async function POST(req: Request) {
  const stripe = getStripe();
  const planToPrice = getPlanToPriceMap();
  const body = schema.parse(await req.json());
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?status=cancelled`,
    customer_email: user.email,
    metadata: { userId: user.id, plan: body.plan },
    line_items: [{ price: planToPrice[body.plan], quantity: 1 }],
    allow_promotion_codes: true,
  });

  return NextResponse.json({ url: session.url });
}


