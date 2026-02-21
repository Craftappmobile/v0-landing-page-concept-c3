"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "Всі 30 калькуляторів",
  "CRM обліку пряжі та бюджету",
  "Галерея ідей з YouTube і Pinterest",
  "Спільнота майстринь",
  "Генератор візерунків (beta)",
]

const plans = [
  {
    id: "half",
    tab: "6 місяців",
    price: "599.99",
    period: "6 міс",
    perMonth: "100 грн/місяць",
    badge: null,
  },
  {
    id: "year",
    tab: "Річна",
    price: "918",
    period: "рік",
    perMonth: "76.50 грн/місяць",
    badge: "Економія 24%",
  },
  {
    id: "forever",
    tab: "Назавжди",
    price: "4 585",
    period: "одноразово",
    perMonth: "Довічний доступ",
    badge: null,
  },
]

export function PricingSection() {
  const [activeIdx, setActiveIdx] = useState(1)
  const plan = plans[activeIdx]

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

        {/* Single card */}
        <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Period tabs */}
          <div className="mx-auto mb-8 flex w-fit rounded-lg border border-border bg-secondary/60 p-1">
            {plans.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  i === activeIdx
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.tab}
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="mb-6 text-center">
            {plan.badge && (
              <span className="mb-2 inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                {plan.badge}
              </span>
            )}
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold text-foreground sm:text-5xl">
                {plan.price}
              </span>
              <span className="text-base text-muted-foreground">
                {"грн / "}{plan.period}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {plan.perMonth}
            </p>
          </div>

          {/* Divider */}
          <div className="mb-6 border-t border-border" />

          {/* Features */}
          <ul className="mb-8 flex flex-col gap-3">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Button className="w-full" size="lg" asChild>
            <Link href="#subscribe">{"Придбати підписку"}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
