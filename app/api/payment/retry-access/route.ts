import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import { generateSecurePassword } from "@/lib/password";
import { isPlanId } from "@/lib/plans";

async function findAuthUserByEmail(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
) {
  const { data: userId, error } = await supabase.rpc("find_paid_auth_user_by_email", {
    p_email: email,
  });

  if (error) {
    throw new Error("Failed to find user by email: " + error.message);
  }

  return typeof userId === "string" && userId ? { id: userId } : null;
}

async function getOrCreateUser(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
  fullName: string,
): Promise<{ userId: string; generatedPassword: string | null }> {
  const existing = await findAuthUserByEmail(supabase, email);
  if (existing) return { userId: existing.id, generatedPassword: null };

  const generatedPassword = generateSecurePassword();
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, name: fullName },
  });

  if (!error && newUser.user) {
    await supabase.from("profiles").upsert({
      id: newUser.user.id,
      email,
      full_name: fullName,
      name: fullName,
      subscription_type: "free",
    });
    return { userId: newUser.user.id, generatedPassword };
  }

  const existingAfterCreateError = await findAuthUserByEmail(supabase, email);
  if (existingAfterCreateError) return { userId: existingAfterCreateError.id, generatedPassword: null };

  const { data: fallbackUserId, error: fallbackError } = await supabase.rpc("create_paid_auth_user", {
    p_email: email,
    p_password: generatedPassword,
    p_full_name: fullName,
  });

  if (!fallbackError && typeof fallbackUserId === "string" && fallbackUserId) {
    return { userId: fallbackUserId, generatedPassword };
  }

  throw new Error(
    "Failed to create user: " +
    (fallbackError?.message ? `${error?.message}; fallback: ${fallbackError.message}` : error?.message),
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const orderId = typeof body.order_id === "string" ? body.order_id.trim() : "";
    const paymentId = typeof body.payment_id === "string" ? body.payment_id.trim() : "";

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: "order_id and payment_id are required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("id, order_id, hutko_payment_id, email, customer_name, plan, status, user_id, email_status")
      .eq("order_id", orderId)
      .eq("hutko_payment_id", paymentId)
      .maybeSingle();

    if (subscriptionError) throw subscriptionError;
    if (!subscription) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    if (subscription.status !== "active") {
      return NextResponse.json({ error: "Subscription is not active" }, { status: 409 });
    }
    if (!subscription.email) {
      await supabase.from("subscriptions").update({ email_status: "no_email_found" }).eq("id", subscription.id);
      return NextResponse.json({ error: "Subscription has no email" }, { status: 409 });
    }
    if (subscription.email_status === "sent" && subscription.user_id) {
      return NextResponse.json({ status: "already_sent" });
    }
    if (!isPlanId(subscription.plan)) {
      return NextResponse.json({ error: "Invalid subscription plan" }, { status: 409 });
    }

    const { userId, generatedPassword } = await getOrCreateUser(
      supabase,
      subscription.email,
      subscription.customer_name || "",
    );

    await supabase.from("subscriptions").update({ user_id: userId }).eq("id", subscription.id);

    const emailResult = await sendWelcomeEmail(
      subscription.email,
      subscription.customer_name || "",
      subscription.plan,
      generatedPassword,
    );

    await supabase
      .from("subscriptions")
      .update({
        email_status: emailResult.success ? "sent" : "failed",
        email_error: emailResult.error || null,
      })
      .eq("id", subscription.id);

    return NextResponse.json({ status: emailResult.success ? "sent" : "failed" });
  } catch (error) {
    console.error("[Payment Retry Access] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
