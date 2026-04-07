"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import type { HutkoButtonWidgetConfig } from "@/lib/hutko"
import { isPlanId, PLAN_CONFIG } from "@/lib/plans"
import {
  getInitialPaymentView,
  normalizeCheckoutStatus,
  resolveCheckoutFlow,
  resolvePaymentStatusView,
  type PaymentState,
  type PaymentStatus,
} from "@/lib/payment-flow"
import { Button } from "@/components/ui/button"

type PaymentStatusResponse = {
  status?: PaymentStatus
  order_id?: string | null
}

type PaymentCreateResponse = {
  error?: string
  checkout_url?: string
  order_id?: string
  checkout_correlation_id?: string
  hutko_config?: HutkoButtonWidgetConfig
}

type PaymentSession = {
  mode: "button"
  orderId: string | null
  correlationId: string | null
  config: HutkoButtonWidgetConfig
}

type HutkoWindow = Window & {
  hutko?: (selector: string, config: HutkoButtonWidgetConfig) => void
}

function buildStatusUrl(orderId: string | null, correlationId: string | null) {
  const params = new URLSearchParams()
  if (orderId) params.set("order_id", orderId)
  if (correlationId) params.set("correlation_id", correlationId)
  return `/api/payment/status?${params.toString()}`
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
  const checkoutFlow = resolveCheckoutFlow(planId)
  const status = normalizeCheckoutStatus(searchParams.get("status"))
  const redirectOrderId = searchParams.get("order_id")?.trim() || null
  const redirectCorrelationId = searchParams.get("correlation_id")?.trim() || null
  const plan = PLAN_CONFIG[planId]

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentState, setPaymentState] = useState<PaymentState>("pending")
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null)
  const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null)
  const [hutkoScriptReady, setHutkoScriptReady] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)
  const [widgetError, setWidgetError] = useState<string | null>(null)
  const [widgetReloadKey, setWidgetReloadKey] = useState(0)
  const [embeddedOrderId, setEmbeddedOrderId] = useState<string | null>(null)
  const widgetContainerRef = useRef<HTMLDivElement | null>(null)
  const widgetContainerId = "hutko-payment-widget"
  const isRedirectProcessingState = status === "processing"
  const shouldPollPaymentStatus = isRedirectProcessingState || paymentSession?.mode === "button"
  const activeOrderId = redirectOrderId ?? embeddedOrderId ?? paymentSession?.orderId ?? null
  const activeCorrelationId = redirectCorrelationId ?? paymentSession?.correlationId ?? null

  useEffect(() => { setError(null) }, [name, email])

  useEffect(() => {
    if (isRedirectProcessingState) {
      setPaymentSession(null)
    }
  }, [isRedirectProcessingState])

  useEffect(() => {
    if (paymentSession?.mode !== "button" || paymentState !== "pending") {
      setWidgetReady(false)
      setWidgetError(null)
    }
  }, [paymentSession, paymentState])

  useEffect(() => {
    if (!shouldPollPaymentStatus) {
      setPaymentState("pending")
      setPaymentMessage(null)
      return
    }

    if (!activeOrderId && !activeCorrelationId) {
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
        const res = await fetch(buildStatusUrl(activeOrderId, activeCorrelationId), {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Failed to load payment status")
        }

        const data = await res.json() as PaymentStatusResponse

        if (cancelled) return

        if (data.order_id) {
          setEmbeddedOrderId(data.order_id)
        }

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
  }, [activeCorrelationId, activeOrderId, shouldPollPaymentStatus])

  useEffect(() => {
    if (paymentSession?.mode !== "button" || !hutkoScriptReady || paymentState !== "pending") {
      return
    }

    const hutko = (window as HutkoWindow).hutko

    if (typeof hutko !== "function") {
      setWidgetError("Не вдалося ініціалізувати платіжну форму Hutko. Оновіть сторінку та спробуйте ще раз.")
      return
    }

    const container = widgetContainerRef.current

    if (container) {
      container.innerHTML = ""
    }

    setWidgetReady(false)
    setWidgetError(null)

    try {
      hutko(`#${widgetContainerId}`, paymentSession.config)
    } catch {
      setWidgetError("Платіжна форма Hutko тимчасово не завантажилась. Спробуйте ще раз.")
      return
    }

    let cancelled = false
    const startedAt = Date.now()
    const intervalId = window.setInterval(() => {
      if (cancelled) {
        return
      }

      const hasMountedWidget = Boolean(
        container && (
          container.childElementCount > 0
          || container.querySelector("iframe, form, button, input, [role='dialog']")
        ),
      )

      if (hasMountedWidget) {
        setWidgetReady(true)
        window.clearInterval(intervalId)
        return
      }

      if (Date.now() - startedAt >= 10000) {
        setWidgetError("Платіжна форма Hutko не завантажилась вчасно. Спробуйте ще раз, оновіть сторінку або відкрийте checkout в режимі інкогніто.")
        window.clearInterval(intervalId)
      }
    }, 500)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [hutkoScriptReady, paymentSession, paymentState, widgetReloadKey])

  useEffect(() => {
    if (paymentSession?.mode !== "button" || hutkoScriptReady || paymentState !== "pending") {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setWidgetError("Скрипт Hutko не завантажився вчасно. Оновіть сторінку або спробуйте режим інкогніто.")
    }, 10000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [hutkoScriptReady, paymentSession, paymentState])

  if (isRedirectProcessingState || (paymentSession?.mode === "button" && paymentState !== "pending")) {
    return (
      <Shell>
        <PaymentStatusCard state={paymentState} message={paymentMessage} orderId={activeOrderId} />
      </Shell>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError("Заповніть усі поля"); return }
      setLoading(true); setError(null); setWidgetError(null); setWidgetReady(false); setPaymentSession(null); setEmbeddedOrderId(null)
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          email: email.trim(),
          name: name.trim(),
        }),
      })
      const data = await res.json() as PaymentCreateResponse
      if (!res.ok) {
        setPaymentSession(null)
        setError(data.error || "Не вдалося створити платіж")
        return
      }
      if (data.hutko_config) {
        setPaymentSession({
          mode: "button",
          orderId: data.order_id ?? null,
          correlationId: data.checkout_correlation_id ?? null,
          config: data.hutko_config,
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
      {checkoutFlow === "button" && (
        <Script
          src="https://pay.hutko.org/latest/checkout-vue/checkout.js"
          strategy="afterInteractive"
          onLoad={() => setHutkoScriptReady(true)}
          onError={() => setError("Не вдалося завантажити платіжну форму Hutko. Оновіть сторінку та спробуйте ще раз.")}
        />
      )}

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

        {paymentSession?.mode === "button" && (
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">Крок 2. Завершіть оплату через Hutko payment link</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Нижче завантажена точна Hutko payment-link форма для цього тарифу. Саме тут має відображатися поле промокоду, якщо воно ввімкнене для link/button у Hutko.
              </p>
            </div>

            <div
              ref={widgetContainerRef}
              id={widgetContainerId}
              className="min-h-[420px] rounded-lg border border-border bg-background p-2"
            />

            {widgetError && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <p>{widgetError}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setWidgetError(null)
                    setWidgetReady(false)
                    setWidgetReloadKey((current) => current + 1)
                  }}
                >
                  Спробувати завантажити форму ще раз
                </Button>
              </div>
            )}

            {(!hutkoScriptReady || (!widgetReady && !widgetError)) && (
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Завантажуємо платіжну форму Hutko...
              </p>
            )}

            {paymentMessage && (
              <p className="mt-3 text-xs text-muted-foreground">
                {paymentMessage}
              </p>
            )}

            <p className="mt-3 text-xs text-muted-foreground">
              Номер замовлення: <span className="font-mono">{activeOrderId ?? "створюється"}</span>
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