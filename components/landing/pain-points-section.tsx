function YarnBall({ color, highlight }: { color: string; highlight: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="16" fill={color} />
      <circle cx="20" cy="20" r="16" fill="url(#yarn-shade)" fillOpacity="0.15" />
      {/* Yarn wrap lines */}
      <path
        d="M8 16C12 20 18 24 32 18"
        stroke={highlight}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M10 24C16 18 26 16 34 22"
        stroke={highlight}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      <path
        d="M14 8C16 16 18 28 22 34"
        stroke={highlight}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M26 6C24 14 22 26 20 36"
        stroke={highlight}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      {/* Yarn tail */}
      <path
        d="M32 10C34 8 36 6 38 7"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <defs>
        <radialGradient id="yarn-shade" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
      </defs>
    </svg>
  )
}

const painPoints = [
  {
    text: "Пряжа закінчилася за 10 рядів до кінця?",
    description: "Калькулятор витрати пряжі точно розрахує необхідну кількість ще до початку роботи.",
    color: "#D97060",
    highlight: "#F2ADA3",
  },
  {
    text: "Загубили папірець із розрахунками?",
    description: "Усі дані зберігаються у хмарі та доступні на будь-якому пристрої.",
    color: "#6AAB8E",
    highlight: "#A5D6BC",
  },
  {
    text: "Години йдуть на адаптацію чужого МК?",
    description: "30 калькуляторів миттєво перерахують під вашу щільність.",
    color: "#E8B54A",
    highlight: "#F5DDA0",
  },
  {
    text: "Забули, що лежить у ваших запасах?",
    description: "Розумний облік пряжі завжди покаже, що у вас є.",
    color: "#9B7DB8",
    highlight: "#C9B5DC",
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
              <div className="shrink-0">
                <YarnBall color={point.color} highlight={point.highlight} />
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
