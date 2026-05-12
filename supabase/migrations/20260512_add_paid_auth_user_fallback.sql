-- ============================================================
-- Add controlled fallback for paid email/password Auth users
-- ============================================================
-- Why:
-- In production, Supabase Auth admin createUser can return
-- "Database error creating new user" for paid direct-link callbacks.
-- This service-role-only function creates the same email/password
-- auth user shape needed by the app, plus identity/profile rows.

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
DECLARE
  v_user_id uuid;
  v_email text;
  v_full_name text;
BEGIN
  v_email := lower(nullif(trim(p_email), ''));
  v_full_name := nullif(trim(coalesce(p_full_name, '')), '');

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'email is required';
  END IF;

  IF nullif(p_password, '') IS NULL THEN
    RAISE EXCEPTION 'password is required';
  END IF;

  SELECT id
  INTO v_user_id
  FROM auth.users
  WHERE lower(email::text) = v_email
    AND deleted_at IS NULL
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    RETURN v_user_id;
  END IF;

  v_user_id := extensions.gen_random_uuid();

  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    is_sso_user,
    is_anonymous
  ) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid,
    v_user_id,
    'authenticated',
    'authenticated',
    v_email,
    extensions.crypt(p_password, extensions.gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    jsonb_build_object(
      'full_name', coalesce(v_full_name, ''),
      'name', coalesce(v_full_name, ''),
      'email_verified', true
    ),
    now(),
    now(),
    false,
    false
  );

  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    extensions.gen_random_uuid(),
    v_user_id,
    v_user_id::text,
    jsonb_build_object(
      'sub', v_user_id::text,
      'email', v_email,
      'email_verified', false,
      'phone_verified', false
    ),
    'email',
    now(),
    now(),
    now()
  );

  INSERT INTO public.profiles (
    id,
    email,
    name,
    full_name,
    username,
    subscription_type,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_email,
    coalesce(v_full_name, split_part(v_email, '@', 1)),
    coalesce(v_full_name, split_part(v_email, '@', 1)),
    'user_' || substring(v_user_id::text, 1, 8),
    'free',
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE
  SET email = excluded.email,
      name = coalesce(public.profiles.name, excluded.name),
      full_name = coalesce(public.profiles.full_name, excluded.full_name),
      updated_at = now();

  RETURN v_user_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.create_paid_auth_user(text, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.create_paid_auth_user(text, text, text) FROM anon;
REVOKE ALL ON FUNCTION public.create_paid_auth_user(text, text, text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.create_paid_auth_user(text, text, text) TO service_role;

CREATE OR REPLACE FUNCTION public.find_paid_auth_user_by_email(p_email text)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT id
  FROM auth.users
  WHERE lower(email::text) = lower(nullif(trim(p_email), ''))
    AND deleted_at IS NULL
  LIMIT 1;
$function$;

REVOKE ALL ON FUNCTION public.find_paid_auth_user_by_email(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.find_paid_auth_user_by_email(text) FROM anon;
REVOKE ALL ON FUNCTION public.find_paid_auth_user_by_email(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.find_paid_auth_user_by_email(text) TO service_role;
