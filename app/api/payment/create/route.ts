/**
 * API Route: POST /api/payment/create
 *
 * Генерує підписані дані для ініціалізації WayForPay Payment Widget.
 *
 * @requestBody { email: string, name: string, planCode: "plan_6m" | "plan_1y" | "plan_unlimited" }
 * @returns Об'єкт з параметрами для `wayforpay.run()`
 *
 * Крок HMAC-MD5:
 *   merchantAccount;merchantDomainName;orderReference;orderDate;amount;currency;
 *   productName[0];productCount[0];productPrice[0]
 */
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase'

/** Конфігурація тарифних планів з цінами */
const PLANS: Record<string, { name: string; amount: number }> = {
  plan_6m: { name: 'Преміум 6-місячна підписка', amount: 599.99 },
  plan_1y: { name: 'Преміум річна підписка', amount: 918 },
  plan_unlimited: { name: 'Безлімітна підписка', amount: 4585 },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, planCode } = body

    // --- Валідація ---
    if (!email || !name || !planCode) {
      return NextResponse.json(
        { error: 'Заповніть усі поля: email, ім\'я, тарифний план' },
        { status: 400 },
      )
    }

    const plan = PLANS[planCode]
    if (!plan) {
      return NextResponse.json(
        { error: 'Невідомий тарифний план' },
        { status: 400 },
      )
    }

    // --- Перевірка конфігурації ---
    const merchantAccount = process.env.WAYFORPAY_MERCHANT
    const merchantSecret = process.env.WAYFORPAY_SECRET

    if (!merchantAccount || !merchantSecret) {
      console.error('WayForPay not configured: WAYFORPAY_MERCHANT or WAYFORPAY_SECRET missing')
      return NextResponse.json(
        { error: 'Платіжна система не налаштована' },
        { status: 500 },
      )
    }

    // --- Генерація даних замовлення ---
    const merchantDomainName =
      request.headers.get('host') || 'v0-landing-page-concept.vercel.app'
    const orderReference = `WFP_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const orderDate = Math.floor(Date.now() / 1000)

    // --- HMAC-MD5 підпис ---
    const signString = [
      merchantAccount,
      merchantDomainName,
      orderReference,
      orderDate,
      plan.amount,
      'UAH',
      plan.name,
      1,
      plan.amount,
    ].join(';')

    const merchantSignature = crypto
      .createHmac('md5', merchantSecret)
      .update(signString, 'utf8')
      .digest('hex')

    // --- Збереження в Supabase ---
    const supabase = createAdminClient()
    const { error: dbError } = await supabase.from('pending_payment_data').insert({
      cardholder_name: name,
      email,
      plan_code: planCode,
      amount: plan.amount,
      order_reference: orderReference,
    })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      // Не блокуємо оплату при помилці запису
    }

    // --- Повернення даних для WayForPay Widget ---
    // Розділення імені на ім'я та прізвище
    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName

    return NextResponse.json({
      merchantAccount,
      merchantDomainName,
      authorizationType: 'SimpleSignature',
      merchantSignature,
      orderReference,
      orderDate,
      amount: plan.amount,
      currency: 'UAH',
      productName: [plan.name],
      productCount: [1],
      productPrice: [plan.amount],
      clientFirstName: firstName,
      clientLastName: lastName,
      clientEmail: email,
      language: 'UA',
      serviceUrl: `https://${merchantDomainName}/api/payment/webhook`,
    })
  } catch (error) {
    console.error('Payment create error:', error)
    return NextResponse.json(
      { error: 'Внутрішня помилка сервера' },
      { status: 500 },
    )
  }
}

