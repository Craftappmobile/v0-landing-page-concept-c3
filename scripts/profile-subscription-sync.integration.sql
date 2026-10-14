-- LOCAL ONLY: run via profile-subscription-sync.test.mts's opt-in test.
-- Requires an empty disposable profile_subscription_sync_test database and a
-- local postgres role able to create fixture roles. Everything is rolled back.
\set ON_ERROR_STOP on
BEGIN;
SET LOCAL statement_timeout = '10s';

DO $guard$
BEGIN
  IF pg_catalog.current_database() <> 'profile_subscription_sync_test'
     OR pg_catalog.inet_server_addr() IS DISTINCT FROM '127.0.0.1'::inet THEN
    RAISE EXCEPTION 'Fixtures require the dedicated local test database';
  END IF;
  IF pg_catalog.to_regclass('public.profiles') IS NOT NULL
     OR pg_catalog.to_regclass('public.subscriptions') IS NOT NULL
     OR pg_catalog.to_regnamespace('auth') IS NOT NULL THEN
    RAISE EXCEPTION 'Fixtures require empty public tables and no auth schema';
  END IF;
END;
$guard$;

DO $roles$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'service_role') THEN
    CREATE ROLE service_role NOLOGIN;
  END IF;
END;
$roles$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  label text UNIQUE NOT NULL,
  subscription_type text NOT NULL DEFAULT 'free',
  subscription_expires_at timestamptz
);
CREATE TABLE public.subscriptions (
  id bigint PRIMARY KEY,
  user_id uuid,
  status text,
  plan_type text,
  plan text,
  expires_at timestamptz,
  started_at timestamptz,
  updated_at timestamptz,
  claim_key text
);
CREATE SCHEMA auth;
CREATE TABLE auth.identities (label text PRIMARY KEY);

CREATE FUNCTION pg_temp.assert_profile(p_label text, p_type text, p_expiry timestamptz)
RETURNS void LANGUAGE plpgsql AS $assert$
DECLARE
  v_profile public.profiles%ROWTYPE;
BEGIN
  SELECT * INTO STRICT v_profile FROM public.profiles WHERE label = p_label;
  IF (v_profile.subscription_type, v_profile.subscription_expires_at)
     IS DISTINCT FROM (p_type, p_expiry) THEN
    RAISE EXCEPTION 'Profile %: expected (%, %), got (%, %)', p_label,
      p_type, p_expiry, v_profile.subscription_type, v_profile.subscription_expires_at;
  END IF;
END;
$assert$;

-- A profile without any subscriptions must not be touched by installation.
INSERT INTO public.profiles (id, label, subscription_type)
VALUES (pg_catalog.md5('fixture-untouched')::uuid, 'untouched', 'lifetime');
\ir ../supabase/migrations/2026101401_preserve_unlimited_profile_access.sql
\ir ../supabase/migrations/2026101401_preserve_unlimited_profile_access.sql
SELECT pg_temp.assert_profile('untouched', 'lifetime', NULL);

-- Temp shadow relations must not affect SECURITY DEFINER name resolution.
CREATE TEMP TABLE profiles (id uuid, subscription_type text);
CREATE TEMP TABLE subscriptions (user_id uuid, plan_type text);

DO $behavior$
DECLARE
  v_a uuid := pg_catalog.md5('fixture-a')::uuid;
  v_b uuid := pg_catalog.md5('fixture-b')::uuid;
  v_far timestamptz := pg_catalog.now() + interval '100 years';
  v_paid timestamptz := pg_catalog.now() + interval '30 days';
  v_unlimited timestamptz := pg_catalog.now() + interval '10 years';
