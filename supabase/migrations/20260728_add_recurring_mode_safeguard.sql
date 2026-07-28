-- Distinguish Hutko-managed schedules from merchant-initiated token charges.
-- Historical rows default to unknown so the app cron cannot charge them until
-- an explicit reconciliation classifies their recurring driver.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS recurring_mode TEXT NOT NULL DEFAULT 'unknown';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'subscriptions_recurring_mode_check'
      AND conrelid = 'public.subscriptions'::regclass
  ) THEN
    ALTER TABLE public.subscriptions
      ADD CONSTRAINT subscriptions_recurring_mode_check
      CHECK (recurring_mode IN ('unknown', 'hutko_schedule', 'merchant_token', 'none'));
  END IF;
END
$$;

COMMENT ON COLUMN public.subscriptions.recurring_mode IS
  'Recurring charge driver: unknown, hutko_schedule, merchant_token, or none.';

CREATE INDEX IF NOT EXISTS idx_subscriptions_merchant_token_recurring
  ON public.subscriptions(status, auto_renewal, expires_at)
  WHERE rectoken IS NOT NULL AND recurring_mode = 'merchant_token';