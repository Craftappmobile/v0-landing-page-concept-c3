"use client"

import { useMemo, useState } from "react"

import { formatConsumption, yarnConsumptionGroups } from "@/lib/yarn-consumption"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function findBySlug<T extends { slug: string }>(items: T[], slug: string) {
  return items.find((item) => item.slug === slug) || items[0]
}

function measurementLabel(measurement: string) {
  if (measurement === "age") return "Вік дитини, років"
  if (measurement === "hips") return "Обхват стегон, см"
  if (measurement === "size") return "Розмір / варіант"
  return "Обхват грудей, см"
}

export function YarnConsumptionCalculator() {
  const [groupSlug, setGroupSlug] = useState("women")
  const group = findBySlug(yarnConsumptionGroups, groupSlug)
  const [productSlug, setProductSlug] = useState(group.products[0].slug)
  const product = findBySlug(group.products, productSlug)
  const numericMode = product.measurement !== "size"
  const [measurement, setMeasurement] = useState(product.entries[0].min?.toString() || "")
  const [entryLabel, setEntryLabel] = useState(product.entries[0].label)

  const selectedEntry = useMemo(() => {
    if (!numericMode) return product.entries.find((entry) => entry.label === entryLabel) || product.entries[0]

    const value = Number(measurement.replace(",", "."))
    if (!Number.isFinite(value)) return product.entries[0]

    return product.entries.find((entry) => entry.min !== undefined && entry.max !== undefined && value >= entry.min && value <= entry.max) || product.entries[product.entries.length - 1]
  }, [entryLabel, measurement, numericMode, product.entries])

  function handleGroupChange(value: string) {
    const nextGroup = findBySlug(yarnConsumptionGroups, value)
    const nextProduct = nextGroup.products[0]
    setGroupSlug(value)
    setProductSlug(nextProduct.slug)
    setMeasurement(nextProduct.entries[0].min?.toString() || "")
    setEntryLabel(nextProduct.entries[0].label)
  }

  function handleProductChange(value: string) {
    const nextProduct = findBySlug(group.products, value)
    setProductSlug(value)
    setMeasurement(nextProduct.entries[0].min?.toString() || "")
    setEntryLabel(nextProduct.entries[0].label)
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-serif text-3xl">Демо-калькулятор витрати пряжі</CardTitle>
        <CardDescription className="text-base leading-7">
          Результат показує орієнтовну витрату за загальними таблицями. Для точної покупки додайте запас на зразок, шви, візерунок і довжину виробу.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 p-5 md:grid-cols-[1fr_1fr] md:p-6">
        <div className="space-y-5">
          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Категорія
            <Select value={groupSlug} onValueChange={handleGroupChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{yarnConsumptionGroups.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.label}</SelectItem>)}</SelectContent>
            </Select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-foreground">
            Виріб
            <Select value={product.slug} onValueChange={handleProductChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{group.products.map((item) => <SelectItem key={item.slug} value={item.slug}>{item.label}</SelectItem>)}</SelectContent>
            </Select>
          </label>

          {numericMode ? (
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              {measurementLabel(product.measurement)}
              <Input inputMode="decimal" value={measurement} onChange={(event) => setMeasurement(event.target.value)} placeholder="Наприклад, 94" />
            </label>
          ) : (
            <label className="grid gap-2 text-sm font-semibold text-foreground">
              {measurementLabel(product.measurement)}
              <Select value={entryLabel} onValueChange={setEntryLabel}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{product.entries.map((entry) => <SelectItem key={entry.label} value={entry.label}>{entry.label}</SelectItem>)}</SelectContent>
              </Select>
            </label>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-background p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Результат</p>
          <h3 className="mt-3 text-3xl font-serif text-foreground">{formatConsumption(selectedEntry)}</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Для «{product.label}» у категорії «{group.label}» і діапазону «{selectedEntry.label}» орієнтовна витрата становить {formatConsumption(selectedEntry)}.
          </p>
          {selectedEntry.hook ? (
            <p className="mt-3 rounded-2xl bg-muted p-4 text-sm leading-6 text-muted-foreground">
              Перше число — базова витрата для спиць, друге — орієнтир для гачка або щільнішого полотна.
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}