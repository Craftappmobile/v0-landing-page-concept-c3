import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Скасування автопродовження підписки — Розрахуй і В'яжи",
  description:
    "Форма скасування автопродовження підписки Розрахуй і В'яжи: вимкніть рекурентні платежі через сайт або зверніться до підтримки.",
  alternates: { canonical: "/cancel" },
}

export default function CancelLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
