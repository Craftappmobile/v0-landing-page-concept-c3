-- Local, reviewable replacement only. Depends on the helpers in 2026101402.
-- Keep the existing RPC signature/return type; p_duration_days is now ignored.
CREATE OR REPLACE FUNCTION public.apply_hutko_renewal(
  p_callback_order_id TEXT,
  p_parent_order_id TEXT,
  p_duration_days INTEGER,
  p_now TIMESTAMPTZ,
  p_payment_id TEXT DEFAULT NULL,
  p_paid_amount INTEGER DEFAULT NULL,
  p_paid_currency TEXT DEFAULT NULL,
  p_rectoken TEXT DEFAULT NULL
)
RETURNS TABLE (
  result TEXT,
  subscription_id UUID,
  cancellation_state TEXT,
  cancellation_request_id UUID,
  recurring_mode TEXT,
  recurring_mode_source TEXT,
  auto_renewal BOOLEAN
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_subscription public.subscriptions%ROWTYPE;
  v_event_id UUID;
  v_plan TEXT;
  v_duration_days INTEGER;
  v_unlimited_id UUID;
  v_reason TEXT;
  v_legacy_schedule BOOLEAN;
  v_recurring_target BOOLEAN;
  v_lifetime BOOLEAN;
BEGIN
  IF NULLIF(btrim(p_callback_order_id), '') IS NULL
     OR NULLIF(btrim(p_parent_order_id), '') IS NULL OR p_now IS NULL THEN
    RAISE EXCEPTION 'Invalid renewal callback arguments';
  END IF;

  -- Serialize payment-id aliases, including callbacks naming different parents.
  -- The unique dedupe key below also protects callbacks without a payment id.
  IF NULLIF(btrim(p_payment_id), '') IS NOT NULL THEN
    PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(
      'hutko:renewal:payment:' || p_payment_id, 0
    ));
  END IF;

  SELECT s.* INTO v_subscription
  FROM public.subscriptions AS s
  WHERE s.order_id = p_parent_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'parent_not_found'::TEXT, NULL::UUID, NULL::TEXT,
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN;
    RETURN;
  END IF;

  IF NULLIF(btrim(p_payment_id), '') IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.payment_callback_events AS e
    WHERE e.provider = 'hutko' AND e.event_type = 'renewal_approved'
      AND e.order_status = 'approved' AND e.hutko_payment_id = p_payment_id
  ) THEN
    RETURN QUERY SELECT 'duplicate'::TEXT, v_subscription.id,
      v_subscription.cancellation_state, v_subscription.cancellation_request_id,
      v_subscription.recurring_mode, v_subscription.recurring_mode_source,
      v_subscription.auto_renewal;
    RETURN;
  END IF;

  -- Claim the real approved payment before any classification or queue writes.
  -- All changes roll back together if auditing or durable enqueueing fails.
  INSERT INTO public.payment_callback_events (
    event_type, processing_status, reason, order_id, merchant_order_id,
    hutko_payment_id, order_status, paid_amount, paid_currency, dedupe_key
  ) VALUES (
    'renewal_approved', 'needs_review', 'renewal_unknown_plan', p_callback_order_id,
    p_parent_order_id, p_payment_id, 'approved', p_paid_amount,
    p_paid_currency, 'hutko:renewal:approved:' || p_callback_order_id
  )
  ON CONFLICT (dedupe_key) DO NOTHING
  RETURNING id INTO v_event_id;

  IF v_event_id IS NULL THEN
    RETURN QUERY SELECT 'duplicate'::TEXT, v_subscription.id,
      v_subscription.cancellation_state, v_subscription.cancellation_request_id,
      v_subscription.recurring_mode, v_subscription.recurring_mode_source,
      v_subscription.auto_renewal;
    RETURN;
  END IF;

  -- Match the profile-access canonical plan. Either lifetime marker vetoes renewal.
  v_plan := lower(COALESCE(NULLIF(btrim(v_subscription.plan_type::TEXT), ''),
                           NULLIF(btrim(v_subscription.plan), '')));
  v_lifetime := lower(btrim(COALESCE(v_subscription.plan_type::TEXT, ''))) IN ('lifetime', 'forever')
    OR lower(btrim(COALESCE(v_subscription.plan, ''))) IN ('lifetime', 'forever');
  v_duration_days := CASE v_plan
    WHEN 'month' THEN 30 WHEN 'quarter' THEN 90
    WHEN 'half' THEN 180 WHEN 'year' THEN 365 ELSE NULL END;
  IF v_lifetime THEN v_duration_days := NULL; END IF;

  -- Only exact, signed legacy parent provenance proves a provider schedule.
  v_legacy_schedule := v_subscription.payment_provider = 'hutko'
    AND v_duration_days IS NOT NULL
    AND p_callback_order_id ~ '^recurring__[^_]+__.+'
    AND regexp_replace(p_callback_order_id, '^recurring__[^_]+__', '') = p_parent_order_id;
  v_recurring_target := NOT v_lifetime AND v_subscription.payment_provider = 'hutko'
    AND (v_duration_days IS NOT NULL
         OR v_subscription.recurring_mode IN ('hutko_schedule', 'merchant_token'));

  v_unlimited_id := public.find_active_unlimited_subscription(
    v_subscription.user_id, v_subscription.email, p_now
  );
  IF v_unlimited_id IS NOT NULL THEN
    v_reason := 'renewal_after_unlimited';
  ELSIF v_duration_days IS NULL OR v_subscription.payment_provider IS DISTINCT FROM 'hutko' THEN
    v_reason := 'renewal_unknown_plan';
  ELSIF v_subscription.auto_renewal IS NOT TRUE
        OR v_subscription.cancellation_state IS DISTINCT FROM 'none'
        OR v_subscription.cancelled_at IS NOT NULL
        OR v_subscription.status = 'cancelled' THEN
    v_reason := 'renewal_after_cancellation';
  -- The housekeeping sweep may already have marked a legitimate delayed renewal expired.
  ELSIF COALESCE(v_subscription.status, '') NOT IN ('active', 'expired')
        OR (p_callback_order_id LIKE 'recurring\_\_%' ESCAPE '\'
            AND NOT COALESCE(v_legacy_schedule, false))
        OR (NOT COALESCE(v_legacy_schedule, false)
            AND COALESCE(v_subscription.recurring_mode, 'unknown') NOT IN ('hutko_schedule', 'merchant_token')) THEN
    v_reason := 'renewal_unknown_plan';
  END IF;

  -- Do not infer Hutko scheduling from merchant renew_ callbacks. They retain
  -- their merchant_token driver. A new legacy charge can prove a stopped
  -- schedule is still billing; the durable helper reopens that cancellation.
  IF v_legacy_schedule THEN
    UPDATE public.subscriptions AS s
    SET recurring_mode = 'hutko_schedule',
        recurring_mode_source = 'legacy_recurring_callback',
        recurring_mode_classified_at = p_now
    WHERE s.id = v_subscription.id
    RETURNING s.* INTO v_subscription;
  END IF;

  IF v_reason IS NOT NULL THEN
    UPDATE public.payment_callback_events AS e
    SET processing_status = 'needs_review', reason = v_reason, updated_at = p_now
    WHERE e.id = v_event_id;

    IF v_recurring_target THEN
      -- Financial metadata only: never assign status, plan, user_id or expires_at.
      -- A nonrecurring/lifetime parent's original payment metadata is untouched.
      UPDATE public.subscriptions AS s
      SET hutko_payment_id = COALESCE(p_payment_id, s.hutko_payment_id),
          paid_amount = COALESCE(p_paid_amount, s.paid_amount),
          paid_currency = COALESCE(p_paid_currency, s.paid_currency),
          updated_at = p_now
      WHERE s.id = v_subscription.id;

      PERFORM public.enqueue_subscription_cancellation(v_subscription.id, v_unlimited_id);
    END IF;
    SELECT s.* INTO v_subscription FROM public.subscriptions AS s
    WHERE s.id = v_subscription.id;

    RETURN QUERY SELECT 'review_required'::TEXT, v_subscription.id,
      v_subscription.cancellation_state, v_subscription.cancellation_request_id,
      v_subscription.recurring_mode, v_subscription.recurring_mode_source,
      v_subscription.auto_renewal;
    RETURN;
  END IF;

  UPDATE public.subscriptions AS s
  SET status = 'active',
      hutko_payment_id = COALESCE(p_payment_id, s.hutko_payment_id),
      expires_at = GREATEST(COALESCE(s.expires_at, p_now), p_now)
        + make_interval(days => v_duration_days),
      updated_at = p_now,
      paid_amount = COALESCE(p_paid_amount, s.paid_amount),
      paid_currency = COALESCE(p_paid_currency, s.paid_currency),
      rectoken = COALESCE(p_rectoken, s.rectoken),
      payment_failure_code = NULL,
      payment_failure_message = NULL,
      payment_failure_details = '{}'::jsonb
  WHERE s.id = v_subscription.id
  RETURNING s.* INTO v_subscription;

  UPDATE public.payment_callback_events AS e
  SET processing_status = 'processed', reason = 'renewal_applied', updated_at = p_now
  WHERE e.id = v_event_id;

  RETURN QUERY SELECT 'applied'::TEXT, v_subscription.id,
    v_subscription.cancellation_state, v_subscription.cancellation_request_id,
    v_subscription.recurring_mode, v_subscription.recurring_mode_source,
    v_subscription.auto_renewal;
END;
$$;

ALTER TABLE public.payment_callback_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.payment_callback_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.payment_callback_events TO service_role;
REVOKE ALL ON FUNCTION public.apply_hutko_renewal(
  TEXT, TEXT, INTEGER, TIMESTAMPTZ, TEXT, INTEGER, TEXT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_hutko_renewal(
  TEXT, TEXT, INTEGER, TIMESTAMPTZ, TEXT, INTEGER, TEXT, TEXT
) TO service_role;