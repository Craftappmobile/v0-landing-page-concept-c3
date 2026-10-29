-- Club package: plan = 'club', plan_type = 'year' (the mobile app only knows
-- year; apply_hutko_renewal takes 365 days from plan_type). This RPC reads
-- COALESCE(NULLIF(plan, ''), plan_type) = 'club', so allow it to be claimed
-- for a merchant_token renewal; /api/payment/recurring charges 249000.
-- Same body as 2026101402 except 'club' in the plan list. No data changes.
CREATE OR REPLACE FUNCTION public.claim_hutko_recurring_charge(p_subscription_id UUID)
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
    OR lower(COALESCE(NULLIF(v_target.plan, ''), v_target.plan_type::TEXT, '')) NOT IN ('month', 'quarter', 'half', 'year', 'club')
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
