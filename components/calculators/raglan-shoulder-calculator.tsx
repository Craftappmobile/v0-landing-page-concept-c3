"use client"

import { useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function parseNumber(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatNumber(value: number, fractionDigits = 1) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: fractionDigits, useGrouping: false }).format(value)
}

function makeEven(value: number) {
  const rounded = Math.max(2, Math.round(value))
  return rounded % 2 === 0 ? rounded : rounded + 1
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

function RaglanScheme({ front, back, shoulder, shortRows }: { front: number; back: number; shoulder: number; shortRows: number }) {
  return (
    <figure className="overflow-hidden rounded-3xl border border-border bg-card p-4">
      <svg viewBox="0 0 520 360" role="img" aria-labelledby="raglan-scheme-title" className="h-auto w-full">
        <title id="raglan-scheme-title">Схема розподілу реглан-погону</title>
        <rect width="520" height="360" rx="28" fill="#f7efe7" />
        <path d="M170 72 C200 38 320 38 350 72 L330 118 C300 95 220 95 190 118 Z" fill="#fff" stroke="#2e9e3e" strokeWidth="4" />
        <path d="M190 118 L125 235" stroke="#d97060" strokeWidth="8" strokeLinecap="round" />
        <path d="M330 118 L395 235" stroke="#d97060" strokeWidth="8" strokeLinecap="round" />
        <path d="M125 235 C170 305 350 305 395 235" fill="none" stroke="#2e9e3e" strokeWidth="4" strokeDasharray="10 10" />
        <path d="M205 120 C225 155 295 155 315 120" fill="none" stroke="#2e9e3e" strokeWidth="4" />
        <path d="M188 96 C220 125 300 125 332 96" fill="none" stroke="#d97060" strokeWidth="3" strokeDasharray="8 8" />
        <text x="260" y="78" textAnchor="middle" fill="#2e9e3e" fontSize="20" fontWeight="700">спинка {back} п</text>
        <text x="260" y="205" textAnchor="middle" fill="#111827" fontSize="22" fontWeight="700">перед {front} п</text>
        <text x="104" y="182" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="700">погон {shoulder} п</text>
        <text x="416" y="182" textAnchor="middle" fill="#111827" fontSize="18" fontWeight="700">погон {shoulder} п</text>
        <text x="260" y="330" textAnchor="middle" fill="#6b7280" fontSize="18">росток: {shortRows} поворотних рядів</text>
      </svg>
      <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
        Схема показує стартовий розподіл горловини, лінії погону та зону ростка. Значення оновлюються після зміни полів.
      </figcaption>
    </figure>
  )
}

export function RaglanShoulderCalculator() {
  const [neckCircumference, setNeckCircumference] = useState("42")
  const [bustCircumference, setBustCircumference] = useState("92")
  const [frontWidth, setFrontWidth] = useState("46")
  const [stitchGauge, setStitchGauge] = useState("22")
  const [rowGauge, setRowGauge] = useState("30")
  const [rostockHeight, setRostockHeight] = useState("3")

  const result = useMemo(() => {
    const neck = parseNumber(neckCircumference)
    const bust = parseNumber(bustCircumference)
    const width = parseNumber(frontWidth)
    const stitchesPerCm = parseNumber(stitchGauge) / 10
    const rowsPerCm = parseNumber(rowGauge) / 10
    const rostock = parseNumber(rostockHeight)

    const totalNeckStitches = makeEven(neck * stitchesPerCm)
    const shoulderStitches = Math.max(4, Math.round(totalNeckStitches * 0.12))
    const backStitches = makeEven(totalNeckStitches * 0.34)
    const frontStitches = Math.max(2, totalNeckStitches - backStitches - shoulderStitches * 2)
    const targetFrontStitches = Math.round(width * stitchesPerCm)
    const stageOneIncreaseRows = makeEven(Math.max(0, targetFrontStitches - frontStitches))
    const armholeHeight = bust / 3 + 4
    const armholeRows = makeEven(armholeHeight * rowsPerCm)
    const shortRows = makeEven(rostock * rowsPerCm)
    const turnPoints = Math.max(1, shortRows / 2)
    const turnStep = Math.max(1, Math.round((backStitches + shoulderStitches * 2) / turnPoints))

    return {
      armholeHeight,
      armholeRows,
      backStitches,
      frontStitches,
      shortRows,
      shoulderStitches,
      stageOneIncreaseRows,
      targetFrontStitches,
      totalNeckStitches,
      turnPoints,
      turnStep,
    }
  }, [bustCircumference, frontWidth, neckCircumference, rostockHeight, rowGauge, stitchGauge])

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-serif text-3xl">Демо-калькулятор реглан-погону</CardTitle>
        <CardDescription className="text-base leading-7">
          Розрахуйте стартову горловину, погони, росток і два етапи прибавок для реглану зверху.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
        <div className="space-y-5">
          <Field label="Обхват горловини" value={neckCircumference} onChange={setNeckCircumference} suffix="см" />
          <Field label="Обхват грудей" value={bustCircumference} onChange={setBustCircumference} suffix="см" />
          <Field label="Ширина переду" value={frontWidth} onChange={setFrontWidth} suffix="см" />
          <Field label="Щільність по петлях" value={stitchGauge} onChange={setStitchGauge} suffix="п/10см" />
          <Field label="Щільність по рядах" value={rowGauge} onChange={setRowGauge} suffix="р/10см" />
          <Field label="Висота ростка" value={rostockHeight} onChange={setRostockHeight} suffix="см" />
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl border border-border bg-background p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Результат</p>
            <h3 className="mt-3 text-3xl font-serif text-foreground">Горловина {result.totalNeckStitches} петель</h3>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
              <p className="rounded-2xl bg-muted p-3">Перед: <strong className="text-foreground">{result.frontStitches} п</strong></p>
              <p className="rounded-2xl bg-muted p-3">Спинка: <strong className="text-foreground">{result.backStitches} п</strong></p>
              <p className="rounded-2xl bg-muted p-3">Погони: <strong className="text-foreground">{result.shoulderStitches} п × 2</strong></p>
              <p className="rounded-2xl bg-muted p-3">Росток: <strong className="text-foreground">{result.shortRows} р</strong></p>
            </div>
          </div>

          <RaglanScheme front={result.frontStitches} back={result.backStitches} shoulder={result.shoulderStitches} shortRows={result.shortRows} />
        </div>

        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-3">
            <section className="rounded-3xl border border-border bg-card p-5">
              <h4 className="font-serif text-xl text-foreground">1. Горловина</h4>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                N = обхват горловини × щільність = {neckCircumference || "0"} × {formatNumber(parseNumber(stitchGauge) / 10)} = {result.totalNeckStitches} п.
              </p>
            </section>
            <section className="rounded-3xl border border-border bg-card p-5">
              <h4 className="font-serif text-xl text-foreground">2. Росток</h4>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Росток {rostockHeight || "0"} см = {result.shortRows} поворотних рядів. Орієнтовно {result.turnPoints} точок розвороту з кроком {result.turnStep} п.
              </p>
            </section>
            <section className="rounded-3xl border border-border bg-card p-5">
              <h4 className="font-serif text-xl text-foreground">3. Прибавки</h4>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Етап 1: до {result.targetFrontStitches} п переду, приблизно {result.stageOneIncreaseRows} рядів. Етап 2: пройма {formatNumber(result.armholeHeight)} см або {result.armholeRows} рядів.
              </p>
            </section>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-5 text-sm leading-7 text-muted-foreground">
            <p className="font-semibold text-foreground">Формули демо-версії:</p>
            <p>R = ширина переду × щільність = {frontWidth || "0"} × {formatNumber(parseNumber(stitchGauge) / 10)} = {result.targetFrontStitches} п.</p>
            <p>V = B / 3 + 4 = {bustCircumference || "0"} / 3 + 4 = {formatNumber(result.armholeHeight)} см.</p>
            <p>Калькулятор дає базовий план. Для точного МК додатково враховуйте посадку, ширину плеча, глибину горловини та ваш спосіб виконання прибавок.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}