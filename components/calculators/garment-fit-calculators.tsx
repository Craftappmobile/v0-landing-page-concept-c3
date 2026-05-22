"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { useMemo, useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type CalculatorSlug = "horlovyna" | "rukav" | "shapka" | "shkarpetky"

function parseNumber(value: string) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

function formatNumber(value: number, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("uk-UA", { maximumFractionDigits }).format(value)
}

function roundToMultiple(value: number, multiple: number) {
  const safeMultiple = Math.max(1, Math.round(multiple))
  return Math.max(safeMultiple, Math.round(value / safeMultiple) * safeMultiple)
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

function ResultBox({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <section className="rounded-3xl border border-border bg-background p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{title}</p>
      <h3 className="mt-3 text-3xl font-serif text-foreground">{value}</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{note}</p>
    </section>
  )
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{title}</p>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function MiniTable({ rows }: { rows: Array<[string, string]> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="grid grid-cols-[1fr_auto] gap-4 border-b border-border px-4 py-3 last:border-b-0">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-semibold text-foreground">{value}</span>
        </div>
      ))}
    </div>
  )
}

function RelatedLinks({ links }: { links: Array<[string, string]> }) {
  return (
    <section className="rounded-3xl border border-primary/20 bg-primary/5 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Читайте також</p>
      <div className="mt-4 flex flex-col gap-3">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
            {label} <ArrowRight className="h-4 w-4" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function HatCalculator() {
  const [head, setHead] = useState("56")
  const [gauge, setGauge] = useState("20")
  const [negativeEase, setNegativeEase] = useState("8")
  const [multiple, setMultiple] = useState("4")

  const result = useMemo(() => {
    const stitchesPerCm = parseNumber(gauge) / 10
    const workingCircumference = parseNumber(head) * (1 - parseNumber(negativeEase) / 100)
    const castOn = roundToMultiple(workingCircumference * stitchesPerCm, parseNumber(multiple))
    return { castOn, stitchesPerCm, workingCircumference }
  }, [gauge, head, multiple, negativeEase])

  return (
    <PriorityCalculatorShell title="Калькулятор петель для шапки" description="Порахуйте набірний край з урахуванням обхвату голови, щільності, розтягу гумки та кратності маківки.">
      <div className="space-y-5">
        <Field label="Обхват голови" value={head} onChange={setHead} suffix="см" />
        <Field label="Щільність" value={gauge} onChange={setGauge} suffix="п/10см" />
        <Field label="Мінус на розтяг" value={negativeEase} onChange={setNegativeEase} suffix="%" />
        <Field label="Кратність" value={multiple} onChange={setMultiple} suffix="п" />
      </div>
      <div className="space-y-5">
        <ResultBox title="Результат" value={`${result.castOn} петель`} note={`Робочий обхват: ${formatNumber(result.workingCircumference)} см · щільність: ${formatNumber(result.stitchesPerCm, 2)} п/см.`} />
        <MiniTable rows={[["Дитяча шапка", "48–52 см"], ["Жіноча шапка", "54–57 см"], ["Чоловіча шапка", "58–61 см"]]} />
      </div>
      <InfoList title="Типові помилки" items={["Не віднімати розтяг гумки — шапка сповзає.", "Округляти без кратності маківки.", "Міряти зразок до прання, а не після ВТО."]} />
      <RelatedLinks links={[["/blog/yak-rozrahuvaty-petli-dlya-shapky", "Як розрахувати петлі для шапки"], ["/kalkuliatory/shchilnist", "Калькулятор щільності"], ["/#pricing", "Спробувати Premium"]]} />
    </PriorityCalculatorShell>
  )
}

function SocksCalculator() {
  const [foot, setFoot] = useState("22")
  const [length, setLength] = useState("24")
  const [gauge, setGauge] = useState("30")
  const [ease, setEase] = useState("5")

  const result = useMemo(() => {
    const stitchesPerCm = parseNumber(gauge) / 10
    const stitches = roundToMultiple(parseNumber(foot) * (1 - parseNumber(ease) / 100) * stitchesPerCm, 4)
    return { stitches, heel: Math.round(stitches / 2), instep: Math.round(stitches / 2), toeStart: Math.max(0, parseNumber(length) - 5) }
  }, [ease, foot, gauge, length])

  return (
    <PriorityCalculatorShell title="Калькулятор шкарпеток" description="Розрахуйте петлі по обхвату стопи, розподіл на підйом і підошву, а також орієнтир початку миска.">
      <div className="space-y-5">
        <Field label="Обхват стопи" value={foot} onChange={setFoot} suffix="см" />
        <Field label="Довжина стопи" value={length} onChange={setLength} suffix="см" />
        <Field label="Щільність" value={gauge} onChange={setGauge} suffix="п/10см" />
        <Field label="Мінус на облягання" value={ease} onChange={setEase} suffix="%" />
      </div>
      <div className="space-y-5">
        <ResultBox title="Результат" value={`${result.stitches} петель`} note={`Підйом: ${result.instep} п · підошва/п'ятка: ${result.heel} п · мисок починати приблизно після ${formatNumber(result.toeStart)} см.`} />
        <MiniTable rows={[["35–36 розмір", "22–23 см"], ["37–39 розмір", "24–25 см"], ["40–42 розмір", "26–27 см"]]} />
      </div>
      <InfoList title="Типові помилки" items={["Не врахувати негативне облягання — шкарпетка збирається складками.", "Не округлити до кратності 4 для спиць.", "Почати мисок запізно й отримати довгу стопу."]} />
      <RelatedLinks links={[["/blog/yak-rozrahuvaty-shkarpetky", "Як розрахувати шкарпетки"], ["/kalkuliatory/shchilnist", "Калькулятор щільності"], ["/#pricing", "Спробувати Premium"]]} />
    </PriorityCalculatorShell>
  )
}

function SleeveCalculator() {
  const [cuff, setCuff] = useState("18")
  const [upper, setUpper] = useState("34")
  const [length, setLength] = useState("46")
  const [stitchGauge, setStitchGauge] = useState("22")
  const [rowGauge, setRowGauge] = useState("30")

  const result = useMemo(() => {
    const stitchesPerCm = parseNumber(stitchGauge) / 10
    const rowsPerCm = parseNumber(rowGauge) / 10
    const cuffStitches = roundToMultiple(parseNumber(cuff) * stitchesPerCm, 2)
    const upperStitches = roundToMultiple(parseNumber(upper) * stitchesPerCm, 2)
    const increases = Math.max(0, Math.round((upperStitches - cuffStitches) / 2))
    const totalRows = Math.round(parseNumber(length) * rowsPerCm)
    const everyRows = increases > 0 ? Math.max(2, Math.round(totalRows / increases)) : 0
    return { cuffStitches, upperStitches, increases, totalRows, everyRows }
  }, [cuff, length, rowGauge, stitchGauge, upper])

  return (
    <PriorityCalculatorShell title="Калькулятор рукава" description="Порахуйте петлі манжети, верх рукава та інтервал прибавок по довжині.">
      <div className="space-y-5">
        <Field label="Обхват манжети" value={cuff} onChange={setCuff} suffix="см" />
        <Field label="Обхват верху рукава" value={upper} onChange={setUpper} suffix="см" />
        <Field label="Довжина рукава" value={length} onChange={setLength} suffix="см" />
        <Field label="Щільність по петлях" value={stitchGauge} onChange={setStitchGauge} suffix="п/10см" />
        <Field label="Щільність по рядах" value={rowGauge} onChange={setRowGauge} suffix="р/10см" />
      </div>
      <div className="space-y-5">
        <ResultBox title="Результат" value={`${result.increases} прибавок з кожного боку`} note={`Манжета: ${result.cuffStitches} п · верх: ${result.upperStitches} п · приблизно кожні ${result.everyRows || "—"} рядів.`} />
        <MiniTable rows={[["Вузький рукав", "+8–12 см до зап'ястя"], ["Класичний", "+14–18 см"], ["Оверсайз", "+20 см і більше"]]} />
      </div>
      <InfoList title="Типові помилки" items={["Розподілити всі прибавки внизу рукава.", "Не перевірити ширину біля пройми.", "Рахувати ряди без ВТО-зразка."]} />
      <RelatedLinks links={[["/blog/yak-rozrahuvaty-rukav-svetra", "Як розрахувати рукав светра"], ["/kalkuliatory/shchilnist", "Калькулятор щільності"], ["/#pricing", "Спробувати Premium"]]} />
    </PriorityCalculatorShell>
  )
}

function NecklineCalculator() {
  const [neck, setNeck] = useState("42")
  const [depth, setDepth] = useState("8")
  const [stitchGauge, setStitchGauge] = useState("22")
  const [rowGauge, setRowGauge] = useState("30")

  const result = useMemo(() => {
    const stitchesPerCm = parseNumber(stitchGauge) / 10
    const rowsPerCm = parseNumber(rowGauge) / 10
    const total = roundToMultiple(parseNumber(neck) * stitchesPerCm, 2)
    const back = roundToMultiple(total * 0.34, 2)
    const front = roundToMultiple(total * 0.42, 2)
    const shoulder = Math.max(2, Math.round((total - back - front) / 2))
    const depthRows = Math.round(parseNumber(depth) * rowsPerCm)
    return { total, back, front, shoulder, depthRows }
  }, [depth, rowGauge, stitchGauge, neck])

  return (
    <PriorityCalculatorShell title="Калькулятор горловини" description="Розрахуйте кількість петель горловини, базовий розподіл на перед, спинку й плечі та глибину вирізу в рядах.">
      <div className="space-y-5">
        <Field label="Обхват горловини" value={neck} onChange={setNeck} suffix="см" />
        <Field label="Глибина вирізу" value={depth} onChange={setDepth} suffix="см" />
        <Field label="Щільність по петлях" value={stitchGauge} onChange={setStitchGauge} suffix="п/10см" />
        <Field label="Щільність по рядах" value={rowGauge} onChange={setRowGauge} suffix="р/10см" />
      </div>
      <div className="space-y-5">
        <ResultBox title="Результат" value={`${result.total} петель`} note={`Перед: ${result.front} п · спинка: ${result.back} п · плечі: по ${result.shoulder} п · глибина: ${result.depthRows} рядів.`} />
        <MiniTable rows={[["Кругла горловина", "6–10 см глибини"], ["V-подібна", "14–22 см"], ["Човник", "мала глибина, більша ширина"]]} />
      </div>
      <InfoList title="Типові помилки" items={["Не врахувати розтяг планки або гумки.", "Зробити перед і спинку однаковими для круглої горловини.", "Округлити без симетрії плечей."]} />
      <RelatedLinks links={[["/blog/yak-rozrahuvaty-horlovynu-svetra", "Як розрахувати горловину"], ["/kalkuliatory/vyriz", "Калькулятор вирізу"], ["/#pricing", "Спробувати Premium"]]} />
    </PriorityCalculatorShell>
  )
}

function PriorityCalculatorShell({ children, title, description }: { children: ReactNode; title: string; description: string }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-lg">
      <CardHeader className="bg-primary/5">
        <CardTitle className="font-serif text-3xl">{title}</CardTitle>
        <CardDescription className="text-base leading-7">{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-6">{children}</CardContent>
    </Card>
  )
}

export function GarmentFitCalculator({ slug }: { slug: CalculatorSlug }) {
  if (slug === "shapka") return <HatCalculator />
  if (slug === "shkarpetky") return <SocksCalculator />
  if (slug === "rukav") return <SleeveCalculator />
  return <NecklineCalculator />
}