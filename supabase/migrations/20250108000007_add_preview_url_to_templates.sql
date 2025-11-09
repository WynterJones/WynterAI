-- Add preview_url to templates table
ALTER TABLE public.templates ADD COLUMN IF NOT EXISTS preview_url TEXT;
