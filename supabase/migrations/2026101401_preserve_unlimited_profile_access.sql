-- Recompute access from all subscriptions, never just the row being changed.
-- No backfill: only profiles affected by subsequent subscription writes change.
-- Security guidance: https://supabase.com/docs/guides/database/functions
CREATE OR REPLACE FUNCTION public.recalculate_profile_subscription_access(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_subscription_type public.profiles.subscription_type%TYPE;
  v_expires_at public.profiles.subscription_expires_at%TYPE;
BEGIN
  -- Separate statements are intentional: under READ COMMITTED the selection
  -- gets a fresh snapshot after any previous writer releases this profile lock.
  PERFORM p.id FROM public.profiles AS p
  WHERE p.id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT candidate.plan_type, candidate.expires_at
  INTO v_subscription_type, v_expires_at
  FROM (
    SELECT s.id, s.status, s.expires_at, s.started_at,
           COALESCE(NULLIF(s.plan_type::text, ''), NULLIF(s.plan, '')) AS plan_type
    FROM public.subscriptions AS s
    WHERE s.user_id = p_user_id
      AND s.status IN ('active', 'cancelled', 'failed')
  ) AS candidate
  WHERE candidate.plan_type IS NOT NULL
    AND candidate.plan_type <> 'free'
    AND (
      candidate.expires_at > pg_catalog.now()
      OR (
        candidate.expires_at IS NULL
        AND candidate.status = 'active'
        AND candidate.plan_type IN ('lifetime', 'forever')
      )
    )
  ORDER BY
    CASE WHEN candidate.plan_type IN ('lifetime', 'forever') THEN 0 ELSE 1 END,
    candidate.expires_at DESC NULLS FIRST,
    candidate.started_at DESC NULLS LAST,
    candidate.id DESC
  LIMIT 1;

  -- NULL is not evidence of paid time for a timed/cancelled/failed row.
  -- The expiration sweep's three-day grace delays status housekeeping, not
  -- expires_at: elapsed rows do not become valid merely by retaining 'active'.
  IF NOT FOUND THEN
    v_subscription_type := 'free';
    v_expires_at := NULL;
  END IF;

  UPDATE public.profiles AS p
  SET subscription_type = v_subscription_type,
      subscription_expires_at = v_expires_at
  WHERE p.id = p_user_id
    AND (p.subscription_type, p.subscription_expires_at)
        IS DISTINCT FROM (v_subscription_type, v_expires_at);
END;
$function$;

REVOKE ALL ON FUNCTION public.recalculate_profile_subscription_access(uuid)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.recalculate_profile_subscription_access(uuid)
  TO service_role;

CREATE OR REPLACE FUNCTION public.update_profile_on_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_old_user_id uuid;
  v_new_user_id uuid;
  v_user_id uuid;
BEGIN
  IF TG_OP IN ('UPDATE', 'DELETE') THEN
    v_old_user_id := OLD.user_id;
  END IF;
  IF TG_OP IN ('INSERT', 'UPDATE') THEN
    v_new_user_id := NEW.user_id;
  END IF;

  -- Recalculate both sides of a relink; stable ordering also orders row locks.
  FOR v_user_id IN
    SELECT DISTINCT affected.user_id
    FROM pg_catalog.unnest(ARRAY[v_old_user_id, v_new_user_id]) AS affected(user_id)
    WHERE affected.user_id IS NOT NULL
    ORDER BY affected.user_id
  LOOP
    PERFORM public.recalculate_profile_subscription_access(v_user_id);
  END LOOP;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$function$;

-- Trigger-only entry point: clients need no RPC EXECUTE privilege for triggers.
-- Function-level SET above restores the caller's search_path on return; never
-- issue SET/SET LOCAL/set_config inside the Auth -> profile -> subscription chain.
REVOKE ALL ON FUNCTION public.update_profile_on_subscription_change()
  FROM PUBLIC, anon, authenticated, service_role;

DROP TRIGGER IF EXISTS update_profile_on_subscription_change_trigger
  ON public.subscriptions;
CREATE TRIGGER update_profile_on_subscription_change_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_on_subscription_change();