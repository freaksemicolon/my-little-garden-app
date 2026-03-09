DROP POLICY IF EXISTS "Members can view their family group" ON public.family_groups;

CREATE POLICY "Members can view their family group"
  ON public.family_groups
  FOR SELECT
  TO authenticated
  USING (
    owner_id = auth.uid()
    OR public.is_family_member(id, auth.uid())
  );