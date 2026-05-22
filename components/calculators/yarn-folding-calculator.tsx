"use client"

import { useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function parseNumber(value: string) {
  const normalized = value.replace(",", ".")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat("uk-UA", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  }).format(value)
}

function toolRecommendation(meterage: number) {
  if (meterage <= 100) return "спиці 8–12 мм або гачок 7–10 мм"
  if (meterage <= 150) return "спиці 6–8 мм або гачок 5–7 мм"
  if (meterage <= 200) return "спиці 5–6 мм або гачок 4–5 мм"
  if (meterage <= 250) return "спиці 4–5 мм або гачок 3,5–4,5 мм"
  if (meterage <= 350) return "спиці 3,5–4 мм або гачок 3–4 мм"
  if (meterage <= 500) return "спиці 3–3,5 мм або гачок 2,5–3,5 мм"
  if (meterage <= 800) return "спиці 2,5–3 мм або гачок 2–3 мм"
  return "тонка пряжа: орієнтовно спиці 1,5–2,5 мм або гачок 1,25–2,5 мм"
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

export function YarnFoldingCalculator() {
  const [baseMeterage, setBaseMeterage] = useState("1500")
  const [folds, setFolds] = useState("3")
  const [projectMeters, setProjectMeters] = useState("1500")
  const [workingMeterage, setWorkingMeterage] = useState("500")
  const [additionalMeterage, setAdditionalMeterage] = useState("500")
  const [threads, setThreads] = useState(["1500", "950", "500", "1000"])

  const sameThreadMeterage = useMemo(() => {
    const base = parseNumber(baseMeterage)
    const count = Math.min(10, Math.max(1, Math.round(parseNumber(folds) || 1)))
    return base / count
  }, [baseMeterage, folds])

  const mainGrams = useMemo(() => {
    const meters = parseNumber(projectMeters)
    const meterage = parseNumber(workingMeterage)
    return meterage ? (meters / meterage) * 100 : 0
  }, [projectMeters, workingMeterage])

  const additionalGrams = useMemo(() => {
    const meters = parseNumber(projectMeters)
    const meterage = parseNumber(additionalMeterage)
    return meterage ? (meters / meterage) * 100 : 0
  }, [additionalMeterage, projectMeters])

  const combinedMeterage = useMemo(() => {
    const inverseSum = threads.map(parseNumber).filter(Boolean).reduce((sum, meterage) => sum + 1 / meterage, 0)
    return inverseSum ? 1 / inverseSum : 0
  }, [threads])

  function updateThread(index: number, value: string) {
    setThreads((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))
  }

  return (
    <div className="grid gap-6">
      <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
        <CardHeader className="bg-primary/5">
          <CardTitle className="font-serif text-3xl">Демо-калькулятор складання пряжі</CardTitle>
          <CardDescription className="text-base leading-7">
            Розрахуйте ефективний метраж у кілька складань, вагу основної та додаткової нитки й приблизний інструмент для отриманої товщини.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_1fr] md:p-6">
          <div className="space-y-5">
            <Field label="Метраж однієї нитки" value={baseMeterage} onChange={setBaseMeterage} suffix="м/100г" />
            <Field label="Кількість складань" value={folds} onChange={setFolds} suffix="2–10" />
          </div>
          <div className="rounded-3xl border border-border bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Lзаг = Lбаз / N</p>
            <h3 className="mt-3 text-3xl font-serif text-foreground">{formatNumber(sameThreadMeterage)} м/100г</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Наприклад, {baseMeterage} м/100г у {folds || "N"} складання дає приблизно {formatNumber(sameThreadMeterage)} м/100г.
            </p>
            <p className="mt-3 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
              Орієнтир інструмента: {toolRecommendation(sameThreadMeterage)}.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Скільки грамів купити</CardTitle>
          <CardDescription>Формула: G = (Mзаг / L) × 100.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-5 pt-0 md:grid-cols-[1fr_1fr] md:p-6 md:pt-0">
          <div className="space-y-5">
            <Field label="Витрата на виріб" value={projectMeters} onChange={setProjectMeters} suffix="м" />
            <Field label="Метраж вашої основної пряжі" value={workingMeterage} onChange={setWorkingMeterage} suffix="м/100г" />
          </div>
          <div className="rounded-3xl border border-border bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Основна нитка</p>
            <h3 className="mt-3 text-3xl font-serif text-foreground">{formatNumber(mainGrams)} г</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {formatNumber(parseNumber(projectMeters))} м ÷ {formatNumber(parseNumber(workingMeterage))} м/100г × 100 = {formatNumber(mainGrams)} г.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Додаткова нитка</CardTitle>
          <CardDescription>Формула: Gдод = (Mзаг / Lдод) × 100.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-5 pt-0 md:grid-cols-[1fr_1fr] md:p-6 md:pt-0">
          <Field label="Метраж додаткової нитки" value={additionalMeterage} onChange={setAdditionalMeterage} suffix="м/100г" />
          <div className="rounded-3xl border border-border bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Додаткова нитка</p>
            <h3 className="mt-3 text-3xl font-serif text-foreground">{formatNumber(additionalGrams)} г</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Якщо основна витрата {formatNumber(parseNumber(projectMeters))} м, то додаткової нитки з метражем {formatNumber(parseNumber(additionalMeterage))} м/100г потрібно приблизно {formatNumber(additionalGrams)} г.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Поєднання різних ниток</CardTitle>
          <CardDescription>Формула: 1/Lзаг = 1/L1 + 1/L2 + ... + 1/Ln.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-5 pt-0 md:grid-cols-[1fr_1fr] md:p-6 md:pt-0">
          <div className="grid gap-4 sm:grid-cols-2">
            {threads.map((thread, index) => (
              <Field key={index} label={`Нитка ${index + 1}`} value={thread} onChange={(value) => updateThread(index, value)} suffix="м/100г" />
            ))}
          </div>
          <div className="rounded-3xl border border-border bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Загальний метраж</p>
            <h3 className="mt-3 text-3xl font-serif text-foreground">{formatNumber(combinedMeterage, 1)} м/100г</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Для прикладу 1500, 950, 500 і 1000 м/100г дають приблизно 211,9 м/100г, тобто після округлення — 212 м/100г.
            </p>
            <p className="mt-3 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
              Орієнтир інструмента: {toolRecommendation(combinedMeterage)}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}