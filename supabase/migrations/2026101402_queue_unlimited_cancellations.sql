-- Durable cancellation intent for confirmed unlimited access, not pending checkout.
-- No historical data repair or provider operations run when applying this migration.
CREATE TABLE public.subscription_cancellation_jobs (
  subscription_id UUID PRIMARY KEY REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  unlimited_subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  request_id UUID NOT NULL DEFAULT gen_random_uuid(),
  state TEXT NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'processing', 'completed', 'needs_review')),
  revision BIGINT NOT NULL DEFAULT 1,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_until TIMESTAMPTZ,
  claim_token UUID,
  last_error_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX subscription_cancellation_jobs_due_idx
  ON public.subscription_cancellation_jobs(next_attempt_at) WHERE state IN ('pending', 'processing');
ALTER TABLE public.subscription_cancellation_jobs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.subscription_cancellation_jobs FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.subscription_cancellation_jobs TO service_role;

CREATE FUNCTION public.find_active_unlimited_subscription(
  p_user_id UUID, p_email TEXT, p_now TIMESTAMPTZ DEFAULT now()
) RETURNS UUID LANGUAGE sql VOLATILE SECURITY DEFINER SET search_path = '' AS $$
  -- VOLATILE is required: AFTER triggers must see this statement's new lifetime row.
  WITH account AS (
    SELECT COALESCE(p_user_id, (
      SELECT u.id FROM auth.users AS u
      WHERE lower(btrim(u.email)) = lower(btrim(p_email)) LIMIT 1
    )) AS id
  ), identity AS (
    SELECT a.id, CASE WHEN a.id IS NULL THEN lower(btrim(p_email)) ELSE (
      SELECT lower(btrim(u.email)) FROM auth.users AS u WHERE u.id = a.id
    ) END AS email FROM account AS a
  )
  SELECT s.id FROM public.subscriptions AS s CROSS JOIN identity AS i
  WHERE s.status = 'active' AND (s.expires_at IS NULL OR s.expires_at > p_now)
    AND (lower(btrim(COALESCE(s.plan, ''))) IN ('forever', 'lifetime')
      OR lower(btrim(COALESCE(s.plan_type::TEXT, ''))) IN ('forever', 'lifetime'))
    AND ((i.id IS NOT NULL AND s.user_id = i.id)
      OR (s.user_id IS NULL AND NULLIF(i.email, '') IS NOT NULL AND lower(btrim(s.email)) = i.email))
  ORDER BY s.expires_at DESC NULLS FIRST, s.id LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.find_active_unlimited_subscription(UUID, TEXT, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.find_active_unlimited_subscription(UUID, TEXT, TIMESTAMPTZ) TO service_role;

CREATE FUNCTION public.enqueue_subscription_cancellation(
  p_subscription_id UUID, p_unlimited_id UUID DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_target public.subscriptions%ROWTYPE;
  v_request_id UUID;
BEGIN
  SELECT s.* INTO v_target FROM public.subscriptions AS s WHERE s.id = p_subscription_id FOR UPDATE;
  IF NOT FOUND OR v_target.payment_provider IS DISTINCT FROM 'hutko'
    OR lower(btrim(COALESCE(v_target.plan, ''))) IN ('forever', 'lifetime')
    OR lower(btrim(COALESCE(v_target.plan_type::TEXT, ''))) IN ('forever', 'lifetime')
    OR COALESCE(v_target.order_id, '') LIKE 'recurring\_\_%' ESCAPE '\' THEN RETURN; END IF;
  IF p_unlimited_id IS NOT NULL AND p_unlimited_id IS DISTINCT FROM
    public.find_active_unlimited_subscription(v_target.user_id, v_target.email, now()) THEN
    RAISE EXCEPTION 'Unlimited cancellation account mismatch';
  END IF;
  INSERT INTO public.subscription_cancellation_jobs AS j (
    subscription_id, unlimited_subscription_id, request_id
  ) VALUES (v_target.id, p_unlimited_id, COALESCE(v_target.cancellation_request_id, gen_random_uuid()))
  ON CONFLICT (subscription_id) DO UPDATE SET
    unlimited_subscription_id = COALESCE(EXCLUDED.unlimited_subscription_id, j.unlimited_subscription_id),
    state = 'pending', revision = j.revision + 1,
    next_attempt_at = now(), locked_until = NULL, claim_token = NULL, updated_at = now()
  RETURNING request_id INTO v_request_id;
  UPDATE public.subscriptions SET auto_renewal = false,
    cancellation_state = CASE WHEN cancellation_state = 'provider_stopped' THEN 'provider_stopped' ELSE 'requested' END,
    cancellation_request_id = v_request_id, cancellation_requested_at = now(),
    cancellation_completed_at = NULL, updated_at = now()
  WHERE id = v_target.id;
END;
$$;
REVOKE ALL ON FUNCTION public.enqueue_subscription_cancellation(UUID, UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_subscription_cancellation(UUID, UUID) TO service_role;

CREATE FUNCTION public.queue_cancellations_on_unlimited_access()
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
        AND lower(COALESCE(NULLIF(s.plan, ''), s.plan_type::TEXT, '')) IN ('month', 'quarter', 'half', 'year')
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
    AND lower(COALESCE(NULLIF(NEW.plan, ''), NEW.plan_type::TEXT, '')) IN ('month', 'quarter', 'half', 'year')
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
CREATE TRIGGER queue_cancellations_on_unlimited_access_trigger
AFTER INSERT OR UPDATE OF status, user_id, email, plan, plan_type, expires_at ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.queue_cancellations_on_unlimited_access();

CREATE FUNCTION public.claim_subscription_cancellation_jobs(p_limit INTEGER DEFAULT 10)
RETURNS SETOF public.subscription_cancellation_jobs
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$
  WITH due AS (
    SELECT j.subscription_id FROM public.subscription_cancellation_jobs AS j
    WHERE (j.state = 'pending' AND j.next_attempt_at <= now())
      OR (j.state = 'processing' AND j.locked_until < now())
    ORDER BY j.next_attempt_at, j.subscription_id LIMIT LEAST(GREATEST(p_limit, 1), 50)
    FOR UPDATE SKIP LOCKED
  )
  UPDATE public.subscription_cancellation_jobs AS j SET state = 'processing',
    attempts = j.attempts + 1, claim_token = gen_random_uuid(),
    locked_until = now() + interval '10 minutes', updated_at = now()
  FROM due WHERE j.subscription_id = due.subscription_id RETURNING j.*;
$$;
REVOKE ALL ON FUNCTION public.claim_subscription_cancellation_jobs(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_subscription_cancellation_jobs(INTEGER) TO service_role;

-- One request per paid period. Unknown provider outcomes require reconciliation,
-- never a fresh order that might bill the same period twice.
CREATE TABLE public.subscription_charge_claims (
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  period_end TIMESTAMPTZ NOT NULL,
  order_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (subscription_id, period_end)
);
ALTER TABLE public.subscription_charge_claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.subscription_charge_claims FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.subscription_charge_claims TO service_role;
CREATE FUNCTION public.claim_hutko_recurring_charge(p_subscription_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_target public.subscriptions%ROWTYPE;
  v_order_id TEXT;
  v_unlimited_id UUID;
BEGIN
  SELECT s.* INTO v_target FROM public.subscriptions AS s WHERE s.id = p_subscription_id FOR UPDATE;
  IF NOT FOUND OR v_target.status IS DISTINCT FROM 'active' OR v_target.auto_renewal IS NOT TRUE
    OR v_target.payment_provider IS DISTINCT FROM 'hutko' OR v_target.recurring_mode IS DISTINCT FROM 'merchant_token'
    OR v_target.cancellation_state IS DISTINCT FROM 'none' OR v_target.rectoken IS NULL
    OR v_target.expires_at IS NULL OR v_target.expires_at > now() + interval '1 day'
    OR lower(COALESCE(NULLIF(v_target.plan, ''), v_target.plan_type::TEXT, '')) NOT IN ('month', 'quarter', 'half', 'year')
    OR lower(COALESCE(v_target.plan_type::TEXT, '')) IN ('forever', 'lifetime') THEN RETURN NULL; END IF;
  v_unlimited_id := public.find_active_unlimited_subscription(v_target.user_id, v_target.email, now());
  IF v_unlimited_id IS NOT NULL THEN
    PERFORM public.enqueue_subscription_cancellation(v_target.id, v_unlimited_id);
    RETURN NULL;
  END IF;
  INSERT INTO public.subscription_charge_claims(subscription_id, period_end, order_id)
  VALUES (v_target.id, v_target.expires_at, 'renew_' || gen_random_uuid()::TEXT)
  ON CONFLICT (subscription_id, period_end) DO NOTHING RETURNING order_id INTO v_order_id;
  RETURN v_order_id;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_hutko_recurring_charge(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_hutko_recurring_charge(UUID) TO service_role;