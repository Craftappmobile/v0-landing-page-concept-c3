import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import { generateSecurePassword } from "@/lib/password";
import { isPlanId, PLAN_CONFIG } from "@/lib/plans";

const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

/**
 * Verify Hutko callback signature (SHA1).
 * password + sorted param values joined with |
 */
function verifySignature(
  password: string,
  params: Record<string, string | number>,
  receivedSignature: string
): boolean {
  const filtered: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (
      key !== "signature" &&
      key !== "response_signature_string" &&
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      filtered[key] = value;
    }
  }
  const sortedKeys = Object.keys(filtered).sort();
  const values = sortedKeys.map((k) => String(filtered[k]));
  const signString = [password, ...values].join("|");
  const expected = crypto.createHash("sha1").update(signString, "utf8").digest("hex");
  return expected === receivedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Hutko sends callback data in body directly
    const {
      order_id,
      order_status,
      signature,
      rectoken,
      payment_id,
      merchant_data,
      ...restParams
    } = body as Record<string, string>;

    if (!order_id || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build params for signature verification (exclude signature itself)
    const paramsForSign: Record<string, string | number> = { order_id, order_status };
    // Include all other params that Hutko sent (except signature)
    for (const [key, value] of Object.entries(restParams)) {
      if (key !== "signature" && key !== "response_signature_string" && value) {
        paramsForSign[key] = value;
      }
    }
    if (rectoken) paramsForSign.rectoken = rectoken;
    if (payment_id) paramsForSign.payment_id = payment_id;
    if (merchant_data) paramsForSign.merchant_data = merchant_data;

    // Verify signature
    if (!verifySignature(MERCHANT_PASSWORD, paramsForSign, signature)) {
      console.error("[Hutko Callback] Invalid signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = createAdminClient();

    if (order_status === "approved") {
      // Parse merchant_data for plan info
      let plan = "";
      try {
        const parsed = JSON.parse(merchant_data || "{}");
        plan = parsed.plan || "";
      } catch {
        // merchant_data might not be JSON
      }

      const durationDays = isPlanId(plan) ? PLAN_CONFIG[plan].days : 90;
      const now = new Date();
      const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

      // Update subscription to active
      const updateData: Record<string, string | boolean | null> = {
        status: "active",
        hutko_payment_id: payment_id || null,
        started_at: now.toISOString(),
        expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString(),
      };

      // Save rectoken for future recurring charges
      if (rectoken) {
        updateData.rectoken = rectoken;
      }

      await supabase
        .from("subscriptions")
        .update(updateData)
        .eq("order_id", order_id);

      console.log("[Hutko Callback] Subscription activated:", order_id);

      // Get customer info from merchant_data or subscription record
      let customerName = "";
      let customerEmail = "";
      try {
        const parsed = JSON.parse(merchant_data || "{}");
        customerName = parsed.name || "";
        customerEmail = parsed.email || "";
      } catch { /* ignore */ }

      // Fallback: get email from subscription record
      if (!customerEmail) {
        const { data: sub } = await supabase
          .from("subscriptions")
          .select("email, customer_name")
          .eq("order_id", order_id)
          .single();
        if (sub) {
          customerEmail = sub.email || "";
          customerName = customerName || sub.customer_name || "";
        }
      }

      // Use after() to handle user creation and email AFTER responding to Hutko
      // This prevents Vercel function timeout from blocking the callback response
      const emailData = { customerEmail, customerName, plan, orderId: order_id };
      after(async () => {
        try {
          const bgSupabase = createAdminClient();
          if (emailData.customerEmail) {
            // Create user in Supabase Auth (or get existing)
            const { userId, generatedPassword } = await getOrCreateUser(
              bgSupabase, emailData.customerEmail, emailData.customerName,
            );

            // Link subscription to user
            await bgSupabase
              .from("subscriptions")
              .update({ user_id: userId })
              .eq("order_id", emailData.orderId);

            // Send welcome email with credentials
            console.log("[Hutko after()] Sending welcome email to:", emailData.customerEmail);
            try {
              const emailResult = await sendWelcomeEmail(
                emailData.customerEmail, emailData.customerName, emailData.plan, generatedPassword,
              );
              console.log("[Hutko after()] Email result:", JSON.stringify(emailResult));
              await bgSupabase
                .from("subscriptions")
                .update({
                  email_status: emailResult.success ? "sent" : "failed",
                  email_error: emailResult.error || null,
                })
                .eq("order_id", emailData.orderId);
            } catch (emailErr) {
              console.error("[Hutko after()] Email exception:", emailErr);
              await bgSupabase
                .from("subscriptions")
                .update({
                  email_status: "exception",
                  email_error: String(emailErr),
                })
                .eq("order_id", emailData.orderId);
            }
          } else {
            console.log("[Hutko after()] No customer email found");
            await bgSupabase
              .from("subscriptions")
              .update({ email_status: "no_email_found" })
              .eq("order_id", emailData.orderId);
          }
        } catch (bgError) {
          console.error("[Hutko after()] Background error:", bgError);
        }
      });
    } else {
      // Payment failed or declined
      await supabase
        .from("subscriptions")
        .update({
          status: "failed",
          updated_at: new Date().toISOString(),
        })
        .eq("order_id", order_id);

      console.log("[Hutko Callback] Payment failed:", order_id, order_status);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[Hutko Callback] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


/**
 * Find existing user by email or create a new one in Supabase Auth.
 * Returns userId and generatedPassword (null if user already existed).
 */
async function getOrCreateUser(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
  fullName: string,
): Promise<{ userId: string; generatedPassword: string | null }> {
  // Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );
  if (existing) {
    console.log("[Auth] User already exists:", email);
    return { userId: existing.id, generatedPassword: null };
  }

  // Create new user with generated password
  const generatedPassword = generateSecurePassword();
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !newUser.user) {
    throw new Error("Failed to create user: " + error?.message);
  }

  console.log("[Auth] New user created:", email, newUser.user.id);

  // Create profile record
  await supabase.from("profiles").upsert({
    id: newUser.user.id,
    email,
    full_name: fullName,
    name: fullName,
    subscription_type: "free",
  });

  return { userId: newUser.user.id, generatedPassword };
}