"use client"

import { useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function parseNumber(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatNumber(value: number, fractionDigits = 2) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: fractionDigits, useGrouping: false }).format(value)
}

function stitchesWord(value: number) {
  const lastTwo = value % 100
  const last = value % 10

  if (lastTwo >= 11 && lastTwo <= 14) return "петель"
  if (last === 1) return "петля"
  if (last >= 2 && last <= 4) return "петлі"
  return "петель"
}

function Field({ label, value, onChange, suffix }: { label: string; value: string; onChange: (value: string) => void; suffix?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <div className="relative">
        <Input inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} className={suffix ? "pr-20" : undefined} />
        {suffix ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span> : null}
      </div>
    </label>
  )
}

export function PatternAdaptationCalculator() {
  const [patternGauge, setPatternGauge] = useState("27")
  const [userGauge, setUserGauge] = useState("20")
  const [patternStitches, setPatternStitches] = useState("87")
  const [patternYarnGrams, setPatternYarnGrams] = useState("300")
  const [patternYarnMeterage, setPatternYarnMeterage] = useState("420")

  const result = useMemo(() => {
    const dPattern = parseNumber(patternGauge)
    const dUser = parseNumber(userGauge)
    const stitches = parseNumber(patternStitches)
    const grams = parseNumber(patternYarnGrams)
    const meterage = parseNumber(patternYarnMeterage)
    const coefficient = dPattern ? dUser / dPattern : 0
    const adaptedStitches = Math.round(stitches * coefficient)
    const totalMeters = (meterage / 100) * grams

    return { coefficient, adaptedStitches, totalMeters }
  }, [patternGauge, patternStitches, patternYarnGrams, patternYarnMeterage, userGauge])

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-serif text-3xl">Демо-калькулятор адаптації МК</CardTitle>
        <CardDescription className="text-base leading-7">
          Перерахуйте набір петель під вашу щільність і переведіть витрату з опису в загальний метраж.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_1fr] md:p-6">
        <div className="space-y-5">
          <Field label="Щільність по МК" value={patternGauge} onChange={setPatternGauge} suffix="п/10см" />
          <Field label="Ваша щільність" value={userGauge} onChange={setUserGauge} suffix="п/10см" />
          <Field label="Петель набрати по МК" value={patternStitches} onChange={setPatternStitches} suffix="п" />
          <Field label="Витрата пряжі по МК" value={patternYarnGrams} onChange={setPatternYarnGrams} suffix="г" />
          <Field label="Метраж пряжі по МК" value={patternYarnMeterage} onChange={setPatternYarnMeterage} suffix="м/100г" />
        </div>

        <div className="rounded-3xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Результат</p>
          <h3 className="mt-3 text-3xl font-serif text-foreground">Набрати {result.adaptedStitches} {stitchesWord(result.adaptedStitches)}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Набрати необхідно {result.adaptedStitches} петлі. Загальна витрата пряжі — {formatNumber(result.totalMeters, 0)} м.
          </p>
          <div className="mt-4 space-y-2 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
            <p>K = {userGauge || "0"} / {patternGauge || "0"} = {formatNumber(result.coefficient, 2)}</p>
            <p>Pкорист = {patternStitches || "0"} × {formatNumber(result.coefficient, 2)} = {result.adaptedStitches} п</p>
            <p>L = ({patternYarnMeterage || "0"} / 100) × {patternYarnGrams || "0"} = {formatNumber(result.totalMeters, 0)} м</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Якщо ваша пряжа має інший метраж, ніж у майстер-класі, переведіть {formatNumber(result.totalMeters, 0)} м у грами через калькулятор складання пряжі.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}