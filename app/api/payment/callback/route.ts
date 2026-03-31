import { NextRequest, NextResponse, after } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import { generateSecurePassword } from "@/lib/password";
import { isPlanId, PLAN_CONFIG } from "@/lib/plans";

const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

type MerchantData = {
  plan?: string;
  name?: string;
  email?: string;
  renewal?: boolean;
  parent_order?: string;
};

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

function parseMerchantData(rawValue: string | undefined): MerchantData {
  try {
    const parsed = JSON.parse(rawValue || "{}") as MerchantData;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function addDaysToLatestDate(baseIso: string | null | undefined, days: number, now: Date): string {
  const baseDate = baseIso ? new Date(baseIso) : new Date(now);
  const validBaseDate = Number.isNaN(baseDate.getTime()) ? new Date(now) : baseDate;
  const effectiveBaseDate = validBaseDate.getTime() > now.getTime() ? validBaseDate : new Date(now);
  effectiveBaseDate.setDate(effectiveBaseDate.getDate() + days);
  return effectiveBaseDate.toISOString();
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
    const parsedMerchantData = parseMerchantData(merchant_data);
    const plan = typeof parsedMerchantData.plan === "string" ? parsedMerchantData.plan : "";
    const customerNameFromMerchant = typeof parsedMerchantData.name === "string"
      ? parsedMerchantData.name
      : "";
    const customerEmailFromMerchant = typeof parsedMerchantData.email === "string"
      ? parsedMerchantData.email
      : "";
    const isRenewal = parsedMerchantData.renewal === true;
    const parentOrder = typeof parsedMerchantData.parent_order === "string"
      ? parsedMerchantData.parent_order
      : "";

    if (order_status === "approved") {
      const durationDays = isPlanId(plan) ? PLAN_CONFIG[plan].days : 90;
      const now = new Date();
      const nowIso = now.toISOString();

      if (isRenewal) {
        if (!parentOrder) {
          console.error("[Hutko Callback] Renewal callback is missing parent_order:", order_id);
          return NextResponse.json({ error: "Missing parent order for renewal" }, { status: 400 });
        }

        const { data: existingSub, error: existingSubError } = await supabase
          .from("subscriptions")
          .select("order_id, expires_at")
          .eq("order_id", parentOrder)
          .maybeSingle();

        if (existingSubError || !existingSub) {
          console.error("[Hutko Callback] Renewal parent subscription not found:", parentOrder, existingSubError);
          return NextResponse.json({ error: "Parent subscription not found" }, { status: 500 });
        }

        const updateData: Record<string, string | null> = {
          status: "active",
          hutko_payment_id: payment_id || null,
          expires_at: addDaysToLatestDate(existingSub.expires_at, durationDays, now),
          updated_at: nowIso,
        };

        if (rectoken) {
          updateData.rectoken = rectoken;
        }

        await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("order_id", parentOrder);

        console.log("[Hutko Callback] Subscription renewed:", parentOrder, "via", order_id);
      } else {
        // Update initial subscription to active
        const updateData: Record<string, string | boolean | null> = {
          status: "active",
          hutko_payment_id: payment_id || null,
          started_at: nowIso,
          expires_at: addDaysToLatestDate(null, durationDays, now),
          updated_at: nowIso,
        };

        if (rectoken) {
          updateData.rectoken = rectoken;
        }

        await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("order_id", order_id);

        console.log("[Hutko Callback] Subscription activated:", order_id);

        // Get customer info from merchant_data or subscription record
        let customerName = customerNameFromMerchant;
        let customerEmail = customerEmailFromMerchant;

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
      }
    } else {
      if (isRenewal && parentOrder) {
        await supabase
          .from("subscriptions")
          .update({ updated_at: new Date().toISOString() })
          .eq("order_id", parentOrder);

        console.log("[Hutko Callback] Renewal payment failed:", parentOrder, order_status, "via", order_id);
      } else {
        // Initial payment failed or declined
        await supabase
          .from("subscriptions")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("order_id", order_id);

        console.log("[Hutko Callback] Payment failed:", order_id, order_status);
      }
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