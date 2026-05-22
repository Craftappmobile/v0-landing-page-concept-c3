import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { GaugeCalculator } from "@/components/calculators/gauge-calculator"
import { PatternAdaptationCalculator } from "@/components/calculators/pattern-adaptation-calculator"
import { RaglanShoulderCalculator } from "@/components/calculators/raglan-shoulder-calculator"
import { SeoDemoCalculator } from "@/components/calculators/seo-demo-calculator"
import { YarnFoldingCalculator } from "@/components/calculators/yarn-folding-calculator"
import { YarnConsumptionCalculator } from "@/components/calculators/yarn-consumption-calculator"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { getAllCalculators, getCalculatorBySlug, type CalculatorDefinition } from "@/lib/calculators"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://vjazhi.com.ua"

type CalculatorPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllCalculators().map((calculator) => ({ slug: calculator.slug }))
}

export async function generateMetadata({ params }: CalculatorPageProps): Promise<Metadata> {
  const { slug } = await params
  const calculator = getCalculatorBySlug(slug)

  if (!calculator) return { title: "Калькулятор не знайдено — Розрахуй і В'яжи" }

  return {
    title: `${calculator.title} — Розрахуй і В'яжи`,
    description: calculator.description,
    keywords: calculator.keywords,
    alternates: { canonical: `/kalkuliatory/${calculator.slug}` },
    openGraph: {
      type: "website",
      locale: "uk_UA",
      url: `/kalkuliatory/${calculator.slug}`,
      siteName: "Розрахуй і В'яжи",
      title: calculator.title,
      description: calculator.description,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: calculator.title,
      description: calculator.description,
      images: ["/opengraph-image"],
    },
  }
}

function CalculatorDemo({ calculator }: { calculator: CalculatorDefinition }) {
  const { slug } = calculator

  if (slug === "vytrata") return <YarnConsumptionCalculator />
  if (slug === "skladannya") return <YarnFoldingCalculator />
  if (slug === "shchilnist") return <GaugeCalculator />
  if (slug === "adaptatsiya") return <PatternAdaptationCalculator />
  if (slug === "rahlan") return <RaglanShoulderCalculator />
  if (calculator.demo) return <SeoDemoCalculator calculator={calculator} />
  return null
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { slug } = await params
  const calculator = getCalculatorBySlug(slug)

  if (!calculator) notFound()

  const pageUrl = `${siteUrl}/kalkuliatory/${calculator.slug}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calculator.shortTitle,
    description: calculator.description,
    url: pageUrl,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "UAH" },
    publisher: { "@type": "Organization", name: "Розрахуй і В'яжи", url: siteUrl },
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: calculator.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <section className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Демо-калькулятор</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-serif leading-tight text-foreground md:text-6xl">
              {calculator.shortTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{calculator.intro}</p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14">
          <CalculatorDemo calculator={calculator} />

          <div className="mt-10 grid gap-5 md:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-2xl font-serif text-foreground">Як користуватись</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                {(calculator.usageSteps || ["Оберіть потрібний режим розрахунку.", "Введіть свої дані у поля калькулятора.", "Перевірте результат і додайте запас під ваш проєкт."]).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
            <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
              <h2 className="text-2xl font-serif text-foreground">Повна версія</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                У додатку можна зберігати проєкти, пряжу, щільність і швидко повертатися до розрахунків.
              </p>
              <Link href="/#pricing" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
                Спробувати Premium <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

          <section className="mt-10" aria-labelledby="calculator-faq-heading">
            <h2 id="calculator-faq-heading" className="text-3xl font-serif text-foreground">Поширені питання</h2>
            <div className="mt-5 divide-y divide-border rounded-3xl border border-border bg-card/40">
              {calculator.faq.map((item) => (
                <details key={item.question} className="group p-5 open:bg-background/60 md:p-6">
                  <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  )
}