import Link from "next/link"
import { Check, Crown, Infinity } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  "Всі калькулятори",
  "Облік пряжі",
  "Генератор візерунків (beta)",
  "Спільнота",
  "Лічильник рядів",
]

const plans = [
  {
    name: "Преміум 6-місячна підписка",
    price: "599.99",
    period: "6 міс",
    perMonth: "100 грн/місяць",
    badge: null,
    badgeStyle: "",
    highlighted: false,
  },
  {
    name: "Преміум річна підписка",
    price: "918",
    period: "рік",
    perMonth: "76.50 грн/місяць",
    badge: "Найвигідніша пропозиція",
    badgeStyle: "bg-primary text-primary-foreground",
    highlighted: true,
  },
  {
    name: "Безлімітна підписка",
    price: "4 585",
    period: "назавжди",
    perMonth: null,
    badge: null,
    badgeStyle: "",
    highlighted: false,
    isUnlimited: true,
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
