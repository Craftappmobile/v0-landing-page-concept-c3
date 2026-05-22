import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { getAllCalculators, type CalculatorDefinition } from "@/lib/calculators"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

export const metadata: Metadata = {
  title: "Калькулятори для в'язання онлайн — петлі, пряжа, реглан, шапка",
  description:
    "Безкоштовні калькулятори для в'язання: щільність, витрата пряжі, реглан, горловина, рукав, шапка, шкарпетки, светр і перерахунок петель.",
  alternates: { canonical: "/kalkuliatory" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/kalkuliatory",
    siteName: "Розрахуй і В'яжи",
    title: "Калькулятори для в'язання онлайн — Розрахуй і В'яжи",
    description: "Усі розрахунки для в'язання в одному місці: петлі, ряди, пряжа, посадка, аксесуари та конструкції.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Калькулятори для в'язання онлайн",
    description: "Петлі, пряжа, реглан, горловина, рукав, шапка і шкарпетки — швидкі онлайн-розрахунки.",
    images: ["/opengraph-image"],
  },
}

const prioritySlugs = new Set(["shchilnist", "vytrata", "rahlan", "shapka", "shkarpetky", "rukav", "horlovyna"])

const calculatorGroups = [
  { title: "Базові розрахунки", description: "Почніть із щільності, петель, рядів, витрати пряжі та адаптації опису.", slugs: ["shchilnist", "petli", "dovzhyna", "vytrata", "skladannya", "adaptatsiya", "rozmiry"] },
  { title: "Одяг", description: "Светри, кардигани, жакети, жилети та дитячі вироби з потрібною свободою облягання.", slugs: ["svetr", "dzhemper-kruhlyy", "kardyhan", "kardygan", "zhaket", "zhilet", "dytyachyy", "oversayz"] },
  { title: "Конструкція виробу", description: "Реглан, кокетка, горловина, виріз, рукав, плечі й убавки для посадки без перекосів.", slugs: ["rahlan", "koketka", "horlovyna", "vyriz", "rukav", "pleche", "letucha-mysha", "ubavky"] },
  { title: "Аксесуари", description: "Швидкі розрахунки для шапок, шкарпеток і шарфів за реальними мірками.", slugs: ["shapka", "shkarpetky", "sharf"] },
  { title: "Візерунки, пряжа і техніки", description: "Рапорти, арани, ажур, гумка, кругове в'язання, мохер і секційна пряжа.", slugs: ["azhur", "arany", "vizerunky", "humka", "krugove", "kruhove", "mokher", "sektsiyna"] },
]

const faq = [
  { question: "Який калькулятор обрати першим?", answer: "Почніть із калькулятора щільності. Він переводить зразок у петлі та ряди на 1 см, а ці значення потрібні майже для всіх інших розрахунків." },
  { question: "Чи можна використовувати калькулятори без реєстрації?", answer: "Так, сторінки калькуляторів доступні безкоштовно. Premium потрібен для збереження проєктів, пряжі, мірок і швидкого повернення до розрахунків." },
  { question: "Чому результат треба округляти?", answer: "У в'язанні важлива кратність рапорту, гумки, маківки або симетрії деталей. Тому калькулятор дає базу, а фінальне число варто звіряти з конструкцією виробу." },
]

function getCalculatorMap(calculators: CalculatorDefinition[]) {
  return new Map(calculators.map((calculator) => [calculator.slug, calculator]))
}

function CalculatorCard({ calculator }: { calculator: CalculatorDefinition }) {
  const isPriority = prioritySlugs.has(calculator.slug)

  return (
    <Link href={`/kalkuliatory/${calculator.slug}`} className="group rounded-3xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{isPriority ? "Повний калькулятор" : "Формула + приклад"}</p>
          <h3 className="mt-2 text-xl font-serif leading-tight text-foreground group-hover:text-primary">{calculator.shortTitle}</h3>
        </div>
        <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
      </div>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">{calculator.description}</p>
    </Link>
  )
}

export default function CalculatorsHubPage() {
  const calculators = getAllCalculators()
  const calculatorMap = getCalculatorMap(calculators)
  const groupedSlugs = new Set(calculatorGroups.flatMap((group) => group.slugs))
  const ungrouped = calculators.filter((calculator) => !groupedSlugs.has(calculator.slug))
  const allGroups = ungrouped.length
    ? [...calculatorGroups, { title: "Інші калькулятори", description: "Додаткові корисні розрахунки для в'язання.", slugs: ungrouped.map((calculator) => calculator.slug) }]
    : calculatorGroups
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "Калькулятори для в'язання онлайн", description: metadata.description, url: `${siteUrl}/kalkuliatory` },
      { "@type": "ItemList", name: "Список калькуляторів для в'язання", itemListElement: calculators.map((calculator, index) => ({ "@type": "ListItem", position: index + 1, name: calculator.shortTitle, url: `${siteUrl}/kalkuliatory/${calculator.slug}` })) },
      { "@type": "FAQPage", mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Калькулятори Розрахуй і В&apos;яжи</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-serif leading-tight text-foreground md:text-6xl">Калькулятори для в&apos;язання онлайн</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Зібрали всі інструменти для точних розрахунків: щільність, петлі, витрата пряжі, реглан, горловина, рукав, шапка, шкарпетки, светр і адаптація майстер-класів.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[`${calculators.length} калькулятори`, "7 пріоритетних інструментів", "FAQ і приклади розрахунків"].map((item) => <div key={item} className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-foreground"><CheckCircle2 className="h-4 w-4 text-primary" />{item}</div>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 lg:px-8 lg:py-14" aria-labelledby="popular-calculators-heading">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="popular-calculators-heading" className="text-3xl font-serif text-foreground">Популярні калькулятори</h2>
              <p className="mt-2 text-sm text-muted-foreground">Найкорисніші сторінки з реальними полями вводу та миттєвим результатом.</p>
            </div>
            <Link href="/#pricing" className="text-sm font-semibold text-primary hover:text-primary/80">Зберігати розрахунки в Premium →</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...prioritySlugs].map((slug) => calculatorMap.get(slug)).filter(Boolean).map((calculator) => <CalculatorCard key={calculator!.slug} calculator={calculator!} />)}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-12 lg:px-8 lg:pb-16" aria-labelledby="all-calculators-heading">
          <h2 id="all-calculators-heading" className="text-3xl font-serif text-foreground">Усі калькулятори за темами</h2>
          <div className="mt-6 space-y-8">
            {allGroups.map((group) => <section key={group.title} className="rounded-3xl border border-border bg-background p-5 md:p-6"><h3 className="text-2xl font-serif text-foreground">{group.title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{group.description}</p><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{group.slugs.map((slug) => calculatorMap.get(slug)).filter(Boolean).map((calculator) => <CalculatorCard key={calculator!.slug} calculator={calculator!} />)}</div></section>)}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-14 lg:px-8 lg:pb-20" aria-labelledby="calculators-faq-heading">
          <h2 id="calculators-faq-heading" className="text-3xl font-serif text-foreground">Поширені питання</h2>
          <div className="mt-5 divide-y divide-border rounded-3xl border border-border bg-card/40">
            {faq.map((item) => <details key={item.question} className="group p-5 open:bg-background/60 md:p-6"><summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">{item.question}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p></details>)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}