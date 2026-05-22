import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { BlogComments } from "@/components/blog/blog-comments"
import { ShareButtons } from "@/components/blog/share-buttons"
import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { formatPostDate, getAllPosts, getPostBySlug, getRelatedPosts, markdownToHtml } from "@/lib/blog"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://vjazhi.com.ua"
const fallbackImage = "/opengraph-image"

export const revalidate = 3600

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

function getEditorialQuestions(title: string) {
  return [
    {
      question: `Як перевірити розрахунки зі статті «${title}» перед початком роботи?`,
      answer:
        "Зв’яжіть контрольний зразок, виперіть або відпарте його так само, як майбутній виріб, і тільки після цього порівняйте свою щільність із розрахунками у статті.",
    },
    {
      question: "Що робити, якщо моя щільність в’язання відрізняється від прикладу?",
      answer:
        "Не копіюйте кількість петель механічно. Перерахуйте петлі та ряди під свою щільність, обрану пряжу, спиці або гачок і потрібний розмір виробу.",
    },
    {
      question: "Чи можна адаптувати ці поради під іншу пряжу або розмір?",
      answer:
        "Так. Орієнтуйтеся на фактичні мірки, щільність після ВТО та бажану посадку. Якщо пряжа товстіша або тонша, базові формули лишаються корисними, але числа потрібно перерахувати.",
    },
    {
      question: "Коли краще користуватися калькулятором, а не рахувати вручну?",
      answer:
        "Калькулятор зручний, коли потрібно швидко перевірити кілька розмірів, змінити щільність, порахувати витрату пряжі або адаптувати опис без помилок у формулах.",
    },
  ]
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: "Статтю не знайдено — Розрахуй і В'яжи",
    }
  }

  const canonical = `/blog/${post.slug}`
  const image = post.image || fallbackImage

  return {
    title: `${post.title} — Розрахуй і В'яжи`,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: "uk_UA",
      url: canonical,
      siteName: "Розрахуй і В'яжи",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [post.author],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const html = await markdownToHtml(post.content)
  const relatedPosts = getRelatedPosts(post.slug)
  const editorialQuestions = getEditorialQuestions(post.title)
  const articleUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = `${siteUrl}${post.image || fallbackImage}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Розрахуй і В'яжи",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo.jpg`,
      },
    },
    mainEntityOfPage: articleUrl,
  }
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: editorialQuestions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[5rem_minmax(0,48rem)] lg:px-8 lg:py-14">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <ShareButtons slug={post.slug} url={articleUrl} title={post.title} description={post.description} variant="sticky" />
            </div>
          </div>

          <article className="min-w-0">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">
              <ArrowLeft className="h-4 w-4" /> До блогу
            </Link>

            <header className="mt-8 border-b border-border pb-8">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true">/</span>
                <span>{post.readingTime} хв читання</span>
              </div>
              <h1 className="mt-4 text-4xl font-serif leading-tight text-foreground md:text-6xl">
                {post.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">{post.description}</p>
              <div className="mt-6 lg:hidden">
                <ShareButtons slug={post.slug} url={articleUrl} title={post.title} description={post.description} />
              </div>
            </header>

            <div className="blog-content mt-10" dangerouslySetInnerHTML={{ __html: html }} />

            <section className="mt-12 border-t border-border pt-10" aria-labelledby="faq-heading">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Корисні уточнення</p>
              <h2 id="faq-heading" className="mt-3 text-3xl font-serif text-foreground">
                Поширені питання до теми
              </h2>
              <div className="mt-5 divide-y divide-border rounded-3xl border border-border bg-card/40">
                {editorialQuestions.map((item) => (
                  <details key={item.question} className="group p-5 open:bg-background/60 md:p-6">
                    <summary className="cursor-pointer list-none text-base font-semibold text-foreground marker:hidden">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            <BlogComments slug={post.slug} initialComments={[]} />
          </article>
        </div>

        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-3xl px-4 py-10 lg:px-8">
            <h2 className="text-2xl font-serif text-foreground">Що почитати далі</h2>
            <ol className="mt-5 divide-y divide-border">
              {relatedPosts.map((relatedPost) => (
                <li key={relatedPost.slug} className="py-4">
                  <Link href={`/blog/${relatedPost.slug}`} className="group flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-foreground group-hover:text-primary">
                      {relatedPost.title}
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}