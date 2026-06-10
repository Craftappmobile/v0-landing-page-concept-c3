/**
 * Головна лендінгова сторінка "Розрахуй і В'яжи".
 *
 * Структура сторінки (зверху донизу):
 * - Header         — навігація зі sticky-позиціонуванням
 * - HeroSection    — заголовок, ключові переваги, YouTube відео
 * - PainPointsSection — болі цільової аудиторії
 * - FeaturesSection   — огляд функцій додатку
 * - CommunitySection  — блок про спільноту
 * - TestimonialsSection — відгуки користувачів
 * - PricingSection    — тарифні плани з кнопками оплати
 * - FaqSection        — відповіді на часті запитання
 * - CtaSection        — фінальний заклик до дії
 * - Footer            — контактна інформація та посилання
 */
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { PainPointsSection } from "@/components/landing/pain-points-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { CommunitySection } from "@/components/landing/community-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FaqSection } from "@/components/landing/faq-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

/**
 * Серверний компонент головної сторінки (Next.js App Router).
 * Складається з секцій, імпортованих з `components/landing/`.
 */
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main>
        <HeroSection />
        <PainPointsSection />
        <FeaturesSection />
        <CommunitySection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
