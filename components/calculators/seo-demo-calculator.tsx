import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalculatorDefinition } from "@/lib/calculators"

export function SeoDemoCalculator({ calculator }: { calculator: CalculatorDefinition }) {
  if (!calculator.demo) return null

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-serif text-3xl">{calculator.demo.heading}</CardTitle>
        <CardDescription className="text-base leading-7">
          Короткий демо-блок із формулою, прикладом і практичним чеклістом для швидкого старту.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_1fr] lg:p-6">
        <section className="rounded-3xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Формула</p>
          <p className="mt-3 rounded-2xl bg-muted p-4 text-sm font-semibold leading-7 text-foreground">{calculator.demo.formula}</p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{calculator.demo.example}</p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Чекліст</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            {calculator.demo.checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {calculator.demo.relatedCalculatorSlug ? (
            <Link href={`/kalkuliatory/${calculator.demo.relatedCalculatorSlug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              {calculator.demo.relatedCalculatorLabel || "Відкрити пов'язаний калькулятор"} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </section>
      </CardContent>
    </Card>
  )
}