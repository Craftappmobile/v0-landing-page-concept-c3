# WayForPay + Supabase + Resend — Інтеграція платежів (Next.js App Router)

> Повний гайд для інтеграції WayForPay Payment Widget у Next.js (App Router)
> з Supabase (auth + DB) та Resend (email). Перевірено на Next.js 15+.

## Архітектура

```
PaymentModal (ім'я+email) → POST /api/payment/create (HMAC-MD5 підпис)
→ WayForPay Widget (оплата) → POST /api/payment/webhook (верифікація + user + email)
```

## Залежності

```bash
pnpm add @supabase/supabase-js resend
```

## Env-змінні

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
WAYFORPAY_MERCHANT=your_merchant_account
WAYFORPAY_SECRET=your_secret_key
RESEND_API_KEY=re_...
```

> ⚠️ Завжди `.trim()` env-змінні: `process.env.WAYFORPAY_SECRET?.trim()`
> PowerShell pipe-file метод додає `\r\n` до значення!

## SQL (Supabase)

```sql
ALTER TABLE pending_payment_data
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS plan_code TEXT,
  ADD COLUMN IF NOT EXISTS amount NUMERIC;
```

---

## ФАЙЛ: lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  return createClient(supabaseUrl, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
```

---

## ФАЙЛ: app/api/payment/create/route.ts

HMAC-MD5 підпис: `merchant;domain;orderRef;date;amount;UAH;productName;count;price`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase'

const PLANS: Record<string, { name: string; amount: number }> = {
  plan_6m: { name: 'Преміум 6 міс', amount: 599.99 },
  plan_1y: { name: 'Преміум 1 рік', amount: 918 },
  plan_unlimited: { name: 'Безлімітна', amount: 4585 },
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, planCode } = await request.json()
    if (!email || !name || !planCode)
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const plan = PLANS[planCode]
    if (!plan) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 })
    const merchantAccount = process.env.WAYFORPAY_MERCHANT?.trim()
    const merchantSecret = process.env.WAYFORPAY_SECRET?.trim()
    if (!merchantAccount || !merchantSecret)
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })

    const merchantDomainName = 'YOUR-DOMAIN.vercel.app' // ← ваш домен
    const orderReference = `WFP_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const orderDate = String(Math.floor(Date.now() / 1000))
    const amount = String(plan.amount)
    // HMAC-MD5 — порядок полів КРИТИЧНИЙ!
    const signString = [
      merchantAccount, merchantDomainName, orderReference, orderDate,
      amount, 'UAH', plan.name, '1', amount,
    ].join(';')
    const merchantSignature = crypto
      .createHmac('md5', merchantSecret).update(signString, 'utf8').digest('hex')

    const supabase = createAdminClient()
    await supabase.from('pending_payment_data').insert({
      cardholder_name: name, email, plan_code: planCode,
      amount: plan.amount, order_reference: orderReference,
    })
    const nameParts = name.trim().split(/\s+/)
    return NextResponse.json({
      merchantAccount, merchantDomainName,
      merchantTransactionSecureType: 'AUTO',
      authorizationType: 'SimpleSignature',
      merchantSignature, orderReference, orderDate, amount,
      currency: 'UAH', productName: plan.name,
      productCount: '1', productPrice: amount,
      clientFirstName: nameParts[0],
      clientLastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0],
      clientEmail: email, language: 'UA',
      serviceUrl: `https://${merchantDomainName}/api/payment/webhook`,
    })
  } catch (error) {
    console.error('Payment create error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
```


---

## ФАЙЛ: app/api/payment/webhook/route.ts

Верифікація callback: `merchant;orderRef;amount;currency;authCode;cardPan;status;reasonCode`

```typescript
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
  if (!merchantSecret) return NextResponse.json({ error: 'Not configured' }, { status: 500 })

  let body: Record<string, unknown>
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    merchantAccount, orderReference, amount, currency,
    authCode, cardPan, transactionStatus, reasonCode,
    merchantSignature, transactionId,
  } = body as Record<string, string>

  // Верифікація підпису
  const signString = [
    merchantAccount, orderReference, amount, currency,
    authCode, cardPan, transactionStatus, reasonCode,
  ].join(';')
  const expectedSignature = crypto
    .createHmac('md5', merchantSecret).update(signString, 'utf8').digest('hex')

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
      .from('pending_payment_data').select('*')
      .eq('order_reference', orderReference).single()

    if (!pending) return buildWfpResponse(orderReference, merchantSecret)

    const { email, cardholder_name, plan_code } = pending
    const planConfig = PLAN_DURATION[plan_code] || PLAN_DURATION.plan_6m

    // Створення або пошук користувача
    const { userId, generatedPassword } = await getOrCreateUser(supabase, email, cardholder_name)

    // Запис платежу
    const { data: paymentLog } = await supabase.from('payment_logs').insert({
      user_id: userId, order_reference: orderReference,
      amount: Number(amount), currency: currency || 'UAH',
      status: 'approved', payment_method: 'wayforpay',
      payment_provider: 'wayforpay', platform: 'web',
      wayforpay_order_reference: orderReference,
      wayforpay_transaction_id: transactionId || null,
      wayforpay_data: body,
    }).select('id').single()

    // Створення підписки
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setMonth(expiresAt.getMonth() + planConfig.months)

    await supabase.from('subscriptions').insert({
      user_id: userId, plan_type: planConfig.type, status: 'active',
      started_at: now.toISOString(), expires_at: expiresAt.toISOString(),
      payment_log_id: paymentLog?.id || null,
      payment_provider: 'wayforpay', platform: 'web', auto_renewal: false,
    })

    await supabase.from('profiles').update({
      subscription_type: planConfig.type,
      subscription_expires_at: expiresAt.toISOString(),
      updated_at: now.toISOString(),
    }).eq('id', userId)

    // Email з паролем (тільки для нових користувачів)
    if (generatedPassword) {
      await sendWelcomeEmail(email, generatedPassword, planConfig.type, cardholder_name)
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
  }

  return buildWfpResponse(orderReference, merchantSecret)
}

