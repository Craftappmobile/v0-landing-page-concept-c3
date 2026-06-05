import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/email";
import { generateSecurePassword } from "@/lib/password";
import { isPlanId, PLAN_CONFIG } from "@/lib/plans";
import type { PlanId } from "@/lib/plans";
import {
  extractHutkoReservationCustomer,
  parseHutkoMerchantData,
  resolvePaymentAccessEmail,
  resolveDirectPaymentPlanId,
} from "@/lib/payment-flow";

const MERCHANT_PASSWORD = process.env.HUTKO_MERCHANT_PASSWORD || "";

type HutkoCallbackBody = Record<string, unknown>;

function getString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function getSignableString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function resolveKnownPlanId(...values: Array<string | null | undefined>) {
  for (const value of values) {
    if (value && isPlanId(value)) return value;
  }

  return null;
}

/**
 * Verify Hutko callback signature (SHA1).
 * password + sorted param values joined with |
 */
function verifySignature(
  password: string,
  params: Record<string, unknown>,
  receivedSignature: string
): boolean {
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    const signableValue = getSignableString(value);
    if (
      key !== "signature" &&
      key !== "response_signature_string" &&
      signableValue !== null
    ) {
      filtered[key] = signableValue;
    }
  }
  const sortedKeys = Object.keys(filtered).sort();
  const values = sortedKeys.map((k) => String(filtered[k]));
  const signString = [password, ...values].join("|");
  const expected = crypto.createHash("sha1").update(signString, "utf8").digest("hex");
  return expected === receivedSignature;
}

function addDaysToLatestDate(baseIso: string | null | undefined, days: number, now: Date): string {
  const baseDate = baseIso ? new Date(baseIso) : new Date(now);
  const validBaseDate = Number.isNaN(baseDate.getTime()) ? new Date(now) : baseDate;
  const effectiveBaseDate = validBaseDate.getTime() > now.getTime() ? validBaseDate : new Date(now);
  effectiveBaseDate.setDate(effectiveBaseDate.getDate() + days);
  return effectiveBaseDate.toISOString();
}

