-- Track cancellation of Hutko schedules whose parent subscription is missing locally.

ALTER TABLE public.payment_callback_events
  ADD COLUMN IF NOT EXISTS cancellation_request_id UUID,
  ADD COLUMN IF NOT EXISTS cancellation_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_email_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS payment_callback_events_cancellation_request_idx
  ON public.payment_callback_events(cancellation_request_id)
  WHERE cancellation_request_id IS NOT NULL;
