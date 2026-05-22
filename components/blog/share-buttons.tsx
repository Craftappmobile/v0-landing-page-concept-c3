"use client"

import { useEffect, useMemo, useState } from "react"
import type { SVGProps } from "react"
import { Check, Copy, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"

type ShareButtonsProps = {
  slug: string
  url: string
  title: string
  description?: string
  variant?: "inline" | "sticky"
}

function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.94 4.36c.2-.86-.62-1.56-1.42-1.22L2.7 10.62c-.9.38-.86 1.66.06 1.98l4.56 1.57 1.74 5.46c.29.9 1.44 1.12 2.04.4l2.54-3.04 4.75 3.5c.78.58 1.9.14 2.13-.8l3.42-15.33ZM8.1 13.28l8.86-5.45c.43-.26.87.32.5.66l-7.31 6.76-.28 2.42-1.77-4.39Z" />
    </svg>
  )
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M14.2 8.35V6.9c0-.7.46-.86.79-.86h2.02V2.92l-2.78-.01c-3.09 0-3.79 2.31-3.79 3.79v1.65H8.66v3.22h1.78v9.52h3.76v-9.52h2.54l.34-3.22H14.2Z" />
    </svg>
  )
}

function ViberIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.5 3.72c-3.64-1.37-9.35-1.3-12.68.15-2.2.97-2.94 2.9-3.02 5.3-.06 1.82.07 5.23 1.62 6.84.69.72 1.7 1.16 2.88 1.42v2.62c0 .74.9 1.1 1.41.57l2.7-2.79c2.66.04 5.18-.12 7.1-.93 2.12-.9 2.87-2.85 2.97-5.25.12-2.96-.15-6.86-2.98-7.93Zm-1.63 11.22c-1.55.65-3.98.77-6.11.68-.34-.01-.67.12-.9.36l-1.03 1.06v-.92c0-.6-.43-1.1-1.02-1.2-.8-.13-1.4-.38-1.78-.78-.86-.9-1.02-3.45-.96-4.89.07-1.88.55-2.74 1.67-3.23 2.8-1.23 8.02-1.27 10.96-.16 1.38.52 1.63 2.79 1.53 5.64-.08 1.89-.58 2.94-2.36 3.44ZM9.4 7.54c-.34-.1-.7.1-.8.45-.09.34.1.7.45.8 2.25.62 3.43 1.85 4.01 4.18.09.35.43.56.78.48.35-.09.56-.44.48-.78-.7-2.81-2.22-4.38-4.92-5.13Zm.47 2.05a.64.64 0 0 0-.4 1.22c.89.3 1.37.8 1.62 1.7.1.34.45.54.8.45.34-.1.54-.45.45-.8-.37-1.33-1.16-2.16-2.47-2.57Zm-.62 2.54c-.37-.04-.66.26-.67.62-.02.35.26.65.62.67.62.02.93.34.95.96.01.35.3.63.65.63h.02c.36-.01.64-.31.63-.67-.04-1.28-.92-2.16-2.2-2.21Z" />
    </svg>
  )
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.52 3.48A11.77 11.77 0 0 0 12.15 0C5.66 0 .37 5.29.37 11.78c0 2.08.54 4.1 1.58 5.9L.27 23.82l6.29-1.65a11.74 11.74 0 0 0 5.59 1.42h.01c6.5 0 11.78-5.29 11.78-11.78 0-3.15-1.22-6.1-3.42-8.33ZM12.16 21.6a9.8 9.8 0 0 1-5-1.37l-.36-.22-3.73.98 1-3.63-.24-.37a9.78 9.78 0 0 1-1.5-5.2c0-5.39 4.39-9.78 9.8-9.78 2.61 0 5.07 1.02 6.92 2.87a9.73 9.73 0 0 1 2.87 6.92c0 5.4-4.39 9.8-9.77 9.8Zm5.36-7.33c-.29-.15-1.73-.85-2-.95-.27-.1-.46-.15-.66.15-.2.29-.76.95-.93 1.14-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.35-1.45-.87-.77-1.46-1.73-1.63-2.02-.17-.3-.02-.45.13-.6.13-.13.29-.34.44-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.9-2.16-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.52.07-.78.36-.27.3-1.03 1-1.03 2.45s1.05 2.84 1.2 3.04c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.67.62.7.22 1.35.19 1.86.12.56-.08 1.73-.7 1.97-1.38.24-.68.24-1.26.17-1.38-.07-.13-.27-.2-.56-.34Z" />
    </svg>
  )
}

function PinterestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.02 0C5.38 0 1.24 4.76 1.24 9.94c0 2.4 1.36 5.4 3.54 6.36.33.15.5.08.58-.23.06-.24.35-1.42.48-1.97.04-.18.02-.34-.13-.51-.72-.84-1.3-2.38-1.3-3.82 0-3.61 2.74-7.1 7.4-7.1 4.03 0 6.85 2.75 6.85 6.68 0 4.44-2.24 7.52-5.15 7.52-1.61 0-2.82-1.33-2.43-2.97.46-1.95 1.36-4.05 1.36-5.46 0-1.26-.68-2.31-2.08-2.31-1.65 0-2.98 1.7-2.98 4 0 1.46.49 2.45.49 2.45s-1.63 6.9-1.93 8.19c-.33 1.38-.2 3.32-.06 4.58.04.38.5.51.68.17.27-.5.36-.78.57-1.3.16-.42 1.01-3.93 1.01-3.93.54 1.02 2.1 1.88 3.77 1.88 4.96 0 8.54-4.56 8.54-10.22C20.43 4.97 16.38 0 12.02 0Z" />
    </svg>
  )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function createShareLinks(url: string, title: string, description?: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(description ? `${title} — ${description}` : title)

  return [
    { platform: "telegram", label: "Telegram", Icon: TelegramIcon, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, className: "bg-[#229ED9] hover:bg-[#1C8DC4]" },
    { platform: "facebook", label: "Facebook", Icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, className: "bg-[#1877F2] hover:bg-[#1468D8]" },
    { platform: "viber", label: "Viber", Icon: ViberIcon, href: `viber://forward?text=${encodedText}%20${encodedUrl}`, className: "bg-[#7360F2] hover:bg-[#6652E0]" },
    { platform: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon, href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`, className: "bg-[#25D366] hover:bg-[#1FB95A]" },
    { platform: "pinterest", label: "Pinterest", Icon: PinterestIcon, href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`, className: "bg-[#E60023] hover:bg-[#CC001F]" },
  ]
}

export function ShareButtons({ slug, url, title, description, variant = "inline" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [shareCount, setShareCount] = useState(0)
  const shareLinks = useMemo(() => createShareLinks(url, title, description), [description, title, url])
  const isSticky = variant === "sticky"

  useEffect(() => {
    let cancelled = false

    async function loadShareCount() {
      try {
        const response = await fetch(`/api/blog/share?slug=${encodeURIComponent(slug)}`, {
          cache: "no-store",
        })
        if (!response.ok) return
        const data = await response.json() as { totalCount?: number }
        if (!cancelled) setShareCount(data.totalCount ?? 0)
      } catch {
        // Keep the UI usable even if the counter request fails.
      }
    }

    loadShareCount()

    return () => {
      cancelled = true
    }
  }, [slug])

  async function trackShareClick(platform: string) {
    setShareCount((currentCount) => currentCount + 1)

    try {
      const response = await fetch("/api/blog/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, platform }),
      })

      if (!response.ok) return
      const data = await response.json() as { totalCount?: number }
      if (typeof data.totalCount === "number") setShareCount(data.totalCount)
    } catch {
      // Optimistic count remains visible if the network request fails.
    }
  }

  async function copyLink(openInstagram = false) {
    await trackShareClick(openInstagram ? "instagram" : "copy")
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
      if (openInstagram) window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")
    } catch {
      window.prompt("Скопіюйте посилання на статтю", url)
    }
  }

  return (
    <aside
      className={cn(
        "border border-border bg-card/90 shadow-sm backdrop-blur",
        isSticky ? "w-fit rounded-full p-2" : "w-full rounded-2xl p-3",
      )}
      aria-label="Поширити статтю"
    >
      <div className={cn(isSticky ? "flex flex-col gap-2" : "flex flex-wrap gap-2")}>
        {shareLinks.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => void trackShareClick(item.platform)}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              item.className,
            )}
            aria-label={`Поширити у ${item.label}`}
            title={`Поширити у ${item.label}`}
          >
            <item.Icon className="h-5 w-5" />
          </a>
        ))}
        <button
          type="button"
          onClick={() => copyLink(true)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Скопіювати посилання для Instagram"
          title="Скопіювати посилання для Instagram"
        >
          <InstagramIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => copyLink(false)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Скопіювати посилання"
          title="Скопіювати посилання"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Посилання скопійовано" : ""}
      </span>
      <div
        className={cn(
          "mt-2 inline-flex items-center justify-center gap-1 rounded-full border border-border bg-background/80 px-2 py-1 text-xs font-semibold text-muted-foreground",
          isSticky ? "w-full" : "w-fit",
        )}
        aria-label={`${shareCount} поширень статті`}
        title="Кількість поширень статті"
      >
        <Share2 className="h-3 w-3" />
        <span>{shareCount}</span>
      </div>
    </aside>
  )
}