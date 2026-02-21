import { Calculator, BarChart3, ImageIcon, Package } from "lucide-react"

const features = [
  {
    icon: Calculator,
    title: "30 калькуляторів",
    subtitle: "Від шапки до светра",
    description:
      "Точний розрахунок горловини, реглана, кокетки та витрати пряжі під вашу щільність. Просто введіть мірки — решту зробить додаток.",
  },
  {
    icon: BarChart3,
    title: "Трекер проєктів",
    subtitle: "Лічильник рядів",
    description:
      "В'язальний щоденник з нотатками, статусами та прив'язкою розрахунків з калькуляторів. Ніколи не загубите, де зупинилися.",
  },
  {
    icon: ImageIcon,
    title: "Галерея ідей",
    subtitle: "Натхнення завжди поруч",
    description:
      "Зберігайте схеми, відео з YouTube та ідеї з Pinterest в одному зручному місці. Ваша персональна бібліотека натхнення.",
  },
  {
    icon: Package,
    title: "Облік пряжі",
    subtitle: "Повний контроль запасів",
    description:
      "Знайте, що є у ваших скриньках. Повний контроль запасів із зазначенням кольорів, метражу та вартості.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
            {"Мінімум математики."}
            <br />
            {"Максимум в'язання."}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-xl mx-auto text-balance">
            {"Перший додаток, де є все для в'язання — від розрахунків до обліку пряжі!"}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg lg:p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="mt-0.5 text-sm font-medium text-primary">{feature.subtitle}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
