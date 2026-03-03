"use client"

/**
 * Компонент шапки сайту з адаптивним мобільним меню.
 *
 * Особливості:
 * - Sticky позиціонування з розмитим фоном (`backdrop-blur`)
 * - Навігаційні посилання на якорі секцій (#features, #community, #pricing, #faq)
 * - Мобільне гамбургер-меню (відображається на екранах < md)
 * - Кнопка "Спробувати PRO" → прокручує до секції #pricing
 *
 * @component Клієнтський (потребує useState для стану меню)
 */
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Sticky-шапка з логотипом, навігацією та кнопкою CTA.
 * На мобільних пристроях відображає кнопку бургер-меню.
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
              src="/images/logo.jpg"
              alt="Розрахуй і В'яжи логотип"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover"
            />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            {"Розрахуй і В'яжи"}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"Можливості"}
          </a>
          <a
            href="#community"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"Спільнота"}
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"Підписка"}
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {"FAQ"}
          </a>
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <a href="#pricing">{"Обрати тариф"}</a>
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-3">
            <a
              href="#features"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {"Можливості"}
            </a>
            <a
              href="#community"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {"Спільнота"}
            </a>
            <a
              href="#pricing"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {"Підписка"}
            </a>
            <a
              href="#faq"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {"FAQ"}
            </a>
            <div className="mt-2 px-3">
              <Button className="w-full" asChild>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                  {"Обрати тариф"}
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
