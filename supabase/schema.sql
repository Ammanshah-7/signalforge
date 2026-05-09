create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  type text not null,
  status text not null default 'queued',
  input jsonb not null,
  output jsonb,
  created_at timestamptz default now()
);

create table if not exists geo_reports (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid references scans(id) on delete cascade,
  geo_score int,
  visibility_analysis text,
  competitor_mentions jsonb,
  ai_citation_probability int,
  recommendations jsonb,
  created_at timestamptz default now()
);

create table if not exists intent_reports (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid references scans(id) on delete cascade,
  lead_quality_score int,
  urgency_score int,
  buying_probability int,
  outreach_angle text,
  signals jsonb,
  created_at timestamptz default now()
);

create table if not exists outreach_campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  company text not null,
  content jsonb not null,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text not null default 'starter',
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

create unique index if not exists subscriptions_user_id_uq on subscriptions(user_id);

create table if not exists competitors (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  metrics jsonb,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  company text not null,
  score int,
  urgency int,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists intent_signals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  scan_id uuid references scans(id) on delete cascade,
  intent_type text not null,
  company_hint text,
  lead_score int,
  urgency_score int,
  buying_probability text,
  pain_points jsonb,
  outreach_angle text,
  source_url text,
  why_this_is_a_lead text,
  created_at timestamptz default now()
);

