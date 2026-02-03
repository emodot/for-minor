-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  created_at timestamp default now(),
  primary key (id)
);

-- Memories table
create table memories (
  id uuid primary key default gen_random_uuid(),
  type text check (type in ('photo','voice','letter')),
  title text,
  content text,
  file_url text,
  created_at timestamp default now()
);

-- Open When Messages table
create table open_when (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  unlock_date date,
  created_at timestamp default now()
);

-- Storage buckets (create these in Supabase Dashboard > Storage)
-- Bucket: photos (private)
-- Bucket: voice-notes (private)
