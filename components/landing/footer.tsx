import Image from "next/image"
import Link from "next/link"
import { Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpg"
                alt="Розрахуй і В'яжи логотип"
                width={36}
                height={36}
                className="h-9 w-9 rounded-lg object-cover"
              />
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {"Розрахуй і В'яжи"}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {"Ваш персональний помічник та соціальна мережа для майстринь."}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{"Додаток"}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"Можливості"}
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"Підписка"}
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"FAQ"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{"Правова інформація"}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"Публічна оферта"}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"Політика конфіденційності"}
                </Link>
              </li>
              <li>
                <Link
                  href="/refund"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {"Умови повернення коштів"}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">{"Контакти"}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a
                  href="mailto:craftappmobile@gmail.com"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {"craftappmobile@gmail.com"}
                </a>
              </li>
            </ul>
            <div className="mt-4 border-t border-border pt-3">
              <p className="text-xs font-medium text-foreground">{"ФОП Дідух Роман Дмитрович"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{"ЄДРПОУ: 3993408236"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{"IBAN: UA22 305299 00000 26008046015269"}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {"© 2026 ФОП Дідух Роман Дмитрович. Розрахуй і В'яжи петля в петлю!"}
          </p>
        </div>
      </div>
    </footer>
  )
}
