"use client"

import { useMemo, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function parseNumber(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(value)
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-foreground">
      {label}
      <Input inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

export function GaugeCalculator() {
  const [stitchesInTenCm, setStitchesInTenCm] = useState("20")
  const [rowsInTenCm, setRowsInTenCm] = useState("22")

  const result = useMemo(() => {
    const stitches = parseNumber(stitchesInTenCm) / 10
    const rows = parseNumber(rowsInTenCm) / 10

    return { stitches, rows }
  }, [rowsInTenCm, stitchesInTenCm])

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-serif text-3xl">Демо-калькулятор щільності</CardTitle>
        <CardDescription className="text-base leading-7">
          Введіть дані зі зразка 10×10 см. Калькулятор перерахує петлі та ряди на 1 см.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_1fr] md:p-6">
        <div className="space-y-5">
          <Field label="Кількість петель у 10 см" value={stitchesInTenCm} onChange={setStitchesInTenCm} />
          <Field label="Кількість рядів у 10 см" value={rowsInTenCm} onChange={setRowsInTenCm} />
        </div>

        <div className="rounded-3xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Результат</p>
          <h3 className="mt-3 text-3xl font-serif text-foreground">
            {formatNumber(result.stitches)} п/см · {formatNumber(result.rows)} р/см
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Щільність {formatNumber(result.stitches)} петлі на 1 см; {formatNumber(result.rows)} ряди на 1 см.
          </p>
          <div className="mt-4 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
            <p>Петлі на 1 см = {stitchesInTenCm || "0"} / 10 = {formatNumber(result.stitches)}</p>
            <p>Ряди на 1 см = {rowsInTenCm || "0"} / 10 = {formatNumber(result.rows)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}