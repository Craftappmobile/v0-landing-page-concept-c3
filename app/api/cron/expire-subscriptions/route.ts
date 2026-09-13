import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { runExpirationSweep } from "@/lib/expire-subscriptions";

/**
 * Cron job: mark active subscriptions as expired once their paid period
 * ended more than GRACE_DAYS ago. auto_renewal is intentionally left as is.
 * Protected by CRON_SECRET header (Vercel Cron).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const result = await runExpirationSweep(supabase, new Date());

  if (result.kind === "error") {
    console.error("[ExpireSubscriptions] Error:", result.error);
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if (result.kind === "empty") {
    return NextResponse.json({ message: result.message, count: 0 });
  }

  console.log("[ExpireSubscriptions] Expired:", result.count, "cutoff:", result.cutoff);

  return NextResponse.json({
    message: "Expiration sweep complete",
    count: result.count,
    cutoff: result.cutoff,
    truncated: result.truncated,
  });
}
