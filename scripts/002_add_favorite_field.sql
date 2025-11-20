-- Add is_favorite field to snippets table
ALTER TABLE public.snippets
ADD COLUMN IF NOT EXISTS is_favorite boolean DEFAULT FALSE;

-- Create index for faster favorite queries
CREATE INDEX IF NOT EXISTS idx_snippets_favorite ON public.snippets(user_id, is_favorite) WHERE is_favorite = TRUE;





