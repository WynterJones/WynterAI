-- Add 'admin' tier to profiles table
-- First, drop the existing constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_tier_check;

-- Add the new constraint with 'admin' tier
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_tier_check
  CHECK (tier IN ('free', 'paid', 'admin'));

-- Create admin policies for profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tier = 'admin'
    )
  );

-- Create admin policies for projects
CREATE POLICY "Admins can view all projects"
  ON public.projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tier = 'admin'
    )
  );

-- Create admin policies for chats
CREATE POLICY "Admins can view all chats"
  ON public.chats FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND tier = 'admin'
    )
  );
