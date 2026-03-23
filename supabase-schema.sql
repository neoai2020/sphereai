-- SphereAI Database Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Projects table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  product_name text not null,
  product_description text not null,
  product_url text,
  keywords text[] default '{}',
  target_audience text not null default '',
  status text not null default 'draft' check (status in ('draft', 'generating', 'published', 'error')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.projects enable row level security;

create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Pages table
create table if not exists public.pages (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  page_type text not null check (page_type in ('landing', 'about', 'faq', 'blog', 'reviews')),
  title text not null default '',
  meta_description text not null default '',
  content jsonb not null default '{}',
  schema_markup jsonb not null default '{}',
  slug text not null default '',
  is_published boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.pages enable row level security;

create policy "Users can view own pages"
  on public.pages for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = pages.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can create pages for own projects"
  on public.pages for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = pages.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Users can update own pages"
  on public.pages for update
  using (
    exists (
      select 1 from public.projects
      where projects.id = pages.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Public read access for published pages (for visitors)
create policy "Anyone can view published pages"
  on public.pages for select
  using (is_published = true);

-- Public read access for published projects (to resolve slugs)
create policy "Anyone can view published projects"
  on public.projects for select
  using (status = 'published');

-- Indexes
create index if not exists idx_projects_user_id on public.projects(user_id);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_pages_project_id on public.pages(project_id);
create index if not exists idx_pages_slug on public.pages(slug);

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.update_updated_at();

create trigger pages_updated_at
  before update on public.pages
  for each row execute procedure public.update_updated_at();
