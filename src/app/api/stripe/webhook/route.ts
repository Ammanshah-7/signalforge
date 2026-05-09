/**
 * Stripe webhooks — production setup
 *
 * 1. Deploy this app and note your public origin, e.g. https://your-domain.com
 * 2. Stripe Dashboard → Developers → Webhooks → Add endpoint
 *    URL: https://YOUR_DOMAIN/api/stripe/webhook
 * 3. Select events (at minimum):
 *    - checkout.session.completed
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 * 4. After saving, copy the endpoint “Signing secret” and set STRIPE_WEBHOOK_SECRET in Vercel
 *    (use a different secret for test vs live mode endpoints).
 *
 * ---
 * Raw body & signature verification (Next.js App Router)
 *
 * On the Pages Router (`pages/api/...`), Stripe required `export const config = { api: { bodyParser: false } }`
 * so `constructEvent` received the exact raw bytes.
 *
 * This file is an App Router Route Handler: there is no `bodyParser` option. Do not JSON-parse the
 * body. Read the request as text *once* with `await request.text()` and pass that string to
 * `stripe.webhooks.constructEvent` along with the `stripe-signature` header and STRIPE_WEBHOOK_SECRET.
 */

import { headers } from "next/headers";
import { getEnv } from "@/lib/env";
import { getPriceToPlanMap, getStripe } from "@/lib/stripe";
import { upsertSubscription } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleSubscriptionChange(subscription: any) {
  const stripe = getStripe();
  const priceToPlan = getPriceToPlanMap();

  const customerId = String(subscription.customer);
  const priceId = subscription.items?.data?.[0]?.price?.id;
  const plan = priceId ? priceToPlan.get(priceId) : undefined;
  const userId = subscription.metadata?.userId as string | undefined;

  if (!plan || !userId) return;

  await upsertSubscription({
    userId,
    customerId,
    subscriptionId: subscription.id,
    status: subscription.status,
    plan,
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const body = await req.text();
  const signature = headers().get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const webhookSecret = getEnv().STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    if (session.subscription) {
      const stripeClient = getStripe();
      const subscription = await stripeClient.subscriptions.retrieve(String(session.subscription));
      subscription.status = "active";
      await handleSubscriptionChange(subscription);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    await handleSubscriptionChange(event.data.object as any);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription: any = event.data.object;
    subscription.status = "canceled";
    await handleSubscriptionChange(subscription);
  }

  return new Response("ok", { status: 200 });
}