function parseOptionalAmount(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function logEmailMismatch(args: {
  context: "direct_payment" | "existing_subscription";
  orderId: string;
  merchantOrderId?: string | null;
  subscriptionId?: string;
  subscriptionEmail?: string | null;
  accessEmail?: string | null;
  payerEmail?: string | null;
}) {
  const normalizedEmails = [
    args.subscriptionEmail,
    args.accessEmail,
    args.payerEmail,
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .map((value) => value.trim().toLowerCase());

  if (new Set(normalizedEmails).size <= 1) {
    return;
  }

  console.warn("[Hutko Callback] Email mismatch detected:", {
    context: args.context,
    orderId: args.orderId,
    merchantOrderId: args.merchantOrderId || null,
    subscriptionId: args.subscriptionId || null,
    subscriptionEmail: args.subscriptionEmail || null,
    accessEmail: args.accessEmail || null,
    payerEmail: args.payerEmail || null,
  });
}

async function findInitialSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  args: { orderId: string; merchantOrderId?: string; correlationId: string },
) {
  const findByOrderId = async (orderId: string) => {
    if (!orderId) return null;

    const result = await supabase
      .from("subscriptions")
      .select("id, order_id, email, customer_name, plan, plan_type, status, email_status")
      .eq("order_id", orderId)
      .maybeSingle();

    if (result.error) {
      throw result.error;
    }

    return result.data;
  };

  const byOrderId = await findByOrderId(args.orderId);
  if (byOrderId) {
    return byOrderId;
  }

  if (args.merchantOrderId && args.merchantOrderId !== args.orderId) {
    const byMerchantOrderId = await findByOrderId(args.merchantOrderId);
    if (byMerchantOrderId) {
      return byMerchantOrderId;
    }
  }

  if (!args.correlationId) {
    return null;
  }

  const byCorrelation = await supabase
    .from("subscriptions")
    .select("id, order_id, email, customer_name, plan, plan_type, status, email_status")
    .eq("checkout_correlation_id", args.correlationId)
    .maybeSingle();

  if (byCorrelation.error) {
    throw byCorrelation.error;
  }

  return byCorrelation.data;
}

async function provisionCustomerAccess(args: {
  customerEmail: string;
  customerName: string;
  plan: PlanId;
  subscriptionId: string;
}) {
  const bgSupabase = createAdminClient();

  try {
    if (args.customerEmail) {
      const { userId, generatedPassword } = await getOrCreateUser(
        bgSupabase, args.customerEmail, args.customerName,
      );

      await bgSupabase
        .from("subscriptions")
        .update({ user_id: userId })
        .eq("id", args.subscriptionId);

      console.log("[Hutko Callback] Sending welcome email to:", args.customerEmail);
      try {
        const emailResult = await sendWelcomeEmail(
          args.customerEmail, args.customerName, args.plan, generatedPassword,
        );
        console.log("[Hutko Callback] Email result:", JSON.stringify(emailResult));
        await bgSupabase
          .from("subscriptions")
          .update({
            email_status: emailResult.success ? "sent" : "failed",
            email_error: emailResult.error || null,
          })
          .eq("id", args.subscriptionId);
      } catch (emailErr) {
        console.error("[Hutko Callback] Email exception:", emailErr);
        await bgSupabase
          .from("subscriptions")
          .update({
            email_status: "exception",
            email_error: String(emailErr),
          })
          .eq("id", args.subscriptionId);
      }
    } else {
      console.log("[Hutko Callback] No customer email found");
      await bgSupabase
        .from("subscriptions")
        .update({ email_status: "no_email_found" })
        .eq("id", args.subscriptionId);
    }
  } catch (bgError) {
    console.error("[Hutko Callback] Customer access provisioning error:", bgError);
    await bgSupabase
      .from("subscriptions")
      .update({
        email_status: "exception",
        email_error: String(bgError),
      })
      .eq("id", args.subscriptionId);
  }
}

async function createDirectPaymentSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  args: {
    orderId: string;
    customerEmail: string;
    customerName: string;
    plan: PlanId;
    nowIso: string;
    expiresAt: string;
    paymentId: string | null;
    rectoken: string | null;
    paidAmount: number | null;
    paidCurrency: string | null;
  },
) {
  const planConfig = PLAN_CONFIG[args.plan];
  const insertData: Record<string, string | number | boolean | null> = {
    order_id: args.orderId,
    email: args.customerEmail,
    customer_name: args.customerName,
    plan: args.plan,
    plan_type: args.plan,
    amount: planConfig.amount,
    currency: "UAH",
    status: "active",
    payment_provider: "hutko",
    platform: "web",
    auto_renewal: planConfig.isRecurring,
    started_at: args.nowIso,
    expires_at: args.expiresAt,
    updated_at: args.nowIso,
    hutko_payment_id: args.paymentId,
    rectoken: args.rectoken,
    paid_currency: args.paidCurrency,
  };

  if (args.paidAmount !== null) {
    insertData.paid_amount = args.paidAmount;
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .insert(insertData)
    .select("id, order_id, email, customer_name, plan, plan_type, status, email_status")
    .single();

  if (error || !data) {
    throw new Error("Failed to create direct payment subscription: " + error?.message);
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as HutkoCallbackBody;

    // Hutko sends callback data in body directly
    const {
      order_id: rawOrderId,
      order_status: rawOrderStatus,
      signature: rawSignature,
      rectoken: rawRectoken,
      payment_id: rawPaymentId,
      merchant_data: rawMerchantData,
      additional_info: rawAdditionalInfo,
      ...restParams
    } = body;

    const order_id = getString(rawOrderId);
    const order_status = getString(rawOrderStatus);
    const signature = getString(rawSignature);
    const rectoken = getString(rawRectoken);
    const payment_id = getString(rawPaymentId);

    if (!order_id || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build params for signature verification (exclude signature itself)
    const paramsForSign: Record<string, unknown> = { order_id, order_status };
    // Include all other params that Hutko sent (except signature)
    for (const [key, value] of Object.entries(restParams)) {
      if (key !== "signature" && key !== "response_signature_string" && value) {
        paramsForSign[key] = value;
      }
    }
    if (rectoken) paramsForSign.rectoken = rectoken;
    if (payment_id) paramsForSign.payment_id = payment_id;
    if (rawMerchantData) paramsForSign.merchant_data = rawMerchantData;
    if (rawAdditionalInfo) paramsForSign.additional_info = rawAdditionalInfo;

    // Verify signature
    if (!verifySignature(MERCHANT_PASSWORD, paramsForSign, signature)) {
      console.error("[Hutko Callback] Invalid signature for order:", order_id);
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const supabase = createAdminClient();
    const parsedMerchantData = parseHutkoMerchantData(rawMerchantData);
    const parsedCallbackFields = parseHutkoMerchantData(restParams);
    const parsedAdditionalInfo = parseHutkoMerchantData(rawAdditionalInfo);
    const reservationCustomer = extractHutkoReservationCustomer(rawAdditionalInfo);
    const directPaymentPlan = resolveDirectPaymentPlanId(
      parsedMerchantData.plan_code || parsedCallbackFields.plan_code || parsedAdditionalInfo.plan_code,
    );
    const plan = typeof parsedMerchantData.plan === "string"
      ? parsedMerchantData.plan
      : parsedCallbackFields.plan || parsedAdditionalInfo.plan || "";
    const customerNameFromMerchant = parsedMerchantData.name
      || parsedCallbackFields.name
      || parsedAdditionalInfo.name
      || reservationCustomer.name
      || "";
    const merchantAccessEmail = parsedMerchantData.access_email
      || parsedCallbackFields.access_email
      || parsedAdditionalInfo.access_email
      || "";
    const payerEmailFromMerchant = parsedMerchantData.email
      || parsedCallbackFields.email
      || parsedAdditionalInfo.email
      || reservationCustomer.email
      || "";
    const customerEmailFromMerchant = resolvePaymentAccessEmail({
      accessEmail: merchantAccessEmail,
      payerEmail: payerEmailFromMerchant,
    });
    const merchantOrderId = parsedMerchantData.order_id
      || parsedCallbackFields.order_id
      || parsedAdditionalInfo.order_id
      || "";
    const checkoutCorrelationId = parsedMerchantData.checkout_correlation_id
      || parsedCallbackFields.checkout_correlation_id
      || parsedAdditionalInfo.checkout_correlation_id
      || "";
    const isRenewal = parsedMerchantData.renewal === true
      || parsedCallbackFields.renewal === true
      || parsedAdditionalInfo.renewal === true;
    const parentOrder = parsedMerchantData.parent_order
      || parsedCallbackFields.parent_order
      || parsedAdditionalInfo.parent_order
      || "";
    const paidAmount = parseOptionalAmount(
      getString(restParams.actual_amount) || getString(restParams.amount) || undefined,
    );
    const paidCurrency = getString(restParams.actual_currency) || getString(restParams.currency) || null;

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

        const updateData: Record<string, string | number | null> = {
          status: "active",
          hutko_payment_id: payment_id || null,
          expires_at: addDaysToLatestDate(existingSub.expires_at, durationDays, now),
          updated_at: nowIso,
          paid_currency: paidCurrency,
        };

        if (paidAmount !== null) {
          updateData.paid_amount = paidAmount;
        }

        if (rectoken) {
          updateData.rectoken = rectoken;
        }

        await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("order_id", parentOrder);

        console.log("[Hutko Callback] Subscription renewed:", parentOrder, "via", order_id);
      } else {
        const targetSubscription = await findInitialSubscription(supabase, {
          orderId: order_id,
          merchantOrderId,
          correlationId: checkoutCorrelationId,
        });

        if (!targetSubscription) {
          if (!directPaymentPlan) {
            console.error(
              "[Hutko Callback] Direct payment is missing valid plan_code:",
              order_id,
              parsedMerchantData.plan_code || parsedCallbackFields.plan_code || parsedAdditionalInfo.plan_code,
            );
            return NextResponse.json({ error: "Missing or invalid plan_code" }, { status: 400 });
          }

          if (!customerEmailFromMerchant) {
            console.error("[Hutko Callback] Direct payment is missing customer email:", order_id);
            return NextResponse.json({ error: "Missing customer email" }, { status: 400 });
          }

          logEmailMismatch({
            context: "direct_payment",
            orderId: order_id,
            merchantOrderId,
            accessEmail: merchantAccessEmail,
            payerEmail: payerEmailFromMerchant,
          });

          const directSubscription = await createDirectPaymentSubscription(supabase, {
            orderId: merchantOrderId || order_id,
            customerEmail: customerEmailFromMerchant,
            customerName: customerNameFromMerchant,
            plan: directPaymentPlan,
            nowIso,
            expiresAt: addDaysToLatestDate(null, PLAN_CONFIG[directPaymentPlan].days, now),
            paymentId: payment_id || null,
            rectoken: rectoken || null,
            paidAmount,
            paidCurrency,
          });

          console.log("[Hutko Callback] Direct payment subscription created:", order_id, directSubscription.id);
          await provisionCustomerAccess({
            customerEmail: customerEmailFromMerchant,
            customerName: customerNameFromMerchant,
            plan: directPaymentPlan,
            subscriptionId: directSubscription.id,
          });
        } else {
          const subscriptionPlan = resolveKnownPlanId(plan, targetSubscription.plan, targetSubscription.plan_type) ?? directPaymentPlan;

          if (!subscriptionPlan) {
            console.error("[Hutko Callback] Subscription activation is missing valid plan:", order_id, targetSubscription.id);
            return NextResponse.json({ error: "Missing or invalid plan" }, { status: 400 });
          }

          // Update initial subscription to active
          logEmailMismatch({
            context: "existing_subscription",
            orderId: order_id,
            merchantOrderId,
            subscriptionId: targetSubscription.id,
            subscriptionEmail: targetSubscription.email,
            accessEmail: merchantAccessEmail,
            payerEmail: payerEmailFromMerchant,
          });

          const updateData: Record<string, string | boolean | null | number> = {
            status: "active",
            hutko_payment_id: payment_id || null,
            started_at: nowIso,
            expires_at: addDaysToLatestDate(null, PLAN_CONFIG[subscriptionPlan].days, now),
            updated_at: nowIso,
            paid_currency: paidCurrency,
          };

          if (paidAmount !== null) {
            updateData.paid_amount = paidAmount;
          }

          if (!targetSubscription.order_id && (merchantOrderId || order_id)) {
            updateData.order_id = merchantOrderId || order_id;
          }

          if (rectoken) {
            updateData.rectoken = rectoken;
          }

          await supabase
            .from("subscriptions")
            .update(updateData)
            .eq("id", targetSubscription.id);

          console.log("[Hutko Callback] Subscription activated:", order_id, targetSubscription.id);

          const customerName = targetSubscription.customer_name || customerNameFromMerchant || "";
          const customerEmail = resolvePaymentAccessEmail({
            subscriptionEmail: targetSubscription.email,
            accessEmail: merchantAccessEmail,
            payerEmail: payerEmailFromMerchant,
          });
          const shouldScheduleWelcomeEmail = !(targetSubscription.status === "active" && targetSubscription.email_status === "sent");

          if (shouldScheduleWelcomeEmail) {
            await provisionCustomerAccess({
              customerEmail,
              customerName,
              plan: subscriptionPlan,
              subscriptionId: targetSubscription.id,
            });
          } else {
            console.log("[Hutko Callback] Duplicate approved callback already emailed:", order_id, targetSubscription.id);
          }
        }
      }
    } else {
      if (isRenewal && parentOrder) {
        await supabase
          .from("subscriptions")
          .update({ updated_at: new Date().toISOString() })
          .eq("order_id", parentOrder);

        console.log("[Hutko Callback] Renewal payment failed:", parentOrder, order_status, "via", order_id);
      } else {
        const targetSubscription = await findInitialSubscription(supabase, {
          orderId: order_id,
          merchantOrderId,
          correlationId: checkoutCorrelationId,
        });

        if (!targetSubscription) {
          console.log("[Hutko Callback] Failed direct payment without subscription:", order_id, order_status);
          return NextResponse.json({ status: "ok" });
        }

        // Initial payment failed or declined
        const updateData: Record<string, string> = {
          status: "failed",
          updated_at: new Date().toISOString(),
        };

        if (!targetSubscription.order_id && (merchantOrderId || order_id)) {
          updateData.order_id = merchantOrderId || order_id;
        }

        await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("id", targetSubscription.id);

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
  // Check if user already exists
  const existing = await findAuthUserByEmail(supabase, email);
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
    const existingAfterCreateError = await findAuthUserByEmail(supabase, email);
    if (existingAfterCreateError) {
      console.log("[Auth] User already exists after create retry:", email);
      return { userId: existingAfterCreateError.id, generatedPassword: null };
    }

    throw new Error(
      "Failed to create user via Supabase Auth Admin API: " +
      (error?.message || "missing user in createUser response"),
    );
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