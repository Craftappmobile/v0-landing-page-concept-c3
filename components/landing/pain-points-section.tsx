import { AlertTriangle } from "lucide-react"

const painPoints = [
  {
    text: "Пряжа закінчилася за 10 рядів до кінця?",
    description: "Калькулятор витрати пряжі точно розрахує необхідну кількість.",
  },
  {
    text: "Загубили папірець із розрахунками?",
    description: "Усі дані зберігаються у хмарі та доступні на будь-якому пристрої.",
  },
  {
    text: "Години йдуть на адаптацію чужого МК?",
    description: "30 калькуляторів миттєво перерахують під вашу щільність.",
  },
  {
    text: "Забули, що лежить у ваших запасах?",
    description: "Розумний облік пряжі завжди покаже, що у вас є.",
  },
]

export function PainPointsSection() {
  return (
    <section className="bg-secondary/50 pt-10 pb-16 lg:pt-12 lg:pb-20">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
            {"Знайомі ситуації?"}
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            {"Додаток вирішить ці проблеми раз і назавжди"}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-6">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="group flex gap-4 rounded-xl bg-card p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <AlertTriangle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{point.text}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
