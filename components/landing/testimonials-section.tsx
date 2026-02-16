import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Оксана Г.",
    role: "В'яже 5 років",
    avatar: "/images/avatar-oksana.png",
    profileUrl: "https://www.facebook.com/oksana.gruseckaa.180964",
    text: "Нарешті я перестала витрачати вечори на перерахунки! Калькулятор реглану — це магія. Один раз ввела свої мірки, і все ідеально сіло.",
    stars: 5,
  },
  {
    name: "Мар'яна Б.",
    role: "Майстриня в'язання",
    avatar: "/images/avatar-maryana.png",
    profileUrl: "https://www.facebook.com/maryana.boiko.2025",
    text: "Облік пряжі — моя улюблена функція. Тепер я точно знаю, що лежить у кожній скриньці, і більше не купую зайве. Економлю і час, і гроші!",
    stars: 5,
  },
  {
    name: "irynka_kaminska",
    role: "В'яже понад 20 років",
    avatar: "/images/avatar-3.jpg",
    text: "Дуже зручний і цікавий застосунок! \uD83D\uDD25 В'язати шкарпетки по одній стало набагато простіше. І не треба кожен раз згадувати скільки убавок і додавань було зроблено. Те ж саме і з рукавами - вийшли однаковими з першого разу \uD83D\uDE02 Дякую за такого чудового помічника \u2764\uFE0F",
    stars: 5,
  },
]

export function TestimonialsSection() {
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

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {`"${t.text}"`}
              </p>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  {t.profileUrl ? (
                    <Link
                      href={t.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-foreground underline-offset-2 hover:underline"
                    >
                      {t.name}
                    </Link>
                  ) : (
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
