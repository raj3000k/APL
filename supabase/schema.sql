create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'ipl_team'
  ) then
    create type ipl_team as enum (
      'RCB',
      'MI',
      'CSK',
      'KKR',
      'SRH',
      'RR',
      'DC',
      'PBKS',
      'GT',
      'LSG'
    );
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'connection_status'
  ) then
    create type connection_status as enum ('pending', 'accepted', 'rejected');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'room_type'
  ) then
    create type room_type as enum ('team', 'match', 'emotion', 'connection', 'watch-party');
  end if;
end $$;

create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  avatar text not null default '',
  team ipl_team,
  latitude double precision,
  longitude double precision,
  status text not null default 'Watching Match',
  fan_points integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image',
  caption text not null default '',
  team ipl_team,
  match_tag text,
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type room_type not null,
  team ipl_team,
  emotion text,
  match_label text,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.room_members (
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users (id) on delete cascade,
  receiver_id uuid not null references public.users (id) on delete cascade,
  status connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  constraint different_users check (sender_id <> receiver_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  body text not null,
  type text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.watch_parties (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references public.users (id) on delete cascade,
  title text not null,
  room_id uuid not null references public.rooms (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.watch_party_invites (
  watch_party_id uuid not null references public.watch_parties (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  accepted boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (watch_party_id, user_id)
);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  prediction text not null check (prediction in ('4', '6', 'wicket')),
  created_at timestamptz not null default now()
);

create index if not exists posts_user_id_idx on public.posts (user_id, created_at desc);
create index if not exists comments_post_id_idx on public.comments (post_id, created_at desc);
create index if not exists messages_room_id_idx on public.messages (room_id, created_at desc);
create index if not exists users_team_idx on public.users (team);

create or replace function public.nearby_team_fans (
  origin_lat double precision,
  origin_lng double precision,
  target_team ipl_team,
  radius_km double precision default 10
)
returns table (
  id uuid,
  name text,
  avatar text,
  team ipl_team,
  latitude double precision,
  longitude double precision,
  status text,
  distance_km double precision
)
language sql
stable
as $$
  with candidates as (
    select
      u.*,
      (
        6371 * acos(
          least(
            1,
            cos(radians(origin_lat)) * cos(radians(u.latitude)) * cos(radians(u.longitude) - radians(origin_lng)) +
            sin(radians(origin_lat)) * sin(radians(u.latitude))
          )
        )
      ) as distance_km
    from public.users u
    where u.team = target_team
      and u.latitude is not null
      and u.longitude is not null
  )
  select
    candidates.id,
    candidates.name,
    candidates.avatar,
    candidates.team,
    candidates.latitude,
    candidates.longitude,
    candidates.status,
    candidates.distance_km
  from candidates
  where candidates.distance_km <= radius_km
  order by candidates.distance_km asc;
$$;

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.comments enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.messages enable row level security;
alter table public.connections enable row level security;
alter table public.notifications enable row level security;
alter table public.watch_parties enable row level security;
alter table public.watch_party_invites enable row level security;
alter table public.predictions enable row level security;

create policy "users are readable by everyone"
on public.users for select
using (true);

create policy "users can update their own profile"
on public.users for update
using (auth.uid() = id);

create policy "authenticated users can insert their profile"
on public.users for insert
with check (auth.uid() = id);

create policy "posts are readable by everyone"
on public.posts for select
using (true);

create policy "users can insert their own posts"
on public.posts for insert
with check (auth.uid() = user_id);

create policy "users can update their own posts"
on public.posts for update
using (auth.uid() = user_id);

create policy "likes are readable by everyone"
on public.post_likes for select
using (true);

create policy "users manage their own likes"
on public.post_likes for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "comments are readable by everyone"
on public.comments for select
using (true);

create policy "users can add their comments"
on public.comments for insert
with check (auth.uid() = user_id);

create policy "rooms are readable to members or public spaces"
on public.rooms for select
using (true);

create policy "room creators can insert"
on public.rooms for insert
with check (auth.uid() = created_by);

create policy "room members are readable"
on public.room_members for select
using (auth.uid() = user_id or exists (
  select 1
  from public.room_members rm
  where rm.room_id = room_members.room_id
    and rm.user_id = auth.uid()
));

create policy "users can join rooms for themselves"
on public.room_members for insert
with check (auth.uid() = user_id);

create policy "messages are visible to room members"
on public.messages for select
using (exists (
  select 1
  from public.room_members rm
  where rm.room_id = messages.room_id
    and rm.user_id = auth.uid()
));

create policy "messages can be sent by room members"
on public.messages for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.room_members rm
    where rm.room_id = messages.room_id
      and rm.user_id = auth.uid()
  )
);

create policy "connections visible to involved users"
on public.connections for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "connections insert by sender"
on public.connections for insert
with check (auth.uid() = sender_id);

create policy "connections update by involved users"
on public.connections for update
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "notifications visible to recipient"
on public.notifications for select
using (auth.uid() = user_id);

create policy "notifications update by recipient"
on public.notifications for update
using (auth.uid() = user_id);

create policy "watch parties visible to room participants"
on public.watch_parties for select
using (
  exists (
    select 1
    from public.room_members rm
    where rm.room_id = watch_parties.room_id
      and rm.user_id = auth.uid()
  )
);

create policy "watch parties inserted by host"
on public.watch_parties for insert
with check (auth.uid() = host_id);

create policy "watch party invites visible to invitee or host"
on public.watch_party_invites for select
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.watch_parties wp
    where wp.id = watch_party_invites.watch_party_id
      and wp.host_id = auth.uid()
  )
);

create policy "watch party invites insert by host"
on public.watch_party_invites for insert
with check (
  exists (
    select 1
    from public.watch_parties wp
    where wp.id = watch_party_invites.watch_party_id
      and wp.host_id = auth.uid()
  )
);

create policy "predictions visible to everyone"
on public.predictions for select
using (true);

create policy "users insert their own predictions"
on public.predictions for insert
with check (auth.uid() = user_id);
