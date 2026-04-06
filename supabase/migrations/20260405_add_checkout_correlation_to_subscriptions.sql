-- ============================================================
-- Harden Hutko payment-link/button correlation for web checkout
-- ============================================================
-- Why:
-- Quarter plan now uses Hutko payment-link/button UI with promo support.
-- We need a stable correlation key in case Hutko button flow returns a
-- different order_id than the one initially prepared by our backend.

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS checkout_correlation_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_amount INTEGER,
  ADD COLUMN IF NOT EXISTS paid_currency TEXT;

COMMENT ON COLUMN public.subscriptions.checkout_correlation_id IS 'Internal correlation key used to link Hutko payment-link/button callbacks back to a pending subscription';
COMMENT ON COLUMN public.subscriptions.paid_amount IS 'Actual amount confirmed by Hutko callback in minor units';
COMMENT ON COLUMN public.subscriptions.paid_currency IS 'Actual currency confirmed by Hutko callback';

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_checkout_correlation_id_key
  ON public.subscriptions(checkout_correlation_id)
  WHERE checkout_correlation_id IS NOT NULL;