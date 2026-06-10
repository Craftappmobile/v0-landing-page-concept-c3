-- Store Hutko callbacks that cannot be safely auto-provisioned.
-- This keeps payer email out of the access decision while preserving enough
-- non-sensitive metadata for support reconciliation.

CREATE TABLE IF NOT EXISTS public.payment_callback_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL DEFAULT 'hutko',
  event_type TEXT NOT NULL,
  processing_status TEXT NOT NULL DEFAULT 'needs_review',
  reason TEXT NOT NULL,
  order_id TEXT,
  merchant_order_id TEXT,
  hutko_payment_id TEXT,
  checkout_correlation_id TEXT,
  order_status TEXT,
  payer_email TEXT,
  access_email TEXT,
  customer_name TEXT,
  plan_code TEXT,
  plan TEXT,
  paid_amount INTEGER,
  paid_currency TEXT,
  payload_summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_callback_events_order_id_idx
  ON public.payment_callback_events(order_id);

CREATE INDEX IF NOT EXISTS payment_callback_events_payer_email_idx
  ON public.payment_callback_events(lower(payer_email));

CREATE INDEX IF NOT EXISTS payment_callback_events_status_idx
  ON public.payment_callback_events(processing_status, received_at DESC);

ALTER TABLE public.payment_callback_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.payment_callback_events IS
  'Non-sensitive audit/quarantine records for payment callbacks that require manual support review.';
