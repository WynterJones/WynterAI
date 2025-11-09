-- Add credits and usage tracking to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS available_credit DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_usage DECIMAL(10, 2) DEFAULT 0.00;

-- Create usage_history table
CREATE TABLE IF NOT EXISTS public.usage_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  chat_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_usage_history_user_id ON public.usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_history_created_at ON public.usage_history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.usage_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage history
CREATE POLICY "Users can view their own usage history"
  ON public.usage_history FOR SELECT
  USING (auth.uid() = user_id);

-- Only admins can insert usage records (or via service role)
CREATE POLICY "Service can insert usage records"
  ON public.usage_history FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role');
