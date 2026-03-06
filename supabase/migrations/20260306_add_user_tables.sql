-- User bookmarks: save papers for later
create table if not exists user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paper_id uuid not null references papers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, paper_id)
);

-- User custom topics: synced across devices
create table if not exists user_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  created_at timestamptz not null default now(),
  unique(user_id, topic)
);

-- User read papers: track which papers have been opened
create table if not exists user_read_papers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  paper_id uuid not null references papers(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique(user_id, paper_id)
);

-- Indexes for fast lookup
create index if not exists idx_user_bookmarks_user_id on user_bookmarks(user_id);
create index if not exists idx_user_topics_user_id on user_topics(user_id);
create index if not exists idx_user_read_papers_user_id on user_read_papers(user_id);

-- RLS policies: users can only access their own data
alter table user_bookmarks enable row level security;
alter table user_topics enable row level security;
alter table user_read_papers enable row level security;

-- user_bookmarks policies
create policy "Users can read own bookmarks"
  on user_bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on user_bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on user_bookmarks for delete
  using (auth.uid() = user_id);

-- user_topics policies
create policy "Users can read own topics"
  on user_topics for select
  using (auth.uid() = user_id);

create policy "Users can insert own topics"
  on user_topics for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own topics"
  on user_topics for delete
  using (auth.uid() = user_id);

-- user_read_papers policies
create policy "Users can read own read papers"
  on user_read_papers for select
  using (auth.uid() = user_id);

create policy "Users can insert own read papers"
  on user_read_papers for insert
  with check (auth.uid() = user_id);
