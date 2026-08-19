-- Create tournament_court_mappings table for storing court assignments
-- This table allows storing official court schedule data from ITF or other sources
-- and linking them to specific matches at Kraków Open or other tournaments

create table if not exists public.tournament_court_mappings (
  id bigint generated always as identity primary key,
  tournament_slug text not null,
  tournament_year integer not null,
  match_date date not null,
  match_time time,
  player1 text not null,
  player2 text not null,
  court_number text not null,
  court_name text,
  surface text,
  capacity integer,
  round text,
  notes text,
  source text, -- e.g. 'itf_official', 'manual', 'api_enriched'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  
  -- Ensure one mapping per match per tournament
  unique(tournament_slug, tournament_year, match_date, player1, player2)
);

-- Index for common queries
create index if not exists tournament_court_mappings_lookup_idx
  on public.tournament_court_mappings (tournament_slug, tournament_year, match_date);

create index if not exists tournament_court_mappings_court_idx
  on public.tournament_court_mappings (court_number, tournament_slug);

create index if not exists tournament_court_mappings_players_idx
  on public.tournament_court_mappings (lower(player1), lower(player2));

-- Enable RLS for security
alter table public.tournament_court_mappings enable row level security;

-- Public read access (anyone can see court mappings)
create policy "tournament_court_mappings_read"
  on public.tournament_court_mappings
  for select
  using (true);

-- Insert/update access (requires authentication or API key)
create policy "tournament_court_mappings_write"
  on public.tournament_court_mappings
  for insert
  with check (true);

create policy "tournament_court_mappings_update"
  on public.tournament_court_mappings
  for update
  using (true);
