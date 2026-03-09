
-- Fix family_groups policies: recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can create family groups" ON public.family_groups;
CREATE POLICY "Users can create family groups"
  ON public.family_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Members can view their family group" ON public.family_groups;
CREATE POLICY "Members can view their family group"
  ON public.family_groups FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.group_id = family_groups.id AND fm.user_id = auth.uid()
  ));

-- Fix family_members policies: recreate as PERMISSIVE
DROP POLICY IF EXISTS "Users can join groups" ON public.family_members;
CREATE POLICY "Users can join groups"
  ON public.family_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Members can view group members" ON public.family_members;
CREATE POLICY "Members can view group members"
  ON public.family_members FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.family_members fm
    WHERE fm.group_id = family_members.group_id AND fm.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Owners can remove members" ON public.family_members;
CREATE POLICY "Owners can remove members"
  ON public.family_members FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.family_groups fg
    WHERE fg.id = family_members.group_id AND fg.owner_id = auth.uid()
  ));

-- Fix profiles policies: recreate as PERMISSIVE
DROP POLICY IF EXISTS "Family members can view each others profiles" ON public.profiles;
CREATE POLICY "Users can view profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.family_members fm1
      JOIN public.family_members fm2 ON fm1.group_id = fm2.group_id
      WHERE fm1.user_id = auth.uid() AND fm2.user_id = profiles.user_id
    )
  );

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
