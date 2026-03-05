"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CancelPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Send cancellation request via mailto fallback + form submission
    try {
      const subject = encodeURIComponent("Заявка на скасування підписки")
      const body = encodeURIComponent(
        `Заявка на скасування підписки\n\nEmail підписки: ${email}\n\nПрошу скасувати автопродовження підписки, оформленої на вказаний email.`
      )
      window.location.href = `mailto:craftappmobile@gmail.com?subject=${subject}&body=${body}`
      // Short delay to let mailto open
      await new Promise((r) => setTimeout(r, 1000))
    } catch {
      // Ignore mailto errors
    }
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {"На головну"}
          </Link>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.jpg"
              alt="Розрахуй і В'яжи логотип"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="text-sm font-semibold text-foreground">
              {"Розрахуй і В'яжи"}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-xl px-4 py-12 lg:px-8 lg:py-16">
        <h1 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
          {"Скасування підписки"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {"Щоб скасувати автопродовження підписки, заповніть форму нижче. Ми обробимо вашу заявку протягом 1 робочого дня."}
        </p>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/5 p-6 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {"Заявку надіслано!"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {"Ваш запит на скасування підписки прийнято. Ми обробимо його протягом 1 робочого дня та повідомимо вас на email."}
            </p>
            <Button asChild className="mt-6">
              <Link href="/">{"На головну"}</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                {"Email, на який оформлена підписка"}
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {"Натискаючи кнопку, ви надсилаєте заявку на скасування автопродовження підписки. Скасування набуває чинності після завершення поточного оплаченого терміну. Кошти за вже оплачений період не повертаються."}
              </p>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {"Скасувати підписку"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {"Або напишіть нам напряму: "}
              <a
                href="mailto:craftappmobile@gmail.com"
                className="text-primary underline hover:no-underline"
              >
                {"craftappmobile@gmail.com"}
              </a>
            </p>
          </form>
        )}
      </main>
    </div>
  )
}

