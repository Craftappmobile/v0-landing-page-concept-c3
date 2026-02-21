"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react" // icons

const YOUTUBE_VIDEO_ID = "5w-8U1mGz3o"
const POSTER_URL = "/images/video-poster.jpg"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)

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
            @keyframes hero-video-reveal {
              from { opacity: 0; transform: scale(0.92); }
              to   { opacity: 1; transform: scale(1); }
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
            .hero-text-4 {
              opacity: 0;
              animation: hero-fade-in 0.8s ease-out 0.7s forwards;
            }
            .hero-video-container {
              opacity: 0;
              animation: hero-video-reveal 1s ease-out 0.4s forwards;
            }
            .hero-glow {
              animation: hero-glow-pulse 4s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-text-1,
              .hero-text-2,
              .hero-text-3,
              .hero-text-4,
              .hero-video-container {
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
          {/* --- Text block with staggered fade-in --- */}
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

            {/* Key selling points */}
            <div className="hero-text-3 flex flex-col gap-3">
              <h2 className="text-base font-bold text-foreground">
                {"Точна математика в один клік"}
              </h2>
              <div className="flex flex-col gap-2.5">
                {[
                  {
                    title: "Адаптація чужих майстер-класів:",
                    text: "Купили МК, але у вас інша пряжа? Окремий спеціальний калькулятор миттєво перерахує всі дані під вашу щільність — більше ніякої математики вручну.",
                  },
                  {
                    title: "Мікс пряжі без стресу:",
                    text: "В'яжете в декілька складань із різних ниток? Додаток за секунду вирахує загальний метраж, точну кількість пряжі для покупки та підкаже ідеальний розмір спиць.",
                  },
                  {
                    title: "Складне стає простим:",
                    text: "Не знаєте, скільки набрати петель або як розподілити їх для ідеального реглану? Наші калькулятори зроблять усі необхідні розрахунки за вас.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <p>
                      <span className="font-semibold text-foreground">{item.title}</span>{" "}
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-text-4 flex flex-col gap-3 sm:flex-row">
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

          {/* --- YouTube Shorts video with lazy load --- */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="hero-video-container relative w-full max-w-[280px] sm:max-w-[300px]">
              <div className="hero-glow absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl shadow-xl bg-foreground/5 aspect-[9/16]">
                {!isPlaying ? (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="group relative block h-full w-full cursor-pointer border-0 bg-transparent p-0"
                    aria-label="Відтворити відео про додаток Розрахуй і В'яжи"
                  >
                    {/* Poster thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={POSTER_URL}
                      alt="Превью відео додатку Розрахуй і В'яжи"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-foreground/20 transition-colors duration-300 group-hover:bg-foreground/10" />
                    {/* YouTube play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        viewBox="0 0 68 48"
                        className="h-12 w-[68px] drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                        aria-hidden="true"
                      >
                        <path
                          d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
                          fill="#FF0000"
                        />
                        <path d="M45 24L27 14v20" fill="#fff" />
                      </svg>
                    </div>
                    {/* Label */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                        {"Дивитись демо додатку"}
                      </span>
                    </div>
                  </button>
                ) : (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                    title="Демо додатку Розрахуй і В'яжи"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
