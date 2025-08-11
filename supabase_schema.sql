
-- 创建文章表
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  language text default 'zh',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 创建用户表（可扩展）
create table profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  avatar_url text,
  updated_at timestamp with time zone default now(),
  primary key (id)
);

-- 启用行级安全
alter table posts enable row level security;
alter table profiles enable row level security;

-- 简单权限策略
create policy "Allow logged in users to read posts" on posts
for select using (true);

create policy "Allow logged in users to insert their posts" on posts
for insert with check (auth.role() = 'authenticated');

create policy "Allow logged in users to update their posts" on posts
for update using (auth.role() = 'authenticated');
