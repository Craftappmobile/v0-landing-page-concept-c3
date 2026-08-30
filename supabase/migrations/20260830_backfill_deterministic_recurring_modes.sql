-- Classify only recurring modes that are provable from local provenance.
-- Ambiguous active recurring rows intentionally remain unknown.

UPDATE public.subscriptions
SET recurring_mode = 'none',
    recurring_mode_source = 'auto_renewal_disabled',
    recurring_mode_classified_at = now(),
    updated_at = now()
WHERE recurring_mode = 'unknown'
  AND auto_renewal IS NOT TRUE;

UPDATE public.subscriptions
SET auto_renewal = false,
    recurring_mode = 'none',
    recurring_mode_source = 'non_recurring_plan',
    recurring_mode_classified_at = now(),
    updated_at = now()
WHERE recurring_mode = 'unknown'
  AND lower(COALESCE(plan, plan_type, '')) IN ('forever', 'lifetime');

UPDATE public.subscriptions AS renewal_attempt
SET auto_renewal = false,
    recurring_mode = 'none',
    recurring_mode_source = 'legacy_recurring_attempt',
    recurring_mode_classified_at = now(),
    updated_at = now()
WHERE renewal_attempt.recurring_mode = 'unknown'
  AND renewal_attempt.status = 'failed'
  AND renewal_attempt.order_id LIKE 'recurring\_\_%' ESCAPE '\'
  AND EXISTS (
    SELECT 1
    FROM public.subscriptions AS parent
    WHERE parent.order_id = regexp_replace(
      renewal_attempt.order_id,
      '^recurring__[^_]+__',
      ''
    )
  );

UPDATE public.subscriptions
SET recurring_mode_source = COALESCE(recurring_mode_source, 'application'),
    recurring_mode_classified_at = COALESCE(recurring_mode_classified_at, updated_at, created_at)
WHERE recurring_mode <> 'unknown'
  AND recurring_mode_source IS NULL;
