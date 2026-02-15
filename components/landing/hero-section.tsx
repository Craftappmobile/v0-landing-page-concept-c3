import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
            @keyframes hero-image-reveal {
              from { opacity: 0; transform: scale(0.92); }
              to   { opacity: 1; transform: scale(1); }
            }
            @keyframes hero-ken-burns {
              0%   { transform: scale(1)    translate(0, 0); }
              50%  { transform: scale(1.06) translate(-1%, -1%); }
              100% { transform: scale(1)    translate(0, 0); }
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
            .hero-image-container {
              opacity: 0;
              animation: hero-image-reveal 1s ease-out 0.4s forwards;
            }
            .hero-image-animated {
              animation: hero-ken-burns 18s ease-in-out infinite;
            }
            .hero-glow {
              animation: hero-glow-pulse 4s ease-in-out infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-text-1,
              .hero-text-2,
              .hero-text-3,
              .hero-image-container {
                opacity: 1;
                animation: none;
              }
              .hero-image-animated,
              .hero-glow {
                animation: none;
              }
            }
          `,
        }}
      />

      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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

          {/* --- Image with fade-in + scale entrance + Ken Burns loop --- */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="hero-image-container relative w-full max-w-md">
              <div className="hero-glow absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="/images/hero-knitting.jpg"
                  alt="В'язання з додатком Розрахуй і В'яжи"
                  width={520}
                  height={580}
                  className="hero-image-animated block w-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
