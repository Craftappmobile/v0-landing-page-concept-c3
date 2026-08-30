-- Add an auditable cancellation state machine and idempotent Hutko renewal application.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS cancellation_state TEXT NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS cancellation_request_id UUID,
  ADD COLUMN IF NOT EXISTS cancellation_requested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_last_error_code TEXT,
  ADD COLUMN IF NOT EXISTS recurring_mode_source TEXT,
  ADD COLUMN IF NOT EXISTS recurring_mode_classified_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_cancellation_state_check'
      AND conrelid = 'public.subscriptions'::regclass
  ) THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_cancellation_state_check
      CHECK (cancellation_state IN (
        'none', 'requested', 'provider_stopped', 'completed',
        'needs_review', 'provider_failed'
      ));
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_subscriptions_cancellation_request
  ON public.subscriptions(cancellation_request_id)
  WHERE cancellation_request_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_order_id_unique_idx
  ON public.subscriptions(order_id)
  WHERE order_id IS NOT NULL AND btrim(order_id) <> '';

CREATE TABLE IF NOT EXISTS public.subscription_cancellation_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_key TEXT NOT NULL UNIQUE,
  request_id UUID NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  phase TEXT NOT NULL,
  outcome TEXT NOT NULL,
  provider TEXT,
  recurring_mode TEXT,
  error_code TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscription_cancellation_events_request
  ON public.subscription_cancellation_events(request_id, created_at);
CREATE INDEX IF NOT EXISTS idx_subscription_cancellation_events_subscription
  ON public.subscription_cancellation_events(subscription_id);

ALTER TABLE public.subscription_cancellation_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.subscription_cancellation_events FROM anon, authenticated;

COMMENT ON TABLE public.subscription_cancellation_events IS
  'Private, non-PII audit trail for subscription cancellation attempts.';

ALTER TABLE public.payment_callback_events
  ADD COLUMN IF NOT EXISTS dedupe_key TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS payment_callback_events_dedupe_key_idx
  ON public.payment_callback_events(dedupe_key);

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
BEGIN
  IF p_callback_order_id IS NULL OR btrim(p_callback_order_id) = ''
     OR p_parent_order_id IS NULL OR btrim(p_parent_order_id) = ''
     OR p_duration_days <= 0 THEN
    RAISE EXCEPTION 'Invalid renewal callback arguments';
  END IF;

  SELECT * INTO v_subscription
  FROM public.subscriptions
  WHERE order_id = p_parent_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'parent_not_found'::TEXT, NULL::UUID, NULL::TEXT,
      NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::BOOLEAN;
    RETURN;
  END IF;

  INSERT INTO public.payment_callback_events (
    event_type, processing_status, reason, order_id, merchant_order_id,
    hutko_payment_id, order_status, paid_amount, paid_currency, dedupe_key
  ) VALUES (
    'renewal_approved', 'processed', 'renewal_applied', p_callback_order_id,
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

  UPDATE public.subscriptions
  SET status = 'active',
      hutko_payment_id = COALESCE(p_payment_id, hutko_payment_id),
      expires_at = GREATEST(COALESCE(expires_at, p_now), p_now)
        + make_interval(days => p_duration_days),
      updated_at = p_now,
      paid_amount = COALESCE(p_paid_amount, paid_amount),
      paid_currency = COALESCE(p_paid_currency, paid_currency),
      rectoken = COALESCE(p_rectoken, rectoken),
      payment_failure_code = NULL,
      payment_failure_message = NULL,
      payment_failure_details = '{}'::jsonb
  WHERE id = v_subscription.id
  RETURNING * INTO v_subscription;

  RETURN QUERY SELECT 'applied'::TEXT, v_subscription.id,
    v_subscription.cancellation_state, v_subscription.cancellation_request_id,
    v_subscription.recurring_mode, v_subscription.recurring_mode_source,
    v_subscription.auto_renewal;
END;
$$;

REVOKE ALL ON FUNCTION public.apply_hutko_renewal(
  TEXT, TEXT, INTEGER, TIMESTAMPTZ, TEXT, INTEGER, TEXT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_hutko_renewal(
  TEXT, TEXT, INTEGER, TIMESTAMPTZ, TEXT, INTEGER, TEXT, TEXT
) TO service_role;
