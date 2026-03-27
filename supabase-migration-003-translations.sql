-- SphereAI Migration 003: Add translations support
-- Run this in the Supabase SQL Editor

-- 1. Add available_languages column to projects
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS available_languages text[] DEFAULT '{}';

-- 2. Create project_translations table
CREATE TABLE IF NOT EXISTS public.project_translations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  language text NOT NULL,
  page_type text NOT NULL,
  content jsonb NOT NULL,
  title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, language, page_type)
);

-- 3. Enable RLS
ALTER TABLE public.project_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own translations"
  ON public.project_translations
  FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Public read access for translations"
  ON public.project_translations
  FOR SELECT
  USING (true);
