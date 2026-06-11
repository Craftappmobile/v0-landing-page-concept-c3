-- Preserve Hutko payment failure details for support reconciliation.
-- Nullable text fields keep common filters simple; JSONB keeps provider-specific
-- metadata without requiring a schema change for every new Hutko error field.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS payment_failure_code TEXT,
  ADD COLUMN IF NOT EXISTS payment_failure_message TEXT,
  ADD COLUMN IF NOT EXISTS payment_failure_details JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.payment_callback_events
  ADD COLUMN IF NOT EXISTS payment_failure_code TEXT,
  ADD COLUMN IF NOT EXISTS payment_failure_message TEXT,
  ADD COLUMN IF NOT EXISTS payment_failure_details JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS subscriptions_payment_failure_code_idx
  ON public.subscriptions(payment_failure_code)
  WHERE payment_failure_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS payment_callback_events_failure_code_idx
  ON public.payment_callback_events(payment_failure_code)
  WHERE payment_failure_code IS NOT NULL;

COMMENT ON COLUMN public.subscriptions.payment_failure_code IS
  'Provider failure code for the latest failed Hutko payment attempt, for support triage.';

COMMENT ON COLUMN public.subscriptions.payment_failure_message IS
  'Provider failure description for the latest failed Hutko payment attempt, for support triage.';

COMMENT ON COLUMN public.subscriptions.payment_failure_details IS
  'Provider-specific non-sensitive failure metadata for the latest failed Hutko payment attempt.';