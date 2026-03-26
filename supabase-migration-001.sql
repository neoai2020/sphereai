-- SphereAI Migration 001
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Add project_type to projects table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_type') THEN
    ALTER TABLE public.projects ADD COLUMN project_type text NOT NULL DEFAULT 'service';
    ALTER TABLE public.projects ADD CONSTRAINT projects_project_type_check CHECK (project_type IN ('affiliate', 'service'));
  END IF;
END $$;

-- 2. Create generations table for tracking daily limits
CREATE TABLE IF NOT EXISTS public.generations (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own generations" ON public.generations;
DROP POLICY IF EXISTS "Users can create own generations" ON public.generations;

CREATE POLICY "Users can view own generations"
  ON public.generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own generations"
  ON public.generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Create forum_replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  forum_url text,
  forum_topic text NOT NULL,
  generated_reply text NOT NULL,
  website_link text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own forum replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can create own forum replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Users can delete own forum replies" ON public.forum_replies;

CREATE POLICY "Users can view own forum replies"
  ON public.forum_replies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own forum replies"
  ON public.forum_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own forum replies"
  ON public.forum_replies FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Add unique constraint to pages table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pages_project_id_page_type_key') THEN
    ALTER TABLE public.pages ADD CONSTRAINT pages_project_id_page_type_key UNIQUE (project_id, page_type);
  END IF;
END $$;

-- 5. Update Project RLS for Public Access
DROP POLICY IF EXISTS "Anyone can view projects publicly" ON public.projects;
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
CREATE POLICY "Anyone can view projects publicly"
  ON public.projects FOR SELECT
  USING (true);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON public.generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON public.generations(created_at);
CREATE INDEX IF NOT EXISTS idx_forum_replies_user_id ON public.forum_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_project_id ON public.forum_replies(project_id);

-- 7. Subscriptions table (Separated Permissions)
-- Drop to ensure columns match exactly
DROP TABLE IF EXISTS public.access_tokens CASCADE;
DROP TABLE IF EXISTS public.user_subscriptions CASCADE;

CREATE TABLE public.user_subscriptions (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  has_10x boolean DEFAULT false,
  has_automation boolean DEFAULT false,
  has_infinite boolean DEFAULT false,
  has_dfy boolean DEFAULT false,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.user_subscriptions;
CREATE POLICY "Users can view own subscription" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- 8. Access Tokens (Feature-Specific System)
CREATE TABLE public.access_tokens (
  id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  feature text NOT NULL CHECK (feature IN ('10x', 'automation', 'infinite', 'dfy')),
  is_used boolean DEFAULT false,
  used_by_email text,
  used_by_user_id uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.access_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can check tokens" ON public.access_tokens;
CREATE POLICY "Public can check tokens" ON public.access_tokens FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public can update tokens" ON public.access_tokens;
CREATE POLICY "Public can update tokens" ON public.access_tokens FOR UPDATE USING (true);

-- 9. Sample Tokens for testing
INSERT INTO public.access_tokens (code, feature) VALUES 
('10X-MODE-999', '10x'),
('AUTO-TRAFFIC-888', 'automation'),
('INF-POWER-777', 'infinite'),
('DFY-LIB-666', 'dfy')
ON CONFLICT (code) DO NOTHING;
