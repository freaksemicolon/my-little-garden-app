-- Avoid recursive RLS evaluation by using SECURITY DEFINER helper
CREATE OR REPLACE FUNCTION public.is_family_member(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.family_members
    WHERE group_id = p_group_id
      AND user_id = p_user_id
  );
$$;

DROP POLICY IF EXISTS "Members can view their family group" ON public.family_groups;
CREATE POLICY "Members can view their family group"
  ON public.family_groups
  FOR SELECT
  TO authenticated
  USING (public.is_family_member(id, auth.uid()));

DROP POLICY IF EXISTS "Members can view group members" ON public.family_members;
CREATE POLICY "Members can view group members"
  ON public.family_members
  FOR SELECT
  TO authenticated
  USING (public.is_family_member(group_id, auth.uid()));