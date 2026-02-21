import Link from "next/link"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

const premiumFeatures = [
  "30 професійних калькуляторів",
  "Облік пряжі",
  "Генератор візерунків (beta)",
  "Спільнота однодумців",
  "Лічильник рядів",
  "Трекер проєктів",
  "Галерея ідей та натхнення",
]

const plans = [
  {
    name: "6 місяців",
    price: "599.99",
    period: "6 міс",
    perMonth: "100 грн/місяць",
    highlighted: false,
  },
  {
    name: "1 рік",
    price: "918",
    period: "рік",
    perMonth: "76.50 грн/місяць",
    badge: "Найвигідніша",
    highlighted: true,
  },
  {
    name: "Назавжди",
    price: "4 585",
    period: "одноразово",
    perMonth: "Довічний доступ",
    highlighted: false,
  },
]

export function PricingSection() {
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

        {/* Shared features block */}
        <div className="mx-auto mb-10 max-w-md rounded-2xl border border-border bg-card p-6 lg:p-8">
          <h3 className="mb-4 text-center text-lg font-bold text-foreground">
            {"Що входить у Premium"}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {premiumFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Price cards */}
        <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-3">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col items-center rounded-2xl bg-card p-6 text-center ${
                plan.highlighted
                  ? "border-2 border-primary shadow-lg"
                  : "border border-border"
              }`}
            >
              {/* Badge */}
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground whitespace-nowrap">
                    <Crown className="h-3.5 w-3.5" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="text-base font-bold text-foreground">{plan.name}</h3>

              <div className="mt-3 flex flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0">
                <span className="whitespace-nowrap text-2xl font-bold text-foreground sm:text-3xl">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {"грн"}
                </span>
              </div>

              <p className={`mt-1 text-sm font-medium ${plan.highlighted ? "text-primary" : "text-muted-foreground"}`}>
                {plan.perMonth}
              </p>

              <div className="mt-5 w-full">
                <Button
                  className="w-full"
                  size="lg"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href="#subscribe">{"Придбати підписку"}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
