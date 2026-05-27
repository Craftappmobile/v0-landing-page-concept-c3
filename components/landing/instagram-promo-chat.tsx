"use client"

import { useEffect, useState } from "react"
import { Instagram, X } from "lucide-react"

const INSTAGRAM_DM_URL = "https://ig.me/m/yarnoncone_sincerelymerely"
const DISMISS_STORAGE_KEY = "instagram-promo-chat-dismissed"

declare global {
  interface Window {
    fbq?: (
      eventType: "trackCustom",
      eventName: string,
      parameters?: Record<string, string>,
    ) => void
  }
}

export function InstagramPromoChat() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isDismissed = window.sessionStorage.getItem(DISMISS_STORAGE_KEY) === "true"
    const shouldPreview = new URLSearchParams(window.location.search).get("promoChat") === "1"

    if (isDismissed && !shouldPreview) return

    const timer = window.setTimeout(() => setIsVisible(true), 1800)
    return () => window.clearTimeout(timer)
  }, [])

  function dismissChat() {
    window.sessionStorage.setItem(DISMISS_STORAGE_KEY, "true")
    setIsVisible(false)
  }

  function trackInstagramClick() {
    window.fbq?.("trackCustom", "InstagramPromoClick", {
      source: "site",
      destination: "instagram_dm",
      keyword: "сайт",
      promo_code: "YARNPREMIUM",
      placement: "home_floating_widget",
    })
  }

  if (!isVisible) return null

  return (
    <aside
      className="fixed bottom-5 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6 sm:max-w-xs"
      aria-label="Промокод через Instagram"
    >
      <div className="relative rounded-3xl border border-primary/20 bg-background p-5 pr-10 shadow-2xl shadow-primary/10">
        <button
          type="button"
          onClick={dismissChat}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Закрити Instagram-пропозицію"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="text-sm leading-6 text-foreground">
          <span className="font-semibold text-primary">Напишіть нам в Instagram</span> і отримайте знижку{" "}
          <span className="font-bold text-destructive">80%</span> на Premium 🧶
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Натисніть кнопку нижче та напишіть у чат слово{" "}
          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono font-bold text-primary">сайт</span>
          {" "}— бот одразу надішле промокод для активації знижки.
        </p>
      </div>

      <a
        href={INSTAGRAM_DM_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackInstagramClick}
        className="inline-flex items-center gap-3 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] px-5 py-3.5 text-sm font-semibold text-white shadow-xl transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Instagram className="h-6 w-6" aria-hidden="true" />
        Написати в Instagram
      </a>
    </aside>
  )
}