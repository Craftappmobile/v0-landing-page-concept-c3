"use client"

import { FormEvent, useEffect, useState } from "react"

import type { BlogComment } from "@/lib/blog-comments"

type BlogCommentsProps = {
  slug: string
  initialComments: BlogComment[]
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function BlogComments({ slug, initialComments }: BlogCommentsProps) {
  const [comments, setComments] = useState(initialComments)
  const [authorName, setAuthorName] = useState("")
  const [body, setBody] = useState("")
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadComments() {
      try {
        const response = await fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
        if (!response.ok) return
        const data = await response.json() as { comments?: BlogComment[] }
        if (!cancelled) setComments(data.comments ?? [])
      } catch {
        // Server-rendered comments remain visible if refresh fails.
      }
    }

    loadComments()

    return () => {
      cancelled = true
    }
  }, [slug])

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus("submitting")
    setMessage("")

    try {
      const response = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, authorName, body, website }),
      })
      const data = await response.json().catch(() => ({})) as { error?: string }

      if (!response.ok) {
        setStatus("error")
        setMessage(data.error || "Не вдалося надіслати коментар")
        return
      }

      setAuthorName("")
      setBody("")
      setWebsite("")
      setStatus("success")
      setMessage("Дякуємо! Коментар з’явиться після модерації.")
    } catch {
      setStatus("error")
      setMessage("Помилка мережі. Спробуйте ще раз.")
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-10" aria-labelledby="comments-heading">
      <div className="rounded-3xl border border-border bg-card/40 p-5 md:p-7">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Обговорення</p>
          <h2 id="comments-heading" className="mt-3 text-3xl font-serif text-foreground">
            Коментарі до статті
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Поставте питання або поділіться досвідом. Ми публікуємо коментарі після модерації,
            щоб під статтею залишалися тільки корисні відповіді без спаму.
          </p>
        </div>

        <form onSubmit={submitComment} className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="comment-author" className="text-sm font-medium text-foreground">
              Ім’я
            </label>
            <input
              id="comment-author"
              value={authorName}
              onChange={(event) => setAuthorName(event.target.value)}
              minLength={2}
              maxLength={60}
              required
              className="rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none ring-primary transition focus:ring-2"
              placeholder="Наприклад, Олена"
            />
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="comment-website">Сайт</label>
            <input id="comment-website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="comment-body" className="text-sm font-medium text-foreground">
              Коментар
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              minLength={10}
              maxLength={1200}
              required
              rows={5}
              className="resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none ring-primary transition focus:ring-2"
              placeholder="Напишіть питання або корисне уточнення до теми статті..."
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">До 1200 символів. HTML-теги видаляються автоматично.</p>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? "Надсилаємо..." : "Надіслати коментар"}
            </button>
          </div>

          {message ? (
            <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-primary"} role="status">
              {message}
            </p>
          ) : null}
        </form>

        <div className="mt-8 space-y-4">
          {comments.length > 0 ? comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <strong className="text-foreground">{comment.authorName}</strong>
                <span className="text-muted-foreground">·</span>
                <time className="text-muted-foreground" dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">{comment.body}</p>
            </article>
          )) : (
            <p className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
              Поки немає опублікованих коментарів. Станьте першою людиною, яка поставить питання до цієї теми.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}