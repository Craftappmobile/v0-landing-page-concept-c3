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
