"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, CheckCircle2, Calculator, Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { CalculatorDefinition } from "@/lib/calculators"

function parseNumber(value: string, fallback = 0) {
  const parsed = Number(value.replace(",", "."))
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function Field({
  label,
  value,
  onChange,
  suffix,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  suffix?: string
  hint?: string
}) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-foreground">
      <span>{label}</span>
      <div className="relative">
        <Input
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`h-11 rounded-2xl bg-background ${suffix ? "pr-16" : ""}`}
        />
        {suffix ? (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <span className="text-xs font-normal text-muted-foreground">{hint}</span> : null}
    </label>
  )
}

function getCalculatorConfig(slug: string) {
  switch (slug) {
    case "dovzhyna":
      return {
        field1: { label: "Бажана довжина деталі", default: "62", suffix: "см", hint: "Від лінії плеча або пройми" },
        field2: { label: "Щільність у рядах", default: "30", suffix: "р / 10 см", hint: "Рядів у зразку 10 см після ВТО" },
        field3: null,
        calculate: (v1: number, v2: number) => {
          const rows = Math.round(v1 * (v2 / 10))
          return {
            title: "Розрахована кількість рядів",
            value: `${rows} рядів`,
            note: `Для висоти ${v1} см при щільності ${v2 / 10} р/см потрібно зв'язати ${rows} рядів полотна.`,
          }
        },
      }

    case "vyriz":
      return {
        field1: { label: "Бажана глибина вирізу", default: "9", suffix: "см", hint: "Глибина від лінії горловини" },
        field2: { label: "Щільність у рядах", default: "30", suffix: "р / 10 см", hint: "Рядків у 10 см полотна" },
        field3: null,
        calculate: (v1: number, v2: number) => {
          const rows = Math.round(v1 * (v2 / 10))
          const decreases = Math.round(rows / 2)
          return {
            title: "Ряди для формування вирізу",
            value: `${rows} рядів`,
            note: `Формування скосу виконується протягом ${rows} рядів (приблизно ${decreases} точок убавок у кожному 2-му ряду).`,
          }
        },
      }

    case "koketka":
      return {
        field1: { label: "Бажана глибина пройми / кокетки", default: "22", suffix: "см", hint: "Висота від горловини до пройми" },
        field2: { label: "Щільність у рядах", default: "30", suffix: "р / 10 см", hint: "Рядів у 10 см полотна" },
        field3: { label: "Кількість ярусів прибавок", default: "3", suffix: "яруси", hint: "Зазвичай 3 або 4 лінії рівномірних прибавок" },
        calculate: (v1: number, v2: number, v3: number) => {
          const rows = Math.round(v1 * (v2 / 10))
          const tiers = Math.max(1, Math.round(v3))
          const interval = Math.floor(rows / tiers)
          return {
            title: "Висота кокетки у рядах",
            value: `${rows} рядів`,
            note: `Загальна висота ${rows} рядів. При розподілі на ${tiers} яруси робіть розширення кожні ~${interval} рядів.`,
          }
        },
      }

    case "azhur":
    case "vizerunky":
      return {
        field1: { label: "Бажана ширина полотна", default: "50", suffix: "см", hint: "Ширина переду, спинки чи шалі" },
        field2: { label: "Щільність в'язання", default: "22", suffix: "п / 10 см", hint: "Петель у 10 см зразка візерунка" },
        field3: { label: "Рапорт візерунка", default: "8", suffix: "петель", hint: "Кількість петель в одному повторі схеми" },
        calculate: (v1: number, v2: number, v3: number) => {
          const baseStitches = v1 * (v2 / 10)
          const repeat = Math.max(1, Math.round(v3))
          const repeatsCount = Math.max(1, Math.round(baseStitches / repeat))
          const totalStitches = repeatsCount * repeat + 2 // +2 крайові
          return {
            title: "Рекомендований набір петель",
            value: `${totalStitches} петель`,
            note: `Це рівно ${repeatsCount} повних рапортів по ${repeat} п. плюс 2 крайові петлі (фактична ширина ${(totalStitches / (v2 / 10)).toFixed(1)} см).`,
          }
        },
      }

    case "arany":
      return {
        field1: { label: "Бажана ширина деталі", default: "52", suffix: "см", hint: "Ширина деталі після ВТО" },
        field2: { label: "Базова щільність гладі", default: "20", suffix: "п / 10 см", hint: "Щільність лицьової гладі" },
        field3: { label: "Запас на стягування косами", default: "15", suffix: "%", hint: "Коси та арани стягують полотно на 10-20%" },
        calculate: (v1: number, v2: number, v3: number) => {
          const plainStitches = v1 * (v2 / 10)
          const total = Math.round(plainStitches * (1 + v3 / 100))
          return {
            title: "Петлі з компенсацією кіс",
            value: `${total} петель`,
            note: `Базові ${Math.round(plainStitches)} петель + ${total - Math.round(plainStitches)} п. компенсації на стягування полотна візерунком.`,
          }
        },
      }

    case "humka":
      return {
        field1: { label: "Обхват манжети / краю", default: "20", suffix: "см", hint: "Зап'ястя, обхват голови або талії" },
        field2: { label: "Щільність гумки", default: "24", suffix: "п / 10 см", hint: "Щільність у злегка розтягнутому стані" },
        field3: { label: "Тип гумки (кратність)", default: "4", suffix: "петель", hint: "4 для гумки 2×2, 2 для гумки 1×1" },
        calculate: (v1: number, v2: number, v3: number) => {
          const rawStitches = v1 * (v2 / 10)
          const mult = Math.max(1, Math.round(v3))
          const total = Math.round(rawStitches / mult) * mult
          return {
            title: "Петлі набору для гумки",
            value: `${total} петель`,
            note: `Число кратне ${mult}, що забезпечує ідеальну симетрію та рівномірне змикання гумки в коло.`,
          }
        },
      }

    case "ubavky":
      return {
        field1: { label: "Поточна кількість петель", default: "120", suffix: "петель", hint: "Скільки петель зараз на спицях" },
        field2: { label: "Скільки петель прибрати", default: "20", suffix: "петель", hint: "Потрібна кількість убавок" },
        field3: null,
        calculate: (v1: number, v2: number) => {
          const total = Math.max(1, Math.round(v1))
          const dec = Math.max(1, Math.min(total - 1, Math.round(v2)))
          const interval = Math.floor(total / dec)
          const remainder = total % dec
          return {
            title: "Інтервал між убавками",
            value: `Кожні ${interval}–${interval + 1} п.`,
            note: `Пров'язуйте 2 разом приблизно через кожні ${interval} петель (залишок у ${remainder} п. рівномірно розподіліть на початку та в кінці ряду).`,
          }
        },
      }

    case "letucha-mysha":
      return {
        field1: { label: "Півобхват грудей + оверсайз", default: "54", suffix: "см", hint: "Ширина корпусу світшота" },
        field2: { label: "Довжина одного рукава", default: "40", suffix: "см", hint: "Від лінії пройми до манжети" },
        field3: { label: "Щільність петель", default: "20", suffix: "п / 10 см", hint: "Петель у 10 см зразка" },
        calculate: (v1: number, v2: number, v3: number) => {
          const totalWidth = v1 + v2 * 2
          const stitches = Math.round(totalWidth * (v3 / 10))
          return {
            title: "Загальна розмах крил деталі",
            value: `${stitches} петель`,
            note: `Ширина деталі від манжети до манжети становить ${totalWidth} см. Набирайте або виходьте на ${stitches} петель.`,
          }
        },
      }

    case "mokher":
      return {
        field1: { label: "Потрібний метраж на виріб", default: "850", suffix: "метрів", hint: "Загальний розрахунковий метраж" },
        field2: { label: "Метраж одного мотка", default: "210", suffix: "м / моток", hint: "Стандартний метраж мохеру на шовку" },
        field3: { label: "Вага одного мотка", default: "25", suffix: "грамів", hint: "Вага фабричного мотка" },
        calculate: (v1: number, v2: number, v3: number) => {
          const skeinMeters = Math.max(1, v2)
          const skeins = Math.ceil(v1 / skeinMeters)
          const grams = skeins * v3
          return {
            title: "Потрібно мохеру для виробу",
            value: `${skeins} мотків (${grams} г)`,
            note: `Для ${v1} м пряжі при мотках ${v2} м / ${v3} г знадобиться ${skeins} мотків із мінімальним запасом на зразок.`,
          }
        },
      }

    case "sektsiyna":
      return {
        field1: { label: "Довжина однієї кольорової секції", default: "14", suffix: "метрів", hint: "Довжина повтору одного кольору в мотку" },
        field2: { label: "Витрата пряжі на 1 ряд", default: "2.2", suffix: "метрів", hint: "Скільки метрів нитки йде на один повний ряд" },
        field3: null,
        calculate: (v1: number, v2: number) => {
          const rowYarn = Math.max(0.1, v2)
          const rowsPerSection = (v1 / rowYarn).toFixed(1)
          return {
            title: "Повторення смуги кольору",
            value: `~${rowsPerSection} рядів`,
            note: `Один колір лягатиме у полотно смугою приблизно на ${rowsPerSection} рядів при незмінній ширині виробу.`,
          }
        },
      }

    case "dytyachyy":
      return {
        field1: { label: "Обхват грудей дитини", default: "60", suffix: "см", hint: "Базовий обхват грудей (наприклад, 60 см для 3–4 років)" },
        field2: { label: "Щільність петель після ВТО", default: "22", suffix: "п / 10 см", hint: "Кількість петель у 10 см зразка" },
        field3: { label: "Запас на виріст та свободу", default: "5", suffix: "см", hint: "Рекомендований запас 4–6 см для дитячого светра" },
        calculate: (v1: number, v2: number, v3: number) => {
          const totalWidth = v1 + v3
          const rawStitches = totalWidth * (v2 / 10)
          const stitches = Math.round(rawStitches / 2) * 2
          const half = stitches / 2
          return {
            title: "Петлі для дитячого светра",
            value: `${stitches} петель (${half} п. перед / спинка)`,
            note: `Для обхвату ${v1} см із запасом на виріст +${v3} см (разом ${totalWidth} см) наберіть ${stitches} петель по колу або по ${half} п. на поличку та спинку.`,
          }
        },
      }

    case "shchilnist":
      return {
        field1: { label: "Кількість петель у зразку", default: "21", suffix: "п / 10 см", hint: "Кількість цілих петель на 10 см після ВТО" },
        field2: { label: "Кількість рядів у зразку", default: "30", suffix: "р / 10 см", hint: "Кількість рядів на 10 см після ВТО" },
        field3: { label: "Бажана ширина деталі", default: "50", suffix: "см", hint: "Ширина переду, спинки або шарфа" },
        calculate: (v1: number, v2: number, v3: number) => {
          const stitches = Math.round(v3 * (v1 / 10))
          const stitchDensity = (v1 / 10).toFixed(2)
          const rowDensity = (v2 / 10).toFixed(2)
          return {
            title: "Розрахована щільність та набір петель",
            value: `${stitches} петель (${stitchDensity} п. / 1 см)`,
            note: `Ваша щільність: ${stitchDensity} п./см та ${rowDensity} р./см. Для деталі шириною ${v3} см наберіть ${stitches} петель (+2 крайові, якщо в'яжете поворотними рядами).`,
          }
        },
      }

    case "vytrata":
      return {
        field1: { label: "Орієнтовний метраж на виріб", default: "1150", suffix: "метрів", hint: "Зазвичай 1000–1400 м на класичний светр" },
        field2: { label: "Метраж одного мотка", default: "250", suffix: "м / моток", hint: "Довжина нитки в одному мотку за етикеткою" },
        field3: { label: "Вага одного мотка", default: "100", suffix: "грамів", hint: "Фасування пряжі (50 г або 100 г)" },
        calculate: (v1: number, v2: number, v3: number) => {
          const skeinMeters = Math.max(1, v2)
          const baseSkeins = Math.ceil(v1 / skeinMeters)
          const safetyMeters = v1 * 1.1
          const safetySkeins = Math.ceil(safetyMeters / skeinMeters)
          const totalWeight = safetySkeins * v3
          return {
            title: "Рекомендована кількість мотків",
            value: `${safetySkeins} мотків (${totalWeight} г)`,
            note: `Базова потреба: ${baseSkeins} мотків (${v1} м). З обов'язковим запасом +10% на зразок та хвостики (${Math.round(safetyMeters)} м) купуйте ${safetySkeins} мотків по ${v3} г.`,
          }
        },
      }

    case "shapka":
      return {
        field1: { label: "Обхват голови", default: "56", suffix: "см", hint: "Мірка над бровами та потилицею" },
        field2: { label: "Щільність петель після ВТО", default: "20", suffix: "п / 10 см", hint: "Кількість петель у 10 см зразка" },
        field3: { label: "Поправка на розтягнення гумки", default: "15", suffix: "%", hint: "Зазвичай 12–15% для гарного облягання" },
        calculate: (v1: number, v2: number, v3: number) => {
          const rawStitches = v1 * (v2 / 10)
          const stretchFactor = 1 - (v3 / 100)
          const adjustedStitches = rawStitches * stretchFactor
          const stitches = Math.round(adjustedStitches / 4) * 4
          const height = Math.round((v1 / 3) + 3)
          return {
            title: "Петлі набору для шапки",
            value: `${stitches} петель (${height} см висота)`,
            note: `Для обхвату ${v1} см з поправкою на розтягнення -${v3}% наберіть ${stitches} петель (число кратне 4 для гумки 2×2 та симетричної маківки). Орієнтовна висота: ${height} см.`,
          }
        },
      }

    case "shkarpetky":
      return {
        field1: { label: "Обхват стопи (по кісточках)", default: "24", suffix: "см", hint: "Найширше місце біля основи пальців" },
        field2: { label: "Щільність петель після ВТО", default: "28", suffix: "п / 10 см", hint: "Кількість петель у 10 см зразка" },
        field3: { label: "Коефіцієнт облягання", default: "10", suffix: "%", hint: "Зазвичай 10% (мінус на щільне облягання)" },
        calculate: (v1: number, v2: number, v3: number) => {
          const rawStitches = v1 * (v2 / 10)
          const adjustedStitches = rawStitches * (1 - v3 / 100)
          const stitches = Math.round(adjustedStitches / 4) * 4
          const perNeedle = stitches / 4
          return {
            title: "Петлі набору для шкарпеток",
            value: `${stitches} петель (${perNeedle} п на спицю)`,
            note: `Для обхвату ${v1} см з поправкою -${v3}% наберіть ${stitches} петель. Розподіліть рівно по ${perNeedle} петель на кожну з 4 панчішних спиць.`,
          }
        },
      }

    // Default garment / sweater / cardigan / oversize / fit calculator
    default:
      return {
        field1: { label: "Базова мірка обхвату або ширини", default: "96", suffix: "см", hint: "Обхват грудей, стегон або ширина деталі" },
        field2: { label: "Щільність петель після ВТО", default: "21", suffix: "п / 10 см", hint: "Кількість петель у 10 см полотна" },
        field3: {
          label: "Свобода облягання",
          default: slug.includes("oversayz") ? "20" : slug.includes("krugove") || slug.includes("kruhove") ? "8" : "6",
          suffix: "см",
          hint: "Припуск на вільне облягання",
        },
        calculate: (v1: number, v2: number, v3: number) => {
          const totalWidth = v1 + v3
          const rawStitches = totalWidth * (v2 / 10)
          const isCircular = slug.includes("krugove") || slug.includes("kruhove") || slug.includes("dzhemper") || slug.includes("svetr")
          const stitches = Math.round(rawStitches / 2) * 2 // Округлення до парного для симетрії
          const half = stitches / 2
          return {
            title: isCircular ? "Петлі набору по колу" : "Петлі для деталі",
            value: `${stitches} петель`,
            note: isCircular
              ? `Повний обхват ${totalWidth} см: наберіть ${stitches} петель по колу (по ${half} п. на перед і спинку).`
              : `Ширина полотна ${totalWidth} см: рекомендований набір становить ${stitches} петель (включно з крайовими).`,
          }
        },
      }
  }
}

