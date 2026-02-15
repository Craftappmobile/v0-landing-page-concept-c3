"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Hash } from "lucide-react"

const SCREENS = [
  { src: "/images/community-screen-1.jpg", alt: "Стрічка спільноти з публікаціями в'язальниць" },
  { src: "/images/community-screen-2.jpg", alt: "Сторінка пряжі з характеристиками" },
  { src: "/images/community-screen-3.jpg", alt: "Профіль користувача у спільноті" },
]

function PhoneMockup() {
  const [active, setActive] = useState(0)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % SCREENS.length)
  }, [])

  useEffect(() => {
    const id = setInterval(next, 3500)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-foreground/80 bg-foreground/80 p-1.5 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/80" />

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[2rem] bg-background">
          <div className="aspect-[9/19.5] relative">
            {SCREENS.map((screen, i) => (
              <Image
                key={screen.src}
                src={screen.src}
                alt={screen.alt}
                fill
                className={`object-cover object-top transition-opacity duration-700 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                sizes="280px"
              />
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="mx-auto mt-1.5 h-1 w-24 rounded-full bg-background/40" />
      </div>

      {/* Screen dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {SCREENS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active
                ? "w-6 bg-primary"
                : "w-2 bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Показати скриншот ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export function CommunitySection() {
  return (
    <section id="community" className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Phone emulator */}
          <div className="relative order-2 lg:order-1 flex justify-center">
            <PhoneMockup />
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {"Спільнота"}
            </p>
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
              {"Не просто інструмент, а родина в'язальниць"}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {"Публікуйте свої готові роботи, отримуйте підтримку, знаходьте натхнення за хештегами та діліться досвідом з тисячами майстринь з України!"}
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Heart,
                  text: "Діліться роботами та отримуйте відгуки",
                },
                {
                  icon: Hash,
                  text: "Знаходьте натхнення за хештегами",
                },
                {
                  icon: MessageCircle,
                  text: "Спілкуйтеся з майстринями з України",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
