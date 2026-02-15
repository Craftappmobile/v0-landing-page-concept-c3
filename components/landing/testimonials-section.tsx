import Image from "next/image"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Оксана М.",
    role: "В'яже 5 років",
    avatar: "/images/avatar-1.jpg",
    text: "Нарешті я перестала витрачати вечори на перерахунки! Калькулятор реглану — це магія. Один раз ввела свої мірки, і все ідеально сіло.",
    stars: 5,
  },
  {
    name: "Тетяна К.",
    role: "Майстриня в'язання",
    avatar: "/images/avatar-2.jpg",
    text: "Облік пряжі — моя улюблена функція. Тепер я точно знаю, що лежить у кожній скриньці, і більше не купую зайве. Економлю і час, і гроші!",
    stars: 5,
  },
  {
    name: "Ірина Л.",
    role: "В'яже понад 20 років",
    avatar: "/images/avatar-3.jpg",
    text: "Я була скептично налаштована щодо додатків, але цей змінив моє в'язання. Спільнота дуже підтримує — показала свій перший светр і отримала стільки тепла!",
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
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
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
