-- Site Forge: enforce max 5 full-site generations per user per rolling 24 hours (UTC), atomically.
-- Run in Supabase SQL Editor after previous migrations.

CREATE OR REPLACE FUNCTION public.insert_generation_if_allowed(p_user_id uuid, p_project_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
  cnt int;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(p_user_id::text));

  SELECT COUNT(*)::int INTO cnt
  FROM public.generations
  WHERE user_id = p_user_id
    AND created_at >= (timezone('utc', now()) - interval '24 hours');

  IF cnt >= 5 THEN
    RETURN NULL;
  END IF;

  INSERT INTO public.generations (user_id, project_id)
  VALUES (p_user_id, p_project_id)
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.insert_generation_if_allowed(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.insert_generation_if_allowed(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.insert_generation_if_allowed(uuid, uuid) TO service_role;
