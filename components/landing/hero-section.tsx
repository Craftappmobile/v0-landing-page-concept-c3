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
              .hero-video-container {
                opacity: 1;
                animation: none;
              }
              .hero-glow {
                animation: none;
              }
            }
          `,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-8 lg:px-8 lg:pt-24 lg:pb-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
          {/* --- Text block with staggered fade-in --- */}
          <div className="flex flex-col gap-6">
            <h1 className="hero-text-1 font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              {"В'яжіть із задоволенням, а складні розрахунки залиште нам!"}
            </h1>

            <p className="hero-text-2 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {"30 професійних калькуляторів, розумний облік пряжі, трекер проєктів та натхнення від тисяч в'язальниць — у вашій кишені."}
            </p>

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
