-- ============================================================
-- Repair legacy Supabase Auth users with NULL metadata
-- ============================================================
-- Why:
-- Supabase Auth Admin API listUsers can fail when legacy rows have
-- NULL raw_app_meta_data or raw_user_meta_data. Auth expects JSON
-- objects; use {} for missing metadata.

UPDATE auth.users
SET raw_app_meta_data = '{}'::jsonb,
    updated_at = now()
WHERE raw_app_meta_data IS NULL;

UPDATE auth.users
SET raw_user_meta_data = '{}'::jsonb,
    updated_at = now()
WHERE raw_user_meta_data IS NULL;