BEGIN
  INSERT INTO public.profiles (id, label) VALUES (v_a, 'a'), (v_b, 'b');
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at)
  VALUES (1, v_a, 'active', 'lifetime', v_unlimited);
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at)
  VALUES (2, v_a, 'active', 'quarter', v_far);
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);

  -- Every status transition on the older/timed row leaves unlimited access.
  -- Reproduce expire-subscriptions: an active row older than its 3-day grace
  -- becomes expired while a separate unlimited subscription remains valid.
  UPDATE public.subscriptions SET expires_at = pg_catalog.now() - interval '4 days' WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);
  UPDATE public.subscriptions SET status = 'expired' WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);
  UPDATE public.subscriptions SET status = 'cancelled', expires_at = v_far WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);
  UPDATE public.subscriptions SET status = 'failed' WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);
  UPDATE public.subscriptions SET updated_at = pg_catalog.now() WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'lifetime', v_unlimited);
  DELETE FROM public.subscriptions WHERE id = 1;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_far);

  -- Both failed and cancelled retain paid time, independently of renewal.
  UPDATE public.subscriptions SET status = 'cancelled', expires_at = v_paid WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_paid);
  UPDATE public.subscriptions SET status = 'failed' WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_paid);
  UPDATE public.subscriptions SET expires_at = pg_catalog.now() WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'free', NULL);
  UPDATE public.subscriptions SET status = 'active', expires_at = pg_catalog.now() - interval '1 day' WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'free', NULL);
  UPDATE public.subscriptions SET expires_at = v_paid WHERE id = 2;

  -- Lifetime and forever share priority; NULL is indefinite only when active.
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at)
  VALUES (3, v_a, 'active', 'forever', v_unlimited), (4, v_a, 'active', 'lifetime', NULL);
  PERFORM pg_temp.assert_profile('a', 'lifetime', NULL);
  UPDATE public.subscriptions SET status = 'cancelled' WHERE id = 4;
  PERFORM pg_temp.assert_profile('a', 'forever', v_unlimited);
  UPDATE public.subscriptions SET status = 'failed' WHERE id = 4;
  PERFORM pg_temp.assert_profile('a', 'forever', v_unlimited);
  UPDATE public.subscriptions SET status = 'cancelled' WHERE id = 3;
  PERFORM pg_temp.assert_profile('a', 'forever', v_unlimited);
  UPDATE public.subscriptions SET status = 'failed' WHERE id = 3;
  PERFORM pg_temp.assert_profile('a', 'forever', v_unlimited);
  UPDATE public.subscriptions SET status = 'expired' WHERE id = 3;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_paid);
  UPDATE public.subscriptions SET status = 'active', expires_at = pg_catalog.now() - interval '1 day' WHERE id = 4;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_paid);
  UPDATE public.subscriptions SET status = 'pending', expires_at = v_far WHERE id = 4;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_paid);
  DELETE FROM public.subscriptions WHERE id IN (3, 4);

  -- Latest expiry wins, then started_at, then id. Metadata does not break ties.
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at, started_at)
  VALUES (5, v_a, 'active', 'year', v_far, pg_catalog.now());
  PERFORM pg_temp.assert_profile('a', 'year', v_far);
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at, started_at)
  VALUES (6, v_a, 'active', 'half', v_far, pg_catalog.now() - interval '1 day');
  PERFORM pg_temp.assert_profile('a', 'year', v_far);
  UPDATE public.subscriptions SET started_at = pg_catalog.now() WHERE id = 6;
  PERFORM pg_temp.assert_profile('a', 'half', v_far);
  UPDATE public.subscriptions SET started_at = NULL WHERE id = 6;
  PERFORM pg_temp.assert_profile('a', 'year', v_far);
  UPDATE public.subscriptions SET started_at = pg_catalog.now() WHERE id = 6;
  PERFORM pg_temp.assert_profile('a', 'half', v_far);
  UPDATE public.subscriptions SET updated_at = pg_catalog.now() + interval '1 day' WHERE id = 5;
  PERFORM pg_temp.assert_profile('a', 'half', v_far);

  -- Relink updates the previous owner and the next owner, then unlink clears b.
  UPDATE public.subscriptions SET user_id = v_b WHERE id = 6;
  PERFORM pg_temp.assert_profile('a', 'year', v_far);
  PERFORM pg_temp.assert_profile('b', 'half', v_far);
  UPDATE public.subscriptions SET user_id = NULL WHERE id = 6;
  PERFORM pg_temp.assert_profile('b', 'free', NULL);
  UPDATE public.subscriptions SET user_id = v_a WHERE id = 6;
  PERFORM pg_temp.assert_profile('a', 'half', v_far);
  DELETE FROM public.subscriptions WHERE id = 6;
  PERFORM pg_temp.assert_profile('a', 'year', v_far);
  DELETE FROM public.subscriptions WHERE id = 5;
  PERFORM pg_temp.assert_profile('a', 'quarter', v_paid);
  DELETE FROM public.subscriptions WHERE id = 2;
  PERFORM pg_temp.assert_profile('a', 'free', NULL);

  -- Unknown/invalid rows must not manufacture an unlimited entitlement.
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at)
  VALUES (7, v_a, 'active', 'year', NULL), (8, v_a, 'pending', 'forever', v_far),
         (9, v_a, 'expired', 'lifetime', v_far), (10, v_a, 'active', NULL, v_far),
         (11, v_a, 'active', 'free', v_far), (12, v_a, NULL, 'forever', v_far);
  PERFORM pg_temp.assert_profile('a', 'free', NULL);
  UPDATE public.subscriptions SET status = 'cancelled' WHERE id = 7;
  PERFORM pg_temp.assert_profile('a', 'free', NULL);
  UPDATE public.subscriptions SET status = 'failed' WHERE id = 7;
  PERFORM pg_temp.assert_profile('a', 'free', NULL);
  -- Legacy web row can use plan only when plan_type is absent.
  UPDATE public.subscriptions SET plan = 'forever' WHERE id = 10;
  PERFORM pg_temp.assert_profile('a', 'forever', v_far);
  UPDATE public.subscriptions SET plan_type = 'year', expires_at = v_paid WHERE id = 10;
  PERFORM pg_temp.assert_profile('a', 'year', v_paid);
  DELETE FROM public.subscriptions WHERE user_id = v_a;
  PERFORM pg_temp.assert_profile('a', 'free', NULL);

  -- Orphan changes / missing profiles are safe, including deleting such a row.
  INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at)
  VALUES (13, NULL, 'active', 'forever', v_far);
  UPDATE public.subscriptions SET user_id = pg_catalog.md5('fixture-missing')::uuid WHERE id = 13;
  DELETE FROM public.subscriptions WHERE id = 13;
