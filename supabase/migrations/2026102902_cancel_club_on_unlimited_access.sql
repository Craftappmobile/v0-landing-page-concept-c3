-- Club package (plan = 'club', plan_type = 'year') is a recurring Hutko
-- subscription like year. When the same account gets active unlimited access
-- (V.I.P. 'forever' / 'lifetime'), queue its schedule for cancellation too,
-- otherwise Hutko keeps charging 2490 грн a year on top of V.I.P.
-- Same body as 2026101402 except 'club' in both recurring plan lists; the
-- trigger itself is unchanged. No data changes.
CREATE OR REPLACE FUNCTION public.queue_cancellations_on_unlimited_access()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_target RECORD;
  v_unlimited_id UUID;
  v_email TEXT;
  v_user_id UUID;
BEGIN
  IF TG_OP = 'UPDATE' AND (NEW.status, NEW.user_id, NEW.email, NEW.plan, NEW.plan_type, NEW.expires_at)
    IS NOT DISTINCT FROM (OLD.status, OLD.user_id, OLD.email, OLD.plan, OLD.plan_type, OLD.expires_at) THEN RETURN NEW; END IF;
  IF NEW.status = 'active' AND (NEW.expires_at IS NULL OR NEW.expires_at > now())
    AND (lower(btrim(COALESCE(NEW.plan, ''))) IN ('forever', 'lifetime')
      OR lower(btrim(COALESCE(NEW.plan_type::TEXT, ''))) IN ('forever', 'lifetime')) THEN
    v_user_id := COALESCE(NEW.user_id, (
      SELECT u.id FROM auth.users AS u WHERE lower(btrim(u.email)) = lower(btrim(NEW.email)) LIMIT 1
    ));
    v_email := CASE WHEN v_user_id IS NULL THEN NEW.email ELSE (
      SELECT u.email FROM auth.users AS u WHERE u.id = v_user_id
    ) END;
    FOR v_target IN
      SELECT s.id, s.user_id, s.email FROM public.subscriptions AS s
      WHERE s.id <> NEW.id AND s.payment_provider = 'hutko'
        AND s.cancellation_state NOT IN ('completed', 'provider_stopped')
        AND (v_user_id IS NOT NULL AND s.user_id = v_user_id
          OR s.user_id IS NULL AND NULLIF(btrim(v_email), '') IS NOT NULL
            AND lower(btrim(s.email)) = lower(btrim(v_email)))
        AND lower(COALESCE(NULLIF(s.plan, ''), s.plan_type::TEXT, '')) IN ('month', 'quarter', 'half', 'year', 'club')
        AND COALESCE(s.order_id, '') NOT LIKE 'recurring\_\_%' ESCAPE '\'
      ORDER BY s.id
    LOOP
      v_unlimited_id := public.find_active_unlimited_subscription(v_target.user_id, v_target.email, now());
      IF v_unlimited_id IS NOT NULL THEN
        PERFORM public.enqueue_subscription_cancellation(v_target.id, v_unlimited_id);
      END IF;
    END LOOP;
  ELSIF NEW.payment_provider = 'hutko'
    AND NEW.cancellation_state NOT IN ('completed', 'provider_stopped')
    AND lower(COALESCE(NULLIF(NEW.plan, ''), NEW.plan_type::TEXT, '')) IN ('month', 'quarter', 'half', 'year', 'club')
    AND COALESCE(NEW.order_id, '') NOT LIKE 'recurring\_\_%' ESCAPE '\' THEN
    v_unlimited_id := public.find_active_unlimited_subscription(NEW.user_id, NEW.email, now());
    IF v_unlimited_id IS NOT NULL THEN
      PERFORM public.enqueue_subscription_cancellation(NEW.id, v_unlimited_id);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.queue_cancellations_on_unlimited_access() FROM PUBLIC, anon, authenticated, service_role;
