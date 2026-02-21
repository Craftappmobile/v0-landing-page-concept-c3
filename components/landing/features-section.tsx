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
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            {"Можливості"}
          </p>
          <h2 className="mt-3 font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
            {"Все для ідеального виробу в одному місці"}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground max-w-xl mx-auto text-balance">
            {"Від точних розрахунків до обліку пряжі -- кожен інструмент створений для в'язальниць."}
          </p>
        </div>

        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {/* Main featured card */}
          <div className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-lg lg:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <features[0].icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{features[0].title}</h3>
              <p className="mt-0.5 text-sm font-medium text-primary">{features[0].subtitle}</p>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {features[0].description}
            </p>
          </div>

          {/* Three smaller cards in a row */}
          <div className="grid grid-cols-3 gap-4">
            {features.slice(1).map((feature, i) => (
              <div
                key={i}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:border-primary/30 hover:shadow-lg lg:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  )
}