END;
$behavior$;

-- Reproduce Auth -> profile -> subscription linking, then unqualified Auth SQL.
CREATE FUNCTION public.fixture_claim_subscription() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO auth AS $claim$
BEGIN
  UPDATE public.subscriptions SET user_id = NEW.id WHERE claim_key = NEW.label;
  RETURN NEW;
END;
$claim$;
CREATE TRIGGER fixture_claim AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.fixture_claim_subscription();
INSERT INTO public.subscriptions (id, status, plan_type, expires_at, claim_key)
VALUES (14, 'active', 'forever', pg_catalog.now() + interval '100 years', 'auth-chain');
SET LOCAL search_path TO auth;
INSERT INTO public.profiles (id, label) VALUES (pg_catalog.md5('fixture-auth')::uuid, 'auth-chain');
INSERT INTO identities (label) VALUES ('unqualified-auth-insert');
DO $path$
BEGIN
  IF pg_catalog.current_setting('search_path') <> 'auth' THEN
    RAISE EXCEPTION 'Subscription sync leaked its function search_path';
  END IF;
END;
$path$;
SELECT pg_temp.assert_profile('auth-chain', 'forever', pg_catalog.now() + interval '100 years');
SET LOCAL search_path TO public;

-- Deny direct profile writes with RLS while permitting a subscription mutation.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
CREATE POLICY fixture_subscription_mutation ON public.subscriptions
FOR ALL TO authenticated USING (true) WITH CHECK (true);

SET LOCAL ROLE authenticated;
DO $permissions$
BEGIN
  BEGIN
    PERFORM public.recalculate_profile_subscription_access(pg_catalog.md5('fixture-a')::uuid);
    RAISE EXCEPTION 'authenticated was allowed to execute helper RPC';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  UPDATE public.profiles SET subscription_type = 'lifetime'
  WHERE id = pg_catalog.md5('fixture-a')::uuid;
  IF FOUND THEN
    RAISE EXCEPTION 'Profile RLS unexpectedly allowed a direct write';
  END IF;
END;
$permissions$;
INSERT INTO public.subscriptions (id, user_id, status, plan_type, expires_at)
VALUES (15, pg_catalog.md5('fixture-a')::uuid, 'active', 'year', pg_catalog.now() + interval '1 year');
RESET ROLE;
SELECT pg_temp.assert_profile('a', 'year', pg_catalog.now() + interval '1 year');
SET LOCAL ROLE service_role;
SELECT public.recalculate_profile_subscription_access(pg_catalog.md5('fixture-a')::uuid);
RESET ROLE;

DO $acl$
DECLARE
  v_signature text;
BEGIN
  FOREACH v_signature IN ARRAY ARRAY[
    'public.recalculate_profile_subscription_access(uuid)',
    'public.update_profile_on_subscription_change()'
  ] LOOP
    IF pg_catalog.has_function_privilege('anon', v_signature, 'EXECUTE')
       OR pg_catalog.has_function_privilege('authenticated', v_signature, 'EXECUTE') THEN
      RAISE EXCEPTION 'Client RPC privilege remains on %', v_signature;
    END IF;
    IF EXISTS (
      SELECT FROM pg_catalog.pg_proc AS p,
      LATERAL pg_catalog.aclexplode(p.proacl) AS acl
      WHERE p.oid = v_signature::regprocedure AND acl.grantee = 0
        AND acl.privilege_type = 'EXECUTE'
    ) THEN
      RAISE EXCEPTION 'PUBLIC RPC privilege remains on %', v_signature;
    END IF;
  END LOOP;
  IF NOT pg_catalog.has_function_privilege('service_role',
     'public.recalculate_profile_subscription_access(uuid)', 'EXECUTE') THEN
    RAISE EXCEPTION 'service_role cannot invoke the controlled helper';
  END IF;
  IF EXISTS (SELECT FROM pg_temp.profiles) OR EXISTS (SELECT FROM pg_temp.subscriptions) THEN
    RAISE EXCEPTION 'Sync unexpectedly touched shadow tables';
  END IF;
END;
$acl$;
SELECT pg_temp.assert_profile('untouched', 'lifetime', NULL);
ROLLBACK;