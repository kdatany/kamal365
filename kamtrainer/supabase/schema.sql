-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query)
-- once per project. Creates the three tables KamTrainer needs plus row
-- level security so each user can only see/write their own rows.

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null,
  preset boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- text, not a FK: preset classes (e.g. "preset-liftonics") aren't rows in
  -- public.classes, they're merged in client-side.
  class_id text not null,
  class_name text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.strength_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  workout_id text not null,
  workout_name text not null,
  date date not null,
  duration_seconds integer not null default 0,
  completed_exercise_ids text[] not null default '{}',
  total_exercises integer not null default 0,
  created_at timestamptz not null default now()
);

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

create index if not exists classes_user_id_idx on public.classes (user_id);
create index if not exists class_sessions_user_id_idx on public.class_sessions (user_id);
create index if not exists strength_sessions_user_id_idx on public.strength_sessions (user_id);
create index if not exists stretch_sessions_user_id_idx on public.stretch_sessions (user_id);

alter table public.classes enable row level security;
alter table public.class_sessions enable row level security;
alter table public.strength_sessions enable row level security;
alter table public.stretch_sessions enable row level security;

create policy "Users manage their own classes" on public.classes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own class sessions" on public.class_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own strength sessions" on public.strength_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own stretch sessions" on public.stretch_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
