-- ============================================================
-- Add moderated blog comments
-- ============================================================
-- Public readers can see only approved comments. New user comments
-- are created through the trusted Next.js API route as pending and
-- require manual moderation before appearing on article pages.

CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  author_name text NOT NULL CHECK (char_length(author_name) BETWEEN 2 AND 60),
  body text NOT NULL CHECK (char_length(body) BETWEEN 10 AND 1200),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  source text NOT NULL DEFAULT 'user' CHECK (source IN ('user', 'editorial')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  moderation_note text
);

CREATE INDEX IF NOT EXISTS blog_comments_slug_status_created_idx
  ON public.blog_comments (slug, status, created_at DESC);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved blog comments are publicly readable" ON public.blog_comments;
CREATE POLICY "Approved blog comments are publicly readable"
ON public.blog_comments
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

GRANT SELECT ON public.blog_comments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_comments TO service_role;