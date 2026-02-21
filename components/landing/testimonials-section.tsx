"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  {
    name: "oliamoshenska",
    role: "В'яже 5 років",
    avatar: "/images/avatar-olia.png",
    text: "Це не просто додаток, це знахідка для в'язалочки. Всі проект, пряжа та розрахунки під рукою, в одному додатку. Я тестувала, цей додаток і хочу сказати, що тут є все, що потрібно. Зручні калькулятори, порахують все за нас, лічильник рядів, прогрес в'язання проекту і ще багато іншого можна знайти в цьому додатку. А ще можна зберігати купу картинок для натхнення. Дякую велике за такого незамінного помічника для в'язаллчки! Дуже рекомендую спробувати\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F",
    stars: 5,
  },
  {
    name: "Мар'яна Б.",
    role: "Майстриня в'язання",
    avatar: "/images/avatar-maryana.png",
    text: "Облік пряжі — моя улюблена функція. Тепер я точно знаю, що лежить у кожній скриньці, і більше не купую зайве. Економлю і час, і гроші!",
    stars: 5,
  },
  {
    name: "irynka_kaminska",
    role: "В'яже понад 20 років",
    avatar: "/images/avatar-irynka.png",
    text: "Дуже зручний і цікавий застосунок! \uD83D\uDD25 В'язати шкарпетки по одній стало набагато простіше. І не треба кожен раз згадувати скільки убавок і додавань було зроблено. Те ж саме і з рукавами - вийшли однаковими з першого разу \uD83D\uDE02 Дякую за такого чудового помічника \u2764\uFE0F",
    stars: 5,
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused])

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {"Відгуки"}
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
            {"Що кажуть наші майстрині"}
          </h2>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-sm transition-colors hover:bg-muted lg:flex"
            aria-label="Попередній відгук"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            onClick={next}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-sm transition-colors hover:bg-muted lg:flex"
            aria-label="Наступний відгук"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* Cards container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {testimonials.map((t, i) => (
                <div key={i} className="w-full shrink-0 px-2">
                  <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="flex-1 text-base leading-relaxed text-muted-foreground sm:text-lg">
                      {`"${t.text}"`}
                    </p>
                    <div className="flex items-center gap-3 border-t border-border pt-4">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        width={44}
                        height={44}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`Відгук ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
