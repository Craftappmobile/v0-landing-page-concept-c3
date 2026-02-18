/**
 * Модальне вікно оформлення підписки.
 *
 * Потік:
 * 1. Користувач вводить ім'я та email
 * 2. Клієнт відправляє POST /api/payment/create
 * 3. API повертає підписані дані для WayForPay Widget
 * 4. Widget відкривається для введення картки
 * 5. Callbacks обробляють результат (approved / declined / pending)
 */
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ShieldCheck } from 'lucide-react'

/** Zod-схема валідації форми оплати */
const paymentSchema = z.object({
  name: z.string().min(2, "Ім'я має бути не менше 2 символів"),
  email: z.string().email('Невірний формат email'),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planCode: string
  planName: string
  amount: string
}

export function PaymentModal({
  open,
  onOpenChange,
  planCode,
  planName,
  amount,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { name: '', email: '' },
  })

  async function onSubmit(values: PaymentFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: values.email,
          name: values.name,
          planCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Помилка створення платежу')
      }

      // Закриваємо модал перед відкриттям WayForPay
      onOpenChange(false)

      // Завантажуємо WayForPay Widget
      await loadWayForPayScript()

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wp = new (window as any).Wayforpay()
      wp.run(
        data,
        // on approved
        function () {
          alert('✅ Оплата успішна! Перевірте email для отримання доступу.')
        },
        // on declined
        function () {
          alert('❌ Оплату відхилено. Спробуйте ще раз або оберіть інший спосіб оплати.')
        },
        // on pending / in processing
        function () {
          alert('⏳ Платіж обробляється. Очікуйте підтвердження на email.')
        },
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Щось пішло не так'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Оформлення підписки</DialogTitle>
          <DialogDescription>
            {planName} — {amount} грн
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{"Ім'я та прізвище"}</FormLabel>
                  <FormControl>
                    <Input placeholder="Олена Петренко" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"Зачекайте..."}
                </>
              ) : (
                `Оплатити ${amount} грн`
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5" />
              {"Безпечна оплата через WayForPay"}
            </p>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Динамічне завантаження WayForPay Widget скрипту.
 * Завантажує скрипт лише один раз, при повторних викликах повертає resolved Promise.
 */
function loadWayForPayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById('widget-wfp-script')) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.id = 'widget-wfp-script'
    script.src = 'https://secure.wayforpay.com/server/pay-widget.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Не вдалося завантажити WayForPay'))
    document.head.appendChild(script)
  })
}
