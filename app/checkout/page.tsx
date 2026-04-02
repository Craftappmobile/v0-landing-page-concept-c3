"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import { isPlanId, PLAN_CONFIG } from "@/lib/plans"
import {
  getInitialPaymentView,
  normalizeCheckoutStatus,
  resolvePaymentStatusView,
  type PaymentState,
  type PaymentStatus,
} from "@/lib/payment-flow"
import { Button } from "@/components/ui/button"

type PaymentStatusResponse = {
  status?: PaymentStatus
}

type PaymentCreateResponse = {
  error?: string
  checkout_url?: string
  order_id?: string
}

type EmbeddedCheckoutSession = {
  orderId: string
  checkoutUrl: string
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
  const status = normalizeCheckoutStatus(searchParams.get("status"))
  const redirectOrderId = searchParams.get("order_id")?.trim() || null
  const plan = PLAN_CONFIG[planId]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>("pending")
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)
  const [paymentSession, setPaymentSession] = useState<EmbeddedCheckoutSession | null>(null)
  const [embeddedOrderId, setEmbeddedOrderId] = useState<string | null>(null)
  const checkoutFrameRef = useRef<HTMLIFrameElement | null>(null)
  const isProcessingState = status === "processing" || !!embeddedOrderId
  const activeOrderId = redirectOrderId ?? embeddedOrderId

  useEffect(() => { setError(null) }, [name, email])

  useEffect(() => {
    if (isProcessingState) {
      setPaymentSession(null)
    }
  }, [isProcessingState])

  useEffect(() => {
    if (!isProcessingState) {
      setPaymentState("pending")
      setPaymentMessage(null)
      return
    }

    if (!activeOrderId) {
      const initialView = getInitialPaymentView(activeOrderId)
      setPaymentState(initialView.state)
      setPaymentMessage(initialView.message)
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const maxAttempts = 12
    const intervalMs = 2500

    const pollStatus = async (attempt: number) => {
      try {
        const res = await fetch(`/api/payment/status?order_id=${encodeURIComponent(activeOrderId)}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Failed to load payment status")
        }

        const data = await res.json() as PaymentStatusResponse

        if (cancelled) return

        const nextView = resolvePaymentStatusView({
          status: data.status ?? "not_found",
          attempt,
          maxAttempts,
        })

        setPaymentState(nextView.state)
        setPaymentMessage(nextView.message)

        if (nextView.state !== "pending") {
          return
        }
      } catch {
        if (cancelled) return

        const errorView = resolvePaymentStatusView({ status: "error", attempt, maxAttempts })
        setPaymentState(errorView.state)
        setPaymentMessage(errorView.message)
      }

      if (!cancelled && attempt < maxAttempts - 1) {
        timeoutId = setTimeout(() => {
          void pollStatus(attempt + 1)
        }, intervalMs)
      }
    }

    const initialView = getInitialPaymentView(activeOrderId)
    setPaymentState(initialView.state)
    setPaymentMessage(initialView.message)
    void pollStatus(0)

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [activeOrderId, isProcessingState])

  if (isProcessingState) {
    return (
      <Shell>
        <PaymentStatusCard state={paymentState} message={paymentMessage} orderId={activeOrderId} />
      </Shell>
    )
  }

  function handleCheckoutFrameLoad() {
    const iframe = checkoutFrameRef.current

    if (!iframe) {
      return
    }

    try {
      const frameLocation = iframe.contentWindow?.location

      if (!frameLocation || frameLocation.origin !== window.location.origin) {
        return
      }

      const frameUrl = new URL(frameLocation.href)
      const frameStatus = normalizeCheckoutStatus(frameUrl.searchParams.get("status"))
      const frameOrderId = frameUrl.searchParams.get("order_id")?.trim() || null

      if (frameStatus === "processing" && frameOrderId) {
        setEmbeddedOrderId(frameOrderId)
        setPaymentSession(null)
      }
    } catch {
      // Ignore cross-origin loads while the user is on the Hutko payment page.
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError("Заповніть усі поля"); return }
    setLoading(true); setError(null); setEmbeddedOrderId(null)
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, email: email.trim(), name: name.trim(), flow: "redirect" }),
      })
      const data = await res.json() as PaymentCreateResponse
      if (!res.ok) {
        setPaymentSession(null)
        setError(data.error || "Не вдалося створити платіж")
        return
      }
      if (data.checkout_url && data.order_id) {
        setPaymentSession({
          orderId: data.order_id,
          checkoutUrl: data.checkout_url,
        })
        return
      }
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
          <input id="name" type="text" required disabled={loading || !!paymentSession} value={name} onChange={e => setName(e.target.value)}
            placeholder="Ваше ім'я" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" type="email" required disabled={loading || !!paymentSession} value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          <p className="mt-1 text-xs text-muted-foreground">
            Вкажіть email, з яким ви входите в додаток — підписка активується автоматично.
          </p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

        {!paymentSession && (
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Обробка...</> : `Оплатити ${plan.priceWithCurrency}`}
          </Button>
        )}

        {paymentSession && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">Крок 2. Завершіть оплату через Hutko</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Замовлення вже створено. Платіжна форма відкрилася нижче без редиректу на окрему сторінку.
              </p>
            </div>

            <iframe
              ref={checkoutFrameRef}
              src={paymentSession.checkoutUrl}
              title="Оплата через Hutko"
              onLoad={handleCheckoutFrameLoad}
              allow="payment *"
              className="min-h-[680px] w-full rounded-lg border border-border bg-background"
            />

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href={paymentSession.checkoutUrl} target="_blank" rel="noopener noreferrer">
                  Відкрити оплату в окремій вкладці
                </a>
              </Button>
              <p className="text-xs text-muted-foreground sm:self-center">
                Якщо форма не завантажилась у цьому вікні, відкрийте її окремо.
              </p>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Номер замовлення: <span className="font-mono">{paymentSession.orderId}</span>
            </p>
          </div>
        )}
      </form>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />Безпечна оплата через платіжний сервіс <strong>Hutko</strong></p>
        {planId === "forever"
          ? <p>Одноразовий платіж — доступ назавжди без автоматичних списань.</p>
          : <p>Підписка продовжується автоматично після закінчення терміну. Ви можете <Link href="/cancel" className="text-primary underline hover:no-underline">скасувати її на сайті</Link> будь-коли.</p>
        }
        <p>Повернення коштів — протягом 14 днів.</p>
        <p>Після підтвердження оплати ми автоматично перевіримо callback і активуємо підписку.</p>
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