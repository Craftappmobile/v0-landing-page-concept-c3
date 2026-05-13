-- ============================================================
-- Deprecate direct SQL fallback for paid Auth users
-- ============================================================
-- Why:
-- Supabase Auth users must be created via GoTrue/Auth Admin API.
-- Direct INSERTs into auth.users can miss internal non-null defaults,
-- audit log behavior, and future Auth-managed fields.

CREATE OR REPLACE FUNCTION public.create_paid_auth_user(
  p_email text,
  p_password text,
  p_full_name text DEFAULT ''
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RAISE EXCEPTION
    'create_paid_auth_user is deprecated; use Supabase Auth Admin API createUser instead';
END;
$function$;

REVOKE ALL ON FUNCTION public.create_paid_auth_user(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_paid_auth_user(text, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.create_paid_auth_user(text, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_paid_auth_user(text, text, text) TO service_role;