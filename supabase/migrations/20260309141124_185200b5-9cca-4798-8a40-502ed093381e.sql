
-- Fix family_groups SELECT policy: fm.group_id = fm.id was wrong
DROP POLICY IF EXISTS "Members can view their family group" ON public.family_groups;
CREATE POLICY "Members can view their family group"
  ON public.family_groups FOR SELECT
  TO public
  USING (EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.group_id = family_groups.id AND fm.user_id = auth.uid()
  ));

-- Allow family members to view each other's profiles (needed for member list)
CREATE POLICY "Family members can view each others profiles"
  ON public.profiles FOR SELECT
  TO public
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.family_members fm1
      JOIN public.family_members fm2 ON fm1.group_id = fm2.group_id
      WHERE fm1.user_id = auth.uid() AND fm2.user_id = profiles.user_id
    )
  );

-- Drop the old restrictive profile SELECT policy since the new one covers it
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
