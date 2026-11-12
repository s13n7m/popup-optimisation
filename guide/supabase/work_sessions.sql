-- Run once in the Supabase SQL editor (after progress.sql).
-- One row per timer session: from pressing Work to pausing or leaving the page.
-- The id is made by the browser, so saving the same session twice just updates it.

create table if not exists public.work_sessions (
  id         uuid        primary key,
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  started_at timestamptz not null,
  seconds    integer     not null default 0 check (seconds >= 0),
  updated_at timestamptz not null default now()
);

create index if not exists work_sessions_user_started on public.work_sessions (user_id, started_at desc);

alter table public.work_sessions enable row level security;

create policy "read own sessions"   on public.work_sessions for select using (auth.uid() = user_id);
create policy "insert own sessions" on public.work_sessions for insert with check (auth.uid() = user_id);
create policy "update own sessions" on public.work_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own sessions" on public.work_sessions for delete using (auth.uid() = user_id);
