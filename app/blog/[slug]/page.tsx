import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Footer } from "@/components/landing/footer"
import { Header } from "@/components/landing/header"
import { formatPostDate, getAllPosts, getPostBySlug, getRelatedPosts, markdownToHtml } from "@/lib/blog"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://vjazhi.com.ua"
const fallbackImage = "/opengraph-image"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="mx-auto max-w-3xl px-4 py-10 lg:px-8 lg:py-14">
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
          </header>

          <div className="blog-content mt-10" dangerouslySetInnerHTML={{ __html: html }} />
        </article>

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