export function SeoDemoCalculator({ calculator }: { calculator: CalculatorDefinition }) {
  if (!calculator.demo) return null

  const config = useMemo(() => getCalculatorConfig(calculator.slug), [calculator.slug])

  const [val1, setVal1] = useState(config.field1.default)
  const [val2, setVal2] = useState(config.field2.default)
  const [val3, setVal3] = useState(config.field3 ? config.field3.default : "0")

  const result = useMemo(() => {
    const num1 = parseNumber(val1)
    const num2 = parseNumber(val2)
    const num3 = parseNumber(val3)
    return config.calculate(num1, num2, num3)
  }, [config, val1, val2, val3])

  return (
    <div className="grid gap-8">
      {/* Interactive live calculator widget */}
      <Card className="overflow-hidden rounded-3xl border-primary/20 shadow-xl">
        <CardHeader className="bg-primary/5 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Calculator className="h-4 w-4" />
            <span>Інтерактивний онлайн-розрахунок</span>
          </div>
          <CardTitle className="mt-2 font-serif text-3xl md:text-4xl text-foreground">
            {calculator.shortTitle}
          </CardTitle>
          <CardDescription className="text-base leading-7">
            Введіть ваші параметри — калькулятор миттєво обчислить точну кількість петель або рядів під вашу щільність.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.1fr_1fr] lg:gap-8">
          {/* Input fields */}
          <div className="space-y-4 rounded-3xl border border-border bg-card/60 p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ваші вхідні мірки:
            </p>

            <Field
              label={config.field1.label}
              value={val1}
              onChange={setVal1}
              suffix={config.field1.suffix}
              hint={config.field1.hint}
            />

            <Field
              label={config.field2.label}
              value={val2}
              onChange={setVal2}
              suffix={config.field2.suffix}
              hint={config.field2.hint}
            />

            {config.field3 ? (
              <Field
                label={config.field3.label}
                value={val3}
                onChange={setVal3}
                suffix={config.field3.suffix}
                hint={config.field3.hint}
              />
            ) : null}
          </div>

          {/* Result card */}
          <div className="flex flex-col justify-between rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>{result.title}</span>
              </div>
              <div className="mt-4 font-serif text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {result.value}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {result.note}
              </p>
            </div>

            <div className="mt-6 border-t border-border/70 pt-4">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Зберегти розрахунок у додатку <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formula & Practical Checklist block */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-border bg-background p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Теоретична формула</p>
          <p className="mt-3 rounded-2xl bg-muted p-4 text-sm font-semibold leading-7 text-foreground">
            {calculator.demo.formula}
          </p>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">{calculator.demo.example}</p>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Чекліст перед в'язанням</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            {calculator.demo.checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {calculator.demo.relatedCalculatorSlug ? (
            <Link
              href={`/kalkuliatory/${calculator.demo.relatedCalculatorSlug}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {calculator.demo.relatedCalculatorLabel || "Відкрити пов'язаний калькулятор"} <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}
        </section>
      </div>
    </div>
  )
}