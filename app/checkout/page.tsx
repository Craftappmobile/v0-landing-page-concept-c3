"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLANS: Record<string, { label: string; price: string; amount: string }> = {
  half:    { label: "6 місяців",  price: "599.99 грн", amount: "599.99" },
  year:    { label: "12 місяців", price: "918 грн",    amount: "918" },
  forever: { label: "Довічна",    price: "4 585 грн",  amount: "4 585" },
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Shell><div className="text-center py-12"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></div></Shell>}>
      <CheckoutForm />
    </Suspense>
  )
}

function CheckoutForm() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("plan") || "year"
  const status = searchParams.get("status")
  const plan = PLANS[planId] || PLANS.year

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setError(null) }, [name, email])

  if (status === "done") {
    return (
      <Shell>
        <div className="text-center py-8">
          <ShieldCheck className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Дякуємо!</h1>
          <p className="text-muted-foreground mb-6">
            Ваш платіж обробляється. Результат буде надіслано на вашу електронну пошту.
          </p>
          <Button asChild><Link href="/">На головну</Link></Button>
        </div>
      </Shell>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError("Заповніть усі поля"); return }
    setLoading(true); setError(null)
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, email: email.trim(), name: name.trim() }),
      })
      const data = await res.json()
      if (data.checkout_url) { window.location.href = data.checkout_url; return }
      setError(data.error || "Не вдалося створити платіж")
    } catch { setError("Помилка з'єднання. Спробуйте ще раз.") }
    finally { setLoading(false) }
  }

  return (
    <Shell>
      <Link href="/#pricing" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Назад до тарифів
      </Link>

      <h1 className="text-2xl font-bold mb-1">Оформлення підписки</h1>
      <p className="text-muted-foreground mb-6">
        Тариф: <strong>{plan.label}</strong> — <strong>{plan.price}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Ім&apos;я</label>
          <input id="name" type="text" required value={name} onChange={e => setName(e.target.value)}
            placeholder="Ваше ім'я" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          <p className="mt-1 text-xs text-muted-foreground">
            Вкажіть email, з яким ви входите в додаток — підписка активується автоматично.
          </p>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Обробка...</> : `Оплатити ${plan.amount} грн`}
        </Button>
      </form>

      <div className="mt-6 rounded-lg bg-secondary/50 p-4 text-xs text-muted-foreground space-y-1">
        <p className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-primary" />Безпечна оплата через платіжний сервіс <strong>Hutko</strong></p>
        {planId === "forever"
          ? <p>Одноразовий платіж — доступ назавжди без автоматичних списань.</p>
          : <p>Підписка продовжується автоматично після закінчення терміну. Ви можете <Link href="/cancel" className="text-primary underline hover:no-underline">скасувати її на сайті</Link> будь-коли.</p>
        }
        <p>Повернення коштів — протягом 14 днів.</p>
        <p>Після оплати ви будете перенаправлені на сторінку Hutko для введення даних картки.</p>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-12 sm:py-20">
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}

