"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import { isPlanId, PLAN_CONFIG } from "@/lib/plans"
import { Button } from "@/components/ui/button"

type PaymentState = "pending" | "success" | "failure"
type PaymentStatusResponse = {
  status?: "pending" | "active" | "failed" | "not_found"
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Shell><div className="text-center py-12"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div></Shell>}>
      <CheckoutForm />
    </Suspense>
  )
}

function CheckoutForm() {
  const searchParams = useSearchParams()
  const requestedPlanId = searchParams.get("plan") || "year"
  const planId = isPlanId(requestedPlanId) ? requestedPlanId : "year"
  const rawStatus = searchParams.get("status")
  const status = rawStatus === "done" ? "processing" : rawStatus
  const orderId = searchParams.get("order_id")?.trim() || null
  const isProcessingState = status === "processing"
  const plan = PLAN_CONFIG[planId]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>("pending")
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)

  useEffect(() => { setError(null) }, [name, email])

  useEffect(() => {
    if (!isProcessingState) {
      setPaymentState("pending")
      setPaymentMessage(null)
      return
    }

    if (!orderId) {
      setPaymentState("pending")
      setPaymentMessage("Ми обробляємо платіж. Якщо кошти вже списані, підтвердження надійде на вашу електронну пошту.")
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const maxAttempts = 12
    const intervalMs = 2500

    const pollStatus = async (attempt: number) => {
      try {
        const res = await fetch(`/api/payment/status?order_id=${encodeURIComponent(orderId)}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Failed to load payment status")
        }

        const data = await res.json() as PaymentStatusResponse

        if (cancelled) return

        if (data.status === "active") {
          setPaymentState("success")
          setPaymentMessage("Оплату підтверджено. Підписка активується автоматично, а деталі ми надішлемо на email.")
          return
        }

        if (data.status === "failed") {
          setPaymentState("failure")
          setPaymentMessage("Оплату не вдалося підтвердити. Якщо кошти були списані, напишіть нам — ми перевіримо платіж вручну.")
          return
        }

        setPaymentState("pending")
        setPaymentMessage(
          attempt >= maxAttempts - 1
            ? "Платіж ще обробляється. Якщо підтвердження затримується, перевірте email трохи пізніше."
            : "Ми очікуємо підтвердження платежу. Зазвичай це займає кілька секунд.",
        )
      } catch {
        if (cancelled) return

        setPaymentState("pending")
        setPaymentMessage("Ми очікуємо підтвердження платежу. Якщо лист не надійде протягом кількох хвилин, напишіть нам.")
      }

      if (!cancelled && attempt < maxAttempts - 1) {
        timeoutId = setTimeout(() => {
          void pollStatus(attempt + 1)
        }, intervalMs)
      }
    }

    setPaymentState("pending")
    setPaymentMessage("Ми очікуємо підтвердження платежу. Зазвичай це займає кілька секунд.")
    void pollStatus(0)

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isProcessingState, orderId])

  if (isProcessingState) {
    return (
      <Shell>
        <PaymentStatusCard state={paymentState} message={paymentMessage} orderId={orderId} />
      </Shell>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError("Заповніть усі поля"); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, email: email.trim(), name: name.trim() }),
      })
      const data = await res.json()
      if (data.checkout_url) { window.location.href = data.checkout_url; return }
      setError(data.error || "Не вдалося створити платіж")
    } catch { setError("Помилка з'єднання. Спробуйте ще раз.") }
    finally { setLoading(false) }
  }

  return (
    <Shell>
      <Link href="/#pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад до тарифів
      </Link>

      <h1 className="text-2xl font-bold mb-1">Оформлення підписки</h1>
      <p className="text-muted-foreground mb-6">
        Тариф: <strong>{plan.checkoutLabel}</strong> — <strong>{plan.priceWithCurrency}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Ім&apos;я</label>
          <input id="name" type="text" required value={name} onChange={e => setName(e.target.value)}
            placeholder="Ваше ім'я" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          <p className="mt-1 text-xs text-muted-foreground">
            Вкажіть email, з яким ви входите в додаток — підписка активується автоматично.
          </p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Обробка...</> : `Оплатити ${plan.priceWithCurrency}`}
        </Button>
      </form>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />Безпечна оплата через платіжний сервіс <strong>Hutko</strong></p>
        {planId === "forever"
          ? <p>Одноразовий платіж — доступ назавжди без автоматичних списань.</p>
          : <p>Підписка продовжується автоматично після закінчення терміну. Ви можете <Link href="/cancel" className="text-primary underline hover:no-underline">скасувати її на сайті</Link> будь-коли.</p>
        }
        <p>Повернення коштів — протягом 14 днів.</p>
        <p>Після оплати ви будете перенаправлені на сторінку Hutko для введення даних картки.</p>
      </div>
    </Shell>
  )
}

function PaymentStatusCard({
  state,
  message,
  orderId,
}: {
  state: PaymentState
  message: string | null
  orderId: string | null
}) {
  const isSuccess = state === "success"
  const isFailure = state === "failure"

  return (
    <div className="text-center py-8">
      {isSuccess ? (
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
      ) : isFailure ? (
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-600" />
      ) : (
        <Loader2 className="mx-auto mb-4 h-16 w-16 animate-spin text-primary" />
      )}

      <h1 className="text-2xl font-bold mb-2">
        {isSuccess ? "Оплату підтверджено" : isFailure ? "Не вдалося підтвердити оплату" : "Платіж обробляється"}
      </h1>

      <p className="text-muted-foreground mb-3">
        {message || "Ми перевіряємо статус вашого платежу."}
      </p>

      {orderId && (
        <p className="mb-6 text-xs text-muted-foreground">
          Номер замовлення: <span className="font-mono">{orderId}</span>
        </p>
      )}

      <div className="space-y-3">
        <Button asChild><Link href="/">На головну</Link></Button>
        {isFailure && (
          <p className="text-sm text-muted-foreground">
            Спробуйте оплату ще раз з головної сторінки або зверніться в підтримку.
          </p>
        )}
      </div>
    </div>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

