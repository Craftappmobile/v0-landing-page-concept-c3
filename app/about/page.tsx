import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Mail } from "lucide-react"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") || "https://vjazhi.com.ua"

export const metadata: Metadata = {
  title: "Про проєкт — Розрахуй і В'яжи",
  description:
    "Про Розрахуй і В'яжи: онлайн-калькулятори, статті та методологія точних розрахунків для в'язання українською мовою.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/about",
    siteName: "Розрахуй і В'яжи",
    title: "Про проєкт Розрахуй і В'яжи",
    description: "Хто створює калькулятори й статті для в'язання, як перевіряються формули та як зв'язатися з командою.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Про проєкт Розрахуй і В'яжи",
    description: "Методологія, редакційні принципи й контакти проєкту для в'язальниць.",
    images: ["/opengraph-image"],
  },
}

const principles = [
  "Кожен розрахунок починається з контрольного зразка та щільності після ВТО.",
  "Формули пояснюються простими словами й доповнюються прикладами для реальних виробів.",
  "У статтях ми показуємо типові помилки, щоб майстрині могли перевірити себе до початку роботи.",
]

const tools = [
  ["/kalkuliatory/shchilnist", "Калькулятор щільності"],
  ["/kalkuliatory/vytrata", "Калькулятор витрати пряжі"],
  ["/kalkuliatory/rahlan", "Калькулятор реглан-погону"],
  ["/blog", "Блог з інструкціями"],
]

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: "Про проєкт Розрахуй і В'яжи",
        description: metadata.description,
        url: `${siteUrl}/about`,
      },
      {
        "@type": "Organization",
        name: "Розрахуй і В'яжи",
        url: siteUrl,
        logo: `${siteUrl}/images/logo.jpg`,
        email: "craftappmobile@gmail.com",
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Про проєкт</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-serif leading-tight text-foreground md:text-6xl">
              Розрахуй і В&apos;яжи — помічник для точного в&apos;язання
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Ми створюємо українські калькулятори, статті та практичні підказки для майстринь, які хочуть рахувати петлі, ряди, витрату пряжі й посадку виробу без хаосу в нотатках.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-5xl gap-6 px-4 py-10 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-14">
          <article className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-3xl font-serif text-foreground">Що ми робимо</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Сайт допомагає швидко перерахувати майстер-клас під вашу щільність, підібрати кількість петель для шапки чи шкарпеток, оцінити витрату пряжі та перевірити конструкцію светра, реглана, рукава або горловини.
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Ми не замінюємо досвід майстрині, але даємо зрозумілу математичну основу: формулу, приклад, таблицю, FAQ і попередження про типові помилки.
            </p>
          </article>

          <aside className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <h2 className="text-2xl font-serif text-foreground">Корисні розділи</h2>
            <div className="mt-5 flex flex-col gap-3">
              {tools.map(([href, label]) => (
                <Link key={href} href={href} className="inline-flex items-center justify-between gap-3 rounded-2xl bg-background px-4 py-3 text-sm font-semibold text-primary hover:text-primary/80">
                  {label} <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </aside>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-12 lg:px-8 lg:pb-16" aria-labelledby="methodology-heading">
          <div className="rounded-3xl border border-border bg-background p-6 md:p-8">
            <h2 id="methodology-heading" className="text-3xl font-serif text-foreground">Методологія та редакційні принципи</h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {principles.map((item) => (
                <li key={item} className="rounded-2xl border border-border bg-card p-5 text-sm leading-7 text-muted-foreground">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
            <h2 className="text-3xl font-serif text-foreground">Контакти</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Якщо ви знайшли неточність у формулі, хочете запропонувати тему статті або маєте питання щодо додатку, напишіть нам.
            </p>
            <a href="mailto:craftappmobile@gmail.com" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              <Mail className="h-4 w-4" /> craftappmobile@gmail.com
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}