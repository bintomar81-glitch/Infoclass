create table if not exists public.messages_contact (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null check (char_length(trim(nom)) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  sujet text not null check (char_length(trim(sujet)) between 1 and 150),
  message text not null check (char_length(trim(message)) between 1 and 5000)
);
alter table public.messages_contact enable row level security;
revoke all on public.messages_contact from anon, authenticated;
grant insert (nom, email, sujet, message) on public.messages_contact to anon, authenticated;
drop policy if exists "Envoyer un message" on public.messages_contact;
create policy "Envoyer un message" on public.messages_contact for insert to anon, authenticated with check (true);
-- Pas de lecture publique. Consulter les messages depuis le tableau de bord Supabase.
