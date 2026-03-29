-- SphereAI Migration 002 — Automation Machine state (server-side, per user)
-- Run in Supabase SQL Editor after Migration 001.

CREATE TABLE IF NOT EXISTS public.user_automation_state (
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  completed_source_ids text[] NOT NULL DEFAULT '{}',
  selected_project_id text NOT NULL DEFAULT '',
  promo_link_manual text NOT NULL DEFAULT '',
  search_query text NOT NULL DEFAULT '',
  selected_category text NOT NULL DEFAULT 'all',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_automation_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own automation state" ON public.user_automation_state;
CREATE POLICY "Users can view own automation state"
  ON public.user_automation_state FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own automation state" ON public.user_automation_state;
CREATE POLICY "Users can insert own automation state"
  ON public.user_automation_state FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own automation state" ON public.user_automation_state;
CREATE POLICY "Users can update own automation state"
  ON public.user_automation_state FOR UPDATE
  USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS user_automation_state_updated_at ON public.user_automation_state;
CREATE TRIGGER user_automation_state_updated_at
  BEFORE UPDATE ON public.user_automation_state
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at();
