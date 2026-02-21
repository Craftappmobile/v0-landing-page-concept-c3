"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const HERO_SCREENS = [
  { src: "/images/hero-screen-1.jpg", alt: "Головний екран додатку з калькуляторами" },
  { src: "/images/hero-screen-2.jpg", alt: "Калькулятор розрахунку складань пряжі" },
  { src: "/images/hero-screen-3.jpg", alt: "Результати розрахунку з рекомендаціями" },
  { src: "/images/hero-screen-4.jpg", alt: "Трекер проєктів з прогресом" },
  { src: "/images/hero-screen-5.jpg", alt: "Лічильник рядів з прогресом в'язання" },
  { src: "/images/hero-screen-6.jpg", alt: "Галерея схем та натхнення" },
  { src: "/images/hero-screen-7.jpg", alt: "Галерея відео майстер-класів" },
  { src: "/images/hero-screen-8.jpg", alt: "Каталог пряжі зі статистикою" },
]

function HeroPhoneMockup() {
  const [active, setActive] = useState(0)

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % HERO_SCREENS.length)
  }, [])

  useEffect(() => {
    const id = setInterval(next, 3500)
    return () => clearInterval(id)
  }, [next])

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* Glow */}
      <div className="hero-glow absolute -inset-4 rounded-[3rem] bg-primary/5 blur-2xl" />

      {/* Phone frame */}
      <div className="relative rounded-[2.5rem] border-[6px] border-foreground/80 bg-foreground/80 p-1.5 shadow-2xl">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/80" />

        {/* Screen */}
        <div className="relative overflow-hidden rounded-[2rem] bg-background">
          <div className="aspect-[9/19.5] relative">
            {HERO_SCREENS.map((screen, i) => (
              <Image
                key={screen.src}
                src={screen.src}
                alt={screen.alt}
                fill
                className={`object-cover object-top transition-opacity duration-700 ${
                  i === active ? "opacity-100" : "opacity-0"
                }`}
                sizes="280px"
                priority={i === 0}
              />
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="mx-auto mt-1.5 h-1 w-24 rounded-full bg-background/40" />
      </div>

      {/* Screen dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {HERO_SCREENS.map((_, i) => (
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

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animation keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes hero-fade-in {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes hero-phone-reveal {
              from { opacity: 0; transform: translateY(32px) scale(0.95); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes hero-glow-pulse {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50%      { opacity: 0.7; transform: scale(1.05); }
            }
            @keyframes gradient-shift {
              0%   { background-position: 0% 50%; }
              50%  { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }

            .animated-gradient-text {
              background: linear-gradient(
                270deg,
                hsl(var(--foreground)),
                hsl(142, 40%, 35%),
                hsl(25, 50%, 45%),
                hsl(142, 40%, 35%),
                hsl(var(--foreground))
              );
              background-size: 300% 100%;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: gradient-shift 6s ease-in-out infinite;
            }

            .hero-text-1 {
              opacity: 0;
              animation: hero-fade-in 0.8s ease-out 0.1s forwards;
            }
            .hero-text-2 {
              opacity: 0;
              animation: hero-fade-in 0.8s ease-out 0.3s forwards;
            }
            .hero-text-3 {
              opacity: 0;
              animation: hero-fade-in 0.8s ease-out 0.5s forwards;
            }
            .hero-phone-container {
              opacity: 0;
              animation: hero-phone-reveal 1s ease-out 0.4s forwards;
            }
            .hero-glow {
              animation: hero-glow-pulse 4s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-text-1,
              .hero-text-2,
              .hero-text-3,
              .hero-phone-container {
                opacity: 1;
                animation: none;
              }
              .hero-glow {
                animation: none;
              }
              .animated-gradient-text {
                animation: none;
                -webkit-text-fill-color: unset;
                background: none;
              }
            }
          `,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-6 pb-8 lg:px-8 lg:pt-8 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          {/* --- Text block --- */}
          <div className="flex flex-col gap-5">
            <h1 className="hero-text-1 animated-gradient-text font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl text-balance">
              {"Мінімум математики."}
              <br />
              {"Максимум в'язання."}
            </h1>

            <p className="hero-text-2 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {"Перший додаток з 30 калькуляторами для в'язання, обліком пряжі та спільнотою — все в одному місці."}
            </p>

            {/* Social proof */}
            <div className="hero-text-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-500 fill-yellow-500" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {"1000+ майстринь вже в'яжуть з нами"}
              </span>
            </div>

            <div className="hero-text-3 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 text-base" asChild>
                <Link href="#pricing">
                  {"Отримати Premium-доступ"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base" asChild>
                <Link href="#features">{"Дізнатися більше"}</Link>
              </Button>
            </div>
          </div>

          {/* --- Smartphone mockup --- */}
          <div className="hero-phone-container relative flex items-center justify-center lg:justify-end">
            <HeroPhoneMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
