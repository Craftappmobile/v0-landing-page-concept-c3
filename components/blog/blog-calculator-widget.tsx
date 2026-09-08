import Link from "next/link"
import { ArrowRight, Calculator, Sparkles, CheckCircle2, Crown } from "lucide-react"

import type { CalculatorDefinition } from "@/lib/calculators"

export function BlogCalculatorWidget({
  calculator,
  variant = "inline",
  articleSlug = "A05-rahlan",
}: {
  calculator: CalculatorDefinition
  variant?: "inline" | "sidebar"
  articleSlug?: string
}) {
  const campaign = articleSlug || "A05-rahlan"
  const calcHref = `/kalkuliatory/${calculator.slug}?utm_source=blog&utm_medium=article&utm_campaign=${campaign}&utm_content=widget_web_calc`
  const pricingHref = `/#pricing?utm_source=blog&utm_medium=article&utm_campaign=${campaign}&utm_content=widget_pro_btn`
  const testPlanHref = `/checkout?plan=month&utm_source=blog&utm_medium=article&utm_campaign=${campaign}&utm_content=widget_test_btn`

  if (variant === "sidebar") {
    return (
      <aside className="rounded-3xl border border-primary/20 bg-primary/5 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
          <Calculator className="h-4 w-4" />
          <span>Калькулятор до теми</span>
        </div>
        <h4 className="font-serif text-lg font-bold leading-snug text-foreground">
          {calculator.shortTitle}
        </h4>
        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
          {calculator.description}
        </p>
        <div className="space-y-2 pt-1">
          <Link
            href={calcHref}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary border border-border px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:bg-muted"
          >
            Відкрити веб-калькулятор
          </Link>
          <Link
            href={pricingHref}
            style={{ color: "#ffffff" }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-semibold !text-white text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Crown className="h-3.5 w-3.5 text-white" /> <span className="text-white">Додаток PRO (від 100 грн)</span>
          </Link>
        </div>
      </aside>
    )
  }

  return (
    <section className="my-12 overflow-hidden rounded-3xl border border-border/80 bg-card/60 shadow-lg not-prose" aria-label="Розрахунки та підписка на додаток">
      {/* Top Banner Header */}
      <div className="border-b border-border/60 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-4 w-4" />
            <span>Інструменти майстра для точного в'язання</span>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-0.5 text-xs font-medium text-primary">
            Економія пряжі та нервів
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border/60 lg:grid-cols-2 lg:divide-x lg:divide-y-0 items-stretch">
        
        {/* Tier 1: Free Web Calculator */}
        <div className="flex flex-col justify-between h-full p-6 sm:p-8 bg-background/50">
          <div className="flex-1 flex flex-col justify-start space-y-3.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground w-fit">
              <Calculator className="h-3.5 w-3.5 text-primary" />
              <span>Базовий онлайн-інструмент</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              {calculator.shortTitle}
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Потрібно швидко порахувати петлі для цього виробу? Скористайтесь нашим безкоштовним калькулятором у браузері. Введіть свої мірки та щільність — отримайте цифри за 5 секунд.
            </p>

            <ul className="space-y-2 text-xs text-muted-foreground pt-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Миттєвий розрахунок без реєстрації</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Точні формули під вашу щільність</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Попетельний результат прямо у браузері</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto pt-6 space-y-2.5">
            <Link
              href={calcHref}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/30 bg-card px-5 text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-primary no-underline"
            >
              <span>Відкрити веб-калькулятор</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>

            <div className="flex h-5 items-center justify-between px-1 text-xs text-muted-foreground">
              <span>Повна онлайн-версія</span>
              <span className="font-semibold text-primary">100% безкоштовно</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Premium PRO App Subscription (High Value / High Conversion) */}
        <div className="relative flex flex-col justify-between h-full p-6 sm:p-8 bg-gradient-to-br from-primary/15 via-primary/5 to-background">
          <div className="flex-1 flex flex-col justify-start space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
                <Crown className="h-3.5 w-3.5 text-white" />
                <span className="text-white">Мобільний додаток PRO</span>
              </span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                1 міс у подарунок 🎁
              </span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
              Повний супровід в'язання у смартфоні
            </h3>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Забудьте про папірці та розпускання. Додаток створює попетельний опис вашого виробу, веде вас по рядах інтерактивним лічильником і зберігає мірки ваших робіт.
            </p>

            <ul className="space-y-2 text-xs text-foreground/85 font-medium pt-1">
              <li className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-foreground">Всі 30 калькуляторів + готові схеми</span>
              </li>
              <li className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-foreground">Розумний лічильник рядів із підказками</span>
              </li>
              <li className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span className="text-foreground">CRM обліку пряжі та збереження розмірів</span>
              </li>
            </ul>
          </div>

          <div className="mt-auto pt-6 space-y-2.5">
            <Link
              href={pricingHref}
              style={{ color: "#ffffff" }}
              className="group inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl bg-primary px-6 text-sm font-semibold !text-white text-white shadow-md transition-all hover:bg-primary/90 hover:shadow-lg no-underline"
            >
              <span className="text-white font-semibold">Обрати тариф підписки</span>
              <ArrowRight className="h-4 w-4 text-white transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="flex h-5 items-center justify-between px-1 text-xs text-muted-foreground">
              <span>Пакет «Тест» — всього 100 грн</span>
              <Link href={testPlanHref} className="font-semibold text-primary hover:underline">
                Спробувати за 100 грн ➔
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
