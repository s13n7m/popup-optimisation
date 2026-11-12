-- Run once in the Supabase SQL editor.
-- Stores which guide cards you have ticked. Row level security means a signed-in
-- user can only ever read or write their own rows.

create table if not exists public.progress (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  card_id    text        not null,
  done       boolean     not null default true,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table public.progress enable row level security;

create policy "read own progress"   on public.progress for select using (auth.uid() = user_id);
create policy "insert own progress" on public.progress for insert with check (auth.uid() = user_id);
create policy "update own progress" on public.progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own progress" on public.progress for delete using (auth.uid() = user_id);

-- After your first sign-in, turn off new sign-ups so only your account can ever exist:
-- Dashboard > Authentication > Sign In / Providers > "Allow new users to sign up" = off.
