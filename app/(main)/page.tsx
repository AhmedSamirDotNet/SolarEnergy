"use client"

import { HeroSection } from "@/components/home/hero-section"
import { ServicesSection } from "@/components/home/services-section"
import { StatsSection } from "@/components/home/stats-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { FeaturedProjects } from "@/components/home/featured-projects"
import { useI18n } from "@/lib/i18n-context"

export default function HomePage() {
  const { dir } = useI18n()

  return (
    <main dir={dir} className="bg-background w-full overflow-x-hidden">
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <FeaturedProjects />
    </main>
  )
}
