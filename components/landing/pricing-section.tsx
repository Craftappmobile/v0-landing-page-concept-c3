/**
 * Секція тарифних планів (Pricing).
 *
 * Відображає три тарифи підписки:
 * - Преміум 6 місяців: 599.99 грн
 * - Преміум 1 рік: 918 грн (виділений як найвигідніший)
 * - Безлімітна (lifetime): 4 585 грн
 *
 * Кнопка "Придбати підписку" відкриває PaymentModal для оформлення оплати через WayForPay.
 */
'use client'

import { useState } from "react"
import { Check, Crown, Infinity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PaymentModal } from "@/components/landing/payment-modal"

/**
 * Список можливостей, що входять до будь-якого преміум-плану.
 * Відображається у кожній карточці тарифу.
 */
const features = [
  "Всі калькулятори",
  "Облік пряжі",
  "Генератор візерунків (beta)",
  "Спільнота",
  "Лічильник рядів",
]

/**
 * Конфігурація тарифних планів підписки.
 *
 * Поля:
 * - `name`       — назва тарифу для відображення
 * - `price`      — ціна в гривнях (рядок для форматування)
 * - `period`     — тривалість підписки
 * - `perMonth`   — вартість на місяць (null для безліміту)
 * - `badge`      — текст бейджа (null якщо без бейджа)
 * - `highlighted`— true для виділеного (рекомендованого) тарифу
 * - `isUnlimited`— true для lifetime підписки
 *
 * @remarks Кожен план має `planCode` для ідентифікації при оплаті через WayForPay.
 */
const plans = [
  {
    name: "Преміум 6-місячна підписка",
    price: "599.99",
    planCode: "plan_6m",
    period: "6 міс",
    perMonth: "100 грн/місяць",
    badge: null,
    badgeStyle: "",
    highlighted: false,
  },
  {
    name: "Преміум річна підписка",
    price: "918",
    planCode: "plan_1y",
    period: "рік",
    perMonth: "76.50 грн/місяць",
    badge: "Найвигідніша пропозиція",
    badgeStyle: "bg-primary text-primary-foreground",
    highlighted: true,
  },
  {
    name: "Безлімітна підписка",
    price: "4 585",
    planCode: "plan_unlimited",
    period: "назавжди",
    perMonth: null,
    badge: null,
    badgeStyle: "",
    highlighted: false,
    isUnlimited: true,
  },
]

/**
 * Секція з картками тарифних планів.
 * Рендерить grid із трьох карток на основі масиву `plans`.
 * Виділений тариф (`highlighted: true`) має зелену рамку та бейдж.
 */
export function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    code: string
    name: string
    amount: string
  } | null>(null)

  function openPayment(planCode: string, planName: string, amount: string) {
    setSelectedPlan({ code: planCode, name: planName, amount })
    setModalOpen(true)
  }

  return (
    <section id="pricing" className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {"Підписка"}
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
            {"Розкрийте повний потенціал додатка"}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {"Оберіть план, що підходить саме вам"}
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col rounded-2xl bg-card p-6 lg:p-8 ${
                plan.highlighted
                  ? "border-2 border-primary shadow-lg"
                  : "border border-border"
              }`}
            >
              {/* Badge */}
              {plan.highlighted ? (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground whitespace-nowrap">
                    <Crown className="h-3.5 w-3.5" />
                    {plan.badge}
                  </span>
                </div>
              ) : null}

              <h3 className={`text-lg font-bold text-foreground ${plan.highlighted ? "text-center" : ""}`}>{plan.name}</h3>

              {!plan.highlighted && plan.badge && (
                <span
                  className={`mt-2 inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${plan.badgeStyle}`}
                >
                  {plan.isUnlimited && <Infinity className="h-3.5 w-3.5" />}
                  {plan.badge}
                </span>
              )}

              <div className={`mt-5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0 ${plan.highlighted ? "justify-center" : ""}`}>
                <span className="whitespace-nowrap text-2xl font-bold text-foreground sm:text-3xl">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground sm:text-base">
                  {"грн"}
                </span>
                <span className="text-sm text-muted-foreground sm:text-base">
                  {"/ " + plan.period}
                </span>
              </div>

              {plan.perMonth && (
                <p className={`mt-1 text-sm font-medium text-primary ${plan.highlighted ? "text-center" : ""}`}>
                  {plan.perMonth}
                </p>
              )}
              {plan.isUnlimited && (
                <p className="mt-1 text-sm font-medium text-accent">
                  {"Одноразовий платіж — доступ назавжди"}
                </p>
              )}

              <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-6">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => openPayment(plan.planCode, plan.name, plan.price)}
                >
                  {"Придбати підписку"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          planCode={selectedPlan.code}
          planName={selectedPlan.name}
          amount={selectedPlan.amount}
        />
      )}
    </section>
  )
}
