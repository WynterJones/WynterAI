-- Add v0_project_id column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS v0_project_id TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_v0_project_id ON public.projects(v0_project_id);
