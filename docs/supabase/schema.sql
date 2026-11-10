-- =====================================================================
--  Timoan & Sandipa — RSVP database for Supabase
--  Run this whole file once in Supabase → SQL Editor → New query → Run.
--  Safe to re-run: it only creates things that don't exist yet and
--  replaces the functions.
-- =====================================================================

-- ---------- Tables ----------

-- One row per invited family. slug = the link: timoanwedssandipa.co.za/<slug>
create table if not exists public.invites (
  slug        text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and slug not in ('admin','assets','docs','index')),
  family      text not null check (length(family) between 1 and 120),
  seats       int  not null check (seats between 1 and 30),
  phone       text,                 -- optional WhatsApp number (e.g. 27821234567) for "send invite"
  notes       text,                 -- admin-only notes
  created_at  timestamptz not null default now()
);

-- One reply per family (re-submitting updates it).
create table if not exists public.rsvps (
  slug         text primary key references public.invites(slug) on delete cascade on update cascade,
  responder    text not null,       -- the name typed in "Your full name"
  attending    boolean not null,
  guest_count  int not null default 0,
  guests       text[] not null default '{}',
  message      text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Every submission/change, so admins can see if a reply was changed.
create table if not exists public.rsvp_history (
  id           bigint generated always as identity primary key,
  slug         text not null,
  responder    text,
  attending    boolean,
  guest_count  int,
  guests       text[],
  message      text,
  at           timestamptz not null default now()
);

-- Who may use the admin page (must match the email they log in with).
create table if not exists public.admins (
  email text primary key
);

-- Single settings row: the RSVP deadline.
create table if not exists public.settings (
  id                            int primary key default 1 check (id = 1),
  rsvp_deadline                 timestamptz,            -- null = never closes
  allow_changes_after_deadline  boolean not null default false
);
insert into public.settings (id, rsvp_deadline) values (1, '2027-05-01 23:59:59+02')
on conflict (id) do nothing;

-- ---------- Security: nobody reads/writes tables directly except admins ----------

alter table public.invites      enable row level security;
alter table public.rsvps        enable row level security;
alter table public.rsvp_history enable row level security;
alter table public.admins       enable row level security;
alter table public.settings     enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

do $$
declare t text;
begin
  foreach t in array array['invites','rsvps','rsvp_history','settings'] loop
    execute format('drop policy if exists "admins full access" on public.%I', t);
    execute format('create policy "admins full access" on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;
drop policy if exists "admins see admins" on public.admins;
create policy "admins see admins" on public.admins for select to authenticated using (public.is_admin());

-- ---------- What the public invite page is allowed to do ----------
-- Guests never touch the tables. They can only call these two functions,
-- which check the family link and the seat limit on the server.

-- Look up a family by its link. Returns null for an unknown link.
create or replace function public.get_invite(p_slug text)
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'family',    i.family,
    'seats',     i.seats,
    'replied',   r.slug is not null,
    'attending', r.attending,
    'count',     r.guest_count,
    'deadline',  s.rsvp_deadline,
    'open',      (s.rsvp_deadline is null or now() <= s.rsvp_deadline or s.allow_changes_after_deadline)
  )
  from public.invites i
  left join public.rsvps r on r.slug = i.slug
  cross join public.settings s
  where i.slug = lower(btrim(p_slug));
$$;

-- Save (or update) a family's reply. Errors: unknown_invite, rsvp_closed,
-- no_name, no_guests, too_many_guests, too_long.
create or replace function public.submit_rsvp(
  p_slug text, p_responder text, p_attending boolean, p_guests text[], p_message text
) returns json language plpgsql security definer set search_path = public as $$
declare
  inv public.invites;
  st  public.settings;
  g   text[];
  n   int;
begin
  select * into inv from public.invites where slug = lower(btrim(p_slug));
  if not found then raise exception 'unknown_invite'; end if;

  select * into st from public.settings where id = 1;
  if st.rsvp_deadline is not null and now() > st.rsvp_deadline and not st.allow_changes_after_deadline then
    raise exception 'rsvp_closed';
  end if;

  if coalesce(btrim(p_responder), '') = '' then raise exception 'no_name'; end if;
  g := coalesce(array(select btrim(x) from unnest(p_guests) x where btrim(x) <> ''), '{}');
  n := case when p_attending then coalesce(array_length(g, 1), 0) else 0 end;
  if p_attending and n < 1 then raise exception 'no_guests'; end if;
  if n > inv.seats then raise exception 'too_many_guests'; end if;
  if length(p_responder) > 120 or length(coalesce(p_message, '')) > 1000
     or exists (select 1 from unnest(g) x where length(x) > 120) then
    raise exception 'too_long';
  end if;

  insert into public.rsvps (slug, responder, attending, guest_count, guests, message)
  values (inv.slug, btrim(p_responder), p_attending, n, case when p_attending then g else '{}' end, nullif(btrim(p_message), ''))
  on conflict (slug) do update set
    responder = excluded.responder, attending = excluded.attending, guest_count = excluded.guest_count,
    guests = excluded.guests, message = excluded.message, updated_at = now();

  insert into public.rsvp_history (slug, responder, attending, guest_count, guests, message)
  values (inv.slug, btrim(p_responder), p_attending, n, case when p_attending then g else '{}' end, nullif(btrim(p_message), ''));

  return json_build_object('ok', true, 'count', n, 'family', inv.family);
end $$;

revoke all on function public.get_invite(text)                              from public;
revoke all on function public.submit_rsvp(text, text, boolean, text[], text) from public;
revoke all on function public.is_admin()                                     from public;
grant execute on function public.get_invite(text)                              to anon, authenticated;
grant execute on function public.submit_rsvp(text, text, boolean, text[], text) to anon, authenticated;
grant execute on function public.is_admin()                                     to authenticated;

-- ---------- Your admins (edit, then run) ----------
-- Add the email address of everyone who should open the admin page:
-- insert into public.admins (email) values ('someone@example.com'), ('another@example.com')
-- on conflict do nothing;

-- ---------- Optional: load families in bulk ----------
-- insert into public.invites (slug, family, seats) values
--   ('naidoo',  'The Naidoo Family', 4),
--   ('pillay',  'The Pillay Family', 2)
-- on conflict (slug) do nothing;
