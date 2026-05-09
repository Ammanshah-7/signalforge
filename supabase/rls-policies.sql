alter table users enable row level security;
alter table scans enable row level security;
alter table geo_reports enable row level security;
alter table intent_reports enable row level security;
alter table outreach_campaigns enable row level security;
alter table subscriptions enable row level security;

create policy "users_self_access" on users
  for select using (auth.uid() = id);

create policy "scans_owner_crud" on scans
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "geo_reports_owner_read" on geo_reports
  for select using (
    exists (
      select 1 from scans s
      where s.id = scan_id and s.user_id = auth.uid()
    )
  );

create policy "intent_reports_owner_read" on intent_reports
  for select using (
    exists (
      select 1 from scans s
      where s.id = scan_id and s.user_id = auth.uid()
    )
  );

create policy "outreach_campaigns_owner_crud" on outreach_campaigns
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "subscriptions_owner_read" on subscriptions
  for select using (auth.uid() = user_id);

alter table intent_signals enable row level security;

create policy "intent_signals_owner_read" on intent_signals
  for select using (auth.uid() = user_id);

