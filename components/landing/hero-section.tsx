import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col gap-6">
            <h1 className="font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              {"В'яжіть із задоволенням, а складні розрахунки залиште нам!"}
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
              {"30 професійних калькуляторів, розумний облік пряжі, трекер проєктів та натхнення від тисяч в'язальниць — у вашій кишені."}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
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

          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
              <Image
                src="/images/hero-knitting.jpg"
                alt="В'язання з додатком Розрахуй і В'яжи"
                width={520}
                height={580}
                className="relative rounded-2xl object-cover shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
