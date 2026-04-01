-- ============================================================
-- Canonicalize subscription -> profile sync logic in repo
-- ============================================================
-- Why:
-- The live database contains an up-to-date trigger/function pair that keeps
-- public.profiles in sync with public.subscriptions, but that logic was not
-- represented in the repository as a canonical migration.

CREATE OR REPLACE FUNCTION public.update_profile_on_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  SET search_path = '';

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

DROP TRIGGER IF EXISTS update_profile_on_subscription_change_trigger
ON public.subscriptions;

CREATE TRIGGER update_profile_on_subscription_change_trigger
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_on_subscription_change();