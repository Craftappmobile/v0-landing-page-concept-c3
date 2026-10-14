import type { createAdminClient } from "./supabase.ts";
import { CANCELLATION_SUBSCRIPTION_SELECT } from "./cancel-subscription.ts";
import { cancelOneSubscription } from "./subscription-cancellation.ts";

type AdminClient = ReturnType<typeof createAdminClient>;
export type CancellationJob = {
  subscription_id: string;
  request_id: string;
  claim_token: string;
  revision: number;
  attempts: number;
};

/** Only call from a trusted authenticated server job; all provider I/O is injected. */
export async function runSubscriptionCancellationJobs(args: {
  supabase: AdminClient;
  now: Date;
  stopProvider: (orderId: string) => Promise<unknown>;
  limit?: number;
}) {
  const { supabase, now, stopProvider } = args;
  const claimed = await supabase.rpc("claim_subscription_cancellation_jobs", { p_limit: args.limit ?? 10 });
  if (claimed.error) throw new Error("Cancellation queue claim failed");
  const summary = { completed: 0, retry: 0, needsReview: 0, superseded: 0 };
  for (const job of (claimed.data || []) as CancellationJob[]) {
    let state = "pending";
    let errorCode: string | null = null;
    try {
      const candidate = await supabase.from("subscriptions").select(CANCELLATION_SUBSCRIPTION_SELECT)
        .eq("id", job.subscription_id).maybeSingle();
      if (candidate.error || !candidate.data) throw new Error("Cancellation candidate lookup failed");
      const result = await cancelOneSubscription({
        supabase, subscription: candidate.data, requestId: job.request_id,
        now: now.toISOString(), stopProvider,
      });
      if (result.outcome === "completed") state = "completed";
      else if (result.outcome === "manual_review") { state = "needs_review"; errorCode = "unclassified_recurring_mode"; }
      else errorCode = result.outcome === "provider_failed" ? "hutko_stop_failed" : "pending_activation";
    } catch {
      // Never log provider payloads, tokens, customer data or arbitrary error bodies.
      errorCode = "cancellation_job_failed";
    }
    const retryMinutes = Math.min(1440, 15 * 2 ** Math.min(job.attempts, 7));
    const finished = await supabase.from("subscription_cancellation_jobs").update({
      state, last_error_code: errorCode,
      next_attempt_at: new Date(now.getTime() + retryMinutes * 60_000).toISOString(),
      locked_until: null, claim_token: null, updated_at: now.toISOString(),
    }).eq("subscription_id", job.subscription_id).eq("claim_token", job.claim_token)
      .eq("revision", job.revision).select("subscription_id").maybeSingle();
    if (finished.error) throw new Error("Cancellation queue completion failed");
    if (!finished.data) summary.superseded++;
    else if (state === "completed") summary.completed++;
    else if (state === "needs_review") summary.needsReview++;
    else summary.retry++;
  }
  return summary;
}