import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { formatPostDate, getAllPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Блог про в’язання — інструкції, поради та розрахунки",
  description:
    "Практичні статті про в’язання: щільність, витрата пряжі, реглан, шкарпетки, светри, майстер-класи та калькулятори для майстринь.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/blog",
    siteName: "Розрахуй і В'яжи",
    title: "Блог про в’язання — Розрахуй і В'яжи",
    description:
      "Добірка SEO-статей, інструкцій і майстер-класів для точних розрахунків у в’язанні.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог про в’язання — Розрахуй і В'яжи",
    description: "Поради, розрахунки та майстер-класи для в’язальниць.",
    images: ["/opengraph-image"],
  },
}

function categoryLabel(category: string) {
  const labels: Record<string, string> = {
    guide: "Гайд",
    overview: "Огляд",
    "master-class": "Майстер-клас",
  }

  return labels[category] || "Стаття"
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="border-b border-border bg-card/40">
          <div className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Блог Розрахуй і В&apos;яжи
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-serif leading-tight text-foreground md:text-6xl">
              Блог для в’язальниць: поради, інструкції та точні розрахунки
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Тут зібрані практичні матеріали про щільність, витрату пряжі, реглан, шкарпетки,
              светри та адаптацію описів. Читайте покрокові гайди й майстер-класи, щоб в’язати
              впевненіше, точніше та без зайвого перев’язування.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-10 lg:px-8 lg:py-14" aria-labelledby="articles-heading">
          <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="articles-heading" className="text-2xl font-serif text-foreground md:text-3xl">
                Усі статті
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{posts.length} матеріали для точних розрахунків і впевненого в’язання.</p>
            </div>
            <Link href="/#pricing" className="text-sm font-semibold text-primary hover:text-primary/80">
              Спробувати Premium →
            </Link>
          </div>

          <ol className="divide-y divide-border">
            {posts.map((post, index) => (
              <li key={post.slug}>
                <article className="group py-7 md:py-8">
                  <Link href={`/blog/${post.slug}`} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <span aria-hidden="true">/</span>
                        <span>{categoryLabel(post.category)}</span>
                        <span aria-hidden="true">/</span>
                        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                        <span aria-hidden="true">/</span>
                        <span>{post.readingTime} хв читання</span>
                      </div>
                      <h3 className="mt-3 text-2xl font-serif leading-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
                        {post.title}
                      </h3>
                      <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                        {post.description}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                      Читати <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  )
}