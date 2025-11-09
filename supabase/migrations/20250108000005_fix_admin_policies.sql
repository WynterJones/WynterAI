-- Drop the conflicting admin policies that query profiles within profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all chats" ON public.chats;

-- Update existing policies to include admin access
-- For profiles, combine user and admin access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users and admins can view profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR
    (SELECT tier FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- For projects
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users and admins can view projects"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = user_id OR
    (SELECT tier FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );

-- For chats
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
CREATE POLICY "Users and admins can view chats"
  ON public.chats FOR SELECT
  USING (
    auth.uid() = user_id OR
    (SELECT tier FROM public.profiles WHERE id = auth.uid()) = 'admin'
  );
