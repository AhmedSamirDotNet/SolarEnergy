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
    <div dir={dir} className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Content Sections */}
      <div className="relative z-10">
        <HeroSection />
        <ServicesSection />
        <StatsSection />
        <TestimonialsSection />
        <FeaturedProjects />
      </div>
    </div>
  )
}
