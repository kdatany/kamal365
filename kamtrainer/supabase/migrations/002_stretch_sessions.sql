-- Incremental migration for projects that already ran the original
-- supabase/schema.sql (which doesn't include stretch_sessions). Run this
-- once in the SQL Editor. New projects can just use schema.sql directly —
-- it already includes this table.

create table if not exists public.stretch_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  routine_id text not null,
  routine_name text not null,
  date date not null,
  duration_seconds integer not null default 0,
  completed_stretch_ids text[] not null default '{}',
  total_stretches integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists stretch_sessions_user_id_idx on public.stretch_sessions (user_id);

alter table public.stretch_sessions enable row level security;

create policy "Users manage their own stretch sessions" on public.stretch_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
