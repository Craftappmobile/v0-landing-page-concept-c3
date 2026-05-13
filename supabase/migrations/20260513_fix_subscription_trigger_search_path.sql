-- ============================================================
-- Fix subscription trigger search_path during Auth createUser
-- ============================================================
-- Context:
-- public.claim_orphan_hutko_subscriptions_for_profile() runs during the
-- auth.users -> public.profiles trigger chain. For paid Hutko users it updates
-- public.subscriptions, which fires subscription triggers. Several of those
-- trigger functions used search_path='' and two also executed SET search_path=''
-- inside the function body. This leaked into GoTrue's surrounding transaction
-- and caused the next unqualified Auth insert, INSERT INTO "identities", to
-- fail with SQLSTATE 42P01.

ALTER FUNCTION public.link_hutko_subscription_user_id()
  SET search_path TO auth;

CREATE OR REPLACE FUNCTION public.update_profile_on_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO auth
AS $function$
BEGIN
  IF NEW.status = 'active' THEN
    UPDATE public.profiles
    SET subscription_type = NEW.plan_type,
        subscription_expires_at = NEW.expires_at
    WHERE id = NEW.user_id;
  ELSIF NEW.status IN ('expired', 'cancelled') THEN
    UPDATE public.profiles
    SET subscription_type = 'free',
        subscription_expires_at = NULL
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO auth
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;
