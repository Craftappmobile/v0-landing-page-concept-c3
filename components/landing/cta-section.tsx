import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section id="subscribe" className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-background blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-background blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center lg:px-8">
        <h2 className="font-serif text-3xl tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl text-balance">
          {"Почніть в'язати розумніше вже сьогодні"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
          {"Приєднуйтесь до 1000+ майстринь, які вже довірили свої розрахунки додатку."}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 text-base"
            asChild
          >
            <Link href="#pricing">
              {"Хочу ідеальні вироби з першого разу"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-primary-foreground/60">
          {"Без зобов'язань. Скасуйте в будь-який момент."}
        </p>
      </div>
    </section>
  )
}
