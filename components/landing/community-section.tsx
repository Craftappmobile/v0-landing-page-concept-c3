import Image from "next/image"
import { Heart, MessageCircle, Hash } from "lucide-react"

export function CommunitySection() {
  return (
    <section id="community" className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
            <Image
              src="/images/community.jpg"
              alt="Спільнота в'язальниць"
              width={520}
              height={400}
              className="relative rounded-2xl object-cover shadow-xl"
            />
          </div>

          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              {"Спільнота"}
            </p>
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl text-balance">
              {"Не просто інструмент, а родина в'язальниць"}
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {"Публікуйте свої готові роботи, отримуйте підтримку, знаходьте натхнення за хештегами та діліться досвідом з тисячами майстринь з усього світу!"}
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Heart,
                  text: "Діліться роботами та отримуйте відгуки",
                },
                {
                  icon: Hash,
                  text: "Знаходьте натхнення за хештегами",
                },
                {
                  icon: MessageCircle,
                  text: "Спілкуйтеся з майстринями з усього світу",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
