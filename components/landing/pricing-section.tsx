"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

const premiumFeatures = [
  "Необмежена кількість проєктів та запасів пряжі",
  "Доступ до ВСІХ 30 калькуляторів",
  "Хмарна синхронізація між усіма пристроями",
  "Публікація власних робіт у спільноті",
  "Робота в офлайн-режимі — в'яжіть де завгодно!",
  "Пріоритетна підтримка",
]

const freeFeatures = [
  "5 базових калькуляторів",
  "1 активний проєкт",
  "Перегляд спільноти",
  "Базовий облік пряжі",
]

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

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

          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-card p-1 shadow-sm border border-border">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !annual
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {"Щомісяця"}
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                annual
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {"Щорічно"}
              <span className="ml-1.5 text-xs opacity-80">{"-30%"}</span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-6 lg:p-8">
            <h3 className="text-lg font-bold text-foreground">{"Безкоштовно"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {"Ідеально для початку"}
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">{"0"}</span>
              <span className="text-lg text-muted-foreground">{"грн"}</span>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button variant="outline" className="w-full" size="lg">
                {"Завантажити безкоштовно"}
              </Button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-card p-6 shadow-lg lg:p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                <Crown className="h-3.5 w-3.5" />
                {"Найпопулярніший"}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground">{"Premium"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {"Повний доступ до всіх функцій"}
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-foreground">
                {annual ? "69" : "99"}
              </span>
              <span className="text-lg text-muted-foreground">
                {"грн/"}
                {annual ? "міс" : "міс"}
              </span>
            </div>
            {annual && (
              <p className="mt-1 text-xs text-muted-foreground">
                {"828 грн/рік — економія 360 грн"}
              </p>
            )}

            <ul className="mt-8 flex flex-col gap-3">
              {premiumFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Button className="w-full" size="lg" asChild>
                <Link href="#subscribe">{"Оформити підписку"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
