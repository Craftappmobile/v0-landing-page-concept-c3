-- ============================================================
-- Sync subscriptions schema with current web payment flow (Hutko)
-- ============================================================
-- Why:
-- The live database already contains several web-payment columns used by
-- app/api/payment/* routes, but the repository did not have a migration that
-- formally described them. This migration makes repo schema match live DB.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS order_id TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT,
  ADD COLUMN IF NOT EXISTS amount INTEGER,
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'UAH',
  ADD COLUMN IF NOT EXISTS rectoken TEXT,
  ADD COLUMN IF NOT EXISTS hutko_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS email_status TEXT,
  ADD COLUMN IF NOT EXISTS email_error TEXT,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

COMMENT ON COLUMN public.subscriptions.order_id IS 'External Hutko order identifier for web payments';
COMMENT ON COLUMN public.subscriptions.email IS 'Customer email used for web checkout and follow-up emails';
COMMENT ON COLUMN public.subscriptions.customer_name IS 'Customer full name from the checkout form';
COMMENT ON COLUMN public.subscriptions.plan IS 'App plan identifier used by the web payment flow';
COMMENT ON COLUMN public.subscriptions.amount IS 'Charged amount for the subscription in minor business units';
COMMENT ON COLUMN public.subscriptions.currency IS 'Payment currency, default UAH for Hutko flow';
COMMENT ON COLUMN public.subscriptions.rectoken IS 'Recurring token returned by Hutko for future charges';
COMMENT ON COLUMN public.subscriptions.hutko_payment_id IS 'Payment identifier returned by Hutko callback';
COMMENT ON COLUMN public.subscriptions.email_status IS 'Email delivery status for post-payment emails';
COMMENT ON COLUMN public.subscriptions.email_error IS 'Last email delivery error for post-payment emails';
COMMENT ON COLUMN public.subscriptions.cancelled_at IS 'Timestamp when auto-renewal or subscription was cancelled';

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_order_id_key
  ON public.subscriptions(order_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_order_id
  ON public.subscriptions(order_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email
  ON public.subscriptions(email);

CREATE INDEX IF NOT EXISTS idx_subscriptions_rectoken
  ON public.subscriptions(rectoken)
  WHERE rectoken IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_subscriptions_web_recurring_lookup
  ON public.subscriptions(status, auto_renewal, expires_at)
  WHERE rectoken IS NOT NULL;