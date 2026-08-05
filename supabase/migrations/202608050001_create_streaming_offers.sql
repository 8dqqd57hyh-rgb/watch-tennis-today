create table if not exists public.streaming_offers (
  id text primary key,
  tournament_slug text not null,
  country_code char(2) not null,
  provider_name text not null,
  broadcaster_name text,
  provider_slug text not null,
  base_plan_name text,
  base_plan_price numeric(10,2) check (base_plan_price >= 0),
  sports_addon_name text,
  sports_addon_price numeric(10,2) check (sports_addon_price >= 0),
  currency char(3),
  billing_period text not null default 'unknown' check (billing_period in ('monthly', 'annual', 'event', 'unknown')),
  channels jsonb not null default '[]'::jsonb,
  coverage jsonb,
  official_url text not null,
  source_urls jsonb not null default '[]'::jsonb,
  source_fingerprints jsonb not null default '{}'::jsonb,
  last_checked_at timestamptz not null,
  valid_until timestamptz,
  status text not null check (status in ('verified', 'needs-review', 'unavailable', 'stale')),
  verification_method text not null default 'automatic' check (verification_method in ('manual', 'automatic')),
  verified_by text,
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists streaming_offers_lookup_idx
  on public.streaming_offers (tournament_slug, country_code, status);

create table if not exists public.streaming_offer_audit_log (
  id bigint generated always as identity primary key,
  offer_id text not null references public.streaming_offers(id) on delete cascade,
  checked_at timestamptz not null default now(),
  outcome text not null,
  changed_fields jsonb not null default '{}'::jsonb,
  previous_values jsonb not null default '{}'::jsonb,
  details text
);

alter table public.streaming_offers enable row level security;
alter table public.streaming_offer_audit_log enable row level security;

insert into public.streaming_offers (
  id, tournament_slug, country_code, provider_name, broadcaster_name, provider_slug,
  base_plan_name, base_plan_price, sports_addon_name, sports_addon_price, currency,
  billing_period, channels, coverage, official_url, source_urls, last_checked_at,
  valid_until, status, verification_method, verified_by, verified_at, notes
) values (
  'us-open-pl-max-eurosport', 'us-open', 'PL', 'HBO Max', 'Eurosport', 'max',
  'Standard', 29.99, 'Kanały TV i Sport', 15.00, 'PLN', 'monthly',
  '["Eurosport 1", "Eurosport 2"]'::jsonb,
  '{"live": true, "replay": true, "allCourts": true, "commentaryLanguages": ["pl"]}'::jsonb,
  'https://www.max.com/pl/pl/sports',
  '["https://www.max.com/pl/pl/sports", "https://www.usopen.org/en_US/about/tv_intl.html"]'::jsonb,
  '2026-08-05T00:00:00Z', '2026-09-14T00:00:00Z', 'verified', 'manual',
  'Watch Tennis Today editorial review', '2026-08-05T00:00:00Z',
  'US Open rights and Max checkout details are reviewed separately; verify the final checkout price before subscribing.'
) on conflict (id) do nothing;