async function getOrCreateUser(
  supabase: ReturnType<typeof createAdminClient>, email: string, fullName: string,
): Promise<{ userId: string; generatedPassword: string | null }> {
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const existing = existingUsers?.users?.find((u) => u.email === email)
  if (existing) return { userId: existing.id, generatedPassword: null }

  const generatedPassword = crypto.randomBytes(9).toString('base64url').slice(0, 12)
  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email, password: generatedPassword, email_confirm: true,
    user_metadata: { full_name: fullName },
  })
  if (error || !newUser.user) throw new Error('Failed to create user: ' + error?.message)

  await supabase.from('profiles').upsert({
    id: newUser.user.id, email, full_name: fullName,
    name: fullName, subscription_type: 'free',
  })
  return { userId: newUser.user.id, generatedPassword }
}

function buildWfpResponse(orderReference: string, secret: string): NextResponse {
  const time = Math.floor(Date.now() / 1000)
  const signStr = orderReference + ';accept;' + time
  const signature = crypto.createHmac('md5', secret).update(signStr, 'utf8').digest('hex')
  return NextResponse.json({ orderReference, status: 'accept', time, signature })
}
```

---

## ФАЙЛ: lib/email.ts

```typescript
import { Resend } from 'resend'

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) throw new Error('RESEND_API_KEY is not set')
  return new Resend(apiKey)
}

const PLAN_NAMES: Record<string, string> = {
  premium_6m: 'Преміум 6-місячна підписка',
  premium_1y: 'Преміум річна підписка',
  unlimited: 'Безлімітна підписка (назавжди)',
}

