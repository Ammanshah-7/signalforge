# SignalForge — Setup Guide

SignalForge is a B2B buyer-intent and GEO intelligence app: Next.js (App Router), Supabase, Stripe, and AI APIs.

## Local Development

1. Clone repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill all values
4. Run `supabase/schema.sql` in Supabase SQL Editor
5. Run `supabase/rls-policies.sql` in Supabase SQL Editor
6. `npm run dev`

## Vercel Deployment

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add **all** environment variables listed in `.env.example` (see variable names below)
4. Set `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://your-project.vercel.app` or custom domain)
5. Deploy

Project root includes `vercel.json` (build/install commands and `iad1` region).

## Post-Deploy Checklist

- [ ] Add Stripe webhook: `https://YOUR_DOMAIN/api/stripe/webhook` (see comment block in `src/app/api/stripe/webhook/route.ts`)
- [ ] Add Supabase **Site URL** and **Redirect URLs** (see comment block in `src/lib/supabase/client.ts`)
- [ ] Test signup → verify email → dashboard flow
- [ ] Test Stripe checkout → subscription created
- [ ] Test one GEO scan end to end

## Environment variables

Use the same names in Vercel as in `.env.local`. Stripe price IDs must be **Price** IDs (`price_...`), not Product IDs.

| Variable | Scope |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | Public site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only |
| `OPENAI_API_KEY` | Server only |
| `ANTHROPIC_API_KEY` | Server only |
| `FIRECRAWL_API_KEY` | Server only |
| `TAVILY_API_KEY` | Server only |
| `STRIPE_SECRET_KEY` | Server only |
| `STRIPE_WEBHOOK_SECRET` | Server only (per endpoint / mode) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public (Stripe.js) |
| `STRIPE_STARTER_PRICE_ID` | Server only |
| `STRIPE_GROWTH_PRICE_ID` | Server only |
| `STRIPE_AGENCY_PRICE_ID` | Server only |
| `RESEND_API_KEY` | Server only |
| `RESEND_FROM_EMAIL` | Server only |

## Documentation pointers

- **Stripe:** Webhook signing secret is different for test vs live; set `STRIPE_WEBHOOK_SECRET` to match the endpoint you configure.
- **Supabase:** RLS and schema live under `supabase/`.
