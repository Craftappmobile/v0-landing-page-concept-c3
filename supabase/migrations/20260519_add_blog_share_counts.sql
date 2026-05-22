-- ============================================================
-- Add real blog share click counters
-- ============================================================
-- Public visitors can read counters. Writes happen through the
-- trusted Next.js API route using the service-role client and this
-- atomic RPC function.

CREATE TABLE IF NOT EXISTS public.blog_share_counts (
  slug text PRIMARY KEY,
  telegram_count integer NOT NULL DEFAULT 0 CHECK (telegram_count >= 0),
  facebook_count integer NOT NULL DEFAULT 0 CHECK (facebook_count >= 0),
  viber_count integer NOT NULL DEFAULT 0 CHECK (viber_count >= 0),
  whatsapp_count integer NOT NULL DEFAULT 0 CHECK (whatsapp_count >= 0),
  pinterest_count integer NOT NULL DEFAULT 0 CHECK (pinterest_count >= 0),
  instagram_count integer NOT NULL DEFAULT 0 CHECK (instagram_count >= 0),
  copy_count integer NOT NULL DEFAULT 0 CHECK (copy_count >= 0),
  total_count integer NOT NULL DEFAULT 0 CHECK (total_count >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_share_counts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Blog share counts are publicly readable" ON public.blog_share_counts;
CREATE POLICY "Blog share counts are publicly readable"
ON public.blog_share_counts
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.increment_blog_share_count(
  p_slug text,
  p_platform text
)
RETURNS public.blog_share_counts
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_slug text := btrim(p_slug);
  v_platform text := lower(btrim(p_platform));
  v_result public.blog_share_counts;
BEGIN
  IF v_slug IS NULL OR v_slug = '' THEN
    RAISE EXCEPTION 'slug is required';
  END IF;

  IF v_platform NOT IN ('telegram', 'facebook', 'viber', 'whatsapp', 'pinterest', 'instagram', 'copy') THEN
    RAISE EXCEPTION 'unsupported share platform: %', p_platform;
  END IF;

  INSERT INTO public.blog_share_counts (slug)
  VALUES (v_slug)
  ON CONFLICT (slug) DO NOTHING;

  UPDATE public.blog_share_counts
  SET telegram_count = telegram_count + CASE WHEN v_platform = 'telegram' THEN 1 ELSE 0 END,
      facebook_count = facebook_count + CASE WHEN v_platform = 'facebook' THEN 1 ELSE 0 END,
      viber_count = viber_count + CASE WHEN v_platform = 'viber' THEN 1 ELSE 0 END,
      whatsapp_count = whatsapp_count + CASE WHEN v_platform = 'whatsapp' THEN 1 ELSE 0 END,
      pinterest_count = pinterest_count + CASE WHEN v_platform = 'pinterest' THEN 1 ELSE 0 END,
      instagram_count = instagram_count + CASE WHEN v_platform = 'instagram' THEN 1 ELSE 0 END,
      copy_count = copy_count + CASE WHEN v_platform = 'copy' THEN 1 ELSE 0 END,
      total_count = total_count + 1,
      updated_at = now()
  WHERE slug = v_slug
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$function$;

REVOKE ALL ON FUNCTION public.increment_blog_share_count(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_blog_share_count(text, text) FROM anon;
REVOKE ALL ON FUNCTION public.increment_blog_share_count(text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_blog_share_count(text, text) TO service_role;