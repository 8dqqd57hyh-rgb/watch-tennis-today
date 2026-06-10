-- Optional table for the reusable EmailCapture component.
-- Run this in Supabase before relying on non-player email capture as a durable list.

create table if not exists public.email_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  context_type text not null,
  context_value text not null,
  source text not null default 'email-capture',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_subscriptions_unique_context unique (email, context_type, context_value),
  constraint email_subscriptions_valid_status check (status in ('active', 'unsubscribed')),
  constraint email_subscriptions_valid_context check (
    context_type in ('daily', 'streaming', 'watch', 'guide', 'tournament', 'general')
  )
);

create index if not exists email_subscriptions_context_idx
  on public.email_subscriptions (context_type, context_value);

create index if not exists email_subscriptions_status_idx
  on public.email_subscriptions (status);