export async function sendWelcomeEmail(
  to: string, password: string, planType: string, fullName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    const planName = PLAN_NAMES[planType] || planType
    const { error } = await resend.emails.send({
      from: 'Your App <onboarding@resend.dev>',
      to: [to],
      subject: '🧶 Ваша підписка активована!',
      html: `
        <h1>Привіт, ${fullName}!</h1>
        <p>Ваш план: <strong>${planName}</strong></p>
        <p><strong>Логін:</strong> ${to}</p>
        <p><strong>Пароль:</strong> <code>${password}</code></p>
        <p>⚠️ Збережіть пароль!</p>
      `,
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
```

---

## ФАЙЛ: components/landing/payment-modal.tsx

```tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ShieldCheck } from 'lucide-react'

const paymentSchema = z.object({
  name: z.string().min(2, "Ім'я має бути не менше 2 символів"),
  email: z.string().email('Невірний формат email'),
})

interface PaymentModalProps {
  open: boolean; onOpenChange: (open: boolean) => void
  planCode: string; planName: string; amount: string
}

export function PaymentModal({ open, onOpenChange, planCode, planName, amount }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { name: '', email: '' },
  })

  async function onSubmit(values: z.infer<typeof paymentSchema>) {
    setIsLoading(true); setError(null)
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, name: values.name, planCode }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Помилка')
      onOpenChange(false)

      // Завантаження WayForPay Widget
      await loadWayForPayScript()
      const wp = new (window as any).Wayforpay()
      wp.run(data,
        function () { alert('✅ Оплата успішна!') },
        function () { alert('❌ Оплату відхилено.') },
        function () { alert('⏳ Платіж обробляється.') },
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Щось пішло не так')
    } finally { setIsLoading(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оформлення підписки</DialogTitle>
          <DialogDescription>{planName} — {amount} грн</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>{"Ім'я та прізвище"}</FormLabel>
                <FormControl><Input placeholder="Олена Петренко" {...field} /></FormControl>
                <FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
                <FormMessage /></FormItem>
            )} />
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Зачекайте...</> : `Оплатити ${amount} грн`}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />Безпечна оплата через WayForPay
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function loadWayForPayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('widget-wfp-script')) { resolve(); return }
    const script = document.createElement('script')
    script.id = 'widget-wfp-script'
    script.src = 'https://secure.wayforpay.com/server/pay-widget.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Не вдалося завантажити WayForPay'))
    document.head.appendChild(script)
  })
}
```

---

## Використання в pricing-section.tsx

```tsx
'use client'
import { useState } from 'react'
import { PaymentModal } from '@/components/landing/payment-modal'

// В компоненті:
const [modalOpen, setModalOpen] = useState(false)
const [selectedPlan, setSelectedPlan] = useState<{ code: string; name: string; amount: string } | null>(null)

function openPayment(planCode: string, planName: string, amount: string) {
  setSelectedPlan({ code: planCode, name: planName, amount })
  setModalOpen(true)
}

// В JSX кнопки:
<Button onClick={() => openPayment('plan_1y', 'Преміум 1 рік', '918')}>Придбати</Button>

// В кінці компонента:
{selectedPlan && (
  <PaymentModal open={modalOpen} onOpenChange={setModalOpen}
    planCode={selectedPlan.code} planName={selectedPlan.name} amount={selectedPlan.amount} />
)}
```

---

## Тестові картки WayForPay

| Картка | Номер | CVV | Термін |
|--------|-------|-----|--------|
| Visa | `4111 1111 1111 1111` | `123` | будь-який майбутній |
| MasterCard | `5168 7572 0000 0077` | `123` | будь-який майбутній |

## Важливі нотатки

1. **HMAC-MD5 підпис** — порядок полів КРИТИЧНИЙ, всі значення як строки
2. **merchantDomainName** — має збігатися з доменом у кабінеті WayForPay
3. **Мерчант має бути активований** — пройти модерацію в WayForPay
4. **`.trim()` для env-змінних** — PowerShell додає `\r\n` при pipe
5. **Webhook response** — WayForPay очікує `{ orderReference, status: 'accept', time, signature }`
6. **Resend.com** — безкоштовний план дозволяє відправку тільки з `onboarding@resend.dev`