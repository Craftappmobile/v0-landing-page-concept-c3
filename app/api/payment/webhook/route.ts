/**
 * API Route: POST /api/payment/webhook
 *
 * Webhook-endpoint for WayForPay.
 * Called automatically after payment (serviceUrl).
 */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email'

const PLAN_DURATION: Record<string, { months: number; type: string }> = {
  plan_6m: { months: 6, type: 'premium_6m' },
  plan_1y: { months: 12, type: 'premium_1y' },
  plan_unlimited: { months: 1200, type: 'unlimited' },
}

export async function POST(request: NextRequest) {
  const merchantSecret = process.env.WAYFORPAY_SECRET?.trim()
  if (!merchantSecret) {
    console.error('WAYFORPAY_SECRET not configured')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    merchantAccount, orderReference, amount, currency,
    authCode, cardPan, transactionStatus, reasonCode,
    merchantSignature, transactionId,
  } = body as Record<string, string>

  const signString = [
    merchantAccount, orderReference, amount, currency,
    authCode, cardPan, transactionStatus, reasonCode,
  ].join(';')

  const expectedSignature = crypto
    .createHmac('md5', merchantSecret)
    .update(signString, 'utf8')
    .digest('hex')

  if (merchantSignature !== expectedSignature) {
    console.error('Invalid WayForPay signature', { orderReference })
    return buildWfpResponse(orderReference, merchantSecret)
  }

  if (transactionStatus !== 'Approved') {
    return buildWfpResponse(orderReference, merchantSecret)
  }

  try {
    const supabase = createAdminClient()

    const { data: pending } = await supabase
      .from('pending_payment_data')
      .select('*')
      .eq('order_reference', orderReference)
      .single()

    if (!pending) {
      console.error('Pending payment not found:', orderReference)
      return buildWfpResponse(orderReference, merchantSecret)
    }

    const { email, cardholder_name, plan_code } = pending
    const planConfig = PLAN_DURATION[plan_code] || PLAN_DURATION.plan_6m

    const { userId, generatedPassword } = await getOrCreateUser(
      supabase, email, cardholder_name,
    )

    const { data: paymentLog } = await supabase
      .from('payment_logs')
      .insert({
        user_id: userId,
        order_reference: orderReference,
        amount: Number(amount),
        currency: currency || 'UAH',
        status: 'approved',
        payment_method: 'wayforpay',
        payment_provider: 'wayforpay',
        platform: 'web',
        wayforpay_order_reference: orderReference,
        wayforpay_transaction_id: transactionId || null,
        wayforpay_data: body,
      })
      .select('id')
      .single()

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setMonth(expiresAt.getMonth() + planConfig.months)

    await supabase.from('subscriptions').insert({
      user_id: userId,
      plan_type: planConfig.type,
      status: 'active',
      started_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      payment_log_id: paymentLog?.id || null,
      payment_provider: 'wayforpay',
      platform: 'web',
      auto_renewal: false,
    })

    await supabase.from('profiles').update({
      subscription_type: planConfig.type,
      subscription_expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString(),
    }).eq('id', userId)

    // ЕТАП 4: Відправка привітального email з паролем
    if (generatedPassword) {
      await sendWelcomeEmail(email, generatedPassword, planConfig.type, cardholder_name)
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
  }

  return buildWfpResponse(orderReference, merchantSecret)
}

async function getOrCreateUser(
  supabase: ReturnType<typeof createAdminClient>,
  email: string,
  fullName: string,
): Promise<{ userId: string; generatedPassword: string | null }> {
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users?.find((u) => u.email === email)

  if (existing) {
    return { userId: existing.id, generatedPassword: null }
  }

  const generatedPassword = crypto.randomBytes(9).toString('base64url').slice(0, 12)

  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    password: generatedPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (error || !newUser.user) {
    throw new Error('Failed to create user: ' + error?.message)
  }

  await supabase.from('profiles').upsert({
    id: newUser.user.id,
    email,
    full_name: fullName,
    name: fullName,
    subscription_type: 'free',
  })

  return { userId: newUser.user.id, generatedPassword }
}

function buildWfpResponse(orderReference: string, secret: string): NextResponse {
  const time = Math.floor(Date.now() / 1000)
  const signStr = orderReference + ';accept;' + time
  const signature = crypto
    .createHmac('md5', secret)
    .update(signStr, 'utf8')
    .digest('hex')

  return NextResponse.json({
    orderReference,
    status: 'accept',
    time,
    signature,
  })
